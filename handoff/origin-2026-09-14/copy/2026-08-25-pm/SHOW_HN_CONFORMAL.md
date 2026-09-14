# Show HN draft — conformal-lite — do not post

**Posted:** no. Draft only. Never submitted to HN.

**Title:** Show HN: conformal-lite – adaptive conformal intervals as a local CLI, not a hosted app

**Repo:** https://github.com/Beexly/autonomous-revenue-engine (`apps/conformal-lite`)
**CLI (not hosted):** https://github.com/Beexly/autonomous-revenue-engine/tree/main/apps/conformal-lite
**README:** https://raw.githubusercontent.com/Beexly/autonomous-revenue-engine/main/apps/conformal-lite/README.md

Offer page is separate static HTML, not this CLI:
https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/meta-tracking-audit.html
Tools index (file-only pages, nothing publishes or charges):
https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/index.html

**Verified (WebFetch, 2026-08-25 CT):** README, GitHub tree, meta-tracking-audit.html, docs/index.html, plus `__main__.py` / `core.py` / `MODES.md` / `lago.py` / `test_core.py`.

Do not rewrite `origin-drafts/SHOW_HN.md` (qi-check).

---

## Body

conformal-lite is a numpy CLI inside that repo, not a hosted app and not a second paid SKU. You choose a mode (`aci`, `saocp`, `cqr`, or `evalue`), it returns a prediction interval around a point forecast, and it updates from the next `(y_true, y_pred)` pair. It does not rewrite copy, does not publish, and does not meter paid usage unless `ORIGIN_METER=1`, which appends a local JSONL stub — that is not Lago billing.

From the tree:

```
cd apps/conformal-lite
pip install -r requirements.txt
python -m conformal_lite --mode aci
python -m unittest test_core.py
```

Dependency is `numpy>=1.22`. The demo loop is a sine plus noise against the sine as the point forecast and prints `alpha_t`, interval, hit/miss, then empirical coverage. MAPIE, Puncc, and TorchCP are later optional backends and are not required to run.

`aci` is Gibbs & Candès Adaptive Conformal Inference: an online `alpha_t` that tracks recent misses, with a fat interval until `n≥10`. Use it on slow drift; coverage needs the ACI update to keep running. `saocp` is a sleeping-experts mix of those ACI learners at different gammas (0.01, 0.05, 0.1, 0.2), weights following recent loss — Salesforce-style in the paper sense, not a vendor port of `online_conformal`. `cqr` conformalizes quantile residuals so the interval can be heteroscedastic on continuous targets. `evalue` is a soft-rank e-variable for post-hoc α and anytime-valid-style checks (Markov/Ville bound, not a split quantile). Finite-sample coverage still needs an exchangeability assumption or the stated adaptive one. Non-stationary streams (X engagement and anything else that is not exchangeable) should use `saocp` or `evalue`, not plain split residual conformal. Sports/DFS is not a product of this package.

`meter.py` forwards to `lago.py`, which no-ops by default, writes local JSONL when `ORIGIN_METER=1`, and is not a billing product in this tree. A later paid wedge (higher coverage, streaming API, bulk) is named in the README and is not wired.

The only paid offer attached to this work sits on a separate static page, not on the CLI: a Meta Pixel + Conversions API tracking diagnostic, $250 flat, 3 business days — Events Manager review, Pixel/CAPI shared-`event_id` coverage, EMQ per event with the parameters missing, `action_source` / server-event correctness, Meta-versus-backend count reconciliation, prioritized fix list with effort estimates, written report with before-state evidence. Implementation is $500–$1,500, scoped from that diagnostic, fixed quote before work starts. The same page publishes the full 15-point DIY checklist (inventory, dedup, `event_id`, 48h window, EMQ, hash-normalization, `fbp`/`fbc`, Test Events, 7-day backend reconcile, consent, diagnostics, domain, monthly re-check), not a teaser. Signal Origin, Houston. Independent service; not affiliated with or endorsed by Meta Platforms, Inc.

https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/meta-tracking-audit.html

Baxley.Garrett@gmail.com / @SignaL_OriginHQ

---

**Swap-test (not part of the post):** Holds only as a local four-mode CLI (`aci`/`saocp`/`cqr`/`evalue`) whose coverage claim is exchangeability-or-stated-adaptive, with Lago as JSONL stub and the Meta diagnostic as a separate static HTML SKU. Swap the name onto a hosted conformal API, a MAPIE wrapper, an “uncertainty as a service” pitch, or a second conformal price, and the not-hosted plus not-a-SKU plus `ORIGIN_METER=1` plus saocp/evalue-for-nonstationary facts fall out.

**CTA (only these):** Baxley.Garrett@gmail.com · @SignaL_OriginHQ
