# Gumroad Listing — White-Label Shopify OS 2.0 Zero-App Catering Theme & Bookings Kit

## Title
**Shopify OS 2.0 Zero-App Catering Bookings & Quote Engine Kit (White-Label)**

## Tagline
Stop paying $49–$199/mo for bloated Shopify booking & catering apps. Drop in native OS 2.0 Liquid + vanilla JS + cent-accurate TypeScript quote math you own outright.

## Suggested Price
**$149** (Single-store license) / **$349** (Agency unlimited client sites)

---

## Product Description (Copy-Paste Ready)

Most Shopify catering and event businesses pay **$600–$2,400/year** in recurring app fees just to block booked dates, enforce guest minimums, and build custom event quotes—while those apps slow down mobile checkout.

This white-label kit gives you the **production-tested, zero-app code** to run catering bookings and instant quotes natively inside Shopify OS 2.0:

### What You Get
- **Bookings Calendar OS 2.0 Section (`bookings-calendar.liquid` + `cc-bookings.js`):**
  - Blocks booked dates via a free, public Google Sheet CSV—update availability from your phone in 5 seconds.
  - Enforces minimum guest count & minimum order value before allowing an inquiry.
  - Graceful fallback to manual blocked dates if the sheet is unreachable.
- **3 Interactive Station & Cart Configurators:**
  - `graze-carts-core.js` — Grazing cart & board builder
  - `bmb-core.js` — Build-your-own bar/box configurator
  - `cakes-and-shakes-core.js` — Dessert & beverage station builder
- **Cent-Accurate TypeScript Quote Engine (`catering.ts`):**
  - Integer-cent arithmetic (zero floating-point rounding bugs) for per-person tiers, flat packages, setup fees, and tax.
  - Pre-formatted SMS/Email enquiry builder that never falsely claims a date is "booked."
- **25 Automated Unit Tests (`cc-bookings.test.js` + `catering.test.ts`):**
  - Run `node tests/cc-bookings.test.js` and `node lib/catering.test.ts` with zero external dependencies (Node 22/24+).

### Who It's For
- Shopify agencies & freelancers building sites for caterers, bakeries, mobile bars, and event rentals.
- Catering owners tired of monthly SaaS app bills.

### Requirements
- Shopify Online Store 2.0 theme
- Node.js 22+ (optional, only if running the included test suite locally)
