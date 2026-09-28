# Charcuterie Chick WebGL Scrollytelling — Comprehensive Specification Mining Report

**Document Version:** 1.0.0-PROD  
**Timestamp:** 2026-09-26T18:35:00Z  
**Author:** Specification Miner (Survey Explorer 1)  
**Target Project:** Charcuterie Chick Haute Couture 3D Scrollytelling (`sample-2-after-dark`)  
**Client / Owner:** Chef Tricia Holfelder (Charcuterie Chick / The Chick Goodies)  
**Authoritative Specification Source:** `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\ORIGINAL_REQUEST.md`  
**Companion Truth Artifacts:** `clients/chick-goodies/FACTS.md`, `facts.json`, `qa_full.py`, `MIDNIGHT-BIBLE.md`

---

## 1. Executive Summary & Authoritative Hierarchy

This specification mining report deconstructs the authoritative user request and reference standards for the Charcuterie Chick WebGL scrollytelling project.

### Core Objective
Transform Charcuterie Chick's digital presence from static 2D web pages into an **immersive, sensory, Awwwards-caliber WebGL scrollytelling universe** that matches the visual fidelity, fluid physics, and luminous interaction of world-class design benchmarks:
- **Lusion.co** (organic fluid/particle fields, kinetic pointer reactivity)
- **Oryzo.ai** (deep 3D spatial staging, luminous materials, seamless scene transitions)
- **Looper.basement.studio** (camera momentum damping, audio-tactile haptic feedback)
- **Samsy.ninja** (expressive GLSL shader deformations, radiant lighting models)

### Strict Hierarchy of Authority
1. **Level 0 (Inviolable Mandate):** `ORIGINAL_REQUEST.md` (R1–R5, visual/lighting mandates, narrative phases 0–5, Playwright test gates, zero console/network errors, Vercel deployment).
2. **Level 1 (Factual & Mathematical Truth):** `FACTS.md` & `facts.json` (verified chef pedigree, 35-year background, exact published pricing tiers $24, $26, $30, $38, Holy Grail $2,000 / $3,500, flat $229 setup fee, 18% tax, verified contact points 832-458-8180 and charcuteriechick@outlook.com).
3. **Level 2 (Validation Regression Suite):** `qa_full.py` & `qa_midnight.py` (authoritative pricing edge cases, cents-level precision proofs, security against PII/XSS).
4. **Level 3 (Prototype Reference Code):** `experience.js`, `table-cinematic.js`, `experience.css`, `index.html` (existing baseline implementations serving as structural blueprints and gap analysis targets).

---

## 2. Features Discovered

