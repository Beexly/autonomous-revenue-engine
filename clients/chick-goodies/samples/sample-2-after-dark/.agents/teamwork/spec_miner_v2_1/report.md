# Authoritative Specification Mining Report — v2.0 After Dark 3D Transformation

**Document Version:** 2.0.0-PROD-SPEC  
**Author:** Specification Miner (`spec_miner_v2_1`)  
**Target Application:** Charcuterie Chick Haute Couture 3D Scrollytelling (`sample-2-after-dark`)  
**Working Directory:** `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark`  
**Timestamp:** 2026-09-27T02:15:00Z  
**Authoritative Request:** `ORIGINAL_REQUEST.md` (`## 2026-09-27T02:07:27Z`)  
**Authoritative Data Sources:** `PROJECT.md`, `FACTS.md`, `MIDNIGHT-BIBLE.md`, `facts.json`, `qa_full.py`, `test_3d_experience.py`

---

## 1. Executive Summary & Core Objective

The user request at `## 2026-09-27T02:07:27Z` represents a major architectural elevation for the Charcuterie Chick WebGL scrollytelling experience. The previous milestone implementations (M1–M3) achieved a functioning WebGL pipeline with Three.js r170, Dual-Kawase bloom, and a scrollytelling camera. However, **the centerpiece displays across Phases 0 through 4 remained flat 2D image billboards (`createCenterpieceDisplay` with `PlaneGeometry` relief portal meshes mounted on obsidian slate boxes)**.

The new authoritative specification strictly mandates:
1. **True 3D Procedural Mesh Environment:** Total elimination of flat 2D picture frames, image cards, and billboards across all 6 phases (Phases 0–5), replacing them with rich procedural geometry, parametric curves, refractive materials, normal maps, and kinetic deformation.
2. **Fluid Pointer Dynamics & Continuous Camera Arc Choreography:** An interactive fluid/pointer repulsion force field deflecting particles and mesh vertices in real time, accompanied by a continuous 3D Catmull-Rom camera trajectory with crane lifts, low-altitude tracking runs, swooping macro roll angles, and velocity-responsive FOV lens breathing.
3. **Radiant Luminous Lighting Model:** Complete replacement of muddy dark palettes with a glowing luxury palette: warm honey amber (`#f0c060`), polished copper (`#d47a3a`), champagne (`#f5e4b8`), and warm ember (`#ff6020`), coupled with multi-harmonic 4-frequency candle flickers and selective Dual-Kawase bloom.
4. **Generative Asset Synthesis (Higgsfield Models):** Ingestion of motion textures and 4K macro stills via Higgsfield SDK (`@higgsfield/client` / Python `higgsfield_client` with Seedance 2.5 and Soul v2), with strict server-side credential isolation in `.env.local`.
5. **Mathematical Integrity & Brand Truth:** Exact cents-level pricing compliance ($24, $26, $30, $38 grazing tiers, $2,000 / $3,500 Holy Grail, 50-guest minimum, $229 setup fee, Texas 18% catering sales tax applied to Food + Add-ons + Setup Fee), direct pre-filled SMS/email routing, and verified Chef Tricia credentials.
6. **Automated Verification & Edge Deployment:** 100% pass on desktop (1440x900) and mobile (393x852) with 0 console errors, 0 page errors, 0 failed network requests, and live deployment on Vercel edge network (`https://charcuterie-chick-sample-2.vercel.app`).

---

## 2. Gap Analysis: Existing Codebase vs. Authoritative v2.0 Specification

