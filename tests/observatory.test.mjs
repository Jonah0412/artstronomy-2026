import test from 'node:test';
import assert from 'node:assert/strict';
import { creators, creatorCount, disciplines, creatorsIn, disciplineOf, animationMedia, projectStatus, clusterPoints } from '../src/observatory/content.js';
import { fitCanvasText } from '../src/observatory/canvas-type.js';
import { makeBeacons } from '../src/radio/signal-model.js';
import { exhibitLayout } from '../src/gallery/gallery-layout.js';

test('Observatory discipline filters partition the verified roster and match museum/radio identities',()=>{
  assert.equal(creatorCount,22);
  assert.equal(new Set(creators.map(c=>c.id)).size,22);
  const groups=disciplines.flatMap(creatorsIn);
  assert.deepEqual(groups.map(c=>c.id).sort(),creators.map(c=>c.id).sort());
  assert.deepEqual(Object.fromEntries(disciplines.map(d=>[d,creatorsIn(d).length])),{Branding:4,'Web Design':12,Publishing:1,Advertising:1,Animation:4});
  assert.deepEqual(makeBeacons(creators).map(c=>c.id),creators.map(c=>c.id));
  assert.deepEqual(exhibitLayout(creators).map(c=>c.id),creators.map(c=>c.id));
  for(const category of animationMedia)assert.equal(disciplineOf({category}),'Animation');
  assert.equal(creators.filter(c=>c.category==='Motion Graphic').length,0,'no invented Motion Graphic assignments');
  for(const c of creators)assert.equal(projectStatus(c),'Project details to be announced');
});

test('all constellation touch targets stay separated on the narrowest mobile map',()=>{
  const width=326,height=340;
  for(const d of disciplines){const points=clusterPoints(creatorsIn(d).length);
    for(let i=0;i<points.length;i++){
      assert.ok(points[i].x/100*width>=22 && points[i].x/100*width<=width-22);
      assert.ok(points[i].y/100*height>=70 && points[i].y/100*height<=height-22);
      for(let j=i+1;j<points.length;j++)assert.ok(Math.abs(points[i].x-points[j].x)/100*width>=44 || Math.abs(points[i].y-points[j].y)/100*height>=44,'44 px rectangular hit areas must not overlap');
    }
  }
});

test('museum names fit instrument plates without changing or truncating verified strings',()=>{
  // Conservative mono advance is 0.65 em, larger than IBM Plex Mono's 0.6 em.
  const ctx={font:'',measureText(text){return {width:text.length*Number(this.font.match(/ ([\d.]+)px/)[1])*.65};}};
  for(const creator of creators){const size=fitCanvasText(ctx,creator.name,696,34);assert.ok(size>=24);assert.ok(ctx.measureText(creator.name).width<=696);}
  const size=fitCanvasText(ctx,'A MUCH LONGER VERIFIED EXHIBITION DISPLAY LABEL',350,44);
  assert.ok(size<44);assert.ok(ctx.measureText('A MUCH LONGER VERIFIED EXHIBITION DISPLAY LABEL').width<=350);
});

test('Observatory text colors meet WCAG AA contrast on declared solid surfaces',()=>{
  const lum=hex=>{const rgb=hex.match(/[a-f\d]{2}/gi).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return rgb[0]*.2126+rgb[1]*.7152+rgb[2]*.0722;};
  for(const bg of ['05070c','0a0f18','101a2b','16202f'])for(const fg of ['edeff3','a8b2c0','e4b44e','7fd8e8'])assert.ok((lum(fg)+.05)/(lum(bg)+.05)>=4.5,`${fg} on ${bg}`);
});
