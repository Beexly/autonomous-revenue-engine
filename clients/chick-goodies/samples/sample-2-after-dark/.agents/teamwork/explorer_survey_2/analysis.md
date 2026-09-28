# Codebase Investigation & Architecture Survey: Charcuterie Chick WebGL Scrollytelling

**Investigation Date:** 2026-09-26  
**Investigator:** Codebase Explorer (`explorer_survey_2`)  
**Target Repository:** `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark`  
**Reference Document:** `ORIGINAL_REQUEST.md`  
**Live Production Target:** `https://charcuterie-chick-sample-2.vercel.app`  

---

## 1. Executive Summary

This investigation surveys the repository at `clients/chick-goodies/samples/sample-2-after-dark` against the authoritative project mandate in `ORIGINAL_REQUEST.md`. 

The repository implements an immersive 3D WebGL scrollytelling experience for Charcuterie Chick (Chef Tricia Holfelder, Tomball TX). The architecture is built as a **zero-build-step, zero-runtime-dependency Vanilla WebGL application** powered by an upstream-vendored Three.js r170 ES module, procedural Web Audio synthesis, and static semantic HTML5/CSS3. Generative motion backdrops (ByteDance Seedance 2.5 text-to-video) and hyper-realistic macro stills (Higgsfield Soul v2) were synthesized offline via Higgsfield AI and committed as high-fidelity static media.

The application is deployed and live on the Vercel Edge Network (`https://charcuterie-chick-sample-2.vercel.app`). Automated testing via headless Python Playwright passes with **0 console errors and 0 failed network requests** on desktop. However, key visual gaps remain between the current build and the ultimate "Lusion / Oryzo / Basement Studio" standard specified in `ORIGINAL_REQUEST.md`, notably the use of textured 2D planes on beveled boxes rather than procedural GLSL/mesh-deformed 3D food geometry, DOM `<video>` tag swapping rather than in-shader video textures, and the omission of a dedicated post-processing bloom pass.

---

## 2. Directory Structure & Inventory of Existing Files

### 2.1 Directory Tree Overview
```
clients/chick-goodies/samples/sample-2-after-dark/
├── .agents/
│   └── teamwork/
│       ├── ORIGINAL_REQUEST.md            # Authoritative user prompt & requirements
│       ├── orchestrator/plan.md           # Master plan
│       ├── spec_miner_survey_1/           # Requirements catalog & test matrix
│       ├── explorer_survey_3/             # Graphics & animation exploration
│       ├── explorer_survey_2/             # This agent workspace (analysis, handoff)
│       └── sentinel/                      # Guard & verification records
├── .vercel/
│   ├── README.txt
│   └── project.json                       # Vercel project linkage (charcuterie-chick-sample-2)
├── fonts/
│   ├── barlow-condensed-700.ttf           # Barlow Condensed Bold font asset
│   └── OFL.txt                            # Open Font License
├── img/
│   ├── cut/                               # 11 optimized WebP transparent cutouts
│   ├── cart-cinematic-720p.mp4            # Higgsfield Seedance 2.5 mobile cart video (4.59 MB)
│   ├── feast-cinematic-720p.mp4           # Higgsfield Seedance 2.5 banquet video (4.43 MB)
│   ├── micro-seed-720p.mp4                # Higgsfield Seedance 2.5 macro seed video (2.68 MB)
│   ├── stage1-micro-cone.png              # Higgsfield Soul v2 macro cone still (3.89 MB)
│   ├── stage2-artisan-board.png           # Higgsfield Soul v2 artisan board still (3.88 MB)
│   ├── stage3-grand-banquet.png           # Higgsfield Soul v2 banquet table still (2.89 MB)
│   ├── stage4-midnight-cart.png           # Higgsfield Soul v2 mobile cart still (3.37 MB)
│   ├── tricia-portrait-471.jpg            # Chef Tricia Holfelder portrait
│   ├── knot-hero.jpg, knot-2..4.jpg       # Authentic client event photography
│   ├── stacey-logo-mark-trans.webp        # Client brand mark (transparent WebP)
│   └── brand.webp, logo.png               # Brand marks
├── test-output/
│   ├── experience-3d/                     # Automated Playwright test captures (desktop & mobile)
│   ├── quality-gate-report.json           # Axe-core accessibility audit results
│   └── qa-results.json                    # Viewport and layout QA metrics
├── vendor/
│   ├── THREE-LICENSE.txt                  # Three.js MIT license
│   ├── README.md                          # Vendoring, minification, and SonarCloud analysis
│   └── three.module.js                    # Vendored Three.js r170 ESM (1.31 MB)
├── .gitignore                             # Git ignore rules (.vercel)
├── .vercelignore                          # Vercel deployment exclusions (*.py, *.md, test-output)
├── build_midnight.py                      # Guarded legacy generator (refuses to run)
├── craft.js, engine.js, gathering.js      # Legacy multi-page interaction scripts
├── kit.js, quiet.js, midnight.js          # Supporting UI scripts
├── facts.json                             # Authoritative business truth (pricing, phone, email)
├── MIDNIGHT-BIBLE.md                      # Legacy design bible
├── midnight.css, table.css                # Legacy styling
├── experience.css                         # Primary 3D scrollytelling stylesheet (867 lines)
├── experience.js                          # Primary 3D Three.js scrollytelling engine (1218 lines)
├── index.html                             # Primary 3D WebGL experience entry point (358 lines)
├── index.backup.html                      # Backup of legacy 2D "Midnight Supper" homepage
├── table.html, table-boot.js, table-cinematic.js # Legacy 3D table prototype routes
├── menu.html, gallery.html, story.html, enquire.html # Legacy static multi-page routes
├── qa_full.py, qa_midnight.py             # Legacy multi-route QA test runners
├── quality-gate.py                        # Axe-core WCAG 2.1 AA automated accessibility gate
├── test_3d_experience.py                  # Primary Playwright WebGL automated test runner
├── robots.txt, sitemap.xml                # SEO metadata
└── vercel.json                            # Vercel deployment configuration
```

