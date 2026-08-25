# Conformal-lite modes

| Mode | What it is | Use when | Honesty |
|------|------------|----------|---------|
| `aci` | Online Adaptive Conformal Inference. `alpha_t` tracks recent misses. | Slow drift. | Coverage needs the ACI update to keep running. Cold start uses a fat interval. |
| `saocp` | Hedge (exponential-weights) mix of ACI experts at different gammas. SAOCP-inspired, NOT the Bhatnagar et al. algorithm — no strongly-adaptive regret guarantee. | Jumpy streams (X, nonstationary scores). | Honest label: expert mix, not a Salesforce port. |
| `cqr` | Conformalized quantile residuals. Interval can be heteroscedastic. | Continuous targets with uneven noise. | You must supply real quantile-regressor outputs via `update(..., q_lo=, q_hi=)`; the CLI demo fabricates ±1 placeholders. Numpy only. |
| `evalue` | Mean-ratio e-variable (`e = s / mean(scores)`), E[e]=1 under exchangeability; running product is a test martingale. Post-hoc α via Markov/Ville. | You want to pick α after seeing the score. | The earlier soft-rank formula was NOT a valid e-variable and has been replaced. |

Sports/DFS is not a product of this package. Paid metering is Lago-when-keyed, JSONL stub otherwise.
