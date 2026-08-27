"""Selectable free core: aci | saocp | cqr | evalue."""
from __future__ import annotations

from .adaptive_cp import AdaptiveConformal
from .cqr import ConformalQR
from .evalue import EValueConformal
from .saocp import SAOCP

MODES = ("aci", "saocp", "cqr", "evalue")


def make(mode: str = "aci", alpha: float = 0.1):
    mode = (mode or "aci").lower()
    if mode not in MODES:
        raise ValueError(f"mode must be one of {MODES}")
    if mode == "aci":
        return AdaptiveConformal(alpha=alpha)
    if mode == "saocp":
        return SAOCP(alpha=alpha)
    if mode == "cqr":
        return ConformalQR(alpha=alpha)
    return EValueConformal(alpha=alpha)
