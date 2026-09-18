import {getArchitecture} from './architecture.js?v=6';
import {getLayout} from './layout.js?v=4';

// All positions are metres. North is z=0, matching the supplied plan.
const source=getArchitecture(getLayout('original'));
const local=f=>({...f,x:+(f.x-11.05).toFixed(5),z:+(f.z-3.9).toFixed(5)});
export const room={width:2.970,depth:2.280,height:2.750,ceiling:2.650};
export const fixtures=source.showerFixtures.map(local);
export const shaft=local(source.structuralBlocks.find(f=>f.id==='shower-shaft')||source.structuralBlocks[0]);
export const toilet=local(source.toilets.find(f=>f.id==='shower-wc'));
export const door={z:.820,width:.800,hingeZ:1.620,height:2.100};
// Shelf bay is the remaining space to the RIGHT of the protected shaft.
export const niche={x:2.793,z:.2515,w:.354,d:.503,shelves:[.40,.88,1.36,1.84,2.32]};
export const showerSystem={wall:'east',x:2.94,z:1.30,headX:2.61,headHeight:2.14,mixerHeight:1.10};
export const arrangements={
 protected:{name:'Стекло у WC · общая стена',tag:'Предлагаю этот вариант',description:'Стекло отделяет унитаз от душа. Вход — со стороны шахты; лейка на стене инсталляции. Промежуток 170 мм закрыт добором у стены, над тумбой и инсталляцией проходит общая полка. Место сбоку от WC остаётся свободным.',screen:{x:1.874,z1:1.280,z2:2.080},entry:{z1:.503,z2:1.280},shower:{wall:'south',x:2.420,z:2.050,headX:2.420,headZ:1.720},gap:{x:.935,z:2.180,w:.170,d:.200,h:1.150},ledge:{x:.935,z:2.180,w:1.870,d:.200,h:1.150}},
 current:{name:'Прежнее расположение',tag:'Для сравнения',description:'Стекло начинается у шахты. Вход в душ рядом с WC; душевая система на правой стене. Между тумбой и коробом оставлен промежуток 170 мм.',screen:{x:1.874,z1:.503,z2:1.303},entry:{z1:1.303,z2:2.080},shower:{wall:'east',x:2.940,z:1.300,headX:2.610,headZ:1.300},gap:null,ledge:null}
};
export const designs={
 stone:{name:'Камень и дуб',tag:'01 / СДЕРЖАННЫЙ КОНТРАСТ',description:'Светлый камень, матовый графит и натуральный тон дуба. Ближе всего к вашим предыдущим дизайн-проектам.',tradeoff:'Графит подчёркивает мебель; на тёмной фурнитуре заметнее следы воды.',wall:'#ebe9e2',floor:'#d9d5c9',cabinet:'#484c48',wood:'#a9845b',accent:'#d4d1c4',metal:'#242a28',shower:'wood',surface:'marble',materials:['Светлый камень','Натуральный дуб','Матовый графит','Чёрный металл']},
 travertine:{name:'Тёплый травертин',tag:'02 / МЯГКИЙ МОНОХРОМ',description:'Песочный камень на стенах, молочные фасады и металл цвета шампань. Самый светлый и спокойный из трёх вариантов.',tradeoff:'Нужен керамогранит под травертин: он сохраняет рисунок без открытых пор натурального камня.',wall:'#e1cfaf',floor:'#d4c4a8',cabinet:'#e5dfd0',wood:'#b49471',accent:'#b5a286',metal:'#988166',shower:'stone',surface:'travertine',materials:['Травертин · рисунок','Светлый дуб','Молочные фасады','Шампань']},
 olive:{name:'Олива и орех',tag:'03 / ЦВЕТ И ГЛУБИНА',description:'Приглушённая зелёная плитка в душе, тёмное дерево и нейтральный камень. Ниша становится частью цветной стены.',tradeoff:'Больше швов в душевой; насыщенная стена лучше смотрится с полноценным общим светом.',wall:'#dedbd1',floor:'#c8c3b5',cabinet:'#71513e',wood:'#71513e',accent:'#87917c',metal:'#a0a39b',shower:'tile',surface:'limestone',materials:['Известняк · рисунок','Тёмный орех','Оливковая керамика','Сатинированный металл']}
};
export const views={iso:'Общий вид',door:'От двери',wall:'Общая стена',storage:'Шкаф и шахта',niche:'Полки',shower:'Душ',vanity:'Умывальник',top:'Сверху'};
export const lights=[
 {id:'L1',x:.48,z:1.10,h:2.65,group:'general',label:'Потолочный свет',note:'Ось: 480 / 1100 мм'},
 {id:'L2',x:1.40,z:.94,h:2.65,group:'general',label:'Потолочный свет',note:'Ось: 1400 / 940 мм'},
 {id:'L3',x:1.40,z:1.68,h:2.65,group:'general',label:'Потолочный свет',note:'Ось: 1400 / 1680 мм'},
 {id:'L4',x:2.42,z:1.25,h:2.65,group:'shower',label:'Свет над душем',note:'Ось: 2420 / 1250 мм; исполнение по зоне'},
 {id:'L5',x:.425,z:2.255,h:1.63,group:'mirror',label:'Подсветка зеркала',note:'Контур зеркала; центр 1630 мм'},
 {id:'L6',x:.425,z:1.80,h:.34,group:'night',label:'Свет под тумбой',note:'Скрытая линия; отметка 340 мм'},
 {id:'L7',x:2.945,z:1.28,h:2.60,group:'cove',label:'Подсветка душевой стены',note:'Карниз вдоль стены; отметка 2600 мм'},
 {id:'L8',x:2.925,z:.44,h:1.36,group:'niche',label:'Свет в нише',note:'Вертикальная линия за правой щекой ниши, рассеиватель; совместно с вечерним светом'}
];
export const power=[
 {id:'R1',x:0,z:1.94,h:1.10,kind:'socket',label:'Двойная розетка у тумбы',note:'На левой стене, ниже дверного проёма по плану; кандидат после проверки зон'},
 {id:'E1',x:.425,z:2.28,h:1.90,kind:'outlet',label:'Питание зеркала',note:'Скрытый вывод за зеркалом; место по паспорту зеркала'},
 {id:'E2',x:.35,z:.04,h:2.35,kind:'outlet',label:'Блоки питания подсветок',note:'Доступный верхний отсек шкафа; предусмотреть вентиляцию'},
 {id:'V1',x:2.14,z:.503,h:2.50,kind:'vent',label:'Вентиляция',note:'Условная точка у шахты; положение существующего канала уточнить'},
 {id:'S1',x:-.13,z:1.76,h:.90,kind:'switch',label:'Управление снаружи',note:'Клавиши общего света и зеркала; отдельное управление вечерним светом'}
];
export const scenarios={day:{general:1,shower:1,mirror:1,cove:0,night:0,niche:.6,ambient:.60},evening:{general:0,shower:.3,mirror:.45,cove:1,night:.4,niche:1,ambient:.24},night:{general:0,shower:0,mirror:0,cove:0,night:.65,niche:0,ambient:.08}};
export function readState(hash=''){const p=new URLSearchParams(hash.replace(/^#/,''));return {view:Object.hasOwn(views,p.get('view'))?p.get('view'):'wall',light:Object.hasOwn(scenarios,p.get('light'))?p.get('light'):'day',sheet:['layout','light','power','elevation'].includes(p.get('sheet'))?p.get('sheet'):'layout',design:Object.hasOwn(designs,p.get('design'))?p.get('design'):'stone',arrangement:Object.hasOwn(arrangements,p.get('arrangement'))?p.get('arrangement'):'protected'};}
export function writeState(s){return '#'+new URLSearchParams(s).toString();}
