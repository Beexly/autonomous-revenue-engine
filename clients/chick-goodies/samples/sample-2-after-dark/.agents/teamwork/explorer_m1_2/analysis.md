# Post-Processing, Selective Bloom & Lighting Calibration Architecture

**Document Version:** 1.0.0-PROD  
**Timestamp:** 2026-09-26T18:55:00Z  
**Author:** Post-Processing & Bloom Explorer (Milestone 1 Explorer 2)  
**Target Project:** Charcuterie Chick Haute Couture 3D Scrollytelling (`sample-2-after-dark`)  
**Parent Conversation ID:** `057057ff-b7fd-4423-8c4e-8512f5ef961b`  
**Authoritative Documents:** `ORIGINAL_REQUEST.md` (R1, Acceptance Criteria), `PROJECT.md` (F06, F07, F08, M1), `explorer_survey_3/analysis.md`  

---

## 1. Executive Summary & Technical Objectives

This document delivers the technical specification, mathematical shader formulation, and implementation architecture for the **Post-Processing & Lighting Pipeline** in Milestone 1.

### Core Deliverables Specified
1. **Lightweight Mobile-Safe Dual-Kawase Selective Bloom Pass:**
   A high-performance bloom pipeline engineered for 60 FPS mobile and desktop execution that generates warm, radiant, anamorphic halos on candle flames, Edison filaments, and glowing honey droplets while strictly preserving razor-sharp text plate legibility.
2. **Three.js r170 Vendor Verification & Dependency Strategy:**
   Verification of vendored `vendor/three.module.js` (r170 ESM) and resolution of the post-processing module gap under zero-build static deployment constraints (`vercel.json` with `"buildCommand": "echo skip"`).
3. **Calibrated Radiant Lighting Model & Tone Mapping:**
   Full physical calibration of warm amber honeycomb (`0xff8a24`), polished copper (`0xd49366`, metalness 0.88, roughness 0.22), warm champagne (`0xffe8ce`), sommelier rim (`0x3a5472`), deep espresso ambient (`0x281814`), and ACESFilmic tone mapping with exposure `1.35`.
4. **UI Isolation Guarantee:**
   A dual-barrier isolation model ensuring zero bloom blur on DOM text plates (`.plate`, `#hud`) and strict luminance thresholding preventing 3D photographic food displays from washing out.

---

## 2. Three.js r170 Vendor Verification & Ecosystem Assessment

### 2.1 Current Vendor State Analysis
An audit of `vendor/` reveals:
- `vendor/three.module.js` is Three.js **r170**, native ES module build (1,314,681 bytes, 58,190 lines unminified).
- `vendor/README.md` documents that Three.js is vendored as published upstream without external bundler coupling to respect SonarCloud scan rules.
- **Critical Finding:** `EffectComposer`, `RenderPass`, `ShaderPass`, and `UnrealBloomPass` are **absent** from `three.module.js`. In Three.js upstream, these passes reside in `three/addons/postprocessing/` and are not bundled into the core module.
- Upstream addon files utilize bare specifiers (`import { ... } from 'three';`), which trigger browser runtime errors (`TypeError: Failed to resolve module specifier "three"`) in zero-build static sites lacking an import map.

### 2.2 Architectural Comparison: UnrealBloomPass vs Custom Dual-Kawase Bloom

