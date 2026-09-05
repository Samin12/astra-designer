#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
const [directory,...rest]=process.argv.slice(2);
if(!directory || directory==='--help'){console.log('node new-site.mjs NEW_OR_EMPTY_DIRECTORY');process.exit(directory?0:1);}
if(rest.length) throw new Error('Expected one destination directory.');
const dest=path.resolve(directory),skill=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
if(fs.existsSync(dest) && fs.readdirSync(dest).length) throw new Error('Destination must be absent or empty; existing work is preserved.');
fs.mkdirSync(dest,{recursive:true});
fs.copyFileSync(path.join(skill,'assets/starter.html'),path.join(dest,'index.html'));
for(const name of ['astra-designer.js','astra-designer.css']) fs.copyFileSync(path.join(skill,'engine',name),path.join(dest,name));
fs.copyFileSync(path.join(skill,'LICENSE'),path.join(dest,'LICENSE'));
console.log(`Astra Designer starter created: ${dest}`);
