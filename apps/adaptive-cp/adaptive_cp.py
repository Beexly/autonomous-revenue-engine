# adaptive_cp.py — Minimal Adaptive Conformal Prediction (ACI) free core
# Signal Origin / Beexly/autonomous-revenue-engine
# Extend with SAOCP, CQR, and e-value backends.

from __future__ import annotations
import numpy as np
from typing import Callable, Optional, Tuple

class AdaptiveConformal:
    """
    Minimal online Adaptive Conformal Inference (ACI).
    Maintains a time-varying miscoverage level alpha_t that tracks recent errors.
    Works with any nonconformity score function.
    """

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
        """Observe true outcome and adapt alpha_t (online step)."""
        score = float(self.score_fn(y_true, y_pred))
        self.calibration_scores.append(score)
        self.n += 1

        q = np.quantile(self.calibration_scores, 1 - self.alpha_t, method="higher")
        err = 1.0 if score > q else 0.0

        self.alpha_t = self.alpha_t + self.gamma * (self.target_alpha - err)
        self.alpha_t = float(np.clip(self.alpha_t, self.min_alpha, self.max_alpha))

    def predict_interval(
        self,
        y_pred: float,
        residual_scale: float = 1.0,
    ) -> Tuple[float, float]:
        """Return adaptive prediction interval around a point prediction."""
        if self.n < 10:
            width = 2.0 * residual_scale
            return y_pred - width, y_pred + width

        q = np.quantile(self.calibration_scores, 1 - self.alpha_t, method="higher")
        width = q * residual_scale
        return y_pred - width, y_pred + width

    def predict_set_size_hint(self) -> float:
        if self.n < 5:
            return float("inf")
        return float(np.quantile(self.calibration_scores, 1 - self.alpha_t, method="higher"))


# Soft-rank e-value helper (for post-hoc α / e-value mode)
def soft_rank_e_value(scores: list[float], test_score: float) -> float:
    """Simple soft-rank style e-variable. Threshold at 1/α for set construction."""
    all_scores = scores + [test_score]
    mean_s = float(np.mean(all_scores))
    if mean_s <= 0:
        return 1.0
    return float(test_score / mean_s)
