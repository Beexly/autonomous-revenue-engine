# Specification Miner Handoff Report — v2.0 After Dark 3D Transformation

**Document Status:** COMPLETE & HARD HANDOFF  
**Agent:** `spec_miner_v2_1` (`teamwork_preview_spec_miner`)  
**Working Directory:** `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\spec_miner_v2_1`  
**Timestamp:** 2026-09-27T02:18:00Z  

---

## 1. Observation

1. **Authoritative Specification:**
   - In `ORIGINAL_REQUEST.md` lines 84–144 (`## 2026-09-27T02:07:27Z`), six primary requirements are mandated:
     - **R1:** True 3D Procedural Mesh Environment across Phase 0 through Phase 5, explicitly demanding the elimination of flat 2D picture billboards/cards:
       * Phase 0: Hexagonal prism honeycomb lattice, raymarched/refractive honey droplets with Beer-Lambert absorption and pointer wobble, parametric 3D prosciutto ribbons twisting along 3D Catmull-Rom space curves with anisotropic striation shaders, 3D rosemary needle geometry with SSS lighting.
       * Phase 1: 3D black walnut slab with beveled edges and knife grooves, Spanish Manchego wedge (D.O.P.), creamy French Brie wheel with bloomy rind procedural normal maps, sliced fresh 3D mission figs with seed cavities, refractive crystal wine glass with liquid meniscus and Fresnel reflection.
       * Phase 2: Sweeping 12-foot 3D banquet table stretching across spatial depth with candle stands, eucalyptus foliage runners, and tiered displays for the 4 verified tiers ($24, $26, $30, $38/pp).
       * Phase 3: Houston’s largest mobile cart in 3D (brass casters, black iron canopy, hanging Edison filament bulbs casting inverse-square illumination), 3D champagne cascade with buoyant bubbles, and $2,000 / $3,500 Holy Grail multi-tier showpiece.
       * Phase 4: Chef Tricia Holfelder’s 35-year craft (3D Damascus steel chef knife with iridescent reflection, end-grain cutting blocks, 3D embossed metallic badges for Knot / WeddingWire 5.0).
       * Phase 5: 3D spatial interactive control surface in WebGL with tactile 3D buttons, dynamic slider rails, and real-time receipts.
     - **R2:** Fluid pointer dynamics & continuous 3D Catmull-Rom camera arc choreography (repulsion force field, continuous arc interpolation, FOV lens breathing, 60fps maintenance).
     - **R3:** Radiant luminous lighting (warm honey amber `#f0c060`, polished copper `#d47a3a`, champagne `#f5e4b8`, warm ember `#ff6020`, 4-frequency candle flicker, ACESFilmic + Dual-Kawase bloom).
     - **R4:** Generative asset synthesis via Higgsfield models (Seedance 2.5, Soul v2) with server-side credential isolation in `.env.local`.
     - **R5:** Complete business & mathematical integrity ($24, $26, $30, $38 tiers; 50-guest minimum; $2,000 / $3,500 Holy Grail; $229 setup fee; 18% tax on Food + Add-ons + Setup; SMS to `832-458-8180`; email to `charcuteriechick@outlook.com`; Chef Tricia 35-yr pedigree).
     - **R6:** Automated verification (Playwright suite on 1440x900 and 393x852 with 0 console errors) and Vercel edge deployment (`https://charcuterie-chick-sample-2.vercel.app`).

2. **Existing Implementation Observations:**
   - In `experience.js` lines 949–956, all centerpieces are instantiated via `createCenterpieceDisplay`:
     ```javascript
     const planeGeo = new THREE.PlaneGeometry(width, height, 48, 48);
     const portalMat = createReliefPortalMaterial(texture, { reliefScale: opts.reliefScale || 0.06 });
     const plane = new THREE.Mesh(planeGeo, portalMat);
     ```
     These mount 2D PNG/JPG image cards on obsidian box backings:
     * Stage 0 (line 1026): `'img/stage1-micro-cone.png'`
     * Stage 1 (line 1140): `'img/stage2-artisan-board.png'`
     * Stage 2 (line 1185): `'img/stage3-grand-banquet.png'`
     * Stage 3 (line 1214): `'img/stage4-midnight-cart.png'`
     * Stage 4 (line 1354): `'img/tricia-portrait-471.jpg'`
   - In `experience.js` lines 1785–1789, pricing calculations are implemented as:
     ```javascript
     const setupFee = 229.00;
     const taxableSubtotal = tierSubtotal + addonsTotal + setupFee;
     const tax = Math.round(taxableSubtotal * 18) / 100;
     const total = taxableSubtotal + tax;
     ```
     This correctly includes the $229 setup fee in the tax base, matching `qa_full.py` line 72.
   - In `experience.js` line 2269, the statement:
     ```javascript
     THREE.CatmullRomCurve3 = CatmullRomSpline3;
     ```
     throws an uncaught runtime TypeError in strict ES modules: `"Cannot assign to property 'CatmullRomCurve3' of [object Module]"`, recorded directly in `test-output/e2e-results.json` lines 11–14.
   - In `experience.css` line 280, `.chapter > * { pointer-events: auto; }` allows `#ch-5` plate elements to intercept clicks directed at Act 2 Banquet Table cards.

