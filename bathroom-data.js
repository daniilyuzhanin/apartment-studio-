import {getArchitecture} from './architecture.js?v=4';
import {getLayout} from './layout.js?v=4';

// All positions are metres. North is z=0, matching the supplied plan.
const source=getArchitecture(getLayout('original'));
const local=f=>({...f,x:+(f.x-11.05).toFixed(5),z:+(f.z-3.9).toFixed(5)});
export const room={width:2.970,depth:2.280,height:2.750,ceiling:2.650};
export const fixtures=source.showerFixtures.map(local);
export const shaft=local(source.structuralBlocks.find(f=>f.id==='shower-shaft')||source.structuralBlocks[0]);
export const toilet=local(source.toilets.find(f=>f.id==='shower-wc'));
export const door={z:.820,width:.800,hingeZ:1.620,height:2.100};
export const lights=[
 {id:'L1',x:.48,z:1.10,h:2.65,group:'general',label:'Потолочный свет',note:'Ось: 480 / 1100 мм'},
 {id:'L2',x:1.40,z:.94,h:2.65,group:'general',label:'Потолочный свет',note:'Ось: 1400 / 940 мм'},
 {id:'L3',x:1.40,z:1.68,h:2.65,group:'general',label:'Потолочный свет',note:'Ось: 1400 / 1680 мм'},
 {id:'L4',x:2.42,z:1.25,h:2.65,group:'shower',label:'Свет над душем',note:'Ось: 2420 / 1250 мм; исполнение по зоне'},
 {id:'L5',x:.425,z:2.255,h:1.55,group:'mirror',label:'Подсветка зеркала',note:'Контур зеркала; центр 1550 мм'},
 {id:'L6',x:.425,z:1.80,h:.34,group:'night',label:'Свет под тумбой',note:'Скрытая линия; отметка 340 мм'},
 {id:'L7',x:2.945,z:1.28,h:2.60,group:'cove',label:'Подсветка душевой стены',note:'Карниз вдоль стены; отметка 2600 мм'}
];
export const power=[
 {id:'R1',x:0,z:1.94,h:1.10,kind:'socket',label:'Двойная розетка у тумбы',note:'На левой стене, ниже дверного проёма по плану; кандидат после проверки зон'},
 {id:'E1',x:.425,z:2.28,h:1.90,kind:'outlet',label:'Питание зеркала',note:'Скрытый вывод за зеркалом; место по паспорту зеркала'},
 {id:'E2',x:.35,z:.04,h:2.35,kind:'outlet',label:'Блоки питания подсветок',note:'Доступный верхний отсек шкафа; предусмотреть вентиляцию'},
 {id:'V1',x:2.14,z:.503,h:2.50,kind:'vent',label:'Вентиляция',note:'Условная точка у шахты; положение существующего канала уточнить'},
 {id:'S1',x:-.13,z:1.76,h:.90,kind:'switch',label:'Управление снаружи',note:'Клавиши общего света и зеркала; отдельное управление вечерним светом'}
];
export const scenarios={day:{general:1,shower:1,mirror:1,cove:0,night:0,ambient:.38},evening:{general:0,shower:.3,mirror:.45,cove:1,night:.4,ambient:.18},night:{general:0,shower:0,mirror:0,cove:0,night:.65,ambient:.06}};
export function readState(hash=''){const p=new URLSearchParams(hash.replace(/^#/,''));return {view:['iso','door','top'].includes(p.get('view'))?p.get('view'):'iso',light:Object.hasOwn(scenarios,p.get('light'))?p.get('light'):'day',sheet:['layout','light','power','elevation'].includes(p.get('sheet'))?p.get('sheet'):'layout'};}
export function writeState(s){return '#'+new URLSearchParams(s).toString();}
