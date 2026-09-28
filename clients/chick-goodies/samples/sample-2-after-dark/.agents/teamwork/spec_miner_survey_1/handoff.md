# Handoff Report: Specification Mining Survey for Charcuterie Chick WebGL Scrollytelling

**Role:** Specification Miner (`teamwork_preview_spec_miner`)  
**Workspace:** `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\spec_miner_survey_1`  
**Target File Produced:** `analysis.md` (in same directory)  
**Parent Orchestrator:** `057057ff-b7fd-4423-8c4e-8512f5ef961b`  
**Timestamp:** 2026-09-26T18:35:45Z  
**Handoff Type:** Hard (Survey & Specification Mining Phase Complete)

---

## 1. Observation

Direct observations extracted from authoritative artifacts:

1. **Authoritative Mandate (`ORIGINAL_REQUEST.md`, lines 5, 20–44, 47–58):**
   - Goal: *"Build an immersive, sensory, Awwwards-caliber WebGL scrollytelling experience for Charcuterie Chick (Chef Tricia Holfelder) matching the visual fidelity, fluid physics, and luminous interaction of Lusion.co, Oryzo, and Basement Studio."*
   - R1: *"Dynamic fluid/particle fields, kinetic mesh deformation, or custom GLSL shaders replacing flat 2D image cards."*
   - R1: *"Radiant, luminous lighting model (warm amber honeycomb, polished copper, warm champagne, specular highlights, and ACESFilmic tone mapping with post-processing bloom) completely replacing muddy or dark black palettes."*
   - R1: *"Buttery 60fps rendering with seamless shader/canvas transitions rather than stuttering HTML <video> element swaps."*
   - R2: Progressive scale narrative through Phase 0 (Micro Seed), Phase 1 (Artisan Board, 10–25 guests), Phase 2 (Banquet Tables, 4 tiers $24, $26, $30, $38/pp), Phase 3 (Mobile Cart & Holy Grail $2,000 / $3,500), Phase 4 (Heritage, 35-year craft, Knot/WeddingWire 5.0), Phase 5 (Mathematical Quote Engine, $229 setup, 18% tax, SMS/email).
   - R3: Reference sites (`https://lusion.co/`, `https://oryzo.ai/`, `https://looper.basement.studio/`, `https://samsy.ninja/`) and extraction tools (`goclone`, `website-downloader`, `ImHex`, `reverse-engineering`).
   - R4: Generative asset synthesis via Higgsfield SDK (`@higgsfield/client` / Python client with Seedance 2.5 and Soul v2) for culinary motion textures and 4K macro stills.
   - R5: Controlled infrastructure (`.env.local` server-side security, Vercel edge deployment via `vercel --prod --yes` to `charcuterie-chick-sample-2.vercel.app`).
   - Acceptance criteria: 3D canvas as primary interactive universe, radiant lighting, 60fps desktop/mobile, exact pricing, instant quote pre-fills direct SMS to `832-458-8180` and email to `charcuteriechick@outlook.com`, headless Playwright automated suite passing on desktop (1440x900) and mobile (393x852) with 0 console errors and 0 failed requests.

2. **Client Business & Pricing Truth (`FACTS.md`, lines 26–39; `facts.json`, lines 2–35):**
   - *"Per-person tables, 50-guest minimum. Each service runs 90 minutes; extra time $3 per person per half hour. 18% tax and a $229 flat setup fee apply to every table."*
   - Menu pricing:
     - "Graze Me, Craze Me": $24/person
     - "Grazing Standard": $26/person
     - "Super Graze": $30/person
     - "Grand Graze": $38/person
     - "Holy Grail of Grazing": $2,000 / 75 guests · $3,500 / 150 guests
   - Accolades:
     - The Knot: 5.0 (13 reviews, Best of Weddings 2026)
     - WeddingWire: 5.0 (11 reviews, 100% recommend)
     - Chef Tricia Holfelder: > 35 years in restaurant industry
     - Contact: Phone `832-458-8180`, Email `charcuteriechick@outlook.com`.

3. **Authoritative Regression Suite Proof (`qa_full.py`, lines 72–78; `midnight.js`, lines 132–134):**
   - Exact mathematical regression cases:
     `cases=[('holy',75,0,'$2,630.22'),('holy',150,0,'$4,400.22'),('grand',50,0,'$2,512.22'),('super',50,0,'$2,040.22'),('standard',50,0,'$1,804.22'),('graze',50,0,'$1,686.22'),('graze',50,2,'$2,040.22'),('holy',150,4,'$6,524.22')]`
   - Exact tax formula in `midnight.js`:
     `const setup = 22900, extra = count * 300 * intervals;`
     `const tax = Math.round((food + setup + extra) * 18 / 100);`
     `total = food + setup + extra + tax;`
   - Note in `midnight.js` line 177: *"The estimate assumes the published 18% tax applies to food, setup and extra time."*

4. **Existing Prototype Gaps Identified (`experience.js`):**
   - Lines 39–69: Still uses HTML5 `<video>` background elements (`#bg-video-a`, `#bg-video-b`) with `cross-fading`, conflicting with R1's requirement: *"seamless shader/canvas transitions rather than stuttering HTML <video> element swaps"*.
   - Line 234: `renderer.toneMapping = THREE.ACESFilmicToneMapping;` is enabled, but **post-processing bloom is missing entirely** (search for `bloom` yielded 0 hits in rendering pipeline).
   - Lines 976–979: Calculates tax as `const tax = taxableSubtotal * 0.18;` where `taxableSubtotal` excludes `setupFee = 229.00`, causing a divergence from `qa_full.py` (e.g. Graze 50 guests produces $1,645.00 instead of the verified $1,686.22).

