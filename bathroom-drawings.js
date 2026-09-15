import {room,fixtures,shaft,toilet,door,lights,power} from './bathroom-data.js?v=2';
const n=x=>Math.round(x*1000),X=x=>230+x*180,Y=z=>115+z*180;
const text=(x,y,t,c='label',anchor='middle')=>`<text x="${x}" y="${y}" class="${c}" text-anchor="${anchor}">${t}</text>`;
const line=(x1,y1,x2,y2,c='fine')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" class="${c}"/>`;
function rect(x,z,w,d,c){return `<rect x="${X(x)}" y="${Y(z)}" width="${w*180}" height="${d*180}" class="${c}"/>`;}
function dimX(a,b,z,label){const y=Y(z);return line(X(a),y-5,X(a),y+5)+line(X(b),y-5,X(b),y+5)+line(X(a),y,X(b),y)+text((X(a)+X(b))/2,y-8,label,'dim');}
function dimY(a,b,x,label){const xx=X(x);return line(xx-5,Y(a),xx+5,Y(a))+line(xx-5,Y(b),xx+5,Y(b))+line(xx,Y(a),xx,Y(b))+`<text x="${xx-9}" y="${(Y(a)+Y(b))/2}" class="dim" text-anchor="middle" transform="rotate(-90 ${xx-9} ${(Y(a)+Y(b))/2})">${label}</text>`;}
const defs=`<defs><pattern id="hatch" width="8" height="8" patternUnits="userSpaceOnUse"><path d="M-2 2L2-2M0 8L8 0M6 10L10 6" stroke="#9b9d99" stroke-width="1"/></pattern><pattern id="timber" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#ceb08b"/><path d="M2 0v12M8 0v12" stroke="#a88c6a" stroke-width=".6"/></pattern></defs>`;
function planBase(){let s=rect(0,0,room.width,room.depth,'floor');
 for(let x=.6;x<room.width;x+=.6)s+=line(X(x),Y(0),X(x),Y(room.depth),'tile');for(let z=.6;z<room.depth;z+=.6)s+=line(X(0),Y(z),X(room.width),Y(z),'tile');
 s+=rect(-.1,-.1,3.17,.1,'wall')+rect(2.97,0,.1,2.38,'wall')+rect(-.1,2.28,3.07,.1,'wall')+rect(-.1,0,.1,door.z,'wall')+rect(-.1,door.hingeZ,.1,2.28-door.hingeZ,'wall');
 s+=rect(shaft.x-shaft.w/2,0,shaft.w,shaft.d,'shaft');
 const cab=fixtures.find(f=>f.id==='cabinet'),v=fixtures.find(f=>f.id==='vanity');
 s+=rect(0,0,cab.w,cab.d,'cabinet');for(let x=cab.w/3;x<cab.w;x+=cab.w/3)s+=line(X(x),Y(0),X(x),Y(.7),'cabinet-line');
 s+=rect(0,1.78,v.w,.5,'vanity')+`<rect x="${X(.10)}" y="${Y(1.86)}" width="${.65*180}" height="${.33*180}" rx="18" class="ceramic"/>`;
 const installation=fixtures.find(f=>f.id==='installation');s+=rect(installation.x-installation.w/2,installation.z-installation.d/2,installation.w,installation.d,'installation')+`<rect x="${X(toilet.x-.185)}" y="${Y(toilet.z-.27)}" width="66.6" height="97.2" rx="26" class="ceramic"/>`;
 s+=rect(1.87,.503,1.1,1.577,'shower')+line(X(1.89),Y(.503),X(1.89),Y(1.303),'glass')+line(X(2.1),Y(1.99),X(2.83),Y(1.99),'fixture');
 s+=`<circle cx="${X(2.61)}" cy="${Y(1.30)}" r="19" class="shower-head"/>`+line(X(2.61),Y(1.30),X(2.94),Y(1.30),'fixture');
 s+=line(X(0),Y(door.hingeZ),X(-.8),Y(door.hingeZ),'fixture')+`<path d="M${X(0)} ${Y(door.z)} A144 144 0 0 0 ${X(-.8)} ${Y(door.hingeZ)}" class="door-arc"/>`;
 s+=rect(-.94,1.83,.8,.45,'bench');
 return s;}
