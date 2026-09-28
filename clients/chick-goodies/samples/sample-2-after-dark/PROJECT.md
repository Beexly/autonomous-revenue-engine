# Project: Charcuterie Chick WebGL Scrollytelling (`sample-2-after-dark`)

## Architecture
An immersive, sensory, Awwwards-caliber WebGL scrollytelling web application built with zero-build static architecture.
- **Rendering Engine:** Vanilla Three.js r170 ESM (`vendor/three.module.js`), mounting a persistent fullscreen `<canvas id="webgl-canvas">` with ACESFilmic tone mapping, PCFSoftShadowMap, and a selective bloom post-processing pass.
- **Shader & Living Matter Pipeline:** GPU particle fields (ambient embers, beignet sugar bursts), kinetic GLSL mesh deformation shaders, and direct WebGL `VideoTexture` passes replacing HTML `<video>` DOM swapping and flat 2D image cards.
- **Lighting & Aesthetics:** Radiant luxury lighting model featuring warm amber honeycomb (2200K), polished copper (specular roughness 0.22, metalness 0.88), warm champagne specular highlights, and directional key lighting.
- **Camera & Scrollytelling Trajectory:** Smooth Catmull-Rom centripetal 3D camera spline (`THREE.CatmullRomCurve3`) easing across Phases 0–5 with Verlet momentum damping and pointer parallax.
- **Quote Engine:** Real-time transparent configurator with mathematically verified Texas 18% catering sales tax (applied to Food + Add-ons + $229 Setup Fee) matching the authoritative `qa_full.py` regression suite, generating instant pre-filled SMS (`832-458-8180`) and Email (`charcuteriechick@outlook.com`) triggers.
- **Generative Asset Pipeline:** Higgsfield SDK integration (Seedance 2.5 culinary motion loops & Soul v2 4K stills) providing hyper-realistic textures and PBR normal/roughness maps with strict server-side credential isolation.
- **Automated Quality & Testing:** Headless Playwright test suite validating desktop (1440x900) and mobile (393x852) with 0 console errors and 0 failed network requests.
- **Edge Deployment:** Zero-build static production deployment to Vercel edge network (`charcuterie-chick-sample-2.vercel.app`).

## Code Layout & Write Boundaries
| File / Directory | Description | Exclusive Write Owner |
|---|---|---|
| `experience.js` | Core WebGL engine, Three.js scene, shaders, lighting, bloom, camera choreography | Milestone 1 (Engine/Shaders) then Milestone 2 (Choreography) |
| `index.html` | DOM markup, HUD navigation, narrative text plates, quote configurator, modal dialogs | Milestone 2 (Narrative/UI) & Milestone 3 (Quote Engine) |
| `experience.css` | Styling, luxury typography, layout, HUD positioning, responsive mobile queries | Milestone 2 (UI/HUD) & Milestone 3 (Configurator) |
| `test_3d_experience.py` | Headless Playwright test suite (desktop 1440x900 & mobile 393x852, zero errors) | E2E Testing Track Orchestrator |
| `img/` | 3D textures, normal maps, video textures, culinary stills | Milestone 4 (Asset Pipeline) |
| `generate_*.py` | Higgsfield SDK generative asset synthesis scripts | Milestone 4 (Asset Pipeline) |
| `vercel.json`, `.gitignore` | Vercel edge deployment configuration and security guards | Milestone 5 (Deployment & Integrity) |

## Feature Inventory
Every feature identified during the Survey phase is mapped to a definitive milestone:

| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| F01 | Persistent Fullscreen 3D Canvas | High-performance WebGL canvas mounting as primary universe | M1 | Survey (ORIGINAL_REQUEST R1) |
| F02 | Pointer & Parallax Interaction | Real-time kinetic camera parallax and cursor follow light | M1, M2 | Survey (ORIGINAL_REQUEST R1) |
| F03 | Inertial Scroll & Momentum Trajectory | Kinetic scroll wheel, touch drag, and nav bar driven camera easing | M2 | Survey (ORIGINAL_REQUEST R1, R2) |
| F04 | Dynamic Fluid / Particle Fields | Real-time GPU particle simulation replacing static 2D cards | M1 | Survey (ORIGINAL_REQUEST R1) |
| F05 | Kinetic Mesh Deformation Shaders | Custom GLSL vertex & fragment shaders creating organic micro-ripples | M1 | Survey (ORIGINAL_REQUEST R1) |
| F06 | Radiant Luminous Lighting Model | Warm amber honeycomb, polished copper, warm champagne, specular highlights | M1 | Survey (ORIGINAL_REQUEST R1) |
| F07 | ACESFilmic Tone Mapping Pipeline | Cinematic color transform preserving vibrant gold highlights without clipping | M1 | Survey (ORIGINAL_REQUEST R1) |
| F08 | Post-Processing Bloom Pass | Selective high-luminance bloom generating radiant halos on flames and honey | M1 | Survey (ORIGINAL_REQUEST R1) |
| F09 | Seamless Shader/Canvas Transitions | Direct in-engine shader/canvas transitions replacing HTML `<video>` element swaps | M1 | Survey (ORIGINAL_REQUEST R1) |
| F10 | 60 FPS Target & DPR Clamping | Frame loop optimization locking steady 60fps across desktop and mobile | M1 | Survey (ORIGINAL_REQUEST R1) |
| F11 | Phase 0: The Micro Seed | Kinetic macro space: prosciutto ribbons, rosemary needles, suspended honey droplets | M2 | Survey (ORIGINAL_REQUEST R2) |
| F12 | Phase 1: The Artisan Board | Gathering scale (10–25 guests) assembling onto black walnut & marble surface | M2 | Survey (ORIGINAL_REQUEST R2) |
| F13 | Phase 2: The Banquet Tables | Room scale (50–150+ guests) through 12-ft candlelit feast with 4 verified tiers | M2 | Survey (ORIGINAL_REQUEST R2) |
| F14 | Phase 3: Mobile Cart & Holy Grail | Flagship cart with glowing Edison bulbs, champagne, and Holy Grail showpiece | M2 | Survey (ORIGINAL_REQUEST R2) |
| F15 | Phase 4: The Heritage | Chef Tricia's 35-yr craft, verified 5.0 Knot/WeddingWire accolades | M2 | Survey (ORIGINAL_REQUEST R2) |
| F16 | Phase 5: Mathematical Quote Engine | Real-time configurator: tiers, setup fee, tax, SMS & email triggers | M3 | Survey (ORIGINAL_REQUEST R2) |
| F17 | Fixed Luxury HUD Navigation | Persistent header with 6 station jump buttons, audio toggle, and direct phone link | M2 | Survey (ORIGINAL_REQUEST R2) |
| F18 | Vertical Journey Rail Indicator | Minimalist progress bar with Act label and scroll percentage indicator | M2 | Survey (ORIGINAL_REQUEST R2) |
| F19 | Spatial HUD Tooltip & Leader Line | 3D-to-2D screen projected inspection card connected via dashed leader line | M2 | Survey (ORIGINAL_REQUEST R2) |
| F20 | 3D Interactive Hotspot Pins | Gem-like glowing micro-orbs with rotating ethereal rings and anchor stems | M2 | Survey (ORIGINAL_REQUEST R2) |
| F21 | Sugar Particle Burst Simulation | 3D physics-driven powdered sugar puff simulation bursting over Zeppole Beignets | M2 | Survey (ORIGINAL_REQUEST R2) |
| F22 | Volumetric Ember Particle Atmosphere | Floating amber, gold, copper, and champagne embers drifting with harmonic sway | M1, M2 | Survey (ORIGINAL_REQUEST R2) |
| F23 | Procedural Web Audio Soundscapes | Web Audio API synthesizer for crackle, singing bowls, and crystal chimes | M2 | Survey (ORIGINAL_REQUEST R2) |
| F24 | Reference Bundle & Shader Extraction | Deconstructing reference physics curves and GLSL passes | M4 | Survey (ORIGINAL_REQUEST R3) |
| F25 | Lusion-Grade Fluid Physics & Damping | Fluid flow simulation and high-order camera damping | M1, M2 | Survey (ORIGINAL_REQUEST R3) |
| F26 | Basement Studio Kinetic Choreography | Snappy scrollytelling pacing with high-impact transitions | M2 | Survey (ORIGINAL_REQUEST R3) |
| F27 | Nue.js Ultra-Clean Reactive Standard | Lightweight reactive DOM synchronization with zero virtual-DOM bloat | M3 | Survey (ORIGINAL_REQUEST R3) |
| F28 | Higgsfield SDK Client Integration | Server-side integration of `@higgsfield/client` / Python `higgsfield_client` | M4 | Survey (ORIGINAL_REQUEST R4) |
| F29 | Seedance 2.5 Motion Texture Synthesis | Higgsfield Seedance 2.5 generative video model for culinary motion textures | M4 | Survey (ORIGINAL_REQUEST R4) |
| F30 | Soul v2 4K Macro Image Generation | Higgsfield Soul v2 model synthesizing 4K macro stills of charcuterie elements | M4 | Survey (ORIGINAL_REQUEST R4) |
| F31 | Texture, Normal & Roughness Pipeline | Processing pipeline converting stills into normal, roughness, and depth maps | M4 | Survey (ORIGINAL_REQUEST R4) |
| F32 | Server-Side API Credential Guard | Strict security isolation keeping all API keys in `.env.local` server-side | M4, M5 | Survey (ORIGINAL_REQUEST R5) |
| F33 | Vercel Production Edge Deployment | Production deployment to Vercel edge network from repo root | M5 | Survey (ORIGINAL_REQUEST R5) |
| F34 | Headless Playwright Desktop Suite | Automated test suite on Chromium at 1440x900 viewport | E2E | Survey (Acceptance Criteria) |
| F35 | Headless Playwright Mobile Suite | Automated test suite on Chromium at 393x852 viewport | E2E | Survey (Acceptance Criteria) |
| F36 | Zero Console Errors Gate | Playwright listener strictly enforcing 0 console errors | E2E | Survey (Acceptance Criteria) |
| F37 | Zero Failed Network Requests Gate | Playwright listener strictly enforcing 0 failed network requests | E2E | Survey (Acceptance Criteria) |
| F38 | Four Verified Grazing Tiers Math | Exact pricing: Graze Me ($24), Standard ($26), Super ($30), Grand ($38) | M3 | Survey (FACTS.md, R2) |
| F39 | 50-Guest Minimum Enforcement | Business rule requiring 50-guest minimum for per-person grazing tables | M3 | Survey (FACTS.md, R2) |
| F40 | Holy Grail Showpiece Pricing Math | Centerpiece pricing: $2,000 for 75 guests; $3,500 for 150 guests | M3 | Survey (FACTS.md, R2) |
| F41 | Flat Mandatory Setup Fee Math | Mandatory production & styling setup fee of $229.00 on every grazing table | M3 | Survey (FACTS.md, R2) |
| F42 | Texas 18% Catering Sales Tax Math | 18% catering tax applied to Food + Add-ons + $229 Setup Fee | M3 | Survey (qa_full.py, R2) |
| F43 | Verified Add-On Stations Math | Beignets ($4.50/pp), Sliders ($2.95/pp), Mimosas ($4.00/pp), Cart ($350) | M3 | Survey (FACTS.md, R2) |
| F44 | Instant SMS Lead Capture Trigger | SMS pre-fill: `sms:+18324588180?body=...` formatted with full quote receipt | M3 | Survey (ORIGINAL_REQUEST R2) |
| F45 | Instant Email Proposal Trigger | Email pre-fill: `mailto:charcuteriechick@outlook.com?subject=...&body=...` | M3 | Survey (ORIGINAL_REQUEST R2) |
| F46 | Prefers-Reduced-Motion Support | Respects OS reduced-motion preferences with smooth static fallbacks | M1, M2 | Survey (MIDNIGHT-BIBLE.md) |