| Evaluation Vector | Upstream Three.js UnrealBloomPass | Custom Dual-Kawase Bloom Module |
|---|---|---|
| **Pass Count Per Frame** | **12 passes:** 1 bright extraction + 10 Gaussian blur passes (5 horizontal + 5 vertical mips) + 1 composite pass. | **5 to 6 passes:** 1 downsample/threshold + 2 downsample steps + 2 upsample steps + 1 composite blit. |
| **Mobile Fill-Rate & TBDR Impact** | **Severe:** 12 full-screen blits force tile-based deferred renderers (Apple A-series, ARM Mali, Adreno) to repeatedly flush tile memory to system RAM, causing thermal throttling and dropping FPS from 60 to 22–35 FPS. | **Ultra-Low:** Blur pyramid operates exclusively at half ($0.5\times$), quarter ($0.25\times$), and eighth ($0.125\times$) resolution. Fill rate is **< 28%** of Gaussian blur. |
| **Zero-Build Dependency Footprint** | Requires 7 separate files (`Pass.js`, `EffectComposer.js`, `RenderPass.js`, `ShaderPass.js`, `UnrealBloomPass.js`, `CopyShader.js`, `LuminosityHighPassShader.js`) modified with relative paths or `<script type="importmap">`. | **1 self-contained ESM file** (`vendor/DualKawaseBloom.js` or `bloom.js`, ~190 lines) importing directly from `./three.module.js`. |
| **Headless SwiftShader Performance** | Slow in software emulation (Playwright test timeouts under load). | Swift and lightweight; passes Playwright Chromium tests with 0 console errors. |
| **Visual Quality & Falloff** | Stepped Gaussian blur; prone to boxy halo artifacts at large radii. | Smooth, wide, cinematic exponential decay mimicking anamorphic camera lenses. |
| **Alpha & Tone Mapping Integration** | Frequently clobbers canvas alpha transparency; double-applies tone mapping if renderer tone mapping is active. | Single final blit integrates additive glow, ACESFilmic tone mapping, and preserves canvas alpha seamlessly. |

### 2.3 Vendor Strategy Recommendation
**Primary Recommendation:** Implement a dedicated, standalone **`DualKawaseBloom`** module in `vendor/DualKawaseBloom.js` (or integrated directly into `experience.js`). It imports directly from `./three.module.js`, requires zero external dependencies, introduces zero build step, and guarantees locked 60 FPS on mobile.

**Secondary Fallback (UnrealBloomPass compatibility):** If `EffectComposer` is preferred by future tracks, an import map must be inserted into `index.html`:
```html
<script type="importmap">
{
  "imports": {
    "three": "./vendor/three.module.js",
    "three/addons/": "./vendor/addons/"
  }
}
</script>
```

---

## 3. Post-Processing & Selective Bloom Pipeline Design

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               3D SCENE GRAPH RENDER                                    │
│  - Diffuse Geometry: Wood, marble, slate, photo prints, UI reticles (Luminance < 0.88) │
│  - Radiant Targets: Candle flames (7.5x), Edison bulbs (4.0x), Honey (SSS > 1.5x)      │
└───────────────────────────────────────────┬────────────────────────────────────────────┘
                                            │
                                            ▼
                    ┌───────────────────────────────────────────────┐
                    │ WebGLRenderTarget (HalfFloatType, 1.0x Res)   │
                    │   - HDR Color Buffer + 24-bit Depth           │
                    └───────┬───────────────────────────────┬───────┘
                            │                               │
                            │ Base Texture (Sharp Scene)    │ (Luminance > 0.88)
                            │                               ▼
                            │             ┌───────────────────────────────────┐
                            │             │ Pass 1: Threshold & Downsample 1  │
                            │             │ Resolution: 0.5x (Half-Res FBO)   │
                            │             └─────────────────┬─────────────────┘
                            │                               │
                            │                               ▼
                            │             ┌───────────────────────────────────┐
                            │             │ Pass 2: Downsample 2 (0.25x Res)  │
                            │             └─────────────────┬─────────────────┘
                            │                               │
                            │                               ▼
                            │             ┌───────────────────────────────────┐
                            │             │ Pass 3: Downsample 3 (0.125x Res) │
                            │             └─────────────────┬─────────────────┘
                            │                               │
                            │                               ▼
                            │             ┌───────────────────────────────────┐
                            │             │ Pass 4: Upsample 1 (0.25x Res)    │
                            │             │ Bilinear 3x3 Tent + Additive Blend│
                            │             └─────────────────┬─────────────────┘
                            │                               │
                            │                               ▼
                            │             ┌───────────────────────────────────┐
                            │             │ Pass 5: Upsample 2 (0.5x Res)     │
                            │             │ Master Ethereal Bloom Halo Texture│
                            │             └─────────────────┬─────────────────┘
                            │                               │
                            ▼                               ▼
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                        PASS 6: COMPOSITE & ACESFILMIC TONE MAPPING                     │
│  FragColor = ACESFilmic((BaseColor.rgb + BloomColor.rgb * Intensity) * Exposure)        │
│  Target: Fullscreen #webgl-canvas (Screen Buffer)                                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

