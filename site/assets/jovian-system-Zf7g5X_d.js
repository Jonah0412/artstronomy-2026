import{ag as X,ar as Y,v as C,aQ as G,P as $,E as d,I as k,O as J,aR as Z,Y as q,z as H,ac as N,ad as v,az as F,V as m,ax as R,ay as E,aS as ee,aT as te,C as _,g as S,ae as z,x as W,aU as se,a7 as ie,aV as ae,aW as re,aX as oe,aY as ne,aB as le,ai as he,aZ as ue,a_ as fe,f as Q,M as D,w as j,aw as ce,R as de,l as pe,U as me,aL as ge,K as ve,s as Me}from"./index-C2HsHMmv.js";function xe({mobile:l=!1,memory:e=8,cores:i=8}={}){const a=!l&&e>=8&&i>=6;return{name:a?"high":"balanced",fps:l?30:60,shadowSize:a?1024:512,reflections:a,bloom:a,dust:a?140:55,segments:a?48:32,textureSize:512,maxDrawCalls:120,maxTextureBytes:60*1024*1024}}function Pe(l){return xe({mobile:l,memory:navigator.deviceMemory||8,cores:navigator.hardwareConcurrency||8})}class Ae extends X{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;const e=new Y;e.deleteAttribute("uv");const i=new C({side:G}),a=new C,r=new $(16777215,900,28,2);r.position.set(.418,16.199,.3),this.add(r);const t=new d(e,i);t.position.set(-.757,13.219,.717),t.scale.set(31.713,28.305,28.591),this.add(t);const o=new k(e,a,6),s=new J;s.position.set(-10.906,2.009,1.846),s.rotation.set(0,-.195,0),s.scale.set(2.328,7.905,4.651),s.updateMatrix(),o.setMatrixAt(0,s.matrix),s.position.set(-5.607,-.754,-.758),s.rotation.set(0,.994,0),s.scale.set(1.97,1.534,3.955),s.updateMatrix(),o.setMatrixAt(1,s.matrix),s.position.set(6.167,.857,7.803),s.rotation.set(0,.561,0),s.scale.set(3.927,6.285,3.687),s.updateMatrix(),o.setMatrixAt(2,s.matrix),s.position.set(-2.017,.018,6.124),s.rotation.set(0,.333,0),s.scale.set(2.002,4.566,2.064),s.updateMatrix(),o.setMatrixAt(3,s.matrix),s.position.set(2.291,-.756,-2.621),s.rotation.set(0,-.286,0),s.scale.set(1.546,1.552,1.496),s.updateMatrix(),o.setMatrixAt(4,s.matrix),s.position.set(-2.193,-.369,-5.547),s.rotation.set(0,.516,0),s.scale.set(3.875,3.487,2.986),s.updateMatrix(),o.setMatrixAt(5,s.matrix),this.add(o);const n=new d(e,b(50));n.position.set(-16.116,14.37,8.208),n.scale.set(.1,2.428,2.739),this.add(n);const u=new d(e,b(50));u.position.set(-16.109,18.021,-8.207),u.scale.set(.1,2.425,2.751),this.add(u);const h=new d(e,b(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const f=new d(e,b(43));f.position.set(-.462,8.89,14.52),f.scale.set(4.38,5.441,.088),this.add(f);const p=new d(e,b(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const M=new d(e,b(100));M.position.set(0,20,0),M.scale.set(1,.1,1),this.add(M)}dispose(){const e=new Set;this.traverse(i=>{i.isMesh&&(e.add(i.geometry),e.add(i.material))});for(const i of e)i.dispose()}}function b(l){return new Z({color:0,emissive:16777215,emissiveIntensity:l})}const B={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform float opacity;

		uniform sampler2D tDiffuse;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );
			gl_FragColor = opacity * texel;


		}`};class T{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const be=new q(-1,1,1,-1,0,1);class _e extends H{constructor(){super(),this.setAttribute("position",new N([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new N([0,2,0,0,2,0],2))}}const Te=new _e;class I{constructor(e){this._mesh=new d(Te,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,be)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Se extends T{constructor(e,i="tDiffuse"){super(),this.textureID=i,this.uniforms=null,this.material=null,e instanceof v?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=F.clone(e.uniforms),this.material=new v({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new I(this.material)}render(e,i,a){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=a.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class V extends T{constructor(e,i){super(),this.scene=e,this.camera=i,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,i,a){const r=e.getContext(),t=e.state;t.buffers.color.setMask(!1),t.buffers.depth.setMask(!1),t.buffers.color.setLocked(!0),t.buffers.depth.setLocked(!0);let o,s;this.inverse?(o=0,s=1):(o=1,s=0),t.buffers.stencil.setTest(!0),t.buffers.stencil.setOp(r.REPLACE,r.REPLACE,r.REPLACE),t.buffers.stencil.setFunc(r.ALWAYS,o,4294967295),t.buffers.stencil.setClear(s),t.buffers.stencil.setLocked(!0),e.setRenderTarget(a),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),t.buffers.color.setLocked(!1),t.buffers.depth.setLocked(!1),t.buffers.color.setMask(!0),t.buffers.depth.setMask(!0),t.buffers.stencil.setLocked(!1),t.buffers.stencil.setFunc(r.EQUAL,1,4294967295),t.buffers.stencil.setOp(r.KEEP,r.KEEP,r.KEEP),t.buffers.stencil.setLocked(!0)}}class Ce extends T{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Re{constructor(e,i){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),i===void 0){const a=e.getSize(new m);this._width=a.width,this._height=a.height,i=new R(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:E}),i.texture.name="EffectComposer.rt1"}else this._width=i.width,this._height=i.height;this.renderTarget1=i,this.renderTarget2=i.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Se(B),this.copyPass.material.blending=ee,this.timer=new te}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,i){this.passes.splice(i,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const i=this.passes.indexOf(e);i!==-1&&this.passes.splice(i,1)}isLastEnabledPass(e){for(let i=e+1;i<this.passes.length;i++)if(this.passes[i].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const i=this.renderer.getRenderTarget();let a=!1;for(let r=0,t=this.passes.length;r<t;r++){const o=this.passes[r];if(o.enabled!==!1){if(o.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(r),o.render(this.renderer,this.writeBuffer,this.readBuffer,e,a),o.needsSwap){if(a){const s=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(s.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(s.EQUAL,1,4294967295)}this.swapBuffers()}V!==void 0&&(o instanceof V?a=!0:o instanceof Ce&&(a=!1))}}this.renderer.setRenderTarget(i)}reset(e){if(e===void 0){const i=this.renderer.getSize(new m);this._pixelRatio=this.renderer.getPixelRatio(),this._width=i.width,this._height=i.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,i){this._width=e,this._height=i;const a=this._width*this._pixelRatio,r=this._height*this._pixelRatio;this.renderTarget1.setSize(a,r),this.renderTarget2.setSize(a,r);for(let t=0;t<this.passes.length;t++)this.passes[t].setSize(a,r)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Ee extends T{constructor(e,i,a=null,r=null,t=null){super(),this.scene=e,this.camera=i,this.overrideMaterial=a,this.clearColor=r,this.clearAlpha=t,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new _}render(e,i,a){const r=e.autoClear;e.autoClear=!1;let t,o;this.overrideMaterial!==null&&(o=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(t=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:a),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(t),this.overrideMaterial!==null&&(this.scene.overrideMaterial=o),e.autoClear=r}}const we={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new _(0)},defaultOpacity:{value:0}},vertexShader:`

		varying vec2 vUv;

		void main() {

			vUv = uv;

			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		uniform sampler2D tDiffuse;
		uniform vec3 defaultColor;
		uniform float defaultOpacity;
		uniform float luminosityThreshold;
		uniform float smoothWidth;

		varying vec2 vUv;

		void main() {

			vec4 texel = texture2D( tDiffuse, vUv );

			float v = luminance( texel.xyz );

			vec4 outputColor = vec4( defaultColor.rgb, defaultOpacity );

			float alpha = smoothstep( luminosityThreshold, luminosityThreshold + smoothWidth, v );

			gl_FragColor = mix( outputColor, texel, alpha );

		}`};class w extends T{constructor(e,i=1,a,r){super(),this.strength=i,this.radius=a,this.threshold=r,this.resolution=e!==void 0?new m(e.x,e.y):new m(256,256),this.clearColor=new _(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let t=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);this.renderTargetBright=new R(t,o,{type:E}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const f=new R(t,o,{type:E});f.texture.name="UnrealBloomPass.h"+h,f.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(f);const p=new R(t,o,{type:E});p.texture.name="UnrealBloomPass.v"+h,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),t=Math.round(t/2),o=Math.round(o/2)}const s=we;this.highPassUniforms=F.clone(s.uniforms),this.highPassUniforms.luminosityThreshold.value=r,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new v({uniforms:this.highPassUniforms,vertexShader:s.vertexShader,fragmentShader:s.fragmentShader}),this.separableBlurMaterials=[];const n=[6,10,14,18,22];t=Math.round(this.resolution.x/2),o=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(n[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new m(1/t,1/o),t=Math.round(t/2),o=Math.round(o/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=i,this.compositeMaterial.uniforms.bloomRadius.value=.1;const u=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=u,this.bloomTintColors=[new S(1,1,1),new S(1,1,1),new S(1,1,1),new S(1,1,1),new S(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=F.clone(B.uniforms),this.blendMaterial=new v({uniforms:this.copyUniforms,vertexShader:B.vertexShader,fragmentShader:B.fragmentShader,premultipliedAlpha:!0,blending:z,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new _,this._oldClearAlpha=1,this._basic=new W,this._fsQuad=new I(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,i){let a=Math.round(e/2),r=Math.round(i/2);this.renderTargetBright.setSize(a,r);for(let t=0;t<this.nMips;t++)this.renderTargetsHorizontal[t].setSize(a,r),this.renderTargetsVertical[t].setSize(a,r),this.separableBlurMaterials[t].uniforms.invSize.value=new m(1/a,1/r),a=Math.round(a/2),r=Math.round(r/2)}render(e,i,a,r,t){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const o=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),t&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=a.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=a.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=w.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[n]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=w.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[n]),e.clear(),this._fsQuad.render(e),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,t&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(a),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=o}_getSeparableBlurMaterial(e){const i=[],a=e/3;for(let r=0;r<e;r++)i.push(.39894*Math.exp(-.5*r*r/(a*a))/a);return new v({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new m(.5,.5)},direction:{value:new m(.5,.5)},gaussianCoefficients:{value:i}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				#include <common>

				varying vec2 vUv;

				uniform sampler2D colorTexture;
				uniform vec2 invSize;
				uniform vec2 direction;
				uniform float gaussianCoefficients[KERNEL_RADIUS];

				void main() {

					float weightSum = gaussianCoefficients[0];
					vec3 diffuseSum = texture2D( colorTexture, vUv ).rgb * weightSum;

					for ( int i = 1; i < KERNEL_RADIUS; i ++ ) {

						float x = float( i );
						float w = gaussianCoefficients[i];
						vec2 uvOffset = direction * invSize * x;
						vec3 sample1 = texture2D( colorTexture, vUv + uvOffset ).rgb;
						vec3 sample2 = texture2D( colorTexture, vUv - uvOffset ).rgb;
						diffuseSum += ( sample1 + sample2 ) * w;

					}

					gl_FragColor = vec4( diffuseSum, 1.0 );

				}`})}_getCompositeMaterial(e){return new v({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

				varying vec2 vUv;

				void main() {

					vUv = uv;
					gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

				}`,fragmentShader:`

				varying vec2 vUv;

				uniform sampler2D blurTexture1;
				uniform sampler2D blurTexture2;
				uniform sampler2D blurTexture3;
				uniform sampler2D blurTexture4;
				uniform sampler2D blurTexture5;
				uniform float bloomStrength;
				uniform float bloomRadius;
				uniform float bloomFactors[NUM_MIPS];
				uniform vec3 bloomTintColors[NUM_MIPS];

				float lerpBloomFactor( const in float factor ) {

					float mirrorFactor = 1.2 - factor;
					return mix( factor, mirrorFactor, bloomRadius );

				}

				void main() {

					// 3.0 for backwards compatibility with previous alpha-based intensity
					vec3 bloom = 3.0 * bloomStrength * (
						lerpBloomFactor( bloomFactors[ 0 ] ) * bloomTintColors[ 0 ] * texture2D( blurTexture1, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 1 ] ) * bloomTintColors[ 1 ] * texture2D( blurTexture2, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 2 ] ) * bloomTintColors[ 2 ] * texture2D( blurTexture3, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 3 ] ) * bloomTintColors[ 3 ] * texture2D( blurTexture4, vUv ).rgb +
						lerpBloomFactor( bloomFactors[ 4 ] ) * bloomTintColors[ 4 ] * texture2D( blurTexture5, vUv ).rgb
					);

					float bloomAlpha = max( bloom.r, max( bloom.g, bloom.b ) );
					gl_FragColor = vec4( bloom, bloomAlpha );

				}`})}}w.BlurDirectionX=new m(1,0);w.BlurDirectionY=new m(0,1);const P={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
		precision highp float;

		uniform mat4 modelViewMatrix;
		uniform mat4 projectionMatrix;

		attribute vec3 position;
		attribute vec2 uv;

		varying vec2 vUv;

		void main() {

			vUv = uv;
			gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

		}`,fragmentShader:`

		precision highp float;

		uniform sampler2D tDiffuse;

		#include <tonemapping_pars_fragment>
		#include <colorspace_pars_fragment>

		varying vec2 vUv;

		void main() {

			gl_FragColor = texture2D( tDiffuse, vUv );

			// tone mapping

			#ifdef LINEAR_TONE_MAPPING

				gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );

			#elif defined( REINHARD_TONE_MAPPING )

				gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );

			#elif defined( CINEON_TONE_MAPPING )

				gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );

			#elif defined( ACES_FILMIC_TONE_MAPPING )

				gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );

			#elif defined( AGX_TONE_MAPPING )

				gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );

			#elif defined( NEUTRAL_TONE_MAPPING )

				gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );

			#elif defined( CUSTOM_TONE_MAPPING )

				gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );

			#endif

			// color space

			#ifdef SRGB_TRANSFER

				gl_FragColor = sRGBTransferOETF( gl_FragColor );

			#endif

		}`};class Be extends T{constructor(){super(),this.isOutputPass=!0,this.uniforms=F.clone(P.uniforms),this.material=new se({name:P.name,uniforms:this.uniforms,vertexShader:P.vertexShader,fragmentShader:P.fragmentShader}),this._fsQuad=new I(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,i,a){this.uniforms.tDiffuse.value=a.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},ie.getTransfer(this._outputColorSpace)===ae&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===re?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===oe?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===ne?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===le?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===he?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ue?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===fe&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}function Fe(l,e,i=a=>a){l.updateWorldMatrix(!0,!0);const a=new Q().copy(l.matrixWorld).invert(),r=new Map;l.traverse(s=>{if(!s.isMesh||s.isInstancedMesh||!e(s)||Array.isArray(s.material))return;const n=`${s.geometry.uuid}:${s.material.uuid}:${s.castShadow}:${s.receiveShadow}`;r.has(n)||r.set(n,[]),r.get(n).push(s)});let t=0,o=0;for(const s of r.values()){if(t+=s.length,o++,s.length<2)continue;const n=s[0],u=i(new k(n.geometry,n.material,s.length));u.castShadow=n.castShadow,u.receiveShadow=n.receiveShadow,s.forEach((h,f)=>{u.setMatrixAt(f,new Q().multiplyMatrices(a,h.matrixWorld)),h.removeFromParent()}),u.instanceMatrix.needsUpdate=!0,u.computeBoundingBox(),u.computeBoundingSphere(),u.matrixAutoUpdate=!1,l.add(u)}return{before:t,after:o}}function A(l="metal",e=256){const i=new Uint8Array(e*e*4),a=(t,o)=>{const s=Math.sin(t*127.1+o*311.7)*43758.5453;return s-Math.floor(s)};for(let t=0;t<e;t++)for(let o=0;o<e;o++){const s=a(o,t);let n;l==="carbon"?n=70+((Math.floor(o/5)+Math.floor(t/5))%2?24:0)+s*18:l==="stone"?n=90+Math.sin(o*.038+Math.sin(t*.022)*3)*12+s*12+Math.pow(Math.max(0,Math.sin(o*.065+t*.013+Math.sin(t*.027))),30)*30:l==="plaster"?n=175+s*35:n=145+a(0,t)*45+s*13;const u=(t*e+o)*4;i[u]=i[u+1]=i[u+2]=n,i[u+3]=255}const r=new ce(i,e,e);return r.wrapS=r.wrapT=de,r.generateMipmaps=!0,r.minFilter=pe,r.needsUpdate=!0,r}function Ue(l){const e=l(A("metal")),i=l(A("carbon")),a=l(A("stone")),r=l(A("plaster")),t=(o,s)=>l(new C({color:o,...s}));return{titanium:t("#7b8786",{metalness:.88,roughness:.34,bumpMap:e,bumpScale:.015,roughnessMap:e}),ceramic:l(new D({color:"#c7c5b3",metalness:.24,roughness:.34,clearcoat:.25,clearcoatRoughness:.3})),carbon:t("#182423",{metalness:.35,roughness:.58,bumpMap:i,bumpScale:.018}),gasket:t("#091011",{metalness:.05,roughness:.86}),bronze:t("#a98b52",{metalness:.82,roughness:.3}),stone:l(new D({color:"#182421",metalness:.32,roughness:.28,bumpMap:a,bumpScale:.012,roughnessMap:a,clearcoat:.55,clearcoatRoughness:.22})),plaster:t("#d2ccba",{metalness:0,roughness:.9,bumpMap:r,bumpScale:.025}),glass:l(new D({color:"#b0d4cc",metalness:.1,roughness:.13,transparent:!0,opacity:.1,clearcoat:1,side:j,depthWrite:!1})),warm:t("#f5d992",{metalness:.15,roughness:.3,emissive:"#ffce78",emissiveIntensity:2.2}),teal:t("#9ad4c5",{metalness:.1,roughness:.4,emissive:"#7bc9bb",emissiveIntensity:1.3})}}function De(l,e="#8adcca"){return l(new v({transparent:!0,depthWrite:!1,side:j,blending:z,uniforms:{time:{value:0},ink:{value:new _(e)},opacity:{value:.5}},vertexShader:"varying vec3 p; varying vec3 n; varying vec3 view; void main(){p=position;n=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);view=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}",fragmentShader:"uniform float time;uniform float opacity;uniform vec3 ink;varying vec3 p;varying vec3 n;varying vec3 view;void main(){float edge=pow(1.-abs(dot(normalize(n),normalize(view))),2.);float scan=.6+.4*sin(p.y*80.-time*1.8);float grid=step(.94,fract(p.y*9.));gl_FragColor=vec4(ink,(.08+edge*.65+grid*.2)*scan*opacity);}"}))}function Ne({parent:l,own:e,texture:i,quality:a,position:r=[0,13,-40],radius:t=10}){const o=new me;o.position.set(...r),l.add(o);const s=e(new ge(1,(a==null?void 0:a.segments)||40,28)),n=new d(s,e(new C({map:i,color:"#e1c7a6",roughness:1})));n.scale.setScalar(t),o.add(n);const u=e(new W({map:i,color:"#e2b993",transparent:!0,opacity:.19,depthWrite:!1})),h=new d(s,u);h.scale.setScalar(t*1.003),h.rotation.z=.025,o.add(h),h.userData.skipCSS=!0;const f=new d(s,e(new v({transparent:!0,side:G,depthWrite:!1,blending:z,uniforms:{ink:{value:new _("#d8b184")}},vertexShader:"varying vec3 n;varying vec3 v;void main(){n=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}",fragmentShader:"varying vec3 n;varying vec3 v;uniform vec3 ink;void main(){float f=pow(1.-abs(dot(normalize(n),normalize(v))),3.);gl_FragColor=vec4(ink,f*.26);}"})));f.scale.setScalar(t*1.045),o.add(f),f.userData.skipCSS=!0;const p=[];["#b9ad86","#d6d4c8","#a7a19a"].forEach((g,x)=>{const c=new d(s,e(new C({color:g,roughness:1,map:i})));c.scale.setScalar(t*(.035+x*.009)),o.add(c),p.push(c)});const M=[];for(let g=0;g<1e3;g++){const x=g*2.399963,c=Math.acos(1-2*(g+.5)/1e3);M.push(Math.cos(x)*Math.sin(c)*100,Math.cos(c)*90,Math.sin(x)*Math.sin(c)*100)}const O=e(new H);O.setAttribute("position",new N(M,3));const K=new ve(O,e(new Me({color:"#e6e6d6",size:.09})));l.add(K);let y=0;const L=g=>{y+=g,n.rotation.y=y*.008,h.rotation.y=-y*.005,p.forEach((x,c)=>{const U=y*(.007/(c+1))+c*2.1;x.position.set(Math.cos(U)*t*(1.4+c*.3),Math.sin(U)*t*.25,Math.sin(U)*t*(1.4+c*.3))})};return L(0),{root:o,base:n,clouds:h,moons:p,update:L}}export{Re as E,Be as O,Ae as R,w as U,Ne as a,Fe as b,Ue as c,Pe as d,Ee as e,De as h};
