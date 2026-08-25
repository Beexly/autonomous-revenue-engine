# ACTION_LOG

## 2026-08-25 — ads playbook ACTIVE now

- `ops/ADS_PLAYBOOK.md` is the live SOP. Not deferred. Spend still needs `APPROVE spend`.
- Shipped `docs/ads-signal.html` (event_id + local SHA-256, no send).
- Shipped specificity / jargon / contrast. Hub updated.
- Calibration log: `ops/ADS_CALIBRATION.csv` (header only).
- Meta Ads MCP still cannot OAuth from Cursor (no dynamic client registration). Devtools connected, app list empty. Work around, do not wait.
- Conformal snippet: run from `apps/conformal-lite`, `from core import make`. CQR needs q_lo/q_hi.
- Public posts still APPROVE-gated. No invented revenue.

## 2026-08-25 — burstiness + Lago/CAPI + key off HEAD

- Merged PR 12: Lago events client, CAPI helpers, gitignore. Deleted `ops/META_KEY.local` from HEAD.
- Shipped burstiness. conformal-lite already on main (PR 10).

Previous entries remain above this block in the live repo history.
