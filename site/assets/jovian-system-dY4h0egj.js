import{ag as ee,ar as te,v as w,aQ as X,P as se,E as m,I as Y,O as ie,aR as ae,Y as re,z as $,ac as O,ad as x,az as F,V as v,ax as E,ay as B,aS as oe,aT as ne,C as T,g as C,ae as Q,x as L,aU as le,a7 as he,aV as ue,aW as ce,aX as fe,aY as pe,aB as de,ai as me,aZ as ge,a_ as ve,f as j,M as I,w as G,aw as J,R as Me,l as xe,U as be,aL as _e,ak as Te,K as Se,s as Ce}from"./index-CrTxSlhD.js";function we({mobile:l=!1,memory:e=8,cores:i=8}={}){const a=!l&&e>=8&&i>=6;return{name:a?"high":"balanced",fps:l?30:60,shadowSize:a?1024:512,reflections:a,bloom:a,dust:a?140:55,segments:a?48:32,textureSize:512,maxDrawCalls:120,maxTextureBytes:60*1024*1024}}function Fe(l){return we({mobile:l,memory:navigator.deviceMemory||8,cores:navigator.hardwareConcurrency||8})}class De extends ee{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;const e=new te;e.deleteAttribute("uv");const i=new w({side:X}),a=new w,o=new se(16777215,900,28,2);o.position.set(.418,16.199,.3),this.add(o);const t=new m(e,i);t.position.set(-.757,13.219,.717),t.scale.set(31.713,28.305,28.591),this.add(t);const r=new Y(e,a,6),s=new ie;s.position.set(-10.906,2.009,1.846),s.rotation.set(0,-.195,0),s.scale.set(2.328,7.905,4.651),s.updateMatrix(),r.setMatrixAt(0,s.matrix),s.position.set(-5.607,-.754,-.758),s.rotation.set(0,.994,0),s.scale.set(1.97,1.534,3.955),s.updateMatrix(),r.setMatrixAt(1,s.matrix),s.position.set(6.167,.857,7.803),s.rotation.set(0,.561,0),s.scale.set(3.927,6.285,3.687),s.updateMatrix(),r.setMatrixAt(2,s.matrix),s.position.set(-2.017,.018,6.124),s.rotation.set(0,.333,0),s.scale.set(2.002,4.566,2.064),s.updateMatrix(),r.setMatrixAt(3,s.matrix),s.position.set(2.291,-.756,-2.621),s.rotation.set(0,-.286,0),s.scale.set(1.546,1.552,1.496),s.updateMatrix(),r.setMatrixAt(4,s.matrix),s.position.set(-2.193,-.369,-5.547),s.rotation.set(0,.516,0),s.scale.set(3.875,3.487,2.986),s.updateMatrix(),r.setMatrixAt(5,s.matrix),this.add(r);const n=new m(e,_(50));n.position.set(-16.116,14.37,8.208),n.scale.set(.1,2.428,2.739),this.add(n);const u=new m(e,_(50));u.position.set(-16.109,18.021,-8.207),u.scale.set(.1,2.425,2.751),this.add(u);const h=new m(e,_(17));h.position.set(14.904,12.198,-1.832),h.scale.set(.15,4.265,6.331),this.add(h);const c=new m(e,_(43));c.position.set(-.462,8.89,14.52),c.scale.set(4.38,5.441,.088),this.add(c);const p=new m(e,_(20));p.position.set(3.235,11.486,-12.541),p.scale.set(2.5,2,.1),this.add(p);const b=new m(e,_(100));b.position.set(0,20,0),b.scale.set(1,.1,1),this.add(b)}dispose(){const e=new Set;this.traverse(i=>{i.isMesh&&(e.add(i.geometry),e.add(i.material))});for(const i of e)i.dispose()}}function _(l){return new ae({color:0,emissive:16777215,emissiveIntensity:l})}const U={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class S{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const ye=new re(-1,1,1,-1,0,1);class Pe extends ${constructor(){super(),this.setAttribute("position",new O([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new O([0,2,0,0,2,0],2))}}const Ae=new Pe;class V{constructor(e){this._mesh=new m(Ae,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,ye)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Re extends S{constructor(e,i="tDiffuse"){super(),this.textureID=i,this.uniforms=null,this.material=null,e instanceof x?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=F.clone(e.uniforms),this.material=new x({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new V(this.material)}render(e,i,a){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=a.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class K extends S{constructor(e,i){super(),this.scene=e,this.camera=i,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,i,a){const o=e.getContext(),t=e.state;t.buffers.color.setMask(!1),t.buffers.depth.setMask(!1),t.buffers.color.setLocked(!0),t.buffers.depth.setLocked(!0);let r,s;this.inverse?(r=0,s=1):(r=1,s=0),t.buffers.stencil.setTest(!0),t.buffers.stencil.setOp(o.REPLACE,o.REPLACE,o.REPLACE),t.buffers.stencil.setFunc(o.ALWAYS,r,4294967295),t.buffers.stencil.setClear(s),t.buffers.stencil.setLocked(!0),e.setRenderTarget(a),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(i),this.clear&&e.clear(),e.render(this.scene,this.camera),t.buffers.color.setLocked(!1),t.buffers.depth.setLocked(!1),t.buffers.color.setMask(!0),t.buffers.depth.setMask(!0),t.buffers.stencil.setLocked(!1),t.buffers.stencil.setFunc(o.EQUAL,1,4294967295),t.buffers.stencil.setOp(o.KEEP,o.KEEP,o.KEEP),t.buffers.stencil.setLocked(!0)}}class Ee extends S{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Ne{constructor(e,i){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),i===void 0){const a=e.getSize(new v);this._width=a.width,this._height=a.height,i=new E(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:B}),i.texture.name="EffectComposer.rt1"}else this._width=i.width,this._height=i.height;this.renderTarget1=i,this.renderTarget2=i.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Re(U),this.copyPass.material.blending=oe,this.timer=new ne}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,i){this.passes.splice(i,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const i=this.passes.indexOf(e);i!==-1&&this.passes.splice(i,1)}isLastEnabledPass(e){for(let i=e+1;i<this.passes.length;i++)if(this.passes[i].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const i=this.renderer.getRenderTarget();let a=!1;for(let o=0,t=this.passes.length;o<t;o++){const r=this.passes[o];if(r.enabled!==!1){if(r.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(o),r.render(this.renderer,this.writeBuffer,this.readBuffer,e,a),r.needsSwap){if(a){const s=this.renderer.getContext(),n=this.renderer.state.buffers.stencil;n.setFunc(s.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),n.setFunc(s.EQUAL,1,4294967295)}this.swapBuffers()}K!==void 0&&(r instanceof K?a=!0:r instanceof Ee&&(a=!1))}}this.renderer.setRenderTarget(i)}reset(e){if(e===void 0){const i=this.renderer.getSize(new v);this._pixelRatio=this.renderer.getPixelRatio(),this._width=i.width,this._height=i.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,i){this._width=e,this._height=i;const a=this._width*this._pixelRatio,o=this._height*this._pixelRatio;this.renderTarget1.setSize(a,o),this.renderTarget2.setSize(a,o);for(let t=0;t<this.passes.length;t++)this.passes[t].setSize(a,o)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class ze extends S{constructor(e,i,a=null,o=null,t=null){super(),this.scene=e,this.camera=i,this.overrideMaterial=a,this.clearColor=o,this.clearAlpha=t,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new T}render(e,i,a){const o=e.autoClear;e.autoClear=!1;let t,r;this.overrideMaterial!==null&&(r=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(t=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:a),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(t),this.overrideMaterial!==null&&(this.scene.overrideMaterial=r),e.autoClear=o}}const Be={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new T(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class y extends S{constructor(e,i=1,a,o){super(),this.strength=i,this.radius=a,this.threshold=o,this.resolution=e!==void 0?new v(e.x,e.y):new v(256,256),this.clearColor=new T(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let t=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);this.renderTargetBright=new E(t,r,{type:B}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let h=0;h<this.nMips;h++){const c=new E(t,r,{type:B});c.texture.name="UnrealBloomPass.h"+h,c.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(c);const p=new E(t,r,{type:B});p.texture.name="UnrealBloomPass.v"+h,p.texture.generateMipmaps=!1,this.renderTargetsVertical.push(p),t=Math.round(t/2),r=Math.round(r/2)}const s=Be;this.highPassUniforms=F.clone(s.uniforms),this.highPassUniforms.luminosityThreshold.value=o,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new x({uniforms:this.highPassUniforms,vertexShader:s.vertexShader,fragmentShader:s.fragmentShader}),this.separableBlurMaterials=[];const n=[6,10,14,18,22];t=Math.round(this.resolution.x/2),r=Math.round(this.resolution.y/2);for(let h=0;h<this.nMips;h++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(n[h])),this.separableBlurMaterials[h].uniforms.invSize.value=new v(1/t,1/r),t=Math.round(t/2),r=Math.round(r/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=i,this.compositeMaterial.uniforms.bloomRadius.value=.1;const u=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=u,this.bloomTintColors=[new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1),new C(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=F.clone(U.uniforms),this.blendMaterial=new x({uniforms:this.copyUniforms,vertexShader:U.vertexShader,fragmentShader:U.fragmentShader,premultipliedAlpha:!0,blending:Q,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new T,this._oldClearAlpha=1,this._basic=new L,this._fsQuad=new V(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,i){let a=Math.round(e/2),o=Math.round(i/2);this.renderTargetBright.setSize(a,o);for(let t=0;t<this.nMips;t++)this.renderTargetsHorizontal[t].setSize(a,o),this.renderTargetsVertical[t].setSize(a,o),this.separableBlurMaterials[t].uniforms.invSize.value=new v(1/a,1/o),a=Math.round(a/2),o=Math.round(o/2)}render(e,i,a,o,t){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const r=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),t&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=a.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=a.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let s=this.renderTargetBright;for(let n=0;n<this.nMips;n++)this._fsQuad.material=this.separableBlurMaterials[n],this.separableBlurMaterials[n].uniforms.colorTexture.value=s.texture,this.separableBlurMaterials[n].uniforms.direction.value=y.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[n]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[n].uniforms.colorTexture.value=this.renderTargetsHorizontal[n].texture,this.separableBlurMaterials[n].uniforms.direction.value=y.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[n]),e.clear(),this._fsQuad.render(e),s=this.renderTargetsVertical[n];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,t&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(a),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=r}_getSeparableBlurMaterial(e){const i=[],a=e/3;for(let o=0;o<e;o++)i.push(.39894*Math.exp(-.5*o*o/(a*a))/a);return new x({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new v(.5,.5)},direction:{value:new v(.5,.5)},gaussianCoefficients:{value:i}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new x({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}}y.BlurDirectionX=new v(1,0);y.BlurDirectionY=new v(0,1);const A={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Ie extends S{constructor(){super(),this.isOutputPass=!0,this.uniforms=F.clone(A.uniforms),this.material=new le({name:A.name,uniforms:this.uniforms,vertexShader:A.vertexShader,fragmentShader:A.fragmentShader}),this._fsQuad=new V(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,i,a){this.uniforms.tDiffuse.value=a.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},he.getTransfer(this._outputColorSpace)===ue&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===ce?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===fe?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===pe?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===de?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===me?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===ge?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===ve&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(i),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}function Oe(l,e,i=a=>a){l.updateWorldMatrix(!0,!0);const a=new j().copy(l.matrixWorld).invert(),o=new Map;l.traverse(s=>{if(!s.isMesh||s.isInstancedMesh||!e(s)||Array.isArray(s.material))return;const n=`${s.geometry.uuid}:${s.material.uuid}:${s.castShadow}:${s.receiveShadow}`;o.has(n)||o.set(n,[]),o.get(n).push(s)});let t=0,r=0;for(const s of o.values()){if(t+=s.length,r++,s.length<2)continue;const n=s[0],u=i(new Y(n.geometry,n.material,s.length));u.castShadow=n.castShadow,u.receiveShadow=n.receiveShadow,s.forEach((h,c)=>{u.setMatrixAt(c,new j().multiplyMatrices(a,h.matrixWorld)),h.removeFromParent()}),u.instanceMatrix.needsUpdate=!0,u.computeBoundingBox(),u.computeBoundingSphere(),u.matrixAutoUpdate=!1,l.add(u)}return{before:t,after:r}}function R(l="metal",e=256){const i=new Uint8Array(e*e*4),a=(t,r)=>{const s=Math.sin(t*127.1+r*311.7)*43758.5453;return s-Math.floor(s)};for(let t=0;t<e;t++)for(let r=0;r<e;r++){const s=a(r,t);let n;l==="carbon"?n=70+((Math.floor(r/5)+Math.floor(t/5))%2?24:0)+s*18:l==="stone"?n=90+Math.sin(r*.038+Math.sin(t*.022)*3)*12+s*12+Math.pow(Math.max(0,Math.sin(r*.065+t*.013+Math.sin(t*.027))),30)*30:l==="plaster"?n=175+s*35:n=145+a(0,t)*45+s*13;const u=(t*e+r)*4;i[u]=i[u+1]=i[u+2]=n,i[u+3]=255}const o=new J(i,e,e);return o.wrapS=o.wrapT=Me,o.generateMipmaps=!0,o.minFilter=xe,o.needsUpdate=!0,o}function Le(l){const e=l(R("metal")),i=l(R("carbon")),a=l(R("stone")),o=l(R("plaster")),t=(r,s)=>l(new w({color:r,...s}));return{titanium:t("#7b8786",{metalness:.88,roughness:.34,bumpMap:e,bumpScale:.015,roughnessMap:e}),ceramic:l(new I({color:"#c7c5b3",metalness:.24,roughness:.34,clearcoat:.25,clearcoatRoughness:.3})),carbon:t("#182423",{metalness:.35,roughness:.58,bumpMap:i,bumpScale:.018}),gasket:t("#091011",{metalness:.05,roughness:.86}),bronze:t("#a98b52",{metalness:.82,roughness:.3}),stone:l(new I({color:"#182421",metalness:.32,roughness:.28,bumpMap:a,bumpScale:.012,roughnessMap:a,clearcoat:.55,clearcoatRoughness:.22})),plaster:t("#d2ccba",{metalness:0,roughness:.9,bumpMap:o,bumpScale:.025}),glass:l(new I({color:"#b0d4cc",metalness:.1,roughness:.13,transparent:!0,opacity:.1,clearcoat:1,side:G,depthWrite:!1})),warm:t("#f5d992",{metalness:.15,roughness:.3,emissive:"#ffce78",emissiveIntensity:2.2}),teal:t("#9ad4c5",{metalness:.1,roughness:.4,emissive:"#7bc9bb",emissiveIntensity:1.3})}}function Qe(l,e="#8adcca"){return l(new x({transparent:!0,depthWrite:!1,side:G,blending:Q,uniforms:{time:{value:0},ink:{value:new T(e)},opacity:{value:.5}},vertexShader:"varying vec3 p; varying vec3 n; varying vec3 view; void main(){p=position;n=normalize(normalMatrix*normal);vec4 mv=modelViewMatrix*vec4(position,1.);view=normalize(-mv.xyz);gl_Position=projectionMatrix*mv;}",fragmentShader:"uniform float time;uniform float opacity;uniform vec3 ink;varying vec3 p;varying vec3 n;varying vec3 view;void main(){float edge=pow(1.-abs(dot(normalize(n),normalize(view))),2.);float scan=.6+.4*sin(p.y*80.-time*1.8);float grid=step(.94,fract(p.y*9.));gl_FragColor=vec4(ink,(.08+edge*.65+grid*.2)*scan*opacity);}"}))}function Ge({parent:l,own:e,texture:i,quality:a,position:o=[0,13,-40],radius:t=10}){const r=new be;r.position.set(...o),l.add(r);const s=e(new _e(1,(a==null?void 0:a.segments)||40,28)),n=new m(s,e(new w({map:i,color:"#e1c7a6",roughness:1})));n.scale.setScalar(t),r.add(n);const u=e(new L({map:i,color:"#e2b993",transparent:!0,opacity:.19,depthWrite:!1})),h=new m(s,u);h.scale.setScalar(t*1.003),h.rotation.z=.025,r.add(h),h.userData.skipCSS=!0;const c=128,p=new Uint8Array(c*c*4);for(let d=0;d<c;d++)for(let g=0;g<c;g++){const f=(d*c+g)*4,M=Math.hypot((g+.5)/c-.5,(d+.5)/c-.5)*2,q=M>.81&&M<.85?0:Math.max(0,Math.min(1,(1-M)*18))*(.55+.18*Math.sin(M*180));p[f]=p[f+1]=p[f+2]=255,p[f+3]=q*255}const b=e(new J(p,c,c));b.needsUpdate=!0;const D=new m(e(new Te(t*1.25,t*1.85,(a==null?void 0:a.segments)||40)),e(new L({map:b,color:"#ad9775",transparent:!0,opacity:.42,side:G,depthWrite:!1})));D.rotation.set(-1.18,.1,.22),r.add(D),D.userData.skipCSS=!0;const N=new m(s,e(new x({transparent:!0,side:X,depthWrite:!1,blending:Q,uniforms:{ink:{value:new T("#d8b184")}},vertexShader:"varying vec3 n;varying vec3 v;void main(){n=normalize(normalMatrix*normal);vec4 p=modelViewMatrix*vec4(position,1.);v=normalize(-p.xyz);gl_Position=projectionMatrix*p;}",fragmentShader:"varying vec3 n;varying vec3 v;uniform vec3 ink;void main(){float f=pow(1.-abs(dot(normalize(n),normalize(v))),3.);gl_FragColor=vec4(ink,f*.26);}"})));N.scale.setScalar(t*1.045),r.add(N),N.userData.skipCSS=!0;const z=[];["#b9ad86","#d6d4c8","#a7a19a"].forEach((d,g)=>{const f=new m(s,e(new w({color:d,roughness:1,map:i})));f.scale.setScalar(t*(.035+g*.009)),r.add(f),z.push(f)});const k=[];for(let d=0;d<1e3;d++){const g=d*2.399963,f=Math.acos(1-2*(d+.5)/1e3);k.push(Math.cos(g)*Math.sin(f)*100,Math.cos(f)*90,Math.sin(g)*Math.sin(f)*100)}const H=e(new $);H.setAttribute("position",new O(k,3));const Z=new Se(H,e(new Ce({color:"#e6e6d6",size:.09})));l.add(Z);let P=0;const W=d=>{P+=d,n.rotation.y=P*.008,h.rotation.y=-P*.005,z.forEach((g,f)=>{const M=P*(.007/(f+1))+f*2.1;g.position.set(Math.cos(M)*t*(1.4+f*.3),Math.sin(M)*t*.25,Math.sin(M)*t*(1.4+f*.3))})};return W(0),{root:r,base:n,clouds:h,moons:z,update:W}}export{Ne as E,Ie as O,De as R,y as U,Ge as a,Oe as b,Le as c,Fe as d,ze as e,Qe as h};
