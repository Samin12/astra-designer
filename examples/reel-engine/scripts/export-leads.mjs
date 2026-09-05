#!/usr/bin/env node
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
const destination=process.argv[2];
if(!destination) throw new Error('Pass a private output path, e.g. exports/leads.csv. Never commit the export.');
if(fs.existsSync(destination)) throw new Error('Output exists; choose a new path.');
const key=process.env.HERENOW_API_KEY || fs.readFileSync(path.join(os.homedir(),'.herenow/credentials'),'utf8').trim();
const rows=[];let cursor='';
do{const u=new URL('https://here.now/api/v1/publishes/open-yoga-hpnv/data/leads');u.searchParams.set('limit','50');if(cursor)u.searchParams.set('cursor',cursor);const response=await fetch(u,{headers:{Authorization:`Bearer ${key}`}});if(!response.ok)throw new Error(`Owner API failed (${response.status})`);const data=await response.json();rows.push(...data.records);cursor=data.nextCursor||'';}while(cursor);
const esc=v=>'"'+String(v??'').replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
const lines=[['email','consent','consent_version','interest','created_at'].map(esc).join(',')];
for(const record of rows){const d=record.data||record;lines.push([d.email,d.consent,d.consent_version,d.interest,record.created_at].map(esc).join(','));}
fs.mkdirSync(path.dirname(path.resolve(destination)),{recursive:true});fs.writeFileSync(destination,lines.join('\n')+'\n',{mode:0o600,flag:'wx'});console.log(`Exported ${rows.length} records to your private file.`);
