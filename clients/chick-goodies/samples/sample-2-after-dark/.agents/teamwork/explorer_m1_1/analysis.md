# Milestone 1: Core WebGL Engine & Shaders — Technical Specification & Architecture

**Document Version:** 1.0.0-M1-SPEC  
**Author:** WebGL Shader & VideoTexture Explorer (Milestone 1)  
**Parent Conversation ID:** `057057ff-b7fd-4423-8c4e-8512f5ef961b`  
**Working Directory:** `.agents/teamwork/explorer_m1_1/`  
**Authoritative References:** `ORIGINAL_REQUEST.md`, `PROJECT.md`, `explorer_survey_3/analysis.md`, `experience.js`  

---

## 1. Executive Summary & Problem Diagnosis

### 1.1 The Core Codebase Gap
In `sample-2-after-dark/experience.js`, the scrollytelling experience currently relies on architectural patterns that violate requirement **R1** (*Living WebGL Sensory Environment*):
1. **DOM Video Swapping Behind Transparent Canvas:** Background video feeds (`img/micro-seed-720p.mp4`, `img/feast-cinematic-720p.mp4`, `img/cart-cinematic-720p.mp4`) are managed by HTML `<video id="bg-video-a">` and `<video id="bg-video-b">` elements in `index.html`. These are cross-faded using CSS opacity (`.active`), forcing the WebGL canvas to run with `alpha: true`. Consequently:
   - Video cannot interact with 3D scene lighting, candle flicker, cursor illumination, or depth buffers.
   - Video element DOM reloading (`video.load(); video.play()`) causes micro-stutters during rapid station navigation.
   - Mobile browsers frequently throttle background DOM video decoding when overlapping with WebGL canvases.
2. **Flat 2D Image Cards on Backing Boxes:** Centerpieces at each station are created via `createCenterpieceDisplay()`, which renders flat 2D textures onto un-subdivided `PlaneGeometry(width, height)` attached to obsidian boxes. There is zero tactile relief, zero organic deformation, and zero interaction with grazing light.
3. **CPU-Bound Particles:** Amber embers are updated in a JavaScript `for` loop modifying a `Float32Array` every frame (`emberGeo.attributes.position.needsUpdate = true`), triggering redundant CPU-to-GPU memory uploads.
4. **Absence of Radiant Glow (Selective Bloom):** While `ACESFilmicToneMapping` is enabled, there is no high-luminance bloom pass. Candle flames, polished copper, and honey droplets lack the warm luminous radiance benchmarked on Lusion.co and Oryzo.ai.

### 1.2 Milestone 1 Architectural Solution
This specification provides the production implementation blueprint for Milestone 1:
1. **Pure Three.js VideoTexture Architecture:** Decouple from DOM video elements entirely. Instantiate offscreen video streams mapped directly to 3D surfaces with an in-shader cinematic wipe/blend shader (`VideoBlendMaterial`).
2. **Kinetic Mesh Deformation Shaders:** Replace flat planes with subdivided, procedurally deformed meshes:
   - **Texas Wildflower Honey Viscosity Shader:** Subsurface scattering (SSS), Beer-Lambert exponential absorption, viscous surface tension ripples, and microfacet specular lobes ($n = 1.53$).
   - **Prosciutto Ribbon Wave Shader:** Analytical harmonic vertex displacement simulating razor-thin cured ham folds undulating with scroll momentum, with anisotropic sheen and translucent rim lighting.
   - **Kinetic Relief Portal Shader:** Interactive cursor-tilt inertia and Sobel normal relief for culinary still centerpieces.
3. **GPU Curl-Noise Particle Field:** Custom `ShaderMaterial` advecting 320 volumetric embers and honey micro-spores completely on the GPU via 3D Curl Noise, with pointer repulsion and zero CPU buffer streaming.
4. **Mobile-Optimized Dual-Kawase Selective Bloom:** Zero external library dependencies. Implemented via native Three.js `WebGLRenderTarget` (HalfFloatType) at 0.5x resolution with luminance thresholding and ACESFilmic composite.
5. **DPR Clamping & Performance Lock:** Clamping DPR to 1.5x (desktop) and 1.15x (mobile) to guarantee steady 60 FPS under Chromium SwiftShader and low-power mobile devices.
6. **Interface Contracts:** Expose `window.ScrollytellingEngine` while strictly preserving `window.TableState` for automated Playwright regression passes.

---

## 2. Component 1: Kinetic Mesh Deformation Shaders

Flat 2D card billboards are replaced by living, organic matter using custom GLSL shaders with subdivided geometries.

