import * as T from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {room,fixtures,shaft,toilet,door,niche,showerSystem,lights,scenarios,designs,arrangements,towelWarmer} from './bathroom-data.js?v=5';

// All finishes and exported images use this same measurable geometry.
export function createBathroom(container){
 const scene=new T.Scene();scene.background=new T.Color('#e9e7e1');
 const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.18;
 container.append(renderer.domElement);renderer.domElement.setAttribute('aria-label','Измеряемая 3D-модель санузла');
 const camera=new T.PerspectiveCamera(43,1,.02,60),planCamera=new T.OrthographicCamera(-3,3,3,-3,.02,60);
 planCamera.position.set(1.065,9,1.14);planCamera.up.set(0,0,-1);planCamera.lookAt(1.065,0,1.14);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=.3;controls.maxDistance=11;controls.maxPolarAngle=Math.PI*.495;
 const root=new T.Group();scene.add(root);let activeView='iso',activeDesign='',activeArrangement='cabinet',currentLight='day';
 const mat=(c,p={})=>new T.MeshStandardMaterial({color:c,roughness:.7,...p});
 function mesh(g,m,parent=root){const o=new T.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function box(w,h,d,x,y,z,m,parent=root){const o=mesh(new T.BoxGeometry(w,h,d),typeof m==='string'?mat(m):m,parent);o.position.set(x,y+h/2,z);return o;}
 function cyl(r,h,x,y,z,m,parent=root){const o=mesh(new T.CylinderGeometry(r,r,h,40),typeof m==='string'?mat(m):m,parent);o.position.set(x,y+h/2,z);return o;}
 function rounded(w,h,d,x,y,z,m,r=.05,parent=root){const s=new T.Shape(),a=-w/2,b=-d/2;s.moveTo(a+r,b);s.lineTo(a+w-r,b);s.quadraticCurveTo(a+w,b,a+w,b+r);s.lineTo(a+w,b+d-r);s.quadraticCurveTo(a+w,b+d,a+w-r,b+d);s.lineTo(a+r,b+d);s.quadraticCurveTo(a,b+d,a,b+d-r);s.lineTo(a,b+r);s.quadraticCurveTo(a,b,a+r,b);const g=new T.ExtrudeGeometry(s,{depth:h,bevelEnabled:true,bevelSize:.003,bevelThickness:.003,bevelSegments:2,curveSegments:12});g.rotateX(-Math.PI/2);const o=mesh(g,m,parent);o.position.set(x,y,z);return o;}
 function tube(points,r,m,parent=root){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p)),false,'catmullrom',.1),48,r,12,false),m,parent);}
 const textures=new Map();
 function texture(kind){if(textures.has(kind))return textures.get(kind);const c=document.createElement('canvas');c.width=c.height=768;const x=c.getContext('2d');x.fillStyle='#eeeeea';x.fillRect(0,0,768,768);let seed=73;const rand=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
  for(let i=0;i<16000;i++){const v=150+Math.floor(rand()*90);x.fillStyle=`rgba(${v},${v},${v},.07)`;x.fillRect(rand()*768,rand()*768,rand()*3+1,rand()*2+1);}
  if(kind==='wood'){for(let i=0;i<300;i++){x.strokeStyle=i%3?'#4d39271c':'#ffffff35';x.lineWidth=rand()*1.4+.2;x.beginPath();const base=rand()*768;for(let y=0;y<=768;y+=12){const xx=base+Math.sin(y*.01+i)*3+Math.sin(y*.03+i)*.4;y?x.lineTo(xx,y):x.moveTo(xx,y);}x.stroke();}}
  if(kind==='marble'){for(let i=0;i<11;i++){x.strokeStyle=i%3?'#756f631a':'#756f632a';x.lineWidth=rand()*1.1+.3;x.beginPath();for(let y=0;y<800;y+=8){const xx=i*129-y*.56+Math.sin(y*.009+i)*34+Math.sin(y*.033+i)*6;y?x.lineTo(xx,y):x.moveTo(xx,y);}x.stroke();}}
  if(kind==='travertine'){for(let i=0;i<160;i++){x.fillStyle=i%3?'#75694710':'#ffffff33';x.fillRect(0,rand()*768,768,rand()*3+.3);}}
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;t.anisotropy=renderer.capabilities.getMaxAnisotropy();textures.set(kind,t);return t;}
 const stone=mat('#eee9df'),floor=mat('#ddd7c9'),wood=mat('#ad8861',{map:texture('wood')}),facade=mat('#484c48'),vanityMaterial=mat('#484c48'),accent=mat('#cfcaba'),eastMaterial=mat('#ad8861'),metal=mat('#252925',{roughness:.43,metalness:.22}),ceramic=mat('#f5f3ee',{roughness:.22}),dark=mat('#30352e');
 const glass=new T.MeshPhysicalMaterial({color:'#e6f0ec',roughness:.06,transparent:true,opacity:.105,side:T.DoubleSide,depthWrite:false});
 box(room.width,.12,room.depth,room.width/2,-.12,room.depth/2,floor);
 const walls={north:new T.Group(),east:new T.Group(),south:new T.Group(),west:new T.Group()};Object.values(walls).forEach(g=>root.add(g));
 box(2.97,2.65,.10,1.485,0,-.05,stone,walls.north);box(.10,2.65,2.28,3.02,0,1.14,eastMaterial,walls.east);box(2.97,2.65,.10,1.485,0,2.33,stone,walls.south);
 box(.10,2.65,.82,-.05,0,.41,stone,walls.west);box(.10,2.65,.66,-.05,0,1.95,stone,walls.west);box(.10,.55,.8,-.05,2.1,1.22,stone,walls.west);
 const southCut=box(2.97,.10,.10,1.485,0,2.33,stone),westCuts=[box(.10,.10,.82,-.05,0,.41,stone),box(.10,.10,.66,-.05,0,1.95,stone)];
 const joints=mat('#b6b2a6');for(let x=.6;x<2.97;x+=.6)box(.002,.001,2.28,x,.001,1.14,joints);for(let z=1.2;z<2.28;z+=1.2)box(2.97,.001,.002,1.485,.001,z,joints);
 const tileJoints=new T.Group();walls.east.add(tileJoints);for(let z=.10;z<2.28;z+=.10)box(.001,2.65,.002,2.967,0,z,joints,tileJoints);for(let y=.30;y<2.65;y+=.30)box(.001,.002,2.28,2.967,y,1.14,joints,tileJoints);
 // Protected shaft unchanged; complete cabinet fronts end at z=.503.
 box(shaft.w,room.ceiling,shaft.d,shaft.x,0,shaft.z,stone);
 const cab=fixtures.find(f=>f.id==='cabinet'),front=cab.z+cab.d/2;
 box(cab.w-.018,2.57,cab.d-.022,cab.x,.075,cab.z-.011,facade);box(cab.w-.09,.075,cab.d-.07,cab.x,0,cab.z-.035,dark);
 for(let i=0;i<3;i++){const x=cab.x-cab.w/2+(i+.5)*cab.w/3;box(cab.w/3-.006,2.55,.02,x,.08,front-.01,facade);box(.006,.58,.003,x+cab.w/6-.025,.99,front-.0015,dark);}
 // Five open shelves in the 354 mm bay to the RIGHT of the shaft.
 box(niche.w,2.65,.012,niche.x,0,.006,accent);const shelfMaterial=mat('#d4caba');
 for(const [i,y] of niche.shelves.entries()){
  box(niche.w-.012,.025,niche.d-.025,niche.x,y,niche.z-.0125,shelfMaterial);
  if(i===1||i===3){for(let j=0;j<2;j++){cyl(.027,.14+j*.035,niche.x-.06+j*.095,y+.025,.30,j?metal:ceramic);cyl(.012,.025,niche.x-.06+j*.095,y+.165+j*.035,.30,metal);}}
  else{for(let j=0;j<2;j++)rounded(.25,.055,.21,niche.x,y+.025+j*.057,.28,mat(i===2?'#b9bcae':'#e1dbcc'),.025);}
 }
 for(let i=0;i<5;i++)box(.17,.004,.004,shaft.x,2.42+i*.016,front+.003,metal);
 const v=fixtures.find(f=>f.id==='vanity'),vanityStart=root.children.length;const vanityBody=rounded(v.w,.46,v.d,v.x,.34,v.z,vanityMaterial,.014);const vanityCounter=box(v.w,.032,v.d,v.x,.802,v.z,stone);
 for(const y of [.37,.59])box(v.w-.02,.008,.006,v.x,y,v.z-v.d/2-.003,dark);
 const bowlProfile=[[0,0],[.16,0],[.24,.027],[.28,.08],[.30,.14],[.30,.15],[.285,.15],[.263,.085],[.22,.036],[0,.029]].map(p=>new T.Vector2(...p));
 const basin=mesh(new T.LatheGeometry(bowlProfile,64),ceramic);basin.scale.z=.64;basin.position.set(v.x,.835,v.z-.014);cyl(.023,.003,v.x,.866,v.z-.014,metal);
 tube([[v.x,1.09,2.255],[v.x,1.09,2.14],[v.x,1.075,2.06]],.014,metal);box(.19,.07,.012,v.x,1.057,2.263,metal);
 const vanityParts=root.children.slice(vanityStart);const vanityOrigins=vanityParts.map(o=>o.position.z);
 const mirrorGroup=new T.Group();root.add(mirrorGroup);const frame=mesh(new T.CylinderGeometry(.40,.40,.027,80),metal,mirrorGroup);frame.rotation.x=Math.PI/2;frame.position.set(v.x,1.63,2.255);
 const mirror=mesh(new T.CircleGeometry(.386,80),mat('#dbe0dc',{roughness:.025,metalness:1}),mirrorGroup);mirror.rotation.y=Math.PI;mirror.position.set(v.x,1.63,2.239);
 const cubeTarget=new T.WebGLCubeRenderTarget(256),cubeCamera=new T.CubeCamera(.05,20,cubeTarget);cubeCamera.position.set(v.x,1.63,2.18);scene.add(cubeCamera);mirror.material.envMap=cubeTarget.texture;mirror.material.envMapIntensity=1;
 const socketGroup=new T.Group();root.add(socketGroup);box(.110,.090,.012,.790,1.055,2.269,ceramic,socketGroup);for(const x of [.763,.817]){const socket=mesh(new T.CircleGeometry(.021,24),mat('#babcb7'),socketGroup);socket.rotation.y=Math.PI;socket.position.set(x,1.10,2.262);}
 const install=fixtures.find(f=>f.id==='installation');box(install.w,1.15,install.d,install.x,0,install.z,stone);box(install.w,.018,install.d,install.x,1.15,install.z,stone);
 const joinery=new T.Group(),showerWall=new T.Group();root.add(joinery,showerWall);
 // Join the vanity and WC casing without moving the basin or reducing the doorway.
 box(.170,1.150,.200,.935,0,2.180,stone,joinery);
 box(1.020,.018,.200,.510,1.150,2.180,stone,joinery);
 box(1.100,1.500,.200,2.420,1.150,2.180,stone,showerWall);box(1.100,2.650,.008,2.420,0,2.075,eastMaterial,showerWall);
 const southTileJoints=new T.Group();showerWall.add(southTileJoints);for(let x=1.97;x<2.97;x+=.10)box(.002,2.65,.001,x,0,2.070,joints,southTileJoints);for(let y=.30;y<2.65;y+=.30)box(1.1,.002,.001,2.42,y,2.070,joints,southTileJoints);
 const unifiedWall=new T.Group(),upperStorage=new T.Group();root.add(unifiedWall,upperStorage);
 const unified=arrangements.cabinet,c=unified.upperCabinet,frontPlane=c.z-c.d/2;
 // Finished wall faces and cabinet fronts all end at z=2.080, including surface thickness.
 box(.850,2.650,.200,.425,0,2.180,stone,unifiedWall);
 box(1.020,1.168,.200,1.360,0,2.180,stone,unifiedWall);
 box(1.100,2.650,.200,2.420,0,2.180,stone,unifiedWall);
 // Two shallow compartments. Door thickness is INCLUDED in the 200 mm overall depth.
 box(c.w-.012,c.h-.012,.012,c.x,c.y+.006,2.274,facade,upperStorage);
 for(const x of [c.x-c.w/2+.009,c.x,c.x+c.w/2-.009])box(.018,c.h-.012,.174,x,c.y+.006,2.181,facade,upperStorage);
 for(const y of [c.y+.009,1.65,2.13,2.641])box(c.w-.024,.018,.174,c.x,y-.009,2.181,facade,upperStorage);
 for(let i=0;i<2;i++)box(c.w/2-.004,c.h-.008,.020,c.x-c.w/4+i*c.w/2,c.y+.004,frontPlane+.010,facade,upperStorage);
 const wc=toilet,wcProfile=[[0,0],[.105,0],[.17,.12],[.18,.25],[.153,.26],[.142,.16],[.07,.08],[0,.08]].map(p=>new T.Vector2(...p));
 const wcBody=mesh(new T.LatheGeometry(wcProfile,64),ceramic);wcBody.scale.z=1.45;wcBody.position.set(wc.x,.18,wc.z);const seat=mesh(new T.TorusGeometry(.168,.017,16,72),ceramic);seat.rotation.x=Math.PI/2;seat.scale.y=1.47;seat.position.set(wc.x,.46,wc.z);
 rounded(.31,.055,.15,wc.x,.426,wc.z+.19,ceramic,.035);box(.23,.14,.015,wc.x,.85,2.07,metal);
 for(const x of [wc.x-.05,wc.x+.052]){const plate=mesh(new T.CircleGeometry(.032,32),metal);plate.rotation.y=Math.PI;plate.position.set(x,.922,2.06);}
 const shower=fixtures.find(f=>f.id==='shower-tray');box(shower.w,.015,shower.d,shower.x,.001,shower.z,floor);box(.73,.003,.035,2.44,.018,1.99,metal);for(let i=0;i<22;i++)box(.002,.002,.025,2.10+i*.032,.021,1.99,dark);
 const glassGroup=new T.Group();root.add(glassGroup);const panel=box(.008,2.12,.8,1.874,.02,.903,glass,glassGroup);panel.castShadow=false;
 for(const z of [.503,1.303])box(.009,2.14,.009,1.874,0,z,metal,glassGroup);box(.009,.009,.80,1.874,2.14,.903,metal,glassGroup);
 const showerPivot=new T.Group(),showerGroup=new T.Group();root.add(showerPivot);showerPivot.add(showerGroup);showerGroup.position.set(-showerSystem.x,0,-showerSystem.z);
 const sh=showerSystem; // System is mounted on the east/right wall, not on the shaft.
 tube([[sh.x,sh.mixerHeight,sh.z],[sh.x,sh.headHeight,sh.z],[sh.headX,sh.headHeight,sh.z]],.012,metal,showerGroup);
 cyl(.112,.015,sh.headX,sh.headHeight-.025,sh.z,metal,showerGroup);for(let x=-2;x<=2;x++)for(let z=-2;z<=2;z++)if(x*x+z*z<7)cyl(.0025,.002,sh.headX+x*.033,sh.headHeight-.028,sh.z+z*.033,dark,showerGroup);
 box(.046,.05,.24,sh.x-.015,sh.mixerHeight,sh.z,metal,showerGroup);tube([[sh.x,1.12,sh.z+.09],[sh.x-.07,.65,sh.z+.14],[sh.x-.06,.68,sh.z+.30],[sh.x,1.43,sh.z+.24]],.006,metal,showerGroup);tube([[sh.x,1.41,sh.z+.24],[sh.x-.025,1.59,sh.z+.24]],.016,metal,showerGroup);
 const heaterGroup=new T.Group();root.add(heaterGroup);const tw=towelWarmer;
 // Concept envelope, not a product-specific installation model. Mounted on west wall.
 for(const z of [tw.z-tw.w/2+.012,tw.z+tw.w/2-.012]){
  cyl(.012,tw.h,tw.x,tw.y,z,metal,heaterGroup);
  for(const y of [tw.y+.08,tw.y+tw.h-.08])tube([[.008,y,z],[tw.x,y,z]],.010,metal,heaterGroup);
 }
 for(const y of [1.29,1.44,1.59,1.79,2.01])tube([[tw.x,y,tw.z-tw.w/2],[tw.x,y,tw.z+tw.w/2]],.009,metal,heaterGroup);
 const cloth=mat('#c7bca7',{roughness:1});box(.014,.69,.28,.082,1.10,tw.z,cloth,heaterGroup);
 for(let i=0;i<8;i++)box(.002,.65,.001,.090,1.12,tw.z-.12+i*.034,mat(i%2?'#d4c8b1':'#b9ae99'),heaterGroup);
 box(.025,.055,.045,.053,tw.y-.015,1.711,metal,heaterGroup);
 const doorGroup=new T.Group();doorGroup.position.set(-.035,0,door.hingeZ);doorGroup.rotation.y=Math.PI/2;root.add(doorGroup);box(.035,2.10,.8,0,0,-.4,facade,doorGroup);box(.04,.018,.115,.024,1.0,-.68,metal,doorGroup);
 box(.80,.4,.45,-.54,0,2.055,wood);const ceiling=box(2.97,.07,2.28,1.485,2.65,1.14,mat('#eeece5'));
 const emitters=[],ceilingFixtures=new T.Group();root.add(ceilingFixtures);
 for(const l of lights){const bulb=mat('#fff1d5',{emissive:'#ffdeae',emissiveIntensity:1});let visual;
  if(['general','shower'].includes(l.group)){const housing=cyl(.044,.025,l.x,2.619,l.z,metal,ceilingFixtures);housing.castShadow=false;visual=cyl(.033,.006,l.x,2.615,l.z,bulb,ceilingFixtures);visual.castShadow=false;}
  else if(l.group==='mirror'){visual=mesh(new T.TorusGeometry(.395,.006,8,80),bulb,mirrorGroup);visual.position.set(v.x,1.63,2.233);}
  else if(l.group==='niche')visual=box(.006,2.19,.01,l.x,.22,l.z,bulb);
  else visual=box(l.group==='night'?.76:.009,.009,l.group==='night'?.014:1.48,l.x,l.h,l.z,bulb);
  const point=new T.PointLight('#ffe2b6',0,4,2);point.position.set(l.group==='niche'?niche.x:l.x,l.h-.06,l.group==='mirror'?2.05:l.group==='niche'?.40:l.z);root.add(point);emitters.push({visual,point,group:l.group});}
 const ambient=new T.HemisphereLight('#fff8ec','#b4aa97',1);scene.add(ambient);const sun=new T.DirectionalLight('#fff8ec',1.2);sun.position.set(1.3,6,4);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);Object.assign(sun.shadow.camera,{left:-4,right:4,top:4,bottom:-4});sun.shadow.normalBias=.012;scene.add(sun);
 function reflection(){const visible=mirrorGroup.visible;mirrorGroup.visible=false;cubeCamera.update(renderer,scene);mirrorGroup.visible=visible;}
 function lighting(mode){currentLight=mode;const s=scenarios[mode]||scenarios.day;ambient.intensity=s.ambient;sun.intensity=mode==='day'?1.1:mode==='evening'?.32:.055;emitters.forEach(e=>{const intensity=s[e.group];e.visual.material.emissiveIntensity=intensity*2;e.point.intensity=intensity*(e.group==='general'?1.9:e.group==='niche'?.45:.85);});reflection();}
 function design(key){if(key===activeDesign)return;activeDesign=key;const p=designs[key]||designs.stone;stone.color.set(p.wall);floor.color.set(p.floor);facade.color.set(p.cabinet);facade.map=['olive','clay'].includes(key)?texture('wood'):null;facade.needsUpdate=true;vanityMaterial.color.set(key==='stone'?p.cabinet:p.wood);vanityMaterial.map=key==='stone'?null:texture('wood');vanityMaterial.needsUpdate=true;wood.color.set(p.wood);accent.color.set(p.accent);metal.color.set(p.metal);shelfMaterial.color.set(p.wall);stone.map=floor.map=texture(p.surface);eastMaterial.color.set(p.shower==='wood'?p.wood:['tile','clay'].includes(p.shower)?p.accent:p.wall);eastMaterial.map=texture(p.shower==='wood'?'wood':p.shower==='tile'?'limestone':p.surface);tileJoints.visible=southTileJoints.visible=p.shower==='tile';[stone,floor,eastMaterial].forEach(m=>m.needsUpdate=true);reflection();}
 function resize(){const b=container.getBoundingClientRect();renderer.setSize(b.width,b.height,false);camera.aspect=b.width/b.height;camera.updateProjectionMatrix();const w=Math.max(4.4,3.2*camera.aspect),h=w/camera.aspect;Object.assign(planCamera,{left:-w/2,right:w/2,top:h/2,bottom:-h/2});planCamera.updateProjectionMatrix();}
 function view(kind){activeView=kind;const interior=['door','shower','vanity','wall','joinery','detail','towel'].includes(kind);showerWall.visible=activeArrangement==='protected'&&interior;unifiedWall.visible=upperStorage.visible=activeArrangement==='cabinet'&&interior;walls.west.visible=interior;walls.south.visible=interior;walls.east.visible=kind!=='top';walls.north.visible=kind!=='top';southCut.visible=!interior;westCuts.forEach(o=>o.visible=!interior);doorGroup.visible=!interior;ceiling.visible=interior;ceilingFixtures.visible=interior;mirrorGroup.visible=interior;glassGroup.visible=true;controls.enabled=kind!=='top';controls.enableRotate=kind!=='top';const compact=container.clientWidth<600;camera.fov=43;
  if(kind==='door'){camera.position.set(.03,1.60,1.24);controls.target.set(2.02,1.40,1.13);camera.fov=84;walls.west.visible=false;}
  else if(kind==='storage'){camera.position.set(1.55,1.38,compact?2.78:2.06);controls.target.set(1.55,1.35,.35);camera.fov=compact?84:86;}
  else if(kind==='niche'){camera.position.set(2.72,1.44,1.80);controls.target.set(2.793,1.39,.24);camera.fov=75;}
  else if(kind==='shower'){if(arrangements[activeArrangement].shower.wall==='south'){camera.position.set(1.83,1.60,.81);controls.target.set(2.42,1.35,2.07);camera.fov=80;}else{camera.position.set(1.52,1.58,2.05);controls.target.set(2.67,1.37,.69);camera.fov=74;walls.south.visible=false;}}
  else if(kind==='wall'){camera.position.set(1.47,1.43,.72);controls.target.set(1.49,1.35,2.17);camera.fov=compact?110:94;walls.north.visible=false;}
  else if(kind==='towel'){camera.position.set(1.14,1.65,1.19);controls.target.set(.065,1.60,1.85);camera.fov=compact?75:70;walls.north.visible=false;}
  else if(kind==='joinery'){camera.position.set(1.50,1.61,.91);controls.target.set(1.34,1.58,2.08);camera.fov=72;walls.north.visible=false;}
  else if(kind==='detail'){camera.position.set(.89,1.48,1.09);controls.target.set(.44,1.28,2.05);camera.fov=66;walls.north.visible=false;}
  else if(kind==='vanity'){camera.position.set(1.03,1.56,.70);controls.target.set(.72,1.18,2.16);camera.fov=78;walls.north.visible=false;}
  else{camera.position.set(1.45,compact?9.4:6.3,compact?4.8:3.9);controls.target.set(1.30,.65,1.07);}
  camera.updateProjectionMatrix();controls.update();reflection();}
 function arrangement(key){if(!Object.hasOwn(arrangements,key))key='cabinet';activeArrangement=key;const a=arrangements[key];glassGroup.position.z=a.screen.z1-.503;showerPivot.position.set(a.shower.x,0,a.shower.z);showerPivot.rotation.y=a.shower.wall==='south'?-Math.PI/2:0;joinery.visible=key==='protected';
  const flat=key==='cabinet';vanityParts.forEach((o,i)=>o.position.z=vanityOrigins[i]-(flat?(i<2||i===4||i===5?.15:i<4?.10:.20):0));
  vanityBody.scale.z=vanityCounter.scale.z=flat?.8:1;basin.scale.z=flat?.54:.64;
  socketGroup.position.z=flat?-.20:0;mirrorGroup.position.z=flat?-.20:0;cubeCamera.position.z=flat?1.98:2.18;
  for(const e of emitters){if(e.group==='mirror')e.point.position.z=flat?1.85:2.05;if(e.group==='night'){e.visual.position.z=flat?1.68:1.80;e.point.position.z=flat?1.68:1.80;}}
  view(activeView);}
 const observer=new ResizeObserver(()=>{resize();view(activeView);});observer.observe(container);resize();design('stone');arrangement('cabinet');view('wall');lighting('day');
 let running=true;function animate(){if(!running)return;requestAnimationFrame(animate);controls.update();renderer.render(scene,activeView==='top'?planCamera:camera);}animate();
 return {view,design,arrangement,lighting,capture(){renderer.render(scene,activeView==='top'?planCamera:camera);return renderer.domElement.toDataURL('image/png');},dispose(){running=false;observer.disconnect();controls.dispose();renderer.dispose();},get activeView(){return activeView;},get activeDesign(){return activeDesign;},get activeArrangement(){return activeArrangement;}};
}
