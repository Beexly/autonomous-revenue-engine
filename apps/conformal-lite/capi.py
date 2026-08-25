"""Meta CAPI + Pixel dedupe helpers. Does not send ads. Does not spend.

Pixel and CAPI must share the same event_id. PII is SHA-256 hex (lower, trimmed).
Tokens come from env only: META_PIXEL_ID, META_ACCESS_TOKEN, META_TEST_EVENT_CODE.
Never read ops/META_KEY.local.
"""
from __future__ import annotations

import hashlib
import json
import os
import time
import uuid
from urllib import error, request


def sha256_norm(value: str) -> str:
    v = (value or "").strip().lower()
    if not v:
        return ""
    return hashlib.sha256(v.encode("utf-8")).hexdigest()


def event_id(prefix: str = "so") -> str:
    return f"{prefix}_{uuid.uuid4().hex}"


def user_data(email: str = "", phone: str = "", external_id: str = "", fbp: str = "", fbc: str = "") -> dict:
    out = {}
    if email:
        out["em"] = [sha256_norm(email)]
    if phone:
        out["ph"] = [sha256_norm(phone)]
    if external_id:
        out["external_id"] = [sha256_norm(external_id)]
    if fbp:
        out["fbp"] = fbp
    if fbc:
        out["fbc"] = fbc
    return out


def payload(event_name: str, eid: str, action_source: str = "website", **custom) -> dict:
    body = {
        "event_name": event_name,
        "event_time": int(time.time()),
        "event_id": eid,
        "action_source": action_source,
        "user_data": custom.pop("user_data", {}),
        "custom_data": custom,
    }
    return body


def send_test(events: list[dict]) -> dict:
    """POST to Graph if env is set. Otherwise dry-run. Attribution window: 7d click + 1d view."""
    pixel = os.environ.get("META_PIXEL_ID", "").strip()
    token = os.environ.get("META_ACCESS_TOKEN", "").strip()
    test_code = os.environ.get("META_TEST_EVENT_CODE", "").strip()
    if not pixel or not token:
        return {"status": "dry_run", "reason": "missing META_PIXEL_ID or META_ACCESS_TOKEN", "events": len(events)}
    data = {"data": events, "access_token": token}
    if test_code:
        data["test_event_code"] = test_code
    url = f"https://graph.facebook.com/v21.0/{pixel}/events"
    req = request.Request(url, data=json.dumps(data).encode("utf-8"), headers={"Content-Type": "application/json"}, method="POST")
    try:
        with request.urlopen(req, timeout=8) as resp:
            return {"status": "ok", "http": resp.status, "body": resp.read()[:500].decode("utf-8", "replace")}
    except error.HTTPError as e:
        return {"status": "http_error", "http": e.code}
    except error.URLError:
        return {"status": "unreachable"}