### 2.1 Texas Wildflower Honey Viscosity & Micro-Droplet Shader
Raw Texas honeycomb and amber droplets are characterized by high refractive index ($n = 1.53$), volumetric absorption (thin edges are pale gold; thick droplets are dark molasses), and viscous surface ripples.

```javascript
// Honey Viscosity Shader Material Definition
export function createHoneyViscosityMaterial() {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uHoneyColor: { value: new THREE.Color(0xfba818) },    // Vibrant amber gold
      uDeepAmber: { value: new THREE.Color(0x5a2004) },     // Deep molasses brown
      uRimColor: { value: new THREE.Color(0xffe89e) },      // Warm champagne highlight
      uLightPos: { value: new THREE.Vector3(5.0, 12.0, 8.0) },
      uCursorLightPos: { value: new THREE.Vector3(0, 0, 3) },
      uViscosity: { value: 1.0 },
      uRoughness: { value: 0.12 },
      uRefractionIndex: { value: 1.53 }
    },
    transparent: true,
    depthWrite: true,
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uViscosity;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;
      varying vec2 vUv;

      // Compact 2D hash & noise
      float hash(vec2 p) {
        return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
      }
      float noise2D(vec2 p) {
        vec2 i = floor(p);
        vec2 f = fract(p);
        vec2 u = f * f * (3.0 - 2.0 * f);
        return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
                   mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
      }

      void main() {
        vUv = uv;
        vec3 pos = position;

        // Viscous surface ripples modulated by time
        float rippleA = sin(pos.x * 6.5 + uTime * 1.4) * cos(pos.z * 6.5 + uTime * 1.1);
        float rippleB = noise2D(pos.xz * 4.0 + vec2(uTime * 0.25, uTime * 0.18)) - 0.5;
        float displacement = (rippleA * 0.02 + rippleB * 0.04) * uViscosity;

        pos += normal * displacement;

        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vWorldPosition = worldPos.xyz;

        vec4 mvPosition = viewMatrix * worldPos;
        vViewPosition = -mvPosition.xyz;
        vNormal = normalize(normalMatrix * normal);

        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uHoneyColor;
      uniform vec3 uDeepAmber;
      uniform vec3 uRimColor;
      uniform vec3 uLightPos;
      uniform vec3 uCursorLightPos;
      uniform float uRoughness;
      uniform float uRefractionIndex;
      uniform float uTime;

      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;
      varying vec2 vUv;

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewPosition);

        // Key light direction & half vector
        vec3 L = normalize(uLightPos - vWorldPosition);
        vec3 H = normalize(L + V);

        // Cursor interactive spotlight
        vec3 L_cursor = normalize(uCursorLightPos - vWorldPosition);
        vec3 H_cursor = normalize(L_cursor + V);
        float distCursor = length(uCursorLightPos - vWorldPosition);
        float cursorAtten = 1.0 / (1.0 + 0.18 * distCursor * distCursor);

        // Schlick Fresnel approximation for honey (n = 1.53, F0 ~ 0.044)
        float F0 = pow((uRefractionIndex - 1.0) / (uRefractionIndex + 1.0), 2.0);
        float NdotV = clamp(dot(N, V), 0.0, 1.0);
        float fresnel = F0 + (1.0 - F0) * pow(1.0 - NdotV, 4.5);

        // Microfacet Specular Lobes
        float NdotH = max(dot(N, H), 0.0);
        float specKey = pow(NdotH, 140.0) * 3.2;

        float NdotH_cur = max(dot(N, H_cursor), 0.0);
        float specCursor = pow(NdotH_cur, 90.0) * 2.5 * cursorAtten;

        // Subsurface Absorption (Beer-Lambert exponential law)
        // Thin edges let light pass as pure gold; thick center absorbs to deep molasses
        float opticalDepth = smoothstep(0.0, 1.0, 1.0 - abs(dot(N, vec3(0.0, 1.0, 0.0))));
        vec3 absorption = mix(uHoneyColor, uDeepAmber, opticalDepth * 0.88);

        // Backlight SSS translucency
        float backScatter = pow(max(dot(V, -L), 0.0), 2.5) * 0.7;
        vec3 sssColor = uHoneyColor * (backScatter + 0.35);

        // Composite lighting
        vec3 baseColor = absorption + sssColor;
        vec3 specularHighlights = (vec3(specKey) + vec3(specCursor) * vec3(1.0, 0.85, 0.6)) * uRimColor;
        vec3 finalColor = mix(baseColor, uRimColor, fresnel * 0.65) + specularHighlights;

        gl_FragColor = vec4(finalColor, 0.94);
      }
    `
  });
}
```

### 2.2 Prosciutto Ribbon Kinetic Undulation Shader
Shaved San Daniele prosciutto folded into artisan florets curves over the board. This shader applies continuous harmonic wave undulation driven by scroll velocity and time, complete with cured ruby muscle fibers and translucent creamy fat marbling.

```javascript
// Prosciutto Ribbon Shader Material Definition
export function createProsciuttoRibbonMaterial(opts = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScrollSpeed: { value: 0 },
      uLeanColor: { value: new THREE.Color(0xb82e38) },      // Cured ruby lean
      uFatColor: { value: new THREE.Color(0xf5eedc) },       // Translucent silky fat
      uSheenColor: { value: new THREE.Color(0xffd1ba) },     // Fibrous sheen
      uLightPos: { value: new THREE.Vector3(5.0, 12.0, 8.0) }
    },
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uScrollSpeed;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vec3 pos = position;

        // Kinetic Ribbon Curvature Equation
        float wavePhase = uv.x * 7.5 + uTime * 1.5 + uScrollSpeed * 12.0;
        float ribbonFoldZ = sin(wavePhase) * 0.085 + cos(uv.y * 5.2 - uTime * 0.7) * 0.045;
        float ribbonFoldY = cos(wavePhase * 0.6) * 0.03;

        pos.z += ribbonFoldZ;
        pos.y += ribbonFoldY;

        // Analytical normal perturbation
        float dZdx = cos(wavePhase) * 7.5 * 0.085;
        vec3 tangent = normalize(vec3(1.0, 0.0, dZdx));
        vec3 bitangent = vec3(0.0, 1.0, 0.0);
        vec3 calculatedNormal = normalize(cross(tangent, bitangent));

        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vWorldPosition = worldPos.xyz;

        vec4 mvPosition = viewMatrix * worldPos;
        vViewPosition = -mvPosition.xyz;
        vNormal = normalize(normalMatrix * calculatedNormal);

        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform vec3 uLeanColor;
      uniform vec3 uFatColor;
      uniform vec3 uSheenColor;
      uniform vec3 uLightPos;
      uniform float uTime;

      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;
      varying vec2 vUv;

      float hash1(vec2 p) {
        return fract(sin(dot(p, vec2(41.1, 289.7))) * 45758.5453);
      }

      void main() {
        vec3 N = normalize(vNormal);
        vec3 V = normalize(vViewPosition);
        vec3 L = normalize(uLightPos - vWorldPosition);

        // Procedural Marbling (cured muscle striations vs fat ribbons)
        float striation = sin(vUv.x * 48.0 + sin(vUv.y * 18.0) * 3.5);
        float microGrain = hash1(floor(vUv * vec2(280.0, 40.0))) * 0.12;
        float fatMask = smoothstep(0.35, 0.65, striation + microGrain);

        vec3 albedo = mix(uLeanColor, uFatColor, fatMask);

        // Anisotropic silky sheen along cured meat fibers
        vec3 fiberTangent = normalize(vec3(1.0, 0.0, 0.0));
        vec3 H = normalize(L + V);
        float dotTH = dot(fiberTangent, H);
        float anisoSin = sqrt(max(0.0, 1.0 - dotTH * dotTH));
        float anisoSpec = pow(anisoSin, 24.0) * 1.8;

        // Warm subsurface glow when backlit
        float backScatter = pow(max(dot(V, -L), 0.0), 3.0) * 0.55;
        vec3 diffuse = albedo * (max(dot(N, L), 0.0) + 0.32) + (uLeanColor * backScatter);

        vec3 color = diffuse + uSheenColor * anisoSpec;
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });
}
```

### 2.3 Kinetic Relief Portal Shader (Station Displays)
For the centerpiece displays at Stations 1–4, the flat 2D image plane is replaced by a tessellated relief mesh (`PlaneGeometry(width, height, 48, 48)`). The mesh responds elastically to pointer motion, with dynamic surface relief normal perturbation:

```javascript
export function createReliefPortalMaterial(texture, opts = {}) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uMap: { value: texture },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uScrollSpeed: { value: 0 },
      uLightPos: { value: new THREE.Vector3(5.0, 12.0, 8.0) },
      uCursorLightPos: { value: new THREE.Vector3(0, 0, 3) },
      uReliefScale: { value: opts.reliefScale || 0.06 }
    },
    vertexShader: /* glsl */ `
      uniform vec2 uPointer;
      uniform float uScrollSpeed;
      uniform float uReliefScale;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;

      void main() {
        vUv = uv;
        vec3 pos = position;

        // Kinetic Convex Lens Curvature
        float dome = (1.0 - 4.0 * pow(uv.x - 0.5, 2.0)) * (1.0 - 4.0 * pow(uv.y - 0.5, 2.0));
        pos.z += max(0.0, dome) * uReliefScale;

        // Pointer Parallax Tilting on vertices
        vec2 pDist = uv - (uPointer * 0.5 + 0.5);
        pos.z -= length(pDist) * 0.035;

        vec4 worldPos = modelMatrix * vec4(pos, 1.0);
        vWorldPosition = worldPos.xyz;

        vec4 mvPosition = viewMatrix * worldPos;
        vViewPosition = -mvPosition.xyz;
        vNormal = normalize(normalMatrix * normal);

        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uMap;
      uniform vec3 uLightPos;
      uniform vec3 uCursorLightPos;
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec3 vWorldPosition;

      void main() {
        // Luminance-derived Sobel Normal Approximation
        float texel = 1.0 / 1024.0;
        float lumL = dot(texture2D(uMap, vUv - vec2(texel, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
        float lumR = dot(texture2D(uMap, vUv + vec2(texel, 0.0)).rgb, vec3(0.299, 0.587, 0.114));
        float lumD = dot(texture2D(uMap, vUv - vec2(0.0, texel)).rgb, vec3(0.299, 0.587, 0.114));
        float lumU = dot(texture2D(uMap, vUv + vec2(0.0, texel)).rgb, vec3(0.299, 0.587, 0.114));

        vec3 bumpNormal = normalize(vec3((lumL - lumR) * 2.2, (lumD - lumU) * 2.2, 1.0));
        vec3 N = normalize(vNormal + bumpNormal * 0.35);

        vec3 V = normalize(vViewPosition);
        vec3 L = normalize(uLightPos - vWorldPosition);
        vec3 L_cursor = normalize(uCursorLightPos - vWorldPosition);

        vec4 texColor = texture2D(uMap, vUv);

        // Grazing keylight & interactive cursor light
        float diff = max(dot(N, L), 0.0) * 0.85 + 0.35;
        float diffCursor = max(dot(N, L_cursor), 0.0) * 0.65;

        vec3 H = normalize(L + V);
        float spec = pow(max(dot(N, H), 0.0), 32.0) * 0.28;

        vec3 finalColor = texColor.rgb * (diff + diffCursor) + vec3(spec);
        gl_FragColor = vec4(finalColor, texColor.a);
      }
    `
  });
}
```

---

## 3. Component 2: Pure Three.js VideoTexture & In-Shader Blending

### 3.1 Architectural Shift from DOM `<video>`
Milestone 1 eliminates `#cinematic-backdrop`, `bgVideoA`, and `bgVideoB` from the DOM. Instead:
1. Video streams are loaded strictly into detached off-DOM `HTMLVideoElement` instances managed by a unified `VideoTextureManager`.
2. Videos are sampled in WebGL as `THREE.VideoTexture`.
3. Station transitions execute via an in-shader cinematic dissolve shader (`VideoBlendMaterial`) rendered on a curved background stage in the 3D scene.