The following matrix documents all discovered functional, non-functional, visual, mathematical, and architectural requirements.

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| **F01** | R1 WebGL Engine | Persistent Fullscreen 3D Canvas | High-performance WebGL canvas mounting as the primary interactive universe across all viewports. | Canvas DOM element `#webgl-canvas`, window resize events. | Initialized Three.js WebGLRenderer context with antialiasing, alpha transparency, and soft shadow mapping. | Graceful fallback message if WebGL is unsupported or context lost. | ORIGINAL_REQUEST.md § R1, Acceptance Criteria |
| **F02** | R1 WebGL Engine | Pointer & Parallax Interaction | Real-time kinetic camera parallax and cursor follow lighting responding to mouse/pointer coordinates. | Pointer position `(clientX, clientY)` normalized to `[-1, 1]`. | Camera position offset `(mouse.x * 0.35, -mouse.y * 0.25)` and cursor light coordinates `(cam.x + mouse.x * 1.5, ...)`. | Clamped to screen boundary, no NaN coordinates. | ORIGINAL_REQUEST.md § R1 |
| **F03** | R1 WebGL Engine | Inertial Scroll & Momentum Trajectory | Kinetic scroll wheel, touch drag, and nav bar driven camera trajectory easing smoothly across narrative stages. | `wheel` deltaY, touchmove `dy/dx`, manual navigation buttons. | Smooth interpolated progress `currentProgress` (lerp factor ~0.085, momentum decay 0.88). | Clamped progress between `[0.0, 1.0]`; no overshoot past Act 0 or Act 5. | ORIGINAL_REQUEST.md § R1, § R2, experience.js |
| **F04** | R1 WebGL Engine | Dynamic Fluid / Particle Fields | Real-time GPU particle or fluid simulation replacing static 2D image cards with living matter. | Particle attributes (position, velocity, lifetime, noise curl), elapsed time clock. | Luminous flowing particles representing Texas wildflower honey, culinary textures, and airborne embers. | Bounded particle counts to protect 60fps on mobile. | ORIGINAL_REQUEST.md § R1 |
| **F05** | R1 WebGL Engine | Kinetic Mesh Deformation Shaders | Custom GLSL vertex and fragment shaders creating organic micro-ripples and tactile depth deformations. | GLSL uniforms: `uTime`, `uPointer`, `uDisplacementMap`, `uNormalMap`. | Dynamic undulating surface meshes (honeycomb viscosity, prosciutto curling). | Fallback to standard PBR material if vertex shader compilation fails. | ORIGINAL_REQUEST.md § R1 |
| **F06** | R1 WebGL Engine | Radiant Luminous Lighting Model | Luxury warm amber, polished copper, and warm champagne lighting model replacing flat dark/black palettes. | Three.js AmbientLight (0x281814), Directional KeyLight (0xffe8ce), PointLights (0xff8a24, 0xff9933), Cool Rim (0x3a5472). | Warm specular highlights, soft shadows (PCFSoftShadowMap), and dynamic sinusoidal candle flame flickering. | Color values clamped, shadow maps capped at 1024x1024 for mobile performance. | ORIGINAL_REQUEST.md § R1, Acceptance Criteria |
| **F07** | R1 WebGL Engine | ACESFilmic Tone Mapping Pipeline | Cinematic color transform preserving vibrant gold highlights without blown-out clipping. | Three.js renderer setting `toneMapping = THREE.ACESFilmicToneMapping`, `exposure = 1.35`. | Rich, high-dynamic-range color reproduction with deep contrast and natural falloff. | None (standard native Three.js feature). | ORIGINAL_REQUEST.md § R1, experience.js |
| **F08** | R1 WebGL Engine | Post-Processing Bloom Pass | Selective high-luminance bloom pass generating soft radiant halos on candle flames, Edison filaments, and glistening honey. | Scene render target, luminance threshold (~0.75), bloom strength (~0.85), bloom radius (~0.4). | Ethereal luminous glow around high-emission elements while keeping text plates crisp. | Disabled or reduced blur passes on low-power mobile GPUs. | ORIGINAL_REQUEST.md § R1, § Acceptance Criteria |
| **F09** | R1 WebGL Engine | Seamless Shader/Canvas Transitions | Direct in-engine shader/canvas transitions between narrative phases, completely eliminating stuttering HTML `<video>` element swaps. | Stage index changes, camera spline positions. | Fluid cross-fade and spatial travel within the single 3D context. | Elimination of video decoding hiccups and mobile battery-saver video pauses. | ORIGINAL_REQUEST.md § R1 |
| **F10** | R1 WebGL Engine | 60 FPS Target & DPR Clamping | Frame loop optimization locking steady 60fps across desktop (1440x900) and mobile (393x852). | Device pixel ratio, requestAnimationFrame delta. | Clamped pixel ratio `Math.min(window.devicePixelRatio, 2.0)`, efficient geometry reuse. | Automatic quality step-down if frames drop below 45fps. | ORIGINAL_REQUEST.md § R1, Acceptance Criteria |
| **F11** | R2 Narrative | Phase 0: The Micro Seed | Kinetic macro space staging single-bite elements: prosciutto ribbons, rosemary needles, and suspended honey droplets. | Station 0 trigger, camera target `(0.0, 0.35, 3.4)`. | Macro 3D visual showcase with interactive tasting notes and glowing amber lighting. | Camera locked to Act 0 boundary on reverse scroll. | ORIGINAL_REQUEST.md § R2 |
| **F12** | R2 Narrative | Phase 1: The Artisan Board | Gathering scale (10–25 guests) showing elements dynamically assembling onto a black walnut & marble surface. | Station 1 trigger, camera target `(9.8, 0.35, 3.4)`. | Centerpiece board showcasing aged Spanish Manchego, French triple-crème brie, and mission figs. | Smooth camera ease from Act 0 to Act 1. | ORIGINAL_REQUEST.md § R2 |
| **F13** | R2 Narrative | Phase 2: The Banquet Tables | Room scale (50–150+ guests) accelerating through an endless 12-foot candlelit feast detailing the 4 verified tiers. | Station 2 trigger, camera target `(20.0, 0.35, 3.6)`. | Interactive tier selector cards displaying $24, $26, $30, and $38 packages with 90-minute grazing specs. | Clicking tier updates both Act 2 cards and Act 5 configurator state. | ORIGINAL_REQUEST.md § R2 |
| **F14** | R2 Narrative | Phase 3: Mobile Cart & Holy Grail | Flagship spectacle introducing Houston’s largest mobile cart, Edison bulbs, champagne cascades, and Holy Grail showpiece ($2,000 / $3,500). | Station 3 trigger, camera target `(29.8, 0.35, 3.4)`. | Glowing cart visualization, Holy Grail highlight, and interactive beignet powdered sugar burst. | Camera positioned to frame cart overhead and centerpiece simultaneously. | ORIGINAL_REQUEST.md § R2 |
| **F15** | R2 Narrative | Phase 4: The Heritage | Authentic tribute to Chef Tricia Holfelder’s 35-year restaurant craft and verified 5.0 Knot/WeddingWire accolades. | Station 4 trigger, camera target `(40.0, 0.35, 3.4)`. | Warm portraiture, scratch-made culinary philosophy, and verified award badges. | Links to external verified reviews opened in secure new tabs. | ORIGINAL_REQUEST.md § R2 |
| **F16** | R2 Narrative | Phase 5: Mathematical Quote Engine | Transparent real-time configurator calculating food, mandatory $229 setup fee, 18% tax, and instant direct SMS/email triggers. | Guest slider (50–300+), tier pills, add-on checkboxes. | Instant line-item receipt breakdown, total cost to the penny, and generated SMS/email URLs. | Rejects guest count < 50 for per-person tiers; flags Holy Grail guest counts. | ORIGINAL_REQUEST.md § R2, Acceptance Criteria |
| **F17** | R2 Narrative | Fixed Luxury HUD Navigation | Persistent luxury header featuring brand mark, 6 station jump buttons, audio toggle, and direct phone link. | User clicks/taps on navigation elements. | Instant or eased transition to requested station, updating active indicators. | Resizes responsively on mobile (393px width) without layout clipping. | ORIGINAL_REQUEST.md § R2, index.html |
| **F18** | R2 Narrative | Vertical Journey Rail Indicator | Minimalist right-hand vertical progress bar showing current Act label and scroll percentage. | Scroll progress `[0.0, 1.0]`. | Animated height bar and dynamic text label (e.g., `00 / THE SEED` to `05 / INSTANT QUOTE`). | Hidden from screen readers via `aria-hidden="true"`. | index.html, experience.js |
| **F19** | R2 Narrative | Spatial HUD Tooltip & Dynamic SVG Leader Line | 3D-to-2D screen-projected inspection card connected via dashed leader line to 3D hotspot reticle. | 3D hotspot position, camera projection matrix, viewport dimensions. | Projected SVG dashed line from 3D object to floating HTML card with tasting notes and badge. | Clamped inside screen viewport `[20px, innerWidth - 300px]` to prevent clipping. | experience.js lines 834–871, test_3d_experience.py |
| **F20** | R2 Narrative | 3D Interactive Hotspot Pins | Gem-like glowing micro-orbs with rotating ethereal rings and anchor stems placed throughout the 3D scene. | Raycasting hover/pointer events, touch taps. | Visual glow modulation, ring rotation, and trigger for Spatial HUD. | Ignores raycasts on non-active chapters to prevent background misclicks. | experience.js lines 325–354 |
| **F21** | R2 Narrative | Confectioners' Sugar Particle Burst | 3D physics-driven powdered sugar puff simulation bursting over Zeppole Beignets upon interaction. | Hotspot click on Beignet node (Station 3). | 140 white additive particles exploding upward and falling with realistic gravity and air drag. | Resets particle velocities after falling below scene threshold. | experience.js lines 533–575 |
| **F22** | R2 Narrative | Volumetric Ember Particle Atmosphere | 320 floating amber, gold, copper, and champagne embers drifting upward through the candlelit scene. | Frame loop update, elapsed time. | Continuous atmospheric depth with subtle harmonic sway. | Wraps particles vertically when exceeding top boundary (`y > 3.5`). | experience.js lines 625–660 |
| **F23** | R2 Narrative | Procedural Web Audio Soundscapes | Zero-asset-dependency Web Audio API synthesizer creating fireplace crackle, singing bowls, and crystal chimes. | User audio toggle click, station transition, hotspot click. | Synthesized audio buffers: crackling pink/brown noise, sine wave harmonic drones, and triangle chime sweeps. | AudioContext created/resumed only after explicit user interaction (browser policy compliant). | experience.js lines 71–222 |
| **F24** | R3 Reverse-Eng | Reference Bundle & Shader Extraction | Systematic toolchain deconstructing reference bundles (Lusion, Basement, Oryzo) for physics curves and GLSL passes. | Reference URLs, scraping tools (`goclone`, `website-downloader`, `ImHex`). | Deconstructed shader source code, particle noise algorithms, and easing curves. | Isolated in offline research; no unlicensed binary code shipped directly. | ORIGINAL_REQUEST.md § R3 |
| **F25** | R3 Reverse-Eng | Lusion-Grade Fluid Physics & Damping | Fluid flow simulation and high-order camera damping modeled after Lusion.co interactive mechanics. | Pointer velocity, scroll inertia. | Silky smooth organic momentum that resists abrupt stops and decelerates naturally. | Clamped velocity to prevent simulation instability. | ORIGINAL_REQUEST.md § R3 |
| **F26** | R3 Reverse-Eng | Basement Studio Kinetic Choreography | Snappy, tactile scrollytelling pacing with high-impact transitions inspired by looper.basement.studio. | Station change events, CTA clicks. | Fast ease-in, gentle ease-out camera movement with synchronized typography reveals. | Cubic easing curve `t < .5 ? 4*t*t*t : 1 - Math.pow(-2*t+2, 3)/2`. | ORIGINAL_REQUEST.md § R3 |
| **F27** | R3 Reverse-Eng | Nue.js Ultra-Clean Reactive Standard | Ultra-lightweight reactive DOM synchronization pattern keeping overhead near zero bytes. | Configurator inputs, station active states. | Direct DOM node updates without massive framework virtual-DOM overhead. | Zero memory leaks from orphaned listeners. | ORIGINAL_REQUEST.md § R3 |
| **F28** | R4 Generative Assets | Higgsfield SDK Client Integration | Server-side integration of `@higgsfield/client` / Python `higgsfield_client` for generative asset synthesis. | Prompt definitions, model selection (`Seedance 2.5`, `Soul v2`). | Generated asset URLs, high-resolution media streams. | Server-side execution only; API keys never exposed to client browser. | ORIGINAL_REQUEST.md § R4 |
| **F29** | R4 Generative Assets | Seedance 2.5 Motion Texture Synthesis | Higgsfield Seedance 2.5 generative video model synthesizing hyper-realistic culinary motion textures. | High-fidelity culinary prompts (honey dripping, effervescent champagne bubbles, candle flicker). | Video loops and motion textures used as animated WebGL textures or shader inputs. | Pre-rendered or cached locally to eliminate runtime API latency. | ORIGINAL_REQUEST.md § R4 |
| **F30** | R4 Generative Assets | Soul v2 4K Culinary Macro Image Generation | Higgsfield Soul v2 model synthesizing 4K macro stills of charcuterie elements. | Detailed culinary prompts (aged manchego crystal structure, marbled prosciutto fat ribbons). | Ultra-sharp 4K stills used for 3D model textures, diffuse maps, and specular detail. | WebP compression and mipmapping applied to maintain instant load times. | ORIGINAL_REQUEST.md § R4 |
| **F31** | R4 Generative Assets | Texture, Normal, Roughness & Depth Pipeline | Image processing pipeline converting generative stills into normal, roughness, and displacement/depth maps. | 4K macro stills, edge/height extraction shaders. | Multi-channel PBR texture sets applied to Three.js materials (`MeshStandardMaterial`). | Graceful fallback to default PBR roughness/metalness if normal map fails to load. | ORIGINAL_REQUEST.md § R4 |
| **F32** | R5 Infrastructure | Server-Side API Credential Guard | Strict security isolation keeping all API keys in `.env.local` strictly server-side. | `.env.local` environment file, Git commit pre-hooks, `.gitignore`. | Zero credentials in browser bundle, zero keys printed in logs or terminal output. | Build fails if API keys are detected in client-side code bundles. | ORIGINAL_REQUEST.md § R5 |
| **F33** | R5 Infrastructure | Vercel Production Edge Deployment | Production deployment to Vercel edge network from repository root. | Command `vercel --prod --yes`, project name `charcuterie-chick-sample-2`. | Live production deployment at `https://charcuterie-chick-sample-2.vercel.app`. | Automatic rollback or build failure notification on deployment errors. | ORIGINAL_REQUEST.md § R5, Acceptance Criteria |
| **F34** | Acceptance Gate | Headless Playwright Desktop Suite | Automated opaque-box end-to-end test suite executing on Chromium at 1440x900 viewport. | Test script `test_3d_experience.py`, target URL `http://127.0.0.1:<port>`. | Verified canvas mount, 6 station transitions, spatial HUD tooltip, beignet burst, receipt math. | Fails if any test step assertions fail. | ORIGINAL_REQUEST.md § Acceptance Criteria |
| **F35** | Acceptance Gate | Headless Playwright Mobile Suite | Automated opaque-box end-to-end test suite executing on Chromium at 393x852 viewport (iPhone standard). | Mobile viewport `{width: 393, height: 852}`, mobile user agent. | Verified canvas visibility, mobile touch navigation, responsive quote card layout, no horizontal overflow. | Fails if layout breaks or mobile canvas fails to render. | ORIGINAL_REQUEST.md § Acceptance Criteria |
| **F36** | Acceptance Gate | Zero Console Errors Enforcement Gate | Playwright listener strictly monitoring `page.on("console")` for error-level logs. | Browser console messages. | Zero console errors logged across entire scrollytelling journey (`len(console_errors) == 0`). | Test suite immediately asserts fail if error count > 0. | ORIGINAL_REQUEST.md § Acceptance Criteria |
| **F37** | Acceptance Gate | Zero Failed Network Requests Gate | Playwright listener monitoring `page.on("requestfailed")` across all static assets, shaders, and fonts. | Network request lifecycle events. | Zero failed network requests (`len(failed_requests) == 0`, ignoring deliberate media aborts). | Test suite asserts fail if any texture, script, or font 404s or fails. | ORIGINAL_REQUEST.md § Acceptance Criteria |
| **F38** | Math & Financial | Four Verified Per-Person Grazing Tiers | Exact pricing calculations for the 4 verified tiers: Graze Me ($24), Standard ($26), Super ($30), Grand ($38). | Guest count `N` (min 50), Tier rate `$R \in \{24, 26, 30, 38\}`. | Food Subtotal $= N \times R$. | Disallows guest counts below 50. | ORIGINAL_REQUEST.md § R2, FACTS.md |
| **F39** | Math & Financial | 50-Guest Minimum Enforcement | Strict business rule requiring a 50-guest minimum for all per-person grazing tables. | Guest count input slider/field. | Slider floor set to 50; if value < 50 submitted, displays warning / custom quote requirement. | Blocks standard per-person quote generation for < 50 guests. | FACTS.md, qa_full.py line 76 |
| **F40** | Math & Financial | Holy Grail Fixed Showpiece Pricing | Fixed centerpiece pricing: $2,000 for 75 guests; $3,500 for 150 guests. | Package selection `holy`, guest count 75 or 150. | Subtotal = $2,000.00 (75 guests) or $3,500.00 (150 guests). | If guest count $\notin \{75, 150\}$, flags that custom quote is required or snaps to nearest bracket. | ORIGINAL_REQUEST.md § R2, FACTS.md, qa_full.py |
| **F41** | Math & Financial | Flat Mandatory Setup Fee | Mandatory production & styling setup fee of $229.00 applied to every grazing table. | Event quote calculation trigger. | Line-item entry: `Production & Styling Setup: $229.00`. | Always present on grazing tables; cannot be unselected or discounted to $0. | ORIGINAL_REQUEST.md § R2, FACTS.md |
| **F42** | Math & Financial | Texas 18% Catering Sales Tax | Verified 18% catering sales tax applied to total taxable catering receipts. | Taxable base $= \text{Food} + \text{Add-ons} + \text{Setup Fee} + \text{Extra Time}$. | Tax $= \text{Taxable Base} \times 0.18$. Line item: `Texas State Tax (18% Catering)`. | Exact cent rounding `Math.round(base * 18) / 100`. | ORIGINAL_REQUEST.md § R2, FACTS.md, qa_full.py |
| **F43** | Math & Financial | Verified Add-On Stations Math | Optional culinary stations calculated per person or flat: Beignets ($4.50/pp), Sliders ($2.95/pp), Mimosas ($4.00/pp), Cart ($350 flat). | Checkbox states, guest count `N`. | Add-ons subtotal added to taxable base before tax calculation. | Unchecked add-ons contribute $0.00. | index.html, FACTS.md |
| **F44** | Math & Financial | Instant SMS Lead Capture Trigger | Dynamic SMS deep-link pre-filling complete quote receipt directly into SMS client to Chef Tricia's cell. | Guest count, tier, add-ons, setup fee, tax, total. | `href="sms:+18324588180?body=..."` formatted with greeting, line items, and availability check. | Special characters and line breaks properly URI-encoded. | ORIGINAL_REQUEST.md § R2, Acceptance Criteria |
| **F45** | Math & Financial | Instant Email Proposal Trigger | Dynamic mailto link pre-filling structured formal proposal into user's mail client to Tricia. | Guest count, tier, add-ons, setup fee, tax, total. | `href="mailto:charcuteriechick@outlook.com?subject=...&body=..."` with formatted business proposal. | Special characters properly URI-encoded. | ORIGINAL_REQUEST.md § R2, Acceptance Criteria |
| **F46** | Accessibility | Prefers-Reduced-Motion Support | Accessibility gate respecting user's operating system reduced-motion preference. | `window.matchMedia('(prefers-reduced-motion: reduce)')`. | Pauses ambient particle sway, slows camera damping, disables sudden bursts. | Ensures all text plates and configurator remain 100% accessible. | MIDNIGHT-BIBLE.md, experience.js |