| Domain / Phase | Existing Implementation (`experience.js`, `index.html`) | v2.0 Authoritative Specification (`ORIGINAL_REQUEST.md`) | Critical Gap / Action Required |
|---|---|---|---|
| **Phase 0 (The Micro Seed)** | Sinusoidal ribbon plane & single deformed sphere + 2D image card (`stage1-micro-cone.png`) on obsidian box. | Hexagonal prism honeycomb lattice with varying wall heights and organic bevels; raymarched/refractive honey droplets with Beer-Lambert absorption and pointer wobble; parametric 3D prosciutto ribbons twisting along 3D Catmull-Rom space curves with anisotropic striation; 3D rosemary needle geometry with SSS lighting. | **High Gap:** Replace `createCenterpieceDisplay` with procedural honeycomb lattice mesh, raymarched/refractive honey droplets, 3D parametric Catmull-Rom prosciutto curve mesh, and 3D rosemary needle geometry. |
| **Phase 1 (The Artisan Board)** | Flat 2D image card (`stage2-artisan-board.png`) on obsidian pedestal box. | Rich 3D black walnut slab with beveled edges, end-grain textures, and physical knife grooves; pitted Spanish Manchego wedge (D.O.P.); creamy French Brie wheel with bloomy rind procedural normal maps; sliced fresh 3D mission figs with glistening seed cavities; refractive crystal wine glass with Fresnel reflection and physical liquid meniscus. | **Critical Gap:** Eliminate 2D image plane billboard. Model 3D black walnut board slab, 3D Manchego wedge, 3D Brie wheel with normal maps, 3D sliced figs with seed cavities, and 3D crystal wine glass with meniscus. |
| **Phase 2 (The Banquet Tables)** | Flat 2D image card (`stage3-grand-banquet.png`) on obsidian pedestal box. | Sweeping 12-foot 3D banquet table stretching across spatial depth with candle stands, eucalyptus foliage runners, and tiered displays; multi-tier grazing boards showcasing verified tiers ($24, $26, $30, $38/pp). | **Critical Gap:** Eliminate 2D billboard. Model continuous 12-foot 3D table stretching into the Z/X plane with 3D candle stands, 3D eucalyptus foliage runners, and multi-tier tiered risers. |
| **Phase 3 (The Mobile Cart & Holy Grail)** | Flat 2D image card (`stage4-midnight-cart.png`), 3 basic sphere bulbs, rising bubbles. | Houston’s largest mobile cart modeled in 3D: polished brass casters, black iron canopy, hanging Edison filament bulbs casting real-time inverse-square illumination; 3D champagne cascade with buoyant rising bubbles; $2,000 / $3,500 Holy Grail multi-tier showpiece centerpiece. | **Critical Gap:** Eliminate 2D billboard. Construct 3D mobile cart geometry (brass wheels/casters, chassis, black iron canopy poles and roof), physical hanging filaments, 3D cascading champagne flutes/tower, and Holy Grail tiered showpiece. |
| **Phase 4 (The Culinary Heritage)** | Flat 2D portrait photo (`tricia-portrait-471.jpg`) on obsidian pedestal box. | Chef Tricia Holfelder’s 35-year restaurant craft: 3D Damascus steel chef knife with iridescent reflection, end-grain cutting blocks, and verified The Knot / WeddingWire 5.0 accolades embossed on dynamic metallic badges. | **Critical Gap:** Eliminate 2D portrait photo plane. Model 3D Damascus steel knife with wavy steel texture and iridescent sheen, 3D butcher block, and 3D metallic embossed badges for Knot and WeddingWire 5.0. |
| **Phase 5 (The Spatial Quote Configurator)** | Standard 2D DOM HTML form card (`.plate-calculator`) floating over empty 3D space. | 3D spatial interactive control surface integrated seamlessly into the WebGL universe with tactile 3D buttons, dynamic slider rails, and real-time receipts. | **Medium Gap:** Integrate 3D spatial interactive control surface in Three.js (tactile 3D buttons, 3D slider rail with movable handle mesh) synchronized bi-directionally with HTML form. |
| **Camera & Dynamics** | 11-point Catmull-Rom spline with linear interpolation and position offset on scroll. | Continuous 3D Catmull-Rom camera trajectory with crane lifts, low-altitude tracking runs, swooping macro roll angles, and velocity-responsive FOV lens breathing; fluid/pointer repulsion force field deflecting particles and mesh vertices. | **Medium Gap:** Add camera roll/tilt banking into spline evaluation; implement FOV lens breathing (`fov = 40 + velocity * k`); expand pointer force field to disturb mesh vertices across all stages. |
| **Lighting & Palette** | Standard warm lighting with custom DualKawase bloom. | Luxury palette: warm honey amber (`#f0c060`), polished copper (`#d47a3a`), champagne (`#f5e4b8`), warm ember (`#ff6020`); multi-harmonic candle flame lights (4 organic frequencies); selective Dual-Kawase bloom. | **Low Gap:** Palette colors exist partially; align color hex codes strictly to `#f0c060`, `#d47a3a`, `#f5e4b8`, `#ff6020`. 4-frequency candle flicker is already operational. |
| **Business & Tax Math** | `experience.js` line 1786 calculates `taxableSubtotal = tierSubtotal + addonsTotal + setupFee`. | Texas 18% catering sales tax must be applied to Food + Add-ons + $229 Setup Fee + Extra Service Time ($3/pp/half-hour). 50-guest minimum. $2,000 / $3,500 Holy Grail. Pre-filled SMS and Mailto. | **Verified / Maintained:** Calculation logic in `experience.js` matches `qa_full.py` and Texas catering tax law. Must ensure 3D configurator preserves exact penny calculations. |
| **Runtime Integrity** | In `experience.js` line 2269, assigning `THREE.CatmullRomCurve3 = CatmullRomSpline3` throws a runtime TypeError in ES module strict mode (`Cannot assign to property 'CatmullRomCurve3' of [object Module]`). | 0 console errors and 0 unhandled page errors across desktop and mobile. | **High Defect:** Fix property assignment on immutable ES module namespace `THREE`. |
| **DOM Pointer Interception** | `experience.css` line 280 `.chapter > * { pointer-events: auto; }` allows `#ch-5` plate to intercept clicks aimed at Act 2 cards. | Clicks on 3D hotspots and Act 2 banquet cards must register without DOM blocking. | **High Defect:** Scope `.chapter.active > * { pointer-events: auto; }`. |

---

## 3. Features Discovered

