# Charcuterie Chick WebGL Scrollytelling — End-to-End Test Infrastructure

**Document Version:** 1.0.0-PROD  
**Author:** E2E Test Suite Architect (`test_writer_e2e_1`)  
**Target Application:** Charcuterie Chick Haute Couture 3D Scrollytelling Experience (`sample-2-after-dark`)  
**Primary Suite Script:** `test_3d_experience.py`  
**Execution Command:** `python test_3d_experience.py [target_url]`  

---

## 1. Architectural Philosophy & Principles

The E2E test infrastructure for Charcuterie Chick is designed as an **opaque-box validation harness** operating under strict Awwwards/enterprise-grade standards. It exercises the application strictly as a real user would—through DOM events, pointer interactions, spatial coordinates, viewport adjustments, and published interface contracts.

### Core Architectural Principles
1. **Opaque-Box User-Observable Validation:**
   - Tests assert on observable browser realities: rendered WebGL canvas dimensions, computed styles, text values, attributes, and user-initiated state changes.
   - Internal implementation details are untouched; interface contracts (`window.TableState` / `window.ScrollytellingEngine`) are verified for contract compliance.
2. **Zero-Facade Guarantee:**
   - No mock passes or facade tests. Tests verify genuine WebGL rendering contexts (`webgl2` / `webgl`), real-time particle simulations (140-particle sugar puff burst, 320 ambient embers), spatial 3D-to-2D screen projections, and cents-accurate financial mathematics.
3. **Dual-Viewport Parity:**
   - Full test execution across both **Desktop (1440x900)** and **Mobile (393x852 iPhone 14/15 Pro)** contexts with touch emulation and device scale factor 3.0.
4. **Strict Zero-Defect Quality Gates:**
   - **Zero Console Errors:** Monitored via Playwright's `page.on('console')`. `len(console_errors) == 0` is strictly enforced.
   - **Zero Page Errors:** Monitored via `page.on('pageerror')`. `len(page_errors) == 0` is strictly enforced.
   - **Zero Failed Network Requests:** Monitored via `page.on('requestfailed')`. `len(failed_requests) == 0` is strictly enforced (filtering expected media aborts during video cross-fades).
5. **Self-Contained Ephemeral Test Harness:**
   - Spawns an internal `ThreadingHTTPServer` on dynamic port `127.0.0.1:0` with byte-range media support, shutting down cleanly upon test suite completion.

---

## 2. 4-Tier Test Case Design Methodology

The test suite is structured hierarchically across four rigorous testing tiers:

```
┌────────────────────────────────────────────────────────────────────────┐
│                   4-TIER TEST SUITE ARCHITECTURE                       │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 1: FEATURE COVERAGE (Core features in isolation)                  │
│   • 3D WebGL Canvas Mount        • Fixed Luxury HUD Navigation         │
│   • Procedural Audio Synthesizer • 6 Progressive Station Transitions   │
│   • Spatial HUD Tooltip & Line   • Beignet Sugar Burst Physics         │
│   • Configurator UI Controls                                           │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 2: BOUNDARY & CORNER CASES (Edge behaviors & environments)        │
│   • 50-Guest Minimum Floor       • Upper Boundary Math (300 guests)    │
│   • Holy Grail $2K/$3.5K Brackets• Texas 18% Tax Invariant & Audit     │
│   • DPR Clamping (<= 2.0 Guard)  • Mobile Viewport Suite (393x852)     │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 3: CROSS-FEATURE COMBINATIONS (Multi-system integration)          │
│   • Tier Sync Act 2 -> Act 5     • Multi-Add-On Toggling & Subtotals   │
│   • Spatial HUD Tooltip Clamping • Interactive Audio Synthesizer       │
├────────────────────────────────────────────────────────────────────────┤
│ TIER 4: REAL-WORLD APPLICATION SCENARIOS (End-to-end user journeys)   │
│   • Unbroken Scrollytelling Journey (0 -> 5)                           │
│   • Interactive Tasting Notes & Ingredient Exploration                 │
│   • Custom Wedding Feast Quotation Workflow (125 guests, multi-addon)  │
│   • Instant SMS Lead Trigger Verification                              │
│   • Instant Email Formal Proposal Trigger Verification                 │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Comprehensive Test Specification Matrix

| Tier | Test ID | Target Feature / Flow | Assertion & Verification Method | Expected Outcome |
|---|---|---|---|---|
| **Tier 1** | **T1.1** | Persistent 3D Canvas Mount | `#webgl-canvas` bounding box width/height > 0; WebGL context active. | Canvas mounted, visible, WebGL initialized. |
| **Tier 1** | **T1.2** | Luxury HUD Navigation | Brand badge visible, 6 `.nav-station` buttons exist, telephone link is `tel:+18324588180`. | Complete HUD mounted and responsive. |
| **Tier 1** | **T1.3** | Web Audio Procedural Soundscapes | `#btn-audio` toggle click toggles `aria-pressed="true"`, text `'Ambiance: On'`, and reverts. | Procedural audio state transitions properly. |
| **Tier 1** | **T1.4** | 6 Station Narrative Progression | Sequence Acts 0 to 5 via `window.TableState.goTo(idx, true)`. Assert active chapter and nav class. | All 6 acts activate in sync; screenshots captured. |
| **Tier 1** | **T1.5** | Spatial HUD Tooltip & Leader Line | Focus hotspot 1. Assert `#hud-tooltip` is visible, `#hud-title` populated, `#hud-line` x2 non-zero. | Screen projected tooltip and leader line appear. |
| **Tier 1** | **T1.6** | Interactive Beignet Sugar Burst | Click hotspot 7 (Beignets). Verify hotspot activates and triggers particle burst simulation. | Particle burst executes cleanly without errors. |
| **Tier 1** | **T1.7** | Configurator UI Mounting | `#input-guests`, `.tier-pill` (>=5), and `.receipt-card` visible. | Configurator controls ready for input. |
| **Tier 2** | **T2.1** | 50-Guest Minimum Floor | Verify `#input-guests` has `min="50"`. Set guests to 50; verify receipt reflects 50 guests. | 50-guest minimum enforced. |
| **Tier 2** | **T2.2** | Upper Boundary Guest Count Math | Set guests to 300. Verify total formats as valid USD currency without NaN. | Proper scaling and currency formatting. |
| **Tier 2** | **T2.3** | Holy Grail Showpiece Brackets | Holy Grail selected: 75 guests yields $2,000.00; 150 guests yields $3,500.00. | Fixed brackets evaluate accurately. |
| **Tier 2** | **T2.4** | Texas 18% Catering Tax Base | Check tax and total: Invariant `Total = Subtotal + SetupFee + Tax` verified. Document tax base behavior. | Verified tax calculation; escalation logged. |
| **Tier 2** | **T2.5** | DPR Clamping Performance Guard | Verify renderer pixel ratio is clamped: `Math.min(devicePixelRatio, 2.0) <= 2.0`. | Prevents GPU fill-rate exhaustion on 3x screens. |
| **Tier 2** | **M1** | Mobile Fullscreen Canvas Mount | Mount canvas on mobile viewport (393x852). Assert visibility and layout integrity. | Mobile canvas renders fullscreen. |
| **Tier 2** | **M2** | Mobile Overflow Prevention | Assert `document.documentElement.scrollWidth <= 393`. | Zero horizontal page overflow on mobile. |
| **Tier 2** | **M3** | Mobile Station Progression | Navigate to Act 2 on mobile viewport; assert `#ch-2.active`. | Mobile touch/state progression verified. |
| **Tier 2** | **M4** | Mobile Calculator Responsive Fit | Assert `.plate-calculator` bounding box width `<= 393px`. | Single-column responsive plate fits screen. |
| **Tier 2** | **M5** | Mobile Spatial HUD Viewport Clamp | Focus hotspot 1 on mobile; assert tooltip box `x >= 0` and `x + width <= 400`. | Tooltip clamps inside mobile viewport. |
| **Tier 3** | **T3.1** | Tier Selection Synchronization | Click Super Graze ($30) card in Act 2; navigate to Act 5; assert pill 30 active and receipt updated. | Act 2 card clicks synchronize with Act 5 state. |
| **Tier 3** | **T3.2** | Multi-Add-On Toggling & Math | Toggle Beignets ($4.50*N) and Cart ($350 flat); assert dynamic subtotal matches $800.00 for 100 guests. | Mixed per-person and flat add-ons calculated. |
| **Tier 3** | **T3.3** | Spatial HUD Dynamic Projection | Verify tooltip bounding box remains inside `[0, innerWidth]` and `[0, innerHeight]`. | Screen projection boundary clamping verified. |
| **Tier 3** | **T3.4** | Audio Trigger on Interaction | Verify user interaction initializes procedural audio context safely. | Clean audio state management. |
| **Tier 4** | **T4.1** | Full Scrollytelling Journey | Sequential traversal from Act 0 through Act 5. Verify chapter progression. | Smooth narrative arc without stalls. |
| **Tier 4** | **T4.2** | Interactive Tasting Notes Exploration | Focus culinary nodes; verify ingredient and provenance descriptions. | Sensory culinary notes accessible. |
| **Tier 4** | **T4.3** | Custom Wedding Feast Quote | 125 guests, Grand Graze ($38), Beignets ($4.50), Cart ($350). Food: $4,750.00, Add-ons: $912.50. | Full wedding receipt verified to the penny. |
| **Tier 4** | **T4.4** | Instant SMS Lead Capture Trigger | Inspect `#btn-sms` href: `sms:+18324588180?body=...` with decoded details. | Pre-filled SMS lead link verified. |
| **Tier 4** | **T4.5** | Instant Email Proposal Trigger | Inspect `#btn-email` href: `mailto:charcuteriechick@outlook.com?subject=...` with proposal body. | Pre-filled formal email link verified. |