---

## 3. Edge Cases

The following matrix documents all identified boundary conditions, extreme inputs, and edge behaviors.

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| **E01** | Guest Count Minimum | Guest count $= 49$ (below 50-guest minimum) for per-person grazing table. | Configurator slider range is clamped to `min="50"`. If manually inputted or passed via query param, system displays notice: *"Per-person tables have a 50-guest minimum. Request a custom quote for a smaller occasion."* Standard quote calculation is gated. |
| **E02** | Guest Count Non-Integer / Extreme | Guest count $= 50.5$, $-1$, `""`, or $10,001$. | System validates `Number.isSafeInteger(count) && count >= 1 && count <= 10000`. Invalid inputs display error banner and suppress total calculation to prevent NaN or negative totals. |
| **E03** | Holy Grail Guest Brackets | Holy Grail selected with guest count $= 74, 100,$ or $151$. | In client source `qa_full.py`, Holy Grail is strictly published for exactly 75 ($2,000) or 150 ($3,500) guests. In `experience.js`, values $\le 75$ evaluated to $2,000 and $> 75$ to $3,500$. Specification requires explicit notice if guest count is between brackets or above 150: *"Holy Grail is published for 75 or 150 guests. Custom quote prepared for other counts."* |
| **E04** | 18% Catering Tax Base | Inclusion of $229 setup fee in taxable base. | **Discrepancy resolved:** In `qa_full.py` and `midnight.js`, tax is computed as `Math.round((food + setup + extra) * 0.18)` (Texas catering sales tax law applies to mandatory setup fees). In early `experience.js` prototype, tax was calculated on food only `(tierSubtotal * 0.18)`. Authoritative truth from `qa_full.py` line 72 confirms: For Graze 50 guests, Food $= \$1,200$, Setup $= \$229$, Subtotal $= \$1,429$, Tax $(18\%) = \$257.22$, Total $= \$1,686.22$. The engine must calculate tax across both food and setup fee. |
| **E05** | Add-on Pricing Models | Mixing per-person add-ons (Beignets $\$4.50 \times N$) and flat add-ons (Midnight Cart $\$350$). | Formula correctly bifurcates add-ons: per-person items scale dynamically with slider value `N`, while flat equipment fees remain constant. Taxable subtotal $= \text{Food} + \sum (\text{pp\_addons} \times N) + \sum (\text{flat\_addons}) + \$229$. |
| **E06** | SMS URI Character Encoding | Quotation body contains newlines (`\n`), ampersands (`&`), dollar signs (`$`), and pluses (`+`). | Must use `encodeURIComponent()`. iOS and Android message handlers fail if ampersands or raw spaces appear in `sms:body`. Target format: `sms:+18324588180?body=...` (or `sms:8324588180?body=...`). |
| **E07** | Email Proposal Subject & Body | Client mailto link with multi-line proposal. | Must use `encodeURIComponent()`. Recipient locked to `charcuteriechick@outlook.com`. Subject pre-filled with `Charcuterie Chick Event Quote — [N] Guests ([Tier])`. |
| **E08** | Mobile Viewport Layout (393x852) | iPhone mobile screen with virtual address bar and small viewport width. | High-DPI screens can trigger GPU fill-rate collapse. Renderer pixel ratio clamped to `Math.min(window.devicePixelRatio, 2.0)`. Fullscreen canvas `#webgl-canvas` positioned fixed with `inset: 0`. Calculator plate uses single-column flex layout to prevent horizontal overflow. |
| **E09** | WebGL Context Loss | Mobile background tab switching or device sleep. | Browser triggers `webglcontextlost`. Renderer must prevent default `event.preventDefault()` and re-initialize textures/geometry upon `webglcontextrestored`. |
| **E10** | High-DPI Canvas Memory Overdraw | 3x Retina display (e.g. iPhone Pro 393x852 @ 3x = 1179x2556 render buffer). | Without clamping, canvas allocates massive framebuffers. Enforcing `renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))` preserves 60fps performance and prevents browser crash. |
| **E11** | Spatial HUD Tooltip Viewport Clipping | Hotspot located at far right or bottom edge of 3D canvas. | Screen projection `screenVector.project(camera)` converts 3D to 2D. Clamping logic: `tipX = Math.min(window.innerWidth - 300, Math.max(20, x + 35))` and `tipY = Math.min(window.innerHeight - 160, Math.max(85, y - 50))` guarantees tooltip is never pushed off-screen on mobile. |
| **E12** | Background Video Swap Stutter | Scrolling between stations causing HTML5 `<video>` decode lag. | **Authoritative Mandate (R1):** HTML5 video element swapping (`#bg-video-a` / `#bg-video-b`) is explicitly superseded by pure WebGL shader/canvas rendering. Using GPU procedural shaders or WebGL video textures inside the canvas eliminates DOM video swap stutter and mobile video autoplay blocks. |
| **E13** | Web Audio Autoplay Policy | User lands on page without clicking; audio attempts to start. | Browsers block unprompted audio autoplay. Audio context initialized in `suspended` state and resumed only on explicit user click (`btn-audio`, hotspot click, or nav click). |
| **E14** | Rapid Inertial Scroll Momentum | User spins trackpad/mouse wheel rapidly from Act 0 to Act 5. | Momentum decay `scrollVelocity *= 0.88` with boundary clamping `targetProgress = Math.max(0, Math.min(1, targetProgress))` prevents NaN trajectory and camera flipping. |
| **E15** | Environment Variable Leakage | `.env.local` containing Higgsfield or Vercel API tokens. | Must never be bundled in client JavaScript. Verified by inspecting client bundles to ensure zero `process.env` or credential string leaks. |