### 3.2 VideoTexture Lifecycle Manager
```javascript
export class VideoTextureManager {
  constructor() {
    this.videoElements = {};
    this.videoTextures = {};
    this.currentSrc = null;
    this.targetSrc = null;
    this.transitionProgress = 1.0;
  }

  loadStream(key, url) {
    if (this.videoElements[key]) return this.videoTextures[key];

    const video = document.createElement('video');
    video.src = url;
    video.crossOrigin = 'anonymous';
    video.loop = true;
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    // Silent autoplay catch
    video.play().catch(() => {});

    const texture = new THREE.VideoTexture(video);
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;

    this.videoElements[key] = video;
    this.videoTextures[key] = texture;
    return texture;
  }

  transitionTo(sourceKey, targetKey, durationMs = 1200) {
    if (!this.videoElements[sourceKey] || !this.videoElements[targetKey]) return;

    // Wake target video
    this.videoElements[targetKey].play().catch(() => {});
    this.transitionProgress = 0.0;
    this.startTime = performance.now();
    this.duration = durationMs;
  }

  update() {
    if (this.transitionProgress < 1.0) {
      const now = performance.now();
      this.transitionProgress = Math.min(1.0, (now - this.startTime) / this.duration);
    }
    return this.transitionProgress;
  }
}
```

