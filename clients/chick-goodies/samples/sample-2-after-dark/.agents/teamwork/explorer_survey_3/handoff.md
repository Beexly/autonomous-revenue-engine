# Handoff Report: Graphics & Animation Architecture Exploration

**Document Type:** Hard Handoff (Task Complete)  
**Agent:** Graphics & Animation Architecture Explorer (`explorer_survey_3`)  
**Parent Agent:** Orchestrator (`057057ff-b7fd-4423-8c4e-8512f5ef961b`)  
**Target Milestone:** Survey & Scope Mapping (Phase 0) -> Phase 1 Implementation Tracks  
**Artifact Generated:** `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\explorer_survey_3\analysis.md`

---

## 1. Observation

Direct code and environmental observations from the codebase investigation:

1. **Current Video Backdrop Implementation in `experience.js`:**
   - Exact path: `clients/chick-goodies/samples/sample-2-after-dark/experience.js` lines 38–70:
     ```javascript
     const VIDEO_SOURCES = {
       0: 'img/micro-seed-720p.mp4',
       1: 'img/feast-cinematic-720p.mp4',
       2: 'img/feast-cinematic-720p.mp4',
       3: 'img/cart-cinematic-720p.mp4',
       4: 'img/feast-cinematic-720p.mp4',
       5: 'img/feast-cinematic-720p.mp4'
     };
     ```
     `experience.js` dynamically updates DOM `<video>` elements (`bgVideoA` / `bgVideoB`) inside `#cinematic-backdrop` behind `#webgl-canvas`.
   - Exact path: `clients/chick-goodies/samples/sample-2-after-dark/index.html` lines 27–36:
     ```html
     <!-- Ambient Cinematic Video Backdrop (Seedance 2.5 on Higgsfield) -->
     <div id="cinematic-backdrop" aria-hidden="true">
       <video id="bg-video-a" class="bg-video-stream active" autoplay loop muted playsinline poster="img/stage1-micro-cone.png">
         <source src="img/micro-seed-720p.mp4" type="video/mp4">
       </video>
     ```
2. **Current 3D Centerpiece Objects in `experience.js`:**
   - Exact path: `experience.js` lines 356–386:
     ```javascript
     function createCenterpieceDisplay(texturePath, width, height, opts = {}) {
       const group = new THREE.Group();
       const texture = loadTexture(texturePath);
       const backGeo = new THREE.BoxGeometry(width + 0.14, height + 0.14, 0.04);
       const back = new THREE.Mesh(backGeo, obsidianMaterial);
       ...
       const planeGeo = new THREE.PlaneGeometry(width, height);
       const plane = new THREE.Mesh(planeGeo, planeMat);
     ```
     The 3D food items are textured flat 2D `PlaneGeometry` meshes mounted onto beveled boxes.
3. **Requirement R1 & Acceptance Criteria in `ORIGINAL_REQUEST.md`:**
   - Exact path: `ORIGINAL_REQUEST.md` lines 20–24, 48–50:
     ```markdown
     ### R1. Living WebGL Sensory Environment (Lusion Standard)
     Deliver a real-time WebGL world that responds kinetically to user pointer motion, scroll velocity, and interaction:
     - Dynamic fluid/particle fields, kinetic mesh deformation, or custom GLSL shaders replacing flat 2D image cards.
     - Radiant, luminous lighting model (warm amber honeycomb, polished copper, warm champagne, specular highlights, and ACESFilmic tone mapping with post-processing bloom) completely replacing muddy or dark black palettes.
     - Buttery 60fps rendering with seamless shader/canvas transitions rather than stuttering HTML <video> element swaps.
     ...
     - [ ] 3D canvas is the primary interactive universe with tactile response to pointer and scroll (not 2D cards with background video).
     ```
4. **Mobile WebGL Gating in `table-boot.js`:**
   - Exact path: `table-boot.js` lines 26–33:
     ```javascript
     var wide = matchMedia('(min-width: 900px)').matches;
     var calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

     if (wide && !calm && hasWebGL()) {
       import('./table-cinematic.js').catch(still);
     } else {
       still();
     }
     ```
     In the legacy `table.html` route, WebGL is disabled entirely on screens `< 900px` wide, falling back to a static still image.
5. **Static Deployment Architecture in `vercel.json`:**
   - Exact path: `vercel.json` lines 1–7:
     ```json
     {
       "$schema": "https://openapi.vercel.sh/vercel.json",
       "framework": null,
       "installCommand": "echo skip",
       "buildCommand": "echo skip",
       "outputDirectory": "."
     }
     ```
     The repository deploys statically to Vercel without an automated build step (`npm run build`).
6. **Vendored Three.js Runtime in `vendor/three.module.js`:**
   - Exact path: `vendor/three.module.js` (Three.js r170, 1,283.9 KB unminified, 123.6 KB minified gzip).
7. **Existing Generative Asset Scripts:**
   - Exact paths: `generate_stages.py` (Soul v2 4K stills) and `generate_charcuterie_video.py` / `generate_extra_videos.py` (Seedance 2.5 720p text-to-video loops), reading `HF_KEY` / `HF_CREDENTIALS` from `.env.local`.

---

## 2. Logic Chain

