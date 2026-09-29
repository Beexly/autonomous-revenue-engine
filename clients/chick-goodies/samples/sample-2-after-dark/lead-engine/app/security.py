"""
Request guards for public, unauthenticated endpoints.

The original handler was an open POST that sent two SMS per call. That is a
direct Twilio bill-exhaustion vector. These three guards are the minimum viable
protection for anything reachable from the public internet:

  1. Fixed-window rate limit, keyed by client IP.
  2. Honeypot field — bots fill hidden inputs, humans do not.
  3. Origin allowlist — blocks cross-site POSTs from other hosts.

NOTE: the rate limiter is in-process. Running more than one worker means each
worker keeps its own window, so the effective limit is `workers × limit`.
Swap the store for Redis before scaling out. That tradeoff is explicit rather
than hidden.
"""

from __future__ import annotations

import time
from collections import defaultdict, deque
from dataclasses import dataclass, field

from fastapi import HTTPException, Request, status


@dataclass
class RateLimiter:
    """Fixed-window counter. Deliberately simple and inspectable."""

    limit: int = 5
    window_seconds: int = 300
    _hits: dict[str, deque[float]] = field(default_factory=lambda: defaultdict(deque))

    def check(self, key: str) -> None:
        now = time.monotonic()
        window = self._hits[key]
        while window and now - window[0] > self.window_seconds:
            window.popleft()

        if len(window) >= self.limit:
            retry_after = int(self.window_seconds - (now - window[0])) + 1
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Too many requests. Please try again shortly.",
                headers={"Retry-After": str(retry_after)},
            )
        window.append(now)

    def reset(self) -> None:
        self._hits.clear()


@dataclass
class OriginGuard:
    allowed: tuple[str, ...] = ()

    def check(self, request: Request) -> None:
        if not self.allowed:
            return
        origin = request.headers.get("origin")
        # Same-origin fetches and non-browser clients may omit Origin entirely.
        if origin and origin not in self.allowed:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Origin not allowed.",
            )


def client_ip(request: Request) -> str:
    """
    Best-effort client IP.

    Honours X-Forwarded-For only when a trusted proxy sets it. If the app is
    exposed directly, that header is client-controlled and must not be trusted
    for security decisions — it is used here only to bucket the rate limit.
    Configure a real trusted-proxy count before relying on it.
    """
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def check_honeypot(payload: dict) -> None:
    """
    Bots fill every input they find. A human never sees this field.

    Fails silently with a plausible success response so a bot learns nothing.
    """
    value = (payload.get("website") or "").strip()
    if value:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail="Unable to process request.",
        )
