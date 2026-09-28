# Investigation Report: True 3D Procedural Mesh Architecture & Lusion Sensory Universe

**Author**: `explorer_v2_1` (teamwork_preview_explorer)  
**Date**: 2026-09-27T02:15:00Z  
**Project Root**: `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark`  
**Target Files Inspected**: `experience.js` (85.7 KB), `index.html` (16.7 KB), `experience.css` (18.4 KB), `immersion.js` (26.6 KB), `immersion.css` (18.4 KB), `vendor/DualKawaseBloom.js` (12.1 KB), `test_3d_experience.py` (29.4 KB)  
**Authoritative Reference**: `ORIGINAL_REQUEST.md` (2026-09-27T02:07:27Z)

---

## Executive Summary

The current WebGL application in `experience.js` establishes an impressive foundational Three.js r170 pipeline (including a 3-tier Dual-Kawase bloom pass, multi-harmonic candle flickering, GPU curl-noise embers, and an 11-point Catmull-Rom camera trajectory). However, **the central visual assets in Stations 0 through 4 rely on flat 2D textured picture billboards mounted on pedestals (`createCenterpieceDisplay`)**, rather than genuine 3D procedural meshes. Furthermore, **Station 5's mathematical quote configurator exists entirely as a 2D HTML DOM card overlay**, lacking an integrated 3D spatial interactive control surface in WebGL.

To fulfill the Lusion.co / Oryzo / Basement Studio standard required by the authoritative user request, all flat 2D image cards must be eliminated and replaced with **True 3D Procedural Meshes across Phases 0 to 5**, coupled with:
1. Dynamic fluid/pointer repulsion force fields deflecting particles and mesh vertices in real time;
2. Continuous 3D Catmull-Rom camera arc choreography with velocity-responsive FOV lens breathing, crane swoops, and roll banking;
3. Radiant luxury lighting calibrated to warm amber (`#f0c060`), polished copper (`#d47a3a`), champagne (`#f5e4b8`), and warm ember (`#ff6020`) with selective Dual-Kawase bloom and ACESFilmic tone mapping;
4. 100% mathematical and test-suite backward compatibility with `test_3d_experience.py` and `window.TableState` / `window.ScrollytellingEngine` APIs.

---

## 1. Audit of Existing Codebase: Flat 2D Artifacts to Eliminate