function bubble(x,z,t,color='ink'){return `<g class="bubble ${color}"><circle cx="${X(x)}" cy="${Y(z)}" r="13"/>${text(X(x),Y(z)+4,t,'bubble-text')}</g>`;}
function point(p,kind){const x=X(p.x),y=Y(p.z);let s=kind==='light'?`<circle cx="${x}" cy="${y}" r="8" class="lamp"/>${line(x-5,y-5,x+5,y+5,'lighting')}${line(x-5,y+5,x+5,y-5,'lighting')}`:`<rect x="${x-7}" y="${y-7}" width="14" height="14" rx="2" class="socket"/>`;
 s+=`<rect x="${x+11}" y="${y-24}" width="25" height="17" fill="#ffffffed" rx="2"/>`+text(x+14,y-11,p.id,kind==='light'?'light-text':'power-text','start');return s;}
export const sheets={
 layout:{number:'02',title:'План расстановки',subtitle:'Габариты и свободный вход',note:'Оси соответствуют вашей картинке: шкаф сверху, дверь слева, тумба и унитаз снизу, душ справа.',items:[['01 · Хранение','Шкаф 1670 × 700 мм. Шахта справа от него сохранена.'],['02 · Умывальник','Тумба 850 × 500 мм, подвесная.'],['03 · Унитаз','Спинкой к инсталляции, сиденьем в помещение.'],['04 · Душ','1100 × 1577 мм. Вход вдоль нижнего края стекла.'],['Дверь','800 мм; нижняя петля, открывание наружу.']]},
 light:{number:'03',title:'План освещения',subtitle:'Группы и привязки к стенам',note:'Точки L1–L4 — потолок. L5 — зеркало, L6 — тумба, L7 — карниз душа. Пунктиры показывают группы, а не трассы.',items:lights.map(p=>[p.id+' · '+p.label,p.note])},
 power:{number:'04',title:'План электрики',subtitle:'Точки питания и управление',note:'R — розетка, E — скрытый вывод, V — вентиляция, S — управление. Все точки предварительные; зоны душа и оборудование проверяются до монтажа.',items:power.map(p=>[p.id+' · '+p.label,`h ${n(p.h)} мм · x ${n(p.x)} / y ${n(p.z)} мм. ${p.note}`])},
 elevation:{number:'05',title:'Развёртки стен',subtitle:'Отделка, мебель и высоты',note:'Виды из центра комнаты: А — север, Б — восток, В — юг, Г — запад. Размеры — от чистого пола; высота потолка и мебели принята для концепции.',items:[['А · Шкаф и шахта','Графитовые фасады, ширина 1670 мм, глубина 700 мм; ниша 354 мм.'],['Б · Душевая стена','Керамогранит под дерево, чёрная душевая система, скрытый свет.'],['В · Умывальник и WC','Светлый камень, круглый светящийся контур, подвесная тумба.'],['Г · Вход','Дверь 800 × 2100 мм. Размер проёма уточняется по коробке.']]}
};
export function drawing(kind){if(kind==='elevation')return elevations();let s=planBase();
 if(kind==='layout'){s+=bubble(.83,.35,'01')+bubble(.425,2.03,'02')+bubble(1.36,1.84,'03')+bubble(2.42,1.1,'04');s+=text(X(2.14),Y(.25),'ШАХТА','tiny');s+=text(X(-.55),Y(1.95),'БАНКЕТКА','tiny');}
 if(kind==='light'){s+=`<path d="M${X(.48)} ${Y(1.1)}L${X(1.4)} ${Y(.94)}L${X(1.4)} ${Y(1.68)}" class="circuit"/>`;s+=lights.map(p=>point(p,'light')).join('');s+=line(X(2.95),Y(.57),X(2.95),Y(2.0),'led');s+=line(X(.07),Y(1.8),X(.78),Y(1.8),'led');}
 if(kind==='power')s+=power.map(p=>point(p,'power')).join('');
 s+=dimX(0,2.97,-.35,'2970')+dimX(0,1.67,-.15,'1670')+dimX(1.67,2.616,-.15,'946')+dimX(2.616,2.97,-.15,'354');
 s+=dimY(0,2.28,3.32,'2280')+dimY(0,.503,3.15,'503')+dimY(.503,2.08,3.15,'1577')+dimY(door.z,door.hingeZ,-.14,'800');
 s+=dimX(0,.85,2.58,'850')+dimX(.85,1.87,2.58,'1020')+dimX(1.87,2.97,2.58,'1100');
 s+=text(95,45,'С/У — '+sheets[kind].number,'drawing-index','start')+text(230,640,'Все размеры в мм · север = верх плана · оси x/y от левого верхнего угла','caption','start');
 return `<svg viewBox="0 0 920 690" role="img" aria-label="${sheets[kind].title}">${defs}${s}</svg>`;}