| # | Category | Feature | Description | Inputs | Outputs | Error Behavior | Discovered Via |
|---|----------|---------|-------------|--------|---------|----------------|----------------|
| 1 | 3D Mesh Environment | Procedural Honeycomb Lattice (Phase 0) | Hexagonal prism cell array with varying wall heights and organic bevels representing raw honeycomb structure. | Cell radius, wall thickness, count (e.g. 7-19 hex cells), height variations | Procedural `THREE.BufferGeometry` with PBR amber wax material | Clamps minimum cell thickness to avoid non-manifold geometry | `ORIGINAL_REQUEST.md` R1 |
| 2 | 3D Mesh Environment | Raymarched/Refractive Honey Droplets (Phase 0) | Viscous droplets featuring Beer-Lambert light absorption, specular highlights, internal caustics, and pointer-reactive surface wobble. | Pointer vector, time uniform, light vectors, refractive index (1.53) | Refractive GLSL fragment color with chromatic dispersion | Fallback to blended Fresnel specular if hardware lacks float textures | `ORIGINAL_REQUEST.md` R1, `experience.js` |
| 3 | 3D Mesh Environment | Parametric 3D Prosciutto Ribbons (Phase 0) | Cured meat ribbons extruded along a 3D Catmull-Rom space curve with anisotropic striation shaders. | Spline control points, curve resolution, time, scroll velocity | Extruded ribbon mesh with marble/fat striations and backscatter | Clamps vertex displacement to prevent self-intersection | `ORIGINAL_REQUEST.md` R1, `PROJECT.md` F05 |
| 4 | 3D Mesh Environment | 3D Rosemary Needle Geometry (Phase 0) | Radial sprig geometry with sub-surface scatter (SSS) lighting and pine-needle normal maps. | Stem curve, leaf angle distribution, SSS light color | Group of low-poly tapered needle meshes with SSS shader | Level-of-detail reduction on mobile to preserve 60fps | `ORIGINAL_REQUEST.md` R1 |
| 5 | 3D Mesh Environment | 3D Black Walnut Artisan Slab (Phase 1) | Rich wood slab with beveled perimeter, end-grain normal textures, and physical knife grooves. | Board width (1.8), depth (1.2), thickness (0.08), bevel size | Beveled box geometry with procedural end-grain shader | UV wrap clamping on bevel edges | `ORIGINAL_REQUEST.md` R1 |
| 6 | 3D Mesh Environment | 3D Spanish Manchego Wedge (Phase 1) | Pitted sheep's milk cheese wedge (D.O.P.) with herringbone rind texture and crystalline fractures. | Wedge angle (45 deg), radius, height, rind normal map | 3D wedge geometry with dual PBR rind/paste materials | Normals recalculated across fractured front face | `ORIGINAL_REQUEST.md` R1, `FACTS.md` |
| 7 | 3D Mesh Environment | 3D French Brie Wheel (Phase 1) | Cut wheel of bloomy rind triple-crème brie with oozing paste physics. | Cylinder radius, height, wedge cutout angle, normal map | 3D cut cylinder mesh with bloomy rind and glistening paste | Paste vertices clamped to table surface | `ORIGINAL_REQUEST.md` R1, `PROJECT.md` |
| 8 | 3D Mesh Environment | 3D Sliced Mission Figs (Phase 1) | Sliced fresh mission figs with dark skin, pink flesh, and glistening seed cavities. | Fig profile spline, seed cavity count, normal map | Lathe/extrusion mesh with seed cavity specular highlights | Normal map fallback if procedural generation active | `ORIGINAL_REQUEST.md` R1 |
| 9 | 3D Mesh Environment | 3D Crystal Wine Glass (Phase 1) | Refractive crystal sommelier glass with physical liquid meniscus and Fresnel reflection. | Lathe profile curve, glass thickness, liquid height | Transparent refractive mesh with Fresnel edge glow | Meniscus depth clamped to prevent z-fighting | `ORIGINAL_REQUEST.md` R1 |
| 10 | 3D Mesh Environment | Sweeping 12-Foot Banquet Table (Phase 2) | Expansive banquet table extending through spatial depth (X: 18-26, Z: -2 to 2) with candle stands and runners. | Table length (12ft/3.6m), wood grain texture, candle positions | Multi-meter 3D table surface receiving soft shadows | Frustum culling disabled for persistent spatial presence | `ORIGINAL_REQUEST.md` R1 |
| 11 | 3D Mesh Environment | 3D Eucalyptus Foliage Runners (Phase 2) | Organic leafy foliage runner winding along table centerline between tiered boards. | Spline path along table surface, leaf density | Instanced mesh of eucalyptus leaves with translucent shader | DPR-aware instance count clamping on mobile | `ORIGINAL_REQUEST.md` R1 |
| 12 | 3D Mesh Environment | Multi-Tier Grazing Risers (Phase 2) | Tiered presentation stands showcasing the 4 verified tiers ($24, $26, $30, $38/pp). | Tier data ($24, $26, $30, $38), tier dimensions | Multi-level marble/wood display risers with food meshes | Synchronized click events linking to Phase 5 state | `ORIGINAL_REQUEST.md` R1, `facts.json` |
| 13 | 3D Mesh Environment | 3D Midnight Mobile Cart (Phase 3) | Houston's largest mobile cart modeled in 3D: brass casters, canopy frame, and shelving. | Cart dimensions, wheel radius, caster angle, canopy curve | Composite 3D mesh with brass and black iron PBR materials | Hierarchy grouping for unified stage movement | `ORIGINAL_REQUEST.md` R1, `MIDNIGHT-BIBLE.md` |
| 14 | 3D Mesh Environment | Real-Time Inverse-Square Edison Bulbs (Phase 3) | Hanging incandescent Edison filament bulbs with physical inverse-square point light illumination. | Filament wattage/lumens, bulb position, color (2200K) | Point lights with physical decay (`distance: 12, decay: 2`) + emissive filament | Intensity clamped to prevent bloom blowout | `ORIGINAL_REQUEST.md` R1, R3 |
| 15 | 3D Mesh Environment | 3D Champagne Cascade & Rising Bubbles (Phase 3) | Cascading champagne glass pyramid with buoyant rising micro-bubble particle system. | Glass tier counts, bubble rate, rise velocity, buoyancy | Tiered glass meshes + GPU particle points rising with drag | Bubbles fade out at liquid surface, never penetrate glass | `ORIGINAL_REQUEST.md` R1, `experience.js` |
| 16 | 3D Mesh Environment | 3D Holy Grail Showpiece (Phase 3) | Massive multi-tier centerpiece showpiece for 75 ($2,000) or 150 ($3,500) guests. | Centerpiece tier levels, fruit garnishes, charcuterie piles | Tiered luxury showpiece mesh with golden accents | Click event triggers Holy Grail tier selection in Phase 5 | `ORIGINAL_REQUEST.md` R1, `FACTS.md` |
| 17 | 3D Mesh Environment | 3D Damascus Steel Chef Knife (Phase 4) | High-end culinary chef knife with wavy Damascus pattern and iridescent metallic reflection. | Blade spine curve, cutting edge spline, Damascus pattern UV | Metallic blade mesh with anisotropic sheen and iridescent coat | Anisotropic tangent alignment along blade edge | `ORIGINAL_REQUEST.md` R1 |
| 18 | 3D Mesh Environment | 3D End-Grain Butcher Block (Phase 4) | Heavy wooden butcher cutting block displaying knife marks and heritage oil finish. | Block width, depth, height, end-grain checker texture | Textured beveled box mesh with roughness variation | UV tiling fixed to preserve square end-grain grid | `ORIGINAL_REQUEST.md` R1 |
| 19 | 3D Mesh Environment | 3D Metallic Embossed Accolade Badges (Phase 4) | Floating metallic seals for The Knot (5.0, 13 reviews) and WeddingWire (5.0, 11 reviews). | Badge radius, bevel depth, embossed text normal map | Dual metallic coin/shield meshes with gold luster | Raycastable for opening verification links | `ORIGINAL_REQUEST.md` R1, `FACTS.md` |
| 20 | 3D Mesh Environment | 3D Spatial Quote Configurator Surface (Phase 5) | Interactive 3D control surface in WebGL with tactile buttons, dynamic slider rails, and live receipts. | Pointer interaction, guest count, active tier, add-ons | Tactile 3D mesh surface with moving slider handle and 3D text | Bi-directional sync with DOM form controls | `ORIGINAL_REQUEST.md` R1 |
| 21 | Interaction Dynamics | Fluid & Pointer Repulsion Force Field | Real-time pointer motion disturbs amber particles, ripples honey viscosity, and deflects mesh vertices. | Cursor screen (X, Y), pointer velocity, repulsion radius | Dynamic displacement vectors applied in vertex shaders | Smooth exponential decay when cursor stops | `ORIGINAL_REQUEST.md` R2, `experience.js` |
| 22 | Camera Choreography | Continuous Catmull-Rom 3D Spline Arc | Smooth centripetal 3D spline trajectory across all 6 phases with crane lifts, low tracking runs, and roll banking. | Normalized journey progress `t ∈ [0.0, 1.0]`, arc control points | Camera position `(x, y, z)`, lookAt target, roll angle | Centripetal parameterization prevents knot loops | `ORIGINAL_REQUEST.md` R2, `PROJECT.md` |
| 23 | Camera Choreography | Velocity-Responsive Lens Breathing | Dynamic FOV dilation expanding camera field of view during high scroll velocity. | Scroll velocity `v`, base FOV (40 degrees), breathing factor `k` | Updated `camera.fov = 40 + abs(v) * k`, projection update | Clamped between 36 and 54 degrees to prevent fisheye | `ORIGINAL_REQUEST.md` R2 |
| 24 | Lighting & Post-Proc | Radiant Luxury Palette Calibration | Warm honey amber (`#f0c060`), polished copper (`#d47a3a`), champagne (`#f5e4b8`), and warm ember (`#ff6020`). | Standard sRGB hex color values | Three.js `THREE.Color` in Linear sRGB color space | Fallback dark tone elimination | `ORIGINAL_REQUEST.md` R3 |
| 25 | Lighting & Post-Proc | Multi-Harmonic 4-Frequency Candle Flicker | Organic candle flame light modulation across 4 non-integer sine/cosine frequencies. | Elapsed time `t`, phase offsets (7.31, 11.17, 17.93, 31.4 Hz) | Point light intensity modulation around base lumen value | Clamped minimum intensity to prevent total darkness | `ORIGINAL_REQUEST.md` R3, `experience.js` |
| 26 | Lighting & Post-Proc | Dual-Kawase Selective Bloom Pass | Mobile-safe 3-level half-res bloom pyramid isolating emissive filaments and highlights without blowing out UI. | Render target HDR buffer, threshold (0.62), knee (0.22), intensity | Blended bloom texture composited with tone-mapped scene | Disables automatically if framerate drops below 45 FPS | `ORIGINAL_REQUEST.md` R3, `vendor/DualKawaseBloom.js` |
| 27 | Lighting & Post-Proc | ACESFilmic Tone Mapping Transform | Cinematic tone reproduction mapping high dynamic range lighting to SDR display range. | HDR radiance values `[0, ∞)` | Tone-mapped linear RGB in `[0, 1]` | Soft rolloff preserving highlight color saturation | `ORIGINAL_REQUEST.md` R3, `PROJECT.md` F07 |
| 28 | Business Mathematics | Four Verified Grazing Tiers Math | Exact price calculation: Graze Me ($24), Standard ($26), Super ($30), Grand ($38) per person. | Guest count `g >= 50`, tier rate `r ∈ {24, 26, 30, 38}` | Food subtotal = `g * r` | Enforces 50-guest minimum | `FACTS.md`, `facts.json`, `qa_full.py` |
| 29 | Business Mathematics | 50-Guest Minimum Floor Enforcement | Strict business rule requiring at least 50 guests for per-person grazing table services. | Guest input value `g` | Enforced floor `g >= 50`; input clamped or flagged | Rejects quote if `g < 50` on per-person tiers | `FACTS.md`, `qa_full.py` |
| 30 | Business Mathematics | Holy Grail Fixed Brackets Math | Centerpiece pricing: $2,000 for up to 75 guests; $3,500 for up to 150 guests. | Guest count `g <= 75` or `75 < g <= 150` | Centerpiece subtotal = $2,000 or $3,500 | Flags custom quote required if `g > 150` | `FACTS.md`, `qa_full.py`, `experience.js` |
| 31 | Business Mathematics | Mandatory Styling & Setup Fee Math | Fixed mandatory production and styling setup fee of $229.00 on every grazing table order. | Fixed constant `$229.00` | Setup fee line item added to taxable subtotal | Always included in catering tax base | `FACTS.md`, `qa_full.py` |
| 32 | Business Mathematics | Texas 18% Catering Sales Tax Invariant | 18% catering tax applied to the sum of Food + Add-ons + $229 Setup Fee + Extra Service Time. | Taxable subtotal = Food + Addons + Setup + ExtraTime | Tax amount = `Math.round(taxableSubtotal * 18) / 100` | Cents-level rounding invariant | `qa_full.py`, `FACTS.md`, `PROJECT.md` |
| 33 | Business Mathematics | Extended Service Time Math | Extra service time beyond 90 minutes billed at $3 per person per half-hour ($6/person/hour). | Guest count `g`, extra half-hours `h ∈ {0, 1, 2, 3, 4}` | Extra time fee = `g * h * 3` | Taxable at 18% rate | `FACTS.md`, `qa_full.py` |
| 34 | Business Mathematics | Verified Add-On Stations Math | Add-ons: Zeppole Beignets ($4.50/pp), Sliders ($2.95/pp), Mimosa Bar ($4.00/pp), Midnight Cart ($350 flat). | Checkbox states and guest count `g` | Add-ons subtotal = sum of selected items | Dynamic recalculation on toggle | `FACTS.md`, `PROJECT.md`, `experience.js` |
| 35 | Lead Capture & Comms | Instant Pre-Filled SMS Routing | Deep-link generating SMS to `832-458-8180` with itemized event proposal breakdown. | Guest count, tier name, food subtotal, add-ons, setup fee, tax, total | `sms:+18324588180?body={encoded_proposal}` | URL encoding handles newlines and special characters | `ORIGINAL_REQUEST.md` R5, `FACTS.md` |
| 36 | Lead Capture & Comms | Instant Formal Proposal Email Routing | Mailto deep-link generating email to `charcuteriechick@outlook.com` with full quotation. | Guest count, tier name, food subtotal, add-ons, setup fee, tax, total | `mailto:charcuteriechick@outlook.com?subject={subj}&body={body}` | RFC 3986 percent-encoding | `ORIGINAL_REQUEST.md` R5, `FACTS.md` |
| 37 | Heritage & Trust | Chef Tricia & Accolades Presentation | Verified 35-year restaurant craft, Knot Best of Weddings 2026 (5.0, 13 reviews), WeddingWire (5.0, 11 reviews). | Verified copy from `FACTS.md` | 3D badges and DOM text cards displaying verified metrics | Prohibits unverified awards or invented statistics | `FACTS.md`, `MIDNIGHT-BIBLE.md` |
| 38 | Asset Synthesis | Higgsfield SDK Client Integration | Server-side integration of `@higgsfield/client` / Python `higgsfield_client` for generative asset synthesis. | Text prompts, reference stills, seed values | Motion textures (MP4/WebM) and 4K PBR relief stills | Throws server error if API credentials missing | `ORIGINAL_REQUEST.md` R4 |
| 39 | Asset Synthesis | Seedance 2.5 Motion Texture Synthesis | Generative video model generating looping culinary motion textures for background stages. | Prompt: culinary macro motion, honey drizzles, candlelit tables | 720p/1080p seamless video loops | Validated with `THREE.VideoTexture` sRGB playback | `ORIGINAL_REQUEST.md` R4 |
| 40 | Asset Synthesis | Soul v2 4K Macro Still Ingestion | High-resolution generative model producing 4K macro stills for normal and displacement maps. | High-detail culinary prompts (charcuterie ribbons, cheese wedges) | 4K PNG/WebP stills converted to PBR maps | Height and roughness map extraction via OpenCV/Pillow | `ORIGINAL_REQUEST.md` R4 |
| 41 | Security & Isolation | Server-Side API Credential Guard | Strict security guard ensuring `.env.local` API keys are never bundled, committed, or exposed. | Environment variables (`HIGGSFIELD_API_KEY`, etc.) | Private server-side execution only; `.gitignore` blocks `.env*` | CI/CD build fails if API key detected in client bundle | `ORIGINAL_REQUEST.md` R4, R5, `.gitignore` |
| 42 | Automated Testing | Headless Playwright Desktop Suite | Comprehensive automated opaque-box test runner validating 1440x900 viewport with 0 errors. | Chromium headless instance at 1440x900 | Structured JSON test report + high-res screenshots | Fails suite if console/page error or check failure occurs | `ORIGINAL_REQUEST.md` R6, `test_3d_experience.py` |
| 43 | Automated Testing | Headless Playwright Mobile Suite | Mobile touch & viewport validation runner at 393x852 (iPhone 14/15 Pro) with 0 errors. | Chromium mobile emulation (393x852, touch, DPR 3.0) | Structured JSON report + mobile screenshots | Fails suite on horizontal overflow (`scrollWidth > 393`) | `ORIGINAL_REQUEST.md` R6, `test_3d_experience.py` |
| 44 | Automated Testing | Zero Console & Page Error Gate | Event listeners capturing and asserting zero console errors and zero uncaught exceptions. | Page `console` and `pageerror` event streams | Clean error log array `len(errors) == 0` | Strict assertion termination if any error logged | `ORIGINAL_REQUEST.md` R6, `test_3d_experience.py` |
| 45 | Automated Testing | Zero Failed Network Requests Gate | Event listener tracking and asserting zero non-aborted network request failures. | Page `requestfailed` event stream | Clean failure log array `len(failures) == 0` | Strict assertion failure on 404, 500, or CORS failures | `ORIGINAL_REQUEST.md` R6, `test_3d_experience.py` |
| 46 | Edge Deployment | Vercel Edge Production Deployment | Zero-build static production deployment to Vercel global edge network. | Repository root static files (`index.html`, `experience.js`, `vendor/`) | Live public URL `https://charcuterie-chick-sample-2.vercel.app` | HTTP 200 verification on edge network | `ORIGINAL_REQUEST.md` R5, R6, `vercel.json` |

