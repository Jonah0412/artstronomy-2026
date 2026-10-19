import test from 'node:test';
import assert from 'node:assert/strict';
import {CosmicAudio} from '../src/radio/cosmic-audio.js';
import {BAND,LOCK_RADIUS,makeBeacons,nearestBeacon,clampFrequency,signalMatch} from '../src/radio/signal-model.js';
import {brandSignals} from '../src/radio/brand-signals.js';

class Param{constructor(value=0){this.value=value;}setTargetAtTime(value){this.value=value;}setValueAtTime(value){this.value=value;}cancelScheduledValues(){}}
class Node{constructor(){for(const field of ['gain','frequency','Q','threshold','knee','ratio','attack','release'])this[field]=new Param();this.frequencyBinCount=512;}connect(){}disconnect(){this.disconnected=true;}start(){this.started=true;}stop(){this.stopped=true;}getByteTimeDomainData(array){array.fill(128);}getByteFrequencyData(array){array.fill(0);}}
class Context{static count=0;constructor(){Context.count++;this.state='suspended';this.currentTime=0;this.sampleRate=8000;this.destination=new Node();this.listeners=new Map();}createGain(){return new Node();}createAnalyser(){return new Node();}createDynamicsCompressor(){return new Node();}createOscillator(){return new Node();}createBiquadFilter(){return new Node();}createBufferSource(){return new Node();}createWaveShaper(){return new Node();}createBuffer(channels,size){return{getChannelData:()=>new Float32Array(size)}}addEventListener(name,fn){this.listeners.set(name,fn);}removeEventListener(name){this.listeners.delete(name);}async resume(){this.state='running';}async suspend(){this.state='suspended';this.listeners.get('statechange')?.();}async close(){this.state='closed';}}

test('Four Hoshi expressions are individually lockable signals',()=>{
 const beacons=makeBeacons(brandSignals);assert.deepEqual(beacons.map(b=>b.id),['happy','surprised','shy','excited']);assert.equal(new Set(beacons.map(b=>b.frequency)).size,4);
 for(const beacon of beacons){assert.equal(nearestBeacon(beacons,beacon.frequency).beacon,beacon);assert.ok(beacon.frequency>BAND.min&&beacon.frequency<BAND.max);}
 for(let i=1;i<beacons.length;i++)assert.ok(beacons[i].frequency-beacons[i-1].frequency>LOCK_RADIUS*2);
 assert.equal(clampFrequency(-1),1200);assert.equal(clampFrequency(9999),1700);
});
test('audio remains unconstructed until enabled; mute and teardown release all sound sources',async()=>{
 globalThis.window={AudioContext:Context};const count=Context.count;const audio=new CosmicAudio();
 assert.equal(Context.count,count);assert.equal(audio.enabled,false);assert.equal(audio.sample(),null);
 assert.equal(await audio.enable(),true);assert.equal(Context.count,count+1);assert.ok(audio.master.gain.value>0);
 audio.tune(.6,2);assert.equal(audio.noiseGain.gain.value,.035);audio.mute();assert.equal(audio.enabled,false);assert.equal(audio.master.gain.value,0);
 const sources=[...audio.sources],nodes=[...audio.nodes];audio.destroy();assert.equal(audio.context.state,'closed');
 assert.ok(sources.every(s=>s.stopped));assert.ok(nodes.every(n=>n.disconnected));assert.equal(await audio.enable(),false);
});
test('browser suspension cannot leave an audible feed behind a muted label',async()=>{
 globalThis.window={AudioContext:Context};const audio=new CosmicAudio();await audio.enable();await audio.context.suspend();
 assert.equal(audio.enabled,false);assert.equal(audio.master.gain.value,0);await audio.context.resume();assert.equal(audio.master.gain.value,0);audio.destroy();
});

test('detection percentage follows proximity and remains bounded',()=>{
 const beacons=makeBeacons(brandSignals);
 assert.equal(signalMatch([],1400),0);
 for(const beacon of beacons) assert.equal(signalMatch(beacons,beacon.frequency),100);
 assert.equal(signalMatch(beacons,BAND.min),0);
 assert.equal(signalMatch(beacons,beacons[0].frequency+50),50);
 for(let f=1000;f<1900;f++)assert.ok(signalMatch(beacons,f)>=0&&signalMatch(beacons,f)<=100);
});
