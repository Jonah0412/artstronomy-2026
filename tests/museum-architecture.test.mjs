import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {buildMuseum} from '../src/gallery/museum-architecture.js';
import {exhibitLayout,visitPosition} from '../src/gallery/gallery-layout.js';
import {creatorData} from '../src/cosmic/creators.js';
import {environmentQuality} from '../src/environments/quality.js';
import {surfaceTexture} from '../src/environments/materials.js';

test('museum architecture never occludes any of the 22 artworks from its viewing stop',()=>{
 const resources=new Set(),own=x=>(resources.add(x),x),scene=new T.Scene(),shell=new T.Group(),exhibits=new T.Group();scene.add(shell,exhibits);
 const layout=exhibitLayout(creatorData),world=buildMuseum({shell,exhibits,layout,own,textureFor:()=>own(new T.Texture()),textTexture:()=>own(new T.MeshBasicMaterial()),quality:environmentQuality()});
 scene.updateMatrixWorld(true);assert.equal(world.artMeshes.length,22);assert.equal(world.captions.length,22);
 const camera=new T.PerspectiveCamera(65,1,.06,220),ray=new T.Raycaster();
 for(const exhibit of layout){const stop=visitPosition(exhibit);camera.position.set(stop.x,stop.y,stop.z);camera.lookAt(exhibit.x,2.15,exhibit.z);camera.updateMatrixWorld(true);ray.setFromCamera(new T.Vector2(),camera);
  const hit=ray.intersectObjects(scene.children,true).find(h=>h.object.isMesh&&!h.object.material.transparent);assert.equal(hit?.object.userData.index,exhibit.index,`${exhibit.name} is obstructed`);
 }
 let visibleDraws=0;scene.traverse(o=>{if(o.isMesh||o.isPoints||o.isLine)visibleDraws++;});assert.ok(visibleDraws<=90,`${visibleDraws} primary objects exceed scene budget`);
 resources.forEach(r=>r.dispose?.());
});
test('mobile tier excludes reflection and bloom; procedural texture detail stays small',()=>{
 const mobile=environmentQuality({mobile:true,memory:4,cores:4}),desktop=environmentQuality();
 assert.equal(mobile.fps,30);assert.equal(mobile.reflections,false);assert.equal(mobile.bloom,false);assert.equal(desktop.fps,60);assert.equal(desktop.reflections,true);
 const texture=surfaceTexture();assert.ok(texture.image.data.byteLength<=256*256*4);texture.dispose();
});