### 2.2 Inventory of Key Code Files
| File Path | Lines | Size (Bytes) | Role & Status |
|---|---|---|---|
| `index.html` | 358 | 17,022 | **Production Entry Point.** Mounts fullscreen `#webgl-canvas`, cinematic video backdrop `#cinematic-backdrop`, fixed HUD, 6 story chapters, and spatial HUD SVG leader line. |
| `experience.js` | 1,218 | 41,868 | **Primary 3D Engine.** Implements Three.js r170 scene, ACESFilmic tone mapping, 6 lighting fixtures, 3D centerpiece displays, raycaster & spatial HUD, 3D particle systems (embers + beignet sugar burst), audio synthesizer, and mathematical quote configurator. |
| `experience.css` | 867 | 17,948 | **Primary Stylesheet.** Defines dark luxury palette (`--void: #040203`, `--gold: #e2a77e`), responsive chapter plates, fixed HUD navigation, spatial HUD tooltip, and typography (Fraunces & Inter). |
| `facts.json` | 36 | 1,398 | **Authoritative Business Data.** Locked pricing: Graze Me ($24), Standard ($26), Super ($30), Grand ($38), Holy Grail ($2,000 / $3,500), phone (`18324588180`), and email (`charcuteriechick@outlook.com`). |
| `vendor/three.module.js` | 58,190 | 1,314,681 | **Vendored 3D Library.** Three.js r170 ES module. Vendored upstream to avoid external CDN dependencies or npm build steps. |
| `test_3d_experience.py` | 138 | 5,366 | **Playwright Test Suite.** Launches Chromium with WebGL SwiftShader flags, navigates all 6 stations, captures screenshots, validates quote math, tests spatial HUD, tests sugar particle burst, and asserts 0 console errors and 0 failed requests. |
| `vercel.json` | 8 | 175 | **Vercel Config.** Sets static zero-build deployment (`framework: null`, `buildCommand: echo skip`, `outputDirectory: .`). |

---

## 3. Package Configuration & Build Tooling

