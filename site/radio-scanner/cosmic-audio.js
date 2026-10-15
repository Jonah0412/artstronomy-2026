// Native Web Audio only: no audio files, microphone, remote service or paid library.
// Constructing this class is silent. enable() MUST run from a user gesture.
export class CosmicAudio {
  constructor(onState = () => {}) {
    this.onState = onState; this.context = null; this.enabled = false;
    this.volume = .22; this.nodes = []; this.sources = []; this.frequency = .5;
    this.lockIndex = -1; this.closed = false; this.revision = 0;
  }
  build() {
    const Context = window.AudioContext || window.webkitAudioContext;
    if (!Context) throw new Error('Web Audio is unavailable');
    const context = this.context = new Context();
    const node = value => { this.nodes.push(value); return value; };
    const oscillator = (type, frequency) => {
      const source = node(context.createOscillator()); source.type = type; source.frequency.value = frequency;
      this.sources.push(source); return source;
    };
    this.master = node(context.createGain()); this.master.gain.value = 0;
    this.analyser = node(context.createAnalyser()); this.analyser.fftSize = 1024; this.analyser.smoothingTimeConstant = .78;
    const limiter = node(context.createDynamicsCompressor()); limiter.threshold.value = -20; limiter.knee.value = 16; limiter.ratio.value = 8;
    limiter.attack.value = .005; limiter.release.value = .15;
    this.master.connect(limiter); limiter.connect(this.analyser); this.analyser.connect(context.destination);
    this.wave = new Uint8Array(this.analyser.fftSize); this.spectrum = new Uint8Array(this.analyser.frequencyBinCount);
    this.droneA = oscillator('sine', 90); this.droneB = oscillator('sine', 135); this.harmonic = oscillator('triangle', 180);
    const droneGain = node(context.createGain()); droneGain.gain.value = .22;
    this.droneA.connect(droneGain); this.droneB.connect(droneGain); droneGain.connect(this.master);
    this.harmonicGain = node(context.createGain()); this.harmonicGain.gain.value = .045;this.harmonic.connect(this.harmonicGain);this.harmonicGain.connect(this.master);
    const buffer = context.createBuffer(1, context.sampleRate * 2, context.sampleRate);
    const samples = buffer.getChannelData(0); let last = 0;
    for (let i = 0; i < samples.length; i++) { const white = Math.random() * 2 - 1; last = (last + .025 * white) / 1.025; samples[i] = last * 3.5; }
    const noise = node(context.createBufferSource());noise.buffer = buffer;noise.loop = true;this.sources.push(noise);
    this.noiseFilter = node(context.createBiquadFilter());this.noiseFilter.type = 'bandpass';this.noiseFilter.frequency.value = 900;this.noiseFilter.Q.value = .7;
    this.noiseGain = node(context.createGain());this.noiseGain.gain.value = .28;noise.connect(this.noiseFilter);this.noiseFilter.connect(this.noiseGain);this.noiseGain.connect(this.master);
    // Narrow pulses create recurring pulsar clicks, without scheduling new nodes.
    this.pulsar = oscillator('sine', 600); this.pulseClock = oscillator('sine', 1.5);
    const pulseShape = node(context.createWaveShaper());
    pulseShape.curve = Float32Array.from({length:512},(_,i)=>Math.pow(Math.max(0,(i/511*2-1)),32));
    const pulseDepth = node(context.createGain());pulseDepth.gain.value = .11;
    const pulseGain = node(context.createGain());pulseGain.gain.value = 0;
    this.pulseClock.connect(pulseShape);pulseShape.connect(pulseDepth);pulseDepth.connect(pulseGain.gain);this.pulsar.connect(pulseGain);pulseGain.connect(this.master);
    for (const source of this.sources) source.start();
    this.contextState = () => {
      if (context.state !== 'running' && this.enabled) { this.enabled = false; this.master.gain.cancelScheduledValues(context.currentTime); this.master.gain.setValueAtTime(0,context.currentTime); this.onState(false); }
    };
    context.addEventListener('statechange',this.contextState);
  }
  async enable() {
    if (this.closed) return false;
    const revision = ++this.revision;clearTimeout(this.suspendTimer);
    if (!this.context) this.build();
    await this.context.resume();
    if (this.closed || revision !== this.revision || this.context.state !== 'running') return false;
    this.enabled = true;this.tune(this.frequency, this.lockIndex);
    this.master.gain.cancelScheduledValues(this.context.currentTime);
    this.master.gain.setTargetAtTime(this.volume, this.context.currentTime, .07);this.onState(true);return true;
  }
  mute() {
    this.revision++;this.enabled = false;clearTimeout(this.suspendTimer);
    if (this.context && this.context.state !== 'closed') {
      const context = this.context;this.master.gain.cancelScheduledValues(context.currentTime);this.master.gain.setTargetAtTime(0,context.currentTime,.012);
      this.suspendTimer = setTimeout(()=>{if(!this.enabled && context.state==='running')context.suspend().catch(()=>{});},70);
    }
    this.onState(false);
  }
  setVolume(value) {
    this.volume = Math.max(0,Math.min(.5,Number(value) || 0));
    if(this.enabled)this.master.gain.setTargetAtTime(this.volume,this.context.currentTime,.04);
  }
  tune(normalized, lockIndex = -1) {
    this.frequency = Math.max(0,Math.min(1,normalized));this.lockIndex = lockIndex;
    if(!this.context || this.closed)return;
    const now=this.context.currentTime, f=this.frequency;
    const root=lockIndex>=0?65.406*Math.pow(2,(lockIndex%12)/12):58+f*148;
    const set=(parameter,value)=>parameter.setTargetAtTime(value,now,.10);
    set(this.droneA.frequency,root);set(this.droneB.frequency,root*(lockIndex>=0?1.5:1.498+f*.02));
    set(this.harmonic.frequency,root*(lockIndex>=0?2:2.01));set(this.harmonicGain.gain,lockIndex>=0?.08:.035);
    set(this.noiseFilter.frequency,250+f*3100);set(this.noiseGain.gain,lockIndex>=0?.035:.32);
    set(this.pulsar.frequency,root*(lockIndex>=0?4:3.1));set(this.pulseClock.frequency,lockIndex>=0?.8+(lockIndex%5)*.28:.7+f*3.4);
  }
  sample() {
    if(!this.enabled||!this.analyser)return null;
    this.analyser.getByteTimeDomainData(this.wave);this.analyser.getByteFrequencyData(this.spectrum);
    return {wave:this.wave,spectrum:this.spectrum,sampleRate:this.context.sampleRate};
  }
  destroy() {
    if(this.closed)return;this.closed=true;this.revision++;this.enabled=false;clearTimeout(this.suspendTimer);
    const context=this.context;
    if(context){this.master.gain.cancelScheduledValues(context.currentTime);this.master.gain.setValueAtTime(0,context.currentTime);context.removeEventListener('statechange',this.contextState);}
    for(const source of this.sources){try{source.stop();}catch{}}
    for(const node of this.nodes){try{node.disconnect();}catch{}}
    if(context&&context.state!=='closed')context.close().catch(()=>{});
    this.nodes=[];this.sources=[];this.onState(false);
  }
}
