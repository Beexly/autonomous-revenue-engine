# ACTION_LOG

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