- **No `package.json` at Root:** The repository deliberately contains no `package.json`, `package-lock.json`, or root `node_modules`. 
- **Zero-Build Architecture:** The project operates without Webpack, Vite, Next.js, Babel, or Rollup. All source files are served directly as standard web modules (`<script type="module" src="experience.js">`).
- **Vendored Dependencies:** Three.js r170 ESM is stored in `vendor/three.module.js`. As documented in `vendor/README.md`, minification with `esbuild` reduces the file from 1,283.9 KB to 672.4 KB (171.6 KB gzip), but was left unminified to avoid triggering SonarCloud new-code security scan alerts on feature branches.
- **Python Tooling:** All project automation (testing, asset generation, quality checks) is executed via Python 3.11 scripts (`test_3d_experience.py`, `quality-gate.py`, `generate_stages.py`).

---

## 4. Framework, WebGL & Shading Stack

### 4.1 Rendering Pipeline in `experience.js`
- **Renderer Setup:**
  - `renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance', alpha: true })`
  - Pixel ratio clamped to `Math.min(window.devicePixelRatio, 2)` to avoid GPU memory blowouts on high-DPI retina displays.
  - Color management: `renderer.outputColorSpace = THREE.SRGBColorSpace`.
  - Tone mapping: `renderer.toneMapping = THREE.ACESFilmicToneMapping`, exposure: `1.35`.
  - Shadows: `renderer.shadowMap.enabled = true`, `type = THREE.PCFSoftShadowMap`.
  - Atmospheric fog: `scene.fog = new THREE.FogExp2(0x040203, 0.022)`.
- **Dynamic Lighting Model:**
  - Ambient base: `AmbientLight(0x281814, 2.2)` (deep warm tone).
  - Key light: `DirectionalLight(0xffe8ce, 3.4)` at `(5, 12, 8)` with shadow map `1024x1024`.
  - Rim light: `DirectionalLight(0x3a5472, 1.4)` at `(-8, 6, -8)` (cool blue-gray contrast).
  - Cursor follow light: `PointLight(0xff9d47, 4.5, 9, 2)` tracking pointer position with depth offset.
  - Candlelight array: 6 flickering `PointLight` instances at table coordinates with multi-frequency sine wave flicker.
- **Materials:**
  - Polished Copper: `MeshStandardMaterial({ color: 0xd49366, roughness: 0.22, metalness: 0.88 })`.
  - Obsidian Slate: `MeshStandardMaterial({ color: 0x0c080a, roughness: 0.18, metalness: 0.25 })`.
  - Gold Leaf: `MeshStandardMaterial({ color: 0xf2be77, roughness: 0.18, metalness: 0.92 })`.
  - Glowing Hotspot Gem: `MeshStandardMaterial({ color: 0xffbe55, emissive: 0xff8811, emissiveIntensity: 1.2 })`.
- **Particle Systems:**
  1. *Volumetric Embers:* 320 points drifting upward across a 54x7x12 bounding volume with four-color palette (amber, gold, copper, champagne) and additive blending.
  2. *Powdered Sugar Burst:* 140 points simulating physical explosion on Beignets hotspot tap, modeled with initial radial velocities, gravity deceleration (`-2.4 * dt`), and velocity damping (`0.98`).
- **Interactive Raycasting & Spatial HUD:**
  - `THREE.Raycaster` identifies interactive hotspot pins on `mousemove` and `click`.
  - Active hotspot coordinates are projected to 2D screen space via `screenVector.project(camera)`.
  - SVG leader line (`#hud-line`) and pulsing reticle (`#hud-reticle`) dynamically connect 3D mesh coordinates to the floating DOM tasting note card (`#hud-tooltip`).

---

## 5. Existing Assets & Generative Pipeline

### 5.1 Generative Video Backdrops (ByteDance Seedance 2.5)
Generated via `generate_charcuterie_video.py` and `generate_extra_videos.py` using `higgsfield_client` with the `bytedance/seedance-2.5/text-to-video` model:
- `img/micro-seed-720p.mp4` (2.68 MB): Macro tracking shot of prosciutto ribbons, honeycomb drips, and rosemary needles.
- `img/feast-cinematic-720p.mp4` (4.43 MB): Slow cinematic glide over a candlelit 12-foot luxury charcuterie banquet.
- `img/cart-cinematic-720p.mp4` (4.59 MB): Mobile charcuterie cart illuminated with Edison filament bulbs.

