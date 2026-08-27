"""Finite-sample conformal quantile.

Split conformal needs the ceil((n+1)(1-alpha))-th smallest calibration score,
not the plain (1-alpha) empirical quantile. With too few points for the target
coverage the honest answer is an unbounded interval, so we return inf rather
than silently under-covering.

Why this matters, measured (40k trials per cell, |N(0,1)| scores):

    n=11 alpha=0.10  target 0.90   this rule 0.919   np.quantile(...,"higher") 0.837
    n=7  alpha=0.20  target 0.80   this rule 0.874   np.quantile(...,"higher") 0.748
    n=3  alpha=0.10  target 0.90   this rule 1.000   np.quantile(...,"higher") 0.752

The plain empirical quantile picks the ceil((n-1)(1-alpha))-th order statistic,
which is one rank too low whenever ceil((n+1)p) != ceil((n-1)p) + 1, and it
always returns a finite threshold even when n is too small to support the
requested coverage at all. Both failures shrink the interval and cost coverage.
"""
from __future__ import annotations

import math
from typing import Sequence

import numpy as np


def conformal_quantile(scores: Sequence[float], alpha: float) -> float:
    """Return the ceil((n+1)(1-alpha))-th smallest score, or inf if n is too small.

    inf is the honest answer, not a failure: with n calibration points you
    cannot certify (1-alpha) coverage unless ceil((n+1)(1-alpha)) <= n. Callers
    should propagate the resulting unbounded interval rather than substitute a
    finite guess.
    """
    n = len(scores)
    if n == 0:
        return float("inf")
    rank = math.ceil((n + 1) * (1.0 - alpha))
    if rank > n:
        return float("inf")
    return float(np.partition(np.asarray(scores, dtype=float), rank - 1)[rank - 1])


def scale_width(q: float, residual_scale: float) -> float:
    """Multiply a (possibly infinite) half-width by a scale without producing nan.

    inf * 0.0 is nan, which would silently turn an unbounded interval into a
    degenerate one. An unbounded interval stays unbounded at any scale.
    """
    if math.isinf(q):
        return float("inf")
    return float(q) * float(residual_scale)
