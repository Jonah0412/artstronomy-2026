import * as T from 'three';
import { batchStatic } from '../performance/batch-static.js';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import {createMaterialKit} from '../environments/materials.js';
import {createJovianSystem} from '../environments/jovian-system.js';
import {addCommandDetails} from './command-details.js';
import {createOrbitalDock} from './orbital-dock.js';
import { HUB_SCREENS } from './hub-config.js';

// Physical cockpit geometry, shared materials and instanced fasteners. The
// monitors are actual pickable meshes, not a background image with hotspots.
export function buildHubScene({ screenMaterials, nameplateMaterial, metalMap = null, planetMap = null, quality = {} }) {
  const scene = new T.Scene(); scene.background = new T.Color('#020409');
  const resources = new Set();
  const own = value => { resources.add(value); return value; };
  const mat = (color, metalness = .6, roughness = .4, extra = {}) => own(new T.MeshStandardMaterial({ color, metalness, roughness, ...extra }));
  const kit=createMaterialKit(own);
  const hull = kit.titanium;
  const panel = kit.carbon;
  const edge = mat('#7a817a', .86, .3);
  const black = mat('#090f12', .28, .32);
  const rubber = mat('#101414', .05, .85);
  const brass = mat('#b1a477', .72, .3);
  const yellow = mat('#ffd400', .25, .28, { emissive: '#ffd400', emissiveIntensity: 1.8 });
  const cyan = mat('#56c6b5', .1, .3, { emissive: '#56c6b5', emissiveIntensity: 1.6 });
  const rounded = own(new RoundedBoxGeometry(1, 1, 1, 3, .035));
  const cylinder = own(new T.CylinderGeometry(1, 1, 1, 16));
  const boltPositions = [];
  function box(parent, size, at, material, rotation) {
    const mesh = new T.Mesh(rounded, material); mesh.scale.set(...size); mesh.position.set(...at);
    if (rotation) mesh.rotation.set(...rotation); mesh.castShadow = true; mesh.receiveShadow = true; parent.add(mesh); return mesh;
  }
  function rod(parent, a, b, radius, material) {
    const start = new T.Vector3(...a), end = new T.Vector3(...b), delta = end.clone().sub(start);
    const mesh = new T.Mesh(cylinder, material); mesh.scale.set(radius, delta.length(), radius); mesh.position.copy(start.add(end).multiplyScalar(.5));
    mesh.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), delta.normalize()); parent.add(mesh); mesh.castShadow = true; return mesh;
  }
  function bolts(parent, points) { for (const p of points) boltPositions.push({ parent, p }); }
  const cabin = new T.Group(); scene.add(cabin);
  // Floor, ribs and tall window jambs wrap the seated visitor.
  box(cabin,[17,.18,15],[0,-1.15,1],panel);
  for (let i=-7;i<=7;i++) { box(cabin,[.035,.015,13],[i,-1.049,1],edge); }
  for (let z=-5;z<8;z+=2) box(cabin,[16,.02,.03],[0,-1.03,z],black);
  for (const side of [-1,1]) {
    box(cabin,[.35,7,13],[side*7.6,2.3,.5],hull);
    box(cabin,[.18,1.3,11],[side*7.37,.1,.5],black);
    for (let z=-4;z<9;z+=2.4) {
      box(cabin,[.28,6.4,.25],[side*7.28,2.1,z],edge,[0,0,side*.1]);
      box(cabin,[.09,1.1,.12],[side*7.05,4.05,z+.18],yellow,[0,0,side*.1]);
      for(let y=.8;y<4;y+=.34) box(cabin,[.09,.035,.42],[side*7.04,y,z],black);
    }
    // Angled foreground chair armrests establish a seated human scale.
    box(cabin,[.55,.28,2.1],[side*1.85,.1,5.2],rubber,[.06,0,0]);
    box(cabin,[.42,.7,.45],[side*1.85,-.3,5.35],black);
  }
  box(cabin,[15.3,.3,13],[0,6.5,.5],hull);
  for (let x=-6;x<=6;x+=3) box(cabin,[.22,.12,12],[x,6.25,1],edge);
  // Panoramic forward window: physical sill and trapezoidal load-bearing frame.
  const outline=[[-7.2,1.3,-3.2],[-7.05,5.7,-4.8],[7.05,5.7,-4.8],[7.2,1.3,-3.2]];
  for(let i=0;i<4;i++) { rod(cabin,outline[i],outline[(i+1)%4],.16,edge); }
  rod(cabin,[-7.1,1.55,-3.17],[7.1,1.55,-3.17],.08,black);
  for (const side of [-1,1]) {
    rod(cabin,[side*6.95,1.35,-3.15],[side*6.8,5.6,-4.74],.06,black);
    rod(cabin,[side*6.77,3.85,-4.2],[side*6.73,4.75,-4.55],.025,yellow);
    box(cabin,[.25,.5,.2],[side*6.85,3.55,-4.03],brass,[.2,0,0]);
  }
  box(cabin,[14.5,.22,.8],[0,1.3,-3.25],hull);
  // Segmented control desk, edge rails and visible underside supports.
  box(cabin,[13.8,.2,3.7],[0,.35,.2],hull,[.04,0,0]);
  box(cabin,[13.85,.09,.12],[0,.34,2.04],edge);
  for(let x=-6;x<=6;x+=2) {
    box(cabin,[1.9,.035,2.85],[x,.49,.12],panel,[.04,0,0]);
    box(cabin,[.055,.035,3.5],[x+.95,.5,.2],black);
    box(cabin,[.12,1.4,2.5],[x,-.35,.3],black);
    bolts(cabin,[[x-.78,.52,1.3],[x+.78,.52,1.3],[x-.78,.62,-1],[x+.78,.62,-1]]);
  }
  // Functional monitor assemblies with recessed glass and bolted metal bezels.
  const screens=[], monitorGroups=[], indicatorMaterials=[];
  HUB_SCREENS.forEach((screen,index) => {
    const group=new T.Group(); group.position.set(screen.x,1.85,screen.z); group.rotation.set(-.07,screen.yaw,0); cabin.add(group); monitorGroups.push(group);
    box(group,[2.73,1.94,.18],[0,0,0],edge);
    box(group,[2.65,1.86,.2],[0,0,.05],hull);
    box(group,[2.47,1.64,.12],[0,0,.16],rubber);
    const glass=new T.Mesh(own(new T.PlaneGeometry(2.34,1.48)),screenMaterials[index]); glass.position.z=.229; glass.userData.id=screen.id; group.add(glass); screens.push(glass);
    box(group,[.3,.46,.19],[0,-1.13,-.09],black);
    box(group,[1.03,.065,.45],[0,-1.37,-.05],edge);
    for (const x of [-1.25,1.25]) for(const y of [-.85,.85]) bolts(group,[[x,y,.178]]);
    // Edge vents and connector housing add depth when visitors turn their view.
    for(let v=-.65;v<=.65;v+=.16) {box(group,[.16,.035,.075],[1.29,v,.166],black);box(group,[.16,.035,.075],[-1.29,v,.166],black);}
    const indicator=mat('#ffe478',.1,.3,{emissive:'#d4ab42',emissiveIntensity:.5}); indicatorMaterials.push(indicator);
    box(group,[.2,.025,.025],[.99,.851,.173],indicator);
    rod(cabin,[screen.x,.66,screen.z-.08],[screen.x,.6,screen.z-.45],.04,black);
  });
  // Real tactile switches, LEDs, rotary knobs and ventilation grilles.
  for (const side of [-1,1]) {
    const controls=new T.Group();controls.position.set(side*4.3,.6,1);controls.rotation.x=-.03;cabin.add(controls);
    box(controls,[2.55,.09,1.12],[0,0,0],black);
    for(let i=0;i<4;i++) {
      const x=-.88+i*.57;
      const knob = new T.Mesh(cylinder,edge);knob.scale.set(.13,.17,.13);knob.position.set(x,.1,-.17);controls.add(knob);knob.castShadow=true;
      const cap = new T.Mesh(cylinder,black);cap.scale.set(.115,.07,.115);cap.position.set(x,.21,-.17);controls.add(cap);
      box(controls,[.015,.014,.07],[x,.254,-.19],brass);
      for(let j=0;j<2;j++) {box(controls,[.18,.05,.13],[x,.065,.17+j*.23],j?rubber:yellow);}
    }
    bolts(controls,[[-1.16,.06,-.44],[1.16,.06,-.44],[-1.16,.06,.44],[1.16,.06,.44]]);
  }
  for(let i=-10;i<=10;i++) box(cabin,[.035,.02,.58],[i*.065,.52,1.27],black);
  // Small illuminated ship insignia panel, positioned on the window lintel.
  box(cabin,[3.65,.55,.12],[0,5.42,-4.55],black);
  if(nameplateMaterial){const sign=new T.Mesh(own(new T.PlaneGeometry(3.35,.4)),nameplateMaterial);sign.position.set(0,5.42,-4.475);cabin.add(sign);}
  for(const x of [-2.1,2.1]) box(cabin,[.7,.035,.03],[x,5.44,-4.44],yellow);
  const details=addCommandDetails({cabin,own,box,rod,kit,quality});
  cabin.updateMatrixWorld(true);
  const boltGeo=own(new T.CylinderGeometry(.036,.036,.015,6));
  const boltMesh=new T.InstancedMesh(boltGeo,edge,boltPositions.length); const dummy=new T.Object3D();
  boltPositions.forEach(({parent,p},i)=> {dummy.position.set(...p);dummy.rotation.set(parent===cabin?0:Math.PI/2,0,0);dummy.updateMatrix();boltMesh.setMatrixAt(i,new T.Matrix4().multiplyMatrices(parent.matrixWorld,dummy.matrix));}); scene.add(boltMesh);
  const batching=batchStatic(cabin,m=>m.geometry===rounded||m.geometry===cylinder,own);
  cabin.traverse(o=>{o.updateMatrix();});
  // Exterior is real 3D; camera parallax and slow planet motion are independent.
  const cosmos=new T.Group();scene.add(cosmos);
  const jovian=createJovianSystem({parent:cosmos,own,texture:planetMap,quality,position:[-5,11,-39],radius:11});
  const planets=[]; // Motion is owned by jovian.update, avoiding double rotation.
  const dock=createOrbitalDock({own,materials:kit});dock.root.position.set(12,4,-50);dock.root.scale.setScalar(1.5);scene.add(dock.root);
  const previewScene=new T.Scene();previewScene.background=new T.Color('#04100e');
  const previewDock=createOrbitalDock({own,materials:kit});previewScene.add(previewDock.root);
  previewScene.add(new T.HemisphereLight('#cde7df','#182621',3));const previewKey=new T.DirectionalLight('#ffddb0',4);previewKey.position.set(5,6,8);previewScene.add(previewKey);
  const previewCamera=new T.PerspectiveCamera(48,2.45,.1,100);previewCamera.position.set(8,4,12);previewCamera.lookAt(0,0,0);
  const feed=new T.Mesh(own(new T.PlaneGeometry(2.18,.89)),own(new T.MeshBasicMaterial({color:'#ffffff',toneMapped:false})));feed.position.set(0,.03,.232);feed.userData.id="gallery";feed.visible=false;monitorGroups[1].add(feed);
  const sun=new T.DirectionalLight('#ffecd3',3.5);sun.position.set(-15,15,2);sun.castShadow=true;sun.shadow.mapSize.set(quality.shadowSize||1024,quality.shadowSize||1024);Object.assign(sun.shadow.camera,{left:-10,right:10,top:9,bottom:-4,near:.5,far:50});sun.shadow.bias=-.0002;sun.shadow.normalBias=.035;scene.add(sun);
  scene.add(new T.HemisphereLight('#a8c8bf','#0b1110',.85));
  const consoleLight=new T.PointLight('#acdad0',18,14,2);consoleLight.position.set(0,3.4,3);scene.add(consoleLight);
  const rim=new T.PointLight('#ffe2a6',22,14,2);rim.position.set(-6,4,-1);scene.add(rim);
  return { scene, screens, monitorGroups, indicatorMaterials, planets, resources, batching, details, dock, previewScene, previewCamera, feed,
    update(time,dt,reduced){details.update(time,reduced);if(!reduced)jovian.update(dt);},
    dispose(){resources.forEach(value=>value.dispose?.());} };
}
