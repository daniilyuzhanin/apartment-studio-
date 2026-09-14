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
 {id:'storage',name:'Входной гардероб',area:2.70,estimated:true,x:6.4,z:5.17,w:1.5,d:1.80,info:'Шкафы и обувь внутри гардероба. Передняя перегородка выдвинута на 28 см; дверь 80 см открывается внутрь, вход из прихожей свободен. Исходная площадь по PDF — 2,28 м².'},
 {id:'hall',name:'Прихожая',area:10.33,x:8.05,z:3.9,w:2.85,d:2.01,info:'Сохраняем пути к обеим комнатам и санузлам; шкаф у входа.'}
];
const wetZones=[{id:'kitchen-services',x:12.5,z:3.38},{id:'bath',x:3.9,z:5.45},{id:'shower',x:11.05,z:3.9}];
export const variantIds=['original','table','master','balanced','direct','social'];
export const proposals={
 table:{number:'01',label:'Большая кухня',subtitle:'Две отдельные комнаты',title:'Собираться вместе',description:'Кухня-гостиная 28,16 м² и две отдельные комнаты. Подходит, если нужен кабинет или будущая детская.',area:'28,16 м²',caption:'кухня-гостиная · по исходным площадям',note:'Старый вход за ТВ закрыт. Спальня и вторая комната сохраняются.',plus:'Самый гибкий вариант: отдельный кабинет / детская.',minus:'Нет приватного входа в ванную.',scores:[4,3,3,5,4]},
 master:{number:'02',label:'Большой мастер-блок',subtitle:'Просторная гардеробная',title:'Своя территория',description:'Спальня, гардеробная 11,25 м² и ванная связаны приватным тамбуром. Кухня и гостиная остаются отдельными.',area:'23,72 м²',caption:'спальня + гардеробная · без тамбура и ванной',note:'Маршрут через приватный тамбур. Стена между спальней и гардеробной сохраняется.',plus:'Много хранения и место для переодевания.',minus:'Гардеробная велика относительно гостиной 11,25 м².',scores:[3,5,5,2,4]},
 balanced:{number:'03',label:'Баланс · мой выбор',subtitle:'Гостиная ≈ 14,4 м²',title:'Больше места для отдыха',description:'Сужаем гардеробную до ≈ 8,1 м² и отдаём полосу 0,85 м гостиной. Ванная и гардеробная доступны из приватного тамбура; кухня отдельная.',area:'≈ 14,4 м²',caption:'гостиная · оценка по эскизной геометрии',note:'Сдвиг перегородки на 0,85 м — предложение после подтверждения её ненесущего статуса.',plus:'Удобная гостиная, достаточно хранения, приватная ванная.',minus:'Нужен перенос перегородки; отдельного кабинета нет.',scores:[5,4,5,3,2]},
 direct:{number:'04',label:'Гардероб из спальни',subtitle:'Гостиная ≈ 15,8 м²',title:'Короткий личный маршрут',description:'Гардеробная ≈ 6,7 м² с одной линией шкафов и входом прямо из спальни. Гостиная увеличена, кухня отдельная. Ванная — через приватный тамбур.',area:'≈ 15,8 м²',caption:'гостиная · оценка по эскизной геометрии',note:'Новый проём спальня → гардеробная допустим только после проверки конструкции стены.',plus:'Самая большая отдельная гостиная, короткий путь к одежде. Уступ у окна сохраняет остекление.',minus:'Меньше хранения; требуется новый проём в непроверенной стене.',scores:[4,3,5,3,1]},
 social:{number:'05',label:'Мастер + общая зона',subtitle:'Кухня-гостиная ≈ 31,3 м²',title:'Для жизни вдвоём',description:'Компактная гардеробная и приватная ванная сочетаются с большой кухней-гостиной. Самый открытый сценарий для пары.',area:'≈ 31,3 м²',caption:'кухня-гостиная · оценка по эскизной геометрии',note:'Предложение со сдвигом перегородки и объединением кухни; отдельной второй комнаты нет.',plus:'Максимум общего пространства и приватный мастер-блок.',minus:'Нет отдельного кабинета / гостевой; запахи кухни в гостиной.',scores:[5,4,4,1,1]}
};
export function getLayout(variant='table'){
 const expanded=['table','social'].includes(variant),master=['master','balanced','direct','social'].includes(variant);
 const divider=variant==='direct'?5.075:['balanced','social'].includes(variant)?5.575:6.425;
 const shift=6.425-divider;
 const jog=variant==='direct'?.525:0;
 const rooms=structuredClone(fixedRooms);
 if(master){
  Object.assign(rooms.find(r=>r.id==='bedroom'),{name:'Мастер-спальня',info:'Спальная зона приватного блока. Соединена с гардеробной и ванной через собственный тамбур; существующий простенок между комнатами сохранён.'});
  Object.assign(rooms.find(r=>r.id==='flex'),{name:'Гардеробная',private:false,info:'Бывшая комната 11,25 м²: две линии хранения, место для переодевания и туалетный столик. Открыта в приватный тамбур спальни.'});
  Object.assign(rooms.find(r=>r.id==='bath'),{name:'Мастер-ванная',info:'Ванная 5,08 м² в прежних границах. Доступ из приватного тамбура спальни; общий санузел остаётся у кухни.'});
  Object.assign(rooms.find(r=>r.id==='flex'),{w:3-shift,footprint:variant==='direct'?[[3.35,0],[5.5,0],[5.5,.93],[5.0,.93],[5.0,3.75],[3.35,3.75]]:null,area:Math.round((11.25-shift*3.75+jog)*100)/100,estimated:shift>0,info:variant==='direct'?'Компактная гардеробная с одной линией шкафов. Вход из спальни через предлагаемый новый проём.':'Гардеробная с входом через приватный тамбур. Шкафы глубиной 60 см; проход между ними около 100 см в компактном варианте.'});
 }
 return {id:variant,partitionRemoved:expanded,warmBalcony:true,masterSuite:master,divider,northDivider:variant==='direct'?5.575:divider,directDressing:variant==='direct',
  suiteArea:master?Math.round((23.72-shift*3.75+jog)*100)/100:null,
  access:{storage:{x:7.98,z:5.16,width:.80,axis:'z'},formerRoomDoor:!expanded,kitchenPartition:!expanded,privateVestibule:master,bathFrom:master?'private-vestibule':'hall'},
  wetZones:structuredClone(wetZones),rooms:[...rooms,...(!expanded?[
 {id:'room3',name:master?'Гостиная':'Третья комната',area:Math.round((11.25+shift*3.75-jog)*100)/100,estimated:shift>0,private:!master,footprint:variant==='direct'?[[5.65,0],[9.5,0],[9.5,3.75],[5.15,3.75],[5.15,1.07],[5.65,1.07]]:null,x:6.5-shift,z:0,w:3+shift,d:3.75,info:master?'Отдельная гостиная с телевизором 75″. Площадь после переноса стены приблизительная.':'Комната, которую предлагаем включить в кухню-гостиную.'},
 {id:'living',name:'Кухня',area:16.91,x:9.65,z:0,w:4.45,d:3.75,info:'Исходная кухня по PDF — 16,91 м².'}
 ]:[{id:'living',name:'Кухня-гостиная',area:Math.round((28.16+shift*3.75)*100)/100,estimated:shift>0,x:6.5-shift,z:0,w:7.6+shift,d:3.75,info:'Кухня у прежних коммуникаций, обеденный стол и диванная зона. ТВ 75″ у дивана и 65″ в кухне. Старый проём за ТВ закрыт.'}])]};
}
export function parseState(hash=''){
 const p=new URLSearchParams(hash.replace(/^#/,''));
 const pick=(key,values,defaultValue)=>values.includes(p.get(key))?p.get(key):defaultValue;
 if(p.get('variant')==='peninsula')p.set('variant','master');
 return {variant:pick('variant',variantIds,'table'),palette:pick('palette',Object.keys(palettes),'sage'),view:pick('view',['iso','top','kitchen'],'iso'),walls:pick('walls',['low','full'],'low'),furniture:p.get('furniture')!=='false'};
}
export function serializeState(s){return '#'+new URLSearchParams({variant:s.variant,palette:s.palette,view:s.view,walls:s.walls,furniture:String(s.furniture)}).toString();}
