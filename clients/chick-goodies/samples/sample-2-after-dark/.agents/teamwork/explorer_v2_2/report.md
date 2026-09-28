# Investigation Report: Business Math, Asset Synthesis, Verification Suites & Vercel Deployment

**Author**: `explorer_v2_2` (teamwork_preview_explorer)  
**Date**: 2026-09-27T02:18:00Z  
**Project Root**: `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark`  
**Primary Artifacts Inspected**:
- Configurator & Math Engine: `experience.js` (lines 1716–1859, 2271–2318), `index.html` (lines 228–325), `immersion.js` (lines 548–611), `facts.json`, `qa_full.py` (lines 72–78)
- Generative Synthesis & Credentials: `generate_charcuterie_video.py`, `generate_extra_videos.py`, `generate_stages.py`, root `.env.local`, root `.gitignore`, sample `.gitignore`, `.vercelignore`
- Test Suites & Listeners: `test_3d_experience.py` (544 lines), `test-output/e2e-results.json`, `quality-gate.py`, `qa_full.py`
- Edge Deployment: `vercel.json`, live edge URL `https://charcuterie-chick-sample-2.vercel.app/`

---

## 1. Executive Summary & Status Overview Matrix

| Inspection Domain | Component / Requirement | Status | Detailed Finding |
| :--- | :--- | :--- | :--- |
| **Business Math** | Grazing Tiers ($24, $26, $30, $38) | **VERIFIED** | Exact tier pricing implemented in `experience.js` (`activeTierRate`) and statically in `index.html`. |
| **Business Math** | Holy Grail Showpiece ($2,000 / $3,500) | **VERIFIED** | Correctly brackets: $2,000 for $\le 75$ guests; $3,500 for $76\text{–}150+$ guests (`experience.js:1749`). |
| **Business Math** | Mandatory Setup Fee ($229.00) | **VERIFIED** | Fixed non-negotiable styling fee of $229.00 included in all calculations (`experience.js:1785`). |
| **Business Math** | Texas 18% Catering Sales Tax | **VERIFIED** | Formula strictly applies 18% to `(Food + Add-ons + $229 Setup Fee)`. Invariant matches `qa_full.py` regression tests. |
| **Lead Capture** | Instant SMS Pre-Fill (`832-458-8180`) | **VERIFIED** | Direct SMS link encoded with guest count, tier name, subtotal, add-ons, setup fee, tax, and total. |
| **Lead Capture** | Formal Email Pre-Fill (`charcuteriechick@outlook.com`) | **VERIFIED** | `mailto:` link structured with itemized breakdown and custom subject line. |
| **Brand Truth** | Chef Tricia 35-Yr Craft & Accolades | **VERIFIED / PARTIAL 3D** | HTML has complete copy (The Knot 5.0/13 reviews, WeddingWire 5.0/11 reviews, 35 yrs). WebGL Stage 4 has Knot and 35-yr hotspots, but lacks a dedicated 3D WeddingWire medallion. |
| **Generative SDK** | Higgsfield Seedance 2.5 & Soul v2 | **VERIFIED** | 3 generation scripts use `bytedance/seedance-2.5/text-to-video` (720p MP4s) and `higgsfield-ai/soul/v2/standard` (4K stills). |
| **Security** | `.env.local` Isolation | **VERIFIED** | API credentials live strictly in root `.env.local`, ignored by `.gitignore`. Zero client-side exposure. |
| **Test Suites** | Headless Playwright (`test_3d_experience.py`) | **BLOCKING DEFECT FOUND** | 26 automated checks covering Desktop (1440x900) & Mobile (393x852). However, `experience.js:2269` assigns to immutable ES module `THREE.CatmullRomCurve3`, throwing runtime TypeError. |
| **Edge Deployment**| Vercel Production Edge (`vercel.json`) | **VERIFIED LIVE** | Deployed and serving HTTP 200 at `https://charcuterie-chick-sample-2.vercel.app/`. Lacks static cache headers and security headers. |

---

## 2. Business & Mathematical Truth in the Codebase

### 2.1 Pricing Tier & Showpiece Specifications
The pricing architecture is defined across `facts.json`, `index.html` (lines 128–149, 250–259), and `experience.js` (lines 1738–1756, 2277–2290):

