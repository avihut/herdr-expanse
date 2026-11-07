import {spaces,agents,panes,layouts,shared,run,knownAgents,terminals} from 'herdr';
import {root,txt,button,v_flex,h_flex,colors,close,open,menu,get,put,section} from './kit.js';
import {paneRenameAvailable,openPaneRename} from './pane-rename.js';
export const REPLACED={main:'my-herdr',terminals:'my-terminals',win98:'win98-dark'};
const TITLES={main:'Herdr',terminals:'Terminals',win98:'Windows 98',winxp:'Windows XP','herdr-t3':'Herdr T3','main-folders':'Space Folders','herdr-sim':'Herdr Sim',cockpit:'Cockpit',traveler:'Traveler',lcars:'LCARS'};
export function layoutTitle(n){const b=Object.keys(REPLACED).find(b=>REPLACED[b]===n),base=n.replace(/^my-/,'');return TITLES[b]??TITLES[n]??TITLES[base]??base.split(/[-_ ]+/).filter(Boolean).map(s=>s[0].toUpperCase()+s.slice(1)).join(' ');}
export function listedLayouts(all){return [...new Set(all)].filter(n=>!(REPLACED[n]&&all.includes(REPLACED[n])));}
export class Menu {
 init(p,cx){this.p=p;this.at=0;this.handle=cx.focus_handle();this.handle.focus();this.rename=false;this.programs=[];this.loading=p.kind==='launch';
 if(p.kind==='pane'||p.tab==='pane')cx.spawn(async cx=>{this.rename=await paneRenameAvailable();cx.notify();});
 if(this.loading)cx.spawn(async cx=>{try{const s=spaces().find(s=>s.id===p.target?.space);this.programs=await knownAgents({on:s?.machine});}catch{this.failed=true;}this.loading=false;cx.notify();});
 }
 items(){const t=this.p.target??{},kind=this.p.kind??(this.p.tab==='pane'?'pane':'layouts');const rows=[],command=(label,name,args)=>rows.push([label,()=>run(name,args)]);
 if(kind==='layouts')for(const n of listedLayouts(layouts()))command((shared('layout')===n?'● ':'  ')+layoutTitle(n),'layout.switch',{name:n});
 if(kind==='space'&&spaces().some(s=>s.id===t.id)){command('Open sector','space.select',{id:t.id});command('Rename workspace…','space.rename',{id:t.id});command('New flight plan / tab','tab.new',{space:t.id});command('Close workspace…','space.close',{id:t.id});}
 if(kind==='tab'&&spaces().some(s=>s.tabs.some(tab=>tab.id===t.id))){command('Select flight plan','tab.select',{id:t.id});command('Rename tab…','tab.rename',{id:t.id});command('Close tab…','tab.close',{id:t.id});}
 if(kind==='agent'){const a=agents().find(a=>a.address===t.terminal);if(a){command('Focus '+a.address,'agent.focus',{terminal:a.address});command('Peek terminal','terminal.peek',{terminal:a.address});command(a.pinned?'Unpin crew station':'Pin crew station','terminal.pin',{terminal:a.address,pinned:!a.pinned});}}
 if(kind==='pane'){const p=panes().find(p=>p.pane===t.pane);if(p){if(this.rename)rows.push(['Rename pane…',()=>openPaneRename(p.pane)]);command('Focus this console','pane.focus',{pane:p.pane});command('Split right','pane.split',{pane:p.pane,direction:'right'});command('Split down','pane.split',{pane:p.pane,direction:'down'});command(p.zoomed?'Restore console':'Zoom console','pane.zoom',{pane:p.pane});if(p.terminal){command('Copy selection','terminal.copy',{terminal:p.terminal});command('Paste','terminal.paste',{terminal:p.terminal});const term=terminals().find(v=>v.address===p.terminal),to=term?.labels?.['herdr.right-click']==='program'?'menu':'program';command(to==='program'?'Send right-click to program':'Use Herdr right-click menu','terminal.right_click',{terminal:p.terminal,to});}command('Close this pane…','pane.close',{pane:p.pane});}}
 if(kind==='launch'){command('New terminal','tab.new',{space:t.space});for(const p of this.programs.filter(p=>p.installed))command('Start '+p.name,'tab.new',{space:t.space,argv:p.run});}
 return rows;
 }
 choose(i){const r=this.items()[i];if(r){close();r[1]();}}
 render(){const c=colors(),rows=this.items();this.at=Math.min(this.at,Math.max(0,rows.length-1));return root().h_auto().border(1).border_color(c.accent).p(6).gap(3).id('expanse-menu').track_focus(this.handle).on_key_down((e,cx)=>{if(e.key==='escape')close();else if(e.key==='enter')this.choose(this.at);else if(rows.length&&e.key==='down')this.at=(this.at+1)%rows.length;else if(rows.length&&e.key==='up')this.at=(this.at+rows.length-1)%rows.length;else return;cx.stop_propagation();cx.notify();}).child(txt('SYSTEM / '+(this.p.kind??'CONSOLE').toUpperCase(),10,c.amber).p(5)).child(v_flex().max_h(520).overflow_y_scrollbar().gap(2).children(rows.map(([label],i)=>button('menu-'+i,label,()=>this.choose(i),i===this.at).justify_start().on_hover((on,cx)=>{if(on){this.at=i;cx.notify();}})))).when(this.loading,e=>e.child(txt('Detecting installed agents…',11,c.muted))).when(this.failed,e=>e.child(txt('Agent discovery unavailable. Terminal launch remains available.',10,c.amber))).when(!rows.length&&!this.loading,e=>e.child(txt('Target is no longer available.',11,c.muted)));}
}
