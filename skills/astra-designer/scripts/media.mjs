#!/usr/bin/env node
import {spawnSync} from 'node:child_process';
const [command,...args]=process.argv.slice(2);
const routes={status:['account','status'],models:['model','list','--json'],inspect:['model','get',...args,'--json'],generate:['generate','create',...args,'--wait']};
if(!command || command==='--help') { console.log('Astra Designer media: status | models | inspect MODEL | generate MODEL [Higgsfield flags]'); process.exit(0); }
if(!routes[command] || (['inspect','generate'].includes(command) && (!args[0] || args[0].startsWith('-')))) throw new Error('Choose a command and a model where required. Use --help.');
const result=spawnSync('higgsfield',routes[command],{stdio:'inherit',shell:false});
if(result.error){ console.error('Higgsfield CLI unavailable. Install from https://github.com/higgsfield-ai/cli and run higgsfield auth login.'); process.exit(1); }
process.exit(result.status ?? 1);
