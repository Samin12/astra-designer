#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {spawnSync} from 'node:child_process';
const [dir,...args]=process.argv.slice(2);
if(!dir || dir==='--help'){console.log('node deploy.mjs PUBLIC_DIRECTORY [--slug EXISTING_SLUG] [--spa]');process.exit(dir?0:1);}
const root=path.resolve(dir);
if(!fs.existsSync(path.join(root,'index.html'))) throw new Error('Publish a built static directory containing index.html.');
for(let i=0;i<args.length;i++){
 if(args[i]==='--spa') continue;
 if(args[i]==='--slug' && args[i+1] && !args[i+1].startsWith('-')){i++;continue;}
 throw new Error('Only --slug VALUE and --spa are supported.');
}
function check(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){
 const p=path.join(dir,entry.name);
 if(entry.isSymbolicLink()) throw new Error(`Do not publish symlinks: ${p}`);
 if(entry.name.startsWith('.') || /^(node_modules|lab|raw)$/i.test(entry.name) || /^(BRIEF|FINGERPRINTS)\.md$/i.test(entry.name) || /\.(pem|key)$/i.test(entry.name)) throw new Error(`Remove private or development files from publish directory: ${p}`);
 if(entry.isDirectory()) check(p);
}}
check(root);
const homes=[path.join(process.env.CODEX_HOME || path.join(os.homedir(),'.codex'),'skills'),path.join(os.homedir(),'.agents','skills'),path.join(process.cwd(),'.agents','skills')];
const helper=[process.env.ASTRA_DESIGNER_PUBLISH_SCRIPT,...homes.map(p=>path.join(p,'here-now','scripts','publish.sh'))].filter(Boolean).find(p=>fs.existsSync(p));
if(!helper) throw new Error('Install the official hosting helper: npx skills add heredotnow/skill --skill here-now -g. Or set ASTRA_DESIGNER_PUBLISH_SCRIPT.');
const result=spawnSync('bash',[helper,root,'--client','codex',...args],{stdio:'inherit',shell:false});
if(result.error) throw result.error;
process.exit(result.status ?? 1);
