import { Plane, Vector3 } from 'three';
import { insideMuseum, EYE_HEIGHT, constrainPosition } from './gallery-layout.js';
const floor=new Plane(new Vector3(0,1,0),0);
export function floorDestination(ray) {
  const point=ray.intersectPlane(floor,new Vector3());
  if(!point||!insideMuseum(point.x,point.z))return null;
  return {...constrainPosition(point.x,point.z),y:EYE_HEIGHT};
}
