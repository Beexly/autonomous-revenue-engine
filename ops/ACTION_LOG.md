# ACTION_LOG

## 2026-08-25 — second product, PyPI prepped, README truth pass, launch kit

- Product #2 shipped: `products/meta-ads-tracking-template.xlsx` (UTM
  builder, weekly Meta-vs-backend reconciliation with automatic CHECK
  DEDUP/CHECK DELIVERY flags, EMQ tracker, campaign log with true-CPA gap).
  194 formulas, classic functions only, verified structurally; note:
  LibreOffice unavailable in the build sandbox so cached values are absent —
  Excel/Google Sheets recalculate on open (verified formula logic by hand on
  the example rows).
- PyPI release fully prepped: name `conformal-lite` confirmed available,
  wheel + sdist built, wheel verified in a clean venv (install, CLI, imports).
  Owner steps documented in apps/conformal-lite/README.md — account + one
  `twine upload`.
- Root README rewritten to match reality (portfolio-grade front door; no
  claimed-but-nonexistent directories).
- `ops/LAUNCH_CONTENT_KIT.md`: Show HN draft (uses the corrected-e-value
  story honestly), Stape partner application, pinned-post + 10 post
  candidates (voice-gated), reply-first cadence, Reddit comment policy.
- Sales kit §4b: Gumroad listing for product #2 + bundle move. Money list
  updated to list both products in one sitting.

## 2026-08-25 — Claude operator pass: audit, hard fixes, revenue reality

- Full-repo audit (4 auditors) + market research sweep. Headline: real code,
  real discipline, $0 because nothing is published or for sale and every
  buyer-facing motion is human-gated shut. Full synthesis: `ops/REVENUE_REALITY.md`.
- **Fixed invalid e-value math** in conformal-lite: the soft-rank construction
  was the reciprocal of a p-value (E[e]≈4.4 under the null — not an e-variable).
  Replaced with the mean-ratio e-variable (E[e]=1 exactly; product is a test
  martingale). The honesty-surface non-negotiable now actually holds.
- conformal-lite is now a real package: `pip install` works, `conformal-lite`
  CLI, finite-sample conformal quantile (unbounded when n too small instead of
  silent under-coverage), prequential ACI update, honest SAOCP/CQR labels,
  12/12 tests green. Dropped the duplicate `apps/adaptive-cp`.
- Added MIT LICENSE (repo was all-rights-reserved — the "free cores" were not
  legally reusable). Deleted 7 boilerplate template workflows (two failed every
  push); added one real CI (Python suite + node --test × 5 JS apps).
- Rewrote `ops/GARRETT_PENDING.md` revenue-first. Top human actions: rotate the
  leaked Meta token (still in public git history), enable GitHub Pages, merge
  the PR, greenlight the Lane-1 CAPI/EMQ audit service.
- No posts, no spend, no accounts, no payment rails touched. All APPROVE gates
  respected.
- Market research folded in (see REVENUE_REALITY.md): CAPI/EMQ service market
  confirmed real ($150–400 diagnostic → $500–1,500 fix; target Shopify/Woo
  stores ≥$5k/mo Meta spend; Upwork + Stape partner directory for first
  clients; 2–6 weeks to first ticket). Platform payouts confirmed near-zero
  at small scale ($0–100/90d across all four platforms; X needs 5M
  impressions/90d). Sponsors realistically $0–25/mo for a new project. x402
  protocol-wide volume ~$30–40k/day — not an earnings channel.
- PR #17 opened (draft). Known red checks, none from this branch's changes:
  `label`/`greeting` are main's leftover template workflows (deleted on
  merge), Vercel fails deploying the repo root on every push (owner config),
  SonarCloud findings unreadable anonymously (owner: see GARRETT_PENDING).
  New real CI awaits the PR's "Approve and run workflows" click; suite
  verified locally 12/12 + 5×JS green.

## 2026-08-25 — burstiness + Lago/CAPI + key off HEAD

- Merged PR 12: Lago events client (`apps/conformal-lite/lago.py`), CAPI `event_id` + hashed-PII helpers (`capi.py`), root `.gitignore` for `*.local` / `.env`.
- Deleted `ops/META_KEY.local` from HEAD. Token remains in git history — rotate it. Do not re-commit secrets.
- Shipped `docs/burstiness.html` (sentence-length CV sparkline). Hub lists swap-check + burstiness.
- Board: fold-ruler and burstiness marked SHIPPED. conformal-lite already on main (PR 10).
- No ads spend. No Lago Cloud. Public posts still APPROVE-gated.

## 2026-08-25 — Signal Origin conformal stack alignment

- Added master prompt v4 (`ops/SIGNAL_ORIGIN_MASTER_PROMPT.md`)
- Added follow-on prompt for SAOCP + CQR + e-value (`ops/FOLLOWON_SAOCP_CQR_EVALUE.md`)
- Added minimal AdaptiveConformal free core + soft-rank e-value helper (`apps/adaptive-cp/adaptive_cp.py`)
- Next for Grok Bot: implement SAOCP backend, integrate CQR, extend e-value wrapper, then Lago metering path.

Previous entries remain above this block in the live repo history.
