// A pinch grabs the current frequency without jumping. Releasing or making a
// fist freezes it; the next pinch establishes a fresh movement origin.
export function createHandSignal(min,max) {
  let anchor=null,smoothed=0;
  return { reset(){anchor=null;}, update(hand,frequency) {
    if(!hand?.pinched||hand.gesture==='fist'||!Number.isFinite(hand.x)){anchor=null;return null;}
    if(!anchor){anchor={x:hand.x,frequency};smoothed=frequency;return null;}
    const target=Math.max(min,Math.min(max,anchor.frequency+(hand.x-anchor.x)*(max-min)*1.5));
    smoothed+=(target-smoothed)*.4;
    return Math.round(smoothed*10)/10;
  }};
}
