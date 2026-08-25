"""Finite-sample conformal quantile.

Split conformal needs the ceil((n+1)(1-alpha))-th smallest calibration score,
not the plain (1-alpha) empirical quantile. With too few points for the target
coverage the honest answer is an unbounded interval, so we return inf rather
than silently under-covering.
"""
from __future__ import annotations

import math
from typing import Sequence

import numpy as np


def conformal_quantile(scores: Sequence[float], alpha: float) -> float:
    n = len(scores)
    if n == 0:
        return float("inf")
    rank = math.ceil((n + 1) * (1.0 - alpha))
    if rank > n:
        return float("inf")
    return float(np.partition(np.asarray(scores, dtype=float), rank - 1)[rank - 1])
