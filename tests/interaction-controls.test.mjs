import test from 'node:test';
import assert from 'node:assert/strict';
import {Ray,Vector3} from 'three';
import {createHandGesture} from '../src/cosmic/hand-gesture.js';
import {createHandSignal} from '../src/radio/hand-signal.js';
import {floorDestination} from '../src/gallery/tap-navigation.js';
function hand(kind,scale=1){
  const p=Array.from({length:21},()=>({x:0,y:0,z:0}));
  p[0]={x:0,y:0,z:0};
  for(const [base,x] of [[5,-.35],[9,0],[13,.3],[17,.6]]){
    [1,1.45,1.8,2].forEach((y,i)=>p[base+i]={x,y:kind==='fist'&&i>1?.6:y,z:0});
  }
  p[4]=kind==='pinch'?{x:-.3,y:2,z:0}:kind==='fist'?{...p[8]}:{x:-1,y:1,z:0};
  return p.map(v=>({x:v.x*scale,y:v.y*scale,z:v.z*scale}));
}
test('open hands never engage; pinch needs confirmation and fist overrides touching fingertips',()=>{
  for(const scale of [.025,.15,1]){
    const g=createHandGesture();
    const update=kind=>g.update(hand(kind,scale),{world:hand(kind,scale)});
    assert.equal(update('open').pinched,false);
    assert.equal(update('pinch').pinched,false);
    assert.equal(update('pinch').pinched,true);
    const fist=update('fist');assert.equal(fist.gesture,'fist');assert.equal(fist.pinched,false);
    assert.equal(update('pinch').pinched,false);
    assert.equal(update('pinch').pinched,true);
    assert.equal(update('open').pinched,false);
  }
});
test('lost/invalid landmarks release control and mirrored tracking preserves pinch classification',()=>{
  const g=createHandGesture(),p=hand('pinch',.15);
  g.update(p);const mirrored=g.update(p);const normal=g.update(p,{mirrored:false});
  assert.equal(mirrored.pinched,true);assert.ok(Math.abs(mirrored.x+normal.x-1)<1e-8);
  assert.equal(g.update(null),null);assert.equal(g.update(p).pinched,false);
  const invalid=hand('pinch');invalid[9].x=NaN;assert.equal(g.update(invalid),null);
});
test('signal moves only while pinched, release holds position, and re-grabbing never jumps',()=>{
  const c=createHandSignal(1200,1700),pinch=x=>({x,pinched:true,gesture:'pinch'});
  assert.equal(c.update({x:.9,pinched:false,gesture:'open'},1420),null);
  assert.equal(c.update(pinch(.4),1420),null);
  let frequency=c.update(pinch(.6),1420);assert.ok(frequency>1420);
  assert.equal(c.update({x:.1,pinched:true,gesture:'fist'},frequency),null);
  assert.equal(c.update(pinch(.1),frequency),null);
  assert.equal(c.update(pinch(.1),frequency),frequency);
  assert.equal(c.update(null,frequency),null);
  assert.equal(c.update(pinch(.9),frequency),null);
  for(let i=0;i<30;i++)frequency=c.update(pinch(-5),frequency);
  assert.equal(frequency,1200);
});
test('floor taps map to safe eye-level destinations; sky, horizon and outside walls are ignored',()=>{
  const origin=new Vector3(0,1.65,5);
  const aim=(x,y,z)=>new Ray(origin,new Vector3(x,y,z).sub(origin).normalize());
  assert.deepEqual(floorDestination(aim(2,0,-12)),{x:2,z:-12,y:1.65});
  assert.deepEqual(floorDestination(aim(5.3,0,-23.8)),{x:4.55,z:-23.3,y:1.65});
  assert.equal(floorDestination(aim(0,3,-10)),null);
  assert.equal(floorDestination(aim(0,1.65,-10)),null);
  assert.equal(floorDestination(aim(6,0,-10)),null);
  assert.equal(floorDestination(aim(0,0,-50)),null);
});