### 3.3 In-Shader Video Blending & Transition Shader (`VideoBlendMaterial`)
Instead of a simple linear cross-fade, this shader performs a luxury culinary dissolve:
- **Luminance Wipe:** Bright highlights (sparks, candlelight) bleed through first.
- **Amber Border Burn:** The moving boundary is outlined by an emissive amber glow (`vec3(1.0, 0.75, 0.2)`).
- **Chromatic Aberration:** During mid-transition ($uProgress \approx 0.5$), subtle chromatic dispersion accentuates the momentum of the camera move.

```javascript
export function createVideoBlendMaterial(texA, texB) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uTexA: { value: texA },
      uTexB: { value: texB },
      uProgress: { value: 0.0 },
      uTime: { value: 0.0 },
      uVignetteStrength: { value: 0.42 }
    },
    side: THREE.DoubleSide,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        // Subtle cylindrical curvature so background wraps around the banquet
        vec3 pos = position;
        pos.z -= pow(uv.x - 0.5, 2.0) * 1.8;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      uniform sampler2D uTexA;
      uniform sampler2D uTexB;
      uniform float uProgress;
      uniform float uTime;
      uniform float uVignetteStrength;
      varying vec2 vUv;

      void main() {
        // Chromatic Aberration mid-transition
        float chromaOffset = sin(uProgress * 3.14159) * 0.012;
        vec2 uvR = vUv + vec2(chromaOffset, 0.0);
        vec2 uvB = vUv - vec2(chromaOffset, 0.0);

        vec4 colA = vec4(
          texture2D(uTexA, uvR).r,
          texture2D(uTexA, vUv).g,
          texture2D(uTexA, uvB).b,
          1.0
        );

        vec4 colB = vec4(
          texture2D(uTexB, uvR).r,
          texture2D(uTexB, vUv).g,
          texture2D(uTexB, uvB).b,
          1.0
        );

        // Luminance-weighted dissolution
        float lumB = dot(colB.rgb, vec3(0.299, 0.587, 0.114));
        float threshold = uProgress * 1.3 - 0.15;
        float mask = smoothstep(threshold - 0.15, threshold + 0.15, lumB + (vUv.x * 0.2 - 0.1));

        // Burning Amber Boundary Glow
        float edge = exp(-pow((lumB - threshold) * 8.0, 2.0));
        vec3 edgeGlow = vec3(1.0, 0.68, 0.18) * edge * 2.2 * sin(uProgress * 3.14159);

        vec3 mixedColor = mix(colA.rgb, colB.rgb, mask) + edgeGlow;

        // Rich Warm Vignette & Espresso Shadows
        float vig = 1.0 - length(vUv - 0.5) * uVignetteStrength;
        vec3 graded = mix(vec3(0.08, 0.04, 0.03), mixedColor, clamp(vig, 0.0, 1.0));

        gl_FragColor = vec4(graded, 1.0);
      }
    `
  });
}
```

---

## 4. Component 3: GPU Curl-Noise Particle Field

Replacing the CPU-updated `Float32Array` ember system with a pure GPU vertex-shader Curl-Noise particle simulation eliminates 100% of buffer memory streaming across the PCIe bus.

```javascript
export function createGpuEmberField(count = 320) {
  const geo = new THREE.BufferGeometry();
  const basePos = new Float32Array(count * 3);
  const velocity = new Float32Array(count * 3);
  const scale = new Float32Array(count);
  const color = new Float32Array(count * 3);

  const PALETTE = [
    new THREE.Color(0xff8a24), // amber
    new THREE.Color(0xffbe55), // warm gold
    new THREE.Color(0xff5511), // copper
    new THREE.Color(0xffe6a3)  // champagne
  ];

  for (let i = 0; i < count; i++) {
    basePos[i * 3 + 0] = (Math.random() - 0.1) * 54.0;
    basePos[i * 3 + 1] = (Math.random() - 0.5) * 8.0;
    basePos[i * 3 + 2] = (Math.random() - 0.5) * 12.0;

    velocity[i * 3 + 0] = (Math.random() - 0.5) * 0.3;
    velocity[i * 3 + 1] = 0.25 + Math.random() * 0.45; // upward buoyancy
    velocity[i * 3 + 2] = (Math.random() - 0.5) * 0.3;

    scale[i] = 0.035 + Math.random() * 0.045;

    const col = PALETTE[Math.floor(Math.random() * PALETTE.length)];
    color[i * 3 + 0] = col.r;
    color[i * 3 + 1] = col.g;
    color[i * 3 + 2] = col.b;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(basePos, 3));
  geo.setAttribute('aVelocity', new THREE.BufferAttribute(velocity, 3));
  geo.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
  geo.setAttribute('aColor', new THREE.BufferAttribute(color, 3));

  const mat = new THREE.ShaderMaterial({
    uniforms: {
      uTime: { value: 0 },
      uScrollSpeed: { value: 0 },
      uPointer: { value: new THREE.Vector3(0, 0, 0) },
      uRepulsionRadius: { value: 2.8 }
    },
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexShader: /* glsl */ `
      uniform float uTime;
      uniform float uScrollSpeed;
      uniform vec3 uPointer;
      uniform float uRepulsionRadius;

      attribute vec3 aVelocity;
      attribute float aScale;
      attribute vec3 aColor;

      varying vec3 vColor;
      varying float vAlpha;

      vec3 curlNoise(vec3 p) {
        const float e = 0.08;
        // Fast analytical harmonic approximation of curl(v)
        float x = (sin(p.y + e) - sin(p.y - e)) - (cos(p.z + e) - cos(p.z - e));
        float y = (sin(p.z + e) - sin(p.z - e)) - (cos(p.x + e) - cos(p.x - e));
        float z = (sin(p.x + e) - sin(p.x - e)) - (cos(p.y + e) - cos(p.y - e));
        return normalize(vec3(x, y, z));
      }

      void main() {
        vec3 pos = position;

        // Upward buoyancy loop
        float loopY = mod(pos.y + uTime * aVelocity.y, 8.0) - 4.0;
        pos.y = loopY;

        // Curl noise advection
        vec3 curl = curlNoise(pos * 0.12 + vec3(0.0, uTime * 0.1, 0.0));
        pos += curl * (0.35 + abs(uScrollSpeed) * 1.5);

        // Pointer radial repulsion in world space
        vec3 delta = pos - uPointer;
        float dist = length(delta);
        if (dist < uRepulsionRadius) {
          pos += (delta / max(dist, 0.01)) * (uRepulsionRadius - dist) * 0.45;
        }

        vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
        gl_PointSize = aScale * (220.0 / -mvPosition.z) * (1.0 + abs(uScrollSpeed) * 0.7);
        gl_Position = projectionMatrix * mvPosition;

        vColor = aColor;
        vAlpha = smoothstep(-mvPosition.z, 0.5, 9.0) * 0.85;
      }
    `,
    fragmentShader: /* glsl */ `
      varying vec3 vColor;
      varying float vAlpha;

      void main() {
        // Soft gaussian circle particle mask
        float r = length(gl_PointCoord - vec2(0.5));
        if (r > 0.5) discard;

        float alpha = smoothstep(0.5, 0.04, r) * vAlpha;
        gl_FragColor = vec4(vColor * 1.6, alpha);
      }
    `
  });

  return new THREE.Points(geo, mat);
}
```

---

## 5. Component 4: Mobile-Optimized Dual-Kawase Selective Bloom

### 5.1 Architecture & Render Target Pipeline
To deliver radiant champagne highlights without running 10 full-screen blits (which drops frames on mobile), we implement a self-contained, 2-Pass Half-Resolution Selective Bloom pipeline:

```
┌────────────────────────────────────────────────────────────────────────┐
│                        BLOOM POST-PROCESSING PASS                      │
├────────────────────────────────────────────────────────────────────────┤
│ 1. Scene HDR Render Target (HalfFloatType, DPR Clamped)                │
│    └─► Full beauty pass rendered to offscreen FBO                      │
│ 2. High-Luminance Downsample Target (0.5x Resolution)                  │
│    └─► Isolates pixels with luminance > 0.82 (candle flames, copper)   │
│ 3. Dual-Kawase Diagonal Blur Target (0.5x / 0.25x Resolution)          │
│    └─► 4-tap diagonal offset blit creates broad luxury glow halo       │
│ 4. Composite Screen Pass                                               │
│    └─► Additive blend (Beauty + Bloom * 0.65) + ACESFilmic Tone Map   │
└────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Implementation Specification
```javascript
export class SelectiveBloomPipeline {
  constructor(renderer, width, height) {
    this.renderer = renderer;
    this.width = width;
    this.height = height;

    const pars = {
      type: THREE.HalfFloatType,
      format: THREE.RGBAFormat,
      minFilter: THREE.LinearFilter,
      magFilter: THREE.LinearFilter
    };

    // 1. Beauty buffer
    this.rtScene = new THREE.WebGLRenderTarget(width, height, pars);
    // 2. High luminance buffer (half-resolution)
    this.rtBright = new THREE.WebGLRenderTarget(Math.floor(width * 0.5), Math.floor(height * 0.5), pars);
    // 3. Blur buffer
    this.rtBlur = new THREE.WebGLRenderTarget(Math.floor(width * 0.5), Math.floor(height * 0.5), pars);

    this.fsQuadGeo = new THREE.PlaneGeometry(2, 2);
    this.fsCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);

    // Extraction Material
    this.matExtract = new THREE.ShaderMaterial({
      uniforms: {
        tInput: { value: this.rtScene.texture },
        uThreshold: { value: 0.82 },
        uBoost: { value: 1.8 }
      },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: `
        uniform sampler2D tInput;
        uniform float uThreshold;
        uniform float uBoost;
        varying vec2 vUv;
        void main() {
          vec4 col = texture2D(tInput, vUv);
          float lum = dot(col.rgb, vec3(0.2126, 0.7152, 0.0722));
          vec3 bright = max(vec3(0.0), col.rgb - vec3(uThreshold)) * uBoost;
          gl_FragColor = vec4(bright, 1.0);
        }
      `
    });

    // Dual-Kawase Diagonal Blur Material
    this.matBlur = new THREE.ShaderMaterial({
      uniforms: {
        tInput: { value: this.rtBright.texture },
        uTexelSize: { value: new THREE.Vector2(1.0 / (width * 0.5), 1.0 / (height * 0.5)) },
        uOffset: { value: 2.5 }
      },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: `
        uniform sampler2D tInput;
        uniform vec2 uTexelSize;
        uniform float uOffset;
        varying vec2 vUv;
        void main() {
          vec2 d = uTexelSize * uOffset;
          vec4 col = texture2D(tInput, vUv + vec2(-d.x, -d.y)) * 0.25;
          col += texture2D(tInput, vUv + vec2( d.x, -d.y)) * 0.25;
          col += texture2D(tInput, vUv + vec2(-d.x,  d.y)) * 0.25;
          col += texture2D(tInput, vUv + vec2( d.x,  d.y)) * 0.25;
          gl_FragColor = col;
        }
      `
    });

    // Final Composite & ACESFilmic Tone Mapping Material
    this.matComposite = new THREE.ShaderMaterial({
      uniforms: {
        tScene: { value: this.rtScene.texture },
        tBloom: { value: this.rtBlur.texture },
        uBloomIntensity: { value: 0.65 },
        uExposure: { value: 1.30 }
      },
      vertexShader: `varying vec2 vUv; void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }`,
      fragmentShader: `
        uniform sampler2D tScene;
        uniform sampler2D tBloom;
        uniform float uBloomIntensity;
        uniform float uExposure;
        varying vec2 vUv;

        // ACES Filmic Tone Mapping approximation
        vec3 ACESFilmicToneMapping(vec3 color) {
          color *= uExposure;
          float a = 2.51; float b = 0.03; float c = 2.43; float d = 0.59; float e = 0.14;
          return clamp((color * (a * color + b)) / (color * (c * color + d) + e), 0.0, 1.0);
        }

        void main() {
          vec3 base = texture2D(tScene, vUv).rgb;
          vec3 glow = texture2D(tBloom, vUv).rgb;
          vec3 combined = base + glow * uBloomIntensity;
          gl_FragColor = vec4(ACESFilmicToneMapping(combined), 1.0);
        }
      `
    });

    this.quad = new THREE.Mesh(this.fsQuadGeo, this.matExtract);
    this.fsScene = new THREE.Scene();
    this.fsScene.add(this.quad);
  }

  setSize(width, height) {
    this.width = width;
    this.height = height;
    this.rtScene.setSize(width, height);
    this.rtBright.setSize(Math.floor(width * 0.5), Math.floor(height * 0.5));
    this.rtBlur.setSize(Math.floor(width * 0.5), Math.floor(height * 0.5));
    this.matBlur.uniforms.uTexelSize.value.set(1.0 / (width * 0.5), 1.0 / (height * 0.5));
  }

  render(mainScene, mainCamera) {
    // 1. Render main scene to HDR FBO
    this.renderer.setRenderTarget(this.rtScene);
    this.renderer.render(mainScene, mainCamera);

    // 2. High luminance extraction
    this.quad.material = this.matExtract;
    this.matExtract.uniforms.tInput.value = this.rtScene.texture;
    this.renderer.setRenderTarget(this.rtBright);
    this.renderer.render(this.fsScene, this.fsCamera);

    // 3. Diagonal Blur pass
    this.quad.material = this.matBlur;
    this.matBlur.uniforms.tInput.value = this.rtBright.texture;
    this.renderer.setRenderTarget(this.rtBlur);
    this.renderer.render(this.fsScene, this.fsCamera);

    // 4. Final Composite to Screen
    this.quad.material = this.matComposite;
    this.matComposite.uniforms.tScene.value = this.rtScene.texture;
    this.matComposite.uniforms.tBloom.value = this.rtBlur.texture;
    this.renderer.setRenderTarget(null);
    this.renderer.render(this.fsScene, this.fsCamera);
  }
}
```

