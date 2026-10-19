import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {startHandTracking} from '../src/cosmic/hand-tracking.js';

test('the shipped hand model is the complete verified upstream archive',()=>{
  const model=readFileSync(new URL('../public/mediapipe/hand_landmarker.task',import.meta.url));
  assert.equal(model.length,7819105);
  assert.equal(createHash('sha256').update(model).digest('hex'),'fbc2a30080c3c557093b5ddfc334698132eb341044ccee322ccf8bcf3607cde1');
  assert.ok(model.lastIndexOf(Buffer.from([0x50,0x4b,0x05,0x06]))>model.length-65558,'ZIP directory must be present, not a truncated download');
});

test('startup failure reports an error state, never readiness',async()=>{
  const states=[];
  const tracker=await startHandTracking({video:{},assetRoot:'/mediapipe',visionModule:Promise.resolve({FilesetResolver:{forVisionTasks:async()=>{throw Error('Invalid model archive');}}}),onHand:()=>{},onStatus:()=>{},onState:s=>states.push(s.state)});
  await tracker.ready;
  assert.deepEqual(states,['loading','error']);
  tracker.stop();
});

test('closing during model initialization releases the eventual model exactly once',async()=>{
  let finish,closed=0;
  const states=[];
  const tracker=await startHandTracking({video:{},assetRoot:'/mediapipe',visionModule:Promise.resolve({FilesetResolver:{forVisionTasks:async()=>({})},HandLandmarker:{createFromOptions:()=>new Promise(resolve=>{finish=resolve;})}}),onHand:()=>{},onStatus:()=>{},onState:s=>states.push(s.state)});
  // Allow the fileset promise to reach model initialization.
  await Promise.resolve();await Promise.resolve();
  tracker.stop();finish({close:()=>closed++});await tracker.ready;
  assert.equal(closed,1);assert.deepEqual(states,['loading']);
});
