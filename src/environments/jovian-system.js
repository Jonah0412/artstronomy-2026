import * as T from 'three';
// An artistic Jovian observatory, not an astronomical scale model.
export function createJovianSystem({parent,own,texture,quality,position=[0,13,-40],radius=10}){
 const root=new T.Group();root.position.set(...position);parent.add(root);
 const sphere=own(new T.SphereGeometry(1,quality?.segments||40,28));
 const base=new T.Mesh(sphere,own(new T.MeshStandardMaterial({map:texture,color:'#e1c7a6',roughness:1})));base.scale.setScalar(radius);root.add(base);
 const cloudMaterial=own(new T.MeshBasicMaterial({map:texture,color:'#e2b993',transparent:true,opacity:.19,depthWrite:false}));
 const clouds=new T.Mesh(sphere,cloudMaterial);clouds.scale.setScalar(radius*1.003);clouds.rotation.z=.025;root.add(clouds);clouds.userData.skipCSS=true;
 // Exhibition fantasy rings: a real transparent radial gap, one tiny texture.
 const ringSize=128,ringPixels=new Uint8Array(ringSize*ringSize*4);
 for(let y=0;y<ringSize;y++)for(let x=0;x<ringSize;x++){const i=(y*ringSize+x)*4,r=Math.hypot((x+.5)/ringSize-.5,(y+.5)/ringSize-.5)*2;
  const alpha=r>.81&&r<.85?0:Math.max(0,Math.min(1,(1-r)*18))*(.55+.18*Math.sin(r*180));
  ringPixels[i]=ringPixels[i+1]=ringPixels[i+2]=255;ringPixels[i+3]=alpha*255;
 }
 const ringMap=own(new T.DataTexture(ringPixels,ringSize,ringSize));ringMap.needsUpdate=true;
 const rings=new T.Mesh(own(new T.RingGeometry(radius*1.25,radius*1.85,quality?.segments||40)),own(new T.MeshBasicMaterial({map:ringMap,color:'#ad9775',transparent:true,opacity:.42,side:T.DoubleSide,depthWrite:false})));rings.rotation.set(-1.18,.1,.22);root.add(rings);rings.userData.skipCSS=true;
 // Atmosphere is a grazing-angle shell, not an expensive volume pass.
 const atmosphere=new T.Mesh(sphere,own(new T.ShaderMaterial({transparent:true,side:T.BackSide,depthWrite:false,blending:T.AdditiveBlending,uniforms:{ink:{value:new T.Color('#d8b184')}},vertexShader:'varying vec3 n;varying vec3 v;void main(){n=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}',fragmentShader:'varying vec3 n;varying vec3 v;uniform vec3 ink;void main(){float f=pow(1.-abs(dot(normalize(n),normalize(v))),3.);gl_FragColor=vec4(ink,f*.26);}'})));atmosphere.scale.setScalar(radius*1.045);root.add(atmosphere);atmosphere.userData.skipCSS=true;
 const moons=[];
 ['#b9ad86','#d6d4c8','#a7a19a'].forEach((color,i)=>{
  const moon=new T.Mesh(sphere,own(new T.MeshStandardMaterial({color,roughness:1,map:texture})));moon.scale.setScalar(radius*(.035+i*.009));root.add(moon);moons.push(moon);
 });
 const stars=[];for(let i=0;i<1000;i++){const a=i*2.399963,b=Math.acos(1-2*(i+.5)/1000);stars.push(Math.cos(a)*Math.sin(b)*100,Math.cos(b)*90,Math.sin(a)*Math.sin(b)*100);}
 const geo=own(new T.BufferGeometry());geo.setAttribute('position',new T.Float32BufferAttribute(stars,3));const starfield=new T.Points(geo,own(new T.PointsMaterial({color:'#e6e6d6',size:.09})));parent.add(starfield);
 let clock=0;
 const update=dt=>{clock+=dt;base.rotation.y=clock*.008;clouds.rotation.y=-clock*.005;moons.forEach((moon,i)=>{const a=clock*(.007/(i+1))+i*2.1;moon.position.set(Math.cos(a)*radius*(1.4+i*.3),Math.sin(a)*radius*.25,Math.sin(a)*radius*(1.4+i*.3));});};update(0);
 return {root,base,clouds,moons,update};
}