---

## 6. Component 5: Step-by-Step Integration Plan for `experience.js`

To implement Milestone 1 smoothly, the changes must follow an exact phased sequence:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        MILESTONE 1 CODE TRANSFORMATION ROADMAP                         │
├────────────────────────────────────────────────────────────────────────────────────────┤
│  STEP 1: DPR Clamping & Renderer Setup                                                 │
│  ├── Set max DPR: desktop Math.min(DPR, 1.5), mobile Math.min(DPR, 1.15)               │
│  └── Initialize SelectiveBloomPipeline with rtScene, rtBright, rtBlur                  │
│                                                                                        │
│  STEP 2: Pure WebGL VideoTexture Ingestion                                             │
│  ├── Instantiate VideoTextureManager for off-DOM video streams                         │
│  ├── Construct 3D curved cyclorama backdrop with VideoBlendMaterial                    │
│  └── Deprecate / bypass updateVideoBackdrop DOM element swaps                          │
│                                                                                        │
│  STEP 3: Centerpiece Upgrade with Kinetic Deformed Shaders                             │
│  ├── Station 0: HoneyViscosityMaterial + ProsciuttoRibbonMaterial                      │
│  ├── Stations 1–4: ReliefPortalMaterial with Sobel normals & pointer tilt              │
│  └── Connect uniform updates (uTime, uScrollSpeed, uPointer) in animate()              │
│                                                                                        │
│  STEP 4: GPU Curl-Noise Particle Field                                                 │
│  ├── Replace CPU ember Float32Array loop with createGpuEmberField()                    │
│  └── Eliminate emberGeo.attributes.position.needsUpdate = true                         │
│                                                                                        │
│  STEP 5: Pre-compilation Warmup & Interface Contracts                                  │
│  ├── Execute renderer.compile(scene, camera) prior to first active frame               │
│  ├── Mount window.ScrollytellingEngine (setProgress, jumpToStation, chapterChange)    │
│  └── Retain window.TableState for 100% backward compatibility with Playwright suite    │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 6.1 DPR Clamping Configuration
In `experience.js`:
```javascript
const isMobile = window.innerWidth < 900;
const maxDpr = isMobile ? 1.15 : 1.5;
renderer.setPixelRatio(Math.min(window.devicePixelRatio, maxDpr));
```

