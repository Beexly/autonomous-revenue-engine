# conformal-lite

Free-core adaptive conformal prediction. Modes: `aci`, `saocp`, `cqr`, `evalue`.

Does not rewrite copy. Does not publish. Does not meter paid usage unless `ORIGIN_METER=1` (local JSONL stub, not Lago).

**Honesty:** finite-sample coverage needs an exchangeability (or stated adaptive) assumption. X engagement and other non-stationary streams should use `saocp` or `evalue`, not plain split residual conformal. Sports/DFS is not a product of this package.

## Install

```
pip install "conformal-lite @ git+https://github.com/Beexly/autonomous-revenue-engine@main#subdirectory=apps/conformal-lite"
```

Or from a checkout: `cd apps/conformal-lite && pip install .`

## Run

```
conformal-lite --mode aci            # also: saocp | cqr | evalue
python -m conformal_lite --mode saocp --alpha 0.05 --steps 500
```

```python
from conformal_lite import make

model = make("saocp", alpha=0.1)
for y_true, y_pred in stream:
    lo, hi = model.predict_interval(y_pred)
    model.update(y_true, y_pred)
```

## Test

```
cd apps/conformal-lite
python -m unittest discover -s tests
```

Interval calibration uses the finite-sample conformal quantile
(the ⌈(n+1)(1−α)⌉-th smallest score). When the calibration set is too small
for the requested coverage, intervals are honestly unbounded rather than
silently under-covering.

## Modes

- `aci` — Gibbs & Candès Adaptive Conformal Inference (online `alpha_t`)
- `saocp` — strongly adaptive mix of ACI experts at different gammas (Salesforce-style sleeping experts, not a vendor port)
- `cqr` — conformalized quantile residuals (preferred for heteroscedastic scores). MAPIE/Puncc/TorchCP are optional later backends, not required here.
- `evalue` — soft-rank e-variable for post-hoc α / anytime-valid checks

Paid wedge (later, Lago): higher coverage, streaming API, bulk. Not wired.