| Current Artifact | Location in Code | Visual Description | Problem / Defect | Elimination & Replacement Strategy |
| :--- | :--- | :--- | :--- | :--- |
| **Centerpiece Display Billboards** | `experience.js:932–978`<br>(`createCenterpieceDisplay`) | An obsidian box backing (`BoxGeometry`) + copper rim (`BoxGeometry`) + 48×48 subdivided plane displaying a 2D raster image (`PlaneGeometry`) mounted on a cylinder pedestal. | Displays flat 2D PNG/JPG photos (`stage1-micro-cone.png`, `stage2-artisan-board.png`, `stage3-grand-banquet.png`, `stage4-midnight-cart.png`, `tricia-portrait-471.jpg`). Applies slight dome extrusion (`uReliefScale: 0.06`), but remains an unmistakable flat picture frame. | **Completely eliminate `createCenterpieceDisplay` across all stations.** Replace each station's picture frame with genuine procedural 3D volumetric geometry (honeycomb lattice, black walnut board, 12-ft banquet table, mobile cart canopy, Damascus blade). |
| **Station 0: Pseudo-3D Honey Drop** | `experience.js:1030–1043` | A single deformed `SphereGeometry(0.36, 48, 48)` tapered in Y, floating next to the 2D billboard. | Lacks hexagonal prism honeycomb lattice; lacks procedural viscous surface tension wobble from pointer velocity; lacks micro-needle rosemary geometry. | Replace with **Procedural 3D Hexagonal Honeycomb Prism Array** with varying cell heights and hollow beveled wax cavities, dripping raymarched/refractive honey with Beer-Lambert absorption and pointer wobble, flanked by 3D procedural rosemary needle clusters. |
| **Station 0: Flat Prosciutto Plane** | `experience.js:1046–1051` | A flat 2D grid plane `PlaneGeometry(1.2, 0.42, 64, 32)` with sine displacement in Z/Y. | It is a single waving sheet, not a folded, twisted 3D ribbon curling along spatial curves. | Replace with **Parametric 3D Prosciutto Ribbons** extruded along 3D Catmull-Rom space curves with anisotropic striation shaders, fat marbling, and dual-sided curled folds. |
| **Station 1: 2D Board Billboard** | `experience.js:1140` (`st1Display`) | Flat picture frame with `stage2-artisan-board.png`. Zero individual 3D cheese or fruit geometry. | No dimensional slab, no physical cheese wedges, no figs, no stemware. | Replace with **True 3D Black Walnut Slab** (beveled edges, end-grain rings, knife score marks), **3D Manchego Wedge** (herringbone rind, pitted paste), **3D French Brie Wheel** (bloomy rind normal map, oozing core), **3D Mission Fig Halves** (translucent pulp, seed cavities), and **3D Refractive Crystal Wine Glass**. |
| **Station 2: 2D Banquet Billboard** | `experience.js:1185` (`st2Display`) | Flat picture frame with `stage3-grand-banquet.png`. | Does not convey the 12-foot spatial depth of an endless banquet table; no physical tiered displays. | Replace with **Sweeping 12-Foot 3D Timber Banquet Table** extending in depth with candle stands, eucalyptus foliage runners, and **4 Multi-Tier Grazing Platforms** ($24, $26, $30, $38 tiers) physically arrayed in 3D perspective. |
| **Station 3: 2D Cart Billboard** | `experience.js:1214` (`st3Display`) | Flat picture frame with `stage4-midnight-cart.png` + 3 simple sphere meshes for Edison bulbs. | The cart is a flat picture; no 3D wheels, no wrought-iron canopy, no physical champagne tower, no 3D Holy Grail centerpiece. | Replace with **Full 3D Mobile Cart** (spoke wheels with polished brass rims, black iron frame, marble top, arched canopy), **True 3D Hanging Edison Bulbs** (filament coils + point lights), **3D Champagne Coupe Pyramid Cascade**, and **3D Holy Grail Multi-Tier Centerpiece**. |
| **Station 4: 2D Chef Portrait** | `experience.js:1354` (`st4Display`) | Flat picture frame displaying `tricia-portrait-471.jpg`. | Completely static photograph; does not celebrate Chef Tricia's 35 years of physical butchery and knife craft in 3D. | Replace with **Procedural 3D Damascus Steel Chef Knife** (wavy pattern-welded iridescent shader), **3D End-Grain Butcher Block**, and **3D Embossed Metallic Accolade Medallions** (The Knot & WeddingWire 5.0). |
| **Station 5: HTML-Only Configurator** | `index.html:228–325`<br>(`.plate-calculator`) | Standard HTML range slider and CSS button grid overlaying a blank 3D canvas region. | Station 5 has no 3D interactive objects in WebGL; camera simply pulls back to an empty void while the user interacts with standard DOM form elements. | Add a **3D Spatial Interactive Control Surface in WebGL**: an angled copper/obsidian console with tactile 3D interactive push buttons (menu tiers), a 3D physical slider rail with a sliding brass puck (guest count), and a floating holographic glass receipt in world space. |
| **Cinematic Backdrop Video Plane** | `experience.js:998–1016`<br>(`bgStageMesh`) | Flat plane `PlaneGeometry(28, 16, 36, 18)` at $Z = -5.5$ playing 720p MP4 clips. | Serves as an ambient video backdrop, but when foreground objects are flat, the entire scene looks like a 2D video display. | Retain as a subtle atmospheric far-field backdrop ($Z = -6.5$, lower opacity), but establish complete foreground depth with True 3D meshes so the video acts only as ambient atmospheric light. |

---

## 2. Architectural Blueprint: True 3D Procedural Meshes (Phases 0 to 5)

Below is the concrete mathematical specification and procedural mesh generation architecture for every required object.

### Phase 0: The Micro Seed (Macro Scale)

#### 1. Hexagonal Prism Honeycomb Lattice
* **Mathematical Construction**:
  Arranged on an axial hexagonal grid where each cell coordinate $(q, r)$ maps to 3D Cartesian coordinates:
  $$x = s \cdot \sqrt{3} \cdot \left(q + \frac{r}{2}\right), \quad z = s \cdot \frac{3}{2} \cdot r$$
  where $s = 0.18\,\text{units}$ (hex outer radius).
  For a cluster of radius $R = 3$ rings (37 cells total), each cell is an extruded regular hexagon with an organic hollow cavity.
* **Geometry**:
  Constructed using `ExtrudeGeometry` from a 2D hexagon `Shape` with a hollow inner hole (wall thickness $0.02\,\text{units}$) and beveled upper edge (`bevelSegments: 3, bevelSize: 0.008, bevelThickness: 0.012`). Cell heights vary organically:
  $$h(q, r) = h_0 + 0.12 \cdot \sin(1.8 q + 2.3 r) + 0.08 \cdot \cos(3.1 r)$$
* **Material & Shader**:
  `MeshPhysicalMaterial` with beeswax transmission:
  - Color: `#f0c060` (warm honeycomb amber)
  - Roughness: `0.28`, Metalness: `0.05`
  - Transmission: `0.82`, IOR: `1.48`, Thickness: `0.45`
  - AttenuationColor: `#ff9d24`, AttenuationDistance: `0.32`
  - Clearcoat: `0.85`, ClearcoatRoughness: `0.12`

