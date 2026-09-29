"""
Package 2 — Content Syndicator.

Two jobs: ask for a review at the right moment, and draft on-brand social copy
from published facts only.

The hard rule in this package: **it never invents a testimonial.** It cannot
know what a guest said. It can only ask, and it can only publish what the
client has already written. Fabricated review text is both a legal liability and
a violation of the product's own doctrine, which is that this business does not
lie about its own performance.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass
from datetime import date, timedelta

from ..config import (
    BUSINESS_NAME,
    CITY,
    INSTAGRAM,
    LISTING_URLS,
    SERVICE_AREAS,
    STATE,
)
from ..integrations import SmsResult, TwilioClient

log = logging.getLogger("cc.pkg2")

#: When to ask. Reviews asked for too soon read as transactional.
REVIEW_ASK_DELAY = timedelta(days=2)
#: Never ask more than this many times.
MAX_REVIEW_ASKS = 2


@dataclass(frozen=True)
class ReviewRequest:
    booking_id: str
    guest_phone: str
    event_date: date
    asks_sent: int = 0


@dataclass(frozen=True)
class SyndicationResult:
    sent: bool
    message: str
    simulated: bool


class ContentSyndicator:
    def __init__(self, twilio: TwilioClient) -> None:
        self._twilio = twilio

    def should_ask(self, request: ReviewRequest, today: date) -> bool:
        if request.asks_sent >= MAX_REVIEW_ASKS:
            return False
        return (today - request.event_date).days >= REVIEW_ASK_DELAY.days

    async def request_review(self, request: ReviewRequest, first_name: str) -> SyndicationResult:
        """
        Ask a guest for a review. The ask contains links, not praise.

        Tone rule: never say "we'd love to hear how we did" in a way that
        presumes a positive review. Ask plainly, accept whatever the answer is,
        and make the negative path easy.
        """
        if not self.should_ask(request, date.today()):
            return SyndicationResult(
                sent=False,
                message="Too soon, or already asked the maximum number of times.",
                simulated=True,
            )

        body = _review_ask(first_name)
        result: SmsResult = await self._twilio.send(request.guest_phone, body)
        return SyndicationResult(
            sent=result.ok,
            message=body,
            simulated=result.simulated,
        )


# ---------------------------------------------------------------- copy


def _review_ask(first_name: str) -> str:
    return "\n".join(
        [
            f"Hi {first_name}, Chef Tricia with {BUSINESS_NAME}.",
            "",
            "Your event is done, so I have one favour to ask.",
            "If you have two minutes, would you leave an honest review?",
            "Good, bad or middling, all of it helps someone choosing a caterer.",
            "",
            f"The Knot: {LISTING_URLS['the_knot']}",
            f"WeddingWire: {LISTING_URLS['weddingwire']}",
            "",
            "If something was not right, text me instead. I would rather fix it.",
            f"{BUSINESS_NAME}, {CITY}, {STATE}",
        ]
    )


@dataclass(frozen=True)
class SocialBrief:
    """Inputs for a caption. Every field must be a published fact."""

    theme: str
    product_name: str | None = None
    season: str | None = None
    service_area: str | None = None
    guest_count: int | None = None


def draft_caption(brief: SocialBrief) -> str:
    """
    Draft an on-brand caption.

    Constraints enforced here:
      - No emoji. The brand system has none.
      - No invented superlatives, awards or counts.
      - No urgency language the client did not authorise.
      - Mentions service area only if it is one of the four published areas.
    """
    if brief.service_area and brief.service_area not in SERVICE_AREAS:
        brief = SocialBrief(
            theme=brief.theme,
            product_name=brief.product_name,
            season=brief.season,
            service_area=None,
            guest_count=brief.guest_count,
        )

    lines: list[str] = []

    if brief.guest_count:
        lines.append(
            f"A grazing table for {brief.guest_count} people, set up in "
            f"{brief.service_area or CITY}."
        )
    elif brief.service_area:
        lines.append(f"Grazing tables and the cart, out in {brief.service_area}.")
    else:
        lines.append(f"{BUSINESS_NAME}. Grazing tables and the cart, out of {CITY}, {STATE}.")

    if brief.product_name:
        lines.append(f"This one was the {brief.product_name}.")

    if brief.theme:
        lines.append(brief.theme)

    lines.append(
        f"More than 35 years in restaurants, on the floor and on the line. "
        f"One party at a time. {INSTAGRAM}"
    )

    caption = "\n\n".join(lines)
    return caption[:2200]  # Instagram hard limit
