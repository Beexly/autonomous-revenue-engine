/* DualKawaseBloom.js — Lightweight Mobile-Safe Bloom & ACESFilmic Tone Mapping
 * Optimized for Three.js r170. Zero external dependencies.
 * Architecture: 3-level half-res Dual-Kawase pyramid + Soft-Knee Luminance Threshold + ACESFilmic Tone Mapping.
 */
import * as THREE from './three.module.js';

export class DualKawaseBloom {
  constructor(renderer, width, height, options = {}) {
    this.renderer = renderer;
    this.threshold = options.threshold !== undefined ? options.threshold : 0.88;
    this.knee = options.knee !== undefined ? options.knee : 0.13;
    this.bloomIntensity = options.bloomIntensity !== undefined ? options.bloomIntensity : 0.75;
    this.exposure = options.exposure !== undefined ? options.exposure : 1.35;
    this._enabled = options.enabled !== undefined ? options.enabled : true;

    // Synchronize initial renderer tone mapping
    if (this._enabled) {
      this.renderer.toneMapping = THREE.NoToneMapping;
    } else {
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = this.exposure;
    }

    // Full-screen triangle geometry & orthographic camera for blitting
    this.quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quadGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);
    this.quadGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.quadGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2));

    this.initRenderTargets(width, height);
    this.initShaders();
  }

  get enabled() {
    return this._enabled;
  }

  set enabled(val) {
    if (this._enabled === val) return;
    this._enabled = val;
    if (!val) {
      this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
      this.renderer.toneMappingExposure = this.exposure;
    } else {
      this.renderer.toneMapping = THREE.NoToneMapping;
    }
  }

  initRenderTargets(w, h) {
    const pars = {
      type: THREE.HalfFloatType,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter,
      depthBuffer: true,
      stencilBuffer: false
    };

    // Full-res HDR beauty buffer
    this.rtBeauty = new THREE.WebGLRenderTarget(w, h, pars);

    // Downsample & upsample pyramid (Half, Quarter, Eighth res)
    this.downTargets = [];
    this.upTargets = [];
    let curW = Math.max(1, Math.floor(w * 0.5));
    let curH = Math.max(1, Math.floor(h * 0.5));

    for (let i = 0; i < 3; i++) {
      this.downTargets.push(new THREE.WebGLRenderTarget(curW, curH, {
        type: THREE.HalfFloatType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: false
      }));
      this.upTargets.push(new THREE.WebGLRenderTarget(curW, curH, {
        type: THREE.HalfFloatType,
        minFilter: THREE.LinearFilter,
        magFilter: THREE.LinearFilter,
        depthBuffer: false
      }));
      curW = Math.max(1, Math.floor(curW * 0.5));
      curH = Math.max(1, Math.floor(curH * 0.5));
    }
  }

  initShaders() {
    // 1. Threshold & Downsample Shader (Extract bright spots above threshold)
    this.matThreshold = new THREE.ShaderMaterial({
      uniforms: {
        tInput: { value: null },
        uTexelSize: { value: new THREE.Vector2() },
        uThreshold: { value: this.threshold },
        uKnee: { value: this.knee }
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D tInput;
        uniform vec2 uTexelSize;
        uniform float uThreshold;
        uniform float uKnee;
        varying vec2 vUv;

        void main() {
          // 4 diagonal bilinear samples
          vec4 col = texture2D(tInput, vUv + vec2(-1.0, -1.0) * uTexelSize * 0.5) * 0.25;
          col += texture2D(tInput, vUv + vec2( 1.0, -1.0) * uTexelSize * 0.5) * 0.25;
          col += texture2D(tInput, vUv + vec2(-1.0,  1.0) * uTexelSize * 0.5) * 0.25;
          col += texture2D(tInput, vUv + vec2( 1.0,  1.0) * uTexelSize * 0.5) * 0.25;

          // Soft-knee luminance threshold
          float lum = dot(col.rgb, vec3(0.2126, 0.7152, 0.0722));
          float soft = clamp(lum - uThreshold + uKnee, 0.0, 2.0 * uKnee);
          soft = (soft * soft) / (4.0 * uKnee + 0.0001);
          float factor = max(soft, lum - uThreshold) / max(lum, 0.0001);

          gl_FragColor = vec4(col.rgb * max(factor, 0.0), col.a);
        }
      `,
      depthTest: false,
      depthWrite: false
    });

    // 2. Dual-Kawase Downsample Shader
    this.matDown = new THREE.ShaderMaterial({
      uniforms: {
        tInput: { value: null },
        uTexelSize: { value: new THREE.Vector2() },
        uOffset: { value: 1.0 }
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D tInput;
        uniform vec2 uTexelSize;
        uniform float uOffset;
        varying vec2 vUv;

        void main() {
          vec2 halfPix = uTexelSize * uOffset;
          vec4 sum = texture2D(tInput, vUv) * 0.5;
          sum += texture2D(tInput, vUv - halfPix) * 0.125;
          sum += texture2D(tInput, vUv + halfPix) * 0.125;
          sum += texture2D(tInput, vUv + vec2(halfPix.x, -halfPix.y)) * 0.125;
          sum += texture2D(tInput, vUv + vec2(-halfPix.x, halfPix.y)) * 0.125;
          gl_FragColor = sum;
        }
      `,
      depthTest: false,
      depthWrite: false
    });

    // 3. Dual-Kawase Upsample Shader (3x3 Tent Filter)
    this.matUp = new THREE.ShaderMaterial({
      uniforms: {
        tInput: { value: null },
        uTexelSize: { value: new THREE.Vector2() },
        uOffset: { value: 1.0 }
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D tInput;
        uniform vec2 uTexelSize;
        uniform float uOffset;
        varying vec2 vUv;

        void main() {
          vec2 d = uTexelSize * uOffset;
          vec4 sum = texture2D(tInput, vUv) * 0.25;
          sum += (texture2D(tInput, vUv + vec2(-d.x, 0.0)) +
                  texture2D(tInput, vUv + vec2( d.x, 0.0)) +
                  texture2D(tInput, vUv + vec2(0.0, -d.y)) +
                  texture2D(tInput, vUv + vec2(0.0,  d.y))) * 0.125;
          sum += (texture2D(tInput, vUv + vec2(-d.x, -d.y)) +
                  texture2D(tInput, vUv + vec2( d.x, -d.y)) +
                  texture2D(tInput, vUv + vec2(-d.x,  d.y)) +
                  texture2D(tInput, vUv + vec2( d.x,  d.y))) * 0.0625;
          gl_FragColor = sum;
        }
      `,
      depthTest: false,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
      transparent: true
    });

    // 4. Final Composite & ACESFilmic Tone Mapping Shader
    this.matComposite = new THREE.ShaderMaterial({
      uniforms: {
        tBase: { value: null },
        tBloom: { value: null },
        uBloomIntensity: { value: this.bloomIntensity },
        uExposure: { value: this.exposure }
      },
      vertexShader: /* glsl */ `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
      `,
      fragmentShader: /* glsl */ `
        uniform sampler2D tBase;
        uniform sampler2D tBloom;
        uniform float uBloomIntensity;
        uniform float uExposure;
        varying vec2 vUv;

        // ACES Filmic Tone Mapping Curve
        vec3 ACESFilmicToneMapping(vec3 color) {
          color *= uExposure;
          const float a = 2.51;
          const float b = 0.03;
          const float c = 2.43;
          const float d = 0.59;
          const float e = 0.14;
          return clamp((color * (a * color + b)) / (color * (c * color + d) + e), 0.0, 1.0);
        }

        // Linear to sRGB encoding
        vec3 LinearTosRGB(vec3 value) {
          return mix(
            pow(value, vec3(0.41666)) * 1.055 - vec3(0.055),
            value * 12.92,
            vec3(lessThanEqual(value, vec3(0.0031308)))
          );
        }

        void main() {
          vec4 base = texture2D(tBase, vUv);
          vec3 bloom = texture2D(tBloom, vUv).rgb * uBloomIntensity;
          vec3 mapped = ACESFilmicToneMapping(base.rgb + bloom);
          gl_FragColor = vec4(LinearTosRGB(mapped), 1.0);
        }
      `,
      depthTest: false,
      depthWrite: false
    });

    this.quadMesh = new THREE.Mesh(this.quadGeometry, this.matThreshold);
  }

  setSize(width, height) {
    this.rtBeauty.setSize(width, height);
    let curW = Math.max(1, Math.floor(width * 0.5));
    let curH = Math.max(1, Math.floor(height * 0.5));

    for (let i = 0; i < 3; i++) {
      this.downTargets[i].setSize(curW, curH);
      this.upTargets[i].setSize(curW, curH);
      curW = Math.max(1, Math.floor(curW * 0.5));
      curH = Math.max(1, Math.floor(curH * 0.5));
    }
  }

  render(scene, camera) {
    const gl = this.renderer;

    if (!this._enabled) {
      gl.setRenderTarget(null);
      gl.render(scene, camera);
      return;
    }

    // Step 1: Render main 3D scene to full-res HDR buffer
    gl.setRenderTarget(this.rtBeauty);
    gl.clear();
    gl.render(scene, camera);

    // Step 2: Threshold & first downsample to 0.5x
    this.quadMesh.material = this.matThreshold;
    this.matThreshold.uniforms.tInput.value = this.rtBeauty.texture;
    this.matThreshold.uniforms.uTexelSize.value.set(1.0 / this.rtBeauty.width, 1.0 / this.rtBeauty.height);
    this.matThreshold.uniforms.uThreshold.value = this.threshold;
    this.matThreshold.uniforms.uKnee.value = this.knee;
    gl.setRenderTarget(this.downTargets[0]);
    gl.render(this.quadMesh, this.quadCamera);

    // Step 3: Progressive Downsamples (0.25x and 0.125x)
    this.quadMesh.material = this.matDown;
    for (let i = 0; i < 2; i++) {
      const src = this.downTargets[i];
      const dst = this.downTargets[i + 1];
      this.matDown.uniforms.tInput.value = src.texture;
      this.matDown.uniforms.uTexelSize.value.set(1.0 / src.width, 1.0 / src.height);
      this.matDown.uniforms.uOffset.value = 1.0 + i * 0.5;
      gl.setRenderTarget(dst);
      gl.render(this.quadMesh, this.quadCamera);
    }

    // Step 4: Progressive Upsamples with Additive Blending
    this.quadMesh.material = this.matUp;
    // Copy bottom level to upTargets[1]
    gl.setRenderTarget(this.upTargets[1]);
    gl.clear();
    this.matUp.uniforms.tInput.value = this.downTargets[2].texture;
    this.matUp.uniforms.uTexelSize.value.set(1.0 / this.downTargets[2].width, 1.0 / this.downTargets[2].height);
    this.matUp.uniforms.uOffset.value = 1.5;
    gl.render(this.quadMesh, this.quadCamera);

    // Upsample to 0.5x (upTargets[0])
    gl.setRenderTarget(this.upTargets[0]);
    gl.clear();
    this.matUp.uniforms.tInput.value = this.upTargets[1].texture;
    this.matUp.uniforms.uTexelSize.value.set(1.0 / this.upTargets[1].width, 1.0 / this.upTargets[1].height);
    this.matUp.uniforms.uOffset.value = 1.0;
    gl.render(this.quadMesh, this.quadCamera);

    // Step 5: Final Composite to Screen
    gl.setRenderTarget(null);
    this.quadMesh.material = this.matComposite;
    this.matComposite.uniforms.tBase.value = this.rtBeauty.texture;
    this.matComposite.uniforms.tBloom.value = this.upTargets[0].texture;
    this.matComposite.uniforms.uBloomIntensity.value = this.bloomIntensity;
    this.matComposite.uniforms.uExposure.value = this.exposure;
    gl.render(this.quadMesh, this.quadCamera);
  }

  dispose() {
    this.rtBeauty.dispose();
    this.downTargets.forEach(t => t.dispose());
    this.upTargets.forEach(t => t.dispose());
    this.quadGeometry.dispose();
    this.matThreshold.dispose();
    this.matDown.dispose();
    this.matUp.dispose();
    this.matComposite.dispose();
  }
}
