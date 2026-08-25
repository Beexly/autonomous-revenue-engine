"""conformal-lite: free-core adaptive conformal prediction.

Modes: aci | saocp | cqr | evalue. Numpy-only. Honest coverage caveats:
finite-sample guarantees need exchangeability (or a stated adaptive method).
"""
from __future__ import annotations

from .adaptive_cp import AdaptiveConformal
from .core import MODES, make
from .cqr import ConformalQR, quantile_residual
from .evalue import EValueConformal, posthoc_alpha, soft_rank_e
from .quantiles import conformal_quantile
from .saocp import SAOCP

__version__ = "0.1.0"

__all__ = [
    "AdaptiveConformal",
    "SAOCP",
    "ConformalQR",
    "EValueConformal",
    "MODES",
    "make",
    "quantile_residual",
    "soft_rank_e",
    "posthoc_alpha",
    "conformal_quantile",
    "__version__",
]
