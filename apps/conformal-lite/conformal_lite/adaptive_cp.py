"""Minimal Adaptive Conformal Inference (ACI) wrapper. Free core."""
from __future__ import annotations

from typing import Callable, Optional, Tuple

import numpy as np

from .quantiles import conformal_quantile


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
        self.calibration_scores.append(score)
        self.n += 1
        q = conformal_quantile(self.calibration_scores, self.alpha_t)
        err = 1.0 if score > q else 0.0
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
        if self.n < 10:
            width = 2.0 * residual_scale
            return y_pred - width, y_pred + width
        q = conformal_quantile(self.calibration_scores, self.alpha_t)
        width = float(q) * residual_scale
        return y_pred - width, y_pred + width

    def predict_set_size_hint(self) -> float:
        if self.n < 5:
            return float("inf")
        return conformal_quantile(self.calibration_scores, self.alpha_t)
