# Adversarial Review & Empirical Challenge Report

**Date**: 2026-09-27T02:56:00Z  
**Agent**: `challenger_3d_1` (teamwork_preview_challenger)  
**Target**: `sample-2-after-dark` (`index.html`, `experience.js`, `qa_full.py`, `test_3d_experience.py`, `facts.json`)  
**Verdict**: **`REQUEST_CHANGES`**  
**Overall Risk Assessment**: **MEDIUM-HIGH** (Business math & brand credentials are 100% verified and sound, but test suite execution against `index.html` fails in `qa_full.py` and times out in `test_3d_experience.py`).

---

## 1. Executive Summary

This adversarial review empirically stress-tested the mathematical invariants, lead routing mechanics, and brand authority credentials of the 3D WebGL scrollytelling experience.

- **Mathematical Invariants (PASS)**:
  - Grazing Tiers ($24, $26, $30, $38/pp) are accurately modeled.
  - The Holy Grail Showpiece ($2,000 for $\le 75$ guests, $3,500 for $76–150+$ guests) is correctly enforced in `experience.js` (`updateQuote` and `QuoteEngine.calculateQuote`).
  - Mandatory Setup Fee of $229.00 is consistently applied across all packages.
  - Texas Catering Sales Tax (18%) is strictly applied to the entire taxable base: `(Food Subtotal + Add-ons + $229 Setup Fee)`. All benchmark penny calculations match `qa_full.py:72` matrix to the exact cent.
- **Direct Lead Routing (PASS)**:
  - SMS URI (`sms:+18324588180?body=...`) and Mailto URI (`mailto:charcuteriechick@outlook.com?subject=...&body=...`) conform to RFC 5724 and standard URL encoding, carrying full itemized quotes.
- **Trust & Brand Truth (PASS)**:
  - Chef Tricia Holfelder’s 35-year restaurant knife craft and 5.0 ratings across The Knot (13 reviews) and WeddingWire (11 reviews) are accurately presented in `index.html`.
- **Test Harness Execution (FAIL / REGRESSION FOUND)**:
  - `python qa_full.py` failed with `AssertionError: 360/index: heading and metadata gates` (line 39) because `index.html` was completely transformed into the 3D WebGL scrollytelling experience, breaking legacy assertions (title length $\le 60$, description length $120–155$, `.brand img` count, `.skip` link, `.hero` CSS spotlight, and static nav links).
  - `python test_3d_experience.py` timed out (`TimeoutError: Page.goto: Timeout 30000ms exceeded`) during default local invocation due to `--use-angle=swiftshader` forcing software rasterization on Windows Chromium.

---

## 2. Challenges & Findings

### Challenge 1 (High): Legacy `qa_full.py` Fails Against 3D WebGL `index.html`

- **Assumption Challenged**: That `python qa_full.py` can pass on the current workspace without modification or decoupling from `index.html`.
- **Attack Scenario**: Running `python qa_full.py` against the repository root.
- **Empirical Observation**:
  ```powershell
  python qa_full.py
  ```
  Exited with code 1:
  ```
  Traceback (most recent call last):
    File "...\qa_full.py", line 39, in <module>
      check(metrics['h1']==1 and metrics['title']<=60 and 120<=metrics['description']<=155,f'{width}/{route}: heading and metadata gates')
    File "...\qa_full.py", line 19, in check
      assert condition,message
  AssertionError: 360/index: heading and metadata gates
  ```
  - `index.html` Title: 78 characters (`Charcuterie Chick | Houston's Largest Charcuterie Cart & Luxury Grazing Tables`), exceeding the 60-character ceiling.
  - `index.html` Meta Description: 169 characters, exceeding the 155-character ceiling.
  - Furthermore, `qa_full.py` asserts legacy Midnight Supper DOM elements: `.brand img` (line 41), `header nav a` (line 42), `.skip` (line 50), `.hero` style properties (line 54), `.motion` (line 57), and `header nav a[href="menu.html"]` (line 60). None of these exist on the 3D WebGL `index.html`.
- **Blast Radius**: Automated CI/CD pipelines running `qa_full.py` will fail immediately on the first route (`360/index`).
- **Mitigation**:
  1. Decouple `qa_full.py` by targeting `table.html` or `index.backup.html` for the legacy Midnight Supper regression, while dedicating `test_3d_experience.py` to the WebGL `index.html`; OR
  2. Adjust `qa_full.py` route definitions (`ROUTES = ['menu', 'gallery', 'story', 'enquire']` or conditionally branching for the WebGL experience).

### Challenge 2 (Medium): `test_3d_experience.py` SwiftShader Flag Timeout on Windows

- **Assumption Challenged**: That `test_3d_experience.py` executes reliably across default Windows environments with bundled Chromium.
- **Attack Scenario**: Executing `python test_3d_experience.py` on Windows PowerShell.
- **Empirical Observation**:
  ```
  [DESKTOP] Navigating to http://127.0.0.1:57046/index.html...
  playwright._impl._errors.TimeoutError: Page.goto: Timeout 30000ms exceeded.
  Call log: - navigating to "http://127.0.0.1:57046/index.html", waiting until "domcontentloaded"
  ```
  Lines 124–125 of `test_3d_experience.py` launch Chromium with `--use-gl=angle` and `--use-angle=swiftshader`. In Windows Playwright headless Chromium distributions lacking bundled SwiftShader binaries, ANGLE hangs during process initialization, causing `page.goto` to exceed the 30-second timeout.
- **Blast Radius**: Headless CI runs on standard Windows runners will hang and fail.
- **Mitigation**: Remove `--use-angle=swiftshader` or configure it conditionally based on OS / platform availability.

### Challenge 3 (Low): Discrepancy Between `extraHours` Parameter and Dropdown Intervals

