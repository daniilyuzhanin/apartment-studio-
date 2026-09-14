export const palettes={
 sage:{name:'Дуб и шалфей',wall:'#eee9df',floor:'#c7a77c',wood:'#ab8054',kitchen:'#788571',fabric:'#d9d1bf',accent:'#a9b49a',tile:'#d7d2c7'},
 sand:{name:'Тёплый минимализм',wall:'#f3eee4',floor:'#d5b995',wood:'#b4936d',kitchen:'#b4a793',fabric:'#e0d7c6',accent:'#a88362',tile:'#dfd9ce'},
 clay:{name:'Орех и терракота',wall:'#e9e0d4',floor:'#b99a79',wood:'#79583e',kitchen:'#9e6b55',fabric:'#d5c2ad',accent:'#9e6b55',tile:'#c9c2b6'}
};
const fixedRooms=[
 {id:'bedroom',name:'Спальня',area:12.47,private:true,x:0,z:1.4,w:3.2,d:3.90,info:'Кровать 160 × 200 см, встроенный шкаф и выход на лоджию. Расстановка предварительная.'},
 {id:'flex',name:'Вторая комната',area:11.25,private:true,x:3.35,z:0,w:3,d:3.75,info:'Пока кабинет и гостевая. В будущем можно адаптировать под детскую или вторую спальню.'},
 {id:'bath',name:'Ванная',area:5.08,x:3.9,z:5.45,w:2.35,d:2.16,info:'Ванна и умывальник в исходной мокрой зоне. Размеры сантехники условные.'},
 {id:'shower',name:'Душевая',area:5.52,estimated:true,x:11.05,z:3.9,w:2.97,d:2.28,info:'Схема по картинке: дверь 80 см на левой стене; шкаф 167 × 70 см сверху; раковина 85 × 50 см и унитаз снизу, душ справа. Площадь 5,52 м² указана у соседей, размеры временные.'},
 {id:'storage',name:'Входной гардероб',area:2.70,estimated:true,x:6.4,z:5.17,w:1.5,d:1.80,info:'Шкафы и обувь внутри гардероба. Передняя перегородка выдвинута на 28 см; дверь 80 см открывается внутрь, вход из прихожей свободен. Исходная площадь по PDF — 2,28 м².'},
 {id:'hall',name:'Прихожая',area:10.33,x:8.05,z:3.9,w:2.85,d:2.01,info:'Сохраняем пути к обеим комнатам и санузлам; шкаф у входа.'}
];
const wetZones=[{id:'kitchen-services',x:12.5,z:3.38},{id:'bath',x:3.9,z:5.45},{id:'shower',x:11.05,z:3.9}];
export {proposals,referenceDimensions} from './catalog.js?v=4';
import {proposals,referenceDimensions} from './catalog.js?v=4';
export const variantIds=['original',...Object.keys(proposals)];
export function getLayout(variant='table'){
 const config=proposals[variant]?.config||{};
 const expanded=!!config.expanded,master=!!config.suite;
 const divider=config.divider||6.425;
 const shift=6.425-divider;
 const jog=config.jog?.525:0;
 const rooms=structuredClone(fixedRooms);
 if(master){
  Object.assign(rooms.find(r=>r.id==='bedroom'),{name:'Мастер-спальня',info:'Спальная зона приватного блока. Соединена с гардеробной и ванной через собственный тамбур; существующий простенок между комнатами сохранён.'});
  Object.assign(rooms.find(r=>r.id==='flex'),{name:'Гардеробная',private:false,info:'Бывшая комната 11,25 м²: две линии хранения, место для переодевания и туалетный столик. Открыта в приватный тамбур спальни.'});
  Object.assign(rooms.find(r=>r.id==='bath'),{name:'Мастер-ванная',info:'Ванная 5,08 м² в прежних границах. Доступ из приватного тамбура спальни; общий санузел остаётся у кухни.'});
  Object.assign(rooms.find(r=>r.id==='flex'),{w:3-shift,footprint:variant==='direct'?[[3.35,0],[5.5,0],[5.5,.93],[5.0,.93],[5.0,3.75],[3.35,3.75]]:null,area:Math.round((11.25-shift*3.75+jog)*100)/100,estimated:shift>0,info:variant==='direct'?'Компактная гардеробная с одной линией шкафов. Вход из спальни через предлагаемый новый проём.':'Гардеробная с входом через приватный тамбур. Шкафы глубиной 60 см; проход между ними около 100 см в компактном варианте.'});
 }
 if(!master&&shift){const flex=rooms.find(r=>r.id==='flex');Object.assign(flex,{w:3-shift,area:Math.round((11.25-shift*3.75)*100)/100,estimated:true,name:'Кабинет',info:'Рабочая комната со своим окном; перегородка сдвинута к фасадному простенку.'});}
 if(config.flexUse==='child')Object.assign(rooms.find(r=>r.id==='flex'),{name:'Детская',info:'Отдельная комната с кроватью и рабочим местом у окна. Расстановка уточняется под возраст ребёнка.'});
 if(config.bedTail)Object.assign(rooms.find(r=>r.id==='bedroom'),{name:'Спальня + гардероб',info:'Вход через гардеробную полосу глубиной около 1,55 м. Спальная зона у лоджии отделена новой перегородкой.'});
 if(config.openMiddle)Object.assign(rooms.find(r=>r.id==='flex'),{name:'Рабочая зона',private:false,info:'Открытая рабочая зона у окна, часть объединённой гостиной.'});
 if(config.splitFlex)Object.assign(rooms.find(r=>r.id==='flex'),{name:'Кабинет + хранение',info:'Кабинет у окна. Закрытая кладовая в глубине комнаты; отдельные входы через проход вдоль левой стены.'});
 return {id:variant,config,partitionRemoved:expanded,warmBalcony:true,masterSuite:master,divider,northDivider:config.jog?5.575:divider,directDressing:!!config.directDoor,
  suiteArea:master?Math.round((23.72-shift*3.75+jog)*100)/100:null,
  access:{storage:{x:7.98,z:5.16,width:.80,axis:'z'},formerRoomDoor:!expanded,kitchenPartition:!expanded,privateVestibule:master,bathFrom:master?'private-vestibule':'hall'},
  wetZones:structuredClone(wetZones),rooms:[...rooms,...(!expanded?[
 {id:'room3',name:master||config.openMiddle||variant==='study'?'Гостиная':'Третья комната',area:Math.round((11.25+shift*3.75-jog)*100)/100,estimated:shift>0,private:!master&&!config.openMiddle,footprint:variant==='direct'?[[5.65,0],[9.5,0],[9.5,3.75],[5.15,3.75],[5.15,1.07],[5.65,1.07]]:null,x:6.5-shift,z:0,w:3+shift,d:3.75,info:master?'Отдельная гостиная с телевизором 75″. Площадь после переноса стены приблизительная.':'Комната, которую предлагаем включить в кухню-гостиную.'},
 {id:'living',name:'Кухня',area:16.91,x:9.65,z:0,w:4.37,d:3.75,info:'Исходная кухня по PDF — 16,91 м².'}
 ]:[{id:'living',name:'Кухня-гостиная',area:Math.round((28.16+shift*3.75)*100)/100,estimated:shift>0,x:6.5-shift,z:0,w:7.52+shift,d:3.75,info:'Кухня у прежних коммуникаций, обеденный стол и диванная зона. ТВ 75″ у дивана и 65″ в кухне. Старый проём за ТВ закрыт.'}])]};
}
export function parseState(hash=''){
 const p=new URLSearchParams(hash.replace(/^#/,''));
 const pick=(key,values,defaultValue)=>values.includes(p.get(key))?p.get(key):defaultValue;
 if(p.get('variant')==='peninsula')p.set('variant','master');
 return {variant:pick('variant',variantIds,'table'),palette:pick('palette',Object.keys(palettes),'sage'),view:pick('view',['iso','top','kitchen','shower'],'iso'),walls:pick('walls',['low','full'],'low'),furniture:p.get('furniture')!=='false'};
}
export function serializeState(s){return '#'+new URLSearchParams({variant:s.variant,palette:s.palette,view:s.view,walls:s.walls,furniture:String(s.furniture)}).toString();}