#### 2. Raymarched / Refractive Honey Droplets
* **Physics & Deformation**:
  A parametric teardrop mesh modeled via revolution of an asymmetric curve:
  $$r(y) = r_{\text{max}} \cdot \sqrt{1 - \left(\frac{y}{h}\right)^2} \cdot \left(1 - 0.4 \cdot \frac{y}{h}\right)$$
* **Pointer Viscous Wobble Shader**:
  In the vertex shader, local vertices deflect dynamically based on pointer proximity and mouse velocity:
  $$\Delta \mathbf{p} = \mathbf{n} \cdot \left( A_{\text{wobble}} \cdot \sin(8.0 y + \omega t) \cdot \exp\left(-\frac{\|\mathbf{p} - \mathbf{x}_{\text{pointer}}\|^2}{2 \sigma^2}\right) \right)$$
* **Beer-Lambert Light Absorption**:
  In the fragment shader, internal transmission path length $d$ modulates radiance:
  $$I(\lambda) = I_0 \cdot \exp\left(-\boldsymbol{\sigma}_a \cdot d\right)$$
  where $\boldsymbol{\sigma}_a = [0.15, 0.45, 1.85]$ absorbs blue wavelengths heavily, creating a rich amber core with bright champagne specular highlights.

#### 3. Parametric 3D Prosciutto Ribbons
* **Catmull-Rom Space Curve**:
  Ribbon path defined by 6 3D control points twisting into a folded floret:
  $$\mathbf{C}(u) = [x(u), y(u), z(u)], \quad u \in [0, 1]$$
* **Cross-Section Strip Geometry**:
  A quad strip parameterized by width $w = 0.35\,\text{units}$ and normal rotation $\theta(u) = 2.8 \pi u$. At each sample along the spline, two vertices are generated:
  $$\mathbf{v}_{\text{left}}(u) = \mathbf{C}(u) - \frac{w}{2} \mathbf{b}(u), \quad \mathbf{v}_{\text{right}}(u) = \mathbf{C}(u) + \frac{w}{2} \mathbf{b}(u)$$
  where $\mathbf{b}(u)$ is the binormal vector rotated around the spline tangent $\mathbf{t}(u)$.
* **Anisotropic Striation Shader**:
  Muscle fiber striations computed via directional noise:
  $$\text{fiber} = \sin(u \cdot 180.0 + \text{noise}(u \cdot 20.0, v \cdot 5.0) \cdot 6.0)$$
  Blends between cured lean red (`#b82e38`) and creamy fat marbling (`#f6eedc`). Anisotropic specular highlight catches glancing light along the meat grain.

#### 4. 3D Rosemary Needle Geometry
* **Stem & Needle Cluster**:
  Woody stem formed by a curving `CylinderGeometry(0.015, 0.022, 0.9, 12)`.
  Cluster of 72 individual 3D needle meshes (`ConeGeometry(0.018, 0.16, 6)`) distributed in a Fibonacci spiral:
  $$\theta_k = k \times 137.5077^\circ, \quad y_k = -0.4 + 0.8 \cdot \frac{k}{72}$$
* **Subsurface Scatter Lighting**:
  Needles carry a translucent jade-green material (`#284e31`) with a wrap-around diffuse shader:
  $$\text{diffuse} = \frac{\mathbf{N} \cdot \mathbf{L} + 0.4}{1.4}, \quad \text{translucency} = \text{pow}(\max(0.0, \mathbf{V} \cdot -\mathbf{L}), 3.0) \cdot 0.6$$

---

### Phase 1: The Artisan Board (Gathering Scale: 10–25 Guests)

#### 1. 3D Black Walnut Slab
* **Geometry**:
  Beveled live-edge hardwood board: dimensions $2.4 \times 0.12 \times 1.8\,\text{units}$.
  Created via `ExtrudeGeometry` with a custom polygon contour featuring gentle natural live-edge undulations on the lateral edges, beveled top rim (`bevelSize: 0.015, bevelThickness: 0.015`).
* **Procedural Wood Shader**:
  - Grain lines: Concentric cylindrical rings perturbed by 3D Perlin noise:
    $$r_{\text{grain}} = \sqrt{(x - x_0)^2 + (z - z_0)^2} + 0.35 \cdot \text{fbm}(\mathbf{p} \cdot 4.0)$$
    $$\text{grainMask} = \sin(r_{\text{grain}} \cdot 38.0)$$
  - End-grain darkening on transverse cutting faces.
  - Normal map scoring: Multi-directional razor knife cut grooves where blades scored the surface.
  - Finish: Satin mineral oil sheen (`roughness: 0.32, metalness: 0.08`).

#### 2. Pitted Spanish Manchego Wedge (D.O.P.)
* **Geometry**:
  Triangular cylindrical sector (`CylinderGeometry(0.55, 0.55, 0.22, 32, 1, false, 0, \pi / 3)`).
