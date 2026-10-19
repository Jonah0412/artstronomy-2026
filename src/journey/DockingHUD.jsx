import {useEffect,useRef} from 'react';
import {gsap} from 'gsap';
import {dockingCopy} from './docking-plan.js';
export function DockingHUD({phase}){
 const root=useRef(null),meter=useRef(null),readout=useRef(null);
 useEffect(()=>{
  const scope=gsap.context(()=>{
   const duration=phase.duration/1000;
   gsap.fromTo('.docking-hud__brackets',{scale:phase.kind==='approach'?1.5:1.05,opacity:.15},{scale:1,opacity:.7,duration,ease:'power2.out'});
   gsap.fromTo(meter.current,{scaleX:0},{scaleX:1,duration,ease:'none'});
   if(phase.kind==='warp')gsap.fromTo('.docking-hud__streaks',{scale:1,opacity:0},{scale:2.5,opacity:.65,duration:duration*.7,yoyo:true,repeat:1,ease:'power2.in'});
   if(phase.kind==='airlock'){
    const pressure={value:phase.reverse?100:0};
    gsap.to(pressure,{value:phase.reverse?0:100,duration,ease:'power1.inOut',onUpdate:()=>{if(readout.current)readout.current.textContent=`${pressure.value.toFixed(0)}%`;}});
   }
  },root);
  return()=>scope.revert();
 },[phase]);
 return <div ref={root} className={`docking-hud docking-hud--${phase.kind}`} aria-hidden="true">
  <div className="docking-hud__streaks"/>
  <div className="docking-hud__brackets"><i/><i/><i/><i/><span>ARTSTRONOMY / ORBITAL DOCK 01</span></div>
  <div className="docking-hud__telemetry"><span>{phase.reverse?'DEPARTURE PROTOCOL':'MUSEUM TRANSFER'}</span><strong>{phase.kind==='airlock'?<><b ref={readout}>0%</b> PRESSURE</>:phase.kind==='dock'?'RELATIVE VELOCITY / 0.00':phase.kind==='museum-arrival'?'PRESSURE NOMINAL':dockingCopy[phase.kind]}</strong><div><i ref={meter}/></div></div>
 </div>;
}
