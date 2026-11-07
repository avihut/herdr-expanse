import {newFlight,flightStep,flightUndo,solveFlight,COURSES,newRelay,relayRotate,relayUndo,relayTransmit,relayHint,ports,traceRelay,scoreFlight,scoreRelay,bestScore} from './model.js';
import {root,txt,button,h_flex,v_flex,div,colors,shell,section,get,put,award,line} from './kit.js';
function saveBest(key,value){put('best.'+key,bestScore(get('best.'+key,null),value));}
export class Flight {
 init(p,cx){this.state=newFlight(p.course??0);this.handle=cx.focus_handle();this.handle.focus();this.saved=false;}
 move(a){this.state=flightStep(this.state,a);if(this.state.status==='won'&&!this.saved){this.saved=true;saveBest('flight.'+this.state.course,scoreFlight(this.state));award('Flight qualified');}}
 reset(course=this.state.course){this.state=newFlight(course);this.saved=false;}
 render(){const s=this.state,c=colors(),course=COURSES[s.course],cell=35;
 const board=div().relative().w(9*cell).h(7*cell).flex_none().border(1).border_color(c.edge).children(Array.from({length:63},(_,i)=>{const x=i%9,y=Math.floor(i/9),hazard=course.hazards.some(p=>p[0]===x&&p[1]===y),target=course.target[0]===x&&course.target[1]===y,ship=s.x===x&&s.y===y;return div().absolute().left(x*cell).top(y*cell).w(cell).h(cell).border(1).border_color(c.edge).bg(hazard?c.strip:target?c.panel:c.well).child(txt(ship?'◆':hazard?'×':target?'◎':'·',18,ship?c.accent:hazard?c.stripText:c.muted).text_center().pt(6));}));
 const body=v_flex().id('flight-controls').track_focus(this.handle).gap(9).overflow_y_scrollbar().on_key_down((e,cx)=>{const a={up:'N',right:'E',down:'S',left:'W',w:'N',d:'E',s:'S',a:'W',space:'COAST',' ':'COAST'}[e.key];if(a)this.move(a);else if(e.key==='u')this.state=flightUndo(s);else return;cx.stop_propagation();cx.notify();})
 .child(txt('TRAINING SIMULATION · discrete inertial rendezvous',11,c.amber))
 .child(h_flex().gap(5).children(COURSES.map((v,i)=>button('course-'+i,String(i+1)+' '+v.name,()=>this.reset(i),s.course===i))))
 .child(txt('Burn changes velocity by one, then position advances by that velocity. Coast costs no fuel. Speed cap: ±2 per axis. Reach ◎ at velocity (0,0). Avoid × and the boundary; the entire path is collision-tested.',11,c.muted))
 .child(h_flex().w_full().h(7*cell).flex_none().min_w(0).overflow_x_scrollbar().gap(16).child(board).child(v_flex().gap(8).child(txt('FLIGHT VECTOR',11,c.accent)).child(txt('POSITION '+s.x+', '+s.y,13)).child(txt('VELOCITY '+s.vx+', '+s.vy,13)).child(txt('BURNS LEFT '+s.fuel,13,c.amber)).child(txt('TICKS '+s.ticks+' / '+course.ticks,13)).child(txt('BEST '+(get('best.flight.'+s.course,null)??'—'),12)).child(txt('Lower score is better:\nticks + 3×burns + 5×hints.',10,c.muted))))
 .child(txt(s.message,13,s.status==='lost'?c.red:s.status==='won'?c.green:c.ink))
 .child(h_flex().gap(6).children([['N','↑ BURN'],['W','← BURN'],['COAST','COAST'],['E','BURN →'],['S','BURN ↓']].map(([a,t])=>button('burn-'+a,t,()=>this.move(a)))))
 .child(h_flex().gap(6).child(button('undo','UNDO (U)',()=>{this.state=flightUndo(s);})).child(button('hint','FLIGHT HINT',()=>{if(s.status!=='flying')return;const p=solveFlight(s);this.state={...s,hints:s.hints+1,message:p?.length?'Recommended next maneuver: '+p[0]:'No solution within the remaining budgets. Undo or restart.'};})).child(button('restart','RESTART',()=>this.reset())))
 .child(txt('Arrow keys / WASD: burn · Space: coast · U: undo. Undo restores one tick and its fuel. No real orbital gravity, thrust telemetry or spacecraft control.',10,c.muted));
 return shell('NAVIGATION / FLIP & BURN',body);
 }
}
export class Relay {
 init(p,cx){this.state=newRelay(p.seed??1);this.selected=0;this.handle=cx.focus_handle();this.handle.focus();this.saved=false;this.hint=-1;}
 reset(seed=this.state.seed){this.state=newRelay(seed);this.saved=false;this.hint=-1;}
 transmit(){this.state=relayTransmit(this.state);if(this.state.status==='won'&&!this.saved){this.saved=true;saveBest('relay.'+this.state.seed,scoreRelay(this.state));award('Tight beam');}}
 render(){const s=this.state,c=colors(),trace=traceRelay(s),cell=53;
 const grid=v_flex().gap(3).children(Array.from({length:4},(_,y)=>h_flex().gap(3).children(Array.from({length:4},(_,x)=>{const i=y*4+x,ps=ports(s,i),color=trace.visited.includes(i)?c.accent:c.muted;return div().id('relay-'+i).relative().size(cell).bg(c.panel).border(i===this.selected?2:1).border_color(i===this.hint?c.amber:i===this.selected?c.accent:c.edge).cursor_pointer().on_click((_e,cx)=>{this.selected=i;this.state=relayRotate(s,i);cx.notify();}).children(ps.map(d=>line([[cell/2,cell/2],[[cell/2,2],[cell-2,cell/2],[cell/2,cell-2],[2,cell/2]][d]],color,3))).child(txt(i===0?'TX':i===12?'RX':String(i+1).padStart(2,'0'),9,c.amber).absolute().left(3).top(2));}))));
 return shell('COMMUNICATIONS / TIGHT-BEAM RELAY',v_flex().id('relay-controls').track_focus(this.handle).gap(10).overflow_y_scrollbar().on_key_down((e,cx)=>{const dx={left:-1,right:1}[e.key],dy={up:-4,down:4}[e.key];if(dx||dy)this.selected=(this.selected+(dx??dy)+16)%16;else if(e.key==='enter'||e.key==='space')this.state=relayRotate(s,this.selected);else if(e.key==='t')this.transmit();else return;cx.stop_propagation();cx.notify();})
 .child(txt('TRAINING SIMULATION · seed '+s.seed,11,c.amber)).child(txt('Rotate relays clockwise to join the left TX port (01) to the left RX port (13), visiting all 16 cells exactly once. Pipes must meet. Each click costs one rotation. You have three transmit attempts; failed transmissions consume one.',11,c.muted))
 .child(h_flex().w_full().h(4*cell+9).flex_none().min_w(0).overflow_x_scrollbar().gap(24).child(grid).child(v_flex().gap(12).child(txt('ROTATIONS '+s.moves+' / '+s.budget,13)).child(txt('TRANSMITS '+s.pings,13,c.amber)).child(txt('LIVE TRACE '+trace.visited.length+' / 16',12)).child(txt('BEST '+(get('best.relay.'+s.seed,null)??'—'),12)).child(txt('Score: rotations +\n5×failed transmits + 5×hints.\nLower is better.',11,c.muted))))
 .child(txt(s.message,13,s.status==='won'?c.green:s.status==='lost'?c.red:c.ink))
 .child(h_flex().gap(6).child(button('transmit','TRANSMIT (T)',()=>this.transmit())).child(button('undo-relay','UNDO',()=>{this.state=relayUndo(s);})).child(button('relay-hint','ALIGNMENT HINT',()=>{this.hint=relayHint(s);if(this.hint!==null)this.state={...s,hints:s.hints+1,message:this.hint>=0?'Amber relay '+(this.hint+1)+' needs rotation.':'All relays aligned. Transmit now.'};})))
 .child(h_flex().gap(6).child(button('relay-reset','RESTART SEED',()=>this.reset())).child(button('relay-next','NEXT SEED',()=>this.reset(s.seed%999+1))))
 .child(txt('Arrows select a cell · Enter / Space rotates · T transmits. Undo refunds rotations, never failed transmissions. Seeds 1–999 are deterministic; reset restores the same puzzle. No external packets are sent.',10,c.muted)));
 }
}
