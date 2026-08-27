"""Conformal p-value and a valid e-variable, for post-hoc / anytime-valid checks.

conformal_p is the standard finite-sample exchangeability p-value:
p = (1 + #{cal_i >= score}) / (n + 1), uniform on {1/(n+1), ..., 1} under
the exchangeability null. covers_posthoc() and posthoc_alpha() are both
built on this: it is the calibrated, distribution-free statistic, so it is
what decides whether a point looks like an outlier against calibration.

soft_rank_e is a valid e-variable, marginally: e = score / mean(calibration +
[score]). For n+1 exchangeable nonnegative scores S_1..S_{n+1}, summing
e_i = S_i / mean(all n+1) over i gives exactly n+1 -- that sum is a fixed
identity, not just an expectation, since sum_i S_i / mean(S) = (n+1) by
definition of the mean. Exchangeability makes every E[e_i] equal, and n+1
equal terms summing to n+1 forces each one to E[e_i] = 1.

That gives E[e] = 1 marginally, which is what "valid e-variable" means. It
does NOT by itself make the running product across a stream a test
martingale: Ville's inequality needs the conditional guarantee
E[e_t | past] <= 1, and here the pool each e_t is computed against grows
from the same stream it is scoring, so the conditional expectation can and
does exceed 1 (~1.9 measured shortly after a small early score). Treat
soft_rank_e / e_product as a valid per-point signal, not as licensing a
Ville-style anytime-valid bound on the running product -- that would need a
proper e-process construction (e.g. betting against calibration held fixed
outside the stream being tested), which this module does not implement.

(The previous soft_rank_e returned (n+1)/(1+#{cal_i >= score}) -- the
reciprocal of conformal_p. That is >= 1 by construction regardless of the
data, so E[e] > 1 under the null: not a valid e-variable at all.)
"""
from __future__ import annotations

import numpy as np

from .quantiles import conformal_quantile, scale_width


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
    """Smallest alpha at which soft_rank_e's e-value e would reject.

    Kept for callers scoring a fixed e directly. EValueConformal itself uses
    conformal_p for its decisions (see the module docstring for why) -- call
    EValueConformal.posthoc_p() for that calibrated equivalent instead of
    reaching for this function through e_for().
    """
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
        q = scale_width(conformal_quantile(self.calibration_scores, self.alpha), residual_scale)
        return y_pred - q, y_pred + q

    def e_for(self, y_true: float, y_pred: float) -> float:
        """The marginal e-variable soft_rank_e for this point. See module docstring:
        not calibrated for a covered/not-covered decision -- use posthoc_p() for that."""
        score = abs(float(y_true) - float(y_pred))
        return soft_rank_e(score, self.calibration_scores)

    def posthoc_p(self, y_true: float, y_pred: float) -> float:
        score = abs(float(y_true) - float(y_pred))
        return conformal_p(score, self.calibration_scores)

    def covers_posthoc(self, y_true: float, y_pred: float, alpha: float | None = None) -> bool:
        a = self.alpha if alpha is None else alpha
        return self.posthoc_p(y_true, y_pred) > a
