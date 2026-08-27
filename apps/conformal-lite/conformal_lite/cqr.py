"""Conformalized quantile residuals (CQR-style).

Preferred for heteroscedastic continuous targets. Free core uses numpy only.
MAPIE / Puncc / TorchCP are later optional backends, not required to run.
"""
from __future__ import annotations

from typing import Optional, Tuple

import numpy as np

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
        # inf while calibration is too small for alpha: the band is unbounded
        # rather than padded by an invented constant.
        q = conformal_quantile(self.scores, self.alpha)
        return q_lo - q, q_hi + q

    def predict_interval(self, y_pred: float, residual_scale: float = 1.0) -> Tuple[float, float]:
        q_lo, q_hi = y_pred - residual_scale, y_pred + residual_scale
        return self.expand(q_lo, q_hi)