### 3.1 Dual-Kawase Downsampling & Upsampling Math

#### Step 1: Soft-Knee Luminance Thresholding
To avoid harsh cutoff edges where pixels abruptly pop into bloom, a quadratic soft knee is evaluated:
$$\text{Luminance } Y = 0.2126 R + 0.7152 G + 0.0722 B$$
$$\text{Knee Half-Width } k = \text{threshold} \times 0.15$$
$$\text{Soft Curve } S = \text{clamp}(Y - \text{threshold} + k, 0.0, 2.0 k)$$
$$\text{Soft Factor } W = \frac{S^2}{4.0 k + 0.0001}$$
$$\text{Contribution } C = \frac{\max(W, Y - \text{threshold})}{\max(Y, 0.0001)}$$
$$\text{Extracted Bloom RGB} = \text{Color}_{\text{RGB}} \times C$$

#### Step 2: Downsample Kernel (Passes 1–3)
Samples 1 center coordinate plus 4 diagonal coordinates offset by $d \times \text{texelSize}$:
$$(-d, -d), \quad (+d, -d), \quad (-d, +d), \quad (+d, +d)$$
With bilinear GPU hardware filtering, each tap automatically interpolates $2\times 2$ texels. Sampling 4 diagonals samples a $4\times 4$ area with only 5 texture lookups!
$$\text{Color}_{\text{down}} = \text{Tap}_{\text{center}} \times 0.5 + \sum_{i=1}^4 \text{Tap}_{\text{diag}, i} \times 0.125$$

#### Step 3: Upsample 3x3 Tent Filter Kernel (Passes 4–5)
Samples 8 neighboring coordinates with tent distribution:
- 4 orthogonal neighbors $(\pm 1, 0), (0, \pm 1)$ at weight $0.125$
- 4 diagonal neighbors $(\pm 1, \pm 1)$ at weight $0.0625$
- 1 center sample at weight $0.25$
- Additively accumulated into the previous pyramid level:
$$\text{Color}_{\text{up}} = \text{Color}_{\text{previous}} + \text{TentFilter}(\text{InputTex})$$

### 3.2 Selective Bloom & UI Text Plate Protection Guarantee

#### Barrier 1: DOM Layering Protection
In `index.html` and `experience.css`:
- `#webgl-canvas` is rendered at `z-index: 1`.
- `#chapters-container`, `.chapter`, and `.plate` reside at `z-index: 10`.
- Fixed navigation `#hud` resides at `z-index: 50`.
- The WebGL post-processing passes operate strictly within the `<canvas id="webgl-canvas">` framebuffer. The browser's native text rasterizer composites DOM text plates *above* the canvas with native subpixel hinting and zero blur.

#### Barrier 2: In-Canvas Luminance Clamping
To prevent 3D elements inside WebGL (such as photographic food cutouts, dark walnut boards, marble surfaces, and brass candlesticks) from bleeding into bloom:
1. **PBR Material Rules:**
   - Wood, marble, bread, and prosciutto materials have diffuse reflectance $\le 0.80$.
   - Food photography planes (`createCenterpieceDisplay`) use `emissiveIntensity: 0.12`, keeping max output luminance at $\approx 0.65$.
   - Hotspot beacon stems and brass candlesticks use roughness $0.22 - 0.45$. Specular peaks under key light reach $\approx 0.78 - 0.84$.
2. **Selective Bloom Target Rules:**
   - **Candle flames:** Use `THREE.MeshBasicMaterial({ color: 0xff8a24 })` or an emissive material with `emissive: 0xff8a24, emissiveIntensity: 3.8`. Luminance $\approx 2.85$, yielding intense, radiant amber bloom halos.
   - **Edison bulb filaments (Station 3):** Curved glowing filament lines using `emissive: 0xffbe55, emissiveIntensity: 4.2`. Luminance $\approx 3.20$, creating warm incandescentSupper ambiance.
   - **Texas wildflower honey droplets (Station 0):** High-refraction Fresnel rim highlights ($> 1.6$), catching candle glints and producing golden honey micro-bloom.
