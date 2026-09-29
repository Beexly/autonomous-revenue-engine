# Charcuterie Chick — Automation Suite

Four packages behind one FastAPI app, built around one rule: **the server is the
only price authority.**

```
lead-engine/
├── app/
│   ├── config.py              published catalog — the one source of truth
│   ├── pricing.py             server-side quote recompute (the critical fix)
│   ├── security.py            rate limit · honeypot · origin allowlist
│   ├── integrations.py        async Twilio + dynamic Stripe Checkout Sessions
│   ├── main.py                FastAPI routes
│   └── packages/
│       ├── lead_to_book.py    Package 1 — Instant Lead-to-Book
│       ├── syndicator.py      Package 2 — Content Syndicator
│       ├── seo_citadel.py     Package 3 — Local SEO Citadel
│       └── vip_engine.py      Package 4 — Corporate VIP Engine
└── tests/
    └── test_pricing.py        pricing invariants (stdlib only)
```

## The four defects this rewrite closes

| # | Defect | Fix |
|---|---|---|
| 1 | Client posted `total_amount`; deposit computed from it. A forged `$100` produced a `$50` checkout link. | `InquireRequest` has **no money field at all**. `pricing.quote()` recomputes from `config.CATALOG` in integer cents. |
| 2 | One static Stripe Payment Link in the SMS. A `$3,000` quote still charged the `$2,400` deposit. | A Checkout Session is created per quote with `line_items` from the computed deposit, `Idempotency-Key`-scoped. |
| 3 | Unauthenticated POST sending two SMS per call — a direct Twilio bill-exhaustion vector. | Per-IP fixed-window rate limit, hidden honeypot field, origin allowlist on every public write. |
| 4 | Blocking `requests.post` twice inside a coroutine, stalling the event loop. | `TwilioClient` / `StripeClient` are `httpx.AsyncClient` only. No vendor SDK, no blocking path to reintroduce. |

Also: phone numbers no longer appear in URLs. Deposits reference an opaque
`uuid4().hex` inquiry id. Logs mask phone numbers to the last two digits.

## Pricing authority

```
guests + product  ──►  pricing.quote()  ──►  total_cents, deposit_cents
```

Catalog is transcribed from the client's live site. **Five tables**, not four
plus an add-on — the Holy Grail of Grazing is published as a table priced by
headcount band:

| Table | Price | Composition |
|---|---|---|
| Graze Me, Craze Me | $24 / person | Two sliders, meat and cheese, seasonal fruit, hummus, almonds, two salads, roasted and raw vegetables, one dip. |
| Grazing Standard | $26 / person | Everything in Graze Me, Craze Me, plus a second hummus, two dips, pasta salad and chips. |
| Super Graze | $30 / person | Three sliders, three salads, three dips, two hummus, nuts, chips and a full vegetable spread. |
| Grand Graze | $38 / person | Five sliders, four salads, three dips, two hummus, two nuts, chips and mini pudding cups. |
| Holy Grail of Grazing | **$2,000 / 75 guests** · **$3,500 / 150 guests** | Five cheeses, five meats, two sliders, guacamole and pico de gallo. |

Grazing tables are published for **50 guests and up**. Unpublished products —
the midnight cart and champagne cascade — have **no catalog entry and cannot be
quoted**. They are hidden rather than invented.

Money is never a float anywhere in this package. Every amount is an `int` in
cents.

## Running

```bash
pip install fastapi "uvicorn[standard]" httpx pydantic
uvicorn app.main:app --reload
```

Pricing invariants need **no dependencies** and run on a bare Python 3.12:

```bash
python -m unittest discover -s tests -v
```

Current status on this machine: **24 passed, 3 skipped.** The three skips are
the request-model tests, which need `pydantic`/`fastapi`. They are written and
will run once those are installed. Nothing was installed here — this
environment's run contract forbids package installation, so the dependency gap
is reported rather than filled.

## Environment

```bash
TWILIO_ACCOUNT_SID=
TWILIO_AUTH_TOKEN=
TWILIO_FROM_NUMBER=
STRIPE_SECRET_KEY=
CC_SITE_URL=https://charcuteriechick.ai
CC_ALLOWED_ORIGINS=https://charcuteriechick.ai
CC_RATE_LIMIT_REQUESTS=5
CC_RATE_LIMIT_WINDOW=300
CC_ALLOW_OUTBOUND=false          # see below
```

`CC_ALLOW_OUTBOUND` defaults to **false**. Without it, Twilio sends are
simulated and Stripe sessions return a non-payable stand-in URL. Nothing bills
the client by accident. Flip it only after the quote maths is confirmed live.

## Endpoints

```
POST /api/inquire                 Package 1  — quote + deposit session + SMS
GET  /api/catalog                 published catalog, for the site calculator
POST /api/reviews/request         Package 2  — review ask (rate-limited)
POST /api/social/caption          Package 2  — draft caption (nothing sent)
GET  /api/seo/service-areas       Package 3  — four published areas
GET  /api/seo/schema              Package 3  — LocalBusiness JSON-LD
POST /api/seo/audit               Package 3  — NAP drift report
GET  /api/vip/roster              Package 4  — corporate roster
POST /api/vip/enroll              Package 4  — add a company
GET  /api/vip/queue               Package 4  — what is due today
POST /api/vip/run                 Package 4  — dispatch (gated)
GET  /api/health
```

## Known limitations, stated rather than hidden

- **Rate limiter is in-process.** Multiple workers multiply the effective limit
  by the worker count. Swap the store for Redis before scaling out.
- **`X-Forwarded-For` is used for bucketing only.** If the app is exposed
  directly, that header is client-controlled. Configure a real trusted-proxy
  count before treating the rate limit as a security boundary.
- **The 50% deposit policy contradicts the client's published line** *"A quote
  request, not a booking. Dates and prices are confirmed by Tricia."* Both are
  honoured in the copy — the SMS states the deposit holds the date and that
  final pricing is confirmed by Tricia — but the business should consciously
  choose the harder sales posture. That is Tricia's call, not a code decision.
- **Untested against live Twilio and Stripe.** No credentials on this machine.
  The HTTP shapes match current API docs, but the first live send should be a
  test number.

## Doctrine

Do not add a product, price, award or testimonial to `config.py` that is not
published on the client's site. The syndicator never writes review text — it
can ask, it cannot invent. The SEO package emits no `aggregateRating` without a
matching on-page review widget. This business exists because it does not lie
about its own performance; the code has to hold the same line.
