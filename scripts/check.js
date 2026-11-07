import {cpSync,mkdtempSync,readFileSync,rmSync,writeFileSync,readdirSync,existsSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname,join,resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {spawnSync} from 'node:child_process';
const source=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export function validateImports(root){
 const walk=dir=>readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(join(dir,e.name)):e.name.endsWith('.js')?[join(dir,e.name)]:[]);
 for(const f of walk(join(root,'mods/expanse'))){const content=readFileSync(f,'utf8');for(const match of content.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+)['"]/g)){const target=resolve(dirname(f),match[1]);if(!target.startsWith(resolve(root,'mods/expanse')+'/')||!existsSync(target))throw Error('Missing or escaping local import in '+f+': '+match[1]);}const r=spawnSync(process.execPath,['--check',f],{encoding:'utf8'});if(r.status!==0)throw Error(r.stderr);}
}
export function nativeCheck(root=source,{full=true}={}){
 validateImports(root);const temp=mkdtempSync(join(tmpdir(),'herdr-expanse-check-'));
 const check=label=>{const r=spawnSync('herdr-app',['check',temp],{encoding:'utf8',timeout:20000});if(r.error||r.status!==0)throw Error(label+': '+(r.error?.message??r.stderr??r.stdout));if(/out of memory|\bNull\b/i.test(r.stderr+r.stdout))throw Error('Stop native checks: '+r.stderr+r.stdout);console.log(label+': '+r.stdout.trim());};
 try{cpSync(join(root,'mods/expanse'),temp,{recursive:true});check('real entry / transitive imports');if(!full)return;
 // Isolated fixture imports; no fixture file ships in the runtime mod.
 for(const name of readdirSync(temp).filter(n=>n.endsWith('.js'))){const p=join(temp,name);writeFileSync(p,readFileSync(p,'utf8').replace(/from ['"]herdr['"]/g,"from './fixture.js'"));}
 writeFileSync(join(temp,'app.js'),readFileSync(join(temp,'main.js')));
 const fixtures=[];
 for(const dark of [true,false]){for(const role of ['top','tabs','pane','footer','menu','help','plans','archive','flight','relay','inspect'])fixtures.push({dark,role});for(const room of ['COMMAND','TACTICAL','ENGINEERING','CREW','GALLEY'])for(const empty of [true,false])fixtures.push({dark,role:'sidebar',room,empty});for(const kind of ['pane','space','tab','agent','launch'])fixtures.push({dark,role:'menu',kind});for(const entry of ['names','sample','patches'])fixtures.push({dark,role:'archive',entry});for(const role of ['flight','relay'])for(const outcome of ['won','lost'])fixtures.push({dark,role,outcome});}
 fixtures.push({dark:true,role:'top',width:500},{dark:false,role:'top',width:500});
 for(const f of fixtures){const fixture=`const f=${JSON.stringify(f)};const program={name:'Crew program',key:'test',agent:true};const aa=['working','blocked','done','idle'].map((status,i)=>({address:'demo'+i,pane:'p'+i,title:'Demonstration station — long name for readable truncation '+i,status,space:'s1',space_name:'Training sector',tab:'tab1',program,focused:i===0,pinned:false}));const ss=[{id:'s1',name:'Synthetic sector with a deliberately long workspace name',active:true,machine:null,tabs:[{id:'tab1',name:'Synthetic flight plan',index:1,active:true,panes:4}]}];const state={'expanse.v1.room':f.room??'COMMAND',layout:'expanse'};export const props=()=>({});export const settings=()=>({dark:f.dark,zoom:1});export const theme=()=>({});export const spaces=()=>f.empty?[]:ss;export const agents=()=>f.empty?[]:aa;export const panes=()=>aa.map(a=>({...a,terminal:a.address,tab:'tab1',zoomed:false}));export const machines=()=>[{name:null,layout:'ready'},{name:'Demo remote',layout:'unavailable'}];export const focused=()=>({space:'s1',tab:'tab1',pane:'p0'});export const shared=k=>state[k];export const setShared=(k,v)=>state[k]=v;export const run=()=>{};export const layouts=()=>['main','my-herdr','terminals','my-terminals','win98','win98-dark','winxp','expanse'];export const setAgentOrder=()=>{};export const window=()=>({platform:'linux',buttons:true});export const exec=async()=>({code:1,stdout:''});export const openOverlay=()=>'';export const closeOverlay=()=>{};export const playSound=()=>{};export const appHome=()=>'/nonexistent-expanse-fixture';export const readTextFile=async()=>null;export const knownAgents=async()=>[];export const terminals=()=>[];`;
 writeFileSync(join(temp,'fixture.js'),fixture);
 writeFileSync(join(temp,'main.js'),`import App from './app.js';export default class Check extends App {init(p,cx){super.init({...p,role:${JSON.stringify(f.role)},kind:${JSON.stringify(f.kind??'layouts')},entry:${JSON.stringify(f.entry??'coffee')},pane:'p0',target:{pane:'p0',terminal:'demo0',id:${JSON.stringify(f.kind==='space'?'s1':'tab1')},space:'s1'}},cx);${f.width?`this.role.width=${f.width};`:''}${f.outcome?`this.role.state.status=${JSON.stringify(f.outcome)};`:''}${f.role==='footer'?`this.role.net={label:'LINK UP',detail:'synthetic fixture'};this.role.battery={label:'73% CHARGING',detail:'synthetic fixture'};`:''}${f.role==='menu'&&f.kind==='pane'?'this.role.rename=true;':''}}}`);
 check(JSON.stringify(f));
 }
 }finally{rmSync(temp,{recursive:true,force:true});}
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url))nativeCheck(source);