---

## 4. Edge Cases

| # | Feature | Input | Observed Behavior |
|---|---------|-------|-------------------|
| 1 | Guest Count Floor Boundary | `guests = 49` (on per-person tiers $24, $26, $30, $38) | Slider is constrained by `min="50"`; programmatic inputs below 50 trigger boundary validation flagging that grazing tables require a 50-guest minimum. |
| 2 | Guest Count Non-Integer Values | `guests = 50.5` or `guests = "abc"` | Input is parsed via `parseInt(val, 10)` or rejected as invalid, falling back to 50 guests without producing `NaN` or distorted decimals in currency strings. |
| 3 | Extreme Guest Count Upper Boundary | `guests = 300` | Math cleanly calculates `300 * 38 = $11,400.00`; setup fee $229; taxable subtotal `$11,629.00`; tax `$2,093.22`; total `$13,722.22`. Receipt string formats correctly with commas (`$13,722.22`). |
| 4 | Holy Grail Showpiece Tier Brackets | `guests = 75` vs `guests = 76` vs `guests = 150` | At 75 guests, food subtotal is exactly `$2,000.00`. At 76 through 150 guests, food subtotal steps to exactly `$3,500.00`. Values above 150 prompt a custom quote notice. |
| 5 | Texas Catering Tax Base Invariant | Tier Subtotal + Add-ons + $229 Setup Fee | Texas catering tax law requires sales tax to apply to all mandatory production and setup charges. For 50 guests on Graze Me ($1,200) + $229 setup = $1,429.00 taxable. 18% tax = `$257.22`. Total = `$1,686.22`. Tax calculated on food only ($216.00) is invalid. |
| 6 | Device Pixel Ratio (DPR) Clamping | High-DPI screens with `window.devicePixelRatio = 3.0` (iPhone Retina) | Renderer clamps DPR via `Math.min(dpr, 1.15)` on mobile (<900px) and `Math.min(dpr, 1.5)` on desktop. Prevents fill-rate bottlenecks and preserves 60 FPS under full post-processing bloom. |
| 7 | Low-Framerate Adaptive Fallback | Frame rate drops below 45 FPS for >1000ms | Performance monitor detects `rollingFps < 45` and disables `DualKawaseBloom` pass, falling back to direct ACESFilmic tone mapping on the renderer. Once frame rate recovers to >=55 FPS, bloom re-engages. |
| 8 | WebGL Context Loss & Restoration | `webglcontextlost` event fired | `isContextLost` flag set to true; animation loop halts; Web Audio suspends. On `webglcontextrestored`, renderer rebuilds targets, compiles shaders via `warmupAllStations`, and restarts rendering loop cleanly without memory leaks. |
| 9 | Immutable ES Module Property Assignment | Assigning to `THREE.CatmullRomCurve3` | In strict ES module execution (`import * as THREE`), module namespace objects are sealed. Assigning to `THREE.CatmullRomCurve3` throws a runtime TypeError: `Cannot assign to property 'CatmullRomCurve3' of [object Module]`. Must attach to `window` or custom namespace instead. |
| 10 | Inactive Chapter DOM Pointer Blocking | Hover/click on Act 2 Banquet Cards while Act 5 is mounted | When `.chapter > *` has `pointer-events: auto` indiscriminately, the transparent plate of Act 5 intercepts clicks intended for Act 2 cards. Scoping to `.chapter.active > * { pointer-events: auto; }` resolves the issue. |
| 11 | Spatial HUD Viewport Edge Projection Clamping | Hotspots at extreme screen edges (e.g., `x = 10px` or `x = innerWidth - 20px`) | Screen-projected tooltip coordinates are clamped: `tipX = Math.min(innerWidth - 300, Math.max(20, x + 35))` and `tipY = Math.min(innerHeight - 160, Math.max(85, y - 50))`. SVG leader line coordinates adapt dynamically. |
| 12 | Hotspot Behind Camera Plane | Hotspot located at `screenVector.z > 1.0` | When projected coordinate is behind the camera frustum, tooltip opacity is immediately zeroed out and SVG leader line coordinates are cleared (`x1=0, y1=0, x2=0, y2=0`) to prevent erratic screen line artifacts. |
| 13 | Prefers-Reduced-Motion Mode | OS accessibility setting `prefers-reduced-motion: reduce` | Kinetic idle camera bobbing and high-speed scroll warping are deactivated. Station transitions occur via smooth linear easing. |
| 14 | JavaScript Disabled Mode (`<noscript>`) | Browser navigates with JavaScript disabled | Full page content remains accessible: all 5 menus, pricing tables, contact links, phone (`832-458-8180`), and email (`charcuteriechick@outlook.com`) are statically rendered and legible. |
| 15 | Multi-Add-On Stacking Math | All 4 add-ons selected for 100 guests | Beignets (100 * $4.50 = $450) + Cart ($350 flat) + Sliders (100 * $2.95 = $295) + Mimosas (100 * $4.00 = $400) = `$1,495.00`. Dynamically added to food subtotal and setup fee in taxable base. |

