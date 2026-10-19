// Keep the same scene geometry; spend pixels according to screen size and frame time.
export function initialPixelRatio({dpr=1,width=1,height=1,mobile=false}={}) {
  const pixelBudget=mobile?1400000:2400000;
  return Math.max(.65,Math.min(dpr,mobile?1.25:1.5,Math.sqrt(pixelBudget/Math.max(1,width*height))));
}
export function createRenderBudget(initial,onChange) {
  let ratio=initial,previous=0,start=0,sum=0,count=0,stable=0,cooldown=0;
  const reset=()=>{previous=0;start=0;sum=0;count=0;stable=0;};
  return {
    reset,
    sample(time){
      if(!previous){previous=time;start=time;return;}
      const dt=time-previous;previous=time;
      if(dt>250){reset();return;}
      sum+=dt;count++;
      if(time-start<2000)return;
      const average=sum/count;sum=0;count=0;start=time;
      if(time<cooldown)return;
      let next=ratio;
      if(average>23){next=Math.max(.65,ratio*.85);stable=0;}
      else if(average<18.5){if(++stable>=4){next=Math.min(initial,ratio/.85);stable=0;}}
      else stable=0;
      if(Math.abs(next-ratio)>.025){ratio=next;cooldown=time+4000;onChange(ratio);}
    },
    get ratio(){return ratio;}
  };
}
// Limit extra work on 90/120 Hz screens, while preserving elapsed-time movement.
export function createFrameGate(){
  let next=0,rate=0;
  return {reset(){next=0;rate=0;},due(time,fps=60){
    if(rate!==fps){rate=fps;next=time;}
    if(time+.75<next)return false;
    const interval=1000/fps;next+=interval;
    if(next<time-interval)next=time+interval;
    return true;
  }};
}
