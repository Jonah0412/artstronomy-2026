import {useEffect,useRef} from 'react';
import './journey.css';
import {KineticJourney} from '../loading/KineticJourney.jsx';
const titles={ar:'AR Poster',gallery:'Virtual Gallery',scanner:'Radio Scanner',website:'ARTStronomy website',station:'Spaceship'};
export function JourneyOverlay({phase}){
 const canvas=useRef(null),overlay=useRef(null);
 useEffect(()=>{if(phase)overlay.current?.focus({preventScroll:true});},[phase]);
 useEffect(()=>{
   if(!phase||phase.kind!=='portal')return;
   const c=canvas.current,ctx=c.getContext('2d');if(!ctx)return;
   let frame=0;const resize=()=>{c.width=Math.round(innerWidth*Math.min(devicePixelRatio,1.5));c.height=Math.round(innerHeight*Math.min(devicePixelRatio,1.5));};resize();window.addEventListener('resize',resize);
   const draw=now=>{const t=Math.min(1,(now-phase.started)/phase.duration),w=c.width,h=c.height,cx=w/2,cy=h*.46;
     ctx.clearRect(0,0,w,h);
     // The screen-space warp continues the portal in the 3D cockpit. It is also
     // the free Canvas fallback when the browser cannot render WebGL.
     ctx.fillStyle=`rgba(22,31,48,${Math.max(0,t-.18)*1.2})`;ctx.fillRect(0,0,w,h);
     const radius=Math.max(8,Math.min(w,h)*(.07+t*t*1.55));
     for(let k=0;k<4;k++){ctx.beginPath();ctx.ellipse(cx,cy,radius*(1+k*.035),radius*(.88+k*.03),t*.15,0,Math.PI*2);ctx.strokeStyle=`rgba(${k%2?'86,198,181':'255,212,0'},${(1-t*.5)*(.6-k*.12)})`;ctx.lineWidth=(3+k*2)*(w/1400);ctx.shadowColor='#56c6b5';ctx.shadowBlur=18;ctx.stroke();}ctx.shadowBlur=0;
     for(let i=0;i<150;i++){const a=i*2.399963,d=((i*.618+t*t*2)%1),r=d*d*Math.max(w,h)*.8,len=5+t*t*160;ctx.beginPath();ctx.moveTo(cx+Math.cos(a)*r,cy+Math.sin(a)*r);ctx.lineTo(cx+Math.cos(a)*(r+len),cy+Math.sin(a)*(r+len));ctx.strokeStyle=`rgba(167,194,245,${t*.65*d})`;ctx.lineWidth=1+(i%3)*.45;ctx.stroke();}
     // Fade to dark once, without strobing or camera shake.
     ctx.fillStyle=`rgba(22,31,48,${Math.max(0,(t-.82)/.18)})`;ctx.fillRect(0,0,w,h);frame=requestAnimationFrame(draw);
   };frame=requestAnimationFrame(draw);return()=>{cancelAnimationFrame(frame);window.removeEventListener('resize',resize);};
 },[phase]);
 if(!phase)return null;
 return <div ref={overlay} tabIndex={-1} aria-label={`Travelling to ${titles[phase.to] || "your destination"}`} onKeyDown={event=>{if(event.key==='Tab')event.preventDefault();}} className={`journey-overlay journey-overlay--${phase.kind}`} style={{'--journey-duration':`${phase.duration}ms`}} data-journey={phase.kind}>
   {phase.kind==='portal'&&<canvas ref={canvas} aria-hidden="true"/>}
   <div className="journey-shade" aria-hidden="true"/>{phase.kind==='tv'&&<span className="journey-tv-line" aria-hidden="true"/>}
   {phase.from && phase.to !== 'scanner' && <KineticJourney key={`${phase.from}-${phase.to}`} phase={phase}/>}
 </div>;
}