- **Assumption Challenged**: That `QuoteEngine.calculateQuote({ extraHours: 2 })` matches `qa_full.py` case `('graze', 50, 2, '$2,040.22')`.
- **Attack Scenario**: Calling `window.QuoteEngine.calculateQuote({ tier: 'graze', guests: 50, extraHours: 2 })`.
- **Empirical Observation**:
  - In `experience.js` line 3135:
    `const extraTimeFee = guests * extraHours * 6;`
  - In `qa_full.py:72`, `extra = 2` corresponds to dropdown option `value="2"` (which is "60 minutes extra" = 1 hour = 2 half-hour intervals). In `midnight.js`, intervals were billed at `$3 per person per half hour` ($300 cents $\times$ count $\times$ intervals = $50 \times 3 \times 2 = $300$).
  - If a caller passes `extraHours = 2` intending 2 intervals, `experience.js` computes $50 \times 2 \times 6 = $600 (2 full hours).
  - Note: Act 5 configurator UI in `index.html` does not feature an extra time dropdown, but uses the 4 curated add-ons (Beignets, Cart, Sliders, Mimosas), so this does not affect user-facing UI receipts.
- **Mitigation**: Rename `extraHours` in `QuoteEngine.calculateQuote` to `extraIntervals` (or multiply by 3 rather than 6 if intervals are passed), and document units clearly.

---

## 3. Stress Test Results & Invariant Matrix

| Test ID | Case / Invariant | Formula / Expected | Actual (`experience.js`) | Status |
|---|---|---|---|---|
| **INV-01** | Graze Me, Craze Me (50 guests, 0 add-ons) | $50 \times \$24 = \$1,200$ + \$229 setup = \$1,429 taxable $\times$ 1.18 = **\$1,686.22** | Tax: \$257.22, Total: **\$1,686.22** | **PASS** |
| **INV-02** | Grazing Standard (50 guests, 0 add-ons) | $50 \times \$26 = \$1,300$ + \$229 setup = \$1,529 taxable $\times$ 1.18 = **\$1,804.22** | Tax: \$275.22, Total: **\$1,804.22** | **PASS** |
| **INV-03** | Super Graze (50 guests, 0 add-ons) | $50 \times \$30 = \$1,500$ + \$229 setup = \$1,729 taxable $\times$ 1.18 = **\$2,040.22** | Tax: \$311.22, Total: **\$2,040.22** | **PASS** |
| **INV-04** | Grand Graze (50 guests, 0 add-ons) | $50 \times \$38 = \$1,900$ + \$229 setup = \$2,129 taxable $\times$ 1.18 = **\$2,512.22** | Tax: \$383.22, Total: **\$2,512.22** | **PASS** |
| **INV-05** | Holy Grail Showpiece ($\le 75$ guests) | \$2,000 + \$229 setup = \$2,229 taxable $\times$ 1.18 = **\$2,630.22** | Tax: \$401.22, Total: **\$2,630.22** | **PASS** |
| **INV-06** | Holy Grail Showpiece ($76–150+$ guests) | \$3,500 + \$229 setup = \$3,729 taxable $\times$ 1.18 = **\$4,400.22** | Tax: \$671.22, Total: **\$4,400.22** | **PASS** |
| **INV-07** | Custom Wedding Quote (125 guests, Grand Graze + Beignets + Cart) | Food: \$4,750 + Add-ons: \$912.50 + Setup: \$229 = \$5,891.50 taxable $\times$ 1.18 = **\$6,951.97** | Food: \$4,750.00, Addons: \$912.50, Tax: \$1,060.47, Total: **\$6,951.97** | **PASS** |
| **INV-08** | Initial HTML Static Receipt (75 guests, Graze Me) | Food: \$1,800 + Setup: \$229 = \$2,029 taxable $\times$ 1.18 = **\$2,394.22** | Tax: \$365.22, Total: **\$2,394.22** | **PASS** |
| **INV-09** | SMS URI Routing | `sms:+18324588180?body=...` containing guest count, tier, food subtotal, setup, tax, total | `sms:+18324588180?body=...` properly URL-encoded | **PASS** |
| **INV-10** | Mailto URI Routing | `mailto:charcuteriechick@outlook.com?subject=...&body=...` with full itemized quote | `mailto:charcuteriechick@outlook.com?subject=...&body=...` properly URL-encoded | **PASS** |
| **INV-11** | Chef Credentials & Accolades | 35-yr knife craft, The Knot 5.0 (13 reviews), WeddingWire 5.0 (11 reviews), Tomball TX | All present in `index.html` (Acts 0 & 4) and metadata | **PASS** |
| **TEST-01** | `python qa_full.py` | Full static 5-route regression pass | Fails at line 39 (`360/index`) | **FAIL** |
| **TEST-02** | `python test_3d_experience.py` | 26-check 3D E2E Playwright test suite | Times out during initial navigation with SwiftShader on Windows | **FAIL** (Run-time environment flag) |

---

## 4. Unchallenged Areas

- WebGL shader performance under native mobile iOS Metal / Safari (tested via Playwright iPhone 14/15 Pro emulation only; physical hardware thermal throttling unverified).
- Production DNS / Edge CDN cache invalidation behavior on live Vercel deployments.

---

## 5. Verdict & Recommendation

**Verdict**: **`REQUEST_CHANGES`**

**Action Required**:
1. Resolve the `qa_full.py` regression failure by adapting `qa_full.py` to target the static route bundle without asserting legacy Midnight Supper metadata / DOM rules against the 3D WebGL `index.html`.
2. Update `test_3d_experience.py` to remove or guard the `--use-angle=swiftshader` argument on Windows to ensure consistent test execution without timeout.