1. **Graze Me, Craze Me**: **$24.00 per person** (50 guest minimum)
   - Menu includes: 2 sliders (30 of each), cured meats, cheeses, seasonal fruit, hummus, almonds, 2 salads, roasted/raw veggies, 1 dip.
2. **Grazing Standard**: **$26.00 per person** (50 guest minimum)
   - Everything in Graze Me plus 2nd hummus, 2 dips, pasta salad, potato/sweet potato/tortilla chips.
3. **Super Graze**: **$30.00 per person** (50 guest minimum)
   - 3 sliders (25 each), 3 salads, 3 dips, 2 hummus, nuts, chips, full vegetable spread.
4. **Grand Graze**: **$38.00 per person** (50 guest minimum)
   - 5 sliders, 4 salads, 3 dips, 2 hummus, 2 nuts, chips, and mini pudding cups (Oreo, butterscotch, or banana).
5. **The Holy Grail Centerpiece**:
   - **$2,000.00** for up to 75 guests.
   - **$3,500.00** for up to 150 guests.
   - In `experience.js` line 1749:
     ```javascript
     if (activeTierRate === 'holy-grail') {
       tierSubtotal = guests <= 75 ? 2000 : 3500;
       tierNameStr = `The Holy Grail Centerpiece (${guests} guests)`;
     }
     ```

### 2.2 Add-ons Structure
Configured in `index.html` (lines 261–282) and `experience.js` (lines 1757–1775):
- **Zeppole Beignets**: **+$4.50 per person** (`#add-beignets`)
- **Midnight Cart Service**: **+$350.00 flat** (`#add-cart`)
- **Extra Sliders**: **+$2.95 per person** (`#add-sliders`)
- **Mimosa Bar Setup**: **+$4.00 per person** (`#add-mimosas`)

### 2.3 Mathematical Formula & Tax Base Invariant
In Texas catering law and as formalized across `qa_full.py`, `TEST_INFRA.md`, and `experience.js`:
- **Mandatory Setup Fee**: `$229.00`
- **Texas Catering Sales Tax Rate**: `18%` (0.18)
- **Tax Base**: The tax is levied on the entire operational cost, including food, optional add-ons, extra service time, and the mandatory setup fee.

$$\text{Taxable Subtotal} = \text{Tier Subtotal} + \text{Add-ons Subtotal} + \$229.00$$

$$\text{Tax Amount} = \frac{\text{round}(\text{Taxable Subtotal} \times 18)}{100}$$

$$\text{Total Investment} = \text{Taxable Subtotal} + \text{Tax Amount}$$

#### Cross-Verification Against Regression Cases (`qa_full.py:72`):
| Case | Guests | Tier Rate | Setup Fee | Add-ons / Extra | Taxable Base | 18% Tax | Total Investment | Engine Output | Status |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Graze Me** | 50 | $24.00 | $229.00 | $0.00 | $1,429.00 | $257.22 | **$1,686.22** | `$1,686.22` | **EXACT MATCH** |
| **Standard** | 50 | $26.00 | $229.00 | $0.00 | $1,529.00 | $275.22 | **$1,804.22** | `$1,804.22` | **EXACT MATCH** |
| **Super** | 50 | $30.00 | $229.00 | $0.00 | $1,729.00 | $311.22 | **$2,040.22** | `$2,040.22` | **EXACT MATCH** |
| **Grand** | 50 | $38.00 | $229.00 | $0.00 | $2,129.00 | $383.22 | **$2,512.22** | `$2,512.22` | **EXACT MATCH** |
| **Holy Grail 75** | 75 | Flat | $229.00 | $0.00 | $2,229.00 | $401.22 | **$2,630.22** | `$2,630.22` | **EXACT MATCH** |
| **Holy Grail 150**| 150| Flat | $229.00 | $0.00 | $3,729.00 | $671.22 | **$4,400.22** | `$4,400.22` | **EXACT MATCH** |
| **Default DOM** | 75 | $24.00 | $229.00 | $0.00 | $2,029.00 | $365.22 | **$2,394.22** | `$2,394.22` | **EXACT MATCH** |
| **Custom Wedding**| 125| $38.00 | $229.00 | $912.50 | $5,891.50 | $1,060.47 | **$6,951.97** | `$6,951.97` | **EXACT MATCH** |

