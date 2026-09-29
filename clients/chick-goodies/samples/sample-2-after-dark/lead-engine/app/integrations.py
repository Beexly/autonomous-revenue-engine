"""
Outbound integrations. Both are fully async — the original handler used
blocking `requests.post` twice inside a coroutine, which stalled the event loop
and undermined the 60-second promise under any concurrency.

Both are HTTP-first with no vendor SDK, so the async path is the only path and
there is no blocking fallback to accidentally reintroduce.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass

import httpx

log = logging.getLogger("cc.integrations")

TWILIO_BASE = "https://api.twilio.com/2010-04-01/Accounts"
STRIPE_BASE = "https://api.stripe.com/v1"


# ---------------------------------------------------------------- Twilio


@dataclass(frozen=True)
class SmsResult:
    ok: bool
    sid: str | None = None
    error: str | None = None
    simulated: bool = False


class TwilioClient:
    """Async Twilio SMS. Never logs message bodies or credentials."""

    def __init__(
        self,
        account_sid: str | None,
        auth_token: str | None,
        from_number: str | None,
        allow_outbound: bool = False,
    ) -> None:
        self._sid = account_sid
        self._token = auth_token
        self._from = from_number
        self._allow = allow_outbound
        self._ready = bool(account_sid and auth_token and from_number)

    @property
    def ready(self) -> bool:
        return self._ready

    async def send(self, to: str, body: str) -> SmsResult:
        """
        Send an SMS.

        Refuses to send unless credentials are present AND outbound is enabled,
        so a test run can never bill the client. The simulated branch returns a
        clearly-marked result so callers and logs stay honest.
        """
        if not self._ready or not self._allow:
            log.info("SMS simulated (not sent) to=%s chars=%d", _mask(to), len(body))
            return SmsResult(ok=True, simulated=True)

        # Cap length defensively. Twilio segments beyond 160 chars.
        if len(body) > 1500:
            body = body[:1497] + "..."

        url = f"{TWILIO_BASE}/{self._sid}/Messages.json"
        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(
                    url,
                    data={"To": to, "From": self._from, "Body": body},
                    auth=(self._sid, self._token),
                )
        except httpx.HTTPError as exc:
            log.error("Twilio transport error: %s", exc.__class__.__name__)
            return SmsResult(ok=False, error=exc.__class__.__name__)

        if resp.status_code >= 400:
            log.error("Twilio rejected message: HTTP %s", resp.status_code)
            return SmsResult(ok=False, error=f"HTTP {resp.status_code}")

        return SmsResult(ok=True, sid=resp.json().get("sid"))


# ---------------------------------------------------------------- Stripe


@dataclass(frozen=True)
class CheckoutResult:
    ok: bool
    checkout_url: str | None = None
    session_id: str | None = None
    error: str | None = None
    simulated: bool = False


class StripeClient:
    """
    Dynamic Checkout Sessions.

    The original handler embedded one static Payment Link in the SMS. A Payment
    Link has a fixed amount baked in, so a $3,000 quote would still have charged
    the $2,400 deposit. A Session is created per quote with `line_items` built
    from the server-computed total, and an idempotency key prevents a retry from
    creating a second payable session.
    """

    def __init__(self, secret_key: str | None) -> None:
        self._key = secret_key

    @property
    def ready(self) -> bool:
        return bool(self._key)

    async def create_deposit_session(
        self,
        *,
        reference_id: str,
        line_description: str,
        amount_cents: int,
        quantity: int,
        success_url: str,
        cancel_url: str,
        customer_email: str | None = None,
        metadata: dict[str, str] | None = None,
    ) -> CheckoutResult:
        """
        Create a one-time Checkout Session for the deposit.

        `reference_id` must be an opaque inquiry id — never a phone number.
        Phone numbers in URLs leak into browser history and payment logs.
        """
        if not self.ready:
            log.info("Stripe session simulated (no key). amount=%d", amount_cents)
            return CheckoutResult(ok=True, simulated=True, checkout_url=simulated_url(reference_id))

        if amount_cents <= 0:
            return CheckoutResult(ok=False, error="Non-positive deposit.")

        form: list[tuple[str, str]] = [
            ("mode", "payment"),
            ("success_url", success_url),
            ("cancel_url", cancel_url),
            ("client_reference_id", reference_id),
            ("line_items[0][price_data][currency]", "usd"),
            ("line_items[0][price_data][unit_amount]", str(amount_cents)),
            ("line_items[0][price_data][product_data][name]", line_description),
            ("line_items[0][quantity]", str(quantity)),
        ]
        if customer_email:
            form.append(("customer_email", customer_email))
        for key, value in (metadata or {}).items():
            form.append((f"metadata[{key}]", value))

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(
                    f"{STRIPE_BASE}/checkout/sessions",
                    data=form,
                    auth=(self._key, ""),
                    headers={"Idempotency-Key": f"cc-deposit-{reference_id}"},
                )
        except httpx.HTTPError as exc:
            log.error("Stripe transport error: %s", exc.__class__.__name__)
            return CheckoutResult(ok=False, error=exc.__class__.__name__)

        if resp.status_code >= 400:
            log.error("Stripe rejected session: HTTP %s", resp.status_code)
            return CheckoutResult(ok=False, error=f"HTTP {resp.status_code}")

        data = resp.json()
        return CheckoutResult(
            ok=True,
            checkout_url=data.get("url"),
            session_id=data.get("id"),
        )


def simulated_url(reference_id: str) -> str:
    """Non-payable stand-in used when Stripe credentials are absent."""
    return f"https://checkout.stripe.test/deposit/{reference_id}"


def _mask(phone: str) -> str:
    """Log phone numbers as last-two only. Never log a full number."""
    digits = "".join(ch for ch in phone if ch.isdigit())
    return f"***-{digits[-2:]}" if len(digits) >= 2 else "***"
