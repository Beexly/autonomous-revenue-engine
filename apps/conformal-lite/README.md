# conformal-lite

Free-core adaptive conformal prediction. Modes: `aci`, `saocp`, `cqr`, `evalue`.

Does not rewrite copy. Does not publish. Does not meter paid usage unless `ORIGIN_METER=1` (local JSONL stub, not Lago).

**Honesty:** finite-sample coverage needs an exchangeability (or stated adaptive) assumption. X engagement and other non-stationary streams should use `saocp` or `evalue`, not plain split residual conformal. Sports/DFS is not a product of this package.

**2026-08-26 audit fixes** (see `tests/test_core.py` and `tests/test_quantiles.py` for the regression tests backing each of these):
- `aci`'s error indicator used to include the point being tested inside its own calibration threshold, structurally undercovering (measured 84.5% vs a 90% nominal target at n=25). Fixed to judge each point against calibration as it stood *before* that observation.
- Every mode's calibration quantile used `np.quantile(..., method="higher")`, one order statistic too low, and always returned a finite threshold even when there wasn't enough data to support the target coverage. Replaced with the finite-sample `ceil((n+1)(1-alpha))` rule (`quantiles.py`), which returns an honest unbounded interval instead of a falsely-confident narrow one when calibration is too small.
- `cqr` never receives real per-point quantile predictions anywhere in this package — without them it is mathematically identical to split conformal on `|residual|` (measured max endpoint difference vs `evalue` mode: 4.4e-16). It correctly adapts to real asymmetric quantile predictions *if a caller supplies them*; this package's own callers don't. See Modes below.
- `evalue`'s `soft_rank_e` used to return the reciprocal of a conformal p-value, which is **not** a valid e-value (E[e] > 1 under the null, measured growing like the harmonic number: ~3.04 at n=10, ~7.43 at n=1000). Replaced with a marginally-valid e-value construction (`e = score / mean(calibration + [score])`, `E[e] = 1` by an exchangeability argument — see the docstring in `evalue.py`). Its running product is still **not** a test martingale (no anytime-valid/Ville-style bound) — the pool each e is scored against grows from the same stream it's testing, so the conditional-expectation guarantee Ville's inequality needs doesn't hold. `covers_posthoc()`/`posthoc_p()` use the calibrated conformal p-value directly, not the e-value.

## Install & run

```
cd apps/conformal-lite
pip install -e .
python -m conformal_lite --mode aci
python -m unittest discover -s tests
```

## Modes

- `aci` — Gibbs & Candès Adaptive Conformal Inference (online `alpha_t`)
- `saocp` — mixture of ACI experts at different gammas, weighted by recent loss (Salesforce-style sleeping experts, not a vendor port). Prediction is the weights-weighted average of every expert's interval, not a hard pick of the current best.
- `cqr` — conformalized quantile residuals. Adapts correctly to heteroscedastic, asymmetric bounds *when given real per-point quantile predictions* via `update(..., q_lo=..., q_hi=...)`. This package does not fit a quantile-regression model itself, so its own default (no `q_lo`/`q_hi` supplied) is symmetric split conformal on absolute residuals — not heteroscedastic. MAPIE/Puncc/TorchCP are optional later backends that could supply real predictions, not required here.
- `evalue` — a marginally-valid e-variable and its matching conformal p-value, for post-hoc α selection. Not an anytime-valid / Ville-style running product — see the audit note above.

Paid wedge (later, Lago): higher coverage, streaming API, bulk. Not wired.
