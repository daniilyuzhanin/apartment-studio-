import {readState,writeState} from './bathroom-data.js?v=2';
import {drawing,sheets} from './bathroom-drawings.js?v=2';
let state=readState(location.hash),model;
const $=s=>document.querySelector(s);
function notify(message){$('#toast').textContent=message;$('#toast').classList.add('show');setTimeout(()=>$('#toast').classList.remove('show'),2600);}
function renderSheet(){const s=sheets[state.sheet];$('#sheet-title').textContent=s.title;$('#sheet-subtitle').textContent=s.subtitle;$('#sheet-number').textContent='ЛИСТ '+s.number;$('#drawing').innerHTML=drawing(state.sheet);$('#sheet-note').textContent=s.note;$('#sheet-items').innerHTML=s.items.map(([a,b])=>`<article><h3>${a}</h3><p>${b}</p></article>`).join('');}
function update(){for(const key of ['view','light','sheet'])document.querySelectorAll(`[data-${key}]`).forEach(b=>b.setAttribute('aria-pressed',String(b.dataset[key]===state[key])));renderSheet();if(model&&model.activeView!==state.view)model.view(state.view);model?.lighting(state.light);}
for(const key of ['view','light','sheet'])document.querySelectorAll(`[data-${key}]`).forEach(b=>b.addEventListener('click',()=>{state[key]=b.dataset[key];history.replaceState(null,'',writeState(state));update();}));
addEventListener('hashchange',()=>{if(location.hash.includes('=')){state=readState(location.hash);update();}});
$('#share').addEventListener('click',async()=>{try{const url=new URL(location.href);url.hash=writeState(state);await navigator.clipboard.writeText(url.href);notify('Ссылка на текущий ракурс и лист скопирована');}catch{notify('Не удалось скопировать. Скопируйте адрес из строки браузера.');}});
$('#snapshot').addEventListener('click',()=>{if(!model)return notify('Модель ещё не загружена');const a=document.createElement('a');a.download=`sanuzel-${state.view}-${state.light}.png`;a.href=model.capture();a.click();});
$('#print').addEventListener('click',()=>window.print());update();
try{const {createBathroom}=await import('./bathroom-scene.js?v=2');model=createBathroom($('#bath-viewer'));$('#loading')?.remove();update();}catch(error){console.error('Bathroom 3D:',error);$('#loading').textContent='3D недоступно в этом браузере. Размерные схемы ниже работают.';}