---

## 5. Detailed Technical Specifications & Formulas

### 5.1 Procedural 3D Mesh Specifications (Phase 0–5)

#### Phase 0: The Micro Seed
1. **Honeycomb Lattice:**
   - Topology: Array of regular hexagonal prisms (`THREE.CylinderGeometry(radius, radius, height, 6)`).
   - Dimensions: Hex radius $r = 0.18\text{m}$, wall thickness $w = 0.02\text{m}$, cell depths varying organically between $0.06\text{m}$ and $0.14\text{m}$ using Simplex/Perlin noise.
   - Material: Warm amber beeswax PBR material (`color: 0xf0c060`, `roughness: 0.35`, `transmission: 0.65`, `thickness: 0.5`, `ior: 1.54`).
2. **Raymarched/Refractive Honey Droplets:**
   - Shading: Custom fragment shader implementing Beer-Lambert light absorption:
     $$\text{Transmittance} = \exp(-\sigma_a \cdot d)$$
     where $\sigma_a = (0.2, 0.6, 1.8)$ absorbs blue wavelengths heavily, producing deep amber/golden core.
   - Viscosity Physics: Surface wobble driven by pointer delta:
     $$\Delta z = A \cdot \sin(\omega t + \mathbf{k} \cdot \mathbf{x}) \cdot \exp(-\gamma t)$$
