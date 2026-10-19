import * as THREE from 'three';
import {GLTFLoader} from 'three/addons/loaders/GLTFLoader.js';
import {MeshoptDecoder} from 'three/addons/libs/meshopt_decoder.module.js';

const embedded=window.parent!==window && new URLSearchParams(location.search).get('embedded')==='1';
const $=selector=>document.querySelector(selector);
const intro=$('#intro'),experience=$('#experience'),stage=$('#stage'),notice=$('#notice');
let trackingReady=false;
let mind,renderer,scene,camera,art,active=false,paused=matchMedia('(prefers-reduced-motion: reduce)').matches,found=false,sessionMode='',clock=0,lastTime=0;
const resources=new Set(),own=value=>(resources.add(value),value);
const buttons=[$('#start'),$('#preview')];
function status(text){$('#tracking').textContent=text;}
function cleanup(){
  active=false;trackingReady=false;
  renderer?.setAnimationLoop(null);
  mind?.controller?.stopProcessVideo();
  mind?.controller?.worker?.terminate();
  if(mind?.video){mind.video.srcObject?.getTracks().forEach(track=>track.stop());mind.video.pause();mind.video.srcObject=null;}
  resources.forEach(resource=>resource.dispose?.());resources.clear();
  renderer?.dispose();renderer?.forceContextLoss();
}
window.addEventListener('pagehide',cleanup,{once:true});
let returning=false;
function returnToShip(){if(returning)return;returning=true;cleanup();window.parent.postMessage({type:'artstronomy:poster-close'},location.origin);}
if(embedded){
  $('#back-to-ship').hidden=false;
  $('#back-to-ship').onclick=returnToShip;
  $('#home').onclick=event=>{event.preventDefault();returnToShip();};
  document.addEventListener('keydown',event=>{
    if(event.key==='Escape'){event.preventDefault();returnToShip();}
    if(event.key==='Tab'){
      const controls=[...document.querySelectorAll('a[href],button:not(:disabled)')].filter(node=>node.getClientRects().length);
      const first=controls[0],last=controls.at(-1);
      if(event.shiftKey&&document.activeElement===first){event.preventDefault();last?.focus();}
      else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first?.focus();}
    }
  });
}
$('#close').onclick=()=>{if(embedded&&sessionMode==='ar')returnToShip();else{cleanup();location.reload();}};
$('#pause').onclick=()=>{paused=!paused;$('#pause').textContent=paused?'Play animation':'Pause animation';};
function show(mode){
  sessionMode=mode;intro.hidden=true;experience.hidden=false;active=true;
  $('#mode').textContent=mode==='ar'?'POSTER TRACKING':'ANIMATION PREVIEW · NO CAMERA';
  $('#close').textContent=mode==='ar'?(embedded?'Back to spaceship':'Close camera'):'Close preview';
  $('#scan-frame').hidden=mode!=='ar';
  $('#pause').hidden=false;$('#pause').textContent=paused?'Play animation':'Pause animation';
  $('#close').focus();
}
function fail(error){
  console.error('Poster experience:',error);cleanup();experience.hidden=true;intro.hidden=false;
  notice.textContent=error?.name==='NotAllowedError'?'Camera access was denied. Allow camera access in your browser, then try again.':error?.name==='NotFoundError'?'No camera was found. You can preview the animation on a device with 3D graphics support.':'The AR view could not start. Try Safari or Chrome with 3D graphics enabled. Reload to try again.';
  $('#start').disabled=false;$('#start').textContent='Reload and try again';$('#start').onclick=()=>location.reload();$('#preview').disabled=true;notice.focus();
}
function lighting(){scene.add(new THREE.HemisphereLight(0xfff9d8,0x173d2d,2));const key=new THREE.DirectionalLight(0xffeab4,3);key.position.set(-1,2,4);scene.add(key);const rim=new THREE.DirectionalLight(0x82d8b5,1.2);rim.position.set(2,.5,1);scene.add(rim);}
async function createArtwork(parent,{preview=false}={}){
  const root=new THREE.Group();parent.add(root);
  if(preview){
    const texture=await new THREE.TextureLoader().loadAsync('poster.png');texture.colorSpace=THREE.SRGBColorSpace;own(texture);
    const plane=new THREE.Mesh(own(new THREE.PlaneGeometry(1,1.5)),own(new THREE.MeshBasicMaterial({map:texture})));plane.position.z=-.025;root.add(plane);
  }
  const halo=new THREE.Mesh(own(new THREE.CircleGeometry(.45,64)),own(new THREE.MeshBasicMaterial({color:0x08291c,transparent:true,opacity:.94,depthWrite:false})));
  halo.scale.y=1.15;halo.position.set(0,-.04,.015);root.add(halo);
  const orbit=new THREE.Group();orbit.position.set(0,-.06,.09);root.add(orbit);
  const gold=own(new THREE.MeshStandardMaterial({color:0xffe573,metalness:.65,roughness:.28}));
  for(let i=0;i<2;i++){const ring=new THREE.Mesh(own(new THREE.TorusGeometry(.48+i*.035,.003,6,96)),gold);ring.scale.y=.56;ring.rotation.z=i?.45:-.45;orbit.add(ring);}
  const sparks=[];
  for(let i=0;i<22;i++){
    const dot=new THREE.Mesh(own(new THREE.SphereGeometry(i%5===0?.013:.006,8,6)),gold);orbit.add(dot);sparks.push(dot);
  }
  const float=new THREE.Group();float.position.set(0,-.025,.22);root.add(float);
  const loader=new GLTFLoader();loader.setMeshoptDecoder(MeshoptDecoder);
  const {scene:model}=await loader.loadAsync('/assets/mascot-3d-web.glb');
  const bounds=new THREE.Box3().setFromObject(model),size=bounds.getSize(new THREE.Vector3()),center=bounds.getCenter(new THREE.Vector3());model.position.sub(center);
  const fit=new THREE.Group();fit.add(model);fit.scale.setScalar(.74/Math.max(size.x,size.y));float.add(fit);
  model.traverse(object=>{if(object.geometry)own(object.geometry);for(const m of object.material?Array.isArray(object.material)?object.material:[object.material]:[]){own(m);for(const value of Object.values(m))if(value?.isTexture)own(value);}});
  return {root,float,orbit,sparks};
}
function render(now){
  if(!active)return;
  const dt=Math.min(.05,lastTime?(now-lastTime)/1000:0);lastTime=now;
  if(!document.hidden&&!paused&&(found||sessionMode==='preview'))clock+=dt;
  if(art){art.float.position.y=-.025+Math.sin(clock*1.8)*.025;art.float.rotation.set(-.04,Math.sin(clock*.65)*.16,Math.sin(clock*.9)*.025);
    art.sparks.forEach((dot,i)=>{const angle=i/22*Math.PI*2+clock*.18;dot.position.set(Math.cos(angle)*.5,Math.sin(angle)*.29,.025+Math.sin(angle*2+clock)*.03);});}
  if(!document.hidden)renderer.render(scene,camera);
}
async function startAR(){
  buttons.forEach(b=>b.disabled=true);notice.textContent='Preparing poster tracking…';
  try{
    if(!navigator.mediaDevices?.getUserMedia)throw Error('Camera API unavailable');
    const {MindARThree}=await import('./vendor/mindar-image-three.prod.js');
    show('ar');status('Loading Hoshi and the poster tracker…');
    mind=new MindARThree({container:stage,imageTargetSrc:'targets.mind',maxTrack:1,uiLoading:'no',uiScanning:'no',uiError:'no',warmupTolerance:3,missTolerance:6,filterMinCF:.001,filterBeta:1000});
    ({renderer,scene,camera}=mind);renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;
    lighting();const anchor=mind.addAnchor(0);art=await createArtwork(anchor.group);
    anchor.onTargetFound=()=>{if(!active)return;found=true;experience.classList.add('is-found');status('Poster found · Hoshi is here!');$('#hint').textContent='Move gently around the poster to explore the layers.';};
    anchor.onTargetLost=()=>{if(!active)return;found=false;experience.classList.remove('is-found');status('Point back at the poster');$('#hint').textContent='Keep the artwork visible. Avoid glare and moving too quickly.';};
    status('Allow the back camera to scan your poster…');
    await mind.start();
    if(!active){cleanup();return;}
    trackingReady=true;
    if(document.hidden)mind.controller.stopProcessVideo();
    if(!found)status('Find the ARTStronomy poster');
    renderer.setAnimationLoop(render);
  }catch(error){fail(error);}
}
async function preview(){
  buttons.forEach(b=>b.disabled=true);notice.textContent='Loading the animation preview…';
  try{
    show('preview');status('Animation preview');$('#hint').textContent='For live AR, open the camera and point it at the printed poster.';
    renderer=new THREE.WebGLRenderer({alpha:true,antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio||1,1.5));renderer.outputColorSpace=THREE.SRGBColorSpace;stage.appendChild(renderer.domElement);
    scene=new THREE.Scene();camera=new THREE.PerspectiveCamera(40,1,.01,20);camera.position.set(0,0,2.65);lighting();
    const resize=()=>{camera.aspect=innerWidth/innerHeight;camera.position.z=camera.aspect<.7?3.35:2.65;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);};resize();window.addEventListener('resize',resize);
    art=await createArtwork(scene,{preview:true});renderer.setAnimationLoop(render);
  }catch(error){fail(error);}
}
$('#start').onclick=startAR;$('#preview').onclick=preview;
document.addEventListener('visibilitychange',()=>{lastTime=0;if(trackingReady&&document.hidden&&sessionMode==='ar'){mind?.controller?.stopProcessVideo();}else if(trackingReady&&active&&sessionMode==='ar'&&mind?.controller){mind.controller.processVideo(mind.video);}});
