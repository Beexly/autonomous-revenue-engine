# Original User Request

## 2026-09-26T18:30:02Z

Build an immersive, sensory, Awwwards-caliber WebGL scrollytelling experience for Charcuterie Chick (Chef Tricia Holfelder) matching the visual fidelity, fluid physics, and luminous interaction of Lusion.co, Oryzo, and Basement Studio.

Working directory: C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark
Integrity mode: development

## Reference Standards & Reverse-Engineering Resources
- Aesthetic & Interaction Standards: https://lusion.co/, https://oryzo.ai/, https://looper.basement.studio/, https://samsy.ninja/
- Reverse-Engineering & Asset Extraction References:
  - Asset & bundle extraction patterns (https://github.com/goclone-dev/goclone, https://github.com/Desertbetweenalembic/website-downloader, https://github.com/wtsxDev/reverse-engineering, https://github.com/WerWolv/ImHex, https://github.com/JCodesMore/ai-website-cloner-template)
  - Multi-agent orchestration (https://github.com/keli-wen/agy-staff)
  - Ultra-clean reactive performance (https://github.com/nuejs/nue)
  - Visual generation & curation (https://github.com/Nutlope/inspo, https://github.com/builtbyV/ai-website-builder, https://github.com/emilwallner/Screenshot-to-code)

## Requirements

### R1. Living WebGL Sensory Environment (Lusion Standard)
Deliver a real-time WebGL world that responds kinetically to user pointer motion, scroll velocity, and interaction:
- Dynamic fluid/particle fields, kinetic mesh deformation, or custom GLSL shaders replacing flat 2D image cards.
- Radiant, luminous lighting model (warm amber honeycomb, polished copper, warm champagne, specular highlights, and ACESFilmic tone mapping with post-processing bloom) completely replacing muddy or dark black palettes.
- Buttery 60fps rendering with seamless shader/canvas transitions rather than stuttering HTML <video> element swaps.

### R2. Progressive Scale Storytelling Narrative
Choreograph an unbroken scrollytelling journey illustrating dimensional scale growth:
- Phase 0 (The Micro Seed): Prosciutto ribbons, rosemary needles, and suspended Texas wildflower honey droplets in kinetic macro space.
- Phase 1 (The Artisan Board): Elements assemble dynamically onto a black walnut and marble surface (10–25 guests).
- Phase 2 (The Banquet Tables): Accelerate through an endless 12-foot candlelit feast detailing the 4 verified tiers ($24, $26, $30, $38/pp).
- Phase 3 (The Mobile Cart & Holy Grail): Houston’s largest mobile cart arrives with glowing Edison bulbs, champagne cascades, and the $2,000 / $3,500 Holy Grail showpiece.
- Phase 4 (The Heritage): Chef Tricia’s 35-year restaurant craft and verified 5.0 Knot/WeddingWire accolades.
- Phase 5 (Mathematical Quote Engine): Transparent real-time configurator calculating food, mandatory $229 setup fee, 18% tax, and direct SMS/email triggers.

### R3. Reference Inspection & Reverse Engineering
Actively inspect and deconstruct client-side bundles, shader passes, and mathematical physics curves from reference sites (https://lusion.co/, https://looper.basement.studio/) using website downloading and extraction tools to reproduce high-end particle flows and camera damping.

### R4. Generative Asset Synthesis (Higgsfield Models)
Leverage the Higgsfield SDK (@higgsfield/client / Python higgsfield_client with Seedance 2.5 and Soul v2) to generate hyper-realistic culinary motion textures and 4K macro stills as inputs for WebGL textures, materials, and depth maps.

### R5. Controlled Infrastructure & Deployment
- API credentials in .env.local must remain server-side and never be logged, printed, or committed to Git.
- Deploy to Vercel production edge network (charcuterie-chick-sample-2) from repo root via vercel --prod --yes.

## Acceptance Criteria

### Visual & Interactive Fidelity
- [ ] 3D canvas is the primary interactive universe with tactile response to pointer and scroll (not 2D cards with background video).
- [ ] Radiant, luminous lighting palette with warm copper, gold, champagne, and specular reflections.
- [ ] 60fps smooth kinetic animation across desktop and mobile devices.

### Business & Mathematical Truth
- [ ] Exact pricing structure: $24, $26, $30, $38 grazing tiers, $2,000/$3,500 Holy Grail, $229 setup fee, 18% catering tax.
- [ ] Instant quote pre-fills direct SMS to 832-458-8180 and email to charcuteriechick@outlook.com.

### Verification & Deployment
- [ ] Headless Playwright automated suite passes on desktop (1440x900) and mobile (393x852) with 0 console errors and 0 failed requests.
- [ ] Deployed and verified live on Vercel production edge network (https://charcuterie-chick-sample-2.vercel.app).

## 2026-09-27T02:07:27Z

Build an immersive, sensory, Awwwards-caliber WebGL scrollytelling experience for Charcuterie Chick (Chef Tricia Holfelder) matching the visual fidelity, fluid physics, and luminous interaction of Lusion.co, Oryzo, and Basement Studio.

Working directory: `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark`
Integrity mode: development

## Reference Standards & Reverse-Engineering Resources
- **Aesthetic & Interaction Standards:**
  - Lusion (lusion.co): Procedural 3D organic meshes, fluid force fields, refractive glass, jelly physics, dynamic lighting
  - Oryzo (oryzo.ai): Smooth continuous camera scrollytelling, cinematic atmosphere
  - Looper Basement (looper.basement.studio): High-performance audio-reactive WebGL, buttery 60fps
  - Samsy (samsy.ninja): Creative GLSL shaders and experimental WebGL interactions
- **Reverse-Engineering & Pipeline Extraction References:**
  - Bundle & Shader Extraction: https://github.com/goclone-dev/goclone, https://github.com/Desertbetweenalembic/website-downloader, https://github.com/wtsxDev/reverse-engineering, https://github.com/WerWolv/ImHex, https://github.com/JCodesMore/ai-website-cloner-template, https://github.com/Varalix-Digitech-Solutions/clone-team
  - Multi-Agent Orchestration & Staff Workflows: https://github.com/keli-wen/agy-staff
  - Ultra-Clean Reactive State & Micro-Engines: https://github.com/nuejs/nue
  - Visual Curation & Generation: https://github.com/Nutlope/inspo, https://github.com/builtbyV/ai-website-builder, https://github.com/emilwallner/Screenshot-to-code
  - Precision Interaction & 120fps Kinetic Feedback: https://github.com/monkeytypegame/monkeytype

---

## Requirements

### R1. True 3D Procedural Mesh Environment (Eliminate Flat 2D Picture Billboards)
Transform the scene from flat 2D image cards into a living, tactile 3D procedural world:
- **Phase 0 (The Micro Seed):**
  - Procedural 3D honeycomb lattice (hexagonal prism cell array with varying wall heights and organic bevels).
  - Raymarched/refractive honey droplets with viscous physics (Beer-Lambert light absorption, specular highlights, internal caustics, and pointer-reactive surface wobble).
  - Parametric 3D prosciutto ribbons twisting along 3D Catmull-Rom space curves with anisotropic striation shaders.
  - 3D rosemary needle geometry with sub-surface scatter lighting.
- **Phase 1 (The Artisan Board):**
  - Rich 3D black walnut slab with beveled edges, end-grain textures, and physical knife grooves.
  - Pitted Spanish Manchego wedge (D.O.P.) and creamy French Brie wheel with bloomy rind procedural normal maps.
  - Sliced fresh 3D mission figs with glistening seed cavities.
  - Refractive crystal wine glass with Fresnel reflection and physical liquid meniscus.
- **Phase 2 (The Banquet Tables):**
  - Sweeping 12-foot 3D banquet table stretching across spatial depth with candle stands, eucalyptus foliage runners, and tiered displays.
  - Multi-tier grazing boards showcasing the verified tiers ($24, $26, $30, $38/pp).
- **Phase 3 (The Mobile Cart & Holy Grail):**
  - Houston’s largest mobile cart modeled in 3D: polished brass casters, black iron canopy, hanging Edison filament bulbs casting real-time inverse-square illumination.
  - 3D champagne cascade with buoyant rising bubbles.
  - The $2,000 / $3,500 Holy Grail multi-tier showpiece centerpiece.
- **Phase 4 (The Culinary Heritage):**
  - Chef Tricia Holfelder’s 35-year restaurant craft: 3D Damascus steel chef knife with iridescent reflection, end-grain cutting blocks, and verified The Knot / WeddingWire 5.0 accolades embossed on dynamic metallic badges.
- **Phase 5 (The Spatial Quote Configurator):**
  - 3D spatial interactive control surface integrated seamlessly into the WebGL universe with tactile 3D buttons, dynamic slider rails, and real-time receipts.

### R2. Fluid Pointer Dynamics & Continuous Camera Arc Choreography
- Interactive fluid/pointer repulsion force field: pointer motion disturbs amber ember particles, ripples honey viscosity, and deflects mesh vertices.
- 3D Catmull-Rom camera trajectory with continuous arc interpolation (crane lifts, low-altitude tracking runs, swooping macro roll angles, and velocity-responsive FOV lens breathing).
- Smooth momentum damping and Verlet integration ensuring 60fps across mobile and desktop.

### R3. Radiant Luminous Lighting & Post-Processing (ACESFilmic + Dual-Kawase Bloom)
- Completely replace flat/muddy black tones with a radiant luxury palette: warm honey amber (`#f0c060`), polished copper (`#d47a3a`), champagne (`#f5e4b8`), and warm ember (`#ff6020`).
- Multi-harmonic candle flame lights (flickering across 4 organic frequencies).
- Selective Dual-Kawase bloom isolating emissive filaments, embers, and highlights without blowing out text or contrast.

### R4. Generative Asset Synthesis (Higgsfield Models)
- Utilize the Higgsfield client (`@higgsfield/client` or Python `higgsfield_client` with Seedance 2.5 and Soul v2) to synthesize ultra-high-resolution culinary motion textures, normal maps, and displacement maps.
- Ensure all API keys in `.env.local` remain server-side and are never committed or exposed to client-side bundles.

### R5. Complete Business & Mathematical Integrity (FACTS.md Compliance)
- **Verified Tiers:**
  - $24/person (Graze Me, Craze Me)
  - $26/person (Grazing Standard)
  - $30/person (Super Graze)
  - $38/person (Grand Graze)
- **Flagship Showpiece:**
  - The Holy Grail Centerpiece: $2,000 (up to 75 guests) / $3,500 (up to 150 guests)
- **Mandatory Fees & Taxes:**
  - Production & Styling Setup Fee: $229.00
  - Texas Catering Sales Tax: 18%
- **Direct Lead Routing:**
  - Instant pre-filled SMS to `832-458-8180`
  - Instant pre-filled Email to `charcuteriechick@outlook.com`
- **Chef & Trust Heritage:**
  - Tricia Holfelder, Tomball TX — 35 years professional restaurant knife craft.
  - The Knot Best of Weddings 2026 (5.0 stars, 13 reviews)
  - WeddingWire Couples' Choice 2026 (5.0 stars, 11 reviews)

### R6. Production Deployment & Automated Verification
- Headless Playwright end-to-end test suite verifying desktop (1440x900) and mobile (393x852) viewports with 0 console errors and 0 dropped frames.
- Production deployment to Vercel (`https://charcuterie-chick-sample-2.vercel.app`) with clean HTTP status and assets cached.

---

## Acceptance Criteria

### Visual & Interactive Fidelity (Lusion Standard)
- [ ] Primary universe is real-time interactive 3D WebGL geometry (not flat 2D picture frames or card overlays).
- [ ] Kinetic pointer force field disturbs particles and surface meshes in real-time.
- [ ] Continuous 3D camera arc path with pitch, yaw, and zoom breathing across all 6 progressive chapters.
- [ ] Luminous lighting with warm amber honeycomb, polished copper, champagne highlights, and selective bloom.
- [ ] Consistent 60fps rendering across desktop and mobile devices.

### Mathematical & Brand Truth
- [ ] Pricing model strictly matches: $24, $26, $30, $38 grazing tiers, $2,000 / $3,500 Holy Grail, $229 setup fee, and 18% catering tax.
- [ ] Configurator outputs real-time itemized receipt with exact dollar calculations.
- [ ] Pre-filled SMS and Mailto links accurately populate guest count, tier name, subtotal, and tax.
- [ ] Chef Tricia's verified 35-year background and 5.0 Knot/WeddingWire accolades are accurately represented.

### Verification & Performance
- [ ] Automated headless test suite passes with 0 console errors, 0 unhandled promise rejections, and 0 failed asset requests.
- [ ] Tested and verified on both mobile (393x852) and desktop (1440x900).
- [ ] Live edge deployment active on Vercel at `https://charcuterie-chick-sample-2.vercel.app`.

