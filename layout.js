export const palettes={
 sage:{name:'Дуб и шалфей',wall:'#eee9df',floor:'#c7a77c',wood:'#ab8054',kitchen:'#788571',fabric:'#d9d1bf',accent:'#a9b49a',tile:'#d7d2c7'},
 sand:{name:'Тёплый минимализм',wall:'#f3eee4',floor:'#d5b995',wood:'#b4936d',kitchen:'#b4a793',fabric:'#e0d7c6',accent:'#a88362',tile:'#dfd9ce'},
 clay:{name:'Орех и терракота',wall:'#e9e0d4',floor:'#b99a79',wood:'#79583e',kitchen:'#9e6b55',fabric:'#d5c2ad',accent:'#9e6b55',tile:'#c9c2b6'}
};
const fixedRooms=[
 {id:'bedroom',name:'Спальня',area:12.47,private:true,x:0,z:1.4,w:3.2,d:3.90,info:'Кровать 160 × 200 см, встроенный шкаф и выход на лоджию. Расстановка предварительная.'},
 {id:'flex',name:'Вторая комната',area:11.25,private:true,x:3.35,z:0,w:3,d:3.75,info:'Пока кабинет и гостевая. В будущем можно адаптировать под детскую или вторую спальню.'},
 {id:'bath',name:'Ванная',area:5.08,x:3.9,z:5.45,w:2.35,d:2.16,info:'Ванна и умывальник в исходной мокрой зоне. Размеры сантехники условные.'},
 {id:'shower',name:'Душевая',area:6.12,x:11.05,z:3.9,w:3.05,d:2.01,info:'Санузел остаётся в исходных границах. Предусмотрено место для хозяйственного хранения.'},
 {id:'storage',name:'Кладовая',area:2.28,x:6.4,z:5.45,w:1.5,d:1.52,info:'Хранение у входа. На разных планах PDF конфигурация инженерной ниши отличается.'},
 {id:'hall',name:'Прихожая',area:10.33,x:8.05,z:3.9,w:2.85,d:2.01,info:'Сохраняем пути к обеим комнатам и санузлам; шкаф у входа.'}
];
const wetZones=[{id:'kitchen-services',x:12.5,z:3.38},{id:'bath',x:3.9,z:5.45},{id:'shower',x:11.05,z:3.9}];
export function getLayout(variant='table'){
 const expanded=variant==='table',master=variant==='master';
 const rooms=structuredClone(fixedRooms);
 if(master){
  Object.assign(rooms.find(r=>r.id==='bedroom'),{name:'Мастер-спальня',info:'Спальная зона приватного блока. Соединена с гардеробной и ванной через собственный тамбур; существующий простенок между комнатами сохранён.'});
  Object.assign(rooms.find(r=>r.id==='flex'),{name:'Гардеробная',private:false,info:'Бывшая комната 11,25 м²: две линии хранения, место для переодевания и туалетный столик. Открыта в приватный тамбур спальни.'});
  Object.assign(rooms.find(r=>r.id==='bath'),{name:'Мастер-ванная',info:'Ванная 5,08 м² в прежних границах. Доступ из приватного тамбура спальни; общий санузел остаётся у кухни.'});
 }
 return {id:variant,partitionRemoved:expanded,warmBalcony:variant!=='original',masterSuite:master,
  suiteArea:master?23.72:null,
  access:{storage:{x:7.98,z:5.93,width:.77,axis:'z'},formerRoomDoor:!expanded,kitchenPartition:!expanded,privateVestibule:master,bathFrom:master?'private-vestibule':'hall'},
  wetZones:structuredClone(wetZones),rooms:[...rooms,...(!expanded?[
 {id:'room3',name:master?'Гостиная':'Третья комната',area:11.25,private:!master,x:6.5,z:0,w:3,d:3.75,info:master?'Отдельная гостиная: диван и ТВ на боковой стене, свободный вход из общего коридора.':'Комната, которую предлагаем включить в кухню-гостиную.'},
 {id:'living',name:'Кухня',area:16.91,x:9.65,z:0,w:4.45,d:3.75,info:'Исходная кухня по PDF — 16,91 м².'}
 ]:[{id:'living',name:'Кухня-гостиная',area:28.16,x:6.5,z:0,w:7.6,d:3.75,info:'Кухня у прежних коммуникаций, большой стол на 6 мест и диванная зона в бывшей комнате. Старый дверной проём за ТВ закрыт.'}])]};
}
export function parseState(hash=''){
 const p=new URLSearchParams(hash.replace(/^#/,''));
 const pick=(key,values,defaultValue)=>values.includes(p.get(key))?p.get(key):defaultValue;
 if(p.get('variant')==='peninsula')p.set('variant','master');
 return {variant:pick('variant',['original','table','master'],'table'),palette:pick('palette',Object.keys(palettes),'sage'),view:pick('view',['iso','top','kitchen'],'iso'),walls:pick('walls',['low','full'],'low'),furniture:p.get('furniture')!=='false'};
}
export function serializeState(s){return '#'+new URLSearchParams({variant:s.variant,palette:s.palette,view:s.view,walls:s.walls,furniture:String(s.furniture)}).toString();}