## Milestones

| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| **E2E** | **E2E Testing Track** | Independent opaque-box test infrastructure and Tier 1–4 test cases covering all 46 features, desktop (1440x900) & mobile (393x852), 0 console errors, 0 failed requests. Publishes `TEST_READY.md`. | none | DONE |
| **M1** | **Core WebGL Engine & Shaders** | Three.js r170 fullscreen canvas, custom GLSL shaders (kinetic mesh deformation & fluid particles replacing 2D cards), WebGL VideoTexture replacing HTML `<video>` DOM swapping, selective bloom post-processing, warm amber/copper/champagne lighting model, DPR clamping (60fps). | none | DONE |
| **M2** | **Progressive Scrollytelling Choreography** | Continuous Catmull-Rom spline camera trajectory (`THREE.CatmullRomCurve3`) across Phases 0–5, Verlet momentum damping, 3D interactive hotspots, spatial HUD tooltip with dynamic SVG leader line, sugar burst & ember particle physics, procedural Web Audio. | M1 | PLANNED |
| **M3** | **Mathematical Quote Engine & Lead Capture** | Real-time configurator with exact Texas 18% catering tax math (Food + Add-ons + $229 Setup Fee matching `qa_full.py`), 50-guest minimum enforcement, Holy Grail showpiece pricing, pre-filled SMS (`832-458-8180`) and email (`charcuteriechick@outlook.com`) URL encoding, mobile responsive layout. | M2 | PLANNED |
| **M4** | **Generative Asset Pipeline & Higgsfield Integration** | Seedance 2.5 motion textures and Soul v2 4K stills ingestion as WebGL materials and PBR normal/roughness relief maps. Server-side security guard for `.env.local` credentials. | M1 | PLANNED |
| **M5** | **Final E2E Pass, Hardening & Vercel Edge Deployment** | Phase 1: Pass 100% of E2E test suite (desktop & mobile). Phase 2: Adversarial coverage hardening (Tier 5 challenger loop). Deploy to Vercel production edge network (`charcuterie-chick-sample-2.vercel.app`) with live verification. Final forensic integrity audit. | E2E, M3, M4 | PLANNED |

