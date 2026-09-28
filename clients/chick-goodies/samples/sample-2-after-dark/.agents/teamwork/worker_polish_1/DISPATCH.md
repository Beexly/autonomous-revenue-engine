## 2026-09-27T03:13:00Z

You are `worker_polish_1`, a `teamwork_preview_worker` subagent.
Working Directory: `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\worker_polish_1`
Project Root: `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark`
Authoritative Request: `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark\.agents\teamwork\ORIGINAL_REQUEST.md`

### MANDATORY INTEGRITY WARNING
DO NOT CHEAT. All implementations must be genuine. DO NOT hardcode test results, create dummy/facade implementations, or circumvent the intended task. A teamwork_preview_auditor will independently verify your work. Integrity violations WILL be detected and your work WILL be rejected.

### Scope & Write Boundaries
- `test_3d_experience.py`
- `qa_full.py`
- `vercel.json`
- `.vercelignore`
- `PROJECT.md`

### Tasks
1. **Fix `test_3d_experience.py` Launch Options**:
   - In lines 123–130, remove `--use-angle=swiftshader` or make it an optional fallback so Windows Chromium uses native ANGLE acceleration without hanging.
   - Add explicit `timeout=60000` to `page.goto` calls (e.g. lines 168, 443) so cold launches under software rendering never time out before assets are loaded.
2. **Harmonize `qa_full.py`**:
   - `qa_full.py` is failing at line 39 on `360/index` because it checks legacy 60-char title / 155-char description and legacy Midnight Supper selectors.
   - Update `qa_full.py` so that either:
     a) The `index` route checks the legacy `table.html` page where those legacy DOM elements exist, OR
     b) The metadata thresholds accommodate the luxury scrollytelling `index.html` page.
   - Ensure `python qa_full.py` passes cleanly!
3. **Enhance `vercel.json` & `.vercelignore`**:
   - Add security headers (`X-Content-Type-Options: nosniff`, `X-Frame-Options: SAMEORIGIN`, `Referrer-Policy: strict-origin-when-cross-origin`).
   - Add static asset caching (`Cache-Control: public, max-age=31536000, immutable` for `/img/*`, `/fonts/*`, `/vendor/*`).
   - Ensure `.agents/` and `.env*` are in `.vercelignore`.
4. **Run Both Test Suites**:
   - `python test_3d_experience.py` (verify 26/26 checks pass, 0 console errors, 0 page errors, 0 failed requests).
   - `python qa_full.py` (verify all checks pass with code 0).
5. **Deploy to Vercel Production Edge**:
   - Run `vercel --prod --yes` from `C:\Users\Garrett\autonomous-revenue-engine\clients\chick-goodies\samples\sample-2-after-dark`.
   - Verify live HTTP status code 200 at `https://charcuterie-chick-sample-2.vercel.app`.
   - Test live deployment with `python test_3d_experience.py https://charcuterie-chick-sample-2.vercel.app`.

### Output
Write your full report to `report.md` and create `handoff.md` in your working directory. Send a completion message back to the orchestrator.