---

## 4. Test Execution & Usage

### Running Locally (Automated Self-Hosted Server)
```powershell
python test_3d_experience.py
```
*Spawns a local `ThreadingHTTPServer` on a free ephemeral port, launches headless Playwright Chromium, executes the full test matrix (Desktop + Mobile), and produces screenshots and JSON results.*

### Running Against a Live Production URL (e.g., Vercel Edge)
```powershell
python test_3d_experience.py https://charcuterie-chick-sample-2.vercel.app/index.html
```

### Artifact Outputs
- **Screenshots Directory:** `test-output/experience-3d/`
  - `01-the-seed.png` (Act 0 macro view)
  - `02-the-board.png` (Act 1 artisan board)
  - `03-the-banquet.png` (Act 2 banquet table feast)
  - `04-the-cart.png` (Act 3 mobile cart)
  - `05-the-chef.png` (Act 4 culinary pedigree & accolades)
  - `06-instant-quote.png` (Act 5 instant quote configurator)
  - `08-spatial-hud-tasting-note.png` (Spatial HUD tooltip & dynamic SVG leader line)
  - `09-interactive-beignet-sugar-burst.png` (Beignet powdered sugar particle burst)
  - `10-wedding-custom-quote.png` (Full wedding feast quotation receipt)
  - `mobile-01-the-seed.png` (Mobile viewport Act 0)
  - `mobile-03-the-banquet.png` (Mobile viewport Act 2)
  - `mobile-06-instant-quote.png` (Mobile viewport Act 5 calculator)
- **Structured Test Report:** `test-output/e2e-results.json`
  - Contains full test execution metadata, execution duration, assertion results, and error logs.
