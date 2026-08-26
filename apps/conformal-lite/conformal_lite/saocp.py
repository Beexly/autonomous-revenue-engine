"""SAOCP-style strongly adaptive mix of ACI experts.

Sleeping-experts / multiplicative-weights over ACI learners at different
gammas so the interval can track regime shifts. Not a line-by-line port of
Salesforce online_conformal.

Two fixes from this repo's 2026-08-26 audit:

1. `predict_interval`/`predict_set_size_hint`/`alpha_t` used to hard-select
   `experts[argmax(weights)]`. The multiplicative-weights regret bound this
   algorithm's name refers to applies to the WEIGHTED MIXTURE's realized
   loss, not to always betting everything on whichever expert currently
   looks best — that is a different (and unbounded-regret) algorithm wearing
   the same name. Predictions are now a weights-weighted average across all
   experts' intervals.
2. The per-expert loss mixed a dimensionless miscoverage indicator (0 or 1)
   with a raw, unnormalized interval width. Width scales with the data's own
   units, so at a small natural scale the indicator and width terms are
   comparable and weights track coverage; at a large scale (measured: data
   scaled x100) the width term swamps the indicator and weights collapse to
   whichever expert has a marginally narrower band, regardless of coverage.
   Width is now judged relative to a running scale estimate instead of as a
   bare number.
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
        self._scale_ema: float | None = None

    def predict_interval(
        self, y_pred: float, residual_scale: float = 1.0
    ) -> Tuple[float, float]:
        los, his = [], []
        for exp in self.experts:
            lo, hi = exp.predict_interval(y_pred, residual_scale=residual_scale)
            los.append(lo)
            his.append(hi)
        lo = float(np.average(los, weights=self.weights))
        hi = float(np.average(his, weights=self.weights))
        return lo, hi

    def update(self, y_true: float, y_pred: float) -> None:
        scale_ref = self._scale_ema if self._scale_ema is not None else 1.0
        losses = []
        for exp in self.experts:
            lo, hi = exp.predict_interval(y_pred)
            covered = 1.0 if lo <= y_true <= hi else 0.0
            width = max(hi - lo, 1e-6)
            # pinball-like: miss is expensive, fat intervals (relative to the
            # stream's own scale) are a tax.
            loss = (1.0 - covered) + 0.05 * (width / max(scale_ref, 1e-6))
            losses.append(loss)
            exp.update(y_true, y_pred)
        self.n += 1

        losses = np.asarray(losses, dtype=float)
        finite = np.isfinite(losses)
        if not finite.any():
            # Every expert is still unbounded (calibration too small to
            # certify its alpha), so all of them trivially "cover" with
            # infinite width. Nothing has distinguished itself; leave the
            # weights alone rather than driving every exp(-eta*inf) to zero
            # and renormalizing 0/0 into nan.
            pass
        else:
            if not finite.all():
                # An unbounded interval is the worst outcome on offer, not an
                # undefined one: rank it just below the worst finite loss so
                # the multiplicative-weights update stays well-posed.
                losses = np.where(finite, losses, losses[finite].max() + 1.0)
            losses = losses - losses.min()
            self.weights = self.weights * np.exp(-self.eta * losses)
            total = self.weights.sum()
            if not np.isfinite(total) or total <= 0.0:
                self.weights = np.ones(len(self.experts), dtype=float) / len(self.experts)
            else:
                self.weights = self.weights / total

        mag = max(abs(y_true), 1e-6)
        self._scale_ema = mag if self._scale_ema is None else 0.9 * self._scale_ema + 0.1 * mag

    def predict_set_size_hint(self) -> float:
        hints = [exp.predict_set_size_hint() for exp in self.experts]
        finite = [h for h in hints if np.isfinite(h)]
        if not finite:
            return float("inf")
        weights = self.weights if len(finite) == len(hints) else None
        return float(np.average(finite, weights=weights))

    @property
    def alpha_t(self) -> float:
        return float(np.average([exp.alpha_t for exp in self.experts], weights=self.weights))
