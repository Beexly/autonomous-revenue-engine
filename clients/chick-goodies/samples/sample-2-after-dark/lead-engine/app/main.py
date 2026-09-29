"""
Charcuterie Chick — Automation Suite.

Four packages, one FastAPI app:

  1. /api/inquire            Instant Lead-to-Book
  2. /api/reviews            Content Syndicator
  3. /api/seo/*              Local SEO Citadel
  4. /api/vip/*              Corporate VIP Engine

Every public write route is behind the rate limiter, the origin allowlist and
the honeypot. See `security.py` for why, and for the known single-process
limitation of the rate limiter.
"""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from datetime import date

from fastapi import Depends, FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, field_validator

from .config import (
    CATALOG,
    MAX_GUESTS,
    MIN_GUESTS,
    PRODUCT_KEYS,
    PUBLISHED_DISCLAIMER,
    Settings,
    service_area_pages,
)
from .integrations import StripeClient, TwilioClient
from .packages.lead_to_book import LeadInquiry, LeadToBook
from .packages.seo_citadel import (
    Citation,
    audit_all,
    local_business_schema,
    service_area_page,
    schema_jsonld,
)
from .packages.syndicator import (
    ReviewRequest,
    SocialBrief,
    ContentSyndicator,
    draft_caption,
)
from .packages.vip_engine import (
    Cadence,
    CorporateClient,
    CorporateVIPEngine,
)
from .pricing import PricingError
from .security import OriginGuard, RateLimiter, check_honeypot, client_ip

logging.basicConfig(level=logging.INFO, format="%(levelname)s %(name)s %(message)s")
log = logging.getLogger("cc")

settings = Settings.from_env()

limiter = RateLimiter(
    limit=settings.rate_limit_requests,
    window_seconds=settings.rate_limit_window_seconds,
)
origin_guard = OriginGuard(allowed=settings.allowed_origins)

twilio = TwilioClient(
    settings.twilio_account_sid,
    settings.twilio_auth_token,
    settings.twilio_from_number,
    allow_outbound=settings.allow_outbound,
)
stripe = StripeClient(settings.stripe_secret_key)

lead_engine = LeadToBook(twilio, stripe)
syndicator = ContentSyndicator(twilio)
vip_engine = CorporateVIPEngine(twilio, allow_outbound=settings.allow_outbound)


@asynccontextmanager
async def lifespan(app: FastAPI):
    log.info(
        "cc suite ready | twilio=%s stripe=%s outbound=%s catalog=%s",
        twilio.ready,
        stripe.ready,
        settings.allow_outbound,
        list(CATALOG),
    )
    yield
    limiter.reset()


app = FastAPI(
    title="Charcuterie Chick Automation Suite",
    version="1.0.0",
    lifespan=lifespan,
    description="Quote authority, lead capture, review asks, local SEO, corporate re-order.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.allowed_origins),
    allow_credentials=False,
    allow_methods=["GET", "POST"],
    allow_headers=["content-type"],
)


# ---------------------------------------------------------------- guards

async def guard(request: Request, payload: dict | None = None) -> None:
    """Rate limit -> origin -> honeypot. Applied to every public write."""
    limiter.check(client_ip(request))
    origin_guard.check(request)
    if payload is not None:
        check_honeypot(payload)


# ---------------------------------------------------------------- schemas

class InquireRequest(BaseModel):
    """
    Note what is absent: there is no `total_amount`, no `deposit`, no `price`.

    A forged price cannot be expressed in this model. The server computes the
    quote from `guests` and `product` against the published catalog.
    """

    model_config = {"extra": "forbid"}

    name: str = Field(min_length=1, max_length=120)
    phone: str = Field(min_length=7, max_length=32)
    email: str | None = Field(default=None, max_length=254)
    event_date: date
    guests: int = Field(ge=MIN_GUESTS, le=MAX_GUESTS)
    product: str
    note: str | None = Field(default=None, max_length=1000)
    website: str = Field(default="", max_length=200)  # honeypot

    @field_validator("product")
    @classmethod
    def _known_product(cls, v: str) -> str:
        if v not in PRODUCT_KEYS:
            raise ValueError(f"product must be one of {sorted(PRODUCT_KEYS)}")
        return v


class ReviewAskRequest(BaseModel):
    model_config = {"extra": "forbid"}

    booking_id: str
    first_name: str
    guest_phone: str
    event_date: date
    asks_sent: int = 0
    website: str = ""


class CaptionRequest(BaseModel):
    model_config = {"extra": "forbid"}

    theme: str
    product_name: str | None = None
    season: str | None = None
    service_area: str | None = None
    guest_count: int | None = None


class CitationRequest(BaseModel):
    model_config = {"extra": "forbid"}

    directory: str
    name: str
    phone: str | None = None
    url: str | None = None
    address_line: str | None = None


class CitationBatchRequest(BaseModel):
    model_config = {"extra": "forbid"}

    citations: list[CitationRequest]


class EnrollRequest(BaseModel):
    model_config = {"extra": "forbid"}

    company: str
    contact_name: str
    phone: str
    email: str | None = None
    target_date: date | None = None
    prior_events: int = 0
    last_event_date: date | None = None
    notes: str | None = None


# ---------------------------------------------------------------- package 1

@app.post("/api/inquire")
async def inquire(payload: InquireRequest, request: Request, _: None = Depends(guard)):
    """
    Instant lead-to-book.

    Public and unauthenticated by necessity — the quote form is on the public
    site. Protection is the rate limiter, origin allowlist and honeypot.
    """
    await guard(request, payload.model_dump())

    inquiry = LeadInquiry(
        name=payload.name.strip(),
        phone=payload.phone.strip(),
        email=payload.email,
        event_date=payload.event_date,
        guests=payload.guests,
        product_key=payload.product,
        note=payload.note,
    )

    try:
        result = await lead_engine.handle(inquiry)
    except PricingError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    return {
        "inquiry_id": result.inquiry_id,
        "quote": result.quote.to_public_dict(),
        "checkout_url": result.checkout_url,
        "simulated": result.simulated,
        "disclaimer": PUBLISHED_DISCLAIMER,
    }


