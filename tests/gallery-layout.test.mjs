import test from 'node:test';
import assert from 'node:assert/strict';
import { creatorData } from '../src/cosmic/creators.js';
import { exhibitLayout, visitPosition, constrainPosition, wrapExhibit, ROOM, walkingPath, straightWalk, insideMuseum } from '../src/gallery/gallery-layout.js';

test('all 22 real creators have distinct exhibit positions and reachable viewing stops', () => {
  const exhibits = exhibitLayout(creatorData);
  assert.equal(exhibits.length, 22);
  assert.equal(new Set(exhibits.map(e => `${e.x},${e.z}`)).size, 22);
  for (const exhibit of exhibits) {
    assert.ok(creatorData.some(c => c.id === exhibit.id && c.name === exhibit.name && c.category === exhibit.category));
    const stop = visitPosition(exhibit);
    assert.deepEqual(constrainPosition(stop.x, stop.z), { x: stop.x, z: stop.z });
    // Camera forward must point towards the exhibit wall.
    assert.ok(-Math.sin(stop.yaw)*(exhibit.x-stop.x)-Math.cos(stop.yaw)*(exhibit.z-stop.z)>2.8);
    assert.ok(exhibit.z > ROOM.back && exhibit.z < ROOM.front);
  }
});
test('navigation wraps and free movement stays away from room boundaries', () => {
  assert.equal(wrapExhibit(-1, 23), 22);
  assert.equal(wrapExhibit(23, 23), 0);
  for (const [x, z] of [[100, 100], [-100, -100], [0, -15]]) {
    const safe = constrainPosition(x, z);
    assert.ok(Math.abs(safe.x) < ROOM.halfWidth && safe.z > ROOM.back && safe.z < ROOM.front);
  }
});

test('all exhibit-to-exhibit paths stay within the connected museum floors',()=>{
 const stops=[{x:0,z:5},...exhibitLayout(creatorData).map(e=>visitPosition(e))];
 for(const from of stops)for(const to of stops){let previous=from;for(const leg of walkingPath(from,to)){assert.ok(straightWalk(previous,leg),`unsafe segment ${JSON.stringify([previous,leg])}`);assert.ok(insideMuseum(leg.x,leg.z));previous=leg;}assert.equal(previous.x,to.x);assert.equal(previous.z,to.z);}
 const counts={};for(const e of exhibitLayout(creatorData))counts[e.wing]=(counts[e.wing]||0)+1;
 assert.deepEqual(counts,{interaction:13,identity:5,animation:4});
});

test('tap walking routes around the atrium holographic table',()=>{
 const from={x:-9,z:1.8},to={x:-3,z:1.8};
 assert.equal(straightWalk(from,to),false);
 const route=walkingPath(from,to);assert.ok(route.length>1);
 let previous=from;for(const leg of route){assert.ok(straightWalk(previous,leg));previous=leg;}
 assert.equal(previous.x,to.x);assert.equal(previous.z,to.z);
 assert.notDeepEqual(constrainPosition(-6.1,1.8),{x:-6.1,z:1.8});
});
