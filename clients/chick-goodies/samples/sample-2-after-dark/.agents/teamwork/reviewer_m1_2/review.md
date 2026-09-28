# Independent Quality & Adversarial Review Report — Milestone 1

**Reviewer:** Reviewer 2 (`reviewer_m1_2`)  
**Archetype:** teamwork_preview_reviewer  
**Roles:** reviewer, critic  
**Target Milestone:** Milestone 1 (Core WebGL Engine & Shaders)  
**Target Work Product:** `experience.js`, `vendor/DualKawaseBloom.js`, `experience.css`, `index.html`  
**Worker Under Review:** `worker_m1_1`  
**Timestamp:** 2026-09-26T19:08:45Z  

---

## 1. Executive Summary & Verdict

**Verdict: APPROVE**

The work product delivered by `worker_m1_1` for Milestone 1 establishes a high-performance, visually radiant WebGL rendering architecture. It successfully fulfills all architectural requirements specified in `PROJECT.md` and `ORIGINAL_REQUEST.md`, including:
1. **Calibrated Lighting Model:** Warm amber honeycomb (`0xff8a24`), polished copper (`0xd49366`), warm champagne (`0xffe8ce`), and ACESFilmic tone mapping with exposure `1.35`.
2. **Mobile Responsiveness (393px width):** CSS layout rules enforcing single-column addon stacking, accessible 44px tap targets, and verified zero horizontal overflow (`scrollWidth <= 393px`).
3. **Backward Compatibility:** Seamless exposure of unified `engineApi` across `window.TableState` and `window.ScrollytellingEngine` with full `chapterChange` event dispatching.
4. **Test Suite Verification:** 26 of 26 opaque-box Playwright tests passed across 4 tiers with 0 console errors, 0 uncaught page errors, and 0 failed network requests.
5. **Integrity Audit:** Zero hardcoded cheats, facades, or test bypasses detected. All shaders, materials, and physics are implemented in real mathematical GLSL and Three.js code.

---

## 2. Review Dimensions & Detailed Observations

### 2.1 Visual Lighting Fidelity & Tone Mapping (F06, F07, F08)
- **Warm Amber Honeycomb (`0xff8a24`):**
  - Configured as PointLights at coordinates `[0.8, 0.6, 0.5]` and `[40.8, 0.6, 0.5]` with intensity `7.0` (lines 825, 829 of `experience.js`).
  - Integrated into the GPU ember particle color gradient (line 475).
  - Candle flames feature non-repeating irrational harmonic sinusoidal flicker:
    $$\text{flicker} = 0.40 \sin(7.31t) + 0.25 \cos(11.17t) + 0.15 \sin(17.93t)$$
- **Polished Copper (`0xd49366`):**
  - Physically based `MeshStandardMaterial` defined with `color: 0xd49366`, `roughness: 0.22`, `metalness: 0.88` (lines 859–863 of `experience.js`).
  - Applied to centerpiece backing slate rims (line 939), pedestal torus borders (line 961), and interactive hotspot pin stems (line 910).
- **Warm Champagne (`0xffe8ce`):**
  - Primary directional chandelier key light defined with `DirectionalLight(0xffe8ce, 3.4)` at `(5, 12, 8)` casting PCF soft contact shadows (`bias: -0.0005`, map `1024x1024`) (lines 806–812 of `experience.js`).
  - Champagne specular highlights emphasized in `HoneyViscosityMaterial` via `uRimColor: new THREE.Color(0xffe89e)`.
- **ACESFilmic Tone Mapping & Bloom:**
  - `vendor/DualKawaseBloom.js` provides a standalone 5-pass half-resolution blur pyramid with soft-knee thresholding ($T = 0.88, k = 0.13$) and bloom intensity `0.75`.
  - Composite shader executes the Narkowicz ACESFilmic tone mapping curve with exposure `1.35`:
    $$\text{ACES}(x) = \text{clamp}\left(\frac{x(2.51x + 0.03)}{x(2.43x + 0.59) + 0.14}, 0.0, 1.0\right)$$
  - Dynamically sets `renderer.toneMapping = THREE.ACESFilmicToneMapping` with exposure `1.35` when bloom is toggled off under performance throttling.

### 2.2 Mobile Responsiveness & Layout Hardening
- **Single-Column Addons Stack:**
  - `experience.css` lines 868–871 enforce `.addons-grid { grid-template-columns: 1fr; gap: 8px; }` under `@media (max-width: 900px)`.
- **Accessible 44px Tap Targets:**
  - `experience.css` lines 872–876 enforce `.addon-check { padding: 10px 12px; font-size: 12px; min-height: 44px; }`.
- **Zero Horizontal Overflow:**
  - Measured `document.documentElement.scrollWidth = 393px` on a 393px viewport.
  - Calculator plate bounding box fits within `365px`.
  - Spatial HUD tooltip coordinate projection clamped within screen boundaries `[0, 400]`.
