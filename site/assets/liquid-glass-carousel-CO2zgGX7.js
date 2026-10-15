import{af as k,aJ as P,al as A,aK as cn,ah as fn,ag as Vt,Y as Yt,i as dn,l as mn,o as pn,S as hn,x as vn,E as Kt,as as $t,ax as gn,C as xn,ad as wn,V as Zt}from"./index-C2HsHMmv.js";const V=3/4,re=h=>`https://images.unsplash.com/photo-${h}?w=900&h=1200&q=85&auto=format&fit=crop`,Sn=[{title:"Project One",src:re("1600585154340-be6161a56a0c"),aspect:V},{title:"Project Two",src:re("1514906689926-25ba6dcb584b"),aspect:V},{title:"Project Three",src:re("1568557412756-7d219873dd11"),aspect:V},{title:"Project Four",src:re("1581892805885-73bdd91beff0"),aspect:V},{title:"Project Five",src:re("1482938289607-e9573fc25ebb"),aspect:V},{title:"Project Six",src:re("1610846202780-b4d9837371ea"),aspect:V},{title:"Project Seven",src:re("1527630941-4a229fd674ab"),aspect:V},{title:"Project Eight",src:re("1603786420263-ad59136a7409"),aspect:V}],u={sizeX:.565,sizeY:1,posX:.5,posY:.5,rotation:65,spin:0,zoom:0,dispersion:11,blur:0,glow:4.2,whiteGlow:.24,novaSize:12,blueRing:6,ringRadius:.49,ringWidth:.014,shimmerFreq:12,shimmerSpeed:3.5,shimmerDepth:.12,rimStart:.578,rimTangential:.6,rimInward:0,rimFreq1:2,rimFreq2:1,blueColor:"#009dff",rimLine:1.4,rimLinePos:.488,rimLineWidth:.003,vignette:0,vignetteSize:.3,samples:8},T={cardDuration:.7,focusDuration:.9,cardEase:"power4.out",focusEase:"power3.out",stagger:.06,dropDist:1.4,centerScale:1.18,lensFade:.85},M={delay:.5,startH:80,riseDuration:1,stagger:.07,riseEase:"power3.out",fromBelow:.9,growDelay:.25,growDuration:2.15,growEase:"expo.inOut",growStagger:.085,lensBloom:1.4,lensBloomEase:"power2.inOut"},Rn=`
varying vec2 vUv;
void main(){ vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
`,bn=`
#define PI 3.14159265
precision highp float;
varying vec2 vUv;
uniform sampler2D uTex;
uniform vec2 uRes;
uniform vec2 uCenter;
uniform float uSizeX;
uniform float uSizeY;
uniform float uAspect;
uniform float uZoom;
uniform float uDispersion;
uniform float uBlur;
uniform float uGlow;
uniform float uWhiteGlow;
uniform float uNovaSize;
uniform float uBlueRing;
uniform float uRingRadius;
uniform float uRingWidth;
uniform float uShimmer;
uniform float uShimmerFreq;
uniform float uShimmerSpeed;
uniform float uShimmerDepth;
uniform float uTime;
uniform float uRimStart;
uniform float uRimTangential;
uniform float uRimInward;
uniform float uRimFreq1;
uniform float uRimFreq2;
uniform vec3 uBlueColor;
uniform float uRimLine;
uniform float uRimLinePos;
uniform float uRimLineWidth;
uniform float uVignette;
uniform float uVignetteSize;
uniform float uShape;
uniform float uSquareRound;
uniform float uRotation;
uniform int uSamples;

const int MAX_SAMPLES = 16;

float sdRoundBox(vec2 p, vec2 b, float r){
  vec2 q = abs(p) - b + r;
  return min(max(q.x, q.y), 0.0) + length(max(q, 0.0)) - r;
}

vec3 discLens(vec2 center, float aspectCorrect, out float outA) {
  vec2 p = (vUv - center);
  p.x *= aspectCorrect;
  float ca = cos(uRotation), sa = sin(uRotation);
  p = mat2(ca, -sa, sa, ca) * p;
  vec2 halfSize = vec2(uSizeX, uSizeY);
  float dist = length(p / halfSize);
  outA = 0.0;

  float maskND;
  if (uShape > 0.5) {
    float corner = min(uSizeX, uSizeY) * clamp(uSquareRound, 0.0, 1.0);
    float sd = sdRoundBox(p, halfSize, corner);
    maskND = 1.0 + sd / min(uSizeX, uSizeY);
  } else {
    maskND = dist;
  }
  if (maskND > 1.0) return vec3(0.0);

  float shapeND = clamp(maskND, 0.0, 1.0);
  float nd = clamp(dist, 0.0, 1.0);
  vec2 offset = vUv - center;
  vec2 radialDir = normalize(offset + 1e-6);
  vec2 tangentDir = vec2(-radialDir.y, radialDir.x);
  float angle = atan(p.y, p.x);

  float pull = uZoom * 0.30 * (nd * nd);
  float rimStrength = smoothstep(uRimStart, 1.0, nd);
  float fluidWave = sin(angle * uRimFreq1) * 0.55 + sin(angle * uRimFreq2) * 0.25;
  float rScreen = (uSizeX + uSizeY) * 0.5;
  vec2 rimOff = tangentDir * fluidWave * rimStrength * rScreen * uRimTangential;
  vec2 rimPull = -radialDir * rimStrength * rScreen * uRimInward;

  vec2 baseUV = center + offset * (1.0 - pull) + rimOff + rimPull;

  float rimMask = smoothstep(0.55, 1.0, nd);
  vec2 dispDir = offset * uDispersion * 0.004 * rimMask;
  int N = uSamples;
  if (N < 2) N = 2;
  if (N > MAX_SAMPLES) N = MAX_SAMPLES;
  vec3 col = vec3(0.0);
  vec3 caW = vec3(0.0);
  for (int i = 0; i < MAX_SAMPLES; i++) {
    if (i >= N) break;
    float t = float(i) / float(N - 1);
    vec2 sUV = baseUV + dispDir * (t - 0.5);
    vec3 s = texture2D(uTex, sUV).rgb;
    vec3 w = vec3(
      exp(-pow((t - 0.00) / 0.38, 2.0)),
      exp(-pow((t - 0.50) / 0.38, 2.0)),
      exp(-pow((t - 1.00) / 0.38, 2.0))
    );
    col += s * w;
    caW += w;
  }
  col /= max(caW, vec3(0.001));

  float blurFade = 1.0 - smoothstep(0.72, 0.98, nd);
  if (uBlur > 0.01 && blurFade > 0.01) {
    vec2 blurRad = vec2(uBlur) / uRes * blurFade;
    vec3 bcol = vec3(0.0);
    float btw = 0.0;
    for (float a = 0.0; a < PI * 2.0; a += PI * 2.0 / 6.0) {
      for (float rr = 0.4; rr <= 1.001; rr += 0.3) {
        vec2 o = vec2(cos(a), sin(a)) * blurRad * rr;
        float w = 1.0 - rr * 0.38;
        bcol += texture2D(uTex, baseUV + o).rgb * w;
        btw += w;
      }
    }
    col = mix(bcol / btw, col, rimMask);
  }

  col *= mix(0.91, 1.0, smoothstep(0.0, 0.38, shapeND));

  float r2 = shapeND * shapeND * 0.25;
  float gs = max(uNovaSize * uGlow * 0.003, 0.004);
  float nova = exp(-r2 / gs) + exp(-r2 / (gs * 7.0)) * 0.18;
  nova *= uWhiteGlow * (uGlow / 17.0) * 1.15;
  col += vec3(nova);

  float dC = shapeND * 0.5;
  float tR = clamp(uRingRadius, 0.1, 0.49);
  float rW = max(uRingWidth, 0.003);
  float ring = exp(-pow((dC - tR) / rW, 2.0));
  ring *= uBlueRing * (uGlow / 17.0) * 1.8;
  if (uShimmer > 0.5) ring *= sin(angle * uShimmerFreq + uTime * uShimmerSpeed) * uShimmerDepth + (1.0 - uShimmerDepth);
  float ringAura = exp(-pow((dC - tR) / (rW * 6.0), 2.0)) * 0.28 * uBlueRing * (uGlow / 17.0);
  col += uBlueColor * (ring + ringAura);
  col += vec3(exp(-pow((dC - uRimLinePos) / max(uRimLineWidth, 0.0001), 2.0)) * uRimLine);

  outA = smoothstep(1.0, 0.93, maskND);
  return col;
}

void main(){
  vec3 base = texture2D(uTex, vUv).rgb;
  vec3 outc = base;
  float a = 0.0;
  vec3 c = discLens(uCenter, uAspect, a);
  outc = mix(outc, c, a);
  if (uVignette > 0.001) {
    vec2 vc = vUv - 0.5;
    vc.x *= uAspect;
    float d = length(vc) / max(uVignetteSize, 0.0001);
    float vig = 1.0 - uVignette * smoothstep(0.5, 1.0, d);
    outc *= clamp(vig, 0.0, 1.0);
  }
  gl_FragColor = vec4(outc, 1.0);
}
`,Jt=["uDispersion","uBlueRing","uRimLine","uVignette","uZoom","uRimTangential","uRimInward"],Q=4,En=6,yn=12,Dn=90;function U(h,f){const S=h[f];if(S===void 0)throw new Error("Index out of range.");return S}function Qt(){return typeof window<"u"&&window.matchMedia("(prefers-reduced-motion: reduce)").matches}function Ln(h){const f=h.trim();if(f.startsWith("#")&&(f.length===7||f.length===4)){const S=f.length===4?`#${f[1]}${f[1]}${f[2]}${f[2]}${f[3]}${f[3]}`:f,E=Number.parseInt(S.slice(1),16);return Number.isFinite(E)?E:16777215}return 16777215}function Mn(h,f,S){const E=Qt(),z=S.entry&&!E,Ne=S.items;if(Ne.length===0)return null;let L=Math.max(1,h.clientWidth),R=Math.max(1,h.clientHeight);const ve=()=>Math.max(120,Math.min(S.panelHeight,Math.round(R*.52)));let Y=ve();const B=S.gap,X=E?.28:.09,ge=E?.22:.05,xe=1.4,we=1.6,Se=1,et=.22,K=.865,tt=120,Re=60,nt=.25,Fe=.06;let m;try{m=new fn({antialias:!0,alpha:!1})}catch{return null}const ee=Math.min(window.devicePixelRatio||1,innerWidth<768?1.25:1.5);m.setPixelRatio(ee),m.setSize(L,R),m.setClearColor(Ln(S.background),1),m.domElement.style.display="block",m.domElement.style.width="100%",m.domElement.style.height="100%",m.domElement.style.touchAction="pan-y",m.domElement.style.userSelect="none",m.domElement.setAttribute("aria-hidden","true"),h.appendChild(m.domElement);const Te=new Vt,N=new Yt(-L/2,L/2,R/2,-R/2,-100,100);N.position.z=10;let oe=!1;const ie=new dn;ie.setCrossOrigin("anonymous");const p=Ne.map(e=>{const t={tex:null,aspect:e.aspect||V,locked:e.aspect!=null};return ie.load(e.src,n=>{if(oe){n.dispose();return}n.minFilter=mn,n.magFilter=pn,n.generateMipmaps=!0,n.anisotropy=Math.min(4,m.capabilities.getMaxAnisotropy()),n.colorSpace=hn,!t.locked&&n.image&&(t.aspect=n.image.width/n.image.height),t.tex=n,F(),ce||(b=j(0),_=b)},void 0,()=>{t.aspect=t.aspect||V}),t});function o(e){return U(p,e).aspect*Y+B}let x=[],s=0;function F(){x=[];let e=0;for(let t=0;t<p.length;t++)x.push(e),e+=o(t);s=e}F();function j(e){const t=p.length,n=Math.floor(e/t),r=(e%t+t)%t;return U(x,r)+o(r)/2-B/2+n*s}function be(e){if(!s)return 0;const t=p.length;let n=0,r=1/0;for(let l=0;l<t;l++){const g=U(x,l)+o(l)/2-B/2,v=Math.round((e-g)/s),a=Math.abs(g+v*s-e);a<r&&(r=a,n=l+v*t)}return n}function rt(e){if(!s)return 0;let t=0,n=1/0;for(let r=0;r<p.length;r++){const l=U(x,r)+o(r)/2-B/2,g=Math.round((e-l)/s),v=Math.abs(l+g*s-e);v<n&&(n=v,t=r)}return t}let ht=-1;const Ee=[];for(let e=0;e<Q;e++)for(let t=0;t<p.length;t++){const n=new vn({color:14540253,transparent:!0}),r=new Kt(new $t(1,1,1,1),n);r.visible=!1,Te.add(r),Ee.push({mesh:r,mat:n,srcIndex:t,bound:!1})}let b=j(0),_=b,ce=!1,$=0,vt=0,_e=0,Z=null,fe=performance.now(),G=!1;const qe=new gn(L*ee,R*ee),gt=new Vt,en=new Yt(-1,1,1,-1,0,1),C={uTex:{value:qe.texture},uRes:{value:new Zt(L*ee,R*ee)},uCenter:{value:new Zt(.5,.5)},uSizeX:{value:u.sizeX},uSizeY:{value:u.sizeY},uShape:{value:0},uSquareRound:{value:0},uRotation:{value:0},uAspect:{value:L/R},uZoom:{value:u.zoom},uDispersion:{value:u.dispersion},uBlur:{value:u.blur},uGlow:{value:u.glow},uWhiteGlow:{value:u.whiteGlow},uNovaSize:{value:u.novaSize},uBlueRing:{value:u.blueRing},uRingRadius:{value:u.ringRadius},uRingWidth:{value:u.ringWidth},uShimmer:{value:E?0:1},uShimmerFreq:{value:u.shimmerFreq},uShimmerSpeed:{value:u.shimmerSpeed},uShimmerDepth:{value:u.shimmerDepth},uTime:{value:0},uRimStart:{value:u.rimStart},uRimTangential:{value:u.rimTangential},uRimInward:{value:u.rimInward},uRimFreq1:{value:u.rimFreq1},uRimFreq2:{value:u.rimFreq2},uBlueColor:{value:new xn(u.blueColor)},uRimLine:{value:u.rimLine},uRimLinePos:{value:u.rimLinePos},uRimLineWidth:{value:u.rimLineWidth},uVignette:{value:u.vignette},uVignetteSize:{value:u.vignetteSize},uSamples:{value:u.samples}},xt=new wn({uniforms:C,vertexShader:Rn,fragmentShader:bn}),wt=new Kt(new $t(2,2),xt);gt.add(wt);const c={active:!1,srcIndex:-1,poolIdx:-1,lensFx:z?0:1,anim:null},ze=new Array(Q*p.length).fill(0);let de=1;const W=new Array(Q*p.length),We=new Array(Q*p.length).fill(z?0:1);let ae=z,te=!1;const se=new Array(Q*p.length).fill(z?0:1);let ye=null;const St={uDispersion:C.uDispersion.value,uBlueRing:C.uBlueRing.value,uRimLine:C.uRimLine.value,uVignette:C.uVignette.value,uZoom:C.uZoom.value,uRimTangential:C.uRimTangential.value,uRimInward:C.uRimInward.value};let ot=[],H=null;function Rt(){ot=[],H=null;let e=1/0;const t=L/2,n=Y;Ee.forEach((r,l)=>{const g=Math.floor(l/p.length),v=r.srcIndex,a=U(p,v);let d=U(x,v)+o(v)/2-B/2-b;d=(d%s+s)%s,d+=(g-Math.floor(Q/2))*s,d>t+s&&(d-=s*Q);const D=d;if(!(ae||te)&&(D<-t-n||D>t+n)){r.mesh.visible=!1,W[l]=void 0;return}W[l]=D;const i=1-.25*_e,I=Y*i,he=a.aspect*Y*i;a.tex&&!r.bound&&(r.mat.map=a.tex,r.mat.color.set(16777215),r.mat.needsUpdate=!0,r.bound=!0);let Ke=0;const sn=c.active&&c.poolIdx===l,zt=ze[l]||0;let $e=he,Ae=I;sn?($e=he*de,Ae=I*de):zt>0&&(Ke=-zt*R*T.dropDist),r.mesh.visible=!0;let Ze=D,Wt=Ke,Xt=$e,jt=Ae;if(ae||te){const ln=We[l]||0,un=se[l]||0,Gt=M.startH+(Ae-M.startH)*un;jt=Gt,Xt=Gt*a.aspect;const Ce=rt(b);let ne=v-Ce;ne>p.length/2&&(ne-=p.length),ne<-p.length/2&&(ne+=p.length);const q=p.length,Ht=Math.floor(Q/2);if(g!==Ht){r.mesh.visible=!1,W[l]=void 0;return}const Je=O=>{const ue=se[Ht*q+O]||0;return M.startH+(Y-M.startH)*ue};let pt=0;if(ne>0)for(let O=0;O<ne;O++){const ue=((Ce+O)%q+q)%q,Ie=((Ce+O+1)%q+q)%q;pt+=(U(p,ue).aspect*Je(ue)+U(p,Ie).aspect*Je(Ie))/2+B}else if(ne<0)for(let O=0;O<-ne;O++){const ue=((Ce-O)%q+q)%q,Ie=((Ce-O-1)%q+q)%q;pt-=(U(p,ue).aspect*Je(ue)+U(p,Ie).aspect*Je(Ie))/2+B}if(Ze=pt,Ze<-t-n||Ze>t+n){r.mesh.visible=!1,W[l]=void 0;return}const Ut=-R*M.fromBelow;Wt=Ut+(Ke-Ut)*ln}r.mesh.position.set(Ze,Wt,0),r.mesh.scale.set(Xt,jt,1);const Ot=D+L/2,Bt=R/2-Ke;ot.push({left:Ot-$e/2,right:Ot+$e/2,top:Bt-Ae/2,bottom:Bt+Ae/2,poolIdx:l,srcIndex:v,centerX:D}),Math.abs(D)<e&&(e=Math.abs(D),H={srcIndex:v,centerX:D,wPx:he,h:I,poolIdx:l})})}function Xe(e,t){for(const n of ot)if(e>=n.left&&e<=n.right&&t>=n.top&&t<=n.bottom)return n;return null}function it(e){const t=m.domElement.getBoundingClientRect();return{x:e.clientX-t.left,y:e.clientY-t.top}}const y=m.domElement;let J=!1,le=null,at=0,st=0,De=0,Le=0,je=!1,Me="mouse",Pe=Number.NaN,Oe=Number.NaN,Be=!1,lt="mouse";f&&P.set(f,{xPercent:20,yPercent:30,scale:0,autoAlpha:0});const bt=f?P.quickTo(f,"x",{duration:.5,ease:"power3.out"}):null,Et=f?P.quickTo(f,"y",{duration:.5,ease:"power3.out"}):null;let yt=!1,Dt=!1,Lt="";function Ge(e){e!==Lt&&(Lt=e,y.style.cursor=e)}function ke(){return c.active||ae||te?Ge(""):Ge(J?"grabbing":Dt?"grab":"")}function me(e){Dt=e,He(e)}function tn(){if(!(!Be||lt!=="mouse")&&Number.isFinite(Pe)){if(c.active){me(!1);return}me(Xe(Pe,Oe)!==null)}}function He(e){if((ae||te)&&(e=!1),J&&(e=!1),e===yt){ke();return}yt=e,ke(),f&&(P.killTweensOf(f,"scale,autoAlpha,opacity,visibility"),P.to(f,{scale:e?1:0,autoAlpha:e?1:0,duration:e?.35:.25,ease:e?"power3.out":"power3.in"}))}function Ue(){return c.active||ae||te}function Mt(e){Math.abs(e.deltaY)>Math.abs(e.deltaX)&&!e.shiftKey||(e.preventDefault(),!Ue()&&(ce=!0,Z=null,_+=(e.deltaY||e.deltaX)*xe,fe=performance.now(),G=!1))}function Pt(e){if(je=!1,Ue()||J||e.button!==0&&e.pointerType==="mouse")return;J=!0,le=e.pointerId,Me=e.pointerType||"mouse";try{y.setPointerCapture(e.pointerId)}catch{}const t=it(e);at=t.x,Pe=t.x,Oe=t.y,st=0,De=0,Le=performance.now(),He(!1),$=0,Z=null,ce=!0,G=!1,fe=Le}function kt(e){const t=it(e);if(J&&e.pointerId===le){const n=Me==="mouse"?we:Se,r=t.x-at;at=t.x,st+=Math.abs(r),_-=r*n,De=De*.6+-r*n*.4,Le=performance.now(),fe=Le,G=!1}if(Pe=t.x,Oe=t.y,lt=e.pointerType||"mouse",Be=!0,e.pointerType==="mouse"){if(bt&&bt(t.x),Et&&Et(t.y),c.active){me(!1);return}me(Xe(t.x,t.y)!==null)}}function Ve(e){if(J&&!(e&&le!==null&&e.pointerId!==le)){if(J=!1,le!==null){try{y.releasePointerCapture(le)}catch{}le=null}$=performance.now()-Le>Dn?0:De,De=0,fe=performance.now(),G=!1,je=st>(Me==="mouse"?En:yn),Me==="mouse"?me(Xe(Pe,Oe)!==null):ke()}}function At(e){Be=!0,lt=e.pointerType||"mouse"}function Ct(){Be=!1,me(!1)}function It(e){if(je){je=!1;return}if(Ue())return;const t=it(e),n=Xe(t.x,t.y);if(n){if(H&&n.poolIdx===H.poolIdx){Z=null,ut();return}ce=!0,$=0,_=j(be(b+n.centerX)),G=!0,Z={srcIndex:n.srcIndex},He(!1)}}function ut(){if(c.active||!H)return;const e=p[H.srcIndex];if(!(e!=null&&e.tex))return;c.active=!0,c.srcIndex=H.srcIndex;const t=H.poolIdx;c.poolIdx=t,_=j(be(b));const n=W[t]||0,r=Ee.map((d,D)=>({idx:D,x:W[D]})).filter(d=>d.idx!==t&&d.x!==void 0).map(d=>({idx:d.idx,dist:Math.abs((d.x??0)-n)})).sort((d,D)=>d.dist-D.dist);let l=0,g=-1;const v=r.map(d=>(g>=0&&d.dist-g>1&&(l+=1),g=d.dist,{idx:d.idx,rank:l}));for(const d of Jt)St[d]=C[d].value;c.anim&&c.anim.kill();const a={v:de},w=P.timeline();w.to(c,{lensFx:0,duration:E?0:T.lensFade,ease:"power3.out"},0),w.to(a,{v:T.centerScale,duration:E?0:T.focusDuration,ease:T.focusEase,onUpdate(){de=a.v}},0),v.forEach(d=>{w.to(ze,{[d.idx]:1,duration:E?0:T.cardDuration,ease:T.cardEase},E?0:d.rank*T.stagger)}),c.anim=w,He(!1),S.onFocusChange(!0)}function nn(){if(!c.active)return;c.anim&&c.anim.kill();const e=W[c.poolIdx]||0,t=Ee.map((a,w)=>({idx:w,x:W[w]})).filter(a=>a.x!==void 0&&(ze[a.idx]||0)>0).map(a=>({idx:a.idx,dist:Math.abs((a.x??0)-e)})).sort((a,w)=>w.dist-a.dist);let n=0,r=-1;const l=t.map(a=>(r>=0&&r-a.dist>1&&(n+=1),r=a.dist,{idx:a.idx,rank:n}));S.onFocusChange(!1);const g={v:de},v=P.timeline({onComplete:()=>{c.active=!1,c.srcIndex=-1,ke()}});v.to(c,{lensFx:1,duration:E?0:T.lensFade*.8,ease:"power3.inOut"},0),v.to(g,{v:1,duration:E?0:T.focusDuration*.85,ease:T.focusEase,onUpdate(){de=g.v}},0),l.forEach(a=>{v.to(ze,{[a.idx]:0,duration:E?0:T.cardDuration*.85,ease:T.cardEase},E?0:a.rank*T.stagger*.7)}),c.anim=v}function rn(){if(!z){S.onEntryDone(!0);return}ye&&ye.kill();for(let i=0;i<We.length;i++)We[i]=0;ae=!0,te=!1,S.onEntryDone(!1);for(let i=0;i<se.length;i++)se[i]=0;c.lensFx=0,_=j(be(b)),b=_,$=0,G=!0,Rt();const e=[];for(let i=0;i<W.length;i++)W[i]!==void 0&&e.push(i);const t=P.timeline({delay:M.delay}),n=M.stagger*Math.max(e.length-1,1);let r=0;e.forEach(i=>{const I=Math.random()*n;r=Math.max(r,I+M.riseDuration),t.to(We,{[i]:1,duration:M.riseDuration,ease:M.riseEase},I)}),t.call(()=>{ae=!1,te=!0},[],r);const l=rt(b),g=p.length,v=Math.floor(Q/2),a=[];let w=0;for(let i=0;i<W.length;i++){if(W[i]===void 0||Math.floor(i/g)!==v)continue;let I=i%g-l;I>g/2&&(I-=g),I<-g/2&&(I+=g);const he=Math.abs(I);w=Math.max(w,he),a.push({idx:i,rank:he})}const d=a.map(i=>({idx:i.idx,rank:w-i.rank})),D=r+M.growDelay;let Ye=D;t.to(c,{lensFx:1,duration:M.lensBloom,ease:M.lensBloomEase},D),d.forEach(i=>{const I=D+i.rank*M.growStagger;Ye=Math.max(Ye,I+M.growDuration),t.to(se,{[i.idx]:1,duration:M.growDuration,ease:M.growEase},I)}),t.call(()=>{te=!1;for(let i=0;i<se.length;i++)se[i]=1;S.onEntryDone(!0),ke()},[],Ye),ye=t}function Nt(e){Ue()||(ce=!0,$=0,Z=null,_=j(be(b)+e),G=!0,fe=performance.now())}y.addEventListener("wheel",Mt,{passive:!1}),y.addEventListener("pointerdown",Pt),y.addEventListener("pointermove",kt),y.addEventListener("pointerup",Ve),y.addEventListener("pointercancel",Ve),y.addEventListener("pointerenter",At),y.addEventListener("pointerleave",Ct),y.addEventListener("click",It);let pe=0,ct=!0,ft=!0,Ft=0;function dt(e=performance.now()){if(!ct)return;if(!ft||document.hidden){pe=0;return}if(e-Ft<1e3/60-1){pe=requestAnimationFrame(dt);return}Ft=e,J||(_+=$,$*=K,Math.abs($)<.05&&($=0),!G&&!c.active&&performance.now()-fe>tt&&(_=j(be(b)),G=!0));const t=J&&Me!=="mouse"?et:G&&!Z?ge:X;b+=(_-b)*t;const n=rt(b);n!==ht&&(ht=n,S.onActiveChange(n));const r=b-vt;vt=b;const l=Math.min(1,Math.abs(r)/Math.max(1,Re)),g=l>_e?nt:Fe;if(_e+=(l-_e)*g,Rt(),tn(),Z&&!c.active&&Math.abs(_-b)<.5){const w=Z;Z=null,H&&H.srcIndex===w.srcIndex&&ut()}C.uCenter.value.set(u.posX,u.posY),C.uAspect.value=L/R,C.uTime.value=performance.now()*.001;const v=w=>w*Math.PI/180;C.uRotation.value=v(u.rotation)+v(u.spin)*(performance.now()*.001);const a=c.lensFx;for(const w of Jt)C[w].value=St[w]*a;m.setRenderTarget(qe),m.render(Te,N),m.setRenderTarget(null),m.render(gt,en),pe=requestAnimationFrame(dt)}function mt(){!ct||pe||(pe=requestAnimationFrame(dt))}mt(),z?rn():S.onEntryDone(!0);function on(){L=Math.max(1,h.clientWidth),R=Math.max(1,h.clientHeight),Y=ve(),F(),m.setSize(L,R),N.left=-L/2,N.right=L/2,N.top=R/2,N.bottom=-R/2,N.updateProjectionMatrix();const e=Math.min(window.devicePixelRatio||1,innerWidth<768?1.25:1.5);m.setPixelRatio(e),qe.setSize(L*e,R*e),C.uRes.value.set(L*e,R*e),ce||(b=j(0),_=b)}const Tt=new ResizeObserver(on);Tt.observe(h);const _t=new IntersectionObserver(([e])=>{const t=e==null?void 0:e.boundingClientRect;!t||t.width===0&&t.height===0||(ft=(e==null?void 0:e.isIntersecting)??!0,ft&&mt())});_t.observe(h);const qt=()=>{document.hidden||mt()};document.addEventListener("visibilitychange",qt);function an(){oe=!0,ct=!1,cancelAnimationFrame(pe),Tt.disconnect(),_t.disconnect(),document.removeEventListener("visibilitychange",qt),y.removeEventListener("wheel",Mt),y.removeEventListener("pointerdown",Pt),y.removeEventListener("pointermove",kt),y.removeEventListener("pointerup",Ve),y.removeEventListener("pointercancel",Ve),y.removeEventListener("pointerenter",At),y.removeEventListener("pointerleave",Ct),y.removeEventListener("click",It),c.anim&&c.anim.kill(),ye&&ye.kill(),f&&P.killTweensOf(f),m.dispose(),qe.dispose(),wt.geometry.dispose(),xt.dispose(),Ee.forEach(e=>{e.mesh.geometry.dispose(),e.mat.dispose()}),p.forEach(e=>{var t;(t=e.tex)==null||t.dispose()}),m.domElement.parentNode&&m.domElement.parentNode.removeChild(m.domElement)}return{closeFocus:nn,openFocus:ut,next:()=>Nt(1),previous:()=>Nt(-1),destroy:an}}function Qe(h){return String(h).padStart(2,"0")}function kn({items:h=Sn,panelHeight:f=450,gap:S=12,background:E="#ffffff",entry:z=!0,className:Ne,style:L,onActiveChange:R,onFocusChange:ve}){const Y=k.useRef(null),B=k.useRef(null),X=k.useRef(null),ge=k.useRef(null),xe=k.useRef(null),we=k.useRef(!1),[Se,et]=k.useState(0),[K,tt]=k.useState(!1),[Re,nt]=k.useState(!z),[Fe,m]=k.useState(!1),ee=k.useId(),Te=k.useId(),N=h[Se]??h[0],oe=k.useRef(R),ie=k.useRef(ve);oe.current=R,ie.current=ve,k.useEffect(()=>{const o=Y.current;if(!o||h.length===0)return;const x=Mn(o,B.current,{items:h,panelHeight:f,gap:S,background:E,entry:z,onActiveChange:s=>{var F;et(s),(F=oe.current)==null||F.call(oe,s)},onFocusChange:s=>{var F;tt(s),(F=ie.current)==null||F.call(ie,s)},onEntryDone:nt});if(!x){m(!0);return}return X.current=x,()=>{x.destroy(),P.killTweensOf([ge.current,xe.current].filter(Boolean)),X.current=null}},[h,f,S,E,z]),k.useEffect(()=>{const o=ge.current,x=xe.current;if(!o||!x)return;const s=Qt();if(P.set(o,{xPercent:-50}),P.set(x,{xPercent:-50}),!Re&&z&&!s){P.set([o,x],{autoAlpha:0}),we.current=!1;return}const F=0;if(Re&&!K&&!we.current){we.current=!0,P.fromTo(o,{autoAlpha:0},{autoAlpha:1,duration:s?0:1.6,ease:"power2.out"}),P.fromTo(x,{autoAlpha:0},{autoAlpha:1,duration:s?0:1.6,ease:"power2.out",delay:s?0:.18});return}P.to(o,{y:F,autoAlpha:1,duration:s?0:.4,ease:"power3.out"}),P.to(x,{autoAlpha:K?0:1,duration:s?0:.4,ease:"power3.out"})},[K,Re,z]);const p=o=>{var x,s,F,j;(o.key==="Enter"||o.key===" ")&&o.target===o.currentTarget?(o.preventDefault(),(x=X.current)==null||x.openFocus()):o.key==="ArrowRight"?(o.preventDefault(),(s=X.current)==null||s.next()):o.key==="ArrowLeft"?(o.preventDefault(),(F=X.current)==null||F.previous()):o.key==="Escape"&&(o.preventDefault(),(j=X.current)==null||j.closeFocus())};return A.jsxs("div",{className:cn("liquid-carousel",Ne),style:{background:E,color:"#f4f1df",...L},tabIndex:0,role:"region","aria-roledescription":"carousel","aria-labelledby":ee,onKeyDown:p,children:[A.jsx("p",{id:ee,className:"sr-only",children:"Liquid glass project carousel"}),A.jsxs("p",{id:Te,className:"sr-only","aria-live":"polite",children:[(N==null?void 0:N.title)??"",", ",Qe(Se+1)," of ",Qe(h.length),K?", focused":""]}),Fe?A.jsx("div",{className:"liquid-carousel__fallback",children:h.map((o,x)=>A.jsxs("figure",{children:[A.jsx("img",{src:o.src,alt:o.title}),A.jsx("figcaption",{children:o.title})]},x))}):A.jsx("div",{ref:Y,className:"liquid-carousel__mount"}),!Fe&&A.jsxs("div",{className:"liquid-carousel__navigation",children:[A.jsx("button",{type:"button","aria-label":"Previous artwork",onClick:()=>{var o;return(o=X.current)==null?void 0:o.previous()},children:"←"}),A.jsx("span",{children:"DRAG TO EXPLORE · TAP TO FOCUS"}),A.jsx("button",{type:"button","aria-label":"Next artwork",onClick:()=>{var o;return(o=X.current)==null?void 0:o.next()},children:"→"})]}),A.jsx("p",{ref:ge,className:"liquid-carousel__title",children:N==null?void 0:N.title}),A.jsxs("p",{ref:xe,className:"liquid-carousel__counter",children:[Qe(Se+1),"/",Qe(h.length)]}),A.jsx("div",{ref:B,className:"liquid-carousel__cursor",children:"View"}),A.jsx("button",{type:"button",onClick:()=>{var o;return(o=X.current)==null?void 0:o.closeFocus()},"aria-label":"Close focused artwork",tabIndex:K?0:-1,className:"liquid-carousel__close",style:{opacity:K?1:0,pointerEvents:K?"auto":"none"},children:"Close"})]})}export{kn as LiquidGlassCarousel,Sn as liquidGlassCarouselDefaultItems};