### 5.2 Generative Macro Stills (Higgsfield Soul v2)
Generated via `generate_stages.py` using `higgsfield-ai/soul/v2/standard`:
- `img/stage1-micro-cone.png` (3.89 MB): Hyper-detailed macro charcuterie cone.
- `img/stage2-artisan-board.png` (3.88 MB): Artisan dark walnut charcuterie board with cheeses, meats, and figs.
- `img/stage3-grand-banquet.png` (2.89 MB): 12-foot banquet table in dramatic evening ballroom lighting.
- `img/stage4-midnight-cart.png` (3.37 MB): Mobile charcuterie cart with Edison bulbs and champagne flutes.

### 5.3 Audio Synthesis (Web Audio API)
Procedural audio implemented in `experience.js` requiring zero external audio downloads:
- Continuous fireplace crackle & warm Brownian noise.
- Harmonic singing bowl tones (520 Hz - 745 Hz) on station transitions.
- Crystal chime bell (880 Hz - 1174 Hz) on hotspot interaction.
- Bandpass-filtered confectioners' sugar puff on beignet burst.

### 5.4 Typography & Fonts
- Local font: `fonts/barlow-condensed-700.ttf` (Barlow Condensed Bold, OFL license).
- Google Fonts: `Fraunces` (luxury serif) and `Inter` (geometric sans-serif).

---

## 6. Testing Infrastructure & Automation

### 6.1 `test_3d_experience.py`
The primary automated test is written in Python using Playwright (`playwright.sync_api`). It supports both local static server execution and live remote testing against Vercel.

**Test Coverage:**
1. **WebGL Canvas Verification:** Asserts `#webgl-canvas` is present and rendered.
2. **Station Progression:** Triggers `window.TableState.goTo(idx, true)` for all 6 stations (0 through 5) and takes full-resolution screenshots:
   - `01-the-seed.png`
   - `02-the-board.png`
   - `03-the-banquet.png`
   - `04-the-cart.png`
   - `05-the-chef.png`
   - `06-instant-quote.png`
3. **Mathematical Quote Configurator:** Sets guest count to 100 via `window.TableState.setGuests(100)` and asserts that the calculated total (`$3,061.00`) matches exact formula ($2,400 food + $229 setup + $432 tax).
4. **Spatial HUD Tooltip:** Triggers `window.TableState.focusHotspot(1)` and asserts `#hud-tooltip` is visible with correct leader line coordinates.
5. **Particle Physics:** Triggers `window.TableState.clickHotspot(7)` to test Beignet sugar puff burst.
6. **Console & Network Error Gates:** Asserts `len(console_errors) == 0` and `len(failed_requests) == 0`.

**Execution Results (Verified Locally & Live on Vercel):**
- Local Execution: `py -3.11 test_3d_experience.py` -> **0 errors, 0 failed requests, ALL TESTS PASSED.**
- Live Vercel Execution: `py -3.11 test_3d_experience.py https://charcuterie-chick-sample-2.vercel.app` -> **0 errors, 0 failed requests, ALL TESTS PASSED.**

### 6.2 Secondary QA Suites
- `quality-gate.py`: Runs automated WCAG 2.1 AA accessibility checks using Axe-core (`axe.min.js`).
- `qa_full.py`: Tests multi-viewport responsive layouts (360, 390, 768, 1440) across legacy multi-page routes.

---

## 7. Environment Variables, Security & Deployment

### 7.1 Environment Variables
- **Zero Secrets in Repository:** No `.env` or `.env.local` files exist inside `sample-2-after-dark`.
- **Parent Configuration:** Higgsfield API keys (`HF_KEY`, `HF_CREDENTIALS`, `HF_API_KEY_ID`, `HF_API_KEY_SECRET`) are stored in `autonomous-revenue-engine/.env.local` and accessed only by offline Python generation scripts.
- **Client Runtime Safety:** The client application makes no external API calls and requires no runtime secrets.

### 7.2 Vercel Deployment Configuration
- `vercel.json`:
  ```json
  {
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "framework": null,
    "installCommand": "echo skip",
    "buildCommand": "echo skip",
    "outputDirectory": "."
  }
  ```
- `.vercelignore`: Prevents deployment of Python scripts (`*.py`), markdown (`*.md`), and test outputs (`test-output`).
- `.vercel/project.json`: Linked to project `charcuterie-chick-sample-2` under organization `team_VvPIx69THeXYfjeG71taqnPo`.
- Production Edge URL: `https://charcuterie-chick-sample-2.vercel.app`.

