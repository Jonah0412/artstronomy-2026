import { createHandSignal } from './hand-signal.js';
import { CosmicAudio } from './cosmic-audio.js';
import { BAND, LOCK_DELAY, LOCK_RADIUS, clampFrequency, normalizeFrequency, makeBeacons, nearestBeacon } from './signal-model.js';

// HTML shell + Canvas renderer. This module has no framework or external imports.
export function mountRadioScanner(host, { creators = [] } = {}) {
  const beacons=makeBeacons(creators), root=document.createElement('section');
  root.className='radio';root.setAttribute('aria-label','ARTStronomy deep-sky radio scanner');
  // Primary task first: tune a signal, then meet its creator. Secondary scopes
  // sit below the dial, with the student receiver in a separate reading column.
  root.innerHTML=`
    <header class="radio__header">
      <div><span class="radio__kicker">ARTSTRONOMY / OBSERVATORY 2026</span><h2>Find your <em>frequency.</em></h2><p>Explore 22 creative worlds. One signal at a time.</p></div>
      <div class="radio__sound"><button class="radio__audio" type="button" data-audio aria-pressed="false"><i aria-hidden="true">♪</i><span>AUDIO FEED MUTED</span><small>Enable cosmic sound</small></button><label class="radio__volume">Volume<input type="range" data-volume min="0" max="50" step="1" value="22" aria-label="Audio volume"></label></div>
    </header>
    <div class="radio__body">
      <div class="radio__instruments">
        <section class="radio__panel radio__spectrum" aria-label="Frequency tuner">
          <div class="radio__readout"><div class="radio__tuned"><span class="radio__kicker">YOU ARE LISTENING AT</span><div><output data-frequency>1420.40</output><b>MHz</b></div><small data-ghz>1.42040 GHz</small></div><div class="radio__live"><i></i>LIVE SCAN<span>22 BEACONS</span></div></div>
          <div class="radio__band"><canvas data-spectrum aria-hidden="true"></canvas><div class="radio__beacons"></div><div class="radio__needle" aria-hidden="true"><span data-needle-label>1420.4</span></div></div>
          <div class="radio__axis" aria-hidden="true"><span>1,200</span><span>1,300</span><span>1,400</span><span>1,500</span><span>1,600</span><span>1,700 MHz</span></div>
          <div class="radio__dial"><label>Slide to discover <span>Hold on a peak to lock a signal</span></label><input data-frequency-input type="range" min="1200" max="1700" step="0.1" value="1420.4" aria-label="Radio frequency in megahertz"><div class="radio__dial-hint"><span>← → keys for fine tuning</span><span>Or tap a numbered beacon above</span></div></div>
        </section>
        <div class="radio__secondary">
          <section class="radio__panel radio__waterfall"><div class="radio__panel-head"><span>SIGNAL WATERFALL</span><span data-clock>T + 00:00</span></div><canvas data-waterfall aria-hidden="true"></canvas><div class="radio__intensity"><span>LOW</span><i></i><span>HIGH</span><span>TIME ↓</span></div></section>
          <section class="radio__panel radio__wave"><div class="radio__panel-head"><span>PULSAR WAVE</span><span data-wave-state>VISUAL SIMULATION</span></div><canvas data-wave aria-hidden="true"></canvas><div class="radio__wave-caption">The rhythm of your selected signal</div></section>
        </div>
      </div>
      <aside class="radio__receiver" aria-label="Student signal receiver">
        <div class="radio__receiver-head"><span>YOUR DISCOVERY</span><span data-status>SEARCHING</span></div>
        <div class="radio__image"><canvas data-static aria-hidden="true"></canvas><img data-image alt="" hidden><div class="radio__waiting"><span aria-hidden="true">✳</span><b>A world is waiting.</b><small>Tune in to reveal its creator.</small></div><span data-image-label>AWAITING TRANSMISSION</span></div>
        <div class="radio__decode" data-decode aria-live="polite"><span class="radio__code" data-code>NO BEACON LOCK</span><h3 data-name>Who will you discover?</h3><div class="radio__category" data-category>22 student transmissions</div><p data-title>Slide the dial or choose a student below to begin.</p></div>
        <div class="radio__telemetry"><span>SIGNAL STRENGTH <b data-strength>0%</b></span><div><i data-meter></i></div><span><span data-coordinate>RF / — MHz</span><b data-progress>SCANNING</b></span></div>
        <div class="radio__browse"><label class="radio__creator-select"><span>Explore the creators</span><select data-select><option value="">Choose a student signal</option></select></label><div class="radio__navigation"><button type="button" data-prev>← Previous</button><button type="button" data-next>Next signal →</button></div></div>
        <div class="radio__radar"><canvas data-radar aria-hidden="true"></canvas><div><b>22 signals. Endless possibilities.</b><span>From our universe to yours.</span></div></div>
      </aside>
    </div>
    <footer class="radio__footnote"><span>EXHIBITION SIGNAL SIMULATION · 1.200–1.700 GHz</span><span data-tracking>Mouse, touch & keyboard ready</span></footer><p class="radio__notice" data-notice role="status" hidden></p>`;
  host.append(root);const q=s=>root.querySelector(s),abort=new AbortController();
  const listen=(target,event,callback,options={})=>target.addEventListener(event,callback,{...options,signal:abort.signal});
  let lastVisual=0;
  let frequency=1420.4,movementAnchor=1420.4,locked=null,candidate=null,lastMoved=performance.now(),frame=0,disposed=false,audioBusy=false;
  let clock=0,lastTime=0,lastWaterfall=0,lastReadout=0,lastPointer=-Infinity;
  const handSignal=createHandSignal(BAND.min,BAND.max);
  let visible=true,pointerId=null;
  const reduce=matchMedia('(prefers-reduced-motion: reduce)').matches;
  const needle=q('.radio__needle'),frequencyInput=q('[data-frequency-input]');
  const uniqueId=`radio-frequency-${Math.random().toString(36).slice(2)}`;frequencyInput.id=uniqueId;q('.radio__dial label').htmlFor=uniqueId;
  const audio=new CosmicAudio(enabled=>{
    if(disposed)return;
    q('[data-audio]').setAttribute('aria-pressed',String(enabled));q('[data-audio] span').textContent=enabled?'AUDIO FEED ENABLED':'AUDIO FEED MUTED';
    q('[data-audio] small').textContent=enabled?'Cosmic sound is on':'Enable cosmic sound';
    q('[data-wave-state]').textContent=enabled?'LIVE SYNTH AUDIO':'VISUAL SIMULATION';
  });
  function notice(text){q('[data-notice]').hidden=!text;q('[data-notice]').textContent=text;}
  function updateFrequency(){
    q('[data-frequency]').textContent=frequency.toFixed(2);q('[data-ghz]').textContent=`${(frequency/1000).toFixed(5)} GHz`;
    q('[data-needle-label]').textContent=frequency.toFixed(1);needle.style.left=`${normalizeFrequency(frequency)*100}%`;
    frequencyInput.value=frequency;frequencyInput.setAttribute('aria-valuetext',`${frequency.toFixed(2)} megahertz${locked?`, locked to ${locked.name}`:''}`);
  }
  function unlock(){
    if(!locked)return;locked=null;root.classList.remove('is-locked');
    q('[data-code]').textContent='FIND YOUR NEXT SIGNAL';q('[data-name]').textContent='Keep exploring.';
    q('[data-title]').textContent='Hold the dial steady on a beacon.';q('[data-category]').textContent='22 student transmissions';
    q('[data-image]').hidden=true;q('[data-image-label]').textContent='AWAITING TRANSMISSION';
    q('[data-select]').value='';
    for(const button of root.querySelectorAll('[data-beacon]'))button.setAttribute('aria-pressed','false');
  }
  function tune(value,{jump=false,hand=false}={}){
    const next=clampFrequency(value);if(Math.abs(next-movementAnchor)>.35){lastMoved=performance.now();movementAnchor=next;}
    frequency=next;if(!hand){lastPointer=performance.now();handSignal.reset();}
    if(locked&&Math.abs(frequency-locked.frequency)>LOCK_RADIUS)unlock();
    if(jump)lastMoved=performance.now()-LOCK_DELAY;
    audio.tune(normalizeFrequency(frequency),locked?.index??-1);updateFrequency();
  }
  function lock(beacon){
    if(locked?.index===beacon.index)return;
    locked=beacon;root.classList.add('is-locked');
    q('[data-code]').textContent=`${beacon.code} / TRANSMISSION DECODED`;q('[data-name]').textContent=beacon.name;
    q('[data-title]').textContent=beacon.projectTitle||'Project title to be announced';q('[data-category]').textContent=beacon.category;
    const image=q('[data-image]');image.src=beacon.projectThumbnail||beacon.image||'';image.hidden=!image.getAttribute('src');
    image.alt=beacon.projectThumbnail?`${beacon.name} project preview`:`${beacon.category} exhibition artwork`;
    q('[data-image-label]').textContent=beacon.projectThumbnail?'PROJECT THUMBNAIL':'CATEGORY ARTWORK · PROJECT PREVIEW PENDING';
    q('[data-select]').value=beacon.index;q('[data-status]').textContent='BEACON LOCKED';
    for(const button of root.querySelectorAll('[data-beacon]'))button.setAttribute('aria-pressed',String(Number(button.dataset.beacon)===beacon.index));
    audio.tune(normalizeFrequency(frequency),beacon.index);updateFrequency();
  }
  listen(q('[data-image]'),'error',()=>{q('[data-image]').hidden=true;q('[data-image-label]').textContent='PROJECT IMAGE NOT AVAILABLE';});
  for(const beacon of beacons){
    const button=document.createElement('button');button.type='button';button.dataset.beacon=beacon.index;button.textContent=String(beacon.index+1).padStart(2,'0');
    button.style.left=`${normalizeFrequency(beacon.frequency)*100}%`;button.setAttribute('aria-label',`${beacon.name}, ${beacon.frequency.toFixed(2)} MHz`);button.setAttribute('aria-pressed','false');
    listen(button,'click',()=>tune(beacon.frequency,{jump:true}));q('.radio__beacons').append(button);
    const option=document.createElement('option');option.value=beacon.index;option.textContent=`${beacon.code} · ${beacon.name}`;q('[data-select]').append(option);
  }
  listen(q('[data-select]'),'change',event=>{const beacon=beacons[Number(event.target.value)];if(event.target.value!==''&&beacon)tune(beacon.frequency,{jump:true});});
  listen(frequencyInput,'input',event=>tune(event.target.value));
  for(const [name,direction] of [['prev',-1],['next',1]])listen(q(`[data-${name}]`),'click',()=>{
    const found=nearestBeacon(beacons,frequency).beacon;if(found){const index=(found.index+direction+beacons.length)%beacons.length;tune(beacons[index].frequency,{jump:true});}
  });
  const band=q('.radio__band');
  const scrub=event=>{const rect=band.getBoundingClientRect();tune(BAND.min+(event.clientX-rect.left)/rect.width*(BAND.max-BAND.min));};
  listen(band,'pointerdown',event=>{if(event.target.closest('button'))return;if(event.pointerType==='mouse'&&event.button!==0)return;pointerId=event.pointerId;band.setPointerCapture(pointerId);scrub(event);});
  listen(band,'pointermove',event=>{if(pointerId===event.pointerId)scrub(event);});
  const endScrub=event=>{if(pointerId===event.pointerId){pointerId=null;lastMoved=performance.now();if(band.hasPointerCapture(event.pointerId))band.releasePointerCapture(event.pointerId);}};
  listen(band,'pointerup',endScrub);listen(band,'pointercancel',endScrub);
  listen(q('[data-audio]'),'click',async()=>{
    if(audioBusy)return;if(audio.enabled){audio.mute();notice('');return;}
    audioBusy=true;q('[data-audio]').disabled=true;
    try{const enabled=await audio.enable();if(!enabled)notice('Tap Audio Feed again to start sound.');else notice('');}
    catch{notice('Audio could not start in this browser. The visual scanner is still available.');}
    finally{audioBusy=false;if(!disposed)q('[data-audio]').disabled=false;}
  });
  listen(q('[data-volume]'),'input',event=>audio.setVolume(Number(event.target.value)/100));
  function pause(){audio.mute();}
  listen(document,'visibilitychange',()=>{if(document.hidden)pause();});
  const intersection=new IntersectionObserver(entries=>{visible=entries[0]?.isIntersecting??true;if(!visible)pause();});intersection.observe(host);

  // Canvas setup. Each panel owns one canvas; waterfall history is a tiny bitmap
  // shifted at 20 Hz instead of reading back a full-resolution GPU canvas.
  const panels={};
  for(const name of ['spectrum','waterfall','wave','radar','static']){
    const canvas=q(`[data-${name}]`);panels[name]={canvas,ctx:canvas.getContext('2d',{alpha:false}),w:1,h:1,visible:true};
  }
  const panelVisibility=new IntersectionObserver(entries=>{for(const entry of entries){const panel=Object.values(panels).find(p=>p.canvas===entry.target);if(panel)panel.visible=entry.isIntersecting;}},{root:host});
  Object.values(panels).forEach(p=>panelVisibility.observe(p.canvas));
  const history=document.createElement('canvas');history.width=256;history.height=128;
  const historyCtx=history.getContext('2d',{alpha:false});historyCtx.fillStyle='#061914';historyCtx.fillRect(0,0,256,128);
  const row=historyCtx.createImageData(256,1);const spectra=new Float32Array(256);
  const dpr=Math.min(window.devicePixelRatio||1,1.5);
  function resize(){for(const panel of Object.values(panels)){
    const rect=panel.canvas.getBoundingClientRect();panel.w=Math.max(1,rect.width);panel.h=Math.max(1,rect.height);
    const w=Math.round(panel.w*dpr),h=Math.round(panel.h*dpr);
    // Setting an unchanged canvas dimension still clears it and reallocates its bitmap.
    if(panel.canvas.width!==w||panel.canvas.height!==h){panel.canvas.width=w;panel.canvas.height=h;panel.ctx?.setTransform(dpr,0,0,dpr,0,0);}
  }}
  const observer=new ResizeObserver(resize);observer.observe(root);for(const panel of Object.values(panels))observer.observe(panel.canvas);resize();
  const noise=(x,t)=>{const n=Math.sin(x*12.9898+t*78.233)*43758.5453;return n-Math.floor(n);};
  function drawGrid(panel,rows=4,columns=10){
    const {ctx,w,h}=panel;ctx.fillStyle='#04130f';ctx.fillRect(0,0,w,h);ctx.strokeStyle='#95c0a715';ctx.lineWidth=1;ctx.beginPath();
    for(let i=1;i<columns;i++){const x=w*i/columns;ctx.moveTo(x,0);ctx.lineTo(x,h);}for(let i=1;i<rows;i++){const y=h*i/rows;ctx.moveTo(0,y);ctx.lineTo(w,y);}ctx.stroke();
  }
  const beaconProfiles=beacons.map(b=>Float32Array.from({length:256},(_,i)=>{const dx=(i/255-normalizeFrequency(b.frequency))/.005;return Math.exp(-dx*dx);}));
  const beaconAmplitudes=new Float32Array(beacons.length);
  function signalValues(t){
    for(let j=0;j<beacons.length;j++)beaconAmplitudes[j]=.22+.15*Math.sin(beacons[j].index*1.8+t*.7);
    const tuned=normalizeFrequency(frequency);
    for(let i=0;i<256;i++){
      const x=i/255;let value=.055+noise(i,Math.floor(t*18))*.13;
      for(let j=0;j<beacons.length;j++)value+=beaconProfiles[j][i]*beaconAmplitudes[j];
      const dx=(x-tuned)/.009;value+=Math.exp(-dx*dx)*(locked?.62:.2)*(1+.15*Math.sin(t*9));spectra[i]=Math.min(1,value);
    }
  }
  function drawSpectrum(t){
    const p=panels.spectrum;drawGrid(p);const{ctx,w,h}=p;
    const gradient=ctx.createLinearGradient(0,0,0,h);gradient.addColorStop(0,'#a1e2b766');gradient.addColorStop(1,'#76c6a500');
    ctx.beginPath();ctx.moveTo(0,h);
    for(let i=0;i<256;i++)ctx.lineTo(i/255*w,h-18-spectra[i]*(h-26));ctx.lineTo(w,h);ctx.closePath();ctx.fillStyle=gradient;ctx.fill();
    ctx.beginPath();for(let i=0;i<256;i++){const x=i/255*w,y=h-18-spectra[i]*(h-26);i?ctx.lineTo(x,y):ctx.moveTo(x,y);}ctx.strokeStyle='#a6dec0';ctx.lineWidth=1.2;ctx.stroke();
    ctx.font='11px monospace';ctx.fillStyle='#85a797';ctx.fillText('−20 dB',8,18);ctx.fillText('−80 dB',8,h-22);
    if(!reduce){ctx.fillStyle='#bce4bd09';ctx.fillRect((t*.10%1)*w,0,28,h);}
  }
  function drawWaterfall(now){
    if(now-lastWaterfall>50){
      historyCtx.drawImage(history,0,0,256,127,0,1,256,127);
      for(let i=0;i<256;i++){const v=spectra[i],o=i*4;row.data[o]=Math.round(6+v*185);row.data[o+1]=Math.round(23+v*215);row.data[o+2]=Math.round(21+Math.sin(v*Math.PI*.8)*112);row.data[o+3]=255;}
      historyCtx.putImageData(row,0,0);lastWaterfall=now;
    }
    const{ctx,w,h}=panels.waterfall;ctx.imageSmoothingEnabled=false;ctx.drawImage(history,0,0,w,h);
    const x=normalizeFrequency(frequency)*w;ctx.fillStyle='#e5d99b';ctx.fillRect(x,0,1,h);ctx.fillStyle='#04130f44';ctx.fillRect(0,0,w,2);
  }
  function drawWave(t){
    const p=panels.wave;drawGrid(p,4,12);const{ctx,w,h}=p,sample=audio.sample(),count=sample?sample.wave.length:400;
    ctx.strokeStyle=locked?'#e7d595':'#94d6b5';ctx.lineWidth=1.2;ctx.beginPath();
    for(let i=0;i<count;i++){
      const x=i/(count-1)*w;
      const v=sample?(sample.wave[i]-128)/128:Math.sin(i*.07*(1+normalizeFrequency(frequency)*2)+t*4)*.24+(noise(i,Math.floor(t*15))-.5)*(locked?.1:.32)+Math.pow(Math.max(0,Math.sin(i*.035-t*3)),24)*.5;
      const y=h*.5-v*h*.42;i?ctx.lineTo(x,y):ctx.moveTo(x,y);
    }ctx.stroke();
  }
  function drawRadar(t){
    const{ctx,w,h}=panels.radar;ctx.fillStyle='#04130f';ctx.fillRect(0,0,w,h);const cx=w/2,cy=h/2,r=Math.min(w,h)*.43;
    ctx.strokeStyle='#91c4a52b';ctx.lineWidth=1;
    for(let i=1;i<=3;i++){ctx.beginPath();ctx.arc(cx,cy,r*i/3,0,Math.PI*2);ctx.stroke();}
    ctx.beginPath();ctx.moveTo(cx-r,cy);ctx.lineTo(cx+r,cy);ctx.moveTo(cx,cy-r);ctx.lineTo(cx,cy+r);ctx.stroke();
    const sweep=reduce?0:t*.65;
    for(let i=0;i<20;i++){ctx.beginPath();ctx.moveTo(cx,cy);ctx.arc(cx,cy,r,sweep-i*.028,sweep-(i+1)*.028,true);ctx.closePath();ctx.fillStyle=`rgba(131,218,166,${.10*(1-i/20)})`;ctx.fill();}
    ctx.strokeStyle='#b6e3ba';ctx.beginPath();ctx.moveTo(cx,cy);ctx.lineTo(cx+Math.cos(sweep)*r,cy+Math.sin(sweep)*r);ctx.stroke();
    for(const b of beacons){const a=b.index*2.4,rad=r*(.25+(b.index%7)/10),active=locked===b;ctx.fillStyle=active?'#ffe3a2':'#86b29a';ctx.beginPath();ctx.arc(cx+Math.cos(a)*rad,cy+Math.sin(a)*rad,active?4:1.6,0,Math.PI*2);ctx.fill();}
  }
  function drawStatic(t){const{ctx,w,h}=panels.static;if(locked)return;ctx.fillStyle='#081910';ctx.fillRect(0,0,w,h);for(let y=0;y<h;y+=5){ctx.fillStyle=`rgba(156,191,163,${.02+noise(y,Math.floor(t*10))*.13})`;ctx.fillRect(0,y,w,2);}ctx.strokeStyle='#abc9a72c';ctx.strokeRect(w*.3,h*.25,w*.4,h*.5);}
  function tick(now){
    if(disposed)return;frame=requestAnimationFrame(tick);const dt=Math.min(.05,(now-(lastTime||now))/1000);lastTime=now;
    if(document.hidden||!visible)return;clock+=dt;
    const nearest=nearestBeacon(beacons,frequency);candidate=nearest.distance<=LOCK_RADIUS?nearest.beacon:null;
    const progress=candidate?Math.min(1,(now-lastMoved)/LOCK_DELAY):0;
    if(!locked&&candidate&&progress>=1&&pointerId===null)lock(candidate);
    if(now-lastVisual>=(pointerId===null?1000/30:1000/60)-.6){
      signalValues(reduce?0:clock);
      if(panels.spectrum.visible)drawSpectrum(clock);
      if(panels.waterfall.visible)drawWaterfall(now);
      if(panels.wave.visible)drawWave(reduce?0:clock);
      if(panels.radar.visible)drawRadar(clock);
      if(panels.static.visible)drawStatic(reduce?0:clock);
      lastVisual=now;
    }
    if(now-lastReadout>100){
      const strength=Math.max(4,Math.round(100*(1-Math.min(1,nearest.distance/16))));
      q('[data-strength]').textContent=`${strength}%`;q('[data-meter]').style.width=`${strength}%`;
      q('[data-status]').textContent=locked?'BEACON LOCKED':candidate?'ACQUIRING':'SEARCHING';
      q('[data-progress]').textContent=locked?'DECODED':candidate?`${Math.round(progress*100)}% LOCK`:'SCANNING';
      q('[data-coordinate]').textContent=`RF / ${(locked?.frequency??frequency).toFixed(2)} MHz`;
      q('[data-clock]').textContent=`T + ${String(Math.floor(clock/60)).padStart(2,'0')}:${String(Math.floor(clock%60)).padStart(2,'0')}`;lastReadout=now;
    }
  }
  updateFrequency();frame=requestAnimationFrame(tick);
  return {
    tune,
    setHand(hand){if(disposed)return;if(performance.now()-lastPointer<1600){handSignal.reset();return;}const next=handSignal.update(hand,frequency);if(next!==null)tune(next,{hand:true});},
    setTrackingStatus(text){if(!disposed)q('[data-tracking]').textContent=text;},
    destroy(){if(disposed)return;disposed=true;cancelAnimationFrame(frame);abort.abort();observer.disconnect();intersection.disconnect();panelVisibility.disconnect();audio.destroy();root.remove();}
  };
}
