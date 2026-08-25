# GARRETT'S PENDING WORK

**Updated:** 2026-08-25 (Claude operator pass)
**Rule:** Minimum human steps, ranked by revenue impact. Full reasoning: [REVENUE_REALITY.md](./REVENUE_REALITY.md)

---

## Do now (~30 min total)

1. **Rotate the leaked Meta token** — app ID 1099624436068516. The key
   committed in `ops/META_KEY.local` is still recoverable from public git
   history (`git show 0a38eed:ops/META_KEY.local`). Rotate/revoke in the Meta
   developer console, then note "rotated" in ACTION_LOG. *10 min.*
2. **Enable GitHub Pages** — repo Settings → Pages → Deploy from branch →
   `main` / `docs`. Turns the 8 finished tools into a real public URL.
   *1 click.*
3. **Review + merge the open PR** ([#17](https://github.com/Beexly/autonomous-revenue-engine/pull/17))
   from `claude/signal-origin-handoff-vzl6b0` (MIT LICENSE, installable
   conformal-lite, fixed e-value math, real CI). On the PR page, click
   **"Approve and run workflows"** — bot-authored workflow runs are held for
   approval, so the new CI hasn't executed yet (all tests verified locally:
   12/12 Python, 5/5 JS suites).
4. **Read REVENUE_REALITY.md §4 Lane 1** and say GO if you want the CAPI/EMQ
   audit service drafted for launch — the operator then produces the offer
   page, checklist, listings, and outreach drafts for your approval.

## Soon (when asked / when convenient)

- **Fix or disconnect the Vercel project** (`pick-pilot-s-projects/autonomous-revenue-engine`):
  it tries to deploy the repo root on every push and fails every time (red X
  on all PRs). Either set its Root Directory to `apps/qi-check` or remove the
  integration until qi-check deployment is actually a priority.
- **SonarCloud**: the quality gate reports "C Security Rating on New Code" on
  PR #17 but the project's findings aren't publicly readable, so the operator
  can't see or fix them. Open the dashboard link on the PR and either share
  the findings or set the Sonar project to public. (Likely candidates: the
  moved `capi.py`/`lago.py` urllib calls counted as "new code".)
- PyPI account + one `twine upload` (operator prepares the package + command).
- Enable GitHub Sponsors on the Beexly account.
- First posts: after the gate recalibration in REVENUE_REALITY.md §5 —
  technical/service surfaces are honesty-gated, not 9.2-voice-gated.

## Done (do not redo)

- [x] X / IG / TikTok / YouTube / Gmail accounts created
- [x] X Premium paid (personal)
- [x] Hold floor 9.2 locked for brand-voice posts (scope narrowed — see REVENUE_REALITY.md §5)
- [x] MIT LICENSE, installable conformal-lite, valid e-value, real CI (this branch)

## Do not

- Commit secrets (`.gitignore` now blocks `*.local` / `.env`, but the old key
  still needs rotation)
- Spend on ads, domains, or paid credits before Lane 1 or 2 produces revenue
- Start a new strategy document; the standing set is REVENUE_REALITY.md +
  master prompt + review checklist