*Note on Historical Discrepancy:* In initial development, tax was computed solely on food (`$1,200 * 0.18 = $216.00`). As verified in `test_3d_experience.py:307–316`, `experience.js` line 1786 was updated to `const taxableSubtotal = tierSubtotal + addonsTotal + setupFee;`, correctly aligning with the Texas catering tax base.

### 2.4 Lead Routing Triggers
Located in `experience.js:1795–1820`:
1. **SMS Route**:
   - Destination: `sms:+18324588180?body=...`
   - Verified content: Contains guest count, tier name, food subtotal, selected add-ons, setup fee ($229.00), tax (18%), and total investment.
   - Compatibility note: iOS Safari typically interprets `sms:+18324588180&body=...` (ampersand separator) whereas Android and standard RFC 5724 use `?body=`. While `test_3d_experience.py:428` explicitly asserts `.startswith("sms:+18324588180?body=")`, implementers could support user-agent sniffing to use `&` on iOS for seamless native Messages app launching.
2. **Email Route**:
   - Destination: `mailto:charcuteriechick@outlook.com?subject=...&body=...`
   - Subject: `Charcuterie Chick Event Quote — [Guests] Guests ([Tier Name])`
   - Body: Clean itemized bullet list with availability request.

### 2.5 Chef Pedigree & Verified Accolades
Audited across `facts.json`, `index.html`, and `experience.js`:
- **Identity**: Chef Tricia Holfelder, Tomball TX.
- **Experience**: 35 years of professional restaurant knife craft (both front and back of house, line cooking, butchery, scratch breads, and compound butters).
- **The Knot Best of Weddings 2026**: 5.0 stars based on 13 verified bride reviews (`index.html:91, 207`).
- **WeddingWire Couples' Choice 2026**: 5.0 stars based on 11 verified reviews, 100% recommended (`index.html:92, 211`).
- **WebGL 3D Scene Representation**:
  - In `experience.js:1348–1375`, Stage 4 currently features two 3D hotspots:
    1. "The Knot — Best of Weddings 2026" (line 1358)
    2. "Thirty-Five Years Restaurant Pedigree" (line 1366)
  - **Gap**: WeddingWire 5.0 is currently present only in DOM text and is missing as an interactive 3D metallic badge in Stage 4.

---

## 3. Generative Asset Synthesis & Security Architecture

### 3.1 Higgsfield SDK Scripts & Models
Three offline generative Python scripts reside in `C:\Users\Garrett\autonomous-revenue-engine`:

```
autonomous-revenue-engine/
├── generate_charcuterie_video.py   # Seedance 2.5 Text-to-Video banquet feast
├── generate_extra_videos.py        # Seedance 2.5 Text-to-Video micro-seed & cart
└── generate_stages.py              # Soul v2 Standard 4K stills for Stages 2, 3, 4
```

1. **`generate_charcuterie_video.py`**:
   - Model: `bytedance/seedance-2.5/text-to-video`
   - Parameters: 5 seconds duration, 720p resolution, 16:9 aspect ratio, audio enabled.
   - Output: `feast-cinematic-720p.mp4` (saved in `sample-2-after-dark/img/`).
2. **`generate_extra_videos.py`**:
   - Model: `bytedance/seedance-2.5/text-to-video`
   - Parameters: 5 seconds duration, 720p resolution, 16:9 aspect ratio, audio disabled.
   - Tasks:
     - `micro-seed-720p.mp4`: Extreme slow motion macro of honey dripping onto prosciutto.
     - `cart-cinematic-720p.mp4`: Slow pan across luxury mobile cart under Edison filament bulbs.
3. **`generate_stages.py`**:
   - Model: `higgsfield-ai/soul/v2/standard`
   - Tasks:
     - `stage2-artisan-board.png`: Dark walnut board, brie, honeycomb, aged manchego, fresh mission figs.
     - `stage3-grand-banquet.png`: 12-foot banquet table feast stretching across moody ballroom.
     - `stage4-midnight-cart.png`: Vintage matte-black and brass cart with Edison filament bulbs.

### 3.2 Security Audit & Credential Containment
1. **Isolation in Root `.env.local`**:
   - `C:\Users\Garrett\autonomous-revenue-engine\.env.local` holds the Higgsfield credentials (`HF_KEY`, `HF_CREDENTIALS`, `HF_API_KEY_ID`, `HF_API_KEY_SECRET`).
   - `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.env.local` **does not exist** (verified via `Test-Path`).
