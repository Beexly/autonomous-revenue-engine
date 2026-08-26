# Conformal-lite modes

| Mode | What it is | Use when | Honesty |
|------|------------|----------|---------|
| `aci` | Online Adaptive Conformal Inference. `alpha_t` tracks recent misses. | Slow drift. | Coverage needs the ACI update to keep running; asymptotic, not exact at small n (measured ~86% at n=25, ~90% by n=500 against a 90% target, post-fix). Cold start uses a fat interval. |
| `saocp` | Weighted mixture of ACI experts at different gammas. Weights follow recent loss, judged relative to the stream's own scale. | Jumpy streams (X, nonstationary scores). | Sleeping-experts mix, not a Salesforce port. Prediction is the weights-weighted average interval across all experts, not a hard pick of whichever looks best right now. |
| `cqr` | Conformalized quantile residuals. Interval *can* be heteroscedastic. | Continuous targets with uneven noise — **only if you pass real per-point quantile predictions** via `update(..., q_lo=..., q_hi=...)`. | Numpy only. MAPIE/Puncc/TorchCP not installed. Without real `q_lo`/`q_hi` from your own model, this reduces exactly to split conformal on `\|residual\|` — same code path as `evalue`, not adaptive to variance on its own. |
| `evalue` | A marginally-valid e-variable (`E[e] = 1` under exchangeability) plus its matching conformal p-value. Post-hoc α selection. | You want to pick α after seeing the score. | The e-value itself is valid marginally. Its running product across a stream is **not** a test martingale — no anytime-valid / Ville-style bound, because each e is scored against a pool that includes the stream being tested. `covers_posthoc`/`posthoc_p` use the conformal p-value, the calibrated primitive, not the e-value. |

Sports/DFS is not a product of this package. Paid metering is Lago-when-keyed, JSONL stub otherwise.

All four modes share one finite-sample quantile rule (`quantiles.py`): the `ceil((n+1)(1-alpha))`-th order statistic, or an honest unbounded interval when there isn't enough calibration data to support the target coverage at all — never a falsely-confident finite guess.
