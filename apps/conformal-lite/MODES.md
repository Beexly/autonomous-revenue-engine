# Conformal-lite modes

| Mode | What it is | Use when | Honesty |
|------|------------|----------|---------|
| `aci` | Online Adaptive Conformal Inference. `alpha_t` tracks recent misses. | Slow drift. | Coverage needs the ACI update to keep running. Cold start uses a fat interval. |
| `saocp` | Mix of ACI experts at different gammas. Weights follow recent loss. | Jumpy streams (X, nonstationary scores). | Sleeping-experts mix, not a Salesforce port. |
| `cqr` | Conformalized quantile residuals. Interval can be heteroscedastic. | Continuous targets with uneven noise. | Numpy only. MAPIE/Puncc/TorchCP not installed. |
| `evalue` | Valid mean-ratio e-variable (`e = score / mean(cal + score)`, E[e] = 1 under exchangeability). `covers_posthoc()` / `posthoc_p()` decide coverage from the calibrated `conformal_p`, not from `e` directly. | You want a p-value, or a per-point e-variable to feed your own test. | `E[e] = 1` is a marginal guarantee only. The running product `e_product` is *not* established to be a test martingale here (the conditional expectation can exceed 1) — don't rely on it for a Ville-style anytime-valid bound. `conformal_p` gives the calibrated p-value; that's what the class's own decisions use. |

Sports/DFS is not a product of this package. Paid metering is Lago-when-keyed, JSONL stub otherwise.
