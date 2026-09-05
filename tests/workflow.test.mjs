import {test} from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {fileURLToPath} from 'node:url';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const skill=path.join(root,'skills/astra-designer');
function temp(t){const p=fs.mkdtempSync(path.join(os.tmpdir(),'astra-test-'));t.after(()=>fs.rmSync(p,{recursive:true,force:true}));return p;}
function run(script,args=[],env={}){return spawnSync(process.execPath,[script,...args],{encoding:'utf8',env:{...process.env,...env}});}
test('portable install creates complete skill and refuses overwriting',t=>{const dir=temp(t);const script=path.join(root,'scripts/install.mjs');assert.equal(run(script,['--target',dir]).status,0);assert.ok(fs.existsSync(path.join(dir,'astra-designer/engine/astra-designer.js')));assert.ok(fs.existsSync(path.join(dir,'astra-designer/LICENSE')));assert.notEqual(run(script,['--target',dir]).status,0);});
test('starter includes its runtime and refuses overwriting',t=>{const dest=path.join(temp(t),'site');const script=path.join(skill,'scripts/new-site.mjs');assert.equal(run(script,[dest]).status,0);const before=fs.readFileSync(path.join(dest,'index.html'),'utf8');assert.ok(fs.existsSync(path.join(dest,'astra-designer.css')));assert.notEqual(run(script,[dest]).status,0);assert.equal(fs.readFileSync(path.join(dest,'index.html'),'utf8'),before);});
test('media adapter forwards literal arguments, waits, and propagates failure',t=>{const dir=temp(t),log=path.join(dir,'args.json');fs.writeFileSync(path.join(dir,'higgsfield'),`#!${process.execPath}\nrequire('fs').writeFileSync(process.env.TEST_LOG,JSON.stringify(process.argv.slice(2)));process.exit(7);\n`,{mode:0o755});const prompt='literal $(do-not-run) ; "test"';const r=run(path.join(skill,'scripts/media.mjs'),['generate','example-model','--prompt',prompt],{PATH:dir+path.delimiter+process.env.PATH,TEST_LOG:log});assert.equal(r.status,7);assert.deepEqual(JSON.parse(fs.readFileSync(log)),['generate','create','example-model','--prompt',prompt,'--wait']);});
test('deployment rejects secrets and forwards a clean site to provider helper',t=>{const dir=temp(t),site=path.join(dir,'site');fs.mkdirSync(site);fs.writeFileSync(path.join(site,'index.html'),'hello');const helper=path.join(dir,'publish.sh'),log=path.join(dir,'called');fs.writeFileSync(helper,'#!/bin/bash\nprintf "%s\\n" "$@" > "$TEST_LOG"\n');const env={ASTRA_DESIGNER_PUBLISH_SCRIPT:helper,TEST_LOG:log};fs.writeFileSync(path.join(site,'.env'),'private');assert.notEqual(run(path.join(skill,'scripts/deploy.mjs'),[site],env).status,0);assert.ok(!fs.existsSync(log));fs.unlinkSync(path.join(site,'.env'));assert.equal(run(path.join(skill,'scripts/deploy.mjs'),[site,'--slug','test-site'],env).status,0);assert.deepEqual(fs.readFileSync(log,'utf8').trim().split('\n'),[site,'--client','codex','--slug','test-site']);});
