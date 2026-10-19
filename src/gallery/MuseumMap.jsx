import {WINGS} from './gallery-layout.js';
export function MuseumMap({position,onVisit,onClose}){
 const x=v=>(v+24)*4,z=v=>(v+25)*4;
 return <aside className="museum-map" aria-label="Museum floor plan">
  <div className="museum-map__title"><span>ORBITAL MUSEUM / DECK 01</span><button type="button" onClick={onClose} aria-label="Close floor plan">×</button></div>
  <svg viewBox="0 0 244 132" role="img" aria-label="Three gallery wings connected by a central atrium">
   {WINGS.map(w=><rect key={w.id} x={x(w.x0)} y={z(w.z0)} width={(w.x1-w.x0)*4} height={(w.z1-w.z0)*4} rx="2" fill={w.color} fillOpacity=".14" stroke={w.color} strokeWidth=".6"/>)}
   <g transform={`translate(${x(position.x)} ${z(position.z)}) rotate(${-position.yaw*180/Math.PI})`}><path d="M0 -5 L3 3 L0 1 L-3 3Z" fill="#ffe971"/><circle r="6" fill="none" stroke="#ffe971" strokeWidth=".5"/></g>
  </svg>
  <p>● You are here · choose a wing to walk there</p>
  <div className="museum-map__destinations">{WINGS.map(w=><button type="button" key={w.id} onClick={()=>onVisit(w.id)}><i style={{background:w.color}}/>{w.label}<span>↗</span></button>)}</div>
 </aside>;
}
