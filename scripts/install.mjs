#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import {fileURLToPath} from 'node:url';
const args=process.argv.slice(2);
if(args.includes('--help')) { console.log('node scripts/install.mjs [--target SKILLS_DIRECTORY]'); process.exit(0); }
if(args.length && (args.length!==2 || args[0]!=='--target')) throw new Error('Use --target SKILLS_DIRECTORY');
const base=args[1] || path.join(process.env.CODEX_HOME || path.join(os.homedir(),'.codex'),'skills');
const destination=path.resolve(base,'astra-designer');
if(fs.existsSync(destination)) throw new Error(`Installation already exists: ${destination}. Back it up or choose another target.`);
const source=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../skills/astra-designer');
fs.mkdirSync(path.dirname(destination),{recursive:true});
fs.cpSync(source,destination,{recursive:true,errorOnExist:true,force:false});
console.log(`Installed Astra Designer: ${destination}\nStart a new agent session to discover the skill.`);
