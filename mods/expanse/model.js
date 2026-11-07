// Original, deliberately discrete training games. No real flight/network control.
export const BURNS = {N:[0,-1],E:[1,0],S:[0,1],W:[-1,0],COAST:[0,0]};
export const COURSES = [
  {name:'Clearance corridor',start:[1,3],target:[7,3],hazards:[[4,3]],fuel:10,ticks:18},
  {name:'Debris passage',start:[1,5],target:[7,1],hazards:[[3,3],[5,3]],fuel:12,ticks:20},
  {name:'Return vector',start:[7,5],target:[1,1],hazards:[[4,2],[4,3],[4,4]],fuel:12,ticks:22},
];
export function newFlight(course=0){const id=((course%COURSES.length)+COURSES.length)%COURSES.length,c=COURSES[id];return {course:id,x:c.start[0],y:c.start[1],vx:0,vy:0,fuel:c.fuel,ticks:0,status:'flying',history:[],hints:0,message:'Arrive at the target with zero velocity.'};}
function intersects(x,y,nx,ny,h){const dx=nx-x,dy=ny-y,d=dx*dx+dy*dy,t=d?Math.max(0,Math.min(1,((h[0]-x)*dx+(h[1]-y)*dy)/d)):0;return (x+t*dx-h[0])**2+(y+t*dy-h[1])**2<=0.48**2;}
export function flightStep(s,action,record=true){
 if(s.status!=='flying'||!BURNS[action])return s;
 const [ax,ay]=BURNS[action],cost=Math.abs(ax)+Math.abs(ay),vx=s.vx+ax,vy=s.vy+ay;
 if(cost>s.fuel||Math.abs(vx)>2||Math.abs(vy)>2)return s;
 const c=COURSES[s.course],x=s.x+vx,y=s.y+vy,ticks=s.ticks+1;
 let status='flying',message=cost?'Burn applied. Momentum persists.':'Coasting. No fuel used.';
 if(x<0||x>8||y<0||y>6||c.hazards.some(h=>intersects(s.x,s.y,x,y,h))){status='lost';message='Training run ended: boundary or swept debris collision.';}
 else if(x===c.target[0]&&y===c.target[1]&&vx===0&&vy===0){status='won';message='Rendezvous confirmed. Relative velocity zero.';}
 else if(ticks>=c.ticks||s.fuel===cost&&vx===0&&vy===0){status='lost';message='Training run ended: time or maneuver budget exhausted.';}
 const history=record?[...s.history,{...s,history:[]}]:[];
 return {...s,x,y,vx,vy,fuel:s.fuel-cost,ticks,status,message,history};
}
export function flightUndo(s){if(!s.history.length)return s;return {...s.history.at(-1),history:s.history.slice(0,-1),hints:s.hints,message:'Previous maneuver restored, including fuel and time.'};}
// Breadth-first shortest tick hint, bounded by the small game board.
export function solveFlight(s,maxNodes=140000){
 if(s.status==='won')return [];
 if(s.status!=='flying')return null;
 const queue=[{s:{...s,history:[]},path:[]}],best=new Map();let head=0;
 while(head<queue.length&&head<maxNodes){const {s:q,path}=queue[head++];for(const a of Object.keys(BURNS)){
  const n=flightStep(q,a,false);if(n===q||n.status==='lost')continue;
  const p=[...path,a];if(n.status==='won')return p;
  const key=[n.x,n.y,n.vx,n.vy,n.ticks].join(',');if((best.get(key)??-1)>=n.fuel)continue;best.set(key,n.fuel);queue.push({s:n,path:p});
 }}return null;
}
export const RELAY_PATH=[0,1,5,4,8,9,10,6,2,3,7,11,15,14,13,12];
const dir=(a,b)=>b===a+1?1:b===a-1?3:b===a+4?2:0;
export function relayPorts(index){const k=RELAY_PATH.indexOf(index);return [k===0?3:dir(index,RELAY_PATH[k-1]),k===15?3:dir(index,RELAY_PATH[k+1])];}
export function newRelay(seed=1){seed=Number.isSafeInteger(seed)&&seed>0?seed:1;let x=seed>>>0;const rotations=Array.from({length:16},()=>{x=(Math.imul(x,1664525)+1013904223)>>>0;return x>>>30;});if(rotations.every(r=>r===0))rotations[0]=1;const budget=rotations.reduce((n,r)=>n+(4-r)%4,0)+6;return {seed,rotations,budget,moves:0,pings:3,status:'routing',history:[],hints:0,message:'Connect TX → all 16 relays → RX. Click to rotate clockwise.'};}
export function ports(s,i){return relayPorts(i).map(d=>(d+s.rotations[i])%4);}
export function relayRotate(s,i){if(s.status!=='routing'||!Number.isInteger(i)||i<0||i>15||s.moves>=s.budget)return s;const rotations=[...s.rotations];rotations[i]=(rotations[i]+1)%4;return {...s,rotations,moves:s.moves+1,history:[...s.history,i],message:s.moves+1===s.budget?'Rotation budget spent. Transmit or undo.':'Relay rotated clockwise.'};}
export function relayUndo(s){if(s.status!=='routing'||!s.history.length)return s;const i=s.history.at(-1),rotations=[...s.rotations];rotations[i]=(rotations[i]+3)%4;return {...s,rotations,moves:s.moves-1,history:s.history.slice(0,-1),message:'Rotation undone. Transmit attempts are not refunded.'};}
export function traceRelay(s){let i=0,entry=3;const visited=[];for(let n=0;n<17;n++){
 if(visited.includes(i))return {ok:false,visited,reason:'Signal loop'};
 const ps=ports(s,i);if(!ps.includes(entry))return {ok:false,visited,reason:'Unaligned receiver at relay '+(i+1)};
 visited.push(i);const out=ps.find(d=>d!==entry);
 if(i===12&&out===3)return {ok:visited.length===16,visited,reason:visited.length===16?'All relays authenticated':'Incomplete authentication chain'};
 const nx=i%4+[0,1,0,-1][out],ny=Math.floor(i/4)+[-1,0,1,0][out];
 if(nx<0||nx>3||ny<0||ny>3)return {ok:false,visited,reason:'Beam escaped the routing grid'};
 i=ny*4+nx;entry=(out+2)%4;
 }return {ok:false,visited,reason:'Route exceeds hop limit'};
}
export function relayTransmit(s){if(s.status!=='routing')return s;const t=traceRelay(s),pings=s.pings-1;return {...s,pings,status:t.ok?'won':pings===0?'lost':'routing',message:t.ok?'Tight-beam training link established. All 16 relays authenticated.':t.reason+(pings?' · adjust and retry.':' · no transmit attempts left.')};}
export function relayHint(s){if(s.status!=='routing')return null;return s.rotations.findIndex((r,i)=>!relayPorts(i).every(d=>ports(s,i).includes(d)));}
export function scoreFlight(s){return s.status==='won'?s.ticks+(COURSES[s.course].fuel-s.fuel)*3+s.hints*5:null;}
export function scoreRelay(s){return s.status==='won'?s.moves+(3-s.pings-1)*5+s.hints*5:null;}
export function bestScore(previous,score){if(!Number.isFinite(score)||score<0)return previous??null;return Number.isFinite(previous)&&previous>=0?Math.min(previous,score):score;}
