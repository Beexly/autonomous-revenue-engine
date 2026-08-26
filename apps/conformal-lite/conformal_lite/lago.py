"""Lago usage events. Free path stays unmetered.

If LAGO_API_KEY is set, POST /api/v1/events.
Else if ORIGIN_METER=1, append local JSONL.
Else no-op.
Never log secrets. Paid spend still needs human APPROVE.
"""
from __future__ import annotations

import json
import os
import time
import uuid
from pathlib import Path
from urllib import error, request


def _jsonl(row: dict) -> None:
    path = Path(__file__).with_name("meter_events.jsonl")
    with path.open("a", encoding="utf-8") as f:
        f.write(json.dumps(row) + "\n")


def emit(event: str, **fields) -> dict:
    row = {
        "transaction_id": str(uuid.uuid4()),
        "ts": int(time.time()),
        "code": event,
        **{k: v for k, v in fields.items() if k not in ("api_key", "token", "secret")},
    }
    api_key = os.environ.get("LAGO_API_KEY", "").strip()
    base = os.environ.get("LAGO_API_URL", "https://api.getlago.com").rstrip("/")
    sub = os.environ.get("LAGO_EXTERNAL_SUBSCRIPTION_ID", "").strip()

    if api_key and sub:
        payload = {
            "event": {
                "transaction_id": row["transaction_id"],
                "external_subscription_id": sub,
                "code": event,
                "timestamp": row["ts"],
                "properties": {k: str(v) for k, v in fields.items()},
            }
        }
        req = request.Request(
            f"{base}/api/v1/events",
            data=json.dumps(payload).encode("utf-8"),
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        try:
            with request.urlopen(req, timeout=8) as resp:
                row["lago"] = "ok"
                row["http"] = resp.status
        except error.HTTPError as e:
            row["lago"] = "http_error"
            row["http"] = e.code
        except error.URLError:
            row["lago"] = "unreachable"
        if os.environ.get("ORIGIN_METER") == "1":
            _jsonl({k: v for k, v in row.items()})
        return row

    if os.environ.get("ORIGIN_METER") == "1":
        row["lago"] = "stub"
        _jsonl(row)
        return row

    row["lago"] = "skip"
    return row