function elevations(){let s='';const scale=.112,y0=80;const areas=[{x:45,y:y0,w:2.97,t:'А / ШКАФ И ШАХТА',type:'cabinet'},{x:475,y:y0,w:2.28,t:'Б / ДУШ',type:'shower'},{x:45,y:465,w:2.97,t:'В / РАКОВИНА И УНИТАЗ',type:'vanity'},{x:475,y:465,w:2.28,t:'Г / ВХОД',type:'door'}];
 for(const a of areas){const w=n(a.w)*scale,h=2650*scale;s+=text(a.x,a.y-22,a.t,'elevation-title','start')+`<rect x="${a.x}" y="${a.y}" width="${w}" height="${h}" class="elev-wall"/>`;
 const r=(x,y,ww,hh,c)=>`<rect x="${a.x+x*scale}" y="${a.y+(2650-y-hh)*scale}" width="${ww*scale}" height="${hh*scale}" class="${c}"/>`;
 if(a.type==='cabinet'){s+=r(0,80,1670,2480,'cabinet')+r(1670,0,946,2650,'shaft')+r(2616,0,354,2650,'timber');for(let i=1;i<3;i++)s+=line(a.x+i*1670/3*scale,a.y+90*scale,a.x+i*1670/3*scale,a.y+h-80*scale,'cabinet-line');}
 if(a.type==='shower'){s+=r(0,0,2280,2650,'timber');for(let i=200;i<2280;i+=200)s+=line(a.x+i*scale,a.y,a.x+i*scale,a.y+h,'tile');s+=line(a.x+1250*scale,a.y+500*scale,a.x+1250*scale,a.y+1550*scale,'fixture')+line(a.x+1250*scale,a.y+500*scale,a.x+1540*scale,a.y+500*scale,'fixture')+r(0,2580,2280,15,'light-fill');}
 if(a.type==='vanity'){s+=r(0,340,850,460,'cabinet')+r(0,800,850,35,'ceramic')+r(150,835,550,180,'ceramic')+r(850,0,2120,1150,'timber');s+=`<circle cx="${a.x+425*scale}" cy="${a.y+(2650-1630)*scale}" r="${400*scale}" class="mirror"/>`;s+=r(1175,150,370,337,'ceramic')+r(1245,840,230,140,'cabinet')+r(50,330,750,12,'light-fill');}
 if(a.type==='door'){s+=r(660,0,800,2100,'cabinet')+r(1360,980,90,20,'installation');}
 s+=line(a.x,a.y+h+16,a.x+w,a.y+h+16)+text(a.x+w/2,a.y+h+32,n(a.w),'dim');s+=`<text x="${a.x-12}" y="${a.y+h/2}" class="dim" text-anchor="middle" transform="rotate(-90 ${a.x-12} ${a.y+h/2})">2650*</text>`;}
 s+=text(45,840,'* Потолок 2650 мм после условного опуска 100 мм. Это эскизные высоты, до обмера.','caption','start');return `<svg viewBox="0 0 800 885" role="img" aria-label="Четыре развёртки стен санузла">${defs}${s}</svg>`;}
