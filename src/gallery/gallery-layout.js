// Shared walkable architecture and curated locations; original roster indices stay stable.
export const EYE_HEIGHT=1.65;
export const SEAT_HEIGHT=1.15;
export const ROOM={halfWidth:36,front:7.2,back:-24.5};
export const WINGS=[
 {id:'atrium',label:'Atrium',x0:-7.5,x1:7.5,z0:-7.5,z1:7,anchor:{x:0,z:0},color:'#ffd400'},
 {id:'identity',label:'Branding + Advertising',x0:-23,x1:-7,z0:-5.5,z1:5.5,anchor:{x:-12,z:0},color:'#ffd400'},
 {id:'interaction',label:'Publishing + Web Design',x0:7,x1:35,z0:-5.5,z1:5.5,anchor:{x:12,z:0},color:'#56c6b5'},
 {id:'animation',label:'Animation',x0:-5.5,x1:5.5,z0:-24,z1:-7,anchor:{x:0,z:-12},color:'#3e7bef'},
];
const safeZones=[{x0:-7,x1:7,z0:-7,z1:6.2},{x0:-22.3,x1:-6.4,z0:-4.55,z1:4.55},{x0:6.4,x1:34.3,z0:-4.55,z1:4.55},{x0:-4.55,x1:4.55,z0:-23.3,z1:-6.4}];
// Include shoulder clearance around the physical holographic table.
const table={x0:-7.2,x1:-5,z0:.45,z1:3.15};
export function insideMuseum(x,z){return WINGS.some(r=>x>r.x0&&x<r.x1&&z>r.z0&&z<r.z1);}
export function constrainPosition(x,z){
 let best=null,d=Infinity;
 for(const r of safeZones){const p={x:Math.max(r.x0,Math.min(r.x1,x)),z:Math.max(r.z0,Math.min(r.z1,z))},distance=(p.x-x)**2+(p.z-z)**2;if(distance<d){d=distance;best=p;}}
 if(best.x>table.x0&&best.x<table.x1&&best.z>table.z0&&best.z<table.z1){
  const options=[{x:table.x0,z:best.z},{x:table.x1,z:best.z},{x:best.x,z:table.z0},{x:best.x,z:table.z1}];
  options.sort((a,b)=>Math.hypot(a.x-x,a.z-z)-Math.hypot(b.x-x,b.z-z));best=options[0];
 }
 return best;
}
export function wingFor(category){return ['Branding','Advertising'].includes(category)?'identity':['Publishing','Web Design'].includes(category)?'interaction':'animation';}
export function exhibitLayout(creators){
 const counts={identity:0,interaction:0,animation:0};
 return creators.map((creator,index)=>{
  const wing=wingFor(creator.category),slot=counts[wing]++,side=slot%2?1:-1;
  if(wing==='animation')return {...creator,index,wing,x:side*5.12,z:-11.4-Math.floor(slot/2)*5.5,yaw:side<0?Math.PI/2:-Math.PI/2};
  return {...creator,index,wing,x:wing==='identity'?-10.4-Math.floor(slot/2)*4.6:10.1+Math.floor(slot/2)*3.7,z:side*5.12,yaw:side<0?0:Math.PI};
 });
}
export function visitPosition(exhibit,height=EYE_HEIGHT){return {x:exhibit.x+Math.sin(exhibit.yaw)*2.9,y:height,z:exhibit.z+Math.cos(exhibit.yaw)*2.9,yaw:exhibit.yaw};}
export function wrapExhibit(index,count){return count?((index%count)+count)%count:0;}
export function straightWalk(from,to){
 const distance=Math.hypot(to.x-from.x,to.z-from.z),steps=Math.ceil(distance/.2);
 for(let i=0;i<=steps;i++){const t=steps?i/steps:0,x=from.x+(to.x-from.x)*t,z=from.z+(to.z-from.z)*t,p=constrainPosition(x,z);if(Math.hypot(x-p.x,z-p.z)>.001)return false;}
 return true;
}
// Route across the atrium instead of flying diagonally through exterior walls.
export function walkingPath(from,to){
 const goal={...to,...constrainPosition(to.x,to.z)};
 if(straightWalk(from,goal))return [goal];
 const hub=p=>Math.abs(p.x)>7?{x:p.x,z:0}:p.z< -7?{x:0,z:p.z}:{x:0,z:0};
 const corners=[table.x0-.02,table.x1+.02].flatMap(x=>[table.z0-.02,table.z1+.02].map(z=>({x,z})));
 const nodes=[{x:from.x,z:from.z},hub(from),{x:0,z:0},hub(goal),...corners,goal];
 const distances=nodes.map(()=>Infinity),previous=[],visited=new Set();distances[0]=0;
 while(visited.size<nodes.length){
  let current=-1;for(let i=0;i<nodes.length;i++)if(!visited.has(i)&&(current<0||distances[i]<distances[current]))current=i;
  if(current<0||!Number.isFinite(distances[current]))break;
  if(current===nodes.length-1)break;visited.add(current);
  for(let i=0;i<nodes.length;i++)if(!visited.has(i)&&straightWalk(nodes[current],nodes[i])){
   const distance=distances[current]+Math.hypot(nodes[current].x-nodes[i].x,nodes[current].z-nodes[i].z);
   if(distance<distances[i]){distances[i]=distance;previous[i]=current;}
  }
 }
 const path=[];let index=nodes.length-1;
 if(!Number.isFinite(distances[index]))return [];
 while(index!==0){path.unshift({...goal,...nodes[index]});index=previous[index];}
 return path;
}
