import * as T from 'three';
export function createOrbitalDock({own,materials}){
 const root=new T.Group(),body=new T.Group();root.add(body);
 const ring=new T.Mesh(own(new T.TorusGeometry(4,.42,12,64)),materials.titanium);body.add(ring);
 const glass=new T.Mesh(own(new T.TorusGeometry(4,.28,10,64)),materials.glass);glass.position.z=.3;body.add(glass);
 const core=new T.Mesh(own(new T.CylinderGeometry(1.8,1.8,1.3,32)),materials.carbon);core.rotation.x=Math.PI/2;body.add(core);
 const strutGeo=own(new T.BoxGeometry(.3,6,.35));
 for(let i=0;i<3;i++){const bar=new T.Mesh(strutGeo,materials.ceramic);bar.rotation.z=i*Math.PI/3;body.add(bar);}
 const lamps=new T.InstancedMesh(own(new T.SphereGeometry(.06,6,4)),materials.teal,24);const dummy=new T.Object3D();
 for(let i=0;i<24;i++){const a=i/24*Math.PI*2;dummy.position.set(Math.cos(a)*4,Math.sin(a)*4,.5);dummy.updateMatrix();lamps.setMatrixAt(i,dummy.matrix);}body.add(lamps);own(lamps);
 const collar=new T.Mesh(own(new T.TorusGeometry(1.1,.12,12,48)),materials.bronze);collar.position.z=1;root.add(collar);
 const doors=[];const doorGeo=own(new T.CircleGeometry(1.06,6,0,Math.PI*2/6));
 for(let i=0;i<6;i++){const door=new T.Mesh(doorGeo,materials.carbon);door.position.z=1.05;door.rotation.z=i*Math.PI/3;root.add(door);doors.push(door);}
 const clamps=new T.InstancedMesh(own(new T.BoxGeometry(.17,.35,.45)),materials.titanium,4);
 for(let i=0;i<4;i++){const a=i*Math.PI/2;dummy.position.set(Math.cos(a)*1.15,Math.sin(a)*1.15,1.12);dummy.rotation.z=a;dummy.updateMatrix();clamps.setMatrixAt(i,dummy.matrix);}root.add(clamps);own(clamps);
 return {root,doors,open(value){doors.forEach((door,i)=>{const a=i*Math.PI/3+Math.PI/6;door.position.x=Math.cos(a)*value*1.4;door.position.y=Math.sin(a)*value*1.4;door.rotation.z=i*Math.PI/3+value*.35;});}};
}
