import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from 'three';
import {buildHubScene} from '../src/hub/hub-scene.js';
import {HUB_SCREENS,clampLook} from '../src/hub/hub-config.js';

test('all four real monitor meshes are visible and pickable from the seat',()=>{
 const materials=HUB_SCREENS.map(()=>new T.MeshBasicMaterial());
 const world=buildHubScene({screenMaterials:materials});
 const camera=new T.PerspectiveCamera(57,1363/936,.08,240);camera.position.set(0,2.75,6.35);camera.lookAt(0,2.85,-5);camera.updateMatrixWorld();world.scene.updateMatrixWorld(true);
 const ray=new T.Raycaster();const positions=[];
 for(const screen of world.screens){
   const p=screen.getWorldPosition(new T.Vector3());const ndc=p.clone().project(camera);positions.push(ndc.x);
   assert.ok(Math.abs(ndc.x)<.94&&Math.abs(ndc.y)<.8,`${screen.userData.id} falls outside the seated viewport`);
   ray.setFromCamera(new T.Vector2(ndc.x,ndc.y),camera);assert.equal(ray.intersectObjects(world.screens)[0]?.object.userData.id,screen.userData.id);
   assert.equal(ray.intersectObjects(world.scene.children,true).find(hit=>hit.object.isMesh)?.object.userData.id,screen.userData.id,'cockpit geometry must not obstruct a monitor');
 }
 assert.deepEqual(world.screens.map(s=>s.userData.id),['ar','gallery','scanner','website']);assert.ok(positions.every((p,i)=>i===0||p>positions[i-1]));
 world.dispose();materials.forEach(m=>m.dispose());
});
test('look controls remain within the forward seated cabin',()=>{assert.deepEqual(clampLook(8,-8),{yaw:.64,pitch:-.25});assert.deepEqual(clampLook(-8,8),{yaw:-.64,pitch:.38});});