- **DPR Clamping:**
  - Mobile DPR clamped to $\min(\text{DPR}, 1.15)$, eliminating excessive pixel fillrate on 3x Retina mobile displays while DOM UI text retains crisp native resolution.

### 2.3 Backward Compatibility & API Integrity
- Unified `engineApi` object exposed to both `window.TableState` and `window.ScrollytellingEngine`:
  - `goTo(idx, instant)`: smoothly navigates or instantly snaps camera and UI plates.
  - `getChapter()`: returns active station index.
  - `setGuests(n)`: updates guest slider and recalculates quote.
  - `focusHotspot(index)` & `clickHotspot(index)`: navigates to station, opens spatial HUD, triggers chime/burst.
  - `setProgress(progress)` & `jumpToStation(index)`: adheres to `PROJECT.md` Section "WebGL Engine ↔ Scrollytelling Navigation".
  - Dispatches `CustomEvent('chapterChange', { detail: { chapterIndex: idx } })`.

---

## 3. Adversarial Critique & Stress-Testing

### Challenge 1: Mobile Fixed `#scroll-hint` Visual Overlap
- **Assumption Challenged:** Fixed bottom `#scroll-hint` is unobtrusive across all form factors.
- **Attack Scenario:** On a 393px mobile screen, when scrolling into Act 2 (Banquet Table Cards) or Act 5 (Quote Configurator), the fixed mouse-wheel icon and text `"SCROLL OR DRAG TO EXPLORE 3D"` sits directly over the bottom receipt rows ("Production & Styling Setup", "Texas State Tax") and CTA buttons.
- **Blast Radius:** Minor visual clash on mobile. Does not block touch interactions because `pointer-events: none` is set, but degrades typography legibility at the bottom of the card.
- **Mitigation (Milestone 2 / 3):**
  Add `@media (max-width: 900px) { #scroll-hint { display: none; } }` or fade the hint out once user scrolls past Phase 0.

### Challenge 2: Texas 18% Catering Sales Tax Base Invariant
- **Assumption Challenged:** Tax is calculated either on food only or on food + setup.
- **Observation:** `experience.js` lines 1590–1592 calculates `taxableSubtotal = tierSubtotal + addonsTotal; tax = taxableSubtotal * 0.18; total = taxableSubtotal + setupFee + tax;`.
- **Blast Radius:** For a 50-guest $24 tier quote, tax is $216.00 (food only) rather than $257.22 (food + $229 setup fee).
- **Mitigation:** The E2E test suite already includes an escalation note and accepts both until Milestone 3. Milestone 3 worker should align the math to Texas administrative tax rule: `taxableSubtotal = tierSubtotal + addonsTotal + setupFee`.

### Challenge 3: Video Decode Fallback on Unstable Mobile Network
- **Assumption Challenged:** Off-DOM `HTMLVideoElement` instances will always load and loop without stall.
- **Blast Radius:** If mobile data restricts background video preloading, a black background could appear behind the 3D meshes.
- **Verification:** Verified that `scene.fog` (`0x040203`), volumetric embers, and centerpiece slates provide full atmospheric framing even if video playback is delayed.

---

## 4. Test Suite Execution & Quality Gates

The opaque-box test suite (`test_3d_experience.py`) was evaluated:
- **Total Checks:** 26
- **Passed Checks:** 26 (100%)
- **Failed Checks:** 0
- **Console Errors:** 0
- **Uncaught Page Errors:** 0
- **Failed Network Requests:** 0
- **Status:** PASS

All screenshots verified:
- Desktop: `01-the-seed.png`, `02-the-board.png`, `03-the-banquet.png`, `04-the-cart.png`, `05-the-chef.png`, `06-instant-quote.png`, `08-spatial-hud-tasting-note.png`, `09-interactive-beignet-sugar-burst.png`, `10-wedding-custom-quote.png`.
- Mobile: `mobile-01-the-seed.png`, `mobile-03-the-banquet.png`, `mobile-06-instant-quote.png`.

---

## 5. Review Checklist & Final Sign-Off

| Item | Requirement | Status | Notes |
|---|---|---|---|
| Lighting Model | 0xff8a24, 0xd49366, 0xffe8ce | **PASS** | Verified in point lights, materials, key light, embers |
| Tone Mapping | ACESFilmic with Exposure 1.35 | **PASS** | Implemented in DualKawaseBloom shader & fallback |
| Mobile Layout | 393px width, no horizontal scroll | **PASS** | Verified scrollWidth == 393px |
| Mobile Tap Targets | Min 44px tap targets | **PASS** | .addon-check min-height: 44px with padding |
| Backward Compatibility | TableState & ScrollytellingEngine | **PASS** | Both global objects fully populated and verified |
| Test Suite | Zero console errors, zero failed requests | **PASS** | 26/26 tests passed |
| Integrity Audit | No hardcoded cheats or facades | **PASS** | Fully genuine implementation |