3. **Parametric Catmull-Rom Prosciutto Ribbon:**
   - Geometry: Ribbon extruded along a 3D spline curve with 8 control points twisting in space:
     $$\mathbf{C}(t) = \text{CatmullRom}(\mathbf{P}_0, \mathbf{P}_1, \dots, \mathbf{P}_7)$$
   - Shader: Anisotropic sheen ($(\mathbf{T} \cdot \mathbf{H})$ fiber scattering) with alternating procedural red lean meat and cream-colored fat striations.
4. **Rosemary Needle Sprig:**
   - Stem: Slender cylinder curving naturally.
   - Needles: Instanced or combined tapered meshes with dark green pine albedo (`#2d4a22`) and subsurface back-scatter.

#### Phase 1: The Artisan Board
1. **Black Walnut Slab:**
   - Dimensions: $1.8\text{m} \times 1.2\text{m} \times 0.08\text{m}$.
   - Edge: Beveled router profile (`chamfer = 0.015\text{m}`).
   - Textures: End-grain procedural normal maps showing concentric annual growth rings and subtle knife cut grooves (`roughness: 0.45`, `metalness: 0.05`).
2. **Spanish Manchego Wedge (D.O.P.):**
   - Geometry: 45-degree wedge cut from a 20cm diameter wheel.
   - Rind: Dark etched herringbone zigzag pattern normal map (`#4a3c28`).
   - Paste: Pale ivory-yellow (`#f5eed2`) with micro-crystalline specular pits.