## Interface Contracts

### WebGL Engine ↔ Scrollytelling Navigation (M1 ↔ M2)
- Function: `window.ScrollytellingEngine.setProgress(progress: number)`
  - Parameter: `progress` clamped to `[0.0, 1.0]`.
  - Behavior: Evaluates Catmull-Rom camera position and lookAt target, updates station indicator, triggers chapter cross-fades.
- Function: `window.ScrollytellingEngine.jumpToStation(index: number)`
  - Parameter: `index` integer `[0, 5]`.
  - Behavior: Smoothly eases progress to station center coordinate `stationProgress[index]`.
- Event: `window.dispatchEvent(new CustomEvent('chapterChange', { detail: { chapterIndex: number } }))`
  - Fired whenever active station changes to synchronize HUD typography and navigation dots.

### Scrollytelling UI ↔ Quote Engine (M2 ↔ M3)
- Function: `window.QuoteEngine.setTier(tierKey: string)`
  - Parameters: `'graze' | 'standard' | 'super' | 'grand' | 'holy'`.
  - Synchronizes selection from Phase 2 Banquet Table cards directly into Phase 5 Configurator state.
- Function: `window.QuoteEngine.calculateQuote(state: QuoteState): QuoteResult`
  - Input: `{ tier: string, guests: number, extraHours: number, addons: string[] }`.
  - Output: `{ foodSubtotal: number, setupFee: 229, extraTimeFee: number, addonsSubtotal: number, taxableSubtotal: number, taxAmount: number, grandTotal: number, smsUrl: string, mailtoUrl: string }`.
  - Mathematical Invariant: `taxableSubtotal = foodSubtotal + addonsSubtotal + setupFee + extraTimeFee`; `taxAmount = Math.round(taxableSubtotal * 18) / 100`; `grandTotal = taxableSubtotal + taxAmount`.

### Generative Asset Pipeline ↔ Three.js Material Loader (M4 ↔ M1)
- Contract: Generated assets stored in `img/` with standardized naming conventions:
  - Video Loops: `img/micro-seed-720p.mp4`, `img/feast-cinematic-720p.mp4`, `img/cart-cinematic-720p.mp4`.
  - Macro Stills & Textures: `img/stage0-macro-seed.webp`, `img/stage1-artisan-board.webp`, `img/stage2-banquet-tables.webp`, `img/stage3-mobile-cart.webp`, `img/stage4-heritage.webp`.
  - Ingested via `THREE.TextureLoader` and `THREE.VideoTexture` with sRGB color space encoding.
