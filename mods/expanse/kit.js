import {div,svg,PathBuilder} from 'gpui-kit';
import {h_flex,v_flex} from 'gpui-base';
import {theme,settings,shared,setShared,openOverlay,closeOverlay,props,playSound} from 'herdr';
export {div,svg,h_flex,v_flex,PathBuilder};
export const NS='expanse.v1.';
export const get=(k,f)=>shared(NS+k)??f;
export const put=(k,v)=>setShared(NS+k,v);
export function colors(){const t=theme(),dark=settings().dark!==false,p=get('palette','roci');return {...t,dark,ink:dark?'#cce4e7':'#173b44',muted:dark?'#91b0b7':'#446771',well:dark?'#0a151e':'#e6eff0',panel:dark?'#14232c':'#cedfe1',edge:dark?'#315663':'#7297a0',accent:p==='belt'?(dark?'#edc476':'#775014'):p==='unn'?(dark?'#87bfff':'#245991'):(dark?'#75d7e7':'#006878'),strip:dark?'#5a2939':'#863e50',stripText:'#fff0f0',amber:dark?'#edc476':'#79510a',red:dark?'#fa8a86':'#a32935',green:dark?'#a3d4b4':'#256346'};}
export function txt(text,size=12,color){return div().text_size(size).text_color(color??colors().ink).child(String(text));}
export function root(){const c=colors();return v_flex().size_full().min_w(0).font_family('Geist Mono').text_size(12).text_color(c.ink).bg(c.well);}
export function button(id,label,action,active=false){const c=colors();return h_flex().id(id).flex_none().h(28).px(9).gap(5).items_center().justify_center().border_b(2).border_color(active?c.amber:c.edge).bg(active?c.panel:c.well).text_color(active?c.amber:c.ink).text_size(11).whitespace_nowrap().overflow_hidden().cursor_pointer().hover(s=>s.bg(c.panel).text_color(c.accent)).on_mouse_down('left',(_e,cx)=>cx.stop_propagation()).on_click((e,cx)=>{cx.stop_propagation();action?.(e,cx);cx.notify();}).child(label);}
export function label(s){const c=colors();return h_flex().w_full().flex_none().h(23).px(7).bg(c.strip).child(txt(s,10,c.stripText).my(4));}
export function section(s){const c=colors();return h_flex().w_full().flex_none().items_center().gap(5).py(6).child(div().w(5).h(12).bg(c.accent)).child(txt(s,10,c.accent)).child(div().flex_1().h(1).bg(c.edge));}
export function status(s){const c=colors();let e=div().w(5).h(12).bg(s==='blocked'?c.amber:s==='done'?c.green:s==='working'?c.accent:c.muted);return s==='working'&&!get('reduced',false)?e.loop('opacity',{from:.4,to:1,period:2200}):e;}
export function row(id,title,detail,action,active=false,state){const c=colors();return h_flex().id(id).w_full().flex_none().gap(8).p(8).border_l(2).border_color(active?c.amber:c.edge).bg(active?c.panel:c.well).cursor_pointer().hover(s=>s.bg(c.panel)).on_click((e,cx)=>{cx.stop_propagation();action?.(e,cx);cx.notify();}).child(status(state)).child(v_flex().flex_1().min_w(0).gap(4).child(txt(title,12).truncate().tooltip(String(title))).child(txt(detail,10,c.muted).truncate().tooltip(String(detail))));}
export function open(role,extra={}){const z=Number(settings().zoom)||1,v=window.viewport_size();return openOverlay({mod:'expanse',kind:'dialog',frame:'none',width:Math.min(760*z,v.width*.94),height:Math.min(700*z,v.height*.92),props:{role,...extra}});}
export function menu(kind,target={}){return openOverlay({mod:'expanse',kind:'popup',frame:'none',width:300*(Number(settings().zoom)||1),props:{role:'menu',kind,target}});}
export function close(){if(props()?.overlay)closeOverlay(props().overlay);}
export function shell(title,body){const c=colors();return root().border(1).border_color(c.accent).p(12).gap(10).child(h_flex().flex_none().gap(8).items_center().child(txt(title,15,c.accent).flex_1()).child(button('exit','CLOSE ×',close))).child(div().h(3).bg(c.strip).flex_none()).child(body.flex_1().min_h(0).min_w(0).w_full());}
export function award(name){const found=get('discoveries',[]);if(!found.includes(name)){put('discoveries',[...found,name]);if(get('sound',false))playSound('mods/expanse/assets/ack.mp3');}}
export function line(points,color,width=1){return window.paint_path(PathBuilder.stroke(width).add_polygon(points,false).build(),color).absolute().inset_0();}
export function polygon(points,color){return window.paint_path(PathBuilder.fill().add_polygon(points,true).build(),color).absolute().inset_0();}
