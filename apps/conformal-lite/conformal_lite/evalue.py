"""Valid e-variable and conformal p-value for post-hoc alpha / anytime-valid checks.

conformal_p is the standard finite-sample exchangeability p-value:
p = (1 + #{cal_i >= score}) / (n + 1), uniform on {1/(n+1), ..., 1} under
the exchangeability null.

soft_rank_e is a valid e-variable: e = score / mean(calibration + [score]).
For n+1 exchangeable nonnegative scores, E[score_i / mean(all n+1)] = 1/(n+1)
by symmetry, so E[e] = (n+1) * 1/(n+1) = 1 under the null. The running
product of e across a stream is therefore a nonnegative test martingale and
Markov/Ville bounds on it are justified for post-hoc / anytime-valid alpha
selection.

(The previous soft_rank_e returned (n+1)/(1+#{cal_i >= score}) -- the
reciprocal of conformal_p. That is >= 1 by construction regardless of the
data, so E[e] > 1 under the null: not a valid e-variable, and its running
product is not a martingale.)
"""
from __future__ import annotations

import numpy as np


def conformal_p(score: float, calibration: list[float]) -> float:
    n = len(calibration)
    ge = 1 + sum(1 for s in calibration if s >= score)
    return float(ge) / float(n + 1)


def soft_rank_e(score: float, calibration: list[float]) -> float:
    pool = calibration + [score]
    mean_pool = float(np.mean(pool))
    if mean_pool <= 0:
        return 1.0
    return float(score) / mean_pool


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
