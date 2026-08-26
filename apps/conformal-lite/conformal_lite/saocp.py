"""SAOCP-style strongly adaptive mix of ACI experts.

Sleeping-experts / multiplicative-weights over ACI learners at different
gammas so the interval can track regime shifts. Not a line-by-line port of
Salesforce online_conformal.
"""
from __future__ import annotations

from typing import Tuple

import numpy as np

from .adaptive_cp import AdaptiveConformal


class SAOCP:
    def __init__(
        self,
        alpha: float = 0.1,
        gammas: tuple[float, ...] = (0.01, 0.05, 0.1, 0.2),
        eta: float = 0.25,
    ):
        self.alpha = alpha
        self.eta = eta
        self.experts = [AdaptiveConformal(alpha=alpha, gamma=g) for g in gammas]
        self.weights = np.ones(len(self.experts), dtype=float) / len(self.experts)
        self.n = 0

    def _pick(self) -> AdaptiveConformal:
        return self.experts[int(np.argmax(self.weights))]

    def predict_interval(
        self, y_pred: float, residual_scale: float = 1.0
    ) -> Tuple[float, float]:
        return self._pick().predict_interval(y_pred, residual_scale=residual_scale)

    def update(self, y_true: float, y_pred: float) -> None:
        losses = []
        for exp in self.experts:
            lo, hi = exp.predict_interval(y_pred)
            covered = 1.0 if lo <= y_true <= hi else 0.0
            width = max(hi - lo, 1e-6)
            # pinball-like: miss is expensive, fat intervals are a tax
            loss = (1.0 - covered) + 0.05 * width
            losses.append(loss)
            exp.update(y_true, y_pred)
        self.n += 1

        losses = np.asarray(losses, dtype=float)
        finite = np.isfinite(losses)
        if not finite.any():
            # Every expert is still unbounded (calibration too small to certify
            # its alpha), so all of them trivially "cover" with infinite width.
            # No expert has distinguished itself and there is nothing to learn
            # this round; leave the weights alone rather than driving every
            # exp(-eta * inf) to zero and renormalising 0/0 into nan.
            return
        if not finite.all():
            # An unbounded interval is the worst outcome on offer, not an
            # undefined one: rank it just below the worst finite loss so the
            # multiplicative-weights update stays well-posed.
            losses = np.where(finite, losses, losses[finite].max() + 1.0)
        # Shifting by the minimum is exactly equivalent after renormalisation
        # but keeps exp() away from underflow when losses are large.
        losses = losses - losses.min()
        self.weights = self.weights * np.exp(-self.eta * losses)
        total = self.weights.sum()
        if not np.isfinite(total) or total <= 0.0:
            self.weights = np.ones(len(self.experts), dtype=float) / len(self.experts)
        else:
            self.weights = self.weights / total

    def predict_set_size_hint(self) -> float:
        return self._pick().predict_set_size_hint()

    @property
    def alpha_t(self) -> float:
        return self._pick().alpha_t
