# Milestone 1 Reviewer 2 Handoff Report

**Document Version:** 1.0.0-FINAL  
**Reviewer:** Reviewer 2 (`reviewer_m1_2`)  
**Parent Conversation ID:** `057057ff-b7fd-4423-8c4e-8512f5ef961b`  
**Timestamp:** 2026-09-26T19:09:15Z  

---

## 1. Observation

1. **Lighting Model & Calibration:**
   - In `sample-2-after-dark/experience.js`:
     - Line 475: ember gradient palette includes `new THREE.Color(0xff8a24)`.
     - Lines 806–812: chandelier key light initialized as `new THREE.DirectionalLight(0xffe8ce, 3.4)` at `(5, 12, 8)` with `shadow.bias = -0.0005` and `shadow.mapSize = 1024x1024`.
     - Lines 825 & 829: PointLights configured with color `0xff8a24` and intensity `7.0` at `[0.8, 0.6, 0.5]` and `[40.8, 0.6, 0.5]`.
     - Lines 859–863: `copperMaterial` initialized as `new THREE.MeshStandardMaterial({ color: 0xd49366, roughness: 0.22, metalness: 0.88 })`.
     - Lines 910, 939, 961: `copperMaterial` applied to luxury hotspot stems, centerpiece display backing rims, and pedestal borders.
     - Lines 787–796: `DualKawaseBloom` initialized with `threshold: 0.88`, `knee: 0.13`, `bloomIntensity: 0.75`, and `exposure: 1.35`.
   - In `sample-2-after-dark/vendor/DualKawaseBloom.js`:
     - Line 13: `this.exposure = options.exposure !== undefined ? options.exposure : 1.35;`.
     - Lines 217–225: ACESFilmic tone mapping curve GLSL implementation:
       ```glsl
       vec3 ACESFilmicToneMapping(vec3 color) {
         color *= uExposure;
         const float a = 2.51;
         const float b = 0.03;
         const float c = 2.43;
         const float d = 0.59;
         const float e = 0.14;
         return clamp((color * (a * color + b)) / (color * (c * color + d) + e), 0.0, 1.0);
       }
       ```
     - Lines 42–46: Dynamic fallback setting `this.renderer.toneMapping = THREE.ACESFilmicToneMapping; this.renderer.toneMappingExposure = this.exposure;`.

2. **Mobile Responsiveness (393px Viewport):**
   - In `sample-2-after-dark/experience.css`:
     - Lines 843–889: Media query `@media (max-width: 900px)` enforces:
       - `.addons-grid`: `grid-template-columns: 1fr; gap: 8px;`
       - `.addon-check`: `padding: 10px 12px; font-size: 12px; min-height: 44px;`
       - `.acts-row`: `flex-direction: column; align-items: stretch; gap: 10px;`
       - `.chapter`: `padding: 72px 14px 28px; overflow-y: auto; -webkit-overflow-scrolling: touch;`
       - `.plate`: `max-width: 100%; padding: 22px 18px;`
       - `.plate-calculator`: `max-height: none; width: 100%;`
   - In `test-output/e2e-results.json`:
     - Check M2: `Document scrollWidth: 393px (max 393px)` -> `passed: true`.
     - Check M4: `Calculator width: 365px` -> `passed: true`.
     - Check M5: `Mobile Tooltip Box: {'x': 103.8, 'y': 220.4, 'width': 248.4, 'height': 120.3}` -> `passed: true`.

3. **API Backward Compatibility:**
   - In `sample-2-after-dark/experience.js`:
     - Lines 1918–1957: `engineApi` defines `goTo`, `getChapter`, `setGuests`, `focusHotspot`, `clickHotspot`, `setProgress`, `jumpToStation`, `getClampedDPR`, `getBloomPipeline`, `getRenderer`, `getScene`, `getCamera`.
     - Lines 1960–1961: `window.TableState = engineApi; window.ScrollytellingEngine = engineApi;`.
     - Line 1329: `window.dispatchEvent(new CustomEvent('chapterChange', { detail: { chapterIndex: idx } }));`.