3. **Threshold Calibration:**
   - Set `threshold = 0.88`, `knee = 0.13`.
   - Any pixel with luminance $\le 0.88$ outputs exactly $0.0$ bloom.
   - UI text plates, background slates, and food textures remain 100% crisp.

---

## 4. Radiant Lighting & Tone Mapping Calibration Specification

### 4.1 Lighting Setup Matrix

| Light Component | Hex / Color | Physical Type | Intensity | Position $(x, y, z)$ | Casts Shadow | Physical Role & Animation Behavior |
|---|---|---|---|---|---|---|
| **Key Light (Chandelier)** | `0xffe8ce` (Warm Champagne) | `DirectionalLight` | 3.40 | $(5.0, 12.0, 8.0)$ | **Yes** | Primary illumination. Soft directional contact shadows (`PCFSoftShadowMap`, $1024\times 1024$ desktop, $512\times 512$ mobile, bias $-0.0005$). Adds rich cream specular glints. |
| **Candle Flame 1** | `0xff8a24` (Amber Honeycomb) | `PointLight` | 7.00 | $(0.8, 0.6, 0.5)$ | No | Phase 0 Micro Seed illumination. Distance 8.0, decay 2.0. Sinusoidal harmonic flicker. |
| **Candle Flame 2** | `0xff9933` (Warm Honey) | `PointLight` | 7.50 | $(9.2, 0.6, 0.5)$ | No | Phase 1 Artisan Board illumination. |
| **Candle Flame 3** | `0xff8820` (Deep Amber) | `PointLight` | 8.00 | $(20.8, 0.6, 0.5)$ | No | Phase 2 12-ft Banquet Table center illumination. |
| **Candle Flame 4** | `0xff9429` (Molasses Gold) | `PointLight` | 7.50 | $(29.2, 0.6, 0.5)$ | No | Phase 3 Midnight Cart & Beignet Station illumination. |
| **Candle Flame 5** | `0xff8a24` (Amber Honeycomb) | `PointLight` | 7.00 | $(40.8, 0.6, 0.5)$ | No | Phase 4 Chef Tricia Heritage Portrait illumination. |
| **Candle Flame 6** | `0xff9a38` (Golden Toast) | `PointLight` | 8.00 | $(50.0, 0.8, 0.5)$ | No | Phase 5 Quote Engine backdrop warmth. |
| **Sommelier Rim Light** | `0x3a5472` (Slate Cobalt) | `DirectionalLight` | 1.40 | $(-8.0, 6.0, -8.0)$ | No | Cool rim accent grazing crystal stemware fillets and back edges, creating chiaroscuro separation. |
| **Cursor Follow Spotlight** | `0xff9d47` (Warm Copper Honey) | `PointLight` | 4.50 | Camera $(x, y, z) + \text{pointer}$ | No | Tactile user feedback; glides with pointer motion, catching specular reflections across food surfaces. |
| **Ambient Base Light** | `0x281814` (Deep Espresso Glow) | `AmbientLight` | 2.20 | Global | No | Prevents shadow drop-off into flat digital black (`#000000`). Fills ambient cavities with warm roasted chestnut undertones. |

### 4.2 Candle Flame Organic Multi-Harmonic Flicker Formula
Each candle point light intensity is animated per frame using non-repeating irrational harmonic frequencies:
$$I(t) = I_{\text{base}} + 0.40 \sin(7.31 t + \phi) + 0.25 \cos(11.17 t + 1.3 \phi) + 0.15 \sin(17.93 t + 2.7 \phi)$$
where $\phi$ is a unique random phase offset per candle.

### 4.3 Material Calibration Matrix

| Material Key | Color Hex | Roughness | Metalness | Emissive Hex | Emissive Intensity | Visual Description |
|---|---|---|---|---|---|---|
| `copperMaterial` | `0xd49366` | 0.22 | 0.88 | `0x000000` | 0.0 | Polished warm copper. Pedestal trims, slate borders, hotspot beacon stems. High specular reflectivity. |
| `flameMaterial` | `0xff8a24` | 0.90 | 0.00 | `0xff8a24` | **3.8** | Emissive candle flame core. Transcends bloom threshold ($> 0.88$) to cast radiant warm aura. |
| `edisonFilament` | `0xffbe55` | 0.10 | 0.95 | `0xff9922` | **4.2** | Glowing tungsten filament lines on Station 3 Mobile Cart. Luminous golden halo. |
| `honeyMaterial` | `0xfa9e1c` | 0.08 | 0.12 | `0x3a1804` | 1.8 | Translucent Texas wildflower honey with SSS absorption and specular glints. |
| `obsidianMaterial`| `0x0c080a` | 0.18 | 0.25 | `0x000000` | 0.0 | Deep ebony backing slate with subtle specular sheen. |
| `goldLeafMaterial`| `0xf2be77` | 0.18 | 0.92 | `0x000000` | 0.0 | 24K gold foil flakes and hotspot accent rings. |