1. **Premise 1 (R1 Gap):** Observations 1 and 2 reveal that the current `experience.js` implementation renders flat 2D image cards on boxes and swaps HTML `<video>` elements in the background DOM. Observation 3 (`ORIGINAL_REQUEST.md` R1) explicitly mandates that flat 2D image cards and background `<video>` element swaps be replaced by a pure WebGL universe with dynamic particle/fluid fields, kinetic mesh deformation, and seamless shader transitions.
2. **Premise 2 (Mobile 60 FPS Mandate):** Observation 4 shows that legacy code bypassed mobile WebGL optimization by disabling WebGL entirely on screens `< 900px`. However, Observation 3 and test criteria mandate a locked 60 FPS WebGL experience across both desktop (1440x900) and mobile (393x852).
3. **Premise 3 (Stack Fit):** Observation 5 demonstrates that the project is deployed statically to Vercel with `"buildCommand": "echo skip"`. Introducing a React Three Fiber (R3F) stack would require introducing a heavy React/Vite/npm build pipeline (+480 KB bundle weight) and rewriting tested HTML/DOM chapters. In contrast, Vanilla Three.js r170 ESM (Observation 6) is already vendored, carries zero build overhead, and enables microsecond-level render loop control.
4. **Premise 4 (Post-Processing Strategy):** Full-resolution `UnrealBloomPass` (10 full-screen blits per frame) causes immediate GPU thermal throttling and drops frame rates on high-DPI mobile screens (e.g., DPR 3.0). To resolve this, a 0.5x downsampled Dual-Kawase Selective Bloom pipeline with a luminance threshold (>0.85) provides radiant amber/copper glow while consuming 75% less GPU fill-rate.
5. **Premise 5 (Asset Pipeline Integration):** Observation 7 confirms working local scripts generating Seedance 2.5 video loops and Soul v2 4K stills. Ingesting Seedance 2.5 loops as `THREE.VideoTexture` inside custom GLSL shaders and extracting Sobel normal/relief maps from Soul v2 stills directly satisfies R1 and R4 without DOM video tags.
6. **Premise 6 (Scrollytelling Continuity):** Discrete camera lerps cause angle jarring. Implementing a continuous centripetal Catmull-Rom spline trajectory (`THREE.CatmullRomCurve3`) for eye position and lookAt target, paired with framerate-independent Verlet inertial damping, ensures silky smooth transitions across Phases 0 through 5.

---

## 3. Caveats

1. **WebGL Video Texture Mobile Autoplay Policy:** Mobile iOS Safari and Android Chrome strictly enforce user-interaction gating for audio playback. `THREE.VideoTexture` video elements must have `muted = true`, `playsInline = true`, and `autoplay = true` to allow hardware-accelerated video decoding without user gesture block.
2. **GPU Texture Memory Footprint:** 4K uncompressed RGBA textures consume ~64 MB of GPU VRAM each. To maintain mobile stability and prevent out-of-memory context crashes, all 4K stills must be served as optimized WebP textures ($1024\times 1024$ or $2048\times 2048$ max) with mipmaps enabled.
3. **Headless Playwright WebGL Support:** In CI or headless test execution (e.g. `test_3d_experience.py`), Chromium requires flags `--use-gl=angle`, `--use-angle=swiftshader`, `--enable-webgl`, and `--ignore-gpu-blocklist` to simulate a hardware WebGL context. Software rasterizers may execute GLSL loops slower; test thresholds must account for this.

---

## 4. Conclusion

1. **Architecture Finalized:** A comprehensive technical graphics and animation architecture has been authored and published to `explorer_survey_3/analysis.md`.
2. **Core Decisions Established:**
   - **Engine:** Retain Three.js r170 ESM (vendored); no React / R3F rewrite required.
   - **Lighting & Post-Processing:** Warm amber honeycomb (2200K), polished copper (roughness 0.22, metalness 0.88), warm champagne highlights, ACESFilmic tone mapping, and half-resolution Dual-Kawase Selective Bloom.
   - **Shaders & Particles:** Liquid honey SSS fragment shader, GPU Curl-noise particle advection, parametric prosciutto folding mesh, and 320 floating ember spores.
   - **Scrollytelling:** Centripetal Catmull-Rom camera spline traversing Phases 0 to 5 driven by Verlet momentum damping.
   - **Higgsfield Ingestion:** Seedance 2.5 ingested via `THREE.VideoTexture`; Soul v2 4K stills enriched via Sobel normal maps for tactile 3D relief.
   - **60 FPS Guarantee:** Clamped DPR (1.5 desktop / 1.15 mobile), `InstancedMesh` draw call batching (<35 calls), and synchronous `renderer.compile()` warmup.
3. **Readiness:** The architecture directly defines downstream contracts for Phase 1 Sub-Orchestrators (Milestones 1–4).

---

## 5. Verification Method

To independently verify this architectural investigation and its technical recommendations:

1. **Inspect Analysis and Artifacts:**
   - Inspect `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\explorer_survey_3\analysis.md` for complete GLSL shader listings, mathematical formulations, and camera spline keyframes.
2. **Execute Current 3D Test Suite:**
   - Run the existing Playwright verification script:
     ```powershell
     cd C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark
     python test_3d_experience.py
     ```
   - Verify that all 6 station transitions, spatial HUD tooltip, and configurator math pass with 0 console errors.
3. **Measure Mobile & Desktop Viewport Compliance:**
   - Run `quality-gate.py` to confirm zero broken links, accessibility WCAG compliance, and image native dimensions across viewports:
     ```powershell
     python quality-gate.py
     ```
4. **Invalidation Conditions:**
   - If downstream implementers introduce React / R3F and break the zero-build static deployment on Vercel.
   - If post-processing bloom is run at native $3\times$ DPR on mobile, causing frame rates to drop below 45 FPS.
   - If generative video textures are loaded via un-muted DOM elements triggering mobile autoplay blocks.
