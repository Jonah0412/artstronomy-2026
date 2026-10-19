import {useEffect,useRef} from 'react';
import {gsap} from 'gsap';

// Canvas spiral inspired by GreenSock / NWZRRNb, with original Hoshi artwork
// and procedurally drawn stars/planets. One bounded canvas, no extra WebGL.
export function CosmicParticles(){
 const ref=useRef(null);
 useEffect(()=>{
  const canvas=ref.current,ctx=canvas.getContext('2d');if(!ctx)return;
  let width=1,height=1,dpr=1,alive=true;
  const reduced=matchMedia('(prefers-reduced-motion: reduce)');
  const hoshi=new Image();hoshi.src='/assets/hoshi-mascot.webp';
  const particles=Array.from({length:48},(_,i)=>({phase:i/48,angle:i*2.39996,type:i%9===0?'hoshi':i%4===0?'planet':'star',color:['#f7df36','#a886df','#ef8677','#bed4c4'][i%4]}));
  function draw(){
   ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,width,height);
   const radius=Math.hypot(width,height)*.58;
   for(const p of [...particles].sort((a,b)=>a.phase-b.phase)){
    const t=p.phase,r=radius*t,angle=p.angle+(1-t)*2.2;
    const x=width*.5+Math.cos(angle)*r,y=height*.45+Math.sin(angle)*r*.85,size=(p.type==='hoshi'?100:p.type==='planet'?35:18)*t+3;
    ctx.save();ctx.translate(x,y);ctx.rotate(angle*.22);ctx.globalAlpha=Math.min(.75,t*2)*Math.min(1,(1-t)*7);ctx.fillStyle=p.color;
    if(p.type==='hoshi'&&hoshi.complete&&hoshi.naturalWidth){ctx.drawImage(hoshi,-size/2,-size/2,size,size*hoshi.naturalHeight/hoshi.naturalWidth);}
    else if(p.type==='planet'){const g=ctx.createRadialGradient(-size*.2,-size*.2,1,0,0,size/2);g.addColorStop(0,p.color);g.addColorStop(1,'#192b30');ctx.fillStyle=g;ctx.beginPath();ctx.arc(0,0,size/2,0,Math.PI*2);ctx.fill();ctx.strokeStyle=p.color;ctx.lineWidth=1.2;ctx.beginPath();ctx.ellipse(0,0,size*.85,size*.2,-.4,0,Math.PI*2);ctx.stroke();}
    else {ctx.beginPath();for(let i=0;i<8;i++){const a=i*Math.PI/4,rr=i%2?size*.13:size*.5;ctx.lineTo(Math.cos(a)*rr,Math.sin(a)*rr);}ctx.closePath();ctx.fill();}
    ctx.restore();
   }
  }
  const observer=new ResizeObserver(()=>{width=canvas.clientWidth;height=canvas.clientHeight;dpr=Math.min(devicePixelRatio||1,1.5);canvas.width=width*dpr;canvas.height=height*dpr;draw();});observer.observe(canvas);
  let timeline;
  function setup(){timeline?.kill();if(!reduced.matches){timeline=gsap.timeline({repeat:-1,onUpdate:draw});particles.forEach((p,i)=>timeline.fromTo(p,{phase:1},{phase:0,duration:5.8,ease:'none',repeat:-1},-i*5.8/48));timeline.seek(6);}else draw();}
  setup();hoshi.onload=()=>{if(alive)draw();};
  const visibility=()=>{if(document.hidden)timeline?.pause();else timeline?.resume();};document.addEventListener('visibilitychange',visibility);reduced.addEventListener('change',setup);
  return()=>{alive=false;timeline?.kill();observer.disconnect();hoshi.onload=null;document.removeEventListener('visibilitychange',visibility);reduced.removeEventListener('change',setup);};
 },[]);
 return <canvas ref={ref} className="hoshi-loading__particles" aria-hidden="true"/>;
}
