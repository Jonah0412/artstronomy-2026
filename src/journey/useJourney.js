import {useEffect,useRef,useState} from 'react';
import {journeyPlan} from './journey-plan.js';

export function useJourney({onMode,onDone}){
 const [phase,setPhase]=useState(null),active=useRef(null),timer=useRef(0),callbacks=useRef({onMode,onDone});
 callbacks.current={onMode,onDone};
 const finish=()=>{const trip=active.current;if(!trip)return;clearTimeout(timer.current);active.current=null;if(trip.appliedMode!==trip.to)callbacks.current.onMode(trip.to);setPhase(null);callbacks.current.onDone?.(trip.to);};
 const advance=()=>{const trip=active.current;if(!trip)return;const next=trip.steps[trip.index++];if(!next){finish();return;}
   if(next.mode){trip.appliedMode=next.mode;callbacks.current.onMode(next.mode);}
   setPhase({...next,from:trip.from,to:trip.to,started:performance.now(),serial:trip.serial++,tripStarted:trip.started,tripDuration:trip.duration});timer.current=setTimeout(advance,next.duration);
 };
 const begin=(from,to)=>{if(active.current||from===to)return false;const reduced=matchMedia('(prefers-reduced-motion: reduce)').matches;const steps=journeyPlan(from,to,reduced);active.current={from,to,steps,index:0,serial:0,started:performance.now(),duration:steps.reduce((sum,step)=>sum+step.duration,0)};advance();return true;};
 useEffect(()=>()=>{clearTimeout(timer.current);active.current=null;},[]);
 return {phase,begin,skip:finish,isActive:()=>!!active.current};
}