4. **Automated Test Results:**
   - In `sample-2-after-dark/test-output/e2e-results.json`:
     - `total_checks`: 26, `passed_checks`: 26, `failed_checks`: 0.
     - `console_errors_count`: 0, `console_errors`: [].
     - `page_errors_count`: 0, `page_errors`: [].
     - `failed_requests_count`: 0, `failed_requests`: [].
     - Overall status: `"PASS"`.

5. **Visual Inspection of Rendered Artifacts:**
   - Visual inspection of `01-the-seed.png` confirms radiant amber lighting, polished copper trims, honey droplet subsurface transmission, and undulating prosciutto ribbons.
   - Visual inspection of `mobile-06-instant-quote.png` and `mobile-03-the-banquet.png` confirms single-column stacking and zero horizontal overflow, but reveals a minor visual overlap where fixed `#scroll-hint` sits on top of bottom content on mobile screens.

---

## 2. Logic Chain

1. **Fidelity Verification:**
   - Direct inspection of the lighting hex codes in `experience.js` (`0xff8a24` on lines 825, 829; `0xd49366` on line 860; `0xffe8ce` on line 806) and the exposure value `1.35` in `DualKawaseBloom.js` confirms exact adherence to the specified luxury lighting palette.
2. **Mobile Layout Verification:**
   - The CSS rules under `@media (max-width: 900px)` in `experience.css` directly guarantee single-column layout for `.addons-grid`, 44px min-height for `.addon-check`, and full-width bounding box constraints. Automated measurements recorded in `e2e-results.json` prove that `document.documentElement.scrollWidth` equals exactly 393px on mobile viewports, proving zero horizontal overflow.
3. **Compatibility Verification:**
   - By assigning `engineApi` to both `window.TableState` and `window.ScrollytellingEngine`, the system ensures that existing test harnesses and future milestone integrations operate without interface mismatch.
4. **Quality & Integrity Assurance:**
   - Opaque-box execution of 26 tests across 4 tiers resulted in 100% pass rate with 0 console errors and 0 network failures. No hardcoded mocks or test-specific branches were found in the source code; the implementation is authentic.

---

## 3. Caveats

- **Mobile Scroll Hint Placement:**
  On mobile devices (width <= 900px), the fixed element `#scroll-hint` visually overlaps the bottom text and buttons of tall chapters (e.g. Act 2 and Act 5). While this does not block touch events due to `pointer-events: none`, hiding it on mobile screens (`display: none`) is recommended for Milestone 2 / 3.
- **Texas Catering Tax Base Invariant:**
  The current quote engine computes 18% catering tax on food and add-ons (`taxableSubtotal = tierSubtotal + addonsTotal`). As noted in the E2E escalation logs, Texas administrative tax applies to Food + Add-ons + $229 Setup fee. This adjustment is formally scoped for Milestone 3 (Quote Engine).

---

## 4. Conclusion

**Verdict: APPROVE**

Milestone 1 successfully delivers an exceptional WebGL rendering engine, luminous physically calibrated lighting, standalone mobile-safe Dual-Kawase bloom, responsive mobile touch layout, and complete backward compatibility with all quality gates passing at 100%.

---

## 5. Verification Method

To independently verify this evaluation:
1. Inspect the source definitions:
   - `experience.js`: Lines 806, 825, 859, 1918–1961.
   - `vendor/DualKawaseBloom.js`: Lines 13, 217–225.
   - `experience.css`: Lines 843–889.
2. Verify test results:
   - Check `test-output/e2e-results.json` for `status == "PASS"`, `failed_checks == 0`, and `console_errors == []`.
   - View captured screenshots in `test-output/experience-3d/` (e.g., `01-the-seed.png`, `mobile-06-instant-quote.png`).
3. Invalidation Conditions:
   - Any console error logged during page execution.
   - Horizontal scrollbar appearing on a 393px mobile viewport (`scrollWidth > 393`).
   - Tone mapping exposure diverging from 1.35 or lighting color hex diverging from specifications.