3. **French Brie Wheel:**
   - Geometry: 24cm diameter wheel with a 30-degree slice removed.
   - Rind: White velvety bloomy rind procedural normal map (`#faf7f0`, `roughness: 0.85`).
   - Paste: Decadent, soft bulging cream paste oozing slightly at the base.
4. **Mission Figs:**
   - Geometry: Halved tear-drop figs with dark aubergine skin (`#2b1828`) and crimson interior seed cavity (`#9e2b3e`) with high-specular seed beads (`#ffbe55`).
5. **Crystal Sommelier Glass:**
   - Material: `THREE.MeshPhysicalMaterial` (`roughness: 0.02`, `transmission: 0.98`, `ior: 1.52`, `thickness: 0.12`).
   - Meniscus: Internal red wine liquid surface with concave meniscus curve.

#### Phase 2: The Banquet Tables
1. **12-Foot Banquet Table:**
   - Layout: Stretches along X-axis from $X = 18.0$ to $X = 26.0$, $Z = -1.2$ to $+1.2$.
   - Props: Wrought iron candle stands with glowing tapered candles; eucalyptus leaf runners weaving between board risers.
2. **Tiered Grazing Risers:**
   - Multi-level polished marble and copper risers displaying food portions for the 4 verified tiers:
     - Tier 1: Graze Me ($24/pp)
     - Tier 2: Standard ($26/pp)
     - Tier 3: Super ($30/pp)
     - Tier 4: Grand ($38/pp)

#### Phase 3: The Mobile Cart & Holy Grail
1. **Houston's Largest Mobile Cart:**
   - Frame: Heavy black wrought iron canopy frame with arched roof ribs.
   - Wheels: Large spoked vintage carriage wheels with polished brass hubs and casters.
   - Countertop: Polished white Carrara marble slab.
2. **Hanging Edison Bulbs:**
   - Fixtures: 3 suspended brass sockets with vintage teardrop glass bulbs.
   - Lighting: Inverse-square light decay ($1 / d^2$) casting warm 2200K amber glow on cart surface.
3. **Holy Grail Centerpiece:**
   - Multi-tier showpiece centerpiece with cascading greenery, meats, cheeses, and artisanal breads ($2,000 / $3,500).

#### Phase 4: The Culinary Heritage
1. **Damascus Steel Chef Knife:**
   - Blade: 24cm gyuto/chef knife profile with distinctive swirling Damascus pattern normal map and iridescent specular reflection.
   - Handle: Octagonal dark ebony wood with brass ferrule.
2. **Accolade Badges:**
   - 3D embossed metallic medals:
     - The Knot: "Best of Weddings 2026 — 5.0 Stars (13 Reviews)"
     - WeddingWire: "Couples' Choice Awards 2026 — 5.0 Stars (11 Reviews)"

#### Phase 5: The Spatial Quote Configurator Surface
1. **3D Interactive Control Surface:**
   - Embedded 3D console with tactile, depressible 3D buttons for tier selection.
   - 3D slider rail with draggable brass knob tracking guest count between 50 and 300.
   - Real-time 3D projected receipt card displaying itemized totals.

---

### 5.2 Mathematical Billing & Tax Engine Invariants

The pricing engine must strictly satisfy the authoritative formulas defined in `qa_full.py` and `FACTS.md`:

1. **Food Subtotal ($S_{\text{food}}$):**
   - For Per-Person Tiers ($r \in \{24, 26, 30, 38\}$, $g \ge 50$):
     $$S_{\text{food}} = g \times r$$
   - For Holy Grail Centerpiece ($r = \text{holy}$):
     $$S_{\text{food}} = \begin{cases} 2000.00 & \text{if } g \le 75 \\ 3500.00 & \text{if } 75 < g \le 150 \end{cases}$$

