// One geometry source for rendering and circulation checks. Dimensions are schematic metres.
export const overlap=(a,b)=>Math.abs(a.x-b.x)<(a.w+b.w)/2-1e-5&&Math.abs(a.z-b.z)<(a.d+b.d)/2-1e-5;
export function getArchitecture(layout){
 const walls=[],doors=[],windows=[];
 const wall=(id,x1,z1,x2,z2,thick=.14,external=false)=>walls.push({id,x1,z1,x2,z2,thick,external,bounds:{x:(x1+x2)/2,z:(z1+z2)/2,w:Math.abs(x2-x1)||thick,d:Math.abs(z2-z1)||thick}});
 const door=(id,x,z,width,axis='x',swing=1)=>doors.push({id,x,z,width,axis,swing});
 const span=(id,axis,fixed,start,end,gaps=[],thick=.14,external=false)=>{
  let cursor=start;
  for(const [a,b] of [...gaps,[end,end]]){if(a>cursor){if(axis==='x')wall(id, cursor,fixed,a,fixed,thick,external);else wall(id,fixed,cursor,fixed,a,thick,external);}cursor=b;}
 };
 const north=[[4.20,5.43],[7.34,8.57],[10.50,11.77],[12.63,13.36]];
 span('north','x',0,3.2,14.2,north,.22,true);north.forEach(([a,b])=>windows.push({x:(a+b)/2,z:0,width:b-a,rotation:0}));
 wall('east',14.2,0,14.2,6,.22);
 span('entrance','x',6,8.05,14.2,[[8.75,9.75]],.22);door('entrance',8.75,6,1,'x',-1);
 // No second wall at x=8.05 over the storage entrance.
 wall('service-south',3.82,7.69,8.05,7.69,.22);wall('service-west',3.82,5.38,3.82,7.69,.22);
 wall('bedroom-south',-.075,5.38,3.82,5.38,.22);
 span('bedroom-west','z',-.075,1.33,5.38,[[3.55,4.75]],.22);windows.push({x:-.075,z:4.15,width:1.2,rotation:Math.PI/2});
 span('balcony-piers','x',1.33,-.075,3.27,[[1.3,3]],.22);
 const bedroomGaps=[[3.92,4.72]];if(layout.directDressing)bedroomGaps.unshift([1.43,2.28]);
 span('bedroom-divider','z',3.27,0,5.38,bedroomGaps,.20);
 door('bedroom',3.27,3.92,.80,'z',-1);
 if(layout.directDressing)door('bedroom-dressing',3.27,1.43,.85,'z',1);
 const divider=layout.divider;
 if(layout.directDressing){wall('dressing-living-north',layout.northDivider,0,layout.northDivider,1);wall('dressing-living-jog',divider,1,layout.northDivider,1);wall('dressing-living',divider,1,divider,3.82);}
 else wall('dressing-living',divider,0,divider,3.82);
 if(layout.masterSuite){
  if(layout.directDressing)wall('dressing-south',3.27,3.82,divider,3.82);
  else span('dressing-south','x',3.82,3.27,divider,[[3.62,divider-.20]]);
  // Vestibule boundary remains at its existing corridor position, independent of the shifted room wall.
  span('suite-entry','z',6.425,3.82,5.10,[[4.04,4.98]]);door('suite-entry',6.425,4.04,.94,'z',-1);
 }else{span('flex-south','x',3.82,3.27,divider,[[4.25,5.10]]);door('flex',4.25,3.82,.85);}
 if(layout.access.kitchenPartition)wall('kitchen-divider',9.57,0,9.57,3.82);
 span('living-south','x',3.82,divider,9.57,layout.access.formerRoomDoor?[[7.35,8.23]]:[]);
 if(layout.access.formerRoomDoor)door('living',7.35,3.82,.88);
 span('kitchen-south','x',3.82,9.57,14.2,[[9.62,10.44]]);door('kitchen',9.62,3.82,.82);
 span('bath-north','x',5.38,3.82,6.325,[[4.72,5.58]]);door('bath',4.72,5.38,.86,'x',-1);
 wall('bath-storage',6.325,5.10,6.325,7.69);
 // Move the nonstructural front of the entry wardrobe 28 cm into the corridor.
 // Its 80 cm door now opens fully into the hall footprint (north of the entrance wall).
 wall('storage-north',6.325,5.10,7.98,5.10);
 span('storage-east','z',7.98,5.10,7.69,[[5.16,5.96]]);door('storage',7.98,5.16,.80,'z',-1);
 wall('storage-services',6.325,7.05,7.98,7.05);
 span('shower-west','z',10.98,3.82,6,[[3.98,4.82]]);door('shower',10.98,3.98,.84,'z',1);
 const clearances=[
  {id:'entrance',x:9.25,z:5.40,w:1.20,d:1.20},
  {id:'storage',x:8.49,z:5.53,w:.85,d:.96},
  {id:'shower',x:10.53,z:4.40,w:.90,d:1.05}
 ];
 // Hall stays open. Shoes and outerwear are stored inside the entry wardrobe.
 const hallFurniture=[];
 const toilets=[{id:'bath-wc',x:5.96,z:5.97,rotation:-Math.PI/2},{id:'shower-wc',x:13.84,z:4.42,rotation:-Math.PI/2}];
 const screens=[{id:'bedroom-tv',x:3.13,z:3.03,rotation:-Math.PI/2,inches:65,y:.95},{id:'kitchen-tv',x:14.04,z:1.34,rotation:-Math.PI/2,inches:65,y:1.18}];
 if(layout.access.kitchenPartition)screens.push({id:'living-tv',x:9.42,z:1.73,rotation:-Math.PI/2,inches:75,y:.90});
 else screens.push({id:'living-tv',x:(layout.divider+9.57)/2,z:3.68,rotation:Math.PI,inches:75,y:.90});
 return {walls,doors,windows,clearances,hallFurniture,toilets,screens};
}