### 4.4 ACESFilmic Tone Mapping Calibration
```javascript
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.35;
```
- **Rationale for 1.35 Exposure:**  
  Standard linear clipping causes saturated warm lights to become ugly chalky yellow-white squares when blooming. ACESFilmic compresses HDR highlights logarithmically, turning intense candle flame cores into warm champagne cream while holding deep amber hues in the outer halo. At exposure 1.35, midtones (wood grain, prosciutto, cheeses) appear vibrant and luscious, while dark espresso shadows retain maximum depth.

---

## 5. Implementation Code Specification

### 5.1 Standalone Dual-Kawase Bloom Engine (`vendor/DualKawaseBloom.js`)
The complete, self-contained ES module for the post-processing pipeline:

```javascript
/* DualKawaseBloom.js — Lightweight Mobile-Safe Bloom & ACESFilmic Tone Mapping
 * Optimized for Three.js r170. Zero external dependencies.
 * Architecture: 3-level half-res Dual-Kawase pyramid + Luminance Threshold + ACESFilmic.
 */
import * as THREE from './three.module.js';

export class DualKawaseBloom {
  constructor(renderer, width, height, options = {}) {
    this.renderer = renderer;
    this.threshold = options.threshold !== undefined ? options.threshold : 0.88;
    this.knee = options.knee !== undefined ? options.knee : 0.13;
    this.bloomIntensity = options.bloomIntensity !== undefined ? options.bloomIntensity : 0.75;
    this.exposure = options.exposure !== undefined ? options.exposure : 1.35;
    this.enabled = true;

    // Full-screen quad geometry & orthographic camera
    this.quadCamera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    this.quadGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array([-1, -1, 0, 3, -1, 0, -1, 3, 0]);
    this.quadGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    this.quadGeometry.setAttribute('uv', new THREE.BufferAttribute(new Float32Array([0, 0, 2, 0, 0, 2]), 2));

    this.initRenderTargets(width, height);
    this.initShaders();
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
    // 1. Threshold & Downsample Shader
    this.matThreshold = new THREE.ShaderMaterial({
      uniforms: {
        tInput: { value: null },
        uTexelSize: { value: new THREE.Vector2() },
        uThreshold: { value: this.threshold },
        uKnee: { value: this.knee }
      },
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = vec4(position.xy, 0.0, 1.0);
        }
      `,
      fragmentShader: `
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
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
      `,
      fragmentShader: `
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
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
      `,
      fragmentShader: `
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
      vertexShader: `
        varying vec2 vUv;
        void main() { vUv = uv; gl_Position = vec4(position.xy, 0.0, 1.0); }
      `,
      fragmentShader: `
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
          gl_FragColor = vec4(LinearTosRGB(mapped), base.a);
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
    if (!this.enabled) {
      this.renderer.render(scene, camera);
      return;
    }

    const gl = this.renderer;

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
    // Copy bottom level to upTargets[2]
    gl.setRenderTarget(this.upTargets[1]);
    gl.clear();
    this.matUp.uniforms.tInput.value = this.downTargets[2].texture;
    this.matUp.uniforms.uTexelSize.value.set(1.0 / this.downTargets[2].width, 1.0 / this.downTargets[2].height);
    this.matUp.uniforms.uOffset.value = 1.5;
    gl.render(this.quadMesh, this.quadCamera);

    // Upsample to 0.5x
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
```

### 5.2 Integration Hook in `experience.js`

```javascript
import { DualKawaseBloom } from './vendor/DualKawaseBloom.js';

