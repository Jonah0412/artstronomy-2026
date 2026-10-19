import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {initialPixelRatio,createRenderBudget,createFrameGate} from '../src/performance/render-budget.js';
import {batchStatic} from '../src/performance/batch-static.js';
import {buildHubScene} from '../src/hub/hub-scene.js';

test('cap physical pixel work on high density phones and 4K laptops',()=>{
  assert.equal(initialPixelRatio({dpr:3,width:390,height:844,mobile:true}),1.25);
  const ratio=initialPixelRatio({dpr:2,width:2560,height:1440});
  assert.ok(2560*1440*ratio*ratio<=2400001);
});
test('sustained slow frames lower resolution; fast recovery is conservative and bounded',()=>{
  const changes=[],budget=createRenderBudget(1.5,r=>changes.push(r));
  for(let t=1;t<20000;t+=34)budget.sample(t);
  assert.ok(changes.length>0&&budget.ratio<1.5&&budget.ratio>=.65);
  const low=budget.ratio;budget.reset();
  for(let t=20001;t<66000;t+=1000/60)budget.sample(t);
  assert.ok(budget.ratio>low&&budget.ratio<=1.5);
});
test('60 Hz rendering stays near 60 fps on 60, 90 and 120 Hz displays',()=>{
  for(const refresh of [60,90,120]){const gate=createFrameGate();let frames=0;for(let i=0;i<refresh*5;i++)if(gate.due(i*1000/refresh))frames++;assert.ok(frames>=299&&frames<=301,`${refresh} Hz produced ${frames}`);}
});
test('static batching preserves transformed world geometry and independent picking targets',()=>{
  const parent=new T.Group();parent.position.set(1,2,3);parent.rotation.y=.4;
  const geometry=new T.BoxGeometry(),material=new T.MeshBasicMaterial();const solids=[];
  for(let i=0;i<5;i++){const m=new T.Mesh(geometry,material);m.position.set(i,0,0);m.scale.set(i+1,2,3);parent.add(m);solids.push(m);}
  parent.updateMatrixWorld(true);const before=solids.map(m=>m.matrixWorld.clone());
  const target=new T.Mesh(geometry,material);parent.add(target);
  batchStatic(parent,m=>m!==target);parent.updateMatrixWorld(true);
  const batch=parent.children.find(o=>o.isInstancedMesh),matrix=new T.Matrix4();
  assert.equal(batch.count,5);assert.ok(parent.children.includes(target));
  before.forEach((expected,i)=>{batch.getMatrixAt(i,matrix);matrix.premultiply(batch.matrixWorld);assert.ok(matrix.elements.every((v,j)=>Math.abs(v-expected.elements[j])<1e-5));});
  batch.dispose();geometry.dispose();material.dispose();
});
test('renovated cockpit keeps the four monitors within bounded geometry and draw inventory',()=>{
  const materials=Array.from({length:4},()=>new T.MeshBasicMaterial());const world=buildHubScene({screenMaterials:materials});let meshes=0,triangles=0;
  world.scene.traverse(o=>{if(o.isMesh){meshes++;triangles+=(o.geometry.index?.count??o.geometry.attributes.position.count)/3*(o.count??1);}});
  assert.ok(meshes<100);assert.ok(triangles<300000&&triangles>150000);assert.equal(world.screens.length,4);
  world.dispose();materials.forEach(m=>m.dispose());
});
