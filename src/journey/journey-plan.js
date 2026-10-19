import {museumArrival,museumReturn} from './docking-plan.js';
// One route table owns timing and state changes. Durations are milliseconds.
export function journeyPlan(from,to,reduced=false){
 if(from===to)return [];
 if(reduced)return [{kind:'fade',duration:120},{kind:'reveal',duration:160,mode:to}];
 if(from==='gallery'&&to==='station')return museumReturn();
 if(from==='station'&&to==='gallery')return museumArrival();
 if(from==='website')return [{kind:'portal',duration:1700},{kind:'arrival',duration:900,mode:'station'},...(to==='station'?[]:journeyPlan('station',to))];
 if(to==='station')return from==='scanner'
   ?[{kind:'return',duration:900,mode:'station',monitor:'scanner'}]
   :[{kind:'tv',duration:600},{kind:'return',duration:1100,mode:'station',monitor:from}];
 if(from==='gallery'&&to==='website')return [{kind:'portal',duration:1700},{kind:'loading',duration:2900,mode:'website'}];
 const steps=[];
 if(from!=='station')steps.push({kind:from==='scanner'?'fade':'tv',duration:from==='scanner'?200:600},{kind:'return',duration:900,mode:'station',monitor:from});
 if(to==='gallery'){steps.push(...museumArrival());return steps;}
 steps.push({kind:'seat',duration:600,mode:'station'});
 if(to==='scanner')steps.push({kind:'monitor',duration:850,monitor:'scanner'},{kind:'reveal',duration:350,mode:'scanner',monitor:'scanner'});
 else steps.push({kind:'portal',duration:1900},{kind:to==='website'?'loading':'reveal',duration:to==='website'?2900:600,mode:to});
 return steps;
}
