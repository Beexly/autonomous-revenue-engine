"""
Single source of truth for everything published about Charcuterie Chick.

The server is the ONLY price authority. A client may send guests, product and
date. A client may never send a price. `pricing.quote()` recomputes everything
from the catalog below.

Catalog is transcribed from the client's live site
(charcuterie-chick-sample-1.vercel.app). Do not add a product, price or claim
here that is not published there. Unpublished add-ons (midnight cart, champagne
cascade) have no entry and therefore cannot be priced.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from functools import lru_cache
from typing import Literal

# ---------------------------------------------------------------- business facts

BUSINESS_NAME = "Charcuterie Chick"
LEGAL_TRADING_NAME = "The Chick Goodies"  # as listed on The Knot / WeddingWire
OWNER = "Tricia Holfelder"
CITY = "Tomball"
STATE = "Texas"
PHONE_E164 = "+18324588180"          # [PHONE] on the published site
EMAIL = "[EMAIL]"
INSTAGRAM = "@charcuteriechickhtx"
SITE_URL = "https://charcuteriechick.ai"
LISTING_URLS = {
    "the_knot": "https://www.theknot.com/marketplace/the-chick-goodies-tomball-tx-2094771",
    "weddingwire": "https://www.weddingwire.com/biz/the-chick-goodies/fe9aa7e180588473.html",
}

# Published, verbatim, and load-bearing for trust:
#   "A quote request, not a booking. Dates and prices are confirmed by Tricia."
PUBLISHED_DISCLAIMER = (
    "A quote request, not a booking. Dates and prices are confirmed by Tricia."
)

# Grazing tables are published for 50 guests and up.
MIN_GUESTS = 50
MAX_GUESTS = 150

# The cart is published as "Houston's largest charcuterie cart" but is NOT
# priced anywhere. It therefore has no catalog entry and cannot be quoted.
UNPRICED_PRODUCTS = ("midnight_cart", "champagne_cascade")

DEPOSIT_RATE = 0.50  # 50% to hold a date

SERVICE_AREAS = ("Tomball", "The Woodlands", "Spring", "Conroe")


# ---------------------------------------------------------------- catalog

@dataclass(frozen=True)
class Product:
    """One published table.

    Exactly one of `price_per_person_cents` / `fixed_prices_cents` is set.
    Per-person products scale with headcount. Fixed products are priced by
    headcount band (the Holy Grail is published at 75 and 150 guests).
    """

    key: str
    name: str
    composition: str
    price_per_person_cents: int | None = None
    fixed_prices_cents: dict[int, int] = field(default_factory=dict)
    # Holy Grail includes its own guest count; selecting it constrains the quote.
    included_guests: tuple[int, ...] = ()

    @property
    def is_per_person(self) -> bool:
        return self.price_per_person_cents is not None


#: Five tables. This is the published catalog — nothing more, nothing less.
CATALOG: dict[str, Product] = {
    "graze-me": Product(
        key="graze-me",
        name="Graze Me, Craze Me",
        price_per_person_cents=2400,
        composition=(
            "Two sliders, meat and cheese, seasonal fruit, hummus, almonds, "
            "two salads, roasted and raw vegetables, and one dip."
        ),
    ),
    "standard": Product(
        key="standard",
        name="Grazing Standard",
        price_per_person_cents=2600,
        composition=(
            "Everything in Graze Me, Craze Me, plus a second hummus, two dips, "
            "pasta salad and chips."
        ),
    ),
    "super-graze": Product(
        key="super-graze",
        name="Super Graze",
        price_per_person_cents=3000,
        composition=(
            "Three sliders, three salads, three dips, two hummus, nuts, chips "
            "and a full vegetable spread."
        ),
    ),
    "grand-graze": Product(
        key="grand-graze",
        name="Grand Graze",
        price_per_person_cents=3800,
        composition=(
            "Five sliders, four salads, three dips, two hummus, two nuts, chips "
            "and mini pudding cups."
        ),
    ),
    "holy-grail": Product(
        key="holy-grail",
        name="Holy Grail of Grazing",
        fixed_prices_cents={75: 200_000, 150: 350_000},
        included_guests=(75, 150),
        composition=(
            "Five cheeses, five meats, two sliders, guacamole and pico de gallo."
        ),
    ),
}

PRODUCT_KEYS = tuple(CATALOG.keys())


@lru_cache(maxsize=1)
def catalog_fingerprint() -> str:
    """Stable hash of the published catalog.

    Logged on every quote so a mispriced inquiry can be traced to the exact
    price list that produced it.
    """
    import hashlib

    blob = "|".join(
        f"{p.key}:{p.name}:{p.price_per_person_cents}:{sorted(p.fixed_prices_cents.items())}"
        for p in CATALOG.values()
    )
    return hashlib.sha256(blob.encode()).hexdigest()[:12]


# ---------------------------------------------------------------- settings

@dataclass(frozen=True)
class Settings:
    twilio_account_sid: str | None = None
    twilio_auth_token: str | None = None
    twilio_from_number: str | None = None
    stripe_secret_key: str | None = None
    site_url: str = SITE_URL
    allowed_origins: tuple[str, ...] = ("https://charcuteriechick.ai",)
    # Fixed-window rate limit per client IP.
    rate_limit_requests: int = 5
    rate_limit_window_seconds: int = 300
    #: Outbound SMS is simulated unless credentials are present. Dry-run is the
    #: default for packages 2-4 so nothing bills a client by accident.
    allow_outbound: bool = False

    @property
    def twilio_ready(self) -> bool:
        return bool(self.twilio_account_sid and self.twilio_auth_token and self.twilio_from_number)

    @property
    def stripe_ready(self) -> bool:
        return bool(self.stripe_secret_key)

    @classmethod
    def from_env(cls) -> "Settings":
        import os

        origins = os.getenv("CC_ALLOWED_ORIGINS", "https://charcuteriechick.ai")
        return cls(
            twilio_account_sid=os.getenv("TWILIO_ACCOUNT_SID"),
            twilio_auth_token=os.getenv("TWILIO_AUTH_TOKEN"),
            twilio_from_number=os.getenv("TWILIO_FROM_NUMBER"),
            stripe_secret_key=os.getenv("STRIPE_SECRET_KEY"),
            site_url=os.getenv("CC_SITE_URL", SITE_URL),
            allowed_origins=tuple(o.strip() for o in origins.split(",") if o.strip()),
            rate_limit_requests=int(os.getenv("CC_RATE_LIMIT_REQUESTS", "5")),
            rate_limit_window_seconds=int(os.getenv("CC_RATE_LIMIT_WINDOW", "300")),
            allow_outbound=os.getenv("CC_ALLOW_OUTBOUND", "").lower() in {"1", "true", "yes"},
        )


@dataclass(frozen=True)
class ServiceAreaPage:
    area: str
    headline: str
    body: str


#: Service-area copy for Local SEO Citadel (Package 3).
#: Written in the client's plain, direct voice. No invented awards, no
#: fabricated testimonials, no superlatives that are not published.
SERVICE_AREA_PAGES: tuple[ServiceAreaPage, ...] = (
    ServiceAreaPage(
        area="Tomball",
        headline="Grazing tables and the cart, in Tomball.",
        body=(
            "Charcuterie Chick is based in Tomball. I take one party at a time, so "
            "every booking gets my full attention. Grazing tables start at 50 "
            "guests, and the cart comes to you."
        ),
    ),
    ServiceAreaPage(
        area="The Woodlands",
        headline="The cart, on your street in The Woodlands.",
        body=(
            "Houston's largest charcuterie cart, set up and served across The "
            "Woodlands. Weddings, receptions and company events from 50 guests up."
        ),
    ),
    ServiceAreaPage(
        area="Spring",
        headline="Grazing tables for Spring gatherings.",
        body=(
            "More than 35 years in restaurants, on the floor and on the line. "
            "Breads, jellies and jams made from scratch. Showers, rehearsal "
            "dinners, birthdays and company events."
        ),
    ),
    ServiceAreaPage(
        area="Conroe",
        headline="Boards and grazing tables across Conroe.",
        body=(
            "Five tables, published prices, and a quote you can read before you "
            "commit. English and Spanish spoken."
        ),
    ),
)
