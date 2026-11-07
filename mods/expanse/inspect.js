import {projectMesh,COMPONENTS} from './geometry.js';
import {div,h_flex,v_flex,txt,colors,shell,button,polygon,line,award} from './kit.js';
export class Inspect {
 init(){this.yaw=.65;this.pitch=-.32;this.zoom=1;this.selected='hull';this.views=0;}
 turn(y,p){this.yaw+=y;this.pitch=Math.max(-1.35,Math.min(1.35,this.pitch+p));if(++this.views===4)award('Walkaround');}
 render(){const c=colors(),w=450,h=285,mesh=projectMesh({yaw:this.yaw,pitch:this.pitch,width:w,height:h,zoom:this.zoom,selected:this.selected});
 const view=div().relative().w(w).h(h).flex_none().bg('#09131e').border(1).border_color(c.edge).children(Array.from({length:10},(_,i)=>line([[i*50,0],[i*50,h]],'#183343'))).children(Array.from({length:6},(_,i)=>line([[0,i*50],[w,i*50]],'#183343'))).children(mesh.flatMap(f=>{const base=f.selected?[125,213,227]:[90,116,131],color='#'+base.map(v=>Math.round(v*f.shade).toString(16).padStart(2,'0')).join('');return [polygon(f.points,color),line([...f.points,f.points[0]],f.selected?'#edc476':'#45687a',.7)];})).child(txt('3D / SERVICE CUTTER / ORIGINAL STUDY',9,'#90bfca').absolute().left(10).top(10));
 return shell('ENGINEERING / SPATIAL INSPECTION',v_flex().gap(8).overflow_y_scrollbar().child(txt('INTERACTIVE 3D STUDY · no live spacecraft readings',11,c.amber)).child(div().w_full().h(h).flex_none().min_w(0).overflow_x_scrollbar().child(view)).child(h_flex().gap(5).child(button('yaw-left','YAW −',()=>this.turn(-.3,0))).child(button('yaw-right','YAW +',()=>this.turn(.3,0))).child(button('pitch-up','PITCH +',()=>this.turn(0,.2))).child(button('pitch-down','PITCH −',()=>this.turn(0,-.2))).child(button('zoom','ZOOM',()=>{this.zoom=this.zoom===1?1.18:1;})).child(button('view-reset','RESET',()=>this.init())))
 .child(h_flex().gap(3).flex_wrap().children(Object.keys(COMPONENTS).map(n=>button('part-'+n,n.toUpperCase(),()=>{this.selected=n;},this.selected===n))))
 .child(txt(COMPONENTS[this.selected],12)).child(txt('48 spatial faces. User-controlled yaw and pitch transform XYZ vertices; perspective division, face lighting and back-to-front sorting produce the native GPUI paths. This is projected 3D, not a host 3D engine. No continuous redraw loop. Try a complete walkaround.',11,c.muted)));
 }
}
