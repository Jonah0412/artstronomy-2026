import { creatorCount } from '../observatory/content.js';
import {useEffect,useRef,useState} from 'react';
import './hoshi-loading.css';
import {CosmicParticles} from './CosmicParticles.jsx';

// Use the existing mascot's rendered expressions: no additional 3D download
// competes with the cockpit while it is starting up.
export function HoshiLoadingScene({progress=0,departing=false,destination='YOUR SPACESHIP'}){
 const complete=progress>=100;
 return <section className={`hoshi-loading ${complete?'is-complete':''} ${departing?'is-departing':''}`} aria-label="ARTStronomy loading screen">
   <div className="hoshi-loading__stars" aria-hidden="true"/><CosmicParticles/>
   <header className="hoshi-loading__brand"><span className="hoshi-loading__star" aria-hidden="true">✦</span><strong>ARTSTRONOMY</strong><span>2026</span></header>
   <div className="hoshi-loading__content">
     <p className="hoshi-loading__eyebrow">NEXT STOP / {destination}</p>
     <h2>{complete?'Let’s go!':'A universe is taking shape.'}</h2>
     <div className="hoshi-loading__stage" aria-hidden="true">
       <div className="hoshi-loading__ground"/>
       <div className="hoshi-loading__path"><i/><i/><i/><i/><i/></div>
       <div className="hoshi-loading__portal"><div className="hoshi-loading__portal-depth"/><i/><i/><i/><span>✦</span></div>
       <div className="hoshi-loading__shadow"/>
       <div className="hoshi-loading__traveller"><div className="hoshi-loading__mascot"/></div>
       <div className="hoshi-loading__thought">{complete?'Here we go!':'Any second now…'}<span/></div>
       <span className="hoshi-loading__portal-label">{complete?'PORTAL OPEN':'CHARGING PORTAL'}</span>
     </div>
     <div className="hoshi-loading__readout"><span>{complete?'All set. Follow Hoshi.':'Preparing your journey'}</span><strong>{Math.floor(progress).toString().padStart(2,'0')}<small>%</small></strong></div>
     <div className="hoshi-loading__progress" role="progressbar" aria-label="Journey preparation" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.floor(progress)}><span style={{transform:`scaleX(${progress/100})`}}/></div>
     <p className="hoshi-loading__status" role="status">{complete?'Ready to enter the creative universe.':'A little stardust. A little patience.'}</p>
   </div>
   <footer className="hoshi-loading__footer"><span>{creatorCount} MINDS. ONE UNIVERSE.</span></footer>
 </section>;
}

export function OpeningLoader({hubReady,onComplete,destination="YOUR SPACESHIP"}){
 const [assets,setAssets]=useState(0),[progress,setProgress]=useState(0),[departing,setDeparting]=useState(false);
 const ready=useRef(false),callback=useRef(onComplete);callback.current=onComplete;
 ready.current=hubReady&&assets===4;
 const target=useRef(0);target.current=assets*15+(hubReady?40:0);
 useEffect(()=>{
   let active=true;
   const settle=()=>{if(active)setAssets(n=>n+1);};
   // Settled images may use the site's built-in fallback; never strand visitors
   // behind an image failure. The readiness prop gates the destination where required.
   const images=['/assets/hoshi-emotions.webp','/assets/hoshi-mascot.webp','/assets/project-graphic-design.webp'];
   for(const src of images){const image=new Image();image.src=src;image.decode().then(settle,settle);}
   Promise.resolve(document.fonts?.ready).then(settle,settle);
   return()=>{active=false;};
 },[]);
 useEffect(()=>{
   const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;
   const started=performance.now();let frame=0,value=0,completedAt=0,previous=started;
   const tick=now=>{
     const dt=Math.max(0,now-previous);previous=now;
     const goal=ready.current&&now-started>=(reduced?0:2000)?100:Math.min(94,target.current);
     value=Math.min(goal,value+dt*(reduced?.3:.065));setProgress(value);
     if(value>=100){if(!completedAt)completedAt=now;
       if(now-completedAt>=(reduced?0:350))setDeparting(true);
       if(now-completedAt>=(reduced?200:1800)){callback.current();return;}
     }
     frame=requestAnimationFrame(tick);
   };frame=requestAnimationFrame(tick);return()=>cancelAnimationFrame(frame);
 },[]);
 return <HoshiLoadingScene progress={progress} departing={departing} destination={destination}/>;
}

// This is transition progress: the original website is already mounted. The
// journey controller owns navigation and cleans up this animation on arrival.
export function JourneyLoading({phase}){
 const [progress,setProgress]=useState(0),[departing,setDeparting]=useState(false);
 useEffect(()=>{let frame=0;const draw=now=>{const elapsed=now-phase.started;setProgress(Math.min(100,elapsed/1100*100));setDeparting(elapsed>=1450);frame=requestAnimationFrame(draw);};frame=requestAnimationFrame(draw);return()=>cancelAnimationFrame(frame);},[phase.started]);
 return <HoshiLoadingScene progress={progress} departing={departing} destination="THE EXHIBITION"/>;
}
