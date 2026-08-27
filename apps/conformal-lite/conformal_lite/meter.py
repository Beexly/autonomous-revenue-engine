"""Local JSONL stub plus Lago when keys exist."""
from __future__ import annotations

from .lago import emit as lago_emit


def emit(event: str, **fields) -> dict:
    return lago_emit(event, **fields)
