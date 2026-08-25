"""Soft-rank e-variable for post-hoc α and anytime-valid checks.

E >= 1/α is evidence against the null that the new point is exchangeable
with calibration. Lets you pick α after seeing scores (post-hoc) while
keeping a Markov/Ville-style bound. See Gauthier et al. on e-values for CP.
"""
from __future__ import annotations

import numpy as np


def soft_rank_e(score: float, calibration: list[float]) -> float:
    if not calibration:
        return 1.0
    n = len(calibration)
    ge = 1 + sum(1 for s in calibration if s >= score)
    return float(n + 1) / float(ge)


def posthoc_alpha(e: float) -> float:
    """Smallest α that would reject / uncover given this e."""
    if e <= 0:
        return 1.0
    return min(1.0, 1.0 / e)


class EValueConformal:
    def __init__(self, alpha: float = 0.1):
        self.alpha = alpha
        self.calibration_scores: list[float] = []
        self.e_product = 1.0
        self.n = 0

    def update(self, y_true: float, y_pred: float) -> None:
        score = abs(float(y_true) - float(y_pred))
        e = soft_rank_e(score, self.calibration_scores)
        self.e_product *= max(e, 1e-12)
        self.calibration_scores.append(score)
        self.n += 1

    def predict_interval(self, y_pred: float, residual_scale: float = 1.0):
        if self.n < 10:
            w = 2.0 * residual_scale
            return y_pred - w, y_pred + w
        q = float(np.quantile(self.calibration_scores, 1 - self.alpha, method="higher"))
        return y_pred - q, y_pred + q

    def e_for(self, y_true: float, y_pred: float) -> float:
        score = abs(float(y_true) - float(y_pred))
        return soft_rank_e(score, self.calibration_scores)

    def covers_posthoc(self, y_true: float, y_pred: float, alpha: float | None = None) -> bool:
        a = self.alpha if alpha is None else alpha
        return self.e_for(y_true, y_pred) < 1.0 / a