* **Rind & Paste Textures**:
  - Exterior curved rind: Molded herringbone / esparto grass basketweave normal map. Dark waxy brown-gold tint (`#6e502c`).
  - Interior cheese face: Pale ivory-straw hue (`#f5ecc8`) with micro-indentation cavities (Voronoi cellular noise) simulating aged crystallized amino acid crunch pockets.
  - Roughness: `0.45` on paste, `0.65` on rind.

#### 3. Creamy French Brie Wheel
* **Geometry**:
  Round wheel of Brie ($r = 0.42\,\text{units}, h = 0.16\,\text{units}$) with a wedge cut out ($45^\circ$) showing the molten core.
* **Bloomy Rind Normal Map**:
  High-frequency cellular noise creating the soft, downy fungal crust (*Penicillium camemberti*) in pure chalk-ivory (`#fcfaf4`, roughness `0.85`).
* **Molten Oozing Core**:
  The cut interior face bulges outward under gravity:
  $$\Delta z = 0.035 \cdot \sin\left(\pi \frac{y - y_{\text{bottom}}}{h}\right)$$
  Finished with warm creamy butter-yellow (`#fae498`, roughness `0.18`, high specular clearcoat).

#### 4. Sliced Fresh Mission Figs
* **Geometry**:
  Teardrop fig halved longitudinally, revealing an internal concave seed pocket (`SphereGeometry` clipped and sculpted).
* **Materials**:
  - Skin: Deep violet-aubergine with velvety bloom (`#301528`, roughness `0.55`).
  - Pulp: Translucent ruby-crimson gradient (`#ad1d3e` to `#d96a7d`).
  - Seed cavity: Packed with 80+ instanced tiny glistening seed spheroids (`SphereGeometry(0.012, 8, 8)`) with high specular gloss (`roughness: 0.08`).

#### 5. Refractive Crystal Wine Glass
* **Geometry**:
  Parametric `LatheGeometry` from a 2D spline curve defining:
  - Flat base disc ($r = 0.22$)
  - Pulled slender stem ($r = 0.018$, height $0.48$)
  - Tapered tulip bowl ($r_{\text{max}} = 0.32$, height $0.55$)
* **Physical Glass & Liquid**:
  - Glass: `transmission: 0.98, ior: 1.54, roughness: 0.015, thickness: 0.18`.
  - Liquid: Inner meniscus cylinder filled with deep ruby Texas Cabernet / Pinot Noir (`color: #4a0512, transmission: 0.72, ior: 1.34`).

---

### Phase 2: The Banquet Tables (Room Scale: 50–150+ Guests)

#### 1. Sweeping 12-Foot 3D Banquet Table
* **Structure & Spatial Extent**:
  A rustic hardwood banquet table extending 12 feet (6.0 units in 3D world space along $X$) across spatial depth:
  - Top: 3 longitudinal plank slabs with $0.008\,\text{unit}$ expansion gap bevels.
  - Substructure: Heavy chamfered timber trestle legs and cross-beams with dark forged iron bracket pins.
  - Surface: Warm candle-bounce reflections catching natural wood grain and wax sheen.

#### 2. Candle Stands & Multi-Harmonic Flame Illumination
* **Geometry**:
  Turned brass candle sticks of varying heights ($0.25$ to $0.45\,\text{units}$) spaced along the centerline.
  Wax taper candles with drooping sculpted wax drips on collar cups.
* **Candle Flame Shader**:
  A dynamic teardrop mesh with an additive gradient shader (blue base `#2266ff` $\to$ bright core `#ffdd44` $\to$ warm orange tip `#ff5511`).
  Coupled with Three.js `PointLight` instances flickering dynamically across 4 non-integer harmonic frequencies:
  $$I(t) = I_{\text{base}} + 0.55 \sin(7.31 t) + 0.35 \cos(11.17 t) + 0.22 \sin(17.93 t) + 0.10 \sin(31.4 t)$$

#### 3. Eucalyptus Foliage Runners
* **Garland Architecture**:
  A continuous natural runner twisting down the table axis.
  Main vine: Curved Catmull-Rom spline tube.
  Branching leaves: 140 instanced silver-dollar eucalyptus leaves (oval discs with subtle 3D curvature) oriented in randomized phyllotaxis.
  Material: Sage green (`#587562`) with dusty waxy bloom and translucent subsurface scatter.

#### 4. Multi-Tier Grazing Displays ($24, $26, $30, $38 Tiers)
Four distinct 3D pedestal stations arranged sequentially along the banquet table:
1. **Tier $24 ("Graze Me, Craze Me")**: Two-tier turned wood stand displaying stacked signature sliders on brioche buns, fan-folded salami, Manchego blocks, and raw vegetable crudités.
2. **Tier $26 ("Grazing Standard")**: Elevated slate board with dual dipping ramekins (house garlic hummus and spinach dip), olive dishes, and artisan cracker fan displays.
3. **Tier $30 ("Super Graze")**: Tri-level stepped walnut and brass risers featuring three slider varieties, antipasto skewers, roasted farm asparagus, and candied pecans.
4. **Tier $38 ("Grand Graze")**: Four-tier grand architectural banquet showpiece featuring five slider towers, artisanal dip bowls, honeycomb slabs, and individual dessert shooter glasses.

