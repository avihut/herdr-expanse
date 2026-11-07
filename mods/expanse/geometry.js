// Original low-poly service cutter, not a screen-accurate proprietary ship mesh.
const sub=(a,b)=>a.map((v,i)=>v-b[i]);
const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
const norm=a=>{const l=Math.hypot(...a)||1;return a.map(v=>v/l);};
export function rotate(v,yaw,pitch){const [x,y,z]=v,c=Math.cos(yaw),s=Math.sin(yaw),a=x*c+z*s,b=-x*s+z*c;return [a,y*Math.cos(pitch)-b*Math.sin(pitch),y*Math.sin(pitch)+b*Math.cos(pitch)];}
function box(x,y,z,w,h,d,tag){const v=[[-w,-h,-d],[w,-h,-d],[w,h,-d],[-w,h,-d],[-w,-h,d],[w,-h,d],[w,h,d],[-w,h,d]].map(p=>[p[0]+x,p[1]+y,p[2]+z]);return [[0,3,2,1],[4,5,6,7],[0,1,5,4],[3,7,6,2],[0,4,7,3],[1,2,6,5]].map(f=>({v:f.map(i=>v[i]),tag}));}
export function shipMesh(){return [
 ...box(0,0,0,.64,1.75,.43,'hull'),...box(0,-1.85,0,.39,.35,.32,'command'),
 ...box(-.8,.3,0,.16,.85,.24,'port'),...box(.8,.3,0,.16,.85,.24,'starboard'),
 ...box(0,1.95,0,.48,.25,.39,'drive'),...box(0,2.3,0,.24,.1,.23,'nozzle'),
 ...box(0,-.55,-.56,.27,.45,.16,'airlock'),...box(0,.65,.55,.22,.4,.14,'cargo')];}
export function projectMesh({yaw=.65,pitch=-.32,width=420,height=270,zoom=1,selected='hull'}={}){
 const light=norm([-.5,-.7,-1]);return shipMesh().map(({v,tag})=>{
 const rv=v.map(p=>rotate(p,yaw,pitch)),normal=norm(cross(sub(rv[1],rv[0]),sub(rv[2],rv[0]))),shade=.25+.75*Math.max(0,normal.reduce((n,t,i)=>n+t*light[i],0));
 return {tag,shade,selected:tag===selected,depth:rv.reduce((n,p)=>n+p[2],0)/rv.length,points:rv.map(([x,y,z])=>{const f=6/(6+z),scale=Math.min(width/5.6,height/5.6)*zoom;return [width/2+x*f*scale,height/2+y*f*scale];})};
 }).sort((a,b)=>b.depth-a.depth);
}
export const COMPONENTS={hull:'Hull · original compact vertical-deck cutter study.',command:'Command · use COMMAND for workspaces and flight plans.',port:'Port service pod · model inspection only.',starboard:'Starboard service pod · model inspection only.',drive:'Drive · fictional geometry, no measured thrust.',nozzle:'Drive bell · rotate to inspect the aft face.',airlock:'Airlock · passage geometry, not a live door control.',cargo:'Cargo · original maintenance access volume.'};
