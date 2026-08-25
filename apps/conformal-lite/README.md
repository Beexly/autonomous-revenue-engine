# conformal-lite

Free-core adaptive conformal prediction. Modes: `aci`, `saocp`, `cqr`, `evalue`.

Does not rewrite copy. Does not publish. Does not meter paid usage unless `ORIGIN_METER=1` (local JSONL stub, not Lago).

**Honesty:** finite-sample coverage needs an exchangeability (or stated adaptive) assumption. X engagement and other non-stationary streams should use `saocp` or `evalue`, not plain split residual conformal. Sports/DFS is not a product of this package.

## Run

```
cd apps/conformal-lite
pip install -r requirements.txt
python -m conformal_lite --mode aci
python -m unittest test_core.py
```

## Modes

- `aci` — Gibbs & Candès Adaptive Conformal Inference (online `alpha_t`)
- `saocp` — strongly adaptive mix of ACI experts at different gammas (Salesforce-style sleeping experts, not a vendor port)
- `cqr` — conformalized quantile residuals (preferred for heteroscedastic scores). MAPIE/Puncc/TorchCP are optional later backends, not required here.
- `evalue` — soft-rank e-variable for post-hoc α / anytime-valid checks

Paid wedge (later, Lago): higher coverage, streaming API, bulk. Not wired.
