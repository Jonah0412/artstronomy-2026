import { test } from 'node:test';
import assert from 'node:assert/strict';
import { createDeviceLook, isHandheld } from '../src/immersive/device-look.js';

test('detect phones and desktop-mode iPads without treating every touch laptop as mobile',()=>{
  for(const navigator of [{userAgent:'iPhone'}, {userAgent:'Android'}, {platform:'MacIntel',maxTouchPoints:5}])assert.equal(isHandheld({navigator}),true);
  assert.equal(isHandheld({navigator:{platform:'Win32',maxTouchPoints:10,userAgent:'Chrome'}}),false);
});

test('motion needs a gesture for permission, calibrates relative to current view, and cleans up',async()=>{
  const listeners=new Map(),states=[],applied=[];let prompts=0;
  globalThis.window={isSecureContext:true,addEventListener:(k,v)=>listeners.set(k,v),removeEventListener:k=>listeners.delete(k)};
  globalThis.document={hidden:false};globalThis.screen={orientation:{angle:0}};
  Object.defineProperty(globalThis,'navigator',{configurable:true,value:{userAgent:'iPhone'}});
  globalThis.DeviceOrientationEvent=window.DeviceOrientationEvent={requestPermission:async()=>{prompts++;return 'granted';}};
  const control=createDeviceLook({read:()=>({yaw:.4,pitch:.2}),apply:p=>applied.push(p),onState:s=>states.push(s)});
  await control.start();assert.equal(prompts,0);assert.equal(states.at(-1),'permission');
  await control.start(true);assert.equal(prompts,1);
  const orientation=listeners.get('deviceorientation');
  orientation({alpha:null,beta:null,gamma:null});assert.equal(applied.length,0);
  orientation({alpha:359,beta:90,gamma:0});assert.ok(Math.abs(applied[0].yaw-.4)<.0001);assert.ok(Math.abs(applied[0].pitch-.2)<.0001);
  orientation({alpha:1,beta:90,gamma:0});assert.ok(Math.abs(applied[1].yaw-applied[0].yaw)<.1,'heading wrap must not spin the view');
  control.dispose();assert.equal(listeners.size,0);
  const next=createDeviceLook({read:()=>({yaw:0,pitch:0}),apply:()=>{}});await next.start();assert.equal(prompts,1,'same visit can reuse the permission');next.dispose();
});
