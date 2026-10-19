// Scale-independent landmark geometry. World coordinates avoid camera aspect
// distortion; image coordinates are corrected when world landmarks are absent.
const distance = (a,b) => Math.hypot(a.x-b.x,a.y-b.y,a.z-b.z);
function angle(a,b,c) {
  const u=[a.x-b.x,a.y-b.y,a.z-b.z],v=[c.x-b.x,c.y-b.y,c.z-b.z];
  const length=Math.hypot(...u)*Math.hypot(...v);
  return length ? Math.acos(Math.max(-1,Math.min(1,u.reduce((n,x,i)=>n+x*v[i],0)/length))) : 0;
}
export function createHandGesture() {
  let active=false, confirmations=0;
  const reset=()=>{active=false;confirmations=0;};
  return { reset, update(landmarks,{world,aspect=1,mirrored=true}={}) {
    if(!landmarks||landmarks.length!==21){reset();return null;}
    const points=world?.length===21?world:landmarks.map(p=>({x:p.x*aspect,y:p.y,z:(p.z||0)*aspect}));
    if(points.some(p=>![p.x,p.y,p.z].every(Number.isFinite))){reset();return null;}
    const scale=distance(points[0],points[9]);
    if(scale<1e-5){reset();return null;}
    const folded=[5,9,13,17].filter(base=>angle(points[base],points[base+1],points[base+3])<1.9 || distance(points[base+3],points[0])<distance(points[base+1],points[0])*.95).length;
    // Fist takes priority: a tucked thumb can otherwise look like a pinch.
    const fist=folded===4&&distance(points[8],points[0])<scale*1.35;
    const gap=distance(points[4],points[8])/scale;
    if(fist||gap>(active?.42:.28)){reset();}
    else if(++confirmations>=2)active=true;
    const x=(landmarks[4].x+landmarks[8].x)/2,y=(landmarks[4].y+landmarks[8].y)/2;
    return {x:Math.max(0,Math.min(1,mirrored?1-x:x)),y,pinched:active,gesture:fist?'fist':active?'pinch':'open'};
  }};
}