---

### Phase 3: The Mobile Cart & Holy Grail (Flagship Spectacle)

#### 1. Houston’s Largest Mobile Cart in Full 3D
* **Dimensions & Frame**:
  Modeled in precise industrial-chic proportions ($2.6 \times 3.2 \times 1.4\,\text{units}$):
  - **Chassis**: Welded square-tube black wrought-iron frame (`roughness: 0.52, metalness: 0.85, color: #161214`).
  - **Wheels**: 4 heavy industrial spoke wheels ($r = 0.42\,\text{units}$) with polished brass rims (`metalness: 0.92, roughness: 0.18, color: #d49a3a`), central axle hubs, and dark rubber outer treads.
  - **Countertop**: Thick beveled white Calacatta marble slab with gold/grey veining (`roughness: 0.12, clearcoat: 0.95`).
  - **Canopy**: Arched black iron canopy overhead supported by 4 slender corner columns with decorative scrollwork brackets.

#### 2. Hanging Edison Filament Bulbs with Real-Time Inverse-Square Illumination
* **Bulb Construction**:
  3 hanging glass Edison bulbs suspended from the canopy frame by twisted black fabric cords:
  - Glass envelope: Teardrop glass bulb (`transmission: 0.95, roughness: 0.05`).
  - Filament: 3D spiral helix curve mesh (`TubeGeometry`) with glowing emissive incandescent shader (`color: #ff9922`, emissive intensity `4.2`).
  - Illumination: Each bulb houses an actual Three.js `PointLight` with physical inverse-square decay (`decay: 2.0`) casting radiant amber light downward onto the marble cart top and food displays.

#### 3. 3D Champagne Cascade with Buoyant Rising Bubbles
* **Coupe Glass Pyramid**:
  A 3-tier cascade of crystal champagne coupes:
  - Bottom tier: 6 interlocking coupes arranged in a triangle.
  - Middle tier: 3 coupes resting on the rims of the bottom tier.
  - Top tier: 1 crowning coupe.
* **Liquid Meniscus & Overflow**:
  Liquid surfaces modeled inside each coupe with golden champagne shader (`color: #f7e2a4, transmission: 0.85, ior: 1.34`).
* **Rising Bubble Particle Simulation**:
  An active GPU particle simulation inside the glass bowls: golden micro-spheres with upward buoyant velocity ($v_y = 0.25 + \text{rand} \times 0.4$), natural horizontal sinus wobble, and surface bursting.

#### 4. The $2,000 / $3,500 Holy Grail Centerpiece
* **Multi-Tier Flagship Showpiece**:
  A majestic 5-tier cascading tower ($1.8\,\text{units}$ tall):
  - Stepped concentric walnut and brass tiers.
  - Cascades of rolled charcuterie ribbons spilling between tiers.
  - Cascading grape clusters, edible 24k gold leaf accents, fresh edible floral blooms, and elevated artisan cheese rounds.

---

### Phase 4: The Culinary Heritage (Chef Tricia Holfelder)

#### 1. 3D Damascus Steel Chef Knife
* **Geometry**:
  An 8-inch chef knife blade modeled with accurate distal taper, beveled primary cutting edge, forged bolster, full tang, and triple-riveted dark pakkawood handle scales.
* **Damascus Iridescent Shader**:
  A custom fragment shader simulating 128 layers of folded steel:
  $$\text{bands} = \sin\left(x \cdot 48.0 + \text{fbm}(x \cdot 12.0, y \cdot 12.0) \cdot 7.5\right)$$
  $$\text{etch} = \text{smoothstep}(-0.2, 0.2, \text{bands})$$
  Combines high-carbon dark steel (`#222428`) with nickel-bright steel (`#d8dadc`), modulated by subtle thin-film iridescent reflections catching glancing candlelight.

#### 2. End-Grain Butcher Block
* **Geometry**:
  Heavy 4-inch thick butcher block ($1.6 \times 0.25 \times 1.2\,\text{units}$) with rounded corners and perimeter juice groove.
* **Checkerboard End-Grain Shader**:
  Grid of alternating hard maple and black walnut square blocks. Each square possesses concentric annual growth rings radiating from individual simulated tree centers, conveying decades of culinary heft.

#### 3. 3D Embossed Metallic Accolade Badges
* **Geometry**:
  Two heavy cast metallic medallion seals:
  1. **The Knot "Best of Weddings 2026"**: 5.0 Stars, 13 verified reviews.
  2. **WeddingWire "Couples' Choice 2026"**: 5.0 Stars, 11 verified reviews.
* **Shader & Relief**:
  Constructed as 3D beveled medal discs with embossed normal/displacement maps for the laurels, star ratings, and typography. Polished brass/bronze shader with dynamic specular highlights that glint as the camera tracks or the pointer hovers over them.