2. **Git Protection**:
   - Root `.gitignore` explicitly contains:
     ```
     .env
     .env.local
     *.local
     ```
   - Sample `.gitignore` explicitly contains:
     ```
     .vercel
     .env*
     .env.local
     ```
3. **Client-Side Bundle Purity**:
   - Neither `experience.js`, `immersion.js`, nor any HTML or CSS files contain references to `process.env`, `dotenv`, or API keys.
   - Client scripts run strictly as static ESM modules in the browser.
4. **Defense-in-Depth Recommendation for `.vercelignore`**:
   - Current `.vercelignore`:
     ```
     *.py
     __pycache__
     *.md
     test-output
     qa-evidence
     qa-runtime
     qa1.json
     ```
   - Recommendation: Explicitly add `.env*` and `.agents/` to `.vercelignore` to ensure agent metadata, handoffs, and any accidental local environment files are never pushed to the Vercel edge deployment.

---

## 4. Test Suites & Verification Architecture

### 4.1 Playwright E2E Test Suite (`test_3d_experience.py`)
`test_3d_experience.py` is an advanced, 544-line end-to-end testing harness based on a **4-Tier Test Case Design Methodology**:

```
test_3d_experience.py
├── Tier 1: Feature Coverage (T1.1–T1.7)
│   ├── T1.1: Persistent Fullscreen 3D Canvas Mount (WebGL context check)
│   ├── T1.2: Fixed Luxury HUD Navigation (6 buttons, phone link)
│   ├── T1.3: Procedural Web Audio Ambiance Toggle (aria-pressed state check)
│   ├── T1.4: 6 Station Narrative Progression (TableState.goTo(0..5))
│   ├── T1.5: Spatial HUD Tooltip & Dynamic Leader Line (focusHotspot(1))
│   ├── T1.6: Interactive Beignet Hotspot & Sugar Burst (clickHotspot(7))
│   └── T1.7: Configurator UI Controls Mounting (Slider, pills, receipt card)
├── Tier 2: Boundary & Corner Cases (T2.1–T2.5)
│   ├── T2.1: 50-Guest Minimum Boundary Enforcement (slider min=50)
│   ├── T2.2: Extreme Values & Upper Boundary Math (300 guests, currency regex)
│   ├── T2.3: Holy Grail Fixed Brackets ($2,000 for 75, $3,500 for 150)
│   ├── T2.4: Texas 18% Catering Tax Invariant Check (Exact math check)
│   └── T2.5: DPR Clamping Performance Guard (Math.min(DPR, 2.0) <= 2.0)
├── Tier 3: Cross-Feature Combinations (T3.1–T3.4)
│   ├── T3.1: Tier Selection Sync (Act 2 Cards -> Act 5 Configurator)
│   ├── T3.2: Multi-Add-On Toggling & Subtotal Calculation
│   ├── T3.3: Spatial HUD Dynamic Coordinate Clamping in Viewport
│   └── T3.4: Audio Trigger on UI Interaction Readiness
├── Tier 4: Real-World Scenarios (T4.1–T4.5)
│   ├── T4.1: Full Scrollytelling Journey Progression (0->5 traverse)
│   ├── T4.2: Interactive Tasting Notes & Ingredient Exploration
│   ├── T4.3: Custom Wedding Feast Quotation Workflow (125 guests, $38, beignets, cart)
│   ├── T4.4: Pre-Filled SMS Lead Trigger Verification
│   └── T4.5: Pre-Filled Email Proposal Trigger Verification
└── Mobile Suite (393x852 iPhone 14/15 Pro, DPR=3.0, touch) (M1–M5)
    ├── M1: Mobile Fullscreen Canvas Mount
    ├── M2: Mobile Horizontal Overflow Prevention (scrollWidth <= 393px)
    ├── M3: Mobile Station Progression to Act 2
    ├── M4: Mobile Calculator Responsive Plate Fit (calc_box width <= 393px)
    └── M5: Mobile Spatial HUD Clamping Check (tooltip x + width <= 400px)
```

### 4.2 Telemetry Listeners & Quality Gate Criteria
The runner instruments all pages with strict real-time listeners:
```python
page.on("console", on_console)       # Filters for msg.type == "error"
page.on("pageerror", on_page_error)   # Catches uncaught runtime exceptions
page.on("requestfailed", on_req_fail) # Catches failed network requests (excluding media aborts)
```
Quality Gate assertions at suite termination:
- `assert len(self.console_errors) == 0`
- `assert len(self.page_errors) == 0`
- `assert len(self.failed_requests) == 0`
- `assert failed_checks == 0`

