import{ag as Ze,as as et,v as ge,aA as ct,P as Be,E as U,I as tt,O as st,aB as ht,Y as ut,z as Ie,ac as Ne,ad as ae,aC as Ae,V as Q,aD as Se,aE as _e,aF as ft,aG as dt,C as xe,g as F,ae as pt,x as oe,aH as mt,a7 as gt,aI as xt,aJ as bt,aK as vt,aL as wt,ar as it,ai as Mt,aM as Tt,aN as yt,aO as Ve,U as ie,aP as Z,au as je,f as at,ap as St,ak as Xe,w as Ye,K as _t,s as Ct,u as At,H as Rt,D as Pt,aj as Et,at as qe,S as Re,o as zt,ah as Dt,aq as Ft,aQ as Ut,W as Bt,aR as It,aS as Nt,i as kt,R as Ot,Q as Ke,aw as Lt,aT as Ue,X as $e,av as Gt}from"./index-DqrhfzKq.js";import{i as Qt,c as Ht,a as Wt}from"./render-budget-BttfA-C2.js";import{b as Vt}from"./batch-static-C_k16Brk.js";class jt extends Ze{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;const e=new et;e.deleteAttribute("uv");const r=new ge({side:ct}),u=new ge,h=new Be(16777215,900,28,2);h.position.set(.418,16.199,.3),this.add(h);const a=new U(e,r);a.position.set(-.757,13.219,.717),a.scale.set(31.713,28.305,28.591),this.add(a);const l=new tt(e,u,6),n=new st;n.position.set(-10.906,2.009,1.846),n.rotation.set(0,-.195,0),n.scale.set(2.328,7.905,4.651),n.updateMatrix(),l.setMatrixAt(0,n.matrix),n.position.set(-5.607,-.754,-.758),n.rotation.set(0,.994,0),n.scale.set(1.97,1.534,3.955),n.updateMatrix(),l.setMatrixAt(1,n.matrix),n.position.set(6.167,.857,7.803),n.rotation.set(0,.561,0),n.scale.set(3.927,6.285,3.687),n.updateMatrix(),l.setMatrixAt(2,n.matrix),n.position.set(-2.017,.018,6.124),n.rotation.set(0,.333,0),n.scale.set(2.002,4.566,2.064),n.updateMatrix(),l.setMatrixAt(3,n.matrix),n.position.set(2.291,-.756,-2.621),n.rotation.set(0,-.286,0),n.scale.set(1.546,1.552,1.496),n.updateMatrix(),l.setMatrixAt(4,n.matrix),n.position.set(-2.193,-.369,-5.547),n.rotation.set(0,.516,0),n.scale.set(3.875,3.487,2.986),n.updateMatrix(),l.setMatrixAt(5,n.matrix),this.add(l);const c=new U(e,se(50));c.position.set(-16.116,14.37,8.208),c.scale.set(.1,2.428,2.739),this.add(c);const g=new U(e,se(50));g.position.set(-16.109,18.021,-8.207),g.scale.set(.1,2.425,2.751),this.add(g);const p=new U(e,se(17));p.position.set(14.904,12.198,-1.832),p.scale.set(.15,4.265,6.331),this.add(p);const d=new U(e,se(43));d.position.set(-.462,8.89,14.52),d.scale.set(4.38,5.441,.088),this.add(d);const w=new U(e,se(20));w.position.set(3.235,11.486,-12.541),w.scale.set(2.5,2,.1),this.add(w);const T=new U(e,se(100));T.position.set(0,20,0),T.scale.set(1,.1,1),this.add(T)}dispose(){const e=new Set;this.traverse(r=>{r.isMesh&&(e.add(r.geometry),e.add(r.material))});for(const r of e)r.dispose()}}function se(A){return new ht({color:0,emissive:16777215,emissiveIntensity:A})}const Ce={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class ne{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Xt=new ut(-1,1,1,-1,0,1);class Yt extends Ie{constructor(){super(),this.setAttribute("position",new Ne([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new Ne([0,2,0,0,2,0],2))}}const qt=new Yt;class ke{constructor(e){this._mesh=new U(qt,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Xt)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Kt extends ne{constructor(e,r="tDiffuse"){super(),this.textureID=r,this.uniforms=null,this.material=null,e instanceof ae?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Ae.clone(e.uniforms),this.material=new ae({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new ke(this.material)}render(e,r,u){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=u.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(r),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Je extends ne{constructor(e,r){super(),this.scene=e,this.camera=r,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,r,u){const h=e.getContext(),a=e.state;a.buffers.color.setMask(!1),a.buffers.depth.setMask(!1),a.buffers.color.setLocked(!0),a.buffers.depth.setLocked(!0);let l,n;this.inverse?(l=0,n=1):(l=1,n=0),a.buffers.stencil.setTest(!0),a.buffers.stencil.setOp(h.REPLACE,h.REPLACE,h.REPLACE),a.buffers.stencil.setFunc(h.ALWAYS,l,4294967295),a.buffers.stencil.setClear(n),a.buffers.stencil.setLocked(!0),e.setRenderTarget(u),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(r),this.clear&&e.clear(),e.render(this.scene,this.camera),a.buffers.color.setLocked(!1),a.buffers.depth.setLocked(!1),a.buffers.color.setMask(!0),a.buffers.depth.setMask(!0),a.buffers.stencil.setLocked(!1),a.buffers.stencil.setFunc(h.EQUAL,1,4294967295),a.buffers.stencil.setOp(h.KEEP,h.KEEP,h.KEEP),a.buffers.stencil.setLocked(!0)}}class $t extends ne{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Jt{constructor(e,r){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),r===void 0){const u=e.getSize(new Q);this._width=u.width,this._height=u.height,r=new Se(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:_e}),r.texture.name="EffectComposer.rt1"}else this._width=r.width,this._height=r.height;this.renderTarget1=r,this.renderTarget2=r.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Kt(Ce),this.copyPass.material.blending=ft,this.timer=new dt}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,r){this.passes.splice(r,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const r=this.passes.indexOf(e);r!==-1&&this.passes.splice(r,1)}isLastEnabledPass(e){for(let r=e+1;r<this.passes.length;r++)if(this.passes[r].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const r=this.renderer.getRenderTarget();let u=!1;for(let h=0,a=this.passes.length;h<a;h++){const l=this.passes[h];if(l.enabled!==!1){if(l.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(h),l.render(this.renderer,this.writeBuffer,this.readBuffer,e,u),l.needsSwap){if(u){const n=this.renderer.getContext(),c=this.renderer.state.buffers.stencil;c.setFunc(n.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),c.setFunc(n.EQUAL,1,4294967295)}this.swapBuffers()}Je!==void 0&&(l instanceof Je?u=!0:l instanceof $t&&(u=!1))}}this.renderer.setRenderTarget(r)}reset(e){if(e===void 0){const r=this.renderer.getSize(new Q);this._pixelRatio=this.renderer.getPixelRatio(),this._width=r.width,this._height=r.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,r){this._width=e,this._height=r;const u=this._width*this._pixelRatio,h=this._height*this._pixelRatio;this.renderTarget1.setSize(u,h),this.renderTarget2.setSize(u,h);for(let a=0;a<this.passes.length;a++)this.passes[a].setSize(u,h)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Zt extends ne{constructor(e,r,u=null,h=null,a=null){super(),this.scene=e,this.camera=r,this.overrideMaterial=u,this.clearColor=h,this.clearAlpha=a,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new xe}render(e,r,u){const h=e.autoClear;e.autoClear=!1;let a,l;this.overrideMaterial!==null&&(l=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(a=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:u),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(a),this.overrideMaterial!==null&&(this.scene.overrideMaterial=l),e.autoClear=h}}const es={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new xe(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class re extends ne{constructor(e,r=1,u,h){super(),this.strength=r,this.radius=u,this.threshold=h,this.resolution=e!==void 0?new Q(e.x,e.y):new Q(256,256),this.clearColor=new xe(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let a=Math.round(this.resolution.x/2),l=Math.round(this.resolution.y/2);this.renderTargetBright=new Se(a,l,{type:_e}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let p=0;p<this.nMips;p++){const d=new Se(a,l,{type:_e});d.texture.name="UnrealBloomPass.h"+p,d.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(d);const w=new Se(a,l,{type:_e});w.texture.name="UnrealBloomPass.v"+p,w.texture.generateMipmaps=!1,this.renderTargetsVertical.push(w),a=Math.round(a/2),l=Math.round(l/2)}const n=es;this.highPassUniforms=Ae.clone(n.uniforms),this.highPassUniforms.luminosityThreshold.value=h,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new ae({uniforms:this.highPassUniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.separableBlurMaterials=[];const c=[6,10,14,18,22];a=Math.round(this.resolution.x/2),l=Math.round(this.resolution.y/2);for(let p=0;p<this.nMips;p++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(c[p])),this.separableBlurMaterials[p].uniforms.invSize.value=new Q(1/a,1/l),a=Math.round(a/2),l=Math.round(l/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=r,this.compositeMaterial.uniforms.bloomRadius.value=.1;const g=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=g,this.bloomTintColors=[new F(1,1,1),new F(1,1,1),new F(1,1,1),new F(1,1,1),new F(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Ae.clone(Ce.uniforms),this.blendMaterial=new ae({uniforms:this.copyUniforms,vertexShader:Ce.vertexShader,fragmentShader:Ce.fragmentShader,premultipliedAlpha:!0,blending:pt,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new xe,this._oldClearAlpha=1,this._basic=new oe,this._fsQuad=new ke(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,r){let u=Math.round(e/2),h=Math.round(r/2);this.renderTargetBright.setSize(u,h);for(let a=0;a<this.nMips;a++)this.renderTargetsHorizontal[a].setSize(u,h),this.renderTargetsVertical[a].setSize(u,h),this.separableBlurMaterials[a].uniforms.invSize.value=new Q(1/u,1/h),u=Math.round(u/2),h=Math.round(h/2)}render(e,r,u,h,a){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const l=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),a&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=u.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=u.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let n=this.renderTargetBright;for(let c=0;c<this.nMips;c++)this._fsQuad.material=this.separableBlurMaterials[c],this.separableBlurMaterials[c].uniforms.colorTexture.value=n.texture,this.separableBlurMaterials[c].uniforms.direction.value=re.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[c]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[c].uniforms.colorTexture.value=this.renderTargetsHorizontal[c].texture,this.separableBlurMaterials[c].uniforms.direction.value=re.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[c]),e.clear(),this._fsQuad.render(e),n=this.renderTargetsVertical[c];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,a&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(u),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=l}_getSeparableBlurMaterial(e){const r=[],u=e/3;for(let h=0;h<e;h++)r.push(.39894*Math.exp(-.5*h*h/(u*u))/u);return new ae({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Q(.5,.5)},direction:{value:new Q(.5,.5)},gaussianCoefficients:{value:r}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new ae({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}}re.BlurDirectionX=new Q(1,0);re.BlurDirectionY=new Q(0,1);const ye={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class ts extends ne{constructor(){super(),this.isOutputPass=!0,this.uniforms=Ae.clone(ye.uniforms),this.material=new mt({name:ye.name,uniforms:this.uniforms,vertexShader:ye.vertexShader,fragmentShader:ye.fragmentShader}),this._fsQuad=new ke(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,r,u){this.uniforms.tDiffuse.value=u.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},gt.getTransfer(this._outputColorSpace)===xt&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===bt?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===vt?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===wt?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===it?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===Mt?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===Tt?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===yt&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(r),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const me=new F;function G(A,e,r,u,h,a){const l=2*Math.PI*h/4,n=Math.max(a-2*h,0),c=Math.PI/4;me.copy(e),me[u]=0,me.normalize();const g=.5*l/(l+n),p=1-me.angleTo(A)/c;return Math.sign(me[r])===1?p*g:n/(l+n)+g+g*(1-p)}class Oe extends et{constructor(e=1,r=1,u=1,h=2,a=.1){const l=h*2+1;if(a=Math.min(e/2,r/2,u/2,a),super(1,1,1,l,l,l),this.type="RoundedBoxGeometry",this.parameters={width:e,height:r,depth:u,segments:h,radius:a},l===1)return;const n=this.toNonIndexed();this.index=null,this.attributes.position=n.attributes.position,this.attributes.normal=n.attributes.normal,this.attributes.uv=n.attributes.uv;const c=new F,g=new F,p=new F(e,r,u).divideScalar(2).subScalar(a),d=this.attributes.position.array,w=this.attributes.normal.array,T=this.attributes.uv.array,o=d.length/6,C=new F,N=.5/l;for(let _=0,s=0;_<d.length;_+=3,s+=2)switch(c.fromArray(d,_),g.copy(c),g.x-=Math.sign(g.x)*N,g.y-=Math.sign(g.y)*N,g.z-=Math.sign(g.z)*N,g.normalize(),d[_+0]=p.x*Math.sign(c.x)+g.x*a,d[_+1]=p.y*Math.sign(c.y)+g.y*a,d[_+2]=p.z*Math.sign(c.z)+g.z*a,w[_+0]=g.x,w[_+1]=g.y,w[_+2]=g.z,Math.floor(_/o)){case 0:C.set(1,0,0),T[s+0]=G(C,g,"z","y",a,u),T[s+1]=1-G(C,g,"y","z",a,r);break;case 1:C.set(-1,0,0),T[s+0]=1-G(C,g,"z","y",a,u),T[s+1]=1-G(C,g,"y","z",a,r);break;case 2:C.set(0,1,0),T[s+0]=1-G(C,g,"x","z",a,e),T[s+1]=G(C,g,"z","x",a,u);break;case 3:C.set(0,-1,0),T[s+0]=1-G(C,g,"x","z",a,e),T[s+1]=1-G(C,g,"z","x",a,u);break;case 4:C.set(0,0,1),T[s+0]=1-G(C,g,"x","y",a,e),T[s+1]=1-G(C,g,"y","x",a,r);break;case 5:C.set(0,0,-1),T[s+0]=G(C,g,"x","y",a,e),T[s+1]=1-G(C,g,"y","x",a,r);break}}static fromJSON(e){return new Oe(e.width,e.height,e.depth,e.segments,e.radius)}}function ss({screenMaterials:A,nameplateMaterial:e,metalMap:r=null,planetMap:u=null}){const h=new Ze;h.background=new xe("#020409");const a=new Set,l=t=>(a.add(t),t),n=(t,b=.6,f=.4,M={})=>l(new ge({color:t,metalness:b,roughness:f,...M})),c=n("#b2b9a9",.76,.44,{map:r,bumpMap:r,bumpScale:.025}),g=n("#617f6e",.6,.42,{map:r}),p=n("#7a817a",.86,.3),d=n("#090f12",.28,.32),w=n("#101414",.05,.85),T=n("#b1a477",.72,.3),o=n("#edcb59",.25,.28,{emissive:"#ffce54",emissiveIntensity:1.8});n("#b1ddd4",.1,.3,{emissive:"#80cfc3",emissiveIntensity:1.6});const C=l(new Oe(1,1,1,3,.035)),N=l(new Ve(1,1,1,16)),_=[];function s(t,b,f,M,D){const R=new U(C,M);return R.scale.set(...b),R.position.set(...f),D&&R.rotation.set(...D),R.castShadow=!0,R.receiveShadow=!0,t.add(R),R}function P(t,b,f,M,D){const R=new F(...b),E=new F(...f),H=E.clone().sub(R),O=new U(N,D);return O.scale.set(M,H.length(),M),O.position.copy(R.add(E).multiplyScalar(.5)),O.quaternion.setFromUnitVectors(new F(0,1,0),H.normalize()),t.add(O),O.castShadow=!0,O}function v(t,b){for(const f of b)_.push({parent:t,p:f})}const m=new ie;h.add(m),s(m,[17,.18,15],[0,-1.15,1],g);for(let t=-7;t<=7;t++)s(m,[.035,.015,13],[t,-1.049,1],p);for(let t=-5;t<8;t+=2)s(m,[16,.02,.03],[0,-1.03,t],d);for(const t of[-1,1]){s(m,[.35,7,13],[t*7.6,2.3,.5],c),s(m,[.18,1.3,11],[t*7.37,.1,.5],d);for(let b=-4;b<9;b+=2.4){s(m,[.28,6.4,.25],[t*7.28,2.1,b],p,[0,0,t*.1]),s(m,[.09,1.1,.12],[t*7.05,4.05,b+.18],o,[0,0,t*.1]);for(let f=.8;f<4;f+=.34)s(m,[.09,.035,.42],[t*7.04,f,b],d)}s(m,[.55,.28,2.1],[t*1.85,.1,5.2],w,[.06,0,0]),s(m,[.42,.7,.45],[t*1.85,-.3,5.35],d)}s(m,[15.3,.3,13],[0,6.5,.5],c);for(let t=-6;t<=6;t+=3)s(m,[.22,.12,12],[t,6.25,1],p);const ee=[[-7.2,1.3,-3.2],[-7.05,5.7,-4.8],[7.05,5.7,-4.8],[7.2,1.3,-3.2]];for(let t=0;t<4;t++)P(m,ee[t],ee[(t+1)%4],.16,p);P(m,[-7.1,1.55,-3.17],[7.1,1.55,-3.17],.08,d);for(const t of[-1,1])P(m,[t*6.95,1.35,-3.15],[t*6.8,5.6,-4.74],.06,d),P(m,[t*6.77,3.85,-4.2],[t*6.73,4.75,-4.55],.025,o),s(m,[.25,.5,.2],[t*6.85,3.55,-4.03],T,[.2,0,0]);s(m,[14.5,.22,.8],[0,1.3,-3.25],c),s(m,[13.8,.2,3.7],[0,.35,.2],c,[.04,0,0]),s(m,[13.85,.09,.12],[0,.34,2.04],p);for(let t=-6;t<=6;t+=2)s(m,[1.9,.035,2.85],[t,.49,.12],g,[.04,0,0]),s(m,[.055,.035,3.5],[t+.95,.5,.2],d),s(m,[.12,1.4,2.5],[t,-.35,.3],d),v(m,[[t-.78,.52,1.3],[t+.78,.52,1.3],[t-.78,.62,-1],[t+.78,.62,-1]]);const le=[],ce=[],he=[];Z.forEach((t,b)=>{const f=new ie;f.position.set(t.x,1.85,t.z),f.rotation.set(-.07,t.yaw,0),m.add(f),ce.push(f),s(f,[2.73,1.94,.18],[0,0,0],p),s(f,[2.65,1.86,.2],[0,0,.05],c),s(f,[2.47,1.64,.12],[0,0,.16],w);const M=new U(l(new je(2.34,1.48)),A[b]);M.position.z=.229,M.userData.id=t.id,f.add(M),le.push(M),s(f,[.3,.46,.19],[0,-1.13,-.09],d),s(f,[1.03,.065,.45],[0,-1.37,-.05],p);for(const R of[-1.25,1.25])for(const E of[-.85,.85])v(f,[[R,E,.178]]);for(let R=-.65;R<=.65;R+=.16)s(f,[.16,.035,.075],[1.29,R,.166],d),s(f,[.16,.035,.075],[-1.29,R,.166],d);const D=n("#ffe478",.1,.3,{emissive:"#d4ab42",emissiveIntensity:.5});he.push(D),s(f,[.2,.025,.025],[.99,.851,.173],D),P(m,[t.x,.66,t.z-.08],[t.x,.6,t.z-.45],.04,d)});for(const t of[-1,1]){const b=new ie;b.position.set(t*4.3,.6,1),b.rotation.x=-.03,m.add(b),s(b,[2.55,.09,1.12],[0,0,0],d);for(let f=0;f<4;f++){const M=-.88+f*.57,D=new U(N,p);D.scale.set(.13,.17,.13),D.position.set(M,.1,-.17),b.add(D),D.castShadow=!0;const R=new U(N,d);R.scale.set(.115,.07,.115),R.position.set(M,.21,-.17),b.add(R),s(b,[.015,.014,.07],[M,.254,-.19],T);for(let E=0;E<2;E++)s(b,[.18,.05,.13],[M,.065,.17+E*.23],E?w:o)}v(b,[[-1.16,.06,-.44],[1.16,.06,-.44],[-1.16,.06,.44],[1.16,.06,.44]])}for(let t=-10;t<=10;t++)s(m,[.035,.02,.58],[t*.065,.52,1.27],d);if(s(m,[3.65,.55,.12],[0,5.42,-4.55],d),e){const t=new U(l(new je(3.35,.4)),e);t.position.set(0,5.42,-4.475),m.add(t)}for(const t of[-2.1,2.1])s(m,[.7,.035,.03],[t,5.44,-4.44],o);m.updateMatrixWorld(!0);const W=l(new Ve(.036,.036,.015,6)),be=new tt(W,p,_.length),j=new st;_.forEach(({parent:t,p:b},f)=>{j.position.set(...b),j.rotation.set(t===m?0:Math.PI/2,0,0),j.updateMatrix(),be.setMatrixAt(f,new at().multiplyMatrices(t.matrixWorld,j.matrix))}),h.add(be);const ve=Vt(m,t=>t.geometry===C||t.geometry===N,l);m.traverse(t=>{t.updateMatrix(),t.matrixAutoUpdate=!1});const $=new ie;h.add($);const ue=[],I=l(new St(1,64,48));[[-23,9,-35,5.5,"#e8bd80"],[-8,6.1,-28,1.5,"#cbb78c"],[5,7,-32,3.8,"#b8c9c2"],[17,4,-36,2.2,"#72979e"]].forEach(([t,b,f,M,D],R)=>{const E=new ie;E.position.set(t,b,f),$.add(E);const H=new U(I,l(new ge({color:D,roughness:.92,map:u})));if(H.scale.setScalar(M),H.rotation.z=.14,E.add(H),ue.push(H),R===2){const O=new U(l(new Xe(M*1.32,M*2.03,128)),l(new ge({color:"#b0a589",side:Ye,roughness:.9,transparent:!0,opacity:.68})));O.rotation.set(1.15,.15,.35),E.add(O);for(let V=M*1.4;V<M*2;V+=.1){const pe=new U(l(new Xe(V,V+.018,96)),l(new oe({color:"#4c4b49",side:Ye,transparent:!0,opacity:.55})));pe.rotation.copy(O.rotation),E.add(pe)}}});const S=[];for(let t=0;t<2200;t++){const b=t*2.399963,f=Math.acos(1-2*(t+.5)/2200);S.push(Math.cos(b)*Math.sin(f)*95,Math.cos(f)*65+10,Math.sin(b)*Math.sin(f)*95-45)}const J=l(new Ie);J.setAttribute("position",new Ne(S,3)),$.add(new _t(J,l(new Ct({color:"#d9e0e4",size:.095,sizeAttenuation:!0}))));const fe=l(new At({color:"#a39b6b",transparent:!0,opacity:.16}));for(let t=0;t<4;t++){const b=[];for(let f=0;f<=160;f++){const M=f/160*Math.PI*2;b.push(new F(Math.cos(M)*(18+t*4),3+Math.sin(M)*1.5,-33+Math.sin(M)*(8+t*2)))}$.add(new Rt(l(new Ie().setFromPoints(b)),fe))}const B=new Pt("#ffecd3",3.5);B.position.set(-15,15,2),B.castShadow=!0,B.shadow.mapSize.set(2048,2048),Object.assign(B.shadow.camera,{left:-10,right:10,top:9,bottom:-4,near:.5,far:50}),B.shadow.bias=-2e-4,B.shadow.normalBias=.035,h.add(B),h.add(new Et("#c3ddd9","#171b17",1.5));const te=new Be("#acdad0",18,14,2);te.position.set(0,3.4,3),h.add(te);const de=new Be("#ffe2a6",22,14,2);return de.position.set(-6,4,-1),h.add(de),{scene:h,screens:le,monitorGroups:ce,indicatorMaterials:he,planets:ue,resources:a,batching:ve,dispose(){a.forEach(t=>{var b;return(b=t.dispose)==null?void 0:b.call(t)})}}}function is(){let A=!1;const e={},r=(d,w)=>{const T=new Image;e[d]=T,T.onload=()=>{A||l(0)},T.src=w},u=Z.map(()=>{const d=document.createElement("canvas");d.width=1024,d.height=648;const w=new qe(d);return w.colorSpace=Re,w.minFilter=zt,w.generateMipmaps=!1,{canvas:d,ctx:d.getContext("2d"),texture:w,material:new oe({map:w,toneMapped:!1})}});function h(d,w,T,o,C,N){if(!(w!=null&&w.complete)||!w.naturalWidth)return;const _=Math.max(C/w.naturalWidth,N/w.naturalHeight),s=C/_,P=N/_;d.drawImage(w,(w.naturalWidth-s)/2,(w.naturalHeight-P)/2,s,P,T,o,C,N)}function a(d,w=0,T=!1){const{ctx:o,canvas:C,texture:N}=u[d],_=Z[d];if(o.fillStyle="#081713",o.fillRect(0,0,1024,648),o.fillStyle=T?"#f6d761":"#ecebdd",o.font="500 38px Arial",o.fillText(_.title,40,66),o.fillStyle="#57736c",o.fillRect(36,94,952,2),d===0){o.fillStyle="#142721",o.fillRect(34,114,956,391);const s=e.hoshi;if(s!=null&&s.complete&&s.naturalWidth){const v=357*s.naturalWidth/s.naturalHeight;o.drawImage(s,(1024-v)/2,120,v,357)}o.strokeStyle="#789085",o.lineWidth=2,o.strokeRect(220,131,584,342)}else if(d===1)h(o,e.gallery,34,114,956,391);else if(d===2){o.fillStyle="#f2f0e4",o.font="500 60px Arial",o.fillText("1420.40",40,181),o.font="24px Arial",o.fillText("MHz",275,181),o.fillStyle="#9bb5aa",o.font="18px Arial",o.fillText("EXHIBITION SIGNAL SIMULATION",40,218),o.strokeStyle="#77998935",o.lineWidth=1;for(let s=40;s<980;s+=47)o.beginPath(),o.moveTo(s,244),o.lineTo(s,402),o.stroke();for(let s=244;s<402;s+=31)o.beginPath(),o.moveTo(40,s),o.lineTo(980,s),o.stroke();o.strokeStyle="#8fdccd",o.lineWidth=2.5,o.beginPath();for(let s=40;s<=980;s++){const P=9+87*Math.exp(-Math.pow((s-560)/25,2)),v=335+Math.sin(s*.24+w*.001)*P+Math.sin(s*.91)*5;s===40?o.moveTo(s,v):o.lineTo(s,v)}o.stroke();for(let s=40;s<980;s+=8)for(let P=415;P<501;P+=6){const v=(Math.sin(s*.33+P*.78+w*3e-4)+1)/2;o.fillStyle=`hsl(${175+v*60} 55% ${8+v*25}%)`,o.fillRect(s,P,7,5)}}else{o.fillStyle="#081b13",o.fillRect(34,114,956,391),o.fillStyle="#eeeacb",o.font="bold 67px Arial",o.fillText("ARTSTRONOMY",55,225),o.font="20px Arial",o.fillStyle="#c3caba",o.fillText("23 CREATORS. ONE UNIVERSE.",59,272);const s=e.hoshi;s!=null&&s.complete&&s.naturalWidth&&o.drawImage(s,665,274,240,218),h(o,e.art,55,303,275,170),h(o,e.animation,344,303,275,170)}o.fillStyle="#a9bcb0",o.font="22px Arial",o.fillText(_.note.toUpperCase(),40,539),o.fillStyle=T?"#fff0a2":"#f6d761",o.beginPath(),o.roundRect(182,566,660,57,7),o.fill(),o.textAlign="center",o.fillStyle="#13231e",o.font="bold 26px Arial",o.fillText(_.action.toUpperCase(),512,605),o.textAlign="left",N.needsUpdate=!0}function l(d){u.forEach((w,T)=>a(T,d))}r("hoshi","/artstronomy-2026/assets/hoshi-mascot.webp"),r("gallery","/artstronomy-2026/assets/hub/gallery-preview.webp"),r("art","/artstronomy-2026/assets/project-graphic-design.webp"),r("animation","/artstronomy-2026/assets/project-animation.webp"),l(0);const n=document.createElement("canvas");n.width=1200,n.height=145;const c=n.getContext("2d");c.fillStyle="#090f10",c.fillRect(0,0,1200,145),c.fillStyle="#ecebdc",c.textAlign="center",c.font="500 64px Arial",c.fillText("A R T S T R O N O M Y",600,73),c.fillStyle="#c9b667",c.font="24px Arial",c.fillText("C O N T R O L   S T A T I O N",600,123);const g=new qe(n);g.colorSpace=Re;const p=new oe({map:g,toneMapped:!1});return{items:u,draw:a,nameplateMaterial:p,dispose(){A=!0,g.dispose(),p.dispose(),Object.values(e).forEach(d=>d.onload=null),u.forEach(d=>{d.texture.dispose(),d.material.dispose()})}}}function ns({host:A,onSelect:e,onHover:r,onReady:u,onFallback:h,monitorElement:a,initialCinematic:l,onMotion:n=()=>{}}){let c;try{c=new Dt({antialias:!0,powerPreference:"high-performance"})}catch{return h("3D is unavailable in this browser. The image view and all four destinations are still available."),{dispose(){},home(){},focus(){},setCinematic(){},launch(i){e(i)}}}const g=Qt({dpr:devicePixelRatio||1,width:A.clientWidth,height:A.clientHeight,mobile:Ft()});c.setPixelRatio(g),c.outputColorSpace=Re,c.toneMapping=it,c.toneMappingExposure=1.05,c.shadowMap.enabled=!0,c.shadowMap.type=Ut,c.shadowMap.autoUpdate=!1,c.shadowMap.needsUpdate=!0,A.appendChild(c.domElement);const p=c.domElement;p.tabIndex=0,p.setAttribute("aria-label","Spaceship cockpit. Drag to look around, use arrow keys to look, or use the four destination buttons.");const d=[];let w=!1,T=!0;const o=(i,x=!1)=>{const y=new kt().load(i,()=>{w&&y.dispose()},void 0,()=>{});return y.colorSpace=Re,y.anisotropy=Math.min(8,c.capabilities.getMaxAnisotropy()),x&&(y.wrapS=y.wrapT=Ot,y.repeat.set(2,2)),d.push(y),y},C=o("/artstronomy-2026/assets/hub/cockpit-metal-albedo.webp",!0),N=o("/artstronomy-2026/assets/hub/gas-giant-albedo.webp"),_=is(),s=ss({screenMaterials:_.items.map(i=>i.material),nameplateMaterial:_.nameplateMaterial,metalMap:C,planetMap:N}),{scene:P}=s,v=new Bt(57,1,.08,240),m=new F(0,2.75,6.35),ee=new F(0,2.85,-5);v.position.copy(m),v.lookAt(ee);const le=new It(c),ce=new jt,he=le.fromScene(ce,.04);P.environment=he.texture,P.environmentIntensity=.8,ce.dispose(),le.dispose();const W=new Jt(c),be=new Zt(P,v),j=new re(new Q(1,1),.17,.35,1.25),ve=new ts;W.addPass(be),W.addPass(j),W.addPass(ve);const $=new Gt,ue=new Q,I={yaw:0,pitch:0},X={yaw:0,pitch:0};let S=null,J=!0;const fe=Ht(),B=new ie;B.position.set(0,3.1,-7),B.visible=!1,P.add(B);const te=new Nt(1,.055,20,128),de=new oe({color:10283997}),t=new U(te,de);B.add(t);const b=new U(te,new oe({color:16373881}));b.scale.setScalar(1.1),B.add(b);let f=null,M=-1,D=0,R=0,E=0,H=!1,O=!1;const V=Lt({read:()=>({yaw:-I.yaw,pitch:I.pitch}),apply:i=>Object.assign(I,Ue(-i.yaw,i.pitch)),blocked:()=>!!S||!!f,onState:n}),pe=matchMedia("(prefers-reduced-motion: reduce)"),Le=[],Y=(i,x,y,z)=>{i.addEventListener(x,y,z),Le.push(()=>i.removeEventListener(x,y,z))};function Pe(){J=!0;const{width:i,height:x}=A.getBoundingClientRect();!i||!x||(H=i/x<.95,v.aspect=i/x,v.fov=H?72:57,v.updateProjectionMatrix(),c.setSize(i,x),W.setSize(i,x),j.setSize(i*c.getPixelRatio()*.6,x*c.getPixelRatio()*.6))}const Ee=Wt(g,i=>{c.setPixelRatio(i),W.setPixelRatio(i),Pe()}),Ge=new ResizeObserver(Pe);Ge.observe(A),Pe();function Qe(i){var y;const x=p.getBoundingClientRect();return ue.set((i.clientX-x.left)/x.width*2-1,-(i.clientY-x.top)/x.height*2+1),$.setFromCamera(ue,v),(y=$.intersectObjects(s.screens)[0])==null?void 0:y.object.userData.id}function we(i){const x=Z.findIndex(y=>y.id===i);x!==M&&(M>=0&&_.draw(M,D,!1),M=x,M>=0&&_.draw(M,D,!0),r(i||null),p.style.cursor=M>=0?"pointer":"grab")}function ze(i){S||e(i)}function He(i){const x=Math.max(0,Z.findIndex(K=>K.id===i)),y=s.screens[x];P.updateMatrixWorld(!0);const z=y.getWorldPosition(new F),k=y.getWorldQuaternion(new Ke),q=Math.max(1.48/(2*Math.tan($e.degToRad(v.fov)/2)*.78),2.34/(2*Math.tan($e.degToRad(v.fov)/2)*v.aspect*.9));return{aim:z,position:z.clone().add(new F(0,0,q).applyQuaternion(k))}}function We(i){if(fe.reset(),Ee.reset(),J=!0,B.visible=!1,_.items.forEach(x=>x.material.color.set(16777215)),!i){S=null,De();return}if(S={...i,started:performance.now(),from:v.position.clone(),fromQ:v.quaternion.clone()},i.kind==="return"){const x=He(i.monitor||"website");v.position.copy(x.position),v.lookAt(x.aim),S.from.copy(v.position),S.fromQ.copy(v.quaternion)}i.kind==="arrival"&&(v.position.set(0,3.1,-4.5),v.lookAt(ee),S.from.copy(v.position),S.fromQ.copy(v.quaternion)),i.kind==="portal"&&(B.visible=!0,i.to==="website"&&_.items.forEach(x=>x.material.color.set(0)))}function ot(i){const x=Z.findIndex(z=>z.id===i);if(x<0)return;const y=new F;s.screens[x].getWorldPosition(y),I.yaw=Math.atan2(y.x-m.x,m.z-y.z),I.pitch=Math.atan2(y.y-m.y,Math.hypot(y.x-m.x,y.z-m.z)),we(i)}function De(){V.reset(),I.yaw=0,I.pitch=0,v.position.copy(m)}Y(p,"pointerdown",i=>{S||(f={x:i.clientX,y:i.clientY,lastX:i.clientX,lastY:i.clientY,moved:!1},p.setPointerCapture(i.pointerId),p.focus({preventScroll:!0}))}),Y(p,"pointermove",i=>{if(!S)if(f){const x=i.clientX-f.lastX,y=i.clientY-f.lastY;Math.hypot(i.clientX-f.x,i.clientY-f.y)>6&&(f.moved=!0),Object.assign(I,Ue(I.yaw-x*.0022,I.pitch+y*.0018)),f.lastX=i.clientX,f.lastY=i.clientY,f.moved&&we(null)}else we(Qe(i))}),Y(p,"pointerup",i=>{if(!f)return;const x=f.moved;if(f=null,p.hasPointerCapture(i.pointerId)&&p.releasePointerCapture(i.pointerId),!x){const y=Qe(i);y&&ze(y)}}),Y(p,"pointercancel",()=>{f=null}),Y(p,"pointerleave",()=>{f||we(null)}),Y(p,"keydown",i=>{if(S)return;const x={ArrowLeft:[-.09,0],ArrowRight:[.09,0],ArrowUp:[0,.07],ArrowDown:[0,-.07]};x[i.key]&&(i.preventDefault(),Object.assign(I,Ue(I.yaw+x[i.key][0],I.pitch+x[i.key][1]))),i.key==="Home"&&(i.preventDefault(),De()),i.key==="Enter"&&M>=0&&(i.preventDefault(),ze(Z[M].id))}),Y(p,"webglcontextlost",i=>{i.preventDefault(),T=!1,cancelAnimationFrame(E),h("The 3D view was interrupted. You can still open any destination below.")});function Me(i){if(w||!T||document.hidden)return;const x=(S==null?void 0:S.kind)==="monitor"&&i-S.started>=(S.duration||0);if(!fe.due(i,x?15:60)){E=requestAnimationFrame(Me);return}x||Ee.sample(i);const y=Math.min((i-D)/1e3||.016,.05);if(D=i,S){const z=S.duration?Math.min(1,(i-S.started)/S.duration):1,k=z*z*(3-2*z);let q=m.clone(),K=ee.clone();if(S.kind==="monitor"){const Te=He(S.monitor||"scanner");q=Te.position,K=Te.aim}S.kind==="portal"&&(B.visible=!0,B.scale.setScalar(.05+Math.min(1,z*2.3)*2.15),B.rotation.z=i*15e-5,b.rotation.z=-i*4e-4,q.set(0,3.1,-8),K.set(0,3.1,-30)),v.position.lerpVectors(S.from,q,k);const Fe=new Ke().setFromRotationMatrix(new at().lookAt(v.position,K,v.up));v.quaternion.slerpQuaternions(S.fromQ,Fe,k)}else{const z=pe.matches?1:1-Math.exp(-y*9);X.yaw+=(I.yaw-X.yaw)*z,X.pitch+=(I.pitch-X.pitch)*z,v.position.copy(m),v.lookAt(m.x+Math.sin(X.yaw)*10,m.y+Math.sin(X.pitch)*10+.1,m.z-Math.cos(X.yaw)*10)}if(a&&(S==null?void 0:S.kind)==="monitor"&&(!x||J)){v.updateMatrixWorld();const z=s.screens[2],k=[[-1.17,-.74],[1.17,-.74],[-1.17,.74],[1.17,.74]].map(([L,lt])=>z.localToWorld(new F(L,lt,0)).project(v)),q=A.clientWidth,K=A.clientHeight,Fe=(Math.min(...k.map(L=>L.x))*.5+.5)*q,Te=(-Math.max(...k.map(L=>L.y))*.5+.5)*K,rt=(Math.max(...k.map(L=>L.x))-Math.min(...k.map(L=>L.x)))*q*.5,nt=(Math.max(...k.map(L=>L.y))-Math.min(...k.map(L=>L.y)))*K*.5;J=!1,Object.assign(a.style,{left:`${Fe}px`,top:`${Te}px`,width:`${rt}px`,height:`${nt}px`})}pe.matches||(s.planets.forEach((z,k)=>{z.rotation.y+=y*(.025+k*.006)}),!x&&i-R>180&&(_.draw(2,i,M===2),R=i)),s.indicatorMaterials.forEach((z,k)=>z.emissiveIntensity=k===M?2:.4),W.render(),O||(O=!0,u()),E=requestAnimationFrame(Me)}return l&&We(l),Y(document,"visibilitychange",()=>{cancelAnimationFrame(E),D=0,Ee.reset(),fe.reset(),!document.hidden&&T&&(E=requestAnimationFrame(Me))}),E=requestAnimationFrame(Me),{launch:ze,focus:ot,home:De,setCinematic:We,startMotion:i=>V.start(i),stopMotion:()=>V.stop(),dispose(){w=!0,V.dispose(),cancelAnimationFrame(E),Ge.disconnect(),Le.forEach(i=>i()),_.dispose(),s.dispose(),te.dispose(),de.dispose(),b.material.dispose(),d.forEach(i=>i.dispose()),he.dispose(),j.dispose(),ve.dispose(),W.dispose(),c.dispose(),p.remove()}}}export{ns as createHub};
