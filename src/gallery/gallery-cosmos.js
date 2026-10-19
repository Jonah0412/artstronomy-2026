import * as T from 'three';

// A decorative solar-system installation above the glass roof, not to scale.
// It has no picking targets and cannot be dragged independently of the view.
export function createGalleryCosmos({parent,own,texture}) {
  const system=new T.Group();system.position.set(0,13,-17);parent.add(system);
  const sphere=own(new T.SphereGeometry(1,48,32));
  const sun=new T.Mesh(sphere,own(new T.MeshBasicMaterial({color:'#ffe8a5'})));sun.scale.setScalar(2.2);system.add(sun);
  const light=new T.PointLight('#ffe5b1',150,70,1.6);system.add(light);
  const colors=['#b5a495','#e7c398','#92c7d2','#cf8f69','#e8c09c','#ddd0ad','#98d8d6','#627bc9'];
  const bodies=[];
  colors.forEach((color,i)=>{
    const orbit=new T.Group();orbit.rotation.y=i*1.63;system.add(orbit);
    const radius=4+i*2.65,size=[.3,.55,.62,.44,1.7,1.4,.95,.9][i];
    const planet=new T.Mesh(sphere,own(new T.MeshStandardMaterial({color,map:i>3?texture:null,roughness:.86})));planet.position.set(radius,Math.sin(i)*1.5,0);planet.scale.setScalar(size);orbit.add(planet);
    if(i===5){const ring=new T.Mesh(own(new T.RingGeometry(size*1.35,size*2.05,96)),own(new T.MeshStandardMaterial({color:'#cfc0a1',side:T.DoubleSide,transparent:true,opacity:.7})));ring.position.copy(planet.position);ring.rotation.x=Math.PI/2+.25;orbit.add(ring);}
    const points=Array.from({length:129},(_,k)=>new T.Vector3(Math.cos(k/128*Math.PI*2)*radius,Math.sin(i)*1.5,Math.sin(k/128*Math.PI*2)*radius));
    system.add(new T.Line(own(new T.BufferGeometry().setFromPoints(points)),own(new T.LineBasicMaterial({color:'#b6ad7c',transparent:true,opacity:.22}))));
    bodies.push({orbit,planet,speed:.009/(1+i*.4)});
  });
  return {update(dt){for(const body of bodies){body.orbit.rotation.y+=dt*body.speed;body.planet.rotation.y+=dt*.045;}}};
}