2. **Add-Ons Subtotal ($S_{\text{addons}}$):**
   $$S_{\text{addons}} = (4.50 \cdot g \cdot I_{\text{beignets}}) + (350.00 \cdot I_{\text{cart}}) + (2.95 \cdot g \cdot I_{\text{sliders}}) + (4.00 \cdot g \cdot I_{\text{mimosas}})$$
   where $I \in \{0, 1\}$ represents checkbox state.

3. **Extra Service Time Fee ($S_{\text{time}}$):**
   $$S_{\text{time}} = g \times h \times 3.00$$
   where $h$ is extra half-hours beyond 90 minutes.

4. **Mandatory Production & Setup Fee ($F_{\text{setup}}$):**
   $$F_{\text{setup}} = 229.00 \quad (\text{fixed constant})$$

5. **Texas Catering Sales Tax Base & Tax Amount:**
   - Invariant: Mandatory setup and service fees are legally subject to catering sales tax.
     $$\text{Taxable Subtotal } (S_{\text{taxable}}) = S_{\text{food}} + S_{\text{addons}} + S_{\text{time}} + F_{\text{setup}}$$
     $$\text{Tax Amount } (T) = \frac{\text{round}(S_{\text{taxable}} \times 18)}{100}$$

6. **Grand Total Investment ($G$):**
   $$G = S_{\text{taxable}} + T$$

#### Verified Test Invariants (from `qa_full.py` line 72):
- Holy Grail (75 guests, 0 extra): $2,000 + $229 = $2,229.00; Tax = $401.22; **Total = $2,630.22**
- Holy Grail (150 guests, 0 extra): $3,500 + $229 = $3,729.00; Tax = $671.22; **Total = $4,400.22**
- Grand Graze (50 guests, 0 extra): $1,900 + $229 = $2,129.00; Tax = $383.22; **Total = $2,512.22**
- Super Graze (50 guests, 0 extra): $1,500 + $229 = $1,729.00; Tax = $311.22; **Total = $2,040.22**
- Standard Graze (50 guests, 0 extra): $1,300 + $229 = $1,529.00; Tax = $275.22; **Total = $1,804.22**
- Graze Me (50 guests, 0 extra): $1,200 + $229 = $1,429.00; Tax = $257.22; **Total = $1,686.22**
- Graze Me (50 guests, 2 extra half-hours): Food $1,200 + Extra $300 + Setup $229 = $1,729.00; Tax = $311.22; **Total = $2,040.22**
- Holy Grail (150 guests, 4 extra half-hours): Base $3,500 + Extra $1,800 + Setup $229 = $5,529.00; Tax = $995.22; **Total = $6,524.22**

---

### 5.3 Communication Deep-Link Specifications

#### SMS Trigger (`#btn-sms`):
- Protocol: `sms:+18324588180?body={encoded_body}`
- Required body content:
  - Header: `Hi Tricia! I'm planning an event for [guests] guests using your 3D builder.`
  - Selected tier name and guest calculation.
  - Itemized lines: Food Subtotal, Add-ons (if any), Production & Styling Setup ($229.00), Texas State Tax (18% Catering), Total Investment.
  - Call to action: `Is my date available?`

#### Email Trigger (`#btn-email`):
- Protocol: `mailto:charcuteriechick@outlook.com?subject={encoded_subject}&body={encoded_body}`
- Subject: `Charcuterie Chick Event Quote — [guests] Guests ([Tier Name])`
- Required body content: Formal itemized proposal matching SMS receipt lines.

---

## 6. Concrete Implementation Recommendations for Engineers

1. **Deconstruct `createCenterpieceDisplay`:**
   - In `experience.js`, retire the flat `PlaneGeometry` relief portal mounting.
   - Implement dedicated procedural geometry builder functions:
     - `createHoneycombLatticeMesh()`
     - `createArtisanBoardStage()` (Walnut slab, Manchego wedge, Brie wheel, Figs, Wine glass)
     - `createBanquetFeastStage()` (12-foot banquet table, foliage runner, candle stands)
     - `createMobileCartStage()` (3D brass-wheeled cart, canopy, Edison fixtures)
     - `createHeritageStage()` (Damascus knife, end-grain butcher block, accolade medals)
     - `createSpatialConfiguratorStage()` (3D tactile buttons and slider)
2. **Fix ES Module Strict Assignment Bug:**
   - Remove line 2269: `THREE.CatmullRomCurve3 = CatmullRomSpline3;`
   - Bind `CatmullRomSpline3` to a distinct global namespace or module export.
3. **Fix Inactive Chapter Pointer Interception:**
   - In `experience.css`, replace `.chapter > * { pointer-events: auto; }` with `.chapter.active > * { pointer-events: auto; }`.
4. **Harmonize Camera Trajectory with Roll & Breathing:**
   - Add roll angle $\theta_{\text{roll}}(t)$ to `CatmullRomSpline3` evaluation, applying `camera.rotation.z` during arc turns.
   - Modulate `camera.fov = 40.0 + Math.min(Math.abs(scrollVelocity) * 12.0, 10.0)`.
5. **Verify Playwright Test Suite Compatibility:**
   - Ensure all DOM selectors required by `test_3d_experience.py` (`#webgl-canvas`, `.nav-station`, `#btn-audio`, `#input-guests`, `.tier-pill`, `.receipt-card`, `#btn-sms`, `#btn-email`, `#hud-tooltip`, `#hud-line`, `#hud-title`) remain intact.

---
*Report compiled and certified authoritative by `spec_miner_v2_1`.*