### 6.2 Pre-compilation Warmup (Zero Scroll Jitter)
Scrollytelling stutter on first scroll is caused by synchronous GPU pipeline compilation when new meshes enter the camera frustum. We eliminate this with a synchronous warmup pass:
```javascript
function warmupEngine(scene, camera, renderer) {
  renderer.compile(scene, camera);
  // Perform an offscreen pre-render
  renderer.render(scene, camera);
}
```

### 6.3 Interface Contract Synchronization
To satisfy `PROJECT.md` line 90–98 while guaranteeing that `test_3d_experience.py` passes with zero regressions:
```javascript
// New Authoritative Contract (M1 ↔ M2)
window.ScrollytellingEngine = {
  setProgress: (progress) => {
    targetProgress = Math.max(0, Math.min(1, progress));
  },
  jumpToStation: (index) => {
    setStation(index);
    window.dispatchEvent(new CustomEvent('chapterChange', { detail: { chapterIndex: index } }));
  },
  getProgress: () => currentProgress,
  getActiveStation: () => currentStation
};

// Preserved Legacy Contract for Playwright Test Suite
window.TableState = {
  goTo: (idx, instant = false) => setStation(idx, instant),
  getChapter: () => currentStation,
  setGuests: (n) => {
    if (inputGuests) {
      inputGuests.value = n;
      updateQuote();
    }
  },
  focusHotspot: (index) => {
    const hp = interactiveHotspots[index];
    if (hp && hp.userData.info) {
      setStation(hp.userData.info.station, true);
      showSpatialHUD(hp, hp.userData.info);
    }
  },
  clickHotspot: (index) => {
    const hp = interactiveHotspots[index];
    if (hp && hp.userData.info) {
      setStation(hp.userData.info.station, true);
      showSpatialHUD(hp, hp.userData.info);
      if (hp.userData.info.onClick) hp.userData.info.onClick();
    }
  }
};
```

---

## 7. Performance Budget & Verification Criteria

| Metric | Target | Verification Method |
|---|---|---|
| **Frame Rate** | 60 FPS locked | Chromium DevTools Performance Profiler & Playwright frame timestamps |
| **Draw Calls** | $\le 32$ total draw calls | WebGL Inspector / `renderer.info.render.calls` |
| **Memory Bandwidth** | 0 CPU buffer streaming | Particle position updates executed on GPU via `uTime` uniform |
| **Shader Compilation** | 0 frames dropped on scroll | Synchronous `renderer.compile()` warmup pass |
| **Console Errors** | 0 errors | Playwright console error listener in `test_3d_experience.py` |
| **Failed Requests** | 0 failed network requests | Playwright requestfailed listener in `test_3d_experience.py` |