---

## 4. Deep-Dive Section 1: R1 Living WebGL Sensory Environment & Shaders

### 4.1 The Lusion Standard
The user request mandates matching the interactive fidelity of **Lusion.co**:
- A real-time 3D universe that **responds kinetically** to pointer motion, scroll velocity, and touch gestures.
- Dynamic fluid/particle fields or custom GLSL shaders that replace flat, static 2D image cards.
- Radiant, luminous lighting palette: warm amber honeycomb (`0xff8a24`), polished copper (`0xd49366`), warm champagne (`0xffe8ce`), and gleaming gold leaf (`0xf2be77`), completely eradicating dull or muddy black palettes.

### 4.2 WebGL Pipeline Specifications
1. **Renderer Configuration:**
   ```javascript
   const renderer = new THREE.WebGLRenderer({
     canvas,
     antialias: true,
     powerPreference: 'high-performance',
     alpha: true
   });
   renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
   renderer.setSize(window.innerWidth, window.innerHeight);
   renderer.outputColorSpace = THREE.SRGBColorSpace;
   renderer.toneMapping = THREE.ACESFilmicToneMapping;
   renderer.toneMappingExposure = 1.35;
   renderer.shadowMap.enabled = true;
   renderer.shadowMap.type = THREE.PCFSoftShadowMap;
   ```
