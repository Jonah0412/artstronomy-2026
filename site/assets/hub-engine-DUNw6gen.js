import{ag as Ye,ar as qe,v as de,az as at,P as Ee,E as U,I as Ke,O as $e,aA as ot,Y as rt,z as ze,ac as De,ad as se,aB as Se,V as Q,aC as we,aD as Me,aE as nt,aF as lt,C as me,g as F,ae as ct,x as ie,aG as ht,a7 as ut,aH as ft,aI as pt,aJ as dt,aK as mt,ap as Je,ai as gt,aL as xt,aM as bt,aN as Le,U as te,aO as Z,as as Ge,f as Ze,ao as vt,ak as Qe,w as He,K as wt,s as Mt,u as Tt,H as St,D as yt,aj as _t,aq as We,S as ye,l as Ct,ah as At,aP as Pt,W as Rt,aQ as Et,aR as zt,i as Dt,R as Ft,Q as Ve,au as Ut,aS as Re,X as je,at as Bt}from"./index-CuGh3yEh.js";class It extends Ye{constructor(){super(),this.name="RoomEnvironment",this.position.y=-3.5;const e=new qe;e.deleteAttribute("uv");const o=new de({side:at}),u=new de,c=new Ee(16777215,900,28,2);c.position.set(.418,16.199,.3),this.add(c);const i=new U(e,o);i.position.set(-.757,13.219,.717),i.scale.set(31.713,28.305,28.591),this.add(i);const l=new Ke(e,u,6),n=new $e;n.position.set(-10.906,2.009,1.846),n.rotation.set(0,-.195,0),n.scale.set(2.328,7.905,4.651),n.updateMatrix(),l.setMatrixAt(0,n.matrix),n.position.set(-5.607,-.754,-.758),n.rotation.set(0,.994,0),n.scale.set(1.97,1.534,3.955),n.updateMatrix(),l.setMatrixAt(1,n.matrix),n.position.set(6.167,.857,7.803),n.rotation.set(0,.561,0),n.scale.set(3.927,6.285,3.687),n.updateMatrix(),l.setMatrixAt(2,n.matrix),n.position.set(-2.017,.018,6.124),n.rotation.set(0,.333,0),n.scale.set(2.002,4.566,2.064),n.updateMatrix(),l.setMatrixAt(3,n.matrix),n.position.set(2.291,-.756,-2.621),n.rotation.set(0,-.286,0),n.scale.set(1.546,1.552,1.496),n.updateMatrix(),l.setMatrixAt(4,n.matrix),n.position.set(-2.193,-.369,-5.547),n.rotation.set(0,.516,0),n.scale.set(3.875,3.487,2.986),n.updateMatrix(),l.setMatrixAt(5,n.matrix),this.add(l);const f=new U(e,ee(50));f.position.set(-16.116,14.37,8.208),f.scale.set(.1,2.428,2.739),this.add(f);const h=new U(e,ee(50));h.position.set(-16.109,18.021,-8.207),h.scale.set(.1,2.425,2.751),this.add(h);const M=new U(e,ee(17));M.position.set(14.904,12.198,-1.832),M.scale.set(.15,4.265,6.331),this.add(M);const p=new U(e,ee(43));p.position.set(-.462,8.89,14.52),p.scale.set(4.38,5.441,.088),this.add(p);const v=new U(e,ee(20));v.position.set(3.235,11.486,-12.541),v.scale.set(2.5,2,.1),this.add(v);const T=new U(e,ee(100));T.position.set(0,20,0),T.scale.set(1,.1,1),this.add(T)}dispose(){const e=new Set;this.traverse(o=>{o.isMesh&&(e.add(o.geometry),e.add(o.material))});for(const o of e)o.dispose()}}function ee(R){return new ot({color:0,emissive:16777215,emissiveIntensity:R})}const Te={name:"CopyShader",uniforms:{tDiffuse:{value:null},opacity:{value:1}},vertexShader:`

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


		}`};class oe{constructor(){this.isPass=!0,this.enabled=!0,this.needsSwap=!0,this.clear=!1,this.renderToScreen=!1}setSize(){}render(){console.error("THREE.Pass: .render() must be implemented in derived pass.")}dispose(){}}const Nt=new rt(-1,1,1,-1,0,1);class kt extends ze{constructor(){super(),this.setAttribute("position",new De([-1,3,0,-1,-1,0,3,-1,0],3)),this.setAttribute("uv",new De([0,2,0,0,2,0],2))}}const Ot=new kt;class Fe{constructor(e){this._mesh=new U(Ot,e)}dispose(){this._mesh.geometry.dispose()}render(e){e.render(this._mesh,Nt)}get material(){return this._mesh.material}set material(e){this._mesh.material=e}}class Lt extends oe{constructor(e,o="tDiffuse"){super(),this.textureID=o,this.uniforms=null,this.material=null,e instanceof se?(this.uniforms=e.uniforms,this.material=e):e&&(this.uniforms=Se.clone(e.uniforms),this.material=new se({name:e.name!==void 0?e.name:"unspecified",defines:Object.assign({},e.defines),uniforms:this.uniforms,vertexShader:e.vertexShader,fragmentShader:e.fragmentShader})),this._fsQuad=new Fe(this.material)}render(e,o,u){this.uniforms[this.textureID]&&(this.uniforms[this.textureID].value=u.texture),this._fsQuad.material=this.material,this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(o),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}class Xe extends oe{constructor(e,o){super(),this.scene=e,this.camera=o,this.clear=!0,this.needsSwap=!1,this.inverse=!1}render(e,o,u){const c=e.getContext(),i=e.state;i.buffers.color.setMask(!1),i.buffers.depth.setMask(!1),i.buffers.color.setLocked(!0),i.buffers.depth.setLocked(!0);let l,n;this.inverse?(l=0,n=1):(l=1,n=0),i.buffers.stencil.setTest(!0),i.buffers.stencil.setOp(c.REPLACE,c.REPLACE,c.REPLACE),i.buffers.stencil.setFunc(c.ALWAYS,l,4294967295),i.buffers.stencil.setClear(n),i.buffers.stencil.setLocked(!0),e.setRenderTarget(u),this.clear&&e.clear(),e.render(this.scene,this.camera),e.setRenderTarget(o),this.clear&&e.clear(),e.render(this.scene,this.camera),i.buffers.color.setLocked(!1),i.buffers.depth.setLocked(!1),i.buffers.color.setMask(!0),i.buffers.depth.setMask(!0),i.buffers.stencil.setLocked(!1),i.buffers.stencil.setFunc(c.EQUAL,1,4294967295),i.buffers.stencil.setOp(c.KEEP,c.KEEP,c.KEEP),i.buffers.stencil.setLocked(!0)}}class Gt extends oe{constructor(){super(),this.needsSwap=!1}render(e){e.state.buffers.stencil.setLocked(!1),e.state.buffers.stencil.setTest(!1)}}class Qt{constructor(e,o){if(this.renderer=e,this._pixelRatio=e.getPixelRatio(),o===void 0){const u=e.getSize(new Q);this._width=u.width,this._height=u.height,o=new we(this._width*this._pixelRatio,this._height*this._pixelRatio,{type:Me}),o.texture.name="EffectComposer.rt1"}else this._width=o.width,this._height=o.height;this.renderTarget1=o,this.renderTarget2=o.clone(),this.renderTarget2.texture.name="EffectComposer.rt2",this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2,this.renderToScreen=!0,this.passes=[],this.copyPass=new Lt(Te),this.copyPass.material.blending=nt,this.timer=new lt}swapBuffers(){const e=this.readBuffer;this.readBuffer=this.writeBuffer,this.writeBuffer=e}addPass(e){this.passes.push(e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}insertPass(e,o){this.passes.splice(o,0,e),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}removePass(e){const o=this.passes.indexOf(e);o!==-1&&this.passes.splice(o,1)}isLastEnabledPass(e){for(let o=e+1;o<this.passes.length;o++)if(this.passes[o].enabled)return!1;return!0}render(e){this.timer.update(),e===void 0&&(e=this.timer.getDelta());const o=this.renderer.getRenderTarget();let u=!1;for(let c=0,i=this.passes.length;c<i;c++){const l=this.passes[c];if(l.enabled!==!1){if(l.renderToScreen=this.renderToScreen&&this.isLastEnabledPass(c),l.render(this.renderer,this.writeBuffer,this.readBuffer,e,u),l.needsSwap){if(u){const n=this.renderer.getContext(),f=this.renderer.state.buffers.stencil;f.setFunc(n.NOTEQUAL,1,4294967295),this.copyPass.render(this.renderer,this.writeBuffer,this.readBuffer,e),f.setFunc(n.EQUAL,1,4294967295)}this.swapBuffers()}Xe!==void 0&&(l instanceof Xe?u=!0:l instanceof Gt&&(u=!1))}}this.renderer.setRenderTarget(o)}reset(e){if(e===void 0){const o=this.renderer.getSize(new Q);this._pixelRatio=this.renderer.getPixelRatio(),this._width=o.width,this._height=o.height,e=this.renderTarget1.clone(),e.setSize(this._width*this._pixelRatio,this._height*this._pixelRatio)}this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.renderTarget1=e,this.renderTarget2=e.clone(),this.writeBuffer=this.renderTarget1,this.readBuffer=this.renderTarget2}setSize(e,o){this._width=e,this._height=o;const u=this._width*this._pixelRatio,c=this._height*this._pixelRatio;this.renderTarget1.setSize(u,c),this.renderTarget2.setSize(u,c);for(let i=0;i<this.passes.length;i++)this.passes[i].setSize(u,c)}setPixelRatio(e){this._pixelRatio=e,this.setSize(this._width,this._height)}dispose(){this.renderTarget1.dispose(),this.renderTarget2.dispose(),this.copyPass.dispose()}}class Ht extends oe{constructor(e,o,u=null,c=null,i=null){super(),this.scene=e,this.camera=o,this.overrideMaterial=u,this.clearColor=c,this.clearAlpha=i,this.clear=!0,this.clearDepth=!1,this.needsSwap=!1,this.isRenderPass=!0,this._oldClearColor=new me}render(e,o,u){const c=e.autoClear;e.autoClear=!1;let i,l;this.overrideMaterial!==null&&(l=this.scene.overrideMaterial,this.scene.overrideMaterial=this.overrideMaterial),this.clearColor!==null&&(e.getClearColor(this._oldClearColor),e.setClearColor(this.clearColor,e.getClearAlpha())),this.clearAlpha!==null&&(i=e.getClearAlpha(),e.setClearAlpha(this.clearAlpha)),this.clearDepth==!0&&e.clearDepth(),e.setRenderTarget(this.renderToScreen?null:u),this.clear===!0&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),e.render(this.scene,this.camera),this.clearColor!==null&&e.setClearColor(this._oldClearColor),this.clearAlpha!==null&&e.setClearAlpha(i),this.overrideMaterial!==null&&(this.scene.overrideMaterial=l),e.autoClear=c}}const Wt={uniforms:{tDiffuse:{value:null},luminosityThreshold:{value:1},smoothWidth:{value:1},defaultColor:{value:new me(0)},defaultOpacity:{value:0}},vertexShader:`

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

		}`};class ae extends oe{constructor(e,o=1,u,c){super(),this.strength=o,this.radius=u,this.threshold=c,this.resolution=e!==void 0?new Q(e.x,e.y):new Q(256,256),this.clearColor=new me(0,0,0),this.needsSwap=!1,this.renderTargetsHorizontal=[],this.renderTargetsVertical=[],this.nMips=5;let i=Math.round(this.resolution.x/2),l=Math.round(this.resolution.y/2);this.renderTargetBright=new we(i,l,{type:Me}),this.renderTargetBright.texture.name="UnrealBloomPass.bright",this.renderTargetBright.texture.generateMipmaps=!1;for(let M=0;M<this.nMips;M++){const p=new we(i,l,{type:Me});p.texture.name="UnrealBloomPass.h"+M,p.texture.generateMipmaps=!1,this.renderTargetsHorizontal.push(p);const v=new we(i,l,{type:Me});v.texture.name="UnrealBloomPass.v"+M,v.texture.generateMipmaps=!1,this.renderTargetsVertical.push(v),i=Math.round(i/2),l=Math.round(l/2)}const n=Wt;this.highPassUniforms=Se.clone(n.uniforms),this.highPassUniforms.luminosityThreshold.value=c,this.highPassUniforms.smoothWidth.value=.01,this.materialHighPassFilter=new se({uniforms:this.highPassUniforms,vertexShader:n.vertexShader,fragmentShader:n.fragmentShader}),this.separableBlurMaterials=[];const f=[6,10,14,18,22];i=Math.round(this.resolution.x/2),l=Math.round(this.resolution.y/2);for(let M=0;M<this.nMips;M++)this.separableBlurMaterials.push(this._getSeparableBlurMaterial(f[M])),this.separableBlurMaterials[M].uniforms.invSize.value=new Q(1/i,1/l),i=Math.round(i/2),l=Math.round(l/2);this.compositeMaterial=this._getCompositeMaterial(this.nMips),this.compositeMaterial.uniforms.blurTexture1.value=this.renderTargetsVertical[0].texture,this.compositeMaterial.uniforms.blurTexture2.value=this.renderTargetsVertical[1].texture,this.compositeMaterial.uniforms.blurTexture3.value=this.renderTargetsVertical[2].texture,this.compositeMaterial.uniforms.blurTexture4.value=this.renderTargetsVertical[3].texture,this.compositeMaterial.uniforms.blurTexture5.value=this.renderTargetsVertical[4].texture,this.compositeMaterial.uniforms.bloomStrength.value=o,this.compositeMaterial.uniforms.bloomRadius.value=.1;const h=[1,.8,.6,.4,.2];this.compositeMaterial.uniforms.bloomFactors.value=h,this.bloomTintColors=[new F(1,1,1),new F(1,1,1),new F(1,1,1),new F(1,1,1),new F(1,1,1)],this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,this.copyUniforms=Se.clone(Te.uniforms),this.blendMaterial=new se({uniforms:this.copyUniforms,vertexShader:Te.vertexShader,fragmentShader:Te.fragmentShader,premultipliedAlpha:!0,blending:ct,depthTest:!1,depthWrite:!1,transparent:!0}),this._oldClearColor=new me,this._oldClearAlpha=1,this._basic=new ie,this._fsQuad=new Fe(null)}dispose(){for(let e=0;e<this.renderTargetsHorizontal.length;e++)this.renderTargetsHorizontal[e].dispose();for(let e=0;e<this.renderTargetsVertical.length;e++)this.renderTargetsVertical[e].dispose();this.renderTargetBright.dispose();for(let e=0;e<this.separableBlurMaterials.length;e++)this.separableBlurMaterials[e].dispose();this.compositeMaterial.dispose(),this.blendMaterial.dispose(),this._basic.dispose(),this._fsQuad.dispose()}setSize(e,o){let u=Math.round(e/2),c=Math.round(o/2);this.renderTargetBright.setSize(u,c);for(let i=0;i<this.nMips;i++)this.renderTargetsHorizontal[i].setSize(u,c),this.renderTargetsVertical[i].setSize(u,c),this.separableBlurMaterials[i].uniforms.invSize.value=new Q(1/u,1/c),u=Math.round(u/2),c=Math.round(c/2)}render(e,o,u,c,i){e.getClearColor(this._oldClearColor),this._oldClearAlpha=e.getClearAlpha();const l=e.autoClear;e.autoClear=!1,e.setClearColor(this.clearColor,0),i&&e.state.buffers.stencil.setTest(!1),this.renderToScreen&&(this._fsQuad.material=this._basic,this._basic.map=u.texture,e.setRenderTarget(null),e.clear(),this._fsQuad.render(e)),this.highPassUniforms.tDiffuse.value=u.texture,this.highPassUniforms.luminosityThreshold.value=this.threshold,this._fsQuad.material=this.materialHighPassFilter,e.setRenderTarget(this.renderTargetBright),e.clear(),this._fsQuad.render(e);let n=this.renderTargetBright;for(let f=0;f<this.nMips;f++)this._fsQuad.material=this.separableBlurMaterials[f],this.separableBlurMaterials[f].uniforms.colorTexture.value=n.texture,this.separableBlurMaterials[f].uniforms.direction.value=ae.BlurDirectionX,e.setRenderTarget(this.renderTargetsHorizontal[f]),e.clear(),this._fsQuad.render(e),this.separableBlurMaterials[f].uniforms.colorTexture.value=this.renderTargetsHorizontal[f].texture,this.separableBlurMaterials[f].uniforms.direction.value=ae.BlurDirectionY,e.setRenderTarget(this.renderTargetsVertical[f]),e.clear(),this._fsQuad.render(e),n=this.renderTargetsVertical[f];this._fsQuad.material=this.compositeMaterial,this.compositeMaterial.uniforms.bloomStrength.value=this.strength,this.compositeMaterial.uniforms.bloomRadius.value=this.radius,this.compositeMaterial.uniforms.bloomTintColors.value=this.bloomTintColors,e.setRenderTarget(this.renderTargetsHorizontal[0]),e.clear(),this._fsQuad.render(e),this._fsQuad.material=this.blendMaterial,this.copyUniforms.tDiffuse.value=this.renderTargetsHorizontal[0].texture,i&&e.state.buffers.stencil.setTest(!0),this.renderToScreen?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(u),this._fsQuad.render(e)),e.setClearColor(this._oldClearColor,this._oldClearAlpha),e.autoClear=l}_getSeparableBlurMaterial(e){const o=[],u=e/3;for(let c=0;c<e;c++)o.push(.39894*Math.exp(-.5*c*c/(u*u))/u);return new se({defines:{KERNEL_RADIUS:e},uniforms:{colorTexture:{value:null},invSize:{value:new Q(.5,.5)},direction:{value:new Q(.5,.5)},gaussianCoefficients:{value:o}},vertexShader:`

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

				}`})}_getCompositeMaterial(e){return new se({defines:{NUM_MIPS:e},uniforms:{blurTexture1:{value:null},blurTexture2:{value:null},blurTexture3:{value:null},blurTexture4:{value:null},blurTexture5:{value:null},bloomStrength:{value:1},bloomFactors:{value:null},bloomTintColors:{value:null},bloomRadius:{value:0}},vertexShader:`

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

				}`})}}ae.BlurDirectionX=new Q(1,0);ae.BlurDirectionY=new Q(0,1);const ve={name:"OutputShader",uniforms:{tDiffuse:{value:null},toneMappingExposure:{value:1}},vertexShader:`
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

		}`};class Vt extends oe{constructor(){super(),this.isOutputPass=!0,this.uniforms=Se.clone(ve.uniforms),this.material=new ht({name:ve.name,uniforms:this.uniforms,vertexShader:ve.vertexShader,fragmentShader:ve.fragmentShader}),this._fsQuad=new Fe(this.material),this._outputColorSpace=null,this._toneMapping=null}render(e,o,u){this.uniforms.tDiffuse.value=u.texture,this.uniforms.toneMappingExposure.value=e.toneMappingExposure,(this._outputColorSpace!==e.outputColorSpace||this._toneMapping!==e.toneMapping)&&(this._outputColorSpace=e.outputColorSpace,this._toneMapping=e.toneMapping,this.material.defines={},ut.getTransfer(this._outputColorSpace)===ft&&(this.material.defines.SRGB_TRANSFER=""),this._toneMapping===pt?this.material.defines.LINEAR_TONE_MAPPING="":this._toneMapping===dt?this.material.defines.REINHARD_TONE_MAPPING="":this._toneMapping===mt?this.material.defines.CINEON_TONE_MAPPING="":this._toneMapping===Je?this.material.defines.ACES_FILMIC_TONE_MAPPING="":this._toneMapping===gt?this.material.defines.AGX_TONE_MAPPING="":this._toneMapping===xt?this.material.defines.NEUTRAL_TONE_MAPPING="":this._toneMapping===bt&&(this.material.defines.CUSTOM_TONE_MAPPING=""),this.material.needsUpdate=!0),this.renderToScreen===!0?(e.setRenderTarget(null),this._fsQuad.render(e)):(e.setRenderTarget(o),this.clear&&e.clear(e.autoClearColor,e.autoClearDepth,e.autoClearStencil),this._fsQuad.render(e))}dispose(){this.material.dispose(),this._fsQuad.dispose()}}const pe=new F;function G(R,e,o,u,c,i){const l=2*Math.PI*c/4,n=Math.max(i-2*c,0),f=Math.PI/4;pe.copy(e),pe[u]=0,pe.normalize();const h=.5*l/(l+n),M=1-pe.angleTo(R)/f;return Math.sign(pe[o])===1?M*h:n/(l+n)+h+h*(1-M)}class Ue extends qe{constructor(e=1,o=1,u=1,c=2,i=.1){const l=c*2+1;if(i=Math.min(e/2,o/2,u/2,i),super(1,1,1,l,l,l),this.type="RoundedBoxGeometry",this.parameters={width:e,height:o,depth:u,segments:c,radius:i},l===1)return;const n=this.toNonIndexed();this.index=null,this.attributes.position=n.attributes.position,this.attributes.normal=n.attributes.normal,this.attributes.uv=n.attributes.uv;const f=new F,h=new F,M=new F(e,o,u).divideScalar(2).subScalar(i),p=this.attributes.position.array,v=this.attributes.normal.array,T=this.attributes.uv.array,r=p.length/6,_=new F,E=.5/l;for(let S=0,s=0;S<p.length;S+=3,s+=2)switch(f.fromArray(p,S),h.copy(f),h.x-=Math.sign(h.x)*E,h.y-=Math.sign(h.y)*E,h.z-=Math.sign(h.z)*E,h.normalize(),p[S+0]=M.x*Math.sign(f.x)+h.x*i,p[S+1]=M.y*Math.sign(f.y)+h.y*i,p[S+2]=M.z*Math.sign(f.z)+h.z*i,v[S+0]=h.x,v[S+1]=h.y,v[S+2]=h.z,Math.floor(S/r)){case 0:_.set(1,0,0),T[s+0]=G(_,h,"z","y",i,u),T[s+1]=1-G(_,h,"y","z",i,o);break;case 1:_.set(-1,0,0),T[s+0]=1-G(_,h,"z","y",i,u),T[s+1]=1-G(_,h,"y","z",i,o);break;case 2:_.set(0,1,0),T[s+0]=1-G(_,h,"x","z",i,e),T[s+1]=G(_,h,"z","x",i,u);break;case 3:_.set(0,-1,0),T[s+0]=1-G(_,h,"x","z",i,e),T[s+1]=1-G(_,h,"z","x",i,u);break;case 4:_.set(0,0,1),T[s+0]=1-G(_,h,"x","y",i,e),T[s+1]=1-G(_,h,"y","x",i,o);break;case 5:_.set(0,0,-1),T[s+0]=G(_,h,"x","y",i,e),T[s+1]=1-G(_,h,"y","x",i,o);break}}static fromJSON(e){return new Ue(e.width,e.height,e.depth,e.segments,e.radius)}}function jt({screenMaterials:R,nameplateMaterial:e,metalMap:o=null,planetMap:u=null}){const c=new Ye;c.background=new me("#020409");const i=new Set,l=t=>(i.add(t),t),n=(t,d=.6,m=.4,y={})=>l(new de({color:t,metalness:d,roughness:m,...y})),f=n("#b2b9a9",.76,.44,{map:o,bumpMap:o,bumpScale:.025}),h=n("#617f6e",.6,.42,{map:o}),M=n("#7a817a",.86,.3),p=n("#090f12",.28,.32),v=n("#101414",.05,.85),T=n("#b1a477",.72,.3),r=n("#edcb59",.25,.28,{emissive:"#ffce54",emissiveIntensity:1.8});n("#b1ddd4",.1,.3,{emissive:"#80cfc3",emissiveIntensity:1.6});const _=l(new Ue(1,1,1,3,.035)),E=l(new Le(1,1,1,16)),S=[];function s(t,d,m,y,z){const A=new U(_,y);return A.scale.set(...d),A.position.set(...m),z&&A.rotation.set(...z),A.castShadow=!0,A.receiveShadow=!0,t.add(A),A}function g(t,d,m,y,z){const A=new F(...d),B=new F(...m),L=B.clone().sub(A),k=new U(E,z);return k.scale.set(y,L.length(),y),k.position.copy(A.add(B).multiplyScalar(.5)),k.quaternion.setFromUnitVectors(new F(0,1,0),L.normalize()),t.add(k),k.castShadow=!0,k}function P(t,d){for(const m of d)S.push({parent:t,p:m})}const w=new te;c.add(w),s(w,[17,.18,15],[0,-1.15,1],h);for(let t=-7;t<=7;t++)s(w,[.035,.015,13],[t,-1.049,1],M);for(let t=-5;t<8;t+=2)s(w,[16,.02,.03],[0,-1.03,t],p);for(const t of[-1,1]){s(w,[.35,7,13],[t*7.6,2.3,.5],f),s(w,[.18,1.3,11],[t*7.37,.1,.5],p);for(let d=-4;d<9;d+=2.4){s(w,[.28,6.4,.25],[t*7.28,2.1,d],M,[0,0,t*.1]),s(w,[.09,1.1,.12],[t*7.05,4.05,d+.18],r,[0,0,t*.1]);for(let m=.8;m<4;m+=.34)s(w,[.09,.035,.42],[t*7.04,m,d],p)}s(w,[.55,.28,2.1],[t*1.85,.1,5.2],v,[.06,0,0]),s(w,[.42,.7,.45],[t*1.85,-.3,5.35],p)}s(w,[15.3,.3,13],[0,6.5,.5],f);for(let t=-6;t<=6;t+=3)s(w,[.22,.12,12],[t,6.25,1],M);const re=[[-7.2,1.3,-3.2],[-7.05,5.7,-4.8],[7.05,5.7,-4.8],[7.2,1.3,-3.2]];for(let t=0;t<4;t++)g(w,re[t],re[(t+1)%4],.16,M);g(w,[-7.1,1.55,-3.17],[7.1,1.55,-3.17],.08,p);for(const t of[-1,1])g(w,[t*6.95,1.35,-3.15],[t*6.8,5.6,-4.74],.06,p),g(w,[t*6.77,3.85,-4.2],[t*6.73,4.75,-4.55],.025,r),s(w,[.25,.5,.2],[t*6.85,3.55,-4.03],T,[.2,0,0]);s(w,[14.5,.22,.8],[0,1.3,-3.25],f),s(w,[13.8,.2,3.7],[0,.35,.2],f,[.04,0,0]),s(w,[13.85,.09,.12],[0,.34,2.04],M);for(let t=-6;t<=6;t+=2)s(w,[1.9,.035,2.85],[t,.49,.12],h,[.04,0,0]),s(w,[.055,.035,3.5],[t+.95,.5,.2],p),s(w,[.12,1.4,2.5],[t,-.35,.3],p),P(w,[[t-.78,.52,1.3],[t+.78,.52,1.3],[t-.78,.62,-1],[t+.78,.62,-1]]);const ne=[],le=[],V=[];Z.forEach((t,d)=>{const m=new te;m.position.set(t.x,1.85,t.z),m.rotation.set(-.07,t.yaw,0),w.add(m),le.push(m),s(m,[2.73,1.94,.18],[0,0,0],M),s(m,[2.65,1.86,.2],[0,0,.05],f),s(m,[2.47,1.64,.12],[0,0,.16],v);const y=new U(l(new Ge(2.34,1.48)),R[d]);y.position.z=.229,y.userData.id=t.id,m.add(y),ne.push(y),s(m,[.3,.46,.19],[0,-1.13,-.09],p),s(m,[1.03,.065,.45],[0,-1.37,-.05],M);for(const A of[-1.25,1.25])for(const B of[-.85,.85])P(m,[[A,B,.178]]);for(let A=-.65;A<=.65;A+=.16)s(m,[.16,.035,.075],[1.29,A,.166],p),s(m,[.16,.035,.075],[-1.29,A,.166],p);const z=n("#ffe478",.1,.3,{emissive:"#d4ab42",emissiveIntensity:.5});V.push(z),s(m,[.2,.025,.025],[.99,.851,.173],z),g(w,[t.x,.66,t.z-.08],[t.x,.6,t.z-.45],.04,p)});for(const t of[-1,1]){const d=new te;d.position.set(t*4.3,.6,1),d.rotation.x=-.03,w.add(d),s(d,[2.55,.09,1.12],[0,0,0],p);for(let m=0;m<4;m++){const y=-.88+m*.57,z=new U(E,M);z.scale.set(.13,.17,.13),z.position.set(y,.1,-.17),d.add(z),z.castShadow=!0;const A=new U(E,p);A.scale.set(.115,.07,.115),A.position.set(y,.21,-.17),d.add(A),s(d,[.015,.014,.07],[y,.254,-.19],T);for(let B=0;B<2;B++)s(d,[.18,.05,.13],[y,.065,.17+B*.23],B?v:r)}P(d,[[-1.16,.06,-.44],[1.16,.06,-.44],[-1.16,.06,.44],[1.16,.06,.44]])}for(let t=-10;t<=10;t++)s(w,[.035,.02,.58],[t*.065,.52,1.27],p);if(s(w,[3.65,.55,.12],[0,5.42,-4.55],p),e){const t=new U(l(new Ge(3.35,.4)),e);t.position.set(0,5.42,-4.475),w.add(t)}for(const t of[-2.1,2.1])s(w,[.7,.035,.03],[t,5.44,-4.44],r);w.updateMatrixWorld(!0);const _e=l(new Le(.036,.036,.015,6)),ce=new Ke(_e,M,S.length),q=new $e;S.forEach(({parent:t,p:d},m)=>{q.position.set(...d),q.rotation.set(t===w?0:Math.PI/2,0,0),q.updateMatrix(),ce.setMatrixAt(m,new Ze().multiplyMatrices(t.matrixWorld,q.matrix))}),c.add(ce);const K=new te;c.add(K);const he=[],I=l(new vt(1,64,48));[[-23,9,-35,5.5,"#e8bd80"],[-8,6.1,-28,1.5,"#cbb78c"],[5,7,-32,3.8,"#b8c9c2"],[17,4,-36,2.2,"#72979e"]].forEach(([t,d,m,y,z],A)=>{const B=new te;B.position.set(t,d,m),K.add(B);const L=new U(I,l(new de({color:z,roughness:.92,map:u})));if(L.scale.setScalar(y),L.rotation.z=.14,B.add(L),he.push(L),A===2){const k=new U(l(new Qe(y*1.32,y*2.03,128)),l(new de({color:"#b0a589",side:He,roughness:.9,transparent:!0,opacity:.68})));k.rotation.set(1.15,.15,.35),B.add(k);for(let J=y*1.4;J<y*2;J+=.1){const H=new U(l(new Qe(J,J+.018,96)),l(new ie({color:"#4c4b49",side:He,transparent:!0,opacity:.55})));H.rotation.copy(k.rotation),B.add(H)}}});const C=[];for(let t=0;t<2200;t++){const d=t*2.399963,m=Math.acos(1-2*(t+.5)/2200);C.push(Math.cos(d)*Math.sin(m)*95,Math.cos(m)*65+10,Math.sin(d)*Math.sin(m)*95-45)}const N=l(new ze);N.setAttribute("position",new De(C,3)),K.add(new wt(N,l(new Mt({color:"#d9e0e4",size:.095,sizeAttenuation:!0}))));const ue=l(new Tt({color:"#a39b6b",transparent:!0,opacity:.16}));for(let t=0;t<4;t++){const d=[];for(let m=0;m<=160;m++){const y=m/160*Math.PI*2;d.push(new F(Math.cos(y)*(18+t*4),3+Math.sin(y)*1.5,-33+Math.sin(y)*(8+t*2)))}K.add(new St(l(new ze().setFromPoints(d)),ue))}const W=new yt("#ffecd3",3.5);W.position.set(-15,15,2),W.castShadow=!0,W.shadow.mapSize.set(2048,2048),Object.assign(W.shadow.camera,{left:-10,right:10,top:9,bottom:-4,near:.5,far:50}),W.shadow.bias=-2e-4,W.shadow.normalBias=.035,c.add(W),c.add(new _t("#c3ddd9","#171b17",1.5));const ge=new Ee("#acdad0",18,14,2);ge.position.set(0,3.4,3),c.add(ge);const $=new Ee("#ffe2a6",22,14,2);return $.position.set(-6,4,-1),c.add($),{scene:c,screens:ne,monitorGroups:le,indicatorMaterials:V,planets:he,resources:i,dispose(){i.forEach(t=>{var d;return(d=t.dispose)==null?void 0:d.call(t)})}}}function Xt(){let R=!1;const e={},o=(p,v)=>{const T=new Image;e[p]=T,T.onload=()=>{R||l(0)},T.src=v},u=Z.map(()=>{const p=document.createElement("canvas");p.width=1024,p.height=648;const v=new We(p);return v.colorSpace=ye,v.minFilter=Ct,{canvas:p,ctx:p.getContext("2d"),texture:v,material:new ie({map:v,toneMapped:!1})}});function c(p,v,T,r,_,E){if(!(v!=null&&v.complete)||!v.naturalWidth)return;const S=Math.max(_/v.naturalWidth,E/v.naturalHeight),s=_/S,g=E/S;p.drawImage(v,(v.naturalWidth-s)/2,(v.naturalHeight-g)/2,s,g,T,r,_,E)}function i(p,v=0,T=!1){const{ctx:r,canvas:_,texture:E}=u[p],S=Z[p];if(r.fillStyle="#081713",r.fillRect(0,0,1024,648),r.fillStyle=T?"#f6d761":"#ecebdd",r.font="500 38px Arial",r.fillText(S.title,40,66),r.fillStyle="#57736c",r.fillRect(36,94,952,2),p===0){r.fillStyle="#142721",r.fillRect(34,114,956,391);const s=e.hoshi;if(s!=null&&s.complete&&s.naturalWidth){const P=357*s.naturalWidth/s.naturalHeight;r.drawImage(s,(1024-P)/2,120,P,357)}r.strokeStyle="#789085",r.lineWidth=2,r.strokeRect(220,131,584,342)}else if(p===1)c(r,e.gallery,34,114,956,391);else if(p===2){r.fillStyle="#f2f0e4",r.font="500 60px Arial",r.fillText("1420.40",40,181),r.font="24px Arial",r.fillText("MHz",275,181),r.fillStyle="#9bb5aa",r.font="18px Arial",r.fillText("EXHIBITION SIGNAL SIMULATION",40,218),r.strokeStyle="#77998935",r.lineWidth=1;for(let s=40;s<980;s+=47)r.beginPath(),r.moveTo(s,244),r.lineTo(s,402),r.stroke();for(let s=244;s<402;s+=31)r.beginPath(),r.moveTo(40,s),r.lineTo(980,s),r.stroke();r.strokeStyle="#8fdccd",r.lineWidth=2.5,r.beginPath();for(let s=40;s<=980;s++){const g=9+87*Math.exp(-Math.pow((s-560)/25,2)),P=335+Math.sin(s*.24+v*.001)*g+Math.sin(s*.91)*5;s===40?r.moveTo(s,P):r.lineTo(s,P)}r.stroke();for(let s=40;s<980;s+=8)for(let g=415;g<501;g+=6){const P=(Math.sin(s*.33+g*.78+v*3e-4)+1)/2;r.fillStyle=`hsl(${175+P*60} 55% ${8+P*25}%)`,r.fillRect(s,g,7,5)}}else{r.fillStyle="#081b13",r.fillRect(34,114,956,391),r.fillStyle="#eeeacb",r.font="bold 67px Arial",r.fillText("ARTSTRONOMY",55,225),r.font="20px Arial",r.fillStyle="#c3caba",r.fillText("23 CREATORS. ONE UNIVERSE.",59,272);const s=e.hoshi;s!=null&&s.complete&&s.naturalWidth&&r.drawImage(s,665,274,240,218),c(r,e.art,55,303,275,170),c(r,e.animation,344,303,275,170)}r.fillStyle="#a9bcb0",r.font="22px Arial",r.fillText(S.note.toUpperCase(),40,539),r.fillStyle=T?"#fff0a2":"#f6d761",r.beginPath(),r.roundRect(182,566,660,57,7),r.fill(),r.textAlign="center",r.fillStyle="#13231e",r.font="bold 26px Arial",r.fillText(S.action.toUpperCase(),512,605),r.textAlign="left",E.needsUpdate=!0}function l(p){u.forEach((v,T)=>i(T,p))}o("hoshi","/artstronomy-2026/assets/hoshi-mascot.webp"),o("gallery","/artstronomy-2026/assets/hub/gallery-preview.webp"),o("art","/artstronomy-2026/assets/project-graphic-design.webp"),o("animation","/artstronomy-2026/assets/project-animation.webp"),l(0);const n=document.createElement("canvas");n.width=1200,n.height=145;const f=n.getContext("2d");f.fillStyle="#090f10",f.fillRect(0,0,1200,145),f.fillStyle="#ecebdc",f.textAlign="center",f.font="500 64px Arial",f.fillText("A R T S T R O N O M Y",600,73),f.fillStyle="#c9b667",f.font="24px Arial",f.fillText("C O N T R O L   S T A T I O N",600,123);const h=new We(n);h.colorSpace=ye;const M=new ie({map:h,toneMapped:!1});return{items:u,draw:i,nameplateMaterial:M,dispose(){R=!0,h.dispose(),M.dispose(),Object.values(e).forEach(p=>p.onload=null),u.forEach(p=>{p.texture.dispose(),p.material.dispose()})}}}function qt({host:R,onSelect:e,onHover:o,onReady:u,onFallback:c,monitorElement:i,initialCinematic:l,onMotion:n=()=>{}}){let f;try{f=new At({antialias:!0,powerPreference:"high-performance"})}catch{return c("3D is unavailable in this browser. The image view and all four destinations are still available."),{dispose(){},home(){},focus(){},setCinematic(){},launch(a){e(a)}}}f.setPixelRatio(Math.min(devicePixelRatio||1,2)),f.outputColorSpace=ye,f.toneMapping=Je,f.toneMappingExposure=1.05,f.shadowMap.enabled=!0,f.shadowMap.type=Pt,R.appendChild(f.domElement);const h=f.domElement;h.tabIndex=0,h.setAttribute("aria-label","Spaceship cockpit. Drag to look around, use arrow keys to look, or use the four destination buttons.");const M=[];let p=!1,v=!0;const T=(a,b=!1)=>{const x=new Dt().load(a,()=>{p&&x.dispose()},void 0,()=>{});return x.colorSpace=ye,x.anisotropy=Math.min(8,f.capabilities.getMaxAnisotropy()),b&&(x.wrapS=x.wrapT=Ft,x.repeat.set(2,2)),M.push(x),x},r=T("/artstronomy-2026/assets/hub/cockpit-metal-albedo.webp",!0),_=T("/artstronomy-2026/assets/hub/gas-giant-albedo.webp"),E=Xt(),S=jt({screenMaterials:E.items.map(a=>a.material),nameplateMaterial:E.nameplateMaterial,metalMap:r,planetMap:_}),{scene:s}=S,g=new Rt(57,1,.08,240),P=new F(0,2.75,6.35),w=new F(0,2.85,-5);g.position.copy(P),g.lookAt(w);const re=new Et(f),ne=new It,le=re.fromScene(ne,.04);s.environment=le.texture,s.environmentIntensity=.8,ne.dispose(),re.dispose();const V=new Qt(f),_e=new Ht(s,g),ce=new ae(new Q(1,1),.17,.35,1.25),q=new Vt;V.addPass(_e),V.addPass(ce),V.addPass(q);const K=new Bt,he=new Q,I={yaw:0,pitch:0},j={yaw:0,pitch:0};let C=null;const N=new te;N.position.set(0,3.1,-7),N.visible=!1,s.add(N);const ue=new zt(1,.055,20,128),W=new ie({color:10283997}),ge=new U(ue,W);N.add(ge);const $=new U(ue,new ie({color:16373881}));$.scale.setScalar(1.1),N.add($);let t=null,d=-1,m=0,y=0,z=0,A=!1,B=!1;const L=Ut({read:()=>({yaw:-I.yaw,pitch:I.pitch}),apply:a=>Object.assign(I,Re(-a.yaw,a.pitch)),blocked:()=>!!C||!!t,onState:n}),k=matchMedia("(prefers-reduced-motion: reduce)"),J=[],H=(a,b,x,D)=>{a.addEventListener(b,x,D),J.push(()=>a.removeEventListener(b,x,D))};function Be(){const{width:a,height:b}=R.getBoundingClientRect();!a||!b||(A=a/b<.95,g.aspect=a/b,g.fov=A?72:57,g.updateProjectionMatrix(),f.setSize(a,b),V.setSize(a,b))}const Ie=new ResizeObserver(Be);Ie.observe(R),Be();function Ne(a){var x;const b=h.getBoundingClientRect();return he.set((a.clientX-b.left)/b.width*2-1,-(a.clientY-b.top)/b.height*2+1),K.setFromCamera(he,g),(x=K.intersectObjects(S.screens)[0])==null?void 0:x.object.userData.id}function xe(a){const b=Z.findIndex(x=>x.id===a);b!==d&&(d>=0&&E.draw(d,m,!1),d=b,d>=0&&E.draw(d,m,!0),o(a||null),h.style.cursor=d>=0?"pointer":"grab")}function Ce(a){C||e(a)}function ke(a){const b=Math.max(0,Z.findIndex(fe=>fe.id===a)),x=S.screens[b];s.updateMatrixWorld(!0);const D=x.getWorldPosition(new F),X=x.getWorldQuaternion(new Ve),Y=Math.max(1.48/(2*Math.tan(je.degToRad(g.fov)/2)*.78),2.34/(2*Math.tan(je.degToRad(g.fov)/2)*g.aspect*.9));return{aim:D,position:D.clone().add(new F(0,0,Y).applyQuaternion(X))}}function Oe(a){if(N.visible=!1,E.items.forEach(b=>b.material.color.set(16777215)),!a){C=null,Ae();return}if(C={...a,started:performance.now(),from:g.position.clone(),fromQ:g.quaternion.clone()},a.kind==="return"){const b=ke(a.monitor||"website");g.position.copy(b.position),g.lookAt(b.aim),C.from.copy(g.position),C.fromQ.copy(g.quaternion)}a.kind==="arrival"&&(g.position.set(0,3.1,-4.5),g.lookAt(w),C.from.copy(g.position),C.fromQ.copy(g.quaternion)),a.kind==="portal"&&(N.visible=!0,a.to==="website"&&E.items.forEach(b=>b.material.color.set(0)))}function et(a){const b=Z.findIndex(D=>D.id===a);if(b<0)return;const x=new F;S.screens[b].getWorldPosition(x),I.yaw=Math.atan2(x.x-P.x,P.z-x.z),I.pitch=Math.atan2(x.y-P.y,Math.hypot(x.x-P.x,x.z-P.z)),xe(a)}function Ae(){L.reset(),I.yaw=0,I.pitch=0,g.position.copy(P)}H(h,"pointerdown",a=>{C||(t={x:a.clientX,y:a.clientY,lastX:a.clientX,lastY:a.clientY,moved:!1},h.setPointerCapture(a.pointerId),h.focus({preventScroll:!0}))}),H(h,"pointermove",a=>{if(!C)if(t){const b=a.clientX-t.lastX,x=a.clientY-t.lastY;Math.hypot(a.clientX-t.x,a.clientY-t.y)>6&&(t.moved=!0),Object.assign(I,Re(I.yaw-b*.0022,I.pitch+x*.0018)),t.lastX=a.clientX,t.lastY=a.clientY,t.moved&&xe(null)}else xe(Ne(a))}),H(h,"pointerup",a=>{if(!t)return;const b=t.moved;if(t=null,h.hasPointerCapture(a.pointerId)&&h.releasePointerCapture(a.pointerId),!b){const x=Ne(a);x&&Ce(x)}}),H(h,"pointercancel",()=>{t=null}),H(h,"pointerleave",()=>{t||xe(null)}),H(h,"keydown",a=>{if(C)return;const b={ArrowLeft:[-.09,0],ArrowRight:[.09,0],ArrowUp:[0,.07],ArrowDown:[0,-.07]};b[a.key]&&(a.preventDefault(),Object.assign(I,Re(I.yaw+b[a.key][0],I.pitch+b[a.key][1]))),a.key==="Home"&&(a.preventDefault(),Ae()),a.key==="Enter"&&d>=0&&(a.preventDefault(),Ce(Z[d].id))}),H(h,"webglcontextlost",a=>{a.preventDefault(),v=!1,cancelAnimationFrame(z),c("The 3D view was interrupted. You can still open any destination below.")});function Pe(a){if(p||!v||document.hidden)return;const b=Math.min((a-m)/1e3||.016,.05);if(m=a,C){const x=C.duration?Math.min(1,(a-C.started)/C.duration):1,D=x*x*(3-2*x);let X=P.clone(),Y=w.clone();if(C.kind==="monitor"){const be=ke(C.monitor||"scanner");X=be.position,Y=be.aim}C.kind==="portal"&&(N.visible=!0,N.scale.setScalar(.05+Math.min(1,x*2.3)*2.15),N.rotation.z=a*15e-5,$.rotation.z=-a*4e-4,X.set(0,3.1,-8),Y.set(0,3.1,-30)),g.position.lerpVectors(C.from,X,D);const fe=new Ve().setFromRotationMatrix(new Ze().lookAt(g.position,Y,g.up));g.quaternion.slerpQuaternions(C.fromQ,fe,D)}else{const x=k.matches?1:1-Math.exp(-b*9);j.yaw+=(I.yaw-j.yaw)*x,j.pitch+=(I.pitch-j.pitch)*x,g.position.copy(P),g.lookAt(P.x+Math.sin(j.yaw)*10,P.y+Math.sin(j.pitch)*10+.1,P.z-Math.cos(j.yaw)*10)}if(i&&(C==null?void 0:C.kind)==="monitor"){g.updateMatrixWorld();const x=S.screens[2],D=[[-1.17,-.74],[1.17,-.74],[-1.17,.74],[1.17,.74]].map(([O,it])=>x.localToWorld(new F(O,it,0)).project(g)),X=R.clientWidth,Y=R.clientHeight,fe=(Math.min(...D.map(O=>O.x))*.5+.5)*X,be=(-Math.max(...D.map(O=>O.y))*.5+.5)*Y,tt=(Math.max(...D.map(O=>O.x))-Math.min(...D.map(O=>O.x)))*X*.5,st=(Math.max(...D.map(O=>O.y))-Math.min(...D.map(O=>O.y)))*Y*.5;Object.assign(i.style,{left:`${fe}px`,top:`${be}px`,width:`${tt}px`,height:`${st}px`})}k.matches||(S.planets.forEach((x,D)=>{x.rotation.y+=b*(.025+D*.006)}),a-y>100&&(E.draw(2,a,d===2),y=a)),S.indicatorMaterials.forEach((x,D)=>x.emissiveIntensity=D===d?2:.4),V.render(),B||(B=!0,u()),z=requestAnimationFrame(Pe)}return l&&Oe(l),H(document,"visibilitychange",()=>{cancelAnimationFrame(z),m=0,!document.hidden&&v&&(z=requestAnimationFrame(Pe))}),z=requestAnimationFrame(Pe),{launch:Ce,focus:et,home:Ae,setCinematic:Oe,startMotion:a=>L.start(a),stopMotion:()=>L.stop(),dispose(){p=!0,L.dispose(),cancelAnimationFrame(z),Ie.disconnect(),J.forEach(a=>a()),E.dispose(),S.dispose(),ue.dispose(),W.dispose(),$.material.dispose(),M.forEach(a=>a.dispose()),le.dispose(),ce.dispose(),q.dispose(),V.dispose(),f.dispose(),h.remove()}}}export{qt as createHub};
