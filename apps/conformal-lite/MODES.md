# Conformal-lite modes

| Mode | What it is | Use when | Honesty |
|------|------------|----------|---------|
| `aci` | Online Adaptive Conformal Inference. `alpha_t` tracks recent misses. | Slow drift. | Coverage needs the ACI update to keep running. Cold start uses a fat interval. |
| `saocp` | Mix of ACI experts at different gammas. Weights follow recent loss. | Jumpy streams (X, nonstationary scores). | Sleeping-experts mix, not a Salesforce port. |
| `cqr` | Conformalized quantile residuals. Interval can be heteroscedastic. | Continuous targets with uneven noise. | Numpy only. MAPIE/Puncc/TorchCP not installed. |
| `evalue` | Soft-rank e-variable. Post-hoc α, anytime-valid style product. | You want to pick α after seeing the score. | Markov/Ville bound, not a split quantile. |

Sports/DFS is not a product of this package. Paid metering is Lago-when-keyed, JSONL stub otherwise.