---

### Phase 5: The Spatial Quote Configurator (Interactive Control Surface)

#### 1. 3D Spatial Interactive Console in WebGL
* **Ergonomic Control Pedestal**:
  An angled luxury control surface modeled in 3D WebGL space at Station 5 ($X \approx 50.0$):
  - Chassis: Brushed copper console body with dark obsidian insets and beveled perimeter rim.
* **Tactile 3D Buttons (Menu Tiers)**:
  Five physical 3D keycaps modeled as beveled rectangular buttons:
  - $24 ("Graze Me")
  - $26 ("Standard")
  - $30 ("Super")
  - $38 ("Grand")
  - "Holy Grail"
  - **Physical Interactive Behavior**: When raycasted/clicked, the selected 3D button physically depresses into the console plate by $0.02\,\text{units}$ with a spring-damped return, and an internal amber LED ring lights up around the button perimeter.
* **Dynamic 3D Slider Rail (Guest Count)**:
  A physical metallic slot cut into the console face with a knurled brass slider puck. Dragging the puck in 3D updates the guest count ($50$ to $300$) in real time, accompanied by a dynamic holographic numerical readout floating directly above the puck.
* **3D Add-On Mechanical Toggles**:
  Four physical toggle switches for Zeppole Beignets, Midnight Cart, Sliders, and Mimosa Bar, featuring physical up/down flip animation and luminous status indicators.
* **Floating 3D Holographic Glass Receipt**:
  A floating beveled glass slate displaying live mathematical calculations:
  - Tier Subtotal ($G \times \text{Rate}$)
  - Add-ons Subtotal
  - Mandatory Setup Fee: **$229.00**
  - Texas Catering Sales Tax: **18%**
  - Grand Total Investment
  - Instant trigger links for SMS (`832-458-8180`) and Email (`charcuteriechick@outlook.com`).
  - *Synchronization*: Perfectly bi-directionally synchronized with the existing HTML DOM controls to maintain 100% test compatibility with `test_3d_experience.py`.

---

## 3. Fluid Pointer Dynamics & Continuous Camera Arc Choreography

### 1. Pointer Repulsion Force Field
* **Interaction Mechanism**:
  A real-time vector force field is evaluated per frame based on cursor coordinates projected into 3D world space $\mathbf{x}_{\text{cursor}}$:
  $$\mathbf{F}(\mathbf{p}) = \frac{\mathbf{p} - \mathbf{x}_{\text{cursor}}}{\max(\|\mathbf{p} - \mathbf{x}_{\text{cursor}}\|, 0.1)^3} \cdot K_{\text{repulse}}$$
* **Disturbing Ember Particles**:
  The vertex shader in `createGpuEmberField` applies this repulsion force, pushing floating golden embers away from the user's cursor with a vortex curl-noise swirl:
  $$\Delta \mathbf{p}_{\text{ember}} = \mathbf{F}(\mathbf{p}) \cdot \Delta t + \text{curlNoise}(\mathbf{p} \cdot 0.12) \cdot (0.35 + |v_{\text{scroll}}| \cdot 1.5)$$
* **Deflecting Mesh Vertices**:
  For organic foreground meshes (honey droplets, prosciutto ribbons, rosemary needles), the cursor position is passed as a uniform `uCursorWorldPos`. Vertices within the repulsion radius ($R = 1.2\,\text{units}$) deflect dynamically with viscous damping.

### 2. Continuous 3D Catmull-Rom Camera Spline Trajectory
The camera follows an unbroken $C^1$-continuous Catmull-Rom centripetal spline with 11 strategic 3D control points spanning Phases 0 through 5:

```
Station 0 (Macro Seed)           ── [  0.0,  0.05, 3.3 ]  (LookAt: [ 1.2,  0.10, 0.0 ])
  │ Arc 0→1 (Crane Up & Pull Back) ── [  4.8,  3.20, 8.8 ]  (LookAt: [ 6.0,  0.20, 0.0 ])
Station 1 (Artisan Board)        ── [  9.8,  2.60, 7.8 ]  (LookAt: [ 8.2, -0.30, 0.0 ])
  │ Arc 1→2 (Skimming Dive)       ── [ 14.8, -0.25, 2.3 ]  (LookAt: [ 16.0, 0.30, 0.0 ])
Station 2 (12-Ft Banquet Table)  ── [ 20.0, -0.20, 2.5 ]  (LookAt: [ 21.5, 0.15, 0.0 ])
  │ Arc 2→3 (Explosive Crane Lift)── [ 24.5,  4.00, 9.5 ]  (LookAt: [ 26.5, 0.00, 0.0 ])
Station 3 (Mobile Cart & Grail)  ── [ 29.8,  2.40, 7.5 ]  (LookAt: [ 27.5, -0.20, 0.0 ])
  │ Arc 3→4 (Descent to Knife)    ── [ 34.5,  0.60, 4.2 ]  (LookAt: [ 38.0, 0.20, 0.0 ])
Station 4 (Damascus Craft)       ── [ 40.0,  0.45, 3.5 ]  (LookAt: [ 41.5, 0.10, 0.0 ])
  │ Arc 4→5 (Dynamic Push & Pull) ── [ 44.8, -0.30, 2.0 ]  (LookAt: [ 48.5, 0.50, 0.0 ])
Station 5 (Spatial Configurator) ── [ 50.0,  1.20, 6.2 ]  (LookAt: [ 50.0, 0.00, 0.0 ])
```

