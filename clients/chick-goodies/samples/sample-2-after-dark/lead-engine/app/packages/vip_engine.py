"""
Package 4 — Corporate VIP Engine.

Holiday re-order system for past corporate clients. The premise is simple and it
is the client's own: Tricia takes one party at a time, so the repeat business is
the same handful of companies booking the same dates each year.

This package holds a roster of those companies and walks them through a
pre-announced cadence around the booking window, so the outreach happens on a
schedule instead of whenever someone remembers.

Two safeguards, both deliberate:

  * Outreach is **draft-first**. `CC_ALLOW_OUTBOUND` gates actual sends; without
    it every message is generated and returned for review, never dispatched.
  * Suppression. A company that has booked, declined, or asked not to be
    contacted is removed from the queue and stays removed.
"""

from __future__ import annotations

import logging
from dataclasses import dataclass, field
from datetime import date, timedelta
from enum import Enum

from ..config import BUSINESS_NAME, CITY, OWNER, PHONE_E164, STATE
from ..integrations import SmsResult, TwilioClient

log = logging.getLogger("cc.pkg4")


class Cadence(str, Enum):
    ANNOUNCE = "announce"
    REMIND = "remind"
    LAST_CALL = "last-call"
    CONFIRMED = "confirmed"
    SUPPRESSED = "suppressed"


#: When each touch fires, counted back from the target date.
CADENCE_OFFSETS: dict[Cadence, int] = {
    Cadence.ANNOUNCE: -56,
    Cadence.REMIND: -28,
    Cadence.LAST_CALL: -7,
    Cadence.CONFIRMED: 0,
}


@dataclass
class CorporateClient:
    company: str
    contact_name: str
    phone: str
    email: str | None = None
    target_date: date | None = None
    prior_events: int = 0
    last_event_date: date | None = None
    suppressed: bool = False
    notes: str | None = None

    @property
    def first_name(self) -> str:
        return self.contact_name.split()[0] if self.contact_name.split() else "there"


@dataclass
class Touchpoint:
    client: CorporateClient
    cadence: Cadence
    message: str


@dataclass
class ReachOutResult:
    client: str
    cadence: Cadence
    sent: bool
    simulated: bool
    message: str


class CorporateVIPEngine:
    def __init__(self, twilio: TwilioClient, allow_outbound: bool = False) -> None:
        self._twilio = twilio
        self._allow = allow_outbound
        self._roster: dict[str, CorporateClient] = {}

    # ------------------------------------------------------------ roster

    def enroll(self, client: CorporateClient) -> None:
        self._roster[self._key(client.company)] = client

    def suppress(self, company: str) -> None:
        client = self._roster.get(self._key(company))
        if client:
            client.suppressed = True
            client.target_date = None
            log.info("suppressed company=%s", self._key(company))

    def confirm_booking(self, company: str, event_date: date) -> None:
        """A confirmed booking clears the company from the current cycle."""
        client = self._roster.get(self._key(company))
        if not client:
            return
        client.target_date = None
        client.suppressed = True
        client.prior_events += 1
        client.last_event_date = event_date

    def roster(self) -> list[CorporateClient]:
        return list(self._roster.values())

    # ------------------------------------------------------------ queue

    def due_touchpoints(self, today: date) -> list[Touchpoint]:
        """
        Everything due today, in priority order: most prior events first, then
        closest target date. Companies that already booked never appear.
        """
        due: list[Touchpoint] = []
        for client in self._roster.values():
            if client.suppressed or client.target_date is None:
                continue
            days_out = (client.target_date - today).days
            for cadence, offset in CADENCE_OFFSETS.items():
                if days_out == offset:
                    due.append(
                        Touchpoint(
                            client=client,
                            cadence=cadence,
                            message=self._draft(client, cadence, client.target_date),
                        )
                    )
                    break
        due.sort(key=lambda t: (-t.client.prior_events, t.client.target_date or today))
        return due

    def next_touchpoint_date(self, client: CorporateClient, today: date) -> date | None:
        """When this client is next due, for the internal calendar view."""
        if client.suppressed or client.target_date is None:
            return None
        future = [
            today + timedelta(days=offset - (client.target_date - today).days)
            for offset in CADENCE_OFFSETS.values()
        ]
        upcoming = [d for d in future if d >= today]
        return min(upcoming) if upcoming else None

    async def run_due(self, today: date) -> list[ReachOutResult]:
        results: list[ReachOutResult] = []
        for touch in self.due_touchpoints(today):
            if not self._allow:
                results.append(
                    ReachOutResult(
                        client=touch.client.company,
                        cadence=touch.cadence,
                        sent=False,
                        simulated=True,
                        message=touch.message,
                    )
                )
                continue
            sms: SmsResult = await self._twilio.send(touch.client.phone, touch.message)
            results.append(
                ReachOutResult(
                    client=touch.client.company,
                    cadence=touch.cadence,
                    sent=sms.ok,
                    simulated=sms.simulated,
                    message=touch.message,
                )
            )
        return results

    # ------------------------------------------------------------ copy

    def _draft(self, client: CorporateClient, cadence: Cadence, target: date) -> str:
        when = target.strftime("%A, %-d %B") if hasattr(target, "strftime") else str(target)
        opening = f"Hi {client.first_name}, Chef Tricia with {BUSINESS_NAME}."

        if client.prior_events:
            history = (
                f"We have done {client.prior_events} "
                f"{'event' if client.prior_events == 1 else 'events'} for {client.company} now."
            )
        else:
            history = f"I would like to work with {client.company} again."

        bodies = {
            Cadence.ANNOUNCE: (
                f"{opening}\n\n{history}\n\n"
                f"Dates for the season are open now, and I take one party per date, "
                f"so the early word is genuinely useful. If you have a date in mind "
                f"for {when}, tell me and I will tell you straight whether I can hold it."
            ),
            Cadence.REMIND: (
                f"{opening}\n\n{history}\n\n"
                f"Quick check on {when}. I am holding dates for corporate parties "
                f"across {CITY} and the north side. Still want to pencil it in?"
            ),
            Cadence.LAST_CALL: (
                f"{opening}\n\n{history}\n\n"
                f"Last call on {when}. After that I release the date. "
                f"If you want it, say the word and I will send a quote."
            ),
            Cadence.CONFIRMED: (
                f"{opening}\n\n{when} is yours. I will be in touch to confirm the "
                f"menu and the headcount."
            ),
            Cadence.SUPPRESSED: f"{opening}\n\nNo message for this one.",
        }

        body = bodies[cadence]
        return f"{body}\n\n{OWNER}\n{BUSINESS_NAME}, {CITY}, {STATE}\n{PHONE_E164}"

    @staticmethod
    def _key(company: str) -> str:
        return company.strip().lower()
