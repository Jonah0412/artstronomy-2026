import test from 'node:test';
import assert from 'node:assert/strict';
import {QUESTIONS,ORBITS,matchOrbit,creatorsForOrbit} from '../src/constellation/game-model.js';
import {creatorData} from '../src/cosmic/creators.js';
test('five short questions, balanced primary choices, every orbit reachable and matching deterministic',()=>{
 assert.equal(QUESTIONS.length,5);const counts=Object.fromEntries(Object.keys(ORBITS).map(k=>[k,0]));
 for(const q of QUESTIONS){assert.equal(q.choices.length,4);for(const c of q.choices){counts[c[3]]++;assert.ok(ORBITS[c[4]]);}}
 assert.deepEqual(Object.values(counts),[4,4,4,4,4]);const outcomes=new Set();
 for(let n=0;n<1024;n++){const answers=Array.from({length:5},(_,i)=>(n>>(i*2))&3);const result=matchOrbit(answers);assert.ok(ORBITS[result]);assert.equal(matchOrbit(answers),result);outcomes.add(result);}
 assert.equal(outcomes.size,5);assert.equal(matchOrbit([]),null);assert.equal(matchOrbit([0,0,0,0,99]),null);
});
test('result categories partition the actual 22-student roster including all animation disciplines',()=>{
 const students=Object.keys(ORBITS).flatMap(orbit=>creatorsForOrbit(creatorData,orbit));assert.equal(students.length,22);assert.equal(new Set(students.map(c=>c.id)).size,22);
 assert.equal(creatorsForOrbit(creatorData,'Animation').length,4);assert.equal(creatorsForOrbit(creatorData,'Advertising')[0].name,'WEE DING WEN');assert.equal(creatorsForOrbit(creatorData,'Publishing')[0].name,'LIM SOON TECK');
});