* **Velocity-Responsive FOV Lens Breathing**:
  $$\text{FOV} = 40.0^\circ + 8.5^\circ \cdot \min(1.0, |v_{\text{scroll}}| \cdot 6.0) - 2.5^\circ \cdot \text{holdProgress}$$
  During fast scrolling or drag moves, the camera lens pulls back into wide-angle mode ($48.5^\circ$), expanding the field of view and enhancing sensation of speed, then smoothly contracts to $40.0^\circ$ as it settles into a station.
* **Cinematic Idle Breathing**:
  $$\text{cam.z} \mathrel{+}= \sin(\text{time} \cdot 0.38) \cdot 0.08\,\text{units}$$
  $$\text{cam.y} \mathrel{+}= \cos(\text{time} \cdot 0.26) \cdot 0.04\,\text{units}$$

### 3. Smooth Momentum Damping & Verlet Integration
* **Exponential Momentum Decay**:
  $$v_{\text{scroll}} \leftarrow v_{\text{scroll}} \cdot \exp(-7.6 \cdot \Delta t)$$
  $$\text{targetProgress} \leftarrow \text{clamp}(\text{targetProgress} + v_{\text{scroll}}, 0, 1)$$
  $$\text{currentProgress} \leftarrow \text{currentProgress} + (\text{targetProgress} - \text{currentProgress}) \cdot (1 - \exp(-5.5 \cdot \Delta t))$$
* **Verlet Damping on Orbit Tilt**:
  User mouse drag tilts the camera subtly around the focal point; tilt velocities decay exponentially with parameter $\lambda = 3.7\,\text{s}^{-1}$, guaranteeing buttery 60fps interaction on both touch and mouse.

---

## 4. Radiant Luminous Lighting Model & Post-Processing Pipeline

### 1. Luxury Palette Calibration
The lighting model completely eliminates muddy or flat black palettes, replacing them with warm, radiant culinary tones:
* **Honeycomb Amber**: `#f0c060` (sRGB: `0.941, 0.753, 0.376`)
* **Polished Copper**: `#d47a3a` (sRGB: `0.831, 0.478, 0.227`)
* **Champagne Gold**: `#f5e4b8` (sRGB: `0.961, 0.894, 0.722`)
* **Warm Ember**: `#ff6020` (sRGB: `1.000, 0.376, 0.125`)
* **Warm Table Bounce Fill**: `#ff8a20` (casts soft candlelight bounce upward from surfaces)
* **Sculptural Rim Accent**: `#3a5472` (cool lavender-blue directional rim light, providing crisp sculptural depth separation)

### 2. Multi-Harmonic Candle Flame & Filament Lights
Six physical point lights are positioned along the spatial journey with multi-harmonic organic flicker across four non-integer frequencies, preventing artificial repetition:
$$I(t) = I_0 + 0.55 \sin(7.31 t + \phi) + 0.35 \cos(11.17 t + 1.3 \phi) + 0.22 \sin(17.93 t + 2.7 \phi) + 0.10 \sin(31.4 t + 4.1 \phi)$$

### 3. Dual-Kawase Selective Bloom & ACESFilmic Tone Mapping
* **Architecture (`DualKawaseBloom.js`)**:
  - Full-resolution HDR beauty buffer (`HalfFloatType`).
  - 3-level downsampling pyramid (Half, Quarter, Eighth resolution).
  - Soft-knee luminance threshold:
    $$\text{factor} = \frac{\max(\text{soft}, \text{lum} - \text{threshold})}{\max(\text{lum}, 0.0001)}$$
    Calibrated with `threshold: 0.62` and `knee: 0.22`, ensuring UI text remains crisp and unblown while candle flames, Edison filaments, and specular glints bloom into luxurious warm halos.
  - Dual-Kawase 3×3 tent filter upsample with additive blending.
  - Final composite pass with full ACESFilmic tone mapping curve and linear-to-sRGB conversion.
* **Performance Guard**:
  Monitors rolling FPS over 1000ms windows. If framerate drops below 45fps, bloom automatically disables; when recovering $\ge 55\text{fps}$, bloom re-enables seamlessly.

---

## 5. Business, Mathematical, and Test-Suite Invariant Compliance

The procedural mesh architecture strictly maintains all business invariants documented in `ORIGINAL_REQUEST.md` and verified by `test_3d_experience.py`:

