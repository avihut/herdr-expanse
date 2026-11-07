import {cpSync,existsSync,lstatSync,mkdirSync,mkdtempSync,readdirSync,readFileSync,renameSync,rmSync,writeFileSync} from 'node:fs';
import {homedir} from 'node:os';
import {dirname,join,resolve,parse} from 'node:path';
import {fileURLToPath} from 'node:url';
import {randomUUID} from 'node:crypto';
import {nativeCheck,validateImports} from './check.js';
const source=resolve(dirname(fileURLToPath(import.meta.url)),'..');
export const targets=['mods/expanse','themes/expanse-dark.json','themes/expanse-light.json','layouts/expanse.svg','layouts/expanse.json'];
function stat(p){try{return lstatSync(p);}catch(e){if(e.code==='ENOENT')return null;throw e;}}
function ancestors(p){const abs=resolve(p),parts=abs.slice(parse(abs).root.length).split('/');let cursor=parse(abs).root;for(const name of parts){cursor=join(cursor,name);if(stat(cursor)?.isSymbolicLink())throw Error('Symlink refused: '+cursor);}}
function noLinks(p){const s=stat(p);if(!s)return;if(s.isSymbolicLink())throw Error('Symlink refused: '+p);if(s.isDirectory())for(const n of readdirSync(p))noLinks(join(p,n));else if(!s.isFile())throw Error('Non-regular file refused: '+p);}
function validate(root){for(const name of targets){const p=join(root,name);ancestors(p);noLinks(p);if(!existsSync(p))throw Error('Missing source: '+name);}if(JSON.parse(readFileSync(join(root,'mods/expanse/mod.json'))).place!=='none')throw Error('Manifest must have place:none');for(const n of targets.filter(n=>n.endsWith('.json')))JSON.parse(readFileSync(join(root,n)));validateImports(root);}
// Injection points are for isolated failure tests; CLI always uses native validation.
export function install({configDir=join(homedir(),'.config/herdr-app'),sourceDir=source,update=false,validator=nativeCheck,rename=renameSync}={}){
 validate(sourceDir);const root=resolve(configDir);ancestors(root);
 for(const n of [...targets,'backups/expanse']){ancestors(join(root,n));noLinks(join(root,n));}
 const existing=targets.filter(n=>existsSync(join(root,n)));
 if(existing.length&&!update)throw Error('Expanse already exists. Explicit --update required; existing files will be backed up.');
 mkdirSync(root,{recursive:true});const stage=mkdtempSync(join(root,'.expanse-stage-'));const backup=join(root,'backups/expanse',new Date().toISOString().replace(/[:.]/g,'-')+'-'+randomUUID().slice(0,8));
 const installed=[],moved=[];let preserve=false;
 try{
  // Stage outside watched mods. Preserve unowned files from this package's folder.
  const mod=join(stage,'mods/expanse');mkdirSync(mod,{recursive:true});
  writeFileSync(join(mod,'mod.json'),readFileSync(join(sourceDir,'mods/expanse/mod.json')));
  if(existing.includes('mods/expanse'))cpSync(join(root,'mods/expanse'),mod,{recursive:true});
  cpSync(join(sourceDir,'mods/expanse'),mod,{recursive:true});
  for(const n of targets.slice(1)){mkdirSync(dirname(join(stage,n)),{recursive:true});cpSync(join(sourceDir,n),join(stage,n));}
  validate(stage);validator(stage); // Complete installed transitive imports and native roles before exposure.
  mkdirSync(backup,{recursive:true});
  for(const n of targets){const dest=join(root,n);mkdirSync(dirname(dest),{recursive:true});
   if(existing.includes(n)){mkdirSync(dirname(join(backup,n)),{recursive:true});rename(dest,join(backup,n));moved.push(n);}
   rename(join(stage,n),dest);installed.push(n);
  }
 }catch(error){const failures=[];
  for(const n of [...new Set([...installed,...moved])].reverse())try{if(installed.includes(n))rmSync(join(root,n),{recursive:true,force:true});if(moved.includes(n))rename(join(backup,n),join(root,n));}catch(e){failures.push(n+': '+e.message);}
  if(failures.length){preserve=true;throw Error(error.message+'; ROLLBACK INCOMPLETE: '+failures.join('; ')+'; retain recovery files at '+backup+' and '+stage);}
  throw error;
 }finally{if(!preserve)rmSync(stage,{recursive:true,force:true});}
 return {configDir:root,backup:existing.length?backup:null};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const options={};try{const args=process.argv.slice(2);for(let i=0;i<args.length;i++){if(args[i]==='--update')options.update=true;else if(args[i]==='--config-dir'&&args[i+1])options.configDir=resolve(args[++i]);else throw Error('Unknown/incomplete argument: '+args[i]);}const result=install(options);console.log('Expanse installed. Active layout, appearance and global state unchanged.');if(result.backup)console.log('Own previous targets retained at '+result.backup);}catch(e){console.error(e.message);process.exitCode=1;}
}