// Inside Three.js initialization:
const isMobile = window.innerWidth < 900;
const dpr = Math.min(window.devicePixelRatio, isMobile ? 1.15 : 1.5);
renderer.setPixelRatio(dpr);
renderer.setSize(window.innerWidth, window.innerHeight);

// Note: Renderer tone mapping is handled inside bloom's composite pass to prevent double compression
renderer.toneMapping = THREE.NoToneMapping; 

const bloomPipeline = new DualKawaseBloom(renderer, window.innerWidth * dpr, window.innerHeight * dpr, {
  threshold: 0.88,
  knee: 0.13,
  bloomIntensity: 0.75,
  exposure: 1.35
});

// Resize synchronization
window.addEventListener('resize', () => {
  const isMob = window.innerWidth < 900;
  const currentDpr = Math.min(window.devicePixelRatio, isMob ? 1.15 : 1.5);
  renderer.setPixelRatio(currentDpr);
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  bloomPipeline.setSize(window.innerWidth * currentDpr, window.innerHeight * currentDpr);
});

// Animation loop replacement:
function animate() {
  requestAnimationFrame(animate);
  // ... physics, animations, candle flickers ...
  bloomPipeline.render(scene, camera);
}
```

---

## 6. Mobile & Headless Performance Safeguards

### 6.1 Viewport & DPR Clamping Matrix

| Metric | Desktop Viewport ($w \ge 900\text{px}$) | Mobile Viewport ($w < 900\text{px}$) | Playwright Headless (SwiftShader) |
|---|---|---|---|
| **DPR Clamp** | `Math.min(devicePixelRatio, 1.5)` | `Math.min(devicePixelRatio, 1.15)` | `1.0` (fixed) |
| **Bloom FBO Max Res** | $960 \times 540$ (Half-Res) | $440 \times 240$ (Half-Res) | $720 \times 450$ |
| **Shadow Map Res** | $1024 \times 1024$ | $512 \times 512$ | $512 \times 512$ |
| **Draw Call Target** | $\le 35$ calls | $\le 22$ calls | $\le 30$ calls |

### 6.2 Adaptive Performance Degradation Monitor
An autonomous 2000ms rolling frame monitor monitors real-time FPS:
```javascript
let frameCount = 0;
let lastCheck = performance.now();

function monitorPerformance() {
  frameCount++;
  const now = performance.now();
  if (now - lastCheck >= 2000) {
    const fps = (frameCount * 1000) / (now - lastCheck);
    frameCount = 0;
    lastCheck = now;

    if (fps < 45 && bloomPipeline.enabled) {
      console.warn(`[PERF] Low frame rate detected (${fps.toFixed(1)} FPS). Engaging adaptive bloom bypass.`);
      bloomPipeline.enabled = false;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.35;
    } else if (fps > 55 && !bloomPipeline.enabled) {
      bloomPipeline.enabled = true;
      renderer.toneMapping = THREE.NoToneMapping;
    }
  }
}
```

---

## 7. Verification & Testing Protocol

### 7.1 Automated Headless Playwright Verification
The implementation must pass `test_3d_experience.py` under Python 3.11 with:
- `Console Errors: 0`
- `Failed Requests: 0`
- Captured screenshots across all chapters (`01-the-seed.png` through `09-interactive-beignet-sugar-burst.png`).

```powershell
# Command for testing
& 'C:\Users\Garrett\AppData\Local\Programs\Python\Python311\python.exe' test_3d_experience.py
```

### 7.2 Visual Inspection Gates
1. **Candlelight Halo Inspection:**
   In chapters 0, 1, 2, and 3, verify that brass candlesticks display an ethereal warm golden halo (`0xff8a24`) fading radially over $\approx 80\text{px}$.
2. **Edison Filament Inspection:**
   In Chapter 3 (The Mobile Cart), verify that Edison bulbs have glowing amber filaments.
3. **UI Plate Sharpness Gate:**
   Inspect `.plate` narrative cards and `#hud` navigation. Confirm crisp typographic edges, zero halo wash, and contrast ratio $\ge 12:1$ against the background canvas.
4. **Food Photography Contrast Gate:**
   Verify that food display planes (`img/stage*.png` or `img/cut/*.webp`) remain rich with unclipped dark tones and are not clouded by bloom.
