"""
Package 1 — Instant Lead-to-Book.

Rewrite of the original handler. The four critical defects and how each is
closed:

  1. Client controlled the price  → `pricing.quote()` recomputes from the
     published catalog. The request model has no amount field at all, so a
     forged total cannot be expressed, let alone accepted.
  2. Static Stripe link           → a Checkout Session is created per quote
     with `line_items` from the computed deposit, idempotency-keyed.
  3. No rate limiting              → per-IP fixed window + honeypot in
     `security.py`, applied to the route.
  4. Blocking I/O in async path   → `TwilioClient` is httpx.AsyncClient only.

Also: the phone number no longer appears in any URL. Deposits are referenced by
an opaque inquiry id.
"""

from __future__ import annotations

import logging
import uuid
from dataclasses import dataclass
from datetime import date, datetime

from ..config import OWNER, PHONE_E164, SITE_URL
from ..integrations import CheckoutResult, SmsResult, StripeClient, TwilioClient
from ..pricing import Quote, format_deposit, format_usd, quote as build_quote

log = logging.getLogger("cc.pkg1")


@dataclass(frozen=True)
class LeadInquiry:
    """Input. Deliberately contains no money fields."""

    name: str
    phone: str
    email: str | None
    event_date: date
    guests: int
    product_key: str
    note: str | None = None


@dataclass(frozen=True)
class LeadResult:
    inquiry_id: str
    quote: Quote
    checkout_url: str | None
    host_sms_sent: bool
    owner_sms_sent: bool
    simulated: bool


class LeadToBook:
    def __init__(self, twilio: TwilioClient, stripe: StripeClient) -> None:
        self._twilio = twilio
        self._stripe = stripe

    async def handle(self, inquiry: LeadInquiry) -> LeadResult:
        # 1. Price is computed here, never accepted from the request.
        priced: Quote = build_quote(guests=inquiry.guests, product_key=inquiry.product_key)

        # 2. Opaque reference. No PII in URLs.
        inquiry_id = uuid.uuid4().hex

        # 3. Deposit session built from the computed amount.
        checkout = await self._stripe.create_deposit_session(
            reference_id=inquiry_id,
            line_description=f"{priced.product_name} — 50% deposit",
            amount_cents=priced.deposit_cents,
            quantity=1,
            success_url=f"{_site()}/deposit/thanks?ref={inquiry_id}",
            cancel_url=f"{_site()}/#epilogue",
            customer_email=inquiry.email,
            metadata={
                "inquiry_id": inquiry_id,
                "product": priced.product_key,
                "guests": str(priced.guests),
                "catalog_version": priced.catalog_version,
            },
        )

        when = _friendly_date(inquiry.event_date)
        first = inquiry.name.split()[0] if inquiry.name.split() else "there"

        host_body = _host_message(first, priced, checkout.checkout_url, when)
        owner_body = _owner_message(inquiry, priced, inquiry_id, checkout)

        # Both sends are awaited concurrently — this is the 60-second promise.
        host_sms, owner_sms = await _gather(
            self._twilio.send(inquiry.phone, host_body),
            self._twilio.send(PHONE_E164, owner_body),
        )

        return LeadResult(
            inquiry_id=inquiry_id,
            quote=priced,
            checkout_url=checkout.checkout_url,
            host_sms_sent=host_sms.ok,
            owner_sms_sent=owner_sms.ok,
            simulated=host_sms.simulated or owner_sms.simulated or checkout.simulated,
        )


# ---------------------------------------------------------------- copy
# Plain, direct customer language. No emoji, no exclamation marks, no
# fabricated claims, no urgency the client did not authorise.


def _host_message(first_name: str, priced: Quote, checkout_url: str | None, when: str) -> str:
    lines = [
        f"Hi {first_name}, Chef Tricia with Charcuterie Chick.",
        "",
        f"I have your date request for {when}.",
        f"{priced.guests} guests, {priced.product_name}, {format_usd(priced.total_cents)} total.",
        "",
        f"To hold the date I take a 50% deposit of {format_deposit(priced.deposit_cents)}:",
    ]
    if checkout_url:
        lines.append(checkout_url)
    else:
        lines.append("Text or call me and I will send a secure link.")
    lines += [
        "",
        f"{priced.composition}",
        "",
        "Dates and final pricing are confirmed by Tricia before anything is set.",
        "A quote request, not a booking, until the deposit is received.",
        "",
        f"Questions: text or call {PHONE_E164}.",
    ]
    return "\n".join(lines)


def _owner_message(
    inquiry: LeadInquiry, priced: Quote, inquiry_id: str, checkout: CheckoutResult
) -> str:
    return "\n".join(
        [
            "New event inquiry - Charcuterie Chick",
            "",
            f"Name: {inquiry.name}",
            f"Phone: {inquiry.phone}",
            f"Email: {inquiry.email or 'not given'}",
            f"Date: {_friendly_date(inquiry.event_date)}",
            f"Guests: {priced.guests}",
            f"Table: {priced.product_name}",
            f"Total: {format_usd(priced.total_cents)}",
            f"Deposit due: {format_deposit(priced.deposit_cents)}",
            f"Inquiry: {inquiry_id}",
            f"Deposit link: {checkout.checkout_url or 'not created'}",
            f"Catalog: {priced.catalog_version}",
        ]
        + (["", f"Note: {inquiry.note}"] if inquiry.note else [])
    )


# ---------------------------------------------------------------- helpers


def _site() -> str:
    return SITE_URL


def _friendly_date(d: date) -> str:
    today = datetime.now().date()
    if d == today:
        return "today"
    if (d - today).days == 1:
        return "tomorrow"
    return f"{d.strftime('%A')}, {d.day} {d.strftime('%B')}"


async def _gather(*coros):
    """Run both SMS sends concurrently."""
    import asyncio

    return await asyncio.gather(*coros)
