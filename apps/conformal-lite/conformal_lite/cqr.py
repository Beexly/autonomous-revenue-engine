"""Conformalized quantile residuals (CQR-style).

Honesty check (2026-08-26 audit): every call site in this package invokes
`update()`/`predict_interval()` without ever supplying real per-point quantile
predictions (`q_lo`/`q_hi`) from an actual quantile-regression model — this
package does not fit one. Without them, `update()` falls back to a fixed
+/-1.0 band and `predict_interval()` to a fixed +/-`residual_scale` band, both
symmetric and constant-width. Calibrated that way, this mode is mathematically
identical to plain split conformal on absolute residuals (measured: max
endpoint difference vs `evalue` mode is 4.4e-16, i.e. the same code path) —
it cannot adapt to heteroscedasticity on its own, and previously claimed to.

The CQR math itself (`quantile_residual`, and applying one calibrated
correction to real asymmetric q_lo/q_hi bounds) is standard and correct when
a caller supplies real per-point quantile predictions; see
`tests/test_core.py::TestCQR::test_real_quantile_predictions_break_symmetry`
for that path exercised directly. Nothing in this package computes those
predictions for you — plug in your own quantile regression model's output as
`q_lo`/`q_hi` if you need real heteroscedastic intervals.
"""
from __future__ import annotations

import math
from typing import Optional, Tuple

from .quantiles import conformal_quantile


def quantile_residual(y: float, q_lo: float, q_hi: float) -> float:
    return float(max(q_lo - y, y - q_hi))


class ConformalQR:
    def __init__(self, alpha: float = 0.1):
        self.alpha = alpha
        self.scores: list[float] = []
        self.n = 0

    def update(
        self,
        y_true: float,
        y_pred: float,
        q_lo: Optional[float] = None,
        q_hi: Optional[float] = None,
    ) -> None:
        if q_lo is None:
            q_lo = float(y_pred) - 1.0
        if q_hi is None:
            q_hi = float(y_pred) + 1.0
        self.scores.append(quantile_residual(float(y_true), q_lo, q_hi))
        self.n += 1

    def expand(self, q_lo: float, q_hi: float) -> Tuple[float, float]:
        q = conformal_quantile(self.scores, self.alpha)
        if not math.isfinite(q):
            # Cold start: uncalibrated heuristic pad, no coverage guarantee.
            pad = 0.5 * max(q_hi - q_lo, 1.0)
            return q_lo - pad, q_hi + pad
        return q_lo - q, q_hi + q

    def predict_interval(self, y_pred: float, residual_scale: float = 1.0) -> Tuple[float, float]:
        q_lo, q_hi = y_pred - residual_scale, y_pred + residual_scale
        return self.expand(q_lo, q_hi)
