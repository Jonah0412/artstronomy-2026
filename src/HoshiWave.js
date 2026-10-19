import * as THREE from 'three';

// Match the Blender Wave shape while retaining the existing compressed model.
export function createHoshiWave(root) {
  const meshes=[];
  root.traverse(mesh=>{
    if (!mesh.isMesh) return;
    const g=mesh.geometry,p=g.attributes.position;
    g.computeBoundingBox();
    const {min,max}=g.boundingBox,w=max.x-min.x,h=max.y-min.y;
    const px=min.x+w*.30,py=min.y+h*.48;
    const delta=new Float32Array(p.count*3);
    for(let i=0;i<p.count;i++){
      const x=p.getX(i),y=p.getY(i),u=(x-min.x)/w,t=(y-min.y)/h;
      const weight=(1-THREE.MathUtils.smoothstep(u,.12,.32))*THREE.MathUtils.smoothstep(t,.26,.4)*(1-THREE.MathUtils.smoothstep(t,.53,.62));
      const a=-.30*weight,dx=x-px,dy=y-py;
      delta[i*3]=px+dx*Math.cos(a)-dy*Math.sin(a)-x;
      delta[i*3+1]=py+dx*Math.sin(a)+dy*Math.cos(a)-y;
    }
    g.morphAttributes.position=[new THREE.Float32BufferAttribute(delta,3)];
    g.morphTargetsRelative=true;mesh.updateMorphTargets();meshes.push(mesh);
  });
  let time=3;
  const frames=[1,10,19,28,37,46,56,65,72],values=[0,1,.3,1,.3,1,.3,0,0];
  return {
    play(){time=0;},
    update(dt){
      time=Math.min(3,time+dt);const frame=time*24+1;
      let value=0;
      for(let i=1;i<frames.length;i++) if(frame>=frames[i-1]&&frame<frames[i]){
        const t=THREE.MathUtils.smoothstep(frame,frames[i-1],frames[i]);value=THREE.MathUtils.lerp(values[i-1],values[i],t);break;
      }
      for(const mesh of meshes)mesh.morphTargetInfluences[0]=value;
    },
  };
}
