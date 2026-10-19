import { InstancedMesh, Matrix4 } from 'three';

// Batch only explicitly static solids; picking targets and moving planets remain separate.
export function batchStatic(parent, predicate, own = value=>value) {
  parent.updateWorldMatrix(true,true);
  const inverse=new Matrix4().copy(parent.matrixWorld).invert(),groups=new Map();
  parent.traverse(mesh=>{
    if(!mesh.isMesh||mesh.isInstancedMesh||!predicate(mesh)||Array.isArray(mesh.material))return;
    const key=`${mesh.geometry.uuid}:${mesh.material.uuid}:${mesh.castShadow}:${mesh.receiveShadow}`;
    if(!groups.has(key))groups.set(key,[]);groups.get(key).push(mesh);
  });
  let before=0,after=0;
  for(const meshes of groups.values()){
    before+=meshes.length;after++;
    if(meshes.length<2)continue;
    const first=meshes[0],batch=own(new InstancedMesh(first.geometry,first.material,meshes.length));
    batch.castShadow=first.castShadow;batch.receiveShadow=first.receiveShadow;
    meshes.forEach((mesh,i)=>{batch.setMatrixAt(i,new Matrix4().multiplyMatrices(inverse,mesh.matrixWorld));mesh.removeFromParent();});
    batch.instanceMatrix.needsUpdate=true;batch.computeBoundingBox();batch.computeBoundingSphere();
    batch.matrixAutoUpdate=false;parent.add(batch);
  }
  return {before,after};
}
