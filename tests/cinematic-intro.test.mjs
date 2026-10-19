import test from 'node:test';
import {openingLines,journeyLines} from '../src/loading/journey-copy.js';
import assert from 'node:assert/strict';
import {shouldShowIntro,rememberIntro,reconstruct,boundedReady} from '../src/loading/intro-model.js';
test('session completion suppresses intro, while deep links bypass it',()=>{
 const values=new Map();const storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};
 assert.equal(shouldShowIntro(storage),true);assert.equal(shouldShowIntro(storage,'#creators'),false);
 rememberIntro(storage);assert.equal(shouldShowIntro(storage),false);
});
test('blocked storage cannot break entry',()=>{
 const storage={getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}};
 assert.equal(shouldShowIntro(storage),true);assert.doesNotThrow(()=>rememberIntro(storage));
});
test('reconstruction preserves resolved prefix and exact final copy',()=>{
 for(const text of openingLines){
 assert.equal(reconstruct(text,1,11),text);
 assert.equal(reconstruct(text,.6,2).slice(0,Math.floor(text.length*.6)),text.slice(0,Math.floor(text.length*.6)));
 }
});
test('failed assets and permanently pending assets both release readiness',async()=>{
 await boundedReady([Promise.reject(Error('image failed'))],20);
 await boundedReady([new Promise(()=>{})],20);
});
test('unmount abort releases outstanding readiness',async()=>{
 const abort=new AbortController(); const ready=boundedReady([new Promise(()=>{})],10000,abort.signal);
 abort.abort(); await ready;
});

test('opening preserves requested wording and each destination has distinct three-line copy',()=>{
 assert.deepEqual(openingLines,['22 CREATORS','5 DISCIPLINE','ONE UNIVERSAL']);
 const destinations=['ar','gallery','scanner','website','station'];
 assert.equal(new Set(destinations.map(to=>journeyLines(to).join('|'))).size,5);
 for(const to of destinations){assert.equal(journeyLines(to).length,3);assert.ok(journeyLines(to).every(line=>line.length>0));}
 assert.equal(journeyLines('unknown'),journeyLines('station'));
});