2. **Lighting Architecture:**
   - **Key Light:** DirectionalLight (`0xffe8ce`, intensity `3.4`) at `(5, 12, 8)`, casting soft shadows with `shadow.mapSize = 1024x1024`, bias `-0.0005`.
   - **Ambient Fill:** AmbientLight (`0x281814`, intensity `2.2`) delivering deep warm copper undertones.
   - **Cool Rim Light:** DirectionalLight (`0x3a5472`, intensity `1.4`) at `(-8, 6, -8)` balancing warm amber with a crisp sommelier reflection.
   - **Cursor Follow Light:** PointLight (`0xff9d47`, intensity `4.5`, distance `9`, decay `2`) tracking pointer coordinates to illuminate 3D elements dynamically.
   - **Flickering Candle Cluster:** 6 PointLights (`0xff8a24`, `0xff9933`) positioned along the banquet table with compound sine wave modulation (`sin(6t) * 0.4 + cos(11t) * 0.25`).
3. **Selective Post-Processing Bloom Pass:**
   - UnrealBloomPass (or dual-filtering blur pass) targeting luminance $> 0.75$.
   - Generates ethereal glows around candle flames, Edison filament bulbs, and specular honey droplets while maintaining razor-sharp legibility on text plates.
4. **Shader & Canvas State Transitions:**
   - Eliminates choppy HTML `<video>` swaps in favor of continuous WebGL camera spline interpolation and GLSL shader cross-fading.

