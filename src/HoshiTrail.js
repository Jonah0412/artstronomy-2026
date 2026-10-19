import * as THREE from 'three';

// Fixed pool: movement leaves light behind in world space, including WebXR.
export function createHoshiTrail(scene) {
  const count = 80;
  const positions = new Float32Array(count * 3);
  const life = new Float32Array(count);
  const sizes = new Float32Array(count);
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('life', new THREE.BufferAttribute(life, 1));
  geometry.setAttribute('sparkSize', new THREE.BufferAttribute(sizes, 1));
  const material = new THREE.ShaderMaterial({
    transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    vertexShader: `attribute float life; attribute float sparkSize; varying float vLife;
      void main(){vLife=life;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;
      gl_PointSize=clamp(sparkSize*260./max(.1,-p.z),1.,48.);}`,
    fragmentShader: `varying float vLife;
      void main(){vec2 uv=gl_PointCoord-.5;float d=length(uv)*2.;
      float halo=pow(max(0.,1.-d),3.);float core=exp(-d*d*45.);
      vec3 color=mix(vec3(.66,.53,.87),vec3(1.,.88,.3),vLife);
      gl_FragColor=vec4(color,(halo*.65+core)*vLife);}`,
  });
  const points = new THREE.Points(geometry, material);
  points.frustumCulled = false; scene.add(points);
  const previous = new THREE.Vector3();
  let initialized = false, cursor = 0, accumulator = 0;
  return {
    update(position, scale, dt, active, reducedMotion) {
      if (!initialized) { previous.copy(position); initialized = true; }
      const distance = previous.distanceTo(position);
      const moving = active && !reducedMotion && distance > .0008;
      accumulator = moving ? Math.min(accumulator + dt * 55, 8) : 0;
      while (accumulator >= 1) {
        accumulator--;
        const i = cursor++ % count;
        const t = Math.random();
        positions[i*3] = THREE.MathUtils.lerp(previous.x,position.x,t)+(Math.random()-.5)*scale*.45;
        positions[i*3+1] = THREE.MathUtils.lerp(previous.y,position.y,t)+(Math.random()-.5)*scale*.65;
        positions[i*3+2] = THREE.MathUtils.lerp(previous.z,position.z,t)+(Math.random()-.5)*scale*.2;
        sizes[i] = scale*(.12+Math.random()*.14); life[i] = 1;
      }
      for (let i=0;i<count;i++) { life[i]=Math.max(0,life[i]-dt/1.1);positions[i*3+1]+=dt*.06*scale; }
      previous.copy(position);
      geometry.attributes.position.needsUpdate=true;geometry.attributes.life.needsUpdate=true;geometry.attributes.sparkSize.needsUpdate=true;
      points.visible=active&&!reducedMotion;
    },
  };
}
