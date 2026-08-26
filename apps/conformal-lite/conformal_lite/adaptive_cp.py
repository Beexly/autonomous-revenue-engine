"""Minimal Adaptive Conformal Inference (ACI) wrapper. Free core."""
from __future__ import annotations

from typing import Callable, Optional, Tuple

import numpy as np

from .quantiles import conformal_quantile, scale_width


class AdaptiveConformal:
    """Online ACI. Tracks a time-varying miscoverage level alpha_t."""

    def __init__(
        self,
        alpha: float = 0.1,
        gamma: float = 0.05,
        score_fn: Optional[Callable] = None,
        min_alpha: float = 0.01,
        max_alpha: float = 0.5,
    ):
        self.target_alpha = alpha
        self.alpha_t = alpha
        self.gamma = gamma
        self.min_alpha = min_alpha
        self.max_alpha = max_alpha
        self.score_fn = score_fn or (lambda y_true, y_pred: np.abs(y_true - y_pred))
        self.calibration_scores: list[float] = []
        self.n = 0

    def update(self, y_true: float, y_pred: float) -> None:
        score = float(self.score_fn(y_true, y_pred))
        # Evaluate the miscoverage indicator against the calibration set AS IT
        # STOOD BEFORE this observation, then append. Appending first (the
        # original bug) puts the point being tested inside its own
        # threshold's calibration set, which structurally biases err toward
        # 0 for roughly the first ceil((n+1)*alpha_t) updates — measured
        # empirical coverage of 84.5% vs a 90% nominal target at n=25.
        q = conformal_quantile(self.calibration_scores, self.alpha_t)
        err = 1.0 if score > q else 0.0
        self.calibration_scores.append(score)
        self.n += 1
        self.alpha_t = float(
            np.clip(
                self.alpha_t + self.gamma * (self.target_alpha - err),
                self.min_alpha,
                self.max_alpha,
            )
        )

    def predict_interval(
        self, y_pred: float, residual_scale: float = 1.0
    ) -> Tuple[float, float]:
        q = conformal_quantile(self.calibration_scores, self.alpha_t)
        if not np.isfinite(q):
            # Cold start: not enough calibration data to certify alpha_t
            # coverage. The +/-2*residual_scale band returned here is an
            # UNCALIBRATED heuristic fallback carrying no coverage guarantee
            # — treat cold-start intervals as placeholders, not results.
            width = 2.0 * residual_scale
            return y_pred - width, y_pred + width
        width = scale_width(q, residual_scale)
        return y_pred - width, y_pred + width

    def predict_set_size_hint(self) -> float:
        return float(conformal_quantile(self.calibration_scores, self.alpha_t))