5. **Security & Deployment (`.gitignore`, `vercel.json`):**
   - `.gitignore` currently only contains `.vercel`. It does not yet exclude `.env*` or `.env.local`.

---

## 2. Logic Chain

1. **Evaluation of R1 (Living WebGL Sensory Environment):**
   - *Observation 1 & 4 show:* The existing codebase relied partially on two `<video>` elements in the background cross-fading upon chapter changes, and lacks post-processing bloom.
   - *Inference:* To satisfy R1, the engineering team must replace the background HTML video element swapping with pure WebGL shader passes (fluid/particle fields, WebGL video textures, or kinetic GLSL deformation) and add `EffectComposer` with `UnrealBloomPass` to generate radiant halos around candle flames and glowing honey/filaments.

2. **Evaluation of R2 & Narrative Flow (Phases 0–5):**
   - *Observation 1 & 2 show:* The six narrative stages (Micro Seed $\to$ Artisan Board $\to$ Banquet Tables $\to$ Mobile Cart/Holy Grail $\to$ Heritage $\to$ Mathematical Quote Engine) must form an unbroken camera trajectory.
   - *Inference:* The spatial camera coordinates in `experience.js` provide a solid base, but the stage centerpieces must be upgraded with Higgsfield-synthesized macro textures and fluid physics to transcend flat image cards on 3D pedestals.

3. **Evaluation of Mathematical Rules & Texas Catering Tax:**
   - *Observation 2 & 3 show:* `qa_full.py` provides exact regression cases (e.g. Graze 50 guests = $1,686.22, Holy Grail 75 guests = $2,630.22).
   - *Mathematical Deduction:*
     $$\text{Food} = 50 \times 24 = \$1,200.00$$
     $$\text{Setup} = \$229.00$$
     $$\text{Taxable Subtotal} = \$1,200.00 + \$229.00 = \$1,429.00$$
     $$\text{Tax (18\%)} = \$1,429.00 \times 0.18 = \$257.22$$
     $$\text{Total} = \$1,429.00 + \$257.22 = \$1,686.22$$
   - *Conclusion:* The 18% catering tax MUST be applied to the combined sum of food, add-ons, extra time, AND the $229 setup fee. The prototype's tax calculation must be updated to include setup fee in the taxable base.

4. **Evaluation of Lead Capture Triggers:**
   - *Observation 1, 2, & 3 show:* SMS trigger (`832-458-8180`) and Email trigger (`charcuteriechick@outlook.com`) must pre-fill complete event parameters.
   - *Inference:* All dynamic text in `sms:+18324588180?body=...` and `mailto:charcuteriechick@outlook.com?subject=...&body=...` must be strictly encoded via `encodeURIComponent` to guarantee compatibility across iOS and Android browsers without truncating query strings.

5. **Evaluation of Acceptance Criteria & Quality Gates:**
   - *Observation 1 show:* Headless Playwright automated suite must pass on desktop (1440x900) AND mobile (393x852) with 0 console errors and 0 failed network requests.
   - *Inference:* Mobile performance must clamp DPR (`Math.min(devicePixelRatio, 2)`), and asset paths must be verified so that no texture or font generates a 404 error.

---

## 3. Caveats

1. **Higgsfield SDK Execution Context:** Generative asset synthesis via `@higgsfield/client` or Python `higgsfield_client` requires valid API keys in `.env.local`. When running offline or in CI without live API credits, pre-synthesized textures and cached motion files must be committed to `img/` to ensure zero failed network requests.
2. **Audio Autoplay Browser Restrictions:** Web Audio synthesis cannot play until a user gesture occurs. The Playwright test suite will not receive audio errors as long as tests don't expect audio to start unprompted on initial page load.
3. **Mobile Screen Width Variations:** While the primary mobile gate is $393 \times 852$ (standard modern iPhone), responsive design should gracefully accommodate 360px to 414px viewports without horizontal scrolling or text plate overlap.

---

## 4. Conclusion

The specification has been completely deconstructed into:
1. **46 Detailed Feature Items** categorized across R1, R2, R3, R4, R5, Mathematical Rules, and Quality Gates, recorded in `analysis.md` in the required table format.
2. **17 Rigorous Edge Cases** covering guest minimums, bracket validation, tax base formulation, DPR clamping, and protocol URI encodings.
3. **Exact Mathematical Formulations** confirming that Texas 18% catering sales tax includes the mandatory $229 setup fee, matching `qa_full.py` regression benchmarks.
4. **Actionable Technical Architectural Directives** for Track 1 (E2E Playwright test authors) and Track 2 (Three.js/WebGL graphics engineers).

---

## 5. Verification Method

To independently verify the findings in this report:

1. **Verify Authoritative Requirements:**
   Inspect `ORIGINAL_REQUEST.md`:
   ```powershell
   Get-Content -Path "C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\ORIGINAL_REQUEST.md"
   ```
2. **Verify Mathematical Pricing Truth:**
   Inspect `qa_full.py` lines 72–78 to verify exact test cases:
   ```powershell
   Get-Content -Path "C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\qa_full.py" | Select-Object -Index (71..77)
   ```
3. **Verify Detailed Specification Analysis:**
   Inspect `analysis.md` in this directory:
   ```powershell
   Get-Content -Path "C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\spec_miner_survey_1\analysis.md"
   ```
4. **Invalidation Conditions:**
   - Any client amendment to `FACTS.md` changing published tier pricing ($24, $26, $30, $38) or setup fee ($229).
   - Any legal determination that Texas catering tax excludes mandatory setup fees (contrary to `qa_full.py` line 72).