---

## 2. Logic Chain

1. **Observation 1 & 2 $\rightarrow$ Gap in 3D Mesh Environment:**
   The user request explicitly mandates eliminating flat 2D picture frames/cards across all phases. The current codebase uses `createCenterpieceDisplay` with flat `PlaneGeometry` textured cards across Stages 0, 1, 2, 3, and 4. Therefore, the implementing workers must replace `createCenterpieceDisplay` with genuine procedural 3D meshes (honeycomb lattice, black walnut slab, Manchego wedge, Brie wheel with normal maps, figs with seed cavities, wine glass with liquid meniscus, 12-foot banquet table with foliage runner, 3D mobile cart with brass wheels, 3D Damascus knife, 3D cutting block, and 3D accolade medals).

2. **Observation 1 & 2 $\rightarrow$ Runtime ES Module Defect:**
   Playwright tests recorded 2 page errors: `"Cannot assign to property 'CatmullRomCurve3' of [object Module]"`. `import * as THREE` produces an immutable module namespace object. Assigning `THREE.CatmullRomCurve3 = CatmullRomSpline3` in line 2269 causes this failure. Eliminating this assignment and exposing `CatmullRomSpline3` on `window` will achieve 0 page errors.

3. **Observation 1 & 2 $\rightarrow$ Mathematical Compliance:**
   The mathematical formula in `experience.js` lines 1785–1789 already implements `taxableSubtotal = tierSubtotal + addonsTotal + setupFee; tax = Math.round(taxableSubtotal * 18) / 100; total = taxableSubtotal + tax;`. This strictly matches `qa_full.py` line 72 and Texas catering tax law. The new 3D spatial configurator must preserve this exact formula.

4. **Observation 1 & 2 $\rightarrow$ CSS Pointer Interception:**
   Restricting `.chapter > * { pointer-events: auto; }` to `.chapter.active > * { pointer-events: auto; }` prevents invisible overlay plates from intercepting raycasts or clicks on 3D objects and cards.

---

## 3. Caveats

- **Generative Higgsfield Execution:** Generative asset synthesis scripts (`generate_*.py`) must run server-side only. If Higgsfield API credits are constrained, fallback procedural shaders and existing high-res photographic textures (`img/`) must provide seamless fallback without throwing asset 404s.
- **Mobile WebGL Performance:** Raymarched droplets and dense mesh geometries must maintain 60 FPS on mobile. Clamping DPR to 1.15 on mobile (<900px) and instancing foliage leaves are necessary guards.
- No other caveats.

---

## 4. Conclusion

The specification mining phase is complete. All requirements from `ORIGINAL_REQUEST.md` (`## 2026-09-27T02:07:27Z`) have been extracted, cross-referenced with `PROJECT.md`, `FACTS.md`, `facts.json`, and `qa_full.py`, and cataloged into:
1. `report.md`: Complete 46-feature inventory matrix, 15 edge cases, exact mathematical billing formulas, procedural mesh geometry specifications, and implementation recommendations.
2. Two critical existing defects were pinpointed for immediate remediation: the immutable ES module assignment error on line 2269 of `experience.js` and the CSS pointer interception on line 280 of `experience.css`.
3. The roadmap for Milestone v2.0 is fully specified and ready for the orchestrator and worker agents to implement.

---

## 5. Verification Method

To independently verify all findings and specifications:
1. **Inspect Report Artifact:**
   - View `report.md` at `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\spec_miner_v2_1\report.md`.
2. **Inspect Existing Centerpiece Implementation:**
   - In `experience.js`, search for `createCenterpieceDisplay` (lines 949–978, 1026, 1140, 1185, 1214, 1354) to verify 2D plane geometry usage.
3. **Verify ES Module Assignment Error:**
   - Inspect `experience.js` line 2269 and `test-output/e2e-results.json` lines 11–14.
4. **Verify Mathematical Tax Regression:**
   - Inspect `qa_full.py` line 72:
     ```python
     cases=[('holy',75,0,'$2,630.22'),('holy',150,0,'$4,400.22'),('grand',50,0,'$2,512.22'),('super',50,0,'$2,040.22'),('standard',50,0,'$1,804.22'),('graze',50,0,'$1,686.22'),('graze',50,2,'$2,040.22'),('holy',150,4,'$6,524.22')]
     ```
     Confirm `(Food + Setup + ExtraTime) * 1.18` exact penny matching.
5. **Run Existing Test Suite:**
   ```powershell
   python test_3d_experience.py
   ```
