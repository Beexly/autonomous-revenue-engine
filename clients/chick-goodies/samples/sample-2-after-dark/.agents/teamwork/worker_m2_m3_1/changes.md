# Changes Summary — Milestones 2, 3, and 4

**Agent:** `worker_m2_m3_1` (Implementation Worker)  
**Date:** 2026-09-26  
**Target Directory:** `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark`

---

## 1. Files Modified

| File | Status | Description |
|---|---|---|
| `experience.css` | **Modified** | Changed `.chapter > * { pointer-events: auto; }` to `.chapter.active > * { pointer-events: auto; }` (line 280) so inactive chapter plates do not intercept clicks intended for 3D elements or other chapters; added `#scroll-hint { display: none; }` under `@media (max-width: 900px)` (line 846) to eliminate bottom visual overlap on mobile viewports. |
| `index.html` | **Modified** | Updated receipt breakdown line items to reflect exact authoritative specifications: `<span>Add-ons Subtotal</span>` (replacing `<span>Selected Add-ons</span>`) and `<span>Total Investment</span>` (replacing `<span>Estimated Total</span>`), while preserving all DOM IDs (`#rcpt-tier-name`, `#rcpt-tier-subtotal`, `#rcpt-addons-row`, `#rcpt-addons-subtotal`, `#rcpt-tax`, `#rcpt-total`). |
| `experience.js` | **Modified** | 1. Implemented `CatmullRomSpline3` centripetal cubic spline evaluator across all 6 stations with Verlet momentum damping and pointer parallax in the animation loop.<br>2. Updated Texas 18% catering sales tax in `updateQuote()` to include the mandatory $229.00 setup fee in the taxable base (`taxableSubtotal = tierSubtotal + addonsTotal + setupFee; tax = Math.round(taxableSubtotal * 18) / 100; total = taxableSubtotal + tax;`).<br>3. Formatted pre-filled SMS body (`sms:+18324588180?body=...`) and Email body (`mailto:charcuteriechick@outlook.com?subject=...&body=...`) with strict `encodeURIComponent` and all receipt parameters.<br>4. Exposed `window.QuoteEngine` with `setTier` and `calculateQuote` complying with `PROJECT.md` contracts, and attached `THREE.CatmullRomCurve3 = CatmullRomSpline3`. |
| `.gitignore` | **Modified** | Added `.env*` and `.env.local` to strictly prevent credentials leakage as required by Milestone 4 security specifications. |

---

## 2. Detailed Rationale & Code Deltas

### 2.1. Scrollytelling Polish (`experience.css`)
- **Inactive Chapter Pointer Events:** Previously, `.chapter > *` applied `pointer-events: auto` to children of all chapters, meaning the hidden `#ch-5` plate-calculator remained on top of the DOM stacking order with active pointer events, blocking pointer interaction with Act 2 banquet cards. Changing selector to `.chapter.active > * { pointer-events: auto; }` confines pointer interception strictly to the currently active chapter.
- **Mobile `#scroll-hint` Overlay:** On mobile viewports ($\le 900\text{px}$), the fixed bottom `#scroll-hint` element overlapped tall chapter plates (Act 2 and Act 5). Adding `#scroll-hint { display: none; }` under `@media (max-width: 900px)` resolves this visual clash cleanly.

### 2.2. Mathematical Quote Engine Truth (`experience.js` & `index.html`)
- **Texas 18% Catering Sales Tax Base:**
  ```javascript
  const setupFee = 229.00;
  const taxableSubtotal = tierSubtotal + addonsTotal + setupFee;
  const tax = Math.round(taxableSubtotal * 18) / 100;
  const total = taxableSubtotal + tax;
  ```
  - For Graze 50 guests: $1,200 food + $229 setup = $1,429 taxable subtotal; $1,429 × 18% = $257.22 tax; Total = $1,686.22 (matches `qa_full.py` line 72).
  - For Holy Grail 75 guests: $2,000 food + $229 setup = $2,229 taxable subtotal; $2,229 × 18% = $401.22 tax; Total = $2,630.22 (matches `qa_full.py` line 72).
  - For Holy Grail 150 guests: $3,500 food + $229 setup = $3,729 taxable subtotal; $3,729 × 18% = $671.22 tax; Total = $4,400.22 (matches `qa_full.py` line 72).
- **Lead Triggers:**
  - SMS: `sms:+18324588180?body=` URL-encoded with guest count, tier name, food subtotal, add-ons breakdown, $229 setup fee, 18% Texas tax, and total investment.
  - Email: `mailto:charcuteriechick@outlook.com?subject=...&body=...` URL-encoded with all quote parameters and formal proposal formatting.

### 2.3. Catmull-Rom Camera Spline Trajectory (`experience.js`)
- Implemented `CatmullRomSpline3` class calculating cubic Catmull-Rom centripetal spline points across all 6 station camera positions and lookAt targets.
- Replaced piecewise linear lerp in the animation loop with `cameraPathSpline.getPoint(currentProgress)` and `lookAtPathSpline.getPoint(currentProgress)`, ensuring $C^1$ velocity continuity and silky-smooth traversal between stations.

### 2.4. Asset Pipeline & Security Guard (`.gitignore` & Media Verification)
- Secured `.gitignore` by appending `.env*` and `.env.local`.
- Inspected the local filesystem in `img/` and verified that 100% of referenced media assets (`micro-seed-720p.mp4`, `feast-cinematic-720p.mp4`, `cart-cinematic-720p.mp4`, `stage1-micro-cone.png`, `stage2-artisan-board.png`, `stage3-grand-banquet.png`, `stage4-midnight-cart.png`, `tricia-portrait-471.jpg`, `brand.webp`) exist with valid byte sizes, guaranteeing zero 404 network request failures.
