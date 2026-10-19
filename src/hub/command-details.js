import { creatorCount } from '../observatory/content.js';
import * as T from 'three';
import {hologramMaterial} from '../environments/materials.js';

export function addCommandDetails({cabin,own,box,rod,kit,quality}){
 // Repeated angled ribs, ceramic infill, service trunks and inset ceiling bays.
 for(const side of [-1,1])for(let z=-3;z<=7;z+=2.5){
  rod(cabin,[side*7.05,1.6,z],[side*5.9,5.8,z-.35],.16,kit.titanium);
  box(cabin,[.18,2.2,1.9],[side*7.12,2.4,z],kit.ceramic,[0,0,side*.07]);
  box(cabin,[.055,2,1.5],[side*6.97,2.4,z],kit.carbon,[0,0,side*.07]);
  rod(cabin,[side*5.9,5.8,z-.35],[side*3.2,6.1,z-.5],.13,kit.titanium);
  box(cabin,[1.9,.06,.06],[side*4.65,5.94,z-.43],kit.warm,[0,0,side*.1]);
  for(let j=0;j<3;j++)rod(cabin,[side*(7.03-j*.08),.85,z-1],[side*(7.03-j*.08),.85,z+1],.028,kit.gasket);
 }
 box(cabin,[4.3,.18,3.2],[0,-.91,4.9],kit.carbon);
 box(cabin,[4.4,.025,.05],[0,-.8,3.3],kit.warm);
 for(let i=-2;i<=2;i++)box(cabin,[1.3,.06,1.7],[i*2.75,6.24,-.4],kit.carbon);
 // Curved panoramic glazing follows the structural frame, with quiet mullions.
 const glazing=own(new T.CylinderGeometry(9,9,4.3,32,1,true,-.8,1.6));
 const window=new T.Mesh(glazing,kit.glass);window.position.set(0,3.45,3.4);window.rotation.y=Math.PI;cabin.add(window);window.userData.skipCSS=true;
 for(const x of [-4.8,4.8])rod(cabin,[x,1.43,-3.5],[x*.95,5.6,-4.72],.065,kit.titanium);
 const holo=hologramMaterial(own);const chart=new T.Group();chart.position.set(-6,2.8,-2.3);cabin.add(chart);
 const globe=new T.Mesh(own(new T.SphereGeometry(.55,32,20)),holo);chart.add(globe);
 const orbitGeo=own(new T.TorusGeometry(.8,.008,4,64));
 for(let i=0;i<3;i++){const ring=new T.Mesh(orbitGeo,holo);ring.rotation.set(i*.65,.3,i*.6);chart.add(ring);}
 const geo=own(new T.BufferGeometry());const points=[];for(let i=0;i<creatorCount;i++){const a=i*2.39996;points.push(Math.cos(a)*.85,Math.sin(a)*.6,Math.sin(i)*.25);}
 geo.setAttribute('position',new T.Float32BufferAttribute(points,3));chart.add(new T.Points(geo,own(new T.PointsMaterial({color:'#f8dc72',size:.045}))));
 // Tactile encoder: drag changes the decorative star-chart heading, not scanner audio.
 const controls=[];const knobGeo=own(new T.CylinderGeometry(.22,.25,.15,24));
 for(let i=0;i<3;i++){
  const knob=new T.Mesh(knobGeo,kit.titanium);knob.position.set((i-1)*.65,.7,1.15);cabin.add(knob);knob.userData.control=i;
  const pointer=new T.Mesh(own(new T.BoxGeometry(.025,.012,.16)),kit.warm);pointer.position.set(0,.08,-.06);knob.add(pointer);controls.push(knob);
 }
 const dustGeo=own(new T.BufferGeometry()),dust=[];for(let i=0;i<(quality?.dust||55);i++)dust.push(Math.sin(i*64.7)*6,1+(i%23)*.2,-2+Math.cos(i*32.1)*5);
 dustGeo.setAttribute('position',new T.Float32BufferAttribute(dust,3));const motes=new T.Points(dustGeo,own(new T.PointsMaterial({color:'#c6cfb8',size:.012,transparent:true,opacity:.4,depthWrite:false})));cabin.add(motes);
 // Translucent shafts suggest suspended dust without a full volumetric renderer.
 const beamMat=own(new T.MeshBasicMaterial({color:'#e4d5b2',transparent:true,opacity:.018,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending}));
 const beamGeo=own(new T.ConeGeometry(1,6,12,1,true));
 for(const side of [-1,1]){const beam=new T.Mesh(beamGeo,beamMat);beam.position.set(side*4.8,2.7,.5);beam.rotation.set(.4,0,side*.35);cabin.add(beam);}
 let heading=0;
 return {controls,update(time,reduced){holo.uniforms.time.value=reduced?0:time*.001;chart.rotation.y=heading+(reduced?0:time*.000035);motes.position.y=reduced?0:Math.sin(time*.00009)*.12;motes.rotation.y=reduced?0:Math.sin(time*.00004)*.025;},adjust(index,delta){controls[index].rotation.y+=delta;heading+=delta*.35;}};
}
