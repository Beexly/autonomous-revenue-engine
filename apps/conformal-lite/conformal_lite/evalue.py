"""E-values for post-hoc α and anytime-valid checks.

A valid e-variable must satisfy E[e] <= 1 under the exchangeability null.
We use the mean-ratio construction: e = s_test / mean(calibration + test).
Under exchangeability of nonnegative scores its expectation is exactly 1,
and the running product over a stream is a test martingale, so Ville's
inequality gives an anytime-valid bound: P(sup product >= 1/α) <= α.

The previous soft-rank construction ((n+1) / (1 + #{s_i >= s})) is the
reciprocal of a conformal p-value — it is >= 1 by construction and is NOT
a valid e-variable. It is kept here only as `conformal_p`'s reciprocal
history; use `conformal_p` when you want a p-value.
"""
from __future__ import annotations

from .quantiles import conformal_quantile


def conformal_p(score: float, calibration: list[float]) -> float:
    """Conformal p-value: (1 + #{s_i >= s}) / (n + 1). Superuniform under
    exchangeability."""
    n = len(calibration)
    ge = 1 + sum(1 for s in calibration if s >= score)
    return ge / (n + 1)


def mean_ratio_e(score: float, calibration: list[float]) -> float:
    """Valid e-variable for nonnegative scores: s / mean(cal + [s]).

    E[e] = 1 exactly under exchangeability. e >> 1 is evidence the new
    point does not conform.
    """
    total = float(sum(calibration)) + float(score)
    n1 = len(calibration) + 1
    if total <= 0:
        return 1.0
    return float(score) * n1 / total


def soft_rank_e(score: float, calibration: list[float]) -> float:
    """Deprecated name kept for compatibility; now returns the VALID
    mean-ratio e-value (the original soft-rank formula was not a valid
    e-variable — its expectation under the null exceeds 1)."""
    return mean_ratio_e(score, calibration)


def posthoc_alpha(e: float) -> float:
    """Smallest α at which this e-value rejects (Markov: P(e >= 1/α) <= α)."""
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
        e = mean_ratio_e(score, self.calibration_scores)
        self.e_product *= max(e, 1e-12)
        self.calibration_scores.append(score)
        self.n += 1

    def predict_interval(self, y_pred: float, residual_scale: float = 1.0):
        if self.n < 10:
            w = 2.0 * residual_scale
            return y_pred - w, y_pred + w
        q = conformal_quantile(self.calibration_scores, self.alpha)
        return y_pred - q, y_pred + q

    def e_for(self, y_true: float, y_pred: float) -> float:
        score = abs(float(y_true) - float(y_pred))
        return mean_ratio_e(score, self.calibration_scores)

    def covers_posthoc(self, y_true: float, y_pred: float, alpha: float | None = None) -> bool:
        a = self.alpha if alpha is None else alpha
        return self.e_for(y_true, y_pred) < 1.0 / a
