import test from 'node:test';import assert from 'node:assert/strict';
import {journeyPlan} from '../src/journey/journey-plan.js';
test('every journey ends in the requested destination with finite timing',()=>{
 for(const from of ['station','ar','gallery','scanner','website'])for(const to of ['station','ar','gallery','scanner','website']){
  if(from===to)continue;for(const reduced of [false,true]){const plan=journeyPlan(from,to,reduced);assert.ok(plan.length);assert.ok(plan.every(p=>p.duration>0&&Number.isFinite(p.duration)));assert.equal(plan.filter(p=>p.mode).at(-1).mode,to);}
 }
});
test('scanner and AR keep their routes; only the museum uses docking',()=>{
 assert.deepEqual(journeyPlan('station','scanner').map(p=>p.kind),['seat','monitor','reveal']);
 assert.deepEqual(journeyPlan('scanner','station').map(p=>p.kind),['return']);
 for(const destination of ['ar']){assert.ok(journeyPlan('station',destination).some(p=>p.kind==='portal'));assert.deepEqual(journeyPlan(destination,'station').map(p=>p.kind),['tv','return']);}
 assert.deepEqual(journeyPlan('gallery','website').map(p=>p.kind),['portal','loading']);
 assert.deepEqual(journeyPlan('website','station').map(p=>p.kind),['portal','arrival']);
});
test('reduced motion omits travel and TV collapse entirely',()=>{assert.deepEqual(journeyPlan('gallery','station',true).map(p=>p.kind),['fade','reveal']);assert.deepEqual(journeyPlan('station','station'),[]);});

test('museum docking has one renderer handoff, with reduced-motion bypass',()=>{
 const arrival=journeyPlan('station','gallery');assert.deepEqual(arrival.map(s=>s.kind),['depart','warp','approach','dock','airlock','museum-arrival']);
 assert.equal(arrival.findIndex(s=>s.mode==='gallery'),arrival.length-1);
 assert.deepEqual(journeyPlan('gallery','station').map(s=>s.kind),['fade','airlock','undock','arrival']);
 assert.deepEqual(journeyPlan('station','gallery',true).map(s=>s.kind),['fade','reveal']);
});