@app.get("/api/catalog")
async def catalog():
    """The published catalog. Read-only, used by the site calculator."""
    return {
        "products": [
            {
                "key": p.key,
                "name": p.name,
                "composition": p.composition,
                "price_per_person_cents": p.price_per_person_cents,
                "fixed_prices_cents": p.fixed_prices_cents or None,
                "included_guests": list(p.included_guests),
            }
            for p in CATALOG.values()
        ],
        "min_guests": MIN_GUESTS,
        "max_guests": MAX_GUESTS,
        "disclaimer": PUBLISHED_DISCLAIMER,
    }


# ---------------------------------------------------------------- package 2

@app.post("/api/reviews/request")
async def request_review(payload: ReviewAskRequest, request: Request, _: None = Depends(guard)):
    await guard(request, payload.model_dump())
    result = await syndicator.request_review(
        ReviewRequest(
            booking_id=payload.booking_id,
            guest_phone=payload.guest_phone,
            event_date=payload.event_date,
            asks_sent=payload.asks_sent,
        ),
        first_name=payload.first_name.strip(),
    )
    return {
        "sent": result.sent,
        "simulated": result.simulated,
        "message": result.message,
    }


@app.post("/api/social/caption")
async def social_caption(payload: CaptionRequest):
    """
    Draft a caption. No auth needed because nothing is published or sent — this
    only returns text for a human to approve.
    """
    return {
        "caption": draft_caption(
            SocialBrief(
                theme=payload.theme,
                product_name=payload.product_name,
                season=payload.season,
                service_area=payload.service_area,
                guest_count=payload.guest_count,
            )
        )
    }


# ---------------------------------------------------------------- package 3

@app.get("/api/seo/service-areas")
async def seo_service_areas():
    return {"areas": service_area_pages()}


@app.get("/api/seo/service-areas/{area}")
async def seo_service_area(area: str):
    page = service_area_page(area)
    if not page:
        raise HTTPException(status_code=404, detail="Unknown service area.")
    return page


@app.get("/api/seo/schema")
async def seo_schema():
    """LocalBusiness JSON-LD, generated from the one true NAP record."""
    return local_business_schema()


@app.get("/api/seo/schema.jsonld")
async def seo_schema_jsonld():
    from fastapi.responses import Response

    return Response(schema_jsonld(), media_type="application/ld+json")


@app.post("/api/seo/audit")
async def seo_audit(payload: CitationBatchRequest):
    """Report NAP drift across existing listings. Does not write anywhere."""
    return audit_all(
        Citation(
            directory=c.directory,
            name=c.name,
            phone=c.phone,
            url=c.url,
            address_line=c.address_line,
        )
        for c in payload.citations
    )


# ---------------------------------------------------------------- package 4

_vip = vip_engine


@app.get("/api/vip/roster")
async def vip_roster():
    return {
        "clients": [
            {
                "company": c.company,
                "contact_name": c.contact_name,
                "prior_events": c.prior_events,
                "target_date": c.target_date,
                "suppressed": c.suppressed,
            }
            for c in _vip.roster()
        ]
    }


@app.post("/api/vip/enroll", dependencies=[Depends(guard)])
async def vip_enroll(payload: EnrollRequest):
    _vip.enroll(
        CorporateClient(
            company=payload.company,
            contact_name=payload.contact_name,
            phone=payload.phone,
            email=payload.email,
            target_date=payload.target_date,
            prior_events=payload.prior_events,
            last_event_date=payload.last_event_date,
            notes=payload.notes,
        )
    )
    return {"enrolled": payload.company, "roster_size": len(_vip.roster())}


@app.post("/api/vip/confirm", dependencies=[Depends(guard)])
async def vip_confirm(company: str, event_date: date):
    _vip.confirm_booking(company, event_date)
    return {"confirmed": company, "event_date": event_date}


@app.post("/api/vip/suppress", dependencies=[Depends(guard)])
async def vip_suppress(company: str):
    _vip.suppress(company)
    return {"suppressed": company}


@app.get("/api/vip/queue")
async def vip_queue(today: date | None = None):
    """
    Everything due on a given day, with the drafted message for each.

    Read-only. Dispatching is `/api/vip/run`, and it is gated on CC_ALLOW_OUTBOUND.
    """
    when = today or date.today()
    return {
        "today": when,
        "outbound_enabled": settings.allow_outbound,
        "due": [
            {
                "company": t.client.company,
                "cadence": t.cadence.value,
                "message": t.message,
            }
            for t in _vip.due_touchpoints(when)
        ],
    }


@app.post("/api/vip/run", dependencies=[Depends(guard)])
async def vip_run(today: date | None = None):
    """Dispatch. Without CC_ALLOW_OUTBOUND this returns drafts and sends nothing."""
    when = today or date.today()
    results = await _vip.run_due(when)
    return {
        "today": when,
        "outbound_enabled": settings.allow_outbound,
        "results": [
            {
                "company": r.client,
                "cadence": r.cadence.value,
                "sent": r.sent,
                "simulated": r.simulated,
            }
            for r in results
        ],
    }


@app.get("/api/health")
async def health():
    return {
        "ok": True,
        "twilio": twilio.ready,
        "stripe": stripe.ready,
        "outbound": settings.allow_outbound,
        "cadences": [c.value for c in Cadence],
    }