---

## 5. Deep-Dive Section 2: R2 Progressive Scale Storytelling Narrative (Phases 0–5)

The experience choreographs an unbroken dimensional scale growth across 6 distinct acts:

### Act 0: The Micro Seed (Macro Scale)
- **Spatial Concept:** Single bite in microscopic space.
- **Visual Assets & Shaders:** Suspended Texas wildflower honey droplets with refractive caustics, folded prosciutto ribbons with micro-marbling, and organic garden rosemary needles.
- **Tasting Hotspots:**
  1. *Raw Texas Wildflower Honey* (Montgomery County apiaries, golden viscosity).
  2. *Organic Fresh Cut Rosemary* (herbaceous pine aromatic notes).
  3. *Folded Prosciutto Ribbon* (imported San Daniele cured ham shaved paper-thin).
- **Camera Staging:** `camPos: [0.0, 0.35, 3.4]`, `lookAt: [0.8, 0.05, 0.0]`.

### Act 1: The Artisan Board (Gathering Scale: 10–25 Guests)
- **Spatial Concept:** Gathering scale assembling onto a black walnut and marble platter.
- **Visual Assets:** Triple-crème brie with honeycomb drizzle, 12-month cave-aged Spanish Manchego (D.O.P.), fresh mission figs with balsamic glaze, sommelier crystal stemware.
- **Features Highlighted:** Two signature sliders per guest, scratch seasonal fruit jellies, roasted and raw vegetable crudités.
- **Camera Staging:** `camPos: [9.8, 0.35, 3.4]`, `lookAt: [9.0, 0.05, 0.0]`.

### Act 2: The Banquet Tables (Room Scale: 50–150+ Guests)
- **Spatial Concept:** Accelerating into an endless 12-foot continuous candlelit feast.
- **Visual Assets:** Long black walnut banquet table adorned with glowing taper candles, copper chargers, cascading grape clusters, and abundant meat/cheese waves.
- **The 4 Verified Tiers:**
  1. **"Graze Me, Craze Me" ($24/pp):** 2 sliders (30 of each), cured meats, cheeses, fruit, hummus, almonds, 2 salads, roasted & raw vegetables, 1 dip.
  2. **"Grazing Standard" ($26/pp):** All of above + second hummus, 2 dips, pasta salad, potato, sweet-potato & tortilla chips.
  3. **"Super Graze" ($30/pp):** 3 sliders (25 each), 3 salads, 3 dips, 2 hummus, nuts, chips, full vegetable spread.
  4. **"Grand Graze" ($38/pp):** 5 sliders, 4 salads, 3 dips, 2 hummus, 2 nuts, chips, mini pudding cups (Oreo, butterscotch, banana).
- **Service Specs:** 90 minutes grazing; no chafing dishes; extra time $3/pp per 30 minutes.
- **Camera Staging:** `camPos: [20.0, 0.35, 3.6]`, `lookAt: [20.8, 0.05, 0.0]`.

### Act 3: The Mobile Cart & The Holy Grail (Flagship Spectacle)
- **Spatial Concept:** Houston's largest charcuterie cart arrives with ambient Edison filament bulbs and champagne cascades.
- **The Holy Grail Centerpiece:**
  - $2,000 for 75 guests · $3,500 for 150 guests.
  - Multi-tier cascading boards, 5 cheeses, 5 meats, 2 sliders (50 each), 2 salads, 3 dips, 2 hummus, 2 nuts, guacamole, pico de gallo, chips, floral table runners.
- **Interactive Highlight:** Zeppole Beignets ($4.50/pp) with a clickable **3D Confectioners' Sugar Particle Burst** (140 additive particles with gravity and velocity physics).
- **Specialty Stations:** Taco Cart ($26.95), Slider Bar ($2.95/ea), Mimosa & Bloody Mary bars ($4.00–$6.50).
- **Camera Staging:** `camPos: [29.8, 0.35, 3.4]`, `lookAt: [29.0, 0.05, 0.0]`.

### Act 4: The Heritage (Chef Tricia Holfelder)
- **Spatial Concept:** Authentic culinary pedigree and verified accolades.
- **Story Elements:** 35 years in Texas restaurant kitchens (front-of-house and back-of-house), scratch-made sourdough, compound butters, and small-batch preserves in Tomball, TX.
- **Verified Accolades:**
  - **The Knot:** 5.0 Stars (13 verified reviews) · *Best of Weddings 2026*.
  - **WeddingWire:** 5.0 Stars (11 verified reviews) · *Couples' Choice 2026* · 100% Recommended.
- **Camera Staging:** `camPos: [40.0, 0.35, 3.4]`, `lookAt: [40.8, 0.05, 0.0]`.

