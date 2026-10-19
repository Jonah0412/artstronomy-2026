import * as T from 'three';
// Seeded, compact material detail. DataTexture works in tests without a DOM.
export function surfaceTexture(kind='metal',size=256){
 const data=new Uint8Array(size*size*4);
 const noise=(x,y)=>{const n=Math.sin(x*127.1+y*311.7)*43758.5453;return n-Math.floor(n);};
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const n=noise(x,y);let v;
  if(kind==='carbon')v=70+((Math.floor(x/5)+Math.floor(y/5))%2?24:0)+n*18;
  else if(kind==='stone')v=90+Math.sin(x*.038+Math.sin(y*.022)*3)*12+n*12+Math.pow(Math.max(0,Math.sin(x*.065+y*.013+Math.sin(y*.027))),30)*30;
  else if(kind==='plaster')v=175+n*35;
  else v=145+noise(0,y)*45+n*13;
  const i=(y*size+x)*4;data[i]=data[i+1]=data[i+2]=v;data[i+3]=255;
 }
 const texture=new T.DataTexture(data,size,size);texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.generateMipmaps=true;texture.minFilter=T.LinearMipmapLinearFilter;texture.needsUpdate=true;return texture;
}
export function createMaterialKit(own){
 const brushed=own(surfaceTexture('metal')),carbon=own(surfaceTexture('carbon')),stone=own(surfaceTexture('stone')),plaster=own(surfaceTexture('plaster'));
 const standard=(color,opts)=>own(new T.MeshStandardMaterial({color,...opts}));
 return {
  titanium:standard('#7b8786',{metalness:.88,roughness:.34,bumpMap:brushed,bumpScale:.015,roughnessMap:brushed}),
  ceramic:own(new T.MeshPhysicalMaterial({color:'#c7c5b3',metalness:.24,roughness:.34,clearcoat:.25,clearcoatRoughness:.3})),
  carbon:standard('#182423',{metalness:.35,roughness:.58,bumpMap:carbon,bumpScale:.018}),
  gasket:standard('#091011',{metalness:.05,roughness:.86}),
  bronze:standard('#a98b52',{metalness:.82,roughness:.3}),
  stone:own(new T.MeshPhysicalMaterial({color:'#182421',metalness:.32,roughness:.28,bumpMap:stone,bumpScale:.012,roughnessMap:stone,clearcoat:.55,clearcoatRoughness:.22})),
  plaster:standard('#d2ccba',{metalness:0,roughness:.9,bumpMap:plaster,bumpScale:.025}),
  glass:own(new T.MeshPhysicalMaterial({color:'#b0d4cc',metalness:.1,roughness:.13,transparent:true,opacity:.1,clearcoat:1,side:T.DoubleSide,depthWrite:false})),
  warm:standard('#f5d992',{metalness:.15,roughness:.3,emissive:'#ffce78',emissiveIntensity:2.2}),
  teal:standard('#9ad4c5',{metalness:.1,roughness:.4,emissive:'#7bc9bb',emissiveIntensity:1.3}),
 };
}
export function hologramMaterial(own,color='#8adcca'){
 return own(new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.DoubleSide,blending:T.AdditiveBlending,
  uniforms:{time:{value:0},ink:{value:new T.Color(color)},opacity:{value:.5}},
  vertexShader:'varying vec3 p; varying vec3 n; varying vec3 view; void main(){p=position;n=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);view=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}',
  fragmentShader:'uniform float time;uniform float opacity;uniform vec3 ink;varying vec3 p;varying vec3 n;varying vec3 view;void main(){float edge=pow(1.-abs(dot(normalize(n),normalize(view))),2.);float scan=.6+.4*sin(p.y*80.-time*1.8);float grid=step(.94,fract(p.y*9.));gl_FragColor=vec4(ink,(.08+edge*.65+grid*.2)*scan*opacity);}'
 }));
}