---

## 8. Gap Analysis against ORIGINAL_REQUEST.md

| Requirement / Acceptance Criteria | Current State | Gap Severity | Detailed Assessment |
|---|---|---|---|
| **R1. Living WebGL Sensory Environment** | Three.js canvas active, ACESFilmic tone mapping, 6 lighting sources, ember & sugar particles. | **HIGH GAP** | Centerpieces use flat `PlaneGeometry` image cards on beveled boxes. Video backdrops use HTML `<video>` element swaps behind canvas rather than in-shader WebGL video textures. No post-processing bloom pass. |
| **R1. Radiant Luminous Lighting Model** | Warm amber, copper, and gold lighting with candle flicker; ACESFilmic active. | **MEDIUM GAP** | Tone mapping exposure is tuned, but post-processing bloom (`UnrealBloomPass` or Dual-Kawase bloom) is missing, leaving specular highlights less luminous than the Lusion standard. |
| **R1. Buttery 60fps Rendering** | Clamped DPR, simple geometries, runs smoothly on desktop Chromium. | **LOW GAP** | Mobile performance could suffer if high-resolution textures (4x ~3.5MB PNGs) cause memory pressure. Needs texture mipmapping and texture compression (WebP/KTX2). |
| **R2. Progressive Scale Storytelling** | All 6 phases (0 to 5) choreographed and accessible via scrollytelling and nav pills. | **LOW GAP** | Camera transitions use linear lerping (`THREE.MathUtils.lerp`) between stations rather than a continuous Catmull-Rom spline curve with Verlet damping. |
| **R2. Phase 5 Quote Engine** | Real-time calculation with $24-$38 tiers, Holy Grail ($2,000 / $3,500), $229 setup, 18% tax, SMS & email prefill. | **FULL COMPLIANCE** | Perfectly matches all business rules and verified pricing. SMS to `832-458-8180` and email to `charcuteriechick@outlook.com` tested and working. |
| **R3. Reference Reverse-Engineering** | Procedural audio, cursor lighting, and particle burst implemented. | **MEDIUM GAP** | Advanced GLSL fluid/curl-noise simulations from reference sites (Lusion, Oryzo) are not yet integrated into custom vertex/fragment shaders. |
| **R4. Generative Asset Synthesis** | Soul v2 stills and Seedance 2.5 videos synthesized and committed. | **LOW GAP** | Assets are currently applied as standard diffuse textures and DOM videos rather than normal/displacement maps and WebGL video shaders. |
| **R5. Deployment & Security** | Zero credentials in repo; Vercel edge deployment active. | **FULL COMPLIANCE** | `.vercelignore` properly protects repository; live at `https://charcuterie-chick-sample-2.vercel.app`. |
| **Acceptance: Automated Playwright Suite** | `test_3d_experience.py` passes with 0 console errors and 0 failed requests on desktop (1440x900). | **LOW GAP** | Mobile viewport (393x852) should be formally incorporated into the automated `test_3d_experience.py` test run alongside desktop. |

---

## 9. Recommendations for Subsequent Implementation Tracks

1. **Shader & Texture Modernization:**
   - Replace flat image cards on beveled boxes with dynamic vertex-deforming meshes or custom GLSL shaders that react kinetically to pointer movement and scroll velocity.
   - Transition video playback from DOM `<video>` elements into Three.js `THREE.VideoTexture` rendered on background planes or integrated into the WebGL world.
2. **Post-Processing Bloom Pipeline:**
   - Integrate a lightweight post-processing bloom pass (e.g., downsampled Dual-Kawase or selective `UnrealBloomPass`) to achieve the radiant, luminous honeycomb/copper specular highlights mandated by the Lusion standard.
3. **Continuous Camera Spline:**
   - Replace linear camera lerps with `THREE.CatmullRomCurve3` centripetal splines for camera eye and lookAt target, damped by framerate-independent friction.
4. **Automated Test Expansion:**
   - Extend `test_3d_experience.py` to systematically execute both Desktop (1440x900) and Mobile (393x852) viewports in a single run.
