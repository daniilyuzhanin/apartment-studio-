import * as THREE from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {getLayout,palettes} from './layout.js';

export function createApartment(container,onRoom){
 const scene=new THREE.Scene();
 const renderer=new THREE.WebGLRenderer({antialias:true,alpha:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;
 renderer.outputColorSpace=THREE.SRGBColorSpace;renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;
 renderer.domElement.setAttribute('aria-label','Объёмный эскиз квартиры');container.prepend(renderer.domElement);
 const camera=new THREE.PerspectiveCamera(36,1,.1,120);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.dampingFactor=.09;controls.minDistance=5;controls.maxDistance=35;controls.maxPolarAngle=Math.PI/2.08;controls.target.set(7,0,3.1);controls.enablePan=true;
 scene.add(new THREE.HemisphereLight('#fffcf1','#a0a58d',1.8));
 const sun=new THREE.DirectionalLight('#fff5de',2.2);sun.position.set(-4,17,-7);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-16;sun.shadow.camera.right=16;sun.shadow.camera.top=15;sun.shadow.camera.bottom=-15;sun.shadow.normalBias=.035;sun.shadow.bias=-.0001;scene.add(sun);sun.target.position.set(7,0,3);scene.add(sun.target);
 const fill=new THREE.DirectionalLight('#f3f5ff',1);fill.position.set(12,8,15);scene.add(fill);
 const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.ShadowMaterial({opacity:.13}));ground.rotation.x=-Math.PI/2;ground.position.y=-.25;ground.receiveShadow=true;scene.add(ground);
 let root,roomFloors=[],labels=[],state,selected='living',palette;
 const labelLayer=document.querySelector('#labels');
 const material=(color,extra={})=>new THREE.MeshStandardMaterial({color,roughness:.78,...extra});
 function mesh(geometry,mat,parent=root){const m=new THREE.Mesh(geometry,mat);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
 function box(w,h,d,x,y,z,color,parent=root){const m=mesh(new THREE.BoxGeometry(w,h,d),typeof color==='string'?material(color):color,parent);m.position.set(x,y+h/2,z);return m;}
 function round(w,h,d,x,y,z,color,r=.08,parent=root){r=Math.min(r,w/2,d/2);const s=new THREE.Shape();const a=-w/2,b=-d/2;s.moveTo(a+r,b);s.lineTo(a+w-r,b);s.quadraticCurveTo(a+w,b,a+w,b+r);s.lineTo(a+w,b+d-r);s.quadraticCurveTo(a+w,b+d,a+w-r,b+d);s.lineTo(a+r,b+d);s.quadraticCurveTo(a,b+d,a,b+d-r);s.lineTo(a,b+r);s.quadraticCurveTo(a,b,a+r,b);const g=new THREE.ExtrudeGeometry(s,{depth:h,bevelEnabled:false,curveSegments:5});g.rotateX(-Math.PI/2);const m=mesh(g,material(color),parent);m.position.set(x,y,z);return m;}
 function cyl(radius,height,x,y,z,color,parent=root,r2=radius){const m=mesh(new THREE.CylinderGeometry(radius,r2,height,24),material(color),parent);m.position.set(x,y+height/2,z);return m;}
 function sphere(rx,ry,rz,x,y,z,color,parent=root){const m=mesh(new THREE.SphereGeometry(1,12,8),material(color),parent);m.scale.set(rx,ry,rz);m.position.set(x,y,z);return m;}
 function group(x,z,rot=0){const g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=rot;root.add(g);return g;}
 function line(a,b,color='#8c8e7e',parent=root){const g=new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(...a),new THREE.Vector3(...b)]);const l=new THREE.Line(g,new THREE.LineBasicMaterial({color}));parent.add(l);return l;}
 function wall(x1,z1,x2,z2,{height,thick=.14,color=palette.wall}={}){const length=Math.hypot(x2-x1,z2-z1);const m=box(length,height??(state.walls==='full'?2.75:.72),thick,(x1+x2)/2,.02,(z1+z2)/2,color);m.rotation.y=-Math.atan2(z2-z1,x2-x1);return m;}
 function segmentedWall(x1,x2,z,openings,external=false){let cursor=x1;for(const [start,end,type='door'] of openings){if(start>cursor)wall(cursor,z,start,z,{height:external?2.75:undefined,thick:external?.22:.14});if(type==='window')windowUnit((start+end)/2,z,end-start);else if(state.walls==='full')box(end-start,.58,.14,(start+end)/2,2.17,z,palette.wall);cursor=end;}if(cursor<x2)wall(cursor,z,x2,z,{height:external?2.75:undefined,thick:external?.22:.14});}
 function windowUnit(x,z,w,rot=0){const g=group(x,z,rot);box(w,.22,.22,0,0,0,palette.wall,g);const frame='#e8e7df',trim='#afb5a8';box(w, .055,.1,0,.23,0,trim,g);box(w,.06,.1,0,2.57,0,frame,g);for(const xx of [-w/2+.025,w/2-.025,0])box(.05,2.35,.1,xx,.23,0,frame,g);box(w,.035,.09,0,1.05,0,frame,g);box(w-.06,2.27,.035,0,.27,0,material('#cee0db',{transparent:true,opacity:.27,roughness:.1,metalness:.1}),g);box(w+.12,.055,.3,0,.25,.06,'#eae8dc',g);box(Math.min(w-.15,.95),.27,.14,0,.045,.22,'#efeee7',g);for(let i=-.36;i<.4;i+=.07)box(.018,.20,.015,i,.08,.298,'#d0d3c7',g);}
 // Door leaves and swing arcs stay visible in the cutaway, even without furniture.
 function door(x,z,width,rotation=0,swing=-1){
  const g=group(x,z,rotation),h=state.walls==='full'?2.12:.67;
  box(width,.022,.18,width/2,.027,0,palette.wood,g);
  for(const xx of [0,width])box(.035,h,.18,xx,.04,0,palette.wood,g);
  if(state.walls==='full')box(width,.055,.18,width/2,2.13,0,palette.wood,g);
  const leaf=new THREE.Group();leaf.rotation.y=swing*Math.PI*.42;g.add(leaf);
  box(width-.055,h-.035,.042,(width-.055)/2,.055,0,'#d8c5a8',leaf);
  box(.10,.025,.09,width-.16,Math.min(h-.15,1.02),0,'#6b7164',leaf);
  const points=[];for(let i=0;i<=24;i++){const a=swing*Math.PI*.5*i/24;points.push(new THREE.Vector3(width*Math.cos(a),.054,-width*Math.sin(a)));}
  g.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points),new THREE.LineBasicMaterial({color:'#a38c68',transparent:true,opacity:.65})));
 }
 function masterDressing(){
  for(const x of [3.73,5.98])for(let i=0;i<4;i++){
   const z=.48+i*.70;box(.58,.08,.68,x,.06,z,palette.wood);box(.58,.055,.68,x,2.23,z,palette.wood);
   box(.035,2.2,.68,x+(x<4?-.28:.28),.08,z,palette.wall);
   box(.58,.035,.025,x,1.70,z+.31,palette.wood);
   if(i%2===0){for(let j=0;j<4;j++)box(.53,.04,.62,x,.48+j*.36,z,palette.wood);}
   else{for(let j=0;j<5;j++)box(.42,.67,.065,x,1.01,z-.23+j*.105,j%2?palette.fabric:palette.accent);}
  }
  round(.68,.44,.85,4.85,.04,2.50,palette.fabric,.14);box(1.12,.065,.42,4.85,.75,.42,palette.wood);
  for(const x of [4.34,5.36])box(.035,.75,.38,x,0,.42,palette.wood);
  cyl(.19,.44,4.85,.01,.95,palette.accent);rug(4.85,2.00,1.25,2.50);
 }
 function floorTexture(){const c=document.createElement('canvas');c.width=c.height=512;const ctx=c.getContext('2d');ctx.fillStyle=palette.floor;ctx.fillRect(0,0,512,512);for(let row=0;row<8;row++){const yy=row*64;ctx.fillStyle=row%2?'#ffffff12':'#3c21050b';ctx.fillRect(0,yy,512,64);ctx.strokeStyle='#513a2320';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(0,yy);ctx.lineTo(512,yy);ctx.stroke();const off=(row%3)*171;ctx.beginPath();ctx.moveTo(off,yy);ctx.lineTo(off,yy+64);ctx.stroke();for(let j=0;j<8;j++){ctx.strokeStyle=j%2?'#ffffff0a':'#513a2309';ctx.beginPath();ctx.moveTo(0,yy+j*8+3);ctx.lineTo(512,yy+j*8+1);ctx.stroke();}}const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.repeat.set(2.5,2);t.colorSpace=THREE.SRGBColorSpace;return t;}
 function chair(x,z,rot=0,color=palette.wood){const g=group(x,z,rot);for(const xx of [-.18,.18])for(const zz of [-.18,.18])box(.045,.43,.045,xx,0,zz,palette.wood,g);round(.48,.09,.48,0,.43,0,color,.09,g);round(.48,.43,.075,0,.50,.20,color,.04,g);}
 function dining(x,z,w,d,seats){round(w,.08,d,x,.76,z,palette.wood,.18);for(const xx of [-w*.35,w*.35])for(const zz of [-d*.30,d*.30])box(.06,.76,.06,x+xx,0,z+zz,palette.wood);const cols=seats===6?2:1;for(let i=0;i<cols;i++){const xx=x+(cols===2?(i-.5)*.95:0);chair(xx,z-d/2-.27,Math.PI);chair(xx,z+d/2+.27);}chair(x-w/2-.27,z,Math.PI/2);chair(x+w/2+.27,z,-Math.PI/2);cyl(.14,.20,x,.84,z,'#ded4b9',root,.10);sphere(.24,.04,.18,x+.45,.87,z+.1,'#e7e1d0');}
 function sofa(x,z,rot=0,w=2.5){const g=group(x,z,rot);for(const xx of [-w*.4,w*.4])for(const zz of [-.34,.34])cyl(.045,.15,xx,0,zz,palette.wood,g);round(w,.25,1.02,0,.14,0,palette.fabric,.14,g);round(w,.55,.25,0,.33,-.43,palette.fabric,.12,g);round(.22,.42,.93,-w/2+.08,.32,0,palette.fabric,.09,g);round(.22,.42,.93,w/2-.08,.32,0,palette.fabric,.09,g);for(const xx of [-w*.23,w*.23])round(w*.43,.15,.70,xx,.40,.04,palette.fabric,.10,g);const p1=round(.48,.20,.43,-w*.28,.59,-.21,palette.accent,.09,g);p1.rotation.x=.2;round(.42,.18,.40,w*.28,.60,-.20,'#e9decc',.09,g);}
 function bed(){const g=group(1.38,3.13,Math.PI/2);round(1.67,.28,2.12,0,.13,0,palette.wood,.06,g);round(1.6,.23,2.03,0,.41,0,'#eee5d5',.1,g);round(1.63,.08,1.28,0,.64,.34,palette.accent,.06,g);round(1.85,.90,.12,0,.18,-1.09,palette.fabric,.07,g);for(const xx of [-.43,.43])round(.64,.13,.43,xx,.66,-.72,'#f6eee0',.09,g);for(const xx of [-1.03,1.03]){cyl(.24,.43,xx,0,-.85,palette.wood,g);cyl(.07,.28,xx,.43,-.85,'#716f51',g);sphere(.13,.10,.13,xx,.73,-.85,'#f0e5c8',g);}for(let i=0;i<4;i++){box(.69,2.25,.56,.52+i*.70,0,4.98,palette.wall);box(.012,.28,.018,.81+i*.70,1.06,4.69,palette.wood);}rug(1.55,3.1,2.6,2.8);}
 function rug(x,z,w,d){round(w,.012,d,x,.025,z,palette.fabric,.07);for(let i=0;i<9;i++)line([x-w/2+.10,.04,z-d/2+.12+i*(d-.24)/8],[x+w/2-.10,.04,z-d/2+.12+i*(d-.24)/8],'#bdb69f');}
 function plant(x,z,size=1){cyl(.22*size,.38*size,x,.025,z,'#b9a487',root,.17*size);cyl(.018*size,.68*size,x,.35*size,z,'#786c44');for(let i=0;i<7;i++){const a=i*2.4;const leaf=sphere(.20*size,.38*size,.09*size,x+Math.sin(a)*.21*size,(.70+i*.047)*size,z+Math.cos(a)*.21*size,i%2?'#657c50':'#7f915e');leaf.rotation.z=Math.sin(a)*.7;leaf.rotation.y=a;}}
 function coffee(x,z){round(.85,.065,.65,x,.40,z,palette.wood,.25);cyl(.15,.4,x,0,z,palette.wood);box(.24,.035,.18,x-.13,.47,z,'#687958');cyl(.08,.11,x+.17,.47,z+.06,'#e8dec9');}
 function kitchen(){
  for(let i=0;i<6;i++){const x=10.8+i*.6;const tall=i===5;const h=tall?2.3:.86;box(.584,h,.62,x,.06,3.40,palette.kitchen);box(.57,.035,.017,x,h*.67,3.077,palette.wood);if(tall)box(.57,.028,.012,x,1.38,3.075,'#525d4d');}
  box(3.6,.055,.67,12.3,.94,3.4,'#e4ddcb');box(2.8,.35,.035,12.1,1.0,3.74,'#d4d3b9');
  round(.55,.015,.45,11.4,.976,3.38,'#999f95',.07);round(.43,.01,.34,11.4,.993,3.38,'#586963',.07);
  const curve=new THREE.CatmullRomCurve3([new THREE.Vector3(11.4,1,3.62),new THREE.Vector3(11.4,1.28,3.62),new THREE.Vector3(11.4,1.31,3.44),new THREE.Vector3(11.4,1.21,3.42)]);mesh(new THREE.TubeGeometry(curve,16,.018,8,false),material('#686d5f',{metalness:.6,roughness:.3}));
  box(.53,.02,.49,12.6,.976,3.4,'#343b34');for(const xx of [-.14,.14])for(const zz of [-.12,.12])cyl(.083,.012,12.6+xx,1,3.4+zz,'#71746a');box(.53,.36,.02,12.6,.40,3.075,'#3b443b');box(.38,.025,.04,12.6,.70,3.05,'#929b89');
  for(let i=0;i<3;i++){box(.57,.65,.30,11.4+i*.6,1.63,3.56,palette.wall);box(.51,.012,.03,11.4+i*.6,1.68,3.39,palette.wood);}box(.6,.1,.46,12.6,1.65,3.48,palette.wood);
  cyl(.075,.20,13.13,1,3.57,'#d0bd9e');cyl(.06,.25,13.3,1,3.57,'#d6c3a4');
  dining(11.65,1.45,1.9,.9,6);
 }
 function bathroom(){
  round(.77,.58,1.7,4.4,.04,6.50,'#efeee5',.15);round(.58,.014,1.47,4.4,.625,6.50,'#bbc6bc',.18);round(.48,.02,1.33,4.4,.64,6.50,'#dae0d5',.18);
  box(1.13,.7,.50,5.53,.13,7.30,palette.wood);round(1.17,.07,.55,5.53,.83,7.30,'#efeee4',.03);round(.65,.025,.35,5.53,.91,7.28,'#aebcaf',.14);toilet(5.80,5.96,Math.PI/2);
  box(1.02,.08,1.0,11.64,.02,5.32,'#eaeae2');box(1.03,1.6,.035,11.64,.1,4.82,material('#d4e4dd',{transparent:true,opacity:.25,roughness:.15}));box(.035,1.6,1,12.15,.1,5.32,material('#d4e4dd',{transparent:true,opacity:.25,roughness:.15}));line([12.15,.1,4.82],[12.15,1.7,4.82],'#899a8a');
  box(1.1,.74,.52,13.22,.10,5.63,palette.wood);round(1.15,.06,.56,13.22,.85,5.63,'#efeee4',.03);round(.61,.025,.36,13.22,.92,5.61,'#aebcaf',.13);toilet(13.78,4.42,Math.PI/2);
 }
 function toilet(x,z,rot){const g=group(x,z,rot);round(.39,.36,.5,0,.02,.05,'#eeeee7',.13,g);round(.45,.08,.65,0,.38,.07,'#f8f6ee',.16,g);round(.28,.012,.37,0,.465,.1,'#d5d9cc',.12,g);box(.40,.55,.16,0,.1,-.25,'#e7e9e0',g);}
 function flexRoom(){round(1.13,.34,2.03,4.01,.13,2.2,palette.fabric,.10);round(1.08,.16,1.96,4.01,.48,2.2,'#e4dfd1',.1);round(.9,.14,.45,4.01,.65,1.51,palette.accent,.09);box(1.75,.07,.60,4.94,.74,.59,palette.wood);for(const xx of [4.2,5.69])box(.05,.74,.45,xx,0,.59,palette.wood);box(.55,.34,.055,4.96,.90,.49,'#404b41');box(.20,.03,.20,4.96,.81,.54,'#586153');chair(5.01,1.20,0);box(.6,1.7,1.25,6,.03,2.92,palette.wall);for(let i=0;i<4;i++)box(.61,.055,1.27,6,.40+i*.40,2.92,palette.wood);plant(5.95,.57,.65);}
 function addLabels(layout){labelLayer.replaceChildren();labels=[];for(const room of layout.rooms){if(['hall','shower'].includes(room.id)||room.id==='room3'&&!layout.masterSuite)continue;const el=document.createElement('div');el.className='room-label';el.textContent=room.id==='storage'?'Гардероб у входа':room.name;const small=document.createElement('small');small.textContent=room.area.toLocaleString('ru-RU')+' м²';el.append(small);el.addEventListener('click',()=>selectRoom(room.id));labelLayer.append(el);labels.push({el,pos:new THREE.Vector3(room.x+room.w/2,.10,room.z+room.d*.78),id:room.id});}}
 function selectRoom(id){selected=id;const room=getLayout(state.variant).rooms.find(r=>r.id===id);if(room)onRoom(room);labels.forEach(l=>l.el.classList.toggle('selected',l.id===id));}
 function rebuild(s){
  state={...s};palette=palettes[s.palette];if(root){root.traverse(o=>{o.geometry?.dispose();if(o.material){for(const mat of Array.isArray(o.material)?o.material:[o.material]){mat.map?.dispose();mat.dispose();}}});scene.remove(root);}root=new THREE.Group();scene.add(root);roomFloors=[];
  const outline=[[3.2,-.15],[14.25,-.15],[14.25,6.06],[8.05,6.06],[8.05,7.76],[3.75,7.76],[3.75,5.45],[-.15,5.45],[-.15,1.25],[3.2,1.25]];const shape=new THREE.Shape();outline.forEach(([x,z],i)=>i?shape.lineTo(x,-z):shape.moveTo(x,-z));shape.closePath();const geo=new THREE.ExtrudeGeometry(shape,{depth:.20,bevelEnabled:false});geo.rotateX(-Math.PI/2);const slab=mesh(geo,material('#c4c8b9'));slab.position.y=-.2;
  const floorMat=material(palette.floor,{map:floorTexture()});const layout=getLayout(s.variant);
  box(7.7,.026,1.46,7.2,0,4.60,material(palette.tile));box(2.85,.026,2.01,9.475,0,4.905,palette.tile);
  for(const r of layout.rooms){if(r.id==='hall')continue;const wet=['bath','shower','storage'].includes(r.id);const m=box(r.w,.026,r.d,r.x+r.w/2,0,r.z+r.d/2,wet?palette.tile:floorMat);m.userData.roomId=r.id;roomFloors.push(m);if(wet){for(let x=r.x+.60;x<r.x+r.w;x+=.6)line([x,.028,r.z],[x,.028,r.z+r.d],'#bcbfae');for(let z=r.z+.60;z<r.z+r.d;z+=.6)line([r.x,.028,z],[r.x+r.w,.028,z],'#bcbfae');}}
  // Full-height curved glazing follows the plan; retained piers are not certified structural.
  const railing=[[-.15,4.75],[-.45,3.4],[-.76,2.1],[-1.10,.8],[-1.16,.48],[-1.08,.25],[-.90,.10],[-.62,0],[.35,0],[1.3,0],[2.25,0],[3.2,0]];
  const bshape=new THREE.Shape();railing.forEach(([x,z],i)=>i?bshape.lineTo(x,-z):bshape.moveTo(x,-z));bshape.lineTo(3.2,-1.33);bshape.lineTo(-.15,-1.33);bshape.closePath();const bg=new THREE.ExtrudeGeometry(bshape,{depth:.16,bevelEnabled:false});bg.rotateX(-Math.PI/2);const bs=mesh(bg,layout.warmBalcony?floorMat:material('#c6cbb9'));bs.position.y=-.135;
  for(let i=1;i<railing.length;i++){const a=railing[i-1],b=railing[i];wall(...a,...b,{height:2.65,thick:.025,color:material('#c6dedb',{transparent:true,opacity:.15,roughness:.12,depthWrite:false})});for(const y of [.06,1.08,2.67])line([a[0],y,a[1]],[b[0],y,b[1]],'#536258');box(.045,2.67,.045,a[0],0,a[1],'#536258');}
  box(.045,2.67,.045,3.2,0,0,'#536258');box(.20,2.75,.26,-.76,0,2.1,palette.wall);
  if(s.furniture){plant(2.78,.59,.60);cyl(.25,.42,1.48,.01,.62,palette.wood);chair(.73,.70,-Math.PI/2);}
  // Exterior, with tall windows reflecting the walkthrough.
  segmentedWall(3.2,14.25,0,[[4.20,5.43,'window'],[7.34,8.57,'window'],[10.50,11.77,'window'],[12.63,13.36,'window']],true);
  wall(14.2,0,14.2,6.0,{thick:.22});wall(8.05,6.0,8.75,6.0,{thick:.22});wall(9.75,6.0,14.2,6.0,{thick:.22});wall(8.05,6.0,8.05,7.69,{thick:.22});wall(3.82,7.69,8.05,7.69,{thick:.22});wall(3.82,5.38,3.82,7.69,{thick:.22});wall(-.075,5.38,3.82,5.38,{thick:.22});
  wall(-.075,1.35,-.075,3.55,{thick:.22});wall(-.075,4.75,-.075,5.38,{thick:.22});windowUnit(-.075,4.15,1.20,Math.PI/2);
  if(layout.warmBalcony)segmentedWall(-.075,3.27,1.33,[[1.3,3.0,'open']]);
  else{segmentedWall(-.075,3.27,1.33,[[1.3,2.25,'window'],[2.25,3.0,'door']]);door(2.25,1.33,.75);}
  wall(3.27,0,3.27,3.78,{thick:.2});wall(3.27,4.70,3.27,5.38,{thick:.2});door(3.27,3.78,.92,-Math.PI/2,1);
  wall(6.425,0,6.425,3.82);
  if(layout.masterSuite){
   // Open dressing into a private vestibule, keeping the existing bedroom opening.
   wall(3.27,3.82,3.62,3.82);wall(6.08,3.82,6.425,3.82);
   wall(6.425,3.82,6.425,4.04);wall(6.425,4.98,6.425,5.38);door(6.425,4.04,.94,-Math.PI/2,1);
   box(3.02,.028,1.46,4.84,.001,4.60,floorMat);
  }else{segmentedWall(3.27,6.425,3.82,[[4.25,5.10]]);door(4.25,3.82,.85,0,1);}
  if(layout.access.kitchenPartition)wall(9.57,0,9.57,3.82);
  segmentedWall(6.425,9.57,3.82,layout.access.formerRoomDoor?[[7.35,8.23]]:[]);
  if(layout.access.formerRoomDoor)door(8.23,3.82,.88,Math.PI,-1);
  segmentedWall(9.57,14.2,3.82,[[9.62,10.44]]);door(9.62,3.82,.82,0,1);
  segmentedWall(3.82,8.0,5.38,[[4.72,5.58]]);wall(6.325,5.38,6.325,7.69);wall(7.98,5.38,7.98,5.93);wall(7.98,6.7,7.98,7.69);wall(6.33,7.05,7.98,7.05);box(1.5,.25,.55,7.15,.01,7.37,'#b7baa9');
  wall(10.98,4.72,10.98,6.0);wall(10.98,3.82,10.98,3.98);
  const storage=layout.access.storage;door(storage.x,storage.z,storage.width,-Math.PI/2,-1);
  door(4.72,5.38,.86);door(10.98,3.98,.74,-Math.PI/2,-1);door(8.75,6,1);
  if(s.furniture){bed();if(layout.masterSuite)masterDressing();else flexRoom();kitchen();bathroom();
   if(layout.access.kitchenPartition){sofa(7.10,1.70,Math.PI/2,2.10);rug(8.0,1.85,2.35,2.50);coffee(8.12,1.8);box(.30,.38,1.60,9.28,.10,1.80,palette.wood);box(.065,.75,1.25,9.34,.72,1.80,'#39483a');}
   else{rug(7.97,2.03,2.8,2.8);sofa(7.98,.91);coffee(7.92,2.24);box(2.10,.38,.32,7.96,.10,3.45,palette.wood);box(1.30,.75,.065,7.96,.72,3.5,'#39483a');plant(8.99,3.05,.68);}
   box(.54,2.18,1.3,10.61,.04,5.10,palette.wall);box(1.13,.45,.42,8.88,.02,5.72,palette.wood);round(1.1,.07,.42,8.88,.47,5.72,palette.fabric,.06);for(let i=0;i<4;i++)box(.42,.045,1.20,6.70,.3+i*.45,6.18,palette.wood);plant(13.66,.43,.9);}
  addLabels(layout);selectRoom(layout.rooms.some(r=>r.id===selected)?selected:'living');render();
 }
 function setView(view){
  const target=view==='kitchen'?new THREE.Vector3(10.4,.35,1.95):new THREE.Vector3(6.5,.35,3.55);
  const direction=(view==='top'?new THREE.Vector3(0,1,.001):view==='kitchen'?new THREE.Vector3(.15,.74,.65):new THREE.Vector3(.40,.68,.62)).normalize();
  const right=new THREE.Vector3().crossVectors(new THREE.Vector3(0,1,0),direction).normalize();
  const up=new THREE.Vector3().crossVectors(direction,right).normalize();
  const bounds=view==='kitchen'?[[6.4,0,-.2],[14.4,2.75,4.0]]:[[-1.4,0,-.2],[14.4,2.75,7.9]];
  const tanV=Math.tan(THREE.MathUtils.degToRad(camera.fov/2)),tanH=tanV*camera.aspect;
  let distance=5;
  for(const x of [bounds[0][0],bounds[1][0]])for(const y of [bounds[0][1],bounds[1][1]])for(const z of [bounds[0][2],bounds[1][2]]){
   const p=new THREE.Vector3(x,y,z).sub(target);distance=Math.max(distance,p.dot(direction)+Math.abs(p.dot(right))/tanH,p.dot(direction)+Math.abs(p.dot(up))/tanV);
  }
  controls.target.copy(target);camera.position.copy(target).addScaledVector(direction,distance*1.13);camera.updateProjectionMatrix();controls.update();render();
 }
 function render(){renderer.render(scene,camera);for(const l of labels){const pos=l.pos.clone().project(camera);const visible=pos.z>-1&&pos.z<1&&Math.abs(pos.x)<.96&&Math.abs(pos.y)<.96;l.el.style.display=visible?'':'none';l.el.style.left=((pos.x+1)/2*container.clientWidth)+'px';l.el.style.top=((-pos.y+1)/2*container.clientHeight)+'px';}}
 function resize(){const w=container.clientWidth,h=container.clientHeight;renderer.setSize(w,h,false);camera.aspect=w/h;camera.updateProjectionMatrix();if(state)setView(state.view);else render();}
 const observer=new ResizeObserver(resize);observer.observe(container);controls.addEventListener('change',render);
 let raf;function animate(){raf=requestAnimationFrame(animate);controls.update();}animate();
 let down;container.addEventListener('pointerdown',e=>{down=[e.clientX,e.clientY];});container.addEventListener('pointerup',e=>{if(!down||Math.hypot(e.clientX-down[0],e.clientY-down[1])>5||e.target!==renderer.domElement)return;const r=container.getBoundingClientRect();const pointer=new THREE.Vector2((e.clientX-r.left)/r.width*2-1,-(e.clientY-r.top)/r.height*2+1);const ray=new THREE.Raycaster();ray.setFromCamera(pointer,camera);const hit=ray.intersectObjects(roomFloors)[0];if(hit)selectRoom(hit.object.userData.roomId);});
 container.addEventListener('keydown',e=>{const keys=['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','+','=','-'];if(!keys.includes(e.key))return;e.preventDefault();const delta=camera.position.clone().sub(controls.target);const spherical=new THREE.Spherical().setFromVector3(delta);if(e.key==='ArrowLeft')spherical.theta-=.12;if(e.key==='ArrowRight')spherical.theta+=.12;if(e.key==='ArrowUp')spherical.phi=Math.max(.01,spherical.phi-.1);if(e.key==='ArrowDown')spherical.phi=Math.min(1.50,spherical.phi+.1);if(e.key==='+'||e.key==='=')spherical.radius=Math.max(5,spherical.radius*.9);if(e.key==='-')spherical.radius=Math.min(35,spherical.radius*1.1);camera.position.copy(controls.target).add(new THREE.Vector3().setFromSpherical(spherical));controls.update();render();});
 return {rebuild,setView,resize,capture(){render();const c=document.createElement('canvas');c.width=renderer.domElement.width;c.height=renderer.domElement.height;const ctx=c.getContext('2d');ctx.fillStyle='#eeeee7';ctx.fillRect(0,0,c.width,c.height);ctx.drawImage(renderer.domElement,0,0);ctx.fillStyle='#596b51';ctx.font=`${Math.max(15,c.width/65)}px Arial`;ctx.fillText('КВАРТИРА · Эскиз 02 / '+({original:'Исходная схема',table:'Большой стол',master:'Мастер-спальня'}[state.variant]),c.width*.03,c.height*.95);return c.toDataURL('image/png');},destroy(){cancelAnimationFrame(raf);observer.disconnect();controls.dispose();renderer.dispose();}};
}
