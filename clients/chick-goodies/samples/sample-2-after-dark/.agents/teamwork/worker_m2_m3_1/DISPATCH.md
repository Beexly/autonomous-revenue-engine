## 2026-09-26T19:10:54Z
You are the Implementation Worker for Milestones 2, 3, and 4 of the Charcuterie Chick WebGL scrollytelling project.

Identity:
- Archetype: teamwork_preview_worker
- Working Directory: C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\worker_m2_m3_1
- Parent Conversation ID: 057057ff-b7fd-4423-8c4e-8512f5ef961b

MANDATORY INTEGRITY WARNING:
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

Authoritative Documents (MUST READ):
- ORIGINAL_REQUEST: C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\ORIGINAL_REQUEST.md
- PROJECT.md: C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\PROJECT.md
- TEST_READY.md: C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\TEST_READY.md
- FACTS.md: C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\FACTS.md
- Regression benchmarks: `qa_full.py` lines 72-78

Task:
Implement Milestones 2, 3, and 4 (Scrollytelling Choreography, Quote Engine Truth, and Asset Security):
1. **Scrollytelling Polish (M2)**:
   - In `experience.css` line 280: Change `.chapter > * { pointer-events: auto; }` to `.chapter.active > * { pointer-events: auto; }` so inactive chapter plates do not intercept clicks intended for 3D elements or other chapters.
   - In `experience.css` under `@media (max-width: 900px)`: hide `#scroll-hint` (`display: none;`) to prevent bottom visual overlay on mobile viewports.
   - In `experience.js`: Ensure Catmull-Rom camera trajectory across all 6 stations with Verlet momentum damping and pointer parallax is silky smooth.
2. **Mathematical Quote Engine Truth (M3)**:
   - In `experience.js` `updateQuote`:
     Update the Texas 18% catering sales tax calculation to include the mandatory $229 setup fee in the taxable base:
     ```javascript
     const taxableSubtotal = tierSubtotal + addonsTotal + setupFee;
     const tax = Math.round(taxableSubtotal * 18) / 100;
     const total = taxableSubtotal + tax;
     ```
     This matches the legal Texas Catering Tax standard and `qa_full.py` line 72 benchmarks (e.g. Graze 50 guests = $1,200 food + $229 setup + $257.22 tax = $1,686.22 total).
   - Ensure line items on receipt reflect: Food Subtotal, Add-ons Subtotal, Production & Styling Setup ($229.00), Texas State Tax (18% Catering), Total Investment.
   - Ensure SMS body (`sms:+18324588180?body=...`) and Email body (`mailto:charcuteriechick@outlook.com?subject=...&body=...`) use strict `encodeURIComponent` and include all receipt parameters.
3. **Asset Pipeline & Security Guard (M4)**:
   - In `.gitignore`: Add `.env*` and `.env.local` to strictly prevent credentials leakage.
   - Verify that all textures and media referenced in `experience.js` (`img/`) resolve with zero 404s.
4. **Verification**:
   - Run the automated test suite with Python:
     `& 'C:\Users\Garrett\AppData\Local\Programs\Python\Python311\python.exe' test_3d_experience.py`
   - Ensure all 26 checks pass, 0 console errors, 0 failed requests.

Write Boundaries:
- You exclusively own: `experience.js`, `experience.css`, `index.html`, `.gitignore`.
- You MUST NOT touch `test_3d_experience.py` or `vendor/three.module.js`.

Deliverables:
- Write `changes.md` in your working directory.
- Write `handoff.md` in your working directory with the 5 required sections (Observation, Logic Chain, Caveats, Conclusion, Verification Method).
- Send a completion message back to parent (`057057ff-b7fd-4423-8c4e-8512f5ef961b`).
