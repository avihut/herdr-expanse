import {View} from 'gpui-kit';
import {props} from 'herdr';
import {Top,Sidebar,Tabs,Pane,Footer} from './chrome.js';
import {Menu} from './menu.js';
import {Help,Plans,Archive} from './archive.js';
import {Flight,Relay} from './games.js';
import {Inspect} from './inspect.js';
const ROLES={top:Top,sidebar:Sidebar,tabs:Tabs,pane:Pane,footer:Footer,menu:Menu,help:Help,plans:Plans,archive:Archive,flight:Flight,relay:Relay,inspect:Inspect};
export default class Expanse extends View {
 init(p,cx){const pr={...(props()??{}),...(p??{})};const role=pr.role??(pr.tab==='pane'?'menu':'help');this.role=new (ROLES[role]??Help)();this.role.init?.(pr,cx);}
 render(cx){return this.role.render(cx);}
}
