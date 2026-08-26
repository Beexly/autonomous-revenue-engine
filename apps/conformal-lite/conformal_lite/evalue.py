"""Conformal p-value and a valid e-variable, for post-hoc / anytime-valid checks.

`conformal_p` is the standard finite-sample exchangeability p-value:
p = (1 + #{cal_i >= score}) / (n + 1), uniform on {1/(n+1), ..., 1} under the
exchangeability null. `covers_posthoc()` and `posthoc_p()` are built on this —
it is the calibrated, distribution-free statistic, so it is what decides
whether a point looks like an outlier against calibration.

`soft_rank_e` is a valid e-variable, marginally: e = score / mean(calibration
+ [score]). For n+1 exchangeable nonnegative scores S_1..S_{n+1}, summing
e_i = S_i / mean(all n+1) over i gives exactly n+1 — that is a deterministic
algebraic identity (sum(S_i) / mean(S) = n+1), not just an expectation.
Exchangeability makes every E[e_i] equal, and n+1 equal terms whose sum is
fixed at n+1 forces each one to E[e_i] = 1. That is what "valid e-variable"
means (E[e] <= 1, here exactly 1, marginally).

It does NOT by itself make the running product across a stream a test
martingale: Ville's inequality needs the conditional guarantee
E[e_t | past] <= 1, and here the pool each e_t is computed against grows
from the same stream it is scoring, so the conditional expectation can and
does exceed 1. Treat `soft_rank_e` / `e_product` as a valid per-point signal,
not as licensing a Ville-style anytime-valid bound on the running product —
that needs a proper e-process construction (e.g. betting against a
calibration set held fixed outside the stream being tested), which this
module does not implement.

(The previous version of this module returned (n+1)/(1+#{cal_i>=score}) —
the reciprocal of conformal_p. That is >= 1 by construction regardless of
the data, so E[e] > 1 under the null: not a valid e-variable at all. Measured
by this repo's own audit: E[e] ~ 3.04 at n=10, 5.13 at n=100, 7.43 at
n=1000 — growing like the harmonic number, exactly as the reciprocal-of-a-
uniform's expectation predicts.)
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

    Kept for callers scoring a fixed e directly. EValueConformal's own
    decisions use conformal_p (see the module docstring for why) — call
    EValueConformal.posthoc_p() for that calibrated equivalent.
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
        q = conformal_quantile(self.calibration_scores, self.alpha)
        width = scale_width(q, residual_scale)
        if not np.isfinite(width):
            # Cold start: uncalibrated heuristic band, no coverage guarantee.
            width = 2.0 * residual_scale
        return y_pred - width, y_pred + width

    def e_for(self, y_true: float, y_pred: float) -> float:
        """The marginal e-variable soft_rank_e for this point. See module
        docstring: not calibrated for a covered/not-covered decision — use
        posthoc_p() for that."""
        score = abs(float(y_true) - float(y_pred))
        return soft_rank_e(score, self.calibration_scores)

    def posthoc_p(self, y_true: float, y_pred: float) -> float:
        score = abs(float(y_true) - float(y_pred))
        return conformal_p(score, self.calibration_scores)

    def covers_posthoc(self, y_true: float, y_pred: float, alpha: float | None = None) -> bool:
        a = self.alpha if alpha is None else alpha
        return self.posthoc_p(y_true, y_pred) > a