### 4.3 Critical Bug Identified: ES Module Namespace Immutability
In `experience.js` line 2269:
```javascript
THREE.CatmullRomCurve3 = CatmullRomSpline3;
```
#### Direct Observation & Evidence:
1. `THREE` is imported as an ES module namespace: `import * as THREE from './vendor/three.module.js';`.
2. Under ES module specification (ECMA-262), module namespace objects are exotic objects whose properties are sealed and immutable.
3. At runtime, evaluating `THREE.CatmullRomCurve3 = CatmullRomSpline3` throws:
   ```
   TypeError: Cannot assign to property 'CatmullRomCurve3' of [object Module]
   ```
4. Recorded directly in `test-output/e2e-results.json` (lines 11–14):
   ```json
   "page_errors": [
     "Desktop: Cannot assign to property 'CatmullRomCurve3' of [object Module]",
     "Mobile: Cannot assign to property 'CatmullRomCurve3' of [object Module]"
   ]
   ```
5. This runtime exception causes `page_errors_count == 2`, which violates the automated zero-error quality gate.

#### Remedy:
Line 2269 must be removed or assigned to `window` (e.g. `window.CatmullRomCurve3 = CatmullRomSpline3;` or within `engineApi`). `CatmullRomCurve3` is already exported natively by `three.module.js`.

---

## 5. Vercel Edge Deployment Configuration

### 5.1 Deployment Configuration (`vercel.json`)
The current `vercel.json` contains:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "installCommand": "echo skip",
  "buildCommand": "echo skip",
  "outputDirectory": "."
}
```
- **Deployment Strategy**: Zero-build static site deployment directly from repository root.
- **Production Edge Target**: `https://charcuterie-chick-sample-2.vercel.app`

### 5.2 Live Edge Verification
- Verified via live HTTP request (`read_url_content`):
  - **Status**: HTTP 200 OK.
  - **Payload**: Full `index.html` structure successfully served from Vercel edge network with canonical link `https://charcuterie-chick-sample-2.vercel.app/`.
  - **Assets**: Scripts, Three.js modules, video backdrops, and styles properly linked.

### 5.3 Deficiencies & Recommended Optimizations for `vercel.json`
1. **Cache-Control Headers**: Currently, static 3D textures, MP4 video backdrops (`img/*.mp4`), fonts (`fonts/*.ttf`), and JavaScript vendor modules (`vendor/*.js`) have no explicit edge caching policy, resulting in default short cache TTLs.
2. **Security Headers**: No HTTP security headers are configured.
3. **Recommended Enhanced `vercel.json`**:
```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "framework": null,
  "installCommand": "echo skip",
  "buildCommand": "echo skip",
  "outputDirectory": ".",
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "SAMEORIGIN" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" }
      ]
    },
    {
      "source": "/(img|fonts|vendor)/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    }
  ]
}
```

---

## 6. Actionable Recommendations for Implementation Agents

1. **Fix TypeError on Line 2269 in `experience.js`**:
   - Delete `THREE.CatmullRomCurve3 = CatmullRomSpline3;` or replace with `window.CatmullRomCurve3 = CatmullRomSpline3;`. This will immediately clear both Desktop and Mobile page errors in `test_3d_experience.py`, allowing the test suite to achieve a 100% clean PASS (0 errors, 0 failed checks).
2. **Add 3D WeddingWire Medallion in Stage 4**:
   - In `experience.js:1348–1375`, add a 3rd interactive luxury hotspot or embossed 3D medallion for WeddingWire ("WeddingWire Couples' Choice 2026 — 5.0 Stars, 11 Reviews") alongside The Knot and 35-yr craft.
3. **Harden `.vercelignore` and `vercel.json`**:
   - Add `.agents/` and `.env*` to `.vercelignore`.
   - Add caching headers and security headers to `vercel.json` for enhanced edge performance.
4. **Mobile SMS URL Protocol Compatibility**:
   - Detect iOS user agent in `experience.js` line 1805 to provide `&body=` for iOS while maintaining `?body=` for standard/Android clients and test suite compliance.