### Act 5: Real-Time Mathematical Quote Engine
- **Spatial Concept:** High-conversion interactive event calculator transparent to the penny.
- **Controls:**
  - Guest count slider (50 to 300+ guests, step 5).
  - Menu tier selector pills ($24, $26, $30, $38, and Holy Grail).
  - Add-on checkboxes (Zeppole Beignets +$4.50/pp, Midnight Cart +$350 flat, Extra Sliders +$2.95/pp, Mimosa Bar +$4.00/pp).
- **Real-Time Receipt Card:**
  - Selected Tier Subtotal: $N \times \text{Rate}$ (or Holy Grail package rate).
  - Add-ons Subtotal.
  - Production & Styling Setup Fee: **$229.00** flat.
  - Texas Catering Sales Tax: **18%** on total taxable receipts.
  - Total Estimated Cost.
- **Direct Lead Triggers:**
  - **SMS Trigger:** `sms:+18324588180?body=...` (direct to Tricia's cell).
  - **Email Trigger:** `mailto:charcuteriechick@outlook.com?subject=...&body=...`.
- **Camera Staging:** `camPos: [50.0, 0.65, 5.5]`, `lookAt: [50.0, 0.00, 0.0]`.

---

## 6. Deep-Dive Section 3: R3 Reference Inspection & Reverse-Engineering Standards

The orchestrator and technical graphics teams must deconstruct and emulate proven design patterns from reference resources:

### Technical Reference Benchmarks
1. **Lusion.co:**
   - Dynamic fluid simulations interacting with mouse pointer coordinates.
   - Smooth camera spline damping with high-inertia momentum.
2. **Looper.basement.studio:**
   - Snappy camera movements and tactile audio-visual synchronization.
   - Deep contrast lighting and high-speed motion responsiveness.
3. **Oryzo.ai:**
   - Volumetric particle atmosphere, rich glowing materials, and depth sorting.
4. **Samsy.ninja:**
   - Advanced GLSL shader passes, organic vertex displacement, and lighting reflections.

### Tooling Patterns
- **Bundle & Asset Extraction:** `goclone`, `website-downloader`, `wtsxDev/reverse-engineering`, and `ImHex` for deconstructing WebGL bundles, GLSL shaders, and buffer geometries.
- **Multi-Agent Orchestration:** `keli-wen/agy-staff` patterns for clean subagent division of labor.
- **Reactive Performance:** `nuejs/nue` minimalist reactive architecture to update DOM receipts without framework bloat.
- **Visual Synthesis:** `Nutlope/inspo`, `builtbyV/ai-website-builder`, and `emilwallner/Screenshot-to-code`.

---

## 7. Deep-Dive Section 4: R4 Generative Asset Synthesis Pipeline (Higgsfield Models)

### Generative Asset Requirements
The user request mandates using the **Higgsfield SDK** (`@higgsfield/client` or Python `higgsfield_client`) to generate hyper-realistic culinary motion textures and 4K macro stills:

1. **Model Stack:**
   - **Higgsfield Seedance 2.5:** Generates dynamic culinary motion textures (dripping wildflower honey, shimmering champagne bubbles, soft candle flame flicker).
   - **Higgsfield Soul v2:** Synthesizes 4K culinary macro photography with micro-detail (parma prosciutto fat grain, manchego cheese tyrosine crystals, fresh rosemary resin glands).
2. **Asset Processing Pipeline:**
   - Macro stills converted into PBR texture maps:
     - **Base Color / Diffuse Map:** sRGB color space.
     - **Roughness Map:** Linear gray space controlling specular highlight width.
     - **Normal / Depth Map:** Tangent-space normal maps driving fine surface bump details on 3D meshes.
     - **Emissive Map:** Specifying glowing elements (candle wicks, filament cores, hotspot gems).
3. **Runtime Integration:**
   - Textures loaded via `THREE.TextureLoader` with mipmapping (`LinearMipmapLinearFilter`) and WebP compression for lightning-fast delivery.

---

## 8. Deep-Dive Section 5: R5 Controlled Infrastructure, Security & Deployment

### Security Mandates
- **Zero API Key Leakage:** Higgsfield, Vercel, or other third-party API credentials stored in `.env.local` must remain strictly server-side.
- **Git Protection:** Credentials must never be logged, printed to console/stdout, or committed to Git.
- **.gitignore Enforcement:** `.env*`, `test-output/`, and local credentials must be explicitly excluded in `.gitignore`.

### Deployment Pipeline
- **Platform:** Vercel Production Edge Network.
- **Target Project:** `charcuterie-chick-sample-2`.
- **Deployment Command:** Executed from repo root:
  ```bash
  vercel --prod --yes
  ```
- **Live Production URL:** `https://charcuterie-chick-sample-2.vercel.app`.
- **Vercel Configuration (`vercel.json`):**
  ```json
  {
    "$schema": "https://openapi.vercel.sh/vercel.json",
    "framework": null,
    "installCommand": "echo skip",
    "buildCommand": "echo skip",
    "outputDirectory": "."
  }
  ```

---

## 9. Deep-Dive Section 6: Mathematical & Financial Formulation

### Authoritative Formulas

Let:
- $N$ = Number of guests ($N \ge 50$ for per-person grazing tables).
- $R$ = Per-person tier rate ($\$24, \$26, \$30, \$38$).
- $S$ = Mandatory production & styling setup fee ($S = \$229.00$).
- $A_{\text{pp}}$ = Sum of per-person add-on rates (Beignets $\$4.50$, Extra Sliders $\$2.95$, Mimosa Bar $\$4.00$, etc.).
- $A_{\text{flat}}$ = Sum of flat add-ons (Midnight Cart Service $\$350.00$).
- $T_{\text{rate}}$ = Texas catering sales tax rate ($18\% = 0.18$).

#### 1. Per-Person Tier Subtotal
$$\text{Food Subtotal} = N \times R$$

#### 2. Holy Grail Showpiece Subtotal
$$\text{Holy Grail Subtotal} = \begin{cases} \$2,000.00 & \text{if } N \le 75 \\ \$3,500.00 & \text{if } 75 < N \le 150 \end{cases}$$

#### 3. Add-Ons Subtotal
$$\text{Add-ons Total} = (N \times A_{\text{pp}}) + A_{\text{flat}}$$

#### 4. Taxable Gross Receipts & 18% Catering Sales Tax
In Texas tax law and authoritative test cases (`qa_full.py`), mandatory setup and delivery fees are part of taxable catering receipts:
$$\text{Taxable Base} = \text{Food Subtotal} + \text{Add-ons Total} + S$$
$$\text{Tax} = \text{Taxable Base} \times 0.18$$

#### 5. Total Estimated Investment
$$\text{Total} = \text{Taxable Base} + \text{Tax}$$

### Mathematical Regression Verification Table
Cross-referenced against `qa_full.py` line 72:

| Menu Tier | Guests ($N$) | Extra Time (hrs) | Food Base | Setup Fee | Subtotal (Taxable Base) | 18% Tax | Total Cost | Status in `qa_full.py` |
|---|---|---|---|---|---|---|---|---|
| **Graze Me, Craze Me ($24)** | 50 | 0 | $1,200.00 | $229.00 | $1,429.00 | $257.22 | **$1,686.22** | Verified Exact Match |
| **Grazing Standard ($26)** | 50 | 0 | $1,300.00 | $229.00 | $1,529.00 | $275.22 | **$1,804.22** | Verified Exact Match |
| **Super Graze ($30)** | 50 | 0 | $1,500.00 | $229.00 | $1,729.00 | $311.22 | **$2,040.22** | Verified Exact Match |
| **Grand Graze ($38)** | 50 | 0 | $1,900.00 | $229.00 | $2,129.00 | $383.22 | **$2,512.22** | Verified Exact Match |
| **Graze Me ($24)** + 1hr extra | 50 | 1 hr (2×30m) | $1,500.00 | $229.00 | $1,729.00 | $311.22 | **$2,040.22** | Verified Exact Match |
| **Holy Grail (75 guests)** | 75 | 0 | $2,000.00 | $229.00 | $2,229.00 | $401.22 | **$2,630.22** | Verified Exact Match |
| **Holy Grail (150 guests)** | 150 | 0 | $3,500.00 | $229.00 | $3,729.00 | $671.22 | **$4,400.22** | Verified Exact Match |
| **Holy Grail (150)** + 2hr extra | 150 | 2 hrs (4×30m) | $5,300.00 | $229.00 | $5,529.00 | $995.22 | **$6,524.22** | Verified Exact Match |

### Lead Capture Trigger Specification
1. **SMS Trigger Format:**
   ```
   sms:+18324588180?body=Hi%20Tricia!%20I'm%20planning%20an%20event%20for%2075%20guests%20using%20your%203D%20builder.%0ATier:%20Graze%20Me%2C%20Craze%20Me%20(75%20%C3%97%20%2424)%0AEstimated%20Total:%20%242%2C394.22%20(inc.%20setup%20%26%20tax).%0AIs%20my%20date%20available%3F
   ```
2. **Email Trigger Format:**
   ```
   mailto:charcuteriechick@outlook.com?subject=Charcuterie%20Chick%20Event%20Quote%20%E2%80%94%2075%20Guests%20(Graze%20Me)&body=Hi%20Chef%20Tricia%2C...
   ```

---

## 10. Deep-Dive Section 7: Acceptance Criteria & Test Matrices

### Opaque-Box Acceptance Testing Matrix

| Test Suite ID | Viewport | Target Device | Mandatory Assertions | Quality Gate Threshold |
|---|---|---|---|---|
| **E2E-DESK-01** | $1440 \times 900$ | Desktop Chromium | 1. `#webgl-canvas` mounted and visible.<br>2. Acts 0–5 navigate without frame stalls.<br>3. Spatial HUD tooltip and leader line appear on hotspot focus.<br>4. Beignet hotspot click triggers sugar particle burst.<br>5. Act 5 configurator produces verified mathematical total.<br>6. SMS and Email triggers contain valid URI-encoded strings. | **0 console errors**<br>**0 failed requests**<br>60fps target |
| **E2E-MOBL-02** | $393 \times 852$ | Mobile Chromium (iPhone standard) | 1. 3D WebGL Canvas renders properly on mobile.<br>2. Touch drag and swipe advance story stations smoothly.<br>3. Calculator plate fits within 393px width with zero horizontal clipping.<br>4. Spatial HUD clamps within mobile screen boundaries.<br>5. Clamped device pixel ratio ($\le 2.0$) prevents GPU exhaustion. | **0 console errors**<br>**0 failed requests**<br>60fps target |
| **VERCEL-PROD** | Live Edge | Production Network | 1. Live site at `https://charcuterie-chick-sample-2.vercel.app`.<br>2. HTTP 200 on all assets, scripts, textures, and fonts.<br>3. Zero exposed API credentials in HTML or JS bundles.<br>4. Playwright test suite passes against production URL. | **Production Green** |

---

## 11. Conclusion & Implementation Recommendations

1. **Replace Background Video Swaps with Pure WebGL:** Transition away from the prototype's `#bg-video-a` / `#bg-video-b` HTML element swapping to GPU-accelerated shader flows, procedural honey/particle simulations, or WebGL-rendered video textures. This directly fulfills R1's requirement for "seamless shader/canvas transitions rather than stuttering HTML <video> element swaps".
2. **Implement Post-Processing Bloom:** Integrate Three.js `EffectComposer` with `UnrealBloomPass` to give the candles, Edison bulbs, and honeycomb droplets their luminous halos.
3. **Harmonize Tax Calculation:** Update `experience.js` line 978 to calculate the 18% catering tax on the subtotal including the $229 setup fee, matching the authoritative client benchmark in `qa_full.py` (`tax = Math.round((food + setup + addons) * 0.18)`).
4. **Harden Mobile Viewport:** Ensure mobile touch gestures feel silky smooth and DPR is clamped to prevent high-resolution mobile devices from experiencing frame drops.
5. **Secure Environment Variables:** Ensure `.gitignore` ignores `.env*` files to protect Higgsfield and deployment secrets.