1. **Pricing Structure**:
   - $24/pp: *Graze Me, Craze Me*
   - $26/pp: *Grazing Standard*
   - $30/pp: *Super Graze*
   - $38/pp: *Grand Graze*
   - Flagship Showpiece: *The Holy Grail Centerpiece* — **$2,000** (up to 75 guests) / **$3,500** (76 to 150+ guests).
   - Production & Styling Setup Fee: **$229.00** mandatory.
   - Texas Catering Sales Tax: **18%** applied to $(\text{FoodSubtotal} + \text{AddonsSubtotal} + \$229.00)$.
2. **Contact & Lead Routing**:
   - SMS URI: `sms:+18324588180?body=...`
   - Email URI: `mailto:charcuteriechick@outlook.com?subject=...`
3. **Heritage Accolades**:
   - Tricia Holfelder: 35 years professional restaurant craft, Tomball TX.
   - The Knot Best of Weddings 2026: 5.0 stars, 13 verified reviews.
   - WeddingWire Couples' Choice 2026: 5.0 stars, 11 verified reviews.
4. **API Surface**:
   - Must expose `window.TableState` and `window.ScrollytellingEngine` with methods:
     `goTo(idx, instant)`, `getChapter()`, `setGuests(n)`, `focusHotspot(i)`, `clickHotspot(i)`, `startHoldPortal()`, `stopHoldPortal()`, `isHoldComplete()`, `getStageGroups()`, `setProgress(p)`.
   - Must expose `window.QuoteEngine` with `setTier(tierKey)` and `calculateQuote(...)`.
   - Must preserve all 8 luxury interactive hotspots (`interactiveHotspots[0..7]`), including hotspot 7 triggering the powdered sugar burst.

---

## 6. Detailed Implementation File Mapping & Migration Strategy

To implement this True 3D Procedural Mesh universe without regressing existing functionality, the following modular code structure is recommended for the implementer:

### 1. Mesh Factory Module Structure
Create modular procedural generator functions inside or imported by `experience.js`:

```javascript
// Procedural Geometry Generators:
createHoneycombLattice(rings = 3, cellSize = 0.18)
createHoneyDropletMesh()
createProsciuttoRibbonFloret()
createRosemaryNeedleSprig()

createBlackWalnutSlab(width = 2.4, depth = 1.8, thickness = 0.12)
createManchegoWedgeMesh()
createBrieWheelMesh()
createMissionFigMesh()
createWineGlassMesh()

createBanquetTable(length = 6.0, width = 1.8)
createEucalyptusRunner(length = 6.0)
createTierDisplayMesh(tierRate = 24)

createMobileCartMesh()
createEdisonBulbAssembly()
createChampagneCascadePyramid()
createHolyGrailCenterpiece()

createDamascusKnifeMesh()
createEndGrainCuttingBlock()
createAccoladeBadge(title, rating, reviews)

createSpatialControlSurface()
createTactileButtonMesh(tierRate, label)
createDynamicSliderRail(minVal = 50, maxVal = 300)
```

### 2. Elimination Checklist for `experience.js`
1. **Remove `createCenterpieceDisplay`**: Delete the function and remove all 5 invocations:
   - `st0Display` at line 1026
   - `st1Display` at line 1140
   - `st2Display` at line 1185
   - `st3Display` at line 1214
   - `st4Display` at line 1354
2. **Mount True 3D Groups**:
   - In `stage0`: add `honeycombGroup`, `honeyDroplet`, `prosciuttoRibbonFloret`, `rosemarySprig`.
   - In `stage1`: add `walnutSlab`, `manchegoWedge`, `brieWheel`, `figCluster`, `crystalGlass`.
   - In `stage2`: add `banquetTableGroup`, `candleStands`, `eucalyptusRunner`, `tierDisplays`.
   - In `stage3`: add `mobileCartGroup`, `edisonBulbs`, `champagnePyramid`, `holyGrailTower`.
   - In `stage4`: add `damascusKnifeMesh`, `butcherBlockMesh`, `knotBadge`, `weddingWireBadge`.
   - In `stage5`: add `spatialConsoleGroup` with 3D tactile buttons and slider rail.
3. **Re-anchor Hotspots**:
   Reposition the 8 luxury interactive hotspots directly onto the physical 3D procedural meshes (e.g. hotspot 0 on the honeycomb, hotspot 1 on the rosemary needle, hotspot 2 on the prosciutto floret, hotspot 3 on the Manchego wedge, hotspot 4 on the Brie wheel, hotspot 5 on the Mission fig, hotspot 6 on the wine glass, hotspot 7 on the beignets / sugar burst).

---

## 7. Conclusion & Next Steps

This investigation provides a comprehensive, mathematically grounded roadmap to replace all remaining flat 2D picture billboards with authentic, Awwwards-caliber 3D procedural geometry. The stage is fully set for the implementer agent (`implementer_v2_1` or equivalent) to execute the code transformations.
