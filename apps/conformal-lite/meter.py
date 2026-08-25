"""Local usage stub. Not Lago. Paid path later.
Set ORIGIN_METER=1 to append JSONL events under ./meter_events.jsonl
"""
from __future__ import annotations

import json
import os
import time
from pathlib import Path


def emit(event: str, **fields) -> None:
    if os.environ.get("ORIGIN_METER") != "1":
        return
    row = {"ts": time.time(), "event": event, **fields}
    path = Path(__file__).with_name("meter_events.jsonl")
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row) + "\n")
