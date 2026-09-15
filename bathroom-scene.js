import * as T from 'three';
import {OrbitControls} from './vendor/OrbitControls.js';
import {room,fixtures,shaft,toilet,door,lights,scenarios} from './bathroom-data.js?v=2';

export function createBathroom(container){
 const scene=new T.Scene();scene.background=new T.Color('#e9e7e1');
 const renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});
 renderer.setPixelRatio(Math.min(devicePixelRatio,2));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;
 renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.15;
 container.append(renderer.domElement);renderer.domElement.setAttribute('aria-label','3D-модель санузла по размерному плану');
 const camera=new T.PerspectiveCamera(40,1,.025,60),planCamera=new T.OrthographicCamera(-3,3,3,-3,.025,60);
 planCamera.position.set(1.065,9,1.14);planCamera.up.set(0,0,-1);planCamera.lookAt(1.065,0,1.14);
 const controls=new OrbitControls(camera,renderer.domElement);controls.enableDamping=true;controls.minDistance=.3;controls.maxDistance=11;controls.maxPolarAngle=Math.PI*.49;
 const root=new T.Group();scene.add(root);let activeView='iso';
 const mat=(c,p={})=>new T.MeshStandardMaterial({color:c,roughness:.65,...p});
 function mesh(g,m,parent=root){const o=new T.Mesh(g,m);o.castShadow=true;o.receiveShadow=true;parent.add(o);return o;}
 function box(w,h,d,x,y,z,m,parent=root){const o=mesh(new T.BoxGeometry(w,h,d),typeof m==='string'?mat(m):m,parent);o.position.set(x,y+h/2,z);return o;}
 function cyl(r,h,x,y,z,m,parent=root){const o=mesh(new T.CylinderGeometry(r,r,h,32),typeof m==='string'?mat(m):m,parent);o.position.set(x,y+h/2,z);return o;}
 function rounded(w,h,d,x,y,z,m,r=.06,parent=root){const s=new T.Shape(),a=-w/2,b=-d/2;s.moveTo(a+r,b);s.lineTo(a+w-r,b);s.quadraticCurveTo(a+w,b,a+w,b+r);s.lineTo(a+w,b+d-r);s.quadraticCurveTo(a+w,b+d,a+w-r,b+d);s.lineTo(a+r,b+d);s.quadraticCurveTo(a,b+d,a,b+d-r);s.lineTo(a,b+r);s.quadraticCurveTo(a,b,a+r,b);const g=new T.ExtrudeGeometry(s,{depth:h,bevelEnabled:false,curveSegments:8});g.rotateX(-Math.PI/2);const o=mesh(g,typeof m==='string'?mat(m):m,parent);o.position.set(x,y,z);return o;}
 function tube(points,r,m){return mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),24,r,8,false),m);}
 // Deterministic, subtle material textures: geometry remains measurable.
 function texture(kind){const c=document.createElement('canvas');c.width=c.height=512;const x=c.getContext('2d');x.fillStyle=kind==='wood'?'#ad8861':'#deddd5';x.fillRect(0,0,512,512);
  if(kind==='wood'){for(let i=0;i<150;i++){x.strokeStyle=i%3?'#704a2828':'#e4bc8b66';x.lineWidth=i%4*.35+.3;x.beginPath();for(let y=0;y<=512;y+=16){const xx=i*3.6+Math.sin(y*.022+i)*1.8;y?x.lineTo(xx,y):x.moveTo(xx,y);}x.stroke();}}
  else{for(let i=0;i<12;i++){x.strokeStyle=i%3?'#8b887a20':'#aaa69235';x.lineWidth=i%3*.6+.5;x.beginPath();for(let y=0;y<600;y+=10){const xx=i*89-y*.49+Math.sin(y*.024+i)*16;y?x.lineTo(xx,y):x.moveTo(xx,y);}x.stroke();}}
  const t=new T.CanvasTexture(c);t.colorSpace=T.SRGBColorSpace;t.wrapS=t.wrapT=T.RepeatWrapping;return t;}
 const stone=mat('#ffffff',{map:texture('stone'),roughness:.6}),wood=mat('#ffffff',{map:texture('wood'),roughness:.64});
 const graphite=mat('#424643'),black=mat('#202522',{roughness:.38,metalness:.6}),white=mat('#f2f1eb',{roughness:.2});
 const glass=new T.MeshPhysicalMaterial({color:'#dcebe4',roughness:.06,metalness:0,transparent:true,opacity:.17,side:T.DoubleSide,depthWrite:false});
 box(room.width,.10,room.depth,room.width/2,-.10,room.depth/2,stone);
 // North and east are full; west and south are cut in the overview.
 const walls={north:new T.Group(),east:new T.Group(),south:new T.Group(),west:new T.Group()};Object.values(walls).forEach(g=>root.add(g));
 box(2.97,2.75,.10,1.485,0,-.05,stone,walls.north);box(.10,2.75,2.28,3.02,0,1.14,wood,walls.east);
 box(2.97,2.75,.10,1.485,0,2.33,stone,walls.south);
 box(.10,2.75,.82,-.05,0,.41,stone,walls.west);box(.10,2.75,.66,-.05,0,1.95,stone,walls.west);box(.10,.65,.8,-.05,2.10,1.22,stone,walls.west);
 const southCut=box(2.97,.16,.10,1.485,0,2.33,stone),westCut1=box(.1,.16,.82,-.05,0,.41,stone),westCut2=box(.1,.16,.66,-.05,0,1.95,stone);
 // Floor joints; tiled east wall follows the wood-look plank direction.
 for(let x=.6;x<2.97;x+=.6)box(.003,.002,2.28,x,.002,1.14,'#b6b7ad');for(let z=.6;z<2.28;z+=.6)box(2.97,.002,.003,1.485,.002,z,'#b6b7ad');
 for(let z=.103;z<2.28;z+=.2)box(.002,2.65,.003,2.968,0,z,'#695842');
 box(shaft.w,shaft.h,shaft.d,shaft.x,0,shaft.z,graphite);
 const cabinet=fixtures.find(f=>f.id==='cabinet');
 box(cabinet.w,2.48,cabinet.d,cabinet.x,.08,cabinet.z,graphite);
 for(let i=0;i<3;i++){const x=cabinet.x-cabinet.w/2+(i+.5)*cabinet.w/3;box(cabinet.w/3-.009,2.46,.018,x,.09,.707,graphite);box(.012,.31,.017,x+cabinet.w/6-.055,1.08,.723,black);}
 const nicheX=2.793;box(.354,2.65,.02,nicheX,0,.01,mat('#5a6451'));
 for(let y=.4;y<2.45;y+=.5){box(.35,.025,.34,nicheX,y,.18,wood);cyl(.045,.17,nicheX-.07,y+.025,.22,graphite);}
 const v=fixtures.find(f=>f.id==='vanity');
 rounded(v.w,.46,v.d,v.x,.34,v.z,graphite,.018);box(v.w,.035,v.d,v.x,.80,v.z,stone);
 box(v.w-.02,.008,.008,v.x,.59,v.z-v.d/2-.005,black);
 // Open vessel basin: outer white bowl, depressed inner surface, drain.
 const profile=[[0,0],[.19,0],[.245,.025],[.285,.075],[.31,.14],[.31,.15],[.293,.15],[.27,.082],[.23,.035],[0,.027]].map(p=>new T.Vector2(...p));
 const basin=mesh(new T.LatheGeometry(profile,64),white);basin.scale.z=.66;basin.position.set(v.x,.835,v.z-.018);cyl(.022,.002,v.x,.864,v.z-.018,black);
 tube([[v.x,1.09,2.26],[v.x,1.09,2.15],[v.x,1.07,2.06]],.016,black);box(.18,.075,.016,v.x,1.055,2.265,black);
 // Round mirror, present in both of the supplied portfolio directions.
 const mirrorFrame=mesh(new T.CylinderGeometry(.40,.40,.025,64),black);mirrorFrame.rotation.x=Math.PI/2;mirrorFrame.position.set(v.x,1.63,2.252);
 const mirror=mesh(new T.CircleGeometry(.383,64),mat('#a2aaa5',{roughness:.08,metalness:.9}));mirror.rotation.y=Math.PI;mirror.position.set(v.x,1.63,2.232);
 // Reflect the actual room from the mirror plane using a cube environment.
 const cubeTarget=new T.WebGLCubeRenderTarget(256),cubeCamera=new T.CubeCamera(.05,20,cubeTarget);cubeCamera.position.set(v.x,1.63,2.19);scene.add(cubeCamera);mirror.material.envMap=cubeTarget.texture;mirror.material.envMapIntensity=.9;
 const wc=toilet;rounded(.37,.29,.53,wc.x,.15,wc.z,white,.16);rounded(.37,.047,.54,wc.x,.44,wc.z,white,.16);
 const install=fixtures.find(f=>f.id==='installation');box(install.w,1.15,install.d,install.x,0,install.z,wood);box(.23,.14,.018,wc.x,.84,2.069,black);
 for(const x of [wc.x-.05,wc.x+.055]){const plate=mesh(new T.CircleGeometry(.035,24),mat('#454c47'));plate.rotation.y=Math.PI;plate.position.set(x,.91,2.058);}
 const tray=fixtures.find(f=>f.id==='shower-tray');
 // The data id may use the shorter 'tray' spelling.
 const shower=tray||fixtures.find(f=>f.id==='tray');
 if(shower){box(shower.w,.026,shower.d,shower.x,.005,shower.z,stone);box(.72,.003,.035,2.46,.035,1.98,black);}
 // Glass fixed panel on the shower's west edge, leaving a 0.77m entry.
 const panel=box(.008,2.12,.8,1.874,.02,.903,glass);panel.castShadow=false;
 for(const z of [.503,1.303])box(.017,2.14,.017,1.874,0,z,black);box(.018,.016,.80,1.874,2.14,.903,black);
 tube([[2.94,1.02,1.32],[2.94,2.12,1.32],[2.73,2.14,1.32],[2.62,2.14,1.32]],.015,black);cyl(.115,.017,2.62,2.12,1.32,black);box(.07,.08,.26,2.923,1.02,1.32,black);
 tube([[2.94,1.1,1.39],[2.88,.57,1.52],[2.93,.8,1.56],[2.94,1.40,1.54]],.008,black);
 // Door swings out from the lower jamb, exactly as the yellow-marked plan.
 const doorGroup=new T.Group();doorGroup.position.set(-.035,0,door.hingeZ);doorGroup.rotation.y=Math.PI/2;root.add(doorGroup);box(.035,2.10,.8,0,0,-.4,graphite,doorGroup);box(.035,.022,.12,.025,.99,-.68,black,doorGroup);
 box(.8,.40,.45,-.54,0,2.055,wood);
 // Actual light sources are switched alongside their visible emitters.
 const emitters=[];for(const l of lights){const bulb=mat('#fff0d1',{emissive:'#ffd9a0',emissiveIntensity:2});let visual;
  if(['general','shower'].includes(l.group)){cyl(.042,.035,l.x,2.61,l.z,black);visual=cyl(.03,.005,l.x,2.608,l.z,bulb);}
  else if(l.group==='mirror'){visual=mesh(new T.TorusGeometry(.394,.008,8,64),bulb);visual.position.set(v.x,1.63,2.224);}
  else visual=box(l.group==='night'?.76:.014,.012,l.group==='night'?.014:1.48,l.x,l.h,l.z,bulb);
  const point=new T.PointLight('#ffdcaa',0,4,2);point.position.set(l.x,l.group==='mirror'?1.6:l.h-.06,l.group==='mirror'?2.12:l.z);root.add(point);emitters.push({visual,point,group:l.group});}
 const ambient=new T.HemisphereLight('#fff7e7','#737866',.7);scene.add(ambient);
 const sun=new T.DirectionalLight('#fff4df',1.7);sun.position.set(-2,7,4);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);sun.shadow.camera.left=-5;sun.shadow.camera.right=5;sun.shadow.camera.top=5;sun.shadow.camera.bottom=-5;sun.shadow.normalBias=.018;scene.add(sun);
 function lighting(mode){const s=scenarios[mode]||scenarios.day;ambient.intensity=s.ambient;sun.intensity=mode==='day'?1.25:mode==='evening'?.28:.06;emitters.forEach(e=>{const intensity=s[e.group];e.visual.material.emissiveIntensity=intensity*2.5;e.point.intensity=intensity*(e.group==='general'?4:1.1);});mirror.visible=false;cubeCamera.update(renderer,scene);mirror.visible=true;}
 const ceiling=box(2.97,.08,2.28,1.485,2.65,1.14,mat('#efeee6'));
 function resize(){const b=container.getBoundingClientRect();renderer.setSize(b.width,b.height,false);camera.aspect=b.width/b.height;camera.updateProjectionMatrix();const w=Math.max(4.6,3.35*camera.aspect),h=w/camera.aspect;planCamera.left=-w/2;planCamera.right=w/2;planCamera.top=h/2;planCamera.bottom=-h/2;planCamera.updateProjectionMatrix();}
 const observer=new ResizeObserver(()=>{resize();view(activeView);});observer.observe(container);
 function view(kind){activeView=kind;walls.west.visible=false;walls.south.visible=kind==='door';walls.east.visible=true;walls.north.visible=kind!=='top';southCut.visible=kind!=='door';westCut1.visible=westCut2.visible=true;doorGroup.visible=kind!=='door';ceiling.visible=kind==='door';
  const compact=container.clientWidth<600;camera.fov=kind==='door'?76:40;controls.enabled=kind!=='top';
  if(kind==='top'){camera.position.set(1.485,compact?7.8:6.1,1.141);controls.target.set(1.485,0,1.14);controls.enableRotate=false;walls.east.visible=false;}
  else if(kind==='door'){camera.position.set(.02,1.60,1.23);controls.target.set(2.0,1.23,1.39);controls.enableRotate=true;}
  else{camera.position.set(compact?-4.5:-3.2,compact?7.5:6.1,compact?6.4:5.0);controls.target.set(1.27,.90,1.14);controls.enableRotate=true;}
  camera.updateProjectionMatrix();controls.update();lighting(currentLight);}
 let currentLight='day';resize();view('iso');
 let running=true;function animate(){if(!running)return;requestAnimationFrame(animate);controls.update();renderer.render(scene,activeView==='top'?planCamera:camera);}animate();
 return {view,lighting(mode){currentLight=mode;lighting(mode);},capture(){renderer.render(scene,activeView==='top'?planCamera:camera);return renderer.domElement.toDataURL('image/png');},dispose(){running=false;observer.disconnect();controls.dispose();renderer.dispose();},get activeView(){return activeView;}};
}
