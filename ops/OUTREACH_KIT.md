# Outreach Kit — Meta Tracking Diagnostic ($250)

The product is finished (`docs/meta-tracking-audit.html` + the 12 tools in
`docs/tools/`). This file is everything needed to sell it. The agent does steps
1–4 and drafts everything; the human sends and gets paid.

---

## 1. Who to contact

Businesses **actively running Meta ads right now** with nobody senior owning
their tracking:

- E-commerce / DTC stores (Shopify, Woo) doing their own ads or using a small
  freelancer — supplements, pet, home goods, apparel, beauty
- Local lead-gen services running Meta lead ads (med spas, clinics, home
  services, gyms) — often on GoHighLevel or Framer (we have dedicated tools for
  both: `docs/tools/ghl-form.html`, `docs/tools/framer-capi.html`)

**Skip:** big brands and anyone with a real agency of record on display.

### Sourcing (10/day, ~20 min)

1. Go to the **Meta Ad Library** — facebook.com/ads/library — public, no login.
2. Country → search a niche keyword ("collagen", "dog treats", "med spa
   Austin") → filter **Active** ads.
3. Qualify: 3+ active ads, a real checkout or lead form, small enough that the
   founder is findable on LinkedIn/IG.
4. Record: brand, URL, what they're advertising, contact name if findable.

## 2. Find one real thing per prospect (the hook)

Before drafting, check their public site. Verifiable from raw HTML alone:

| Check | Evidence to look for | What it means for them |
|---|---|---|
| Pixel base code loaded twice | two `connect.facebook.net/...fbevents.js` includes, or two `fbq('init', SAME_ID)` | PageViews double-counted; skewed frequency + reporting |
| Two different pixel IDs | two `fbq('init', ...)` with different IDs | events split/duplicated across accounts |
| Hardcoded fbq **and** GTM both present | `fbq(` in HTML + `googletagmanager.com/gtm` | classic double-install; likely double-fired standard events |
| No `eventID` on tracked events | `fbq('track', ...)` calls with no eventID | if they also run CAPI, purchases are being double-counted |
| No fbq and no GTM at all (but ads active) | neither string present | running paid ads with no measurement |

**Rules:** only claim what you actually saw, and note what static HTML *can't*
show (GTM-injected pixels, checkout-page events, server-side CAPI). If their
homepage looks clean, use Template B — the audit's value lives in checkout and
CAPI, which aren't visible from outside anyway.

## 3. Templates (agent personalizes; human sends)

### A — Cold email, defect found (~90 words)

> **Subject:** [Brand] — your Meta pixel (quick finding)
>
> Hi [Name],
>
> I was looking at [Brand]'s site and noticed your Meta pixel [specific
> finding, e.g. "loads its base code twice, so every PageView is
> double-counted"]. That quietly skews reported ROAS and feeds Meta's
> optimization noisy data — you pay for the algorithm's confusion.
>
> I do a flat **$250 tracking diagnostic**: full Pixel + CAPI audit (dedup,
> event match quality, consent), written fix list in 48 hours. If your setup
> turns out clean, the report says that instead — either way you know.
>
> Want me to send the detail of what I spotted? No charge for that part.
>
> — Garrett

### B — Cold email, nothing claimable from outside

Same shape, but open with: "Most Meta ad accounts I audit are over- or
under-counting purchases without knowing it — the breakage hides in checkout
events and Pixel/CAPI dedup, which you can't see from the outside." Then the
same offer and free-first-look close.

### C — DM (X / IG / LinkedIn, ≤60 words)

> Hey — noticed [Brand]'s Meta pixel [finding]. That usually means your ROAS
> numbers are off and Meta is optimizing on bad data. I run a flat $250
> Pixel/CAPI audit — written fixes in 48h. Happy to send the specific thing I
> spotted first, free. Interested?

### D — Follow-up (3–4 days, once)

> Bumping this once — the [finding] was still live on your site as of today.
> Happy to send details either way, no charge. If tracking is someone else's
> lane, who should I ping?

**Never:** "I hope this finds you well", fake urgency, invented results, more
than one follow-up, anything you can't prove on a call.

## 4. Objections

- **"We have an agency."** → "Perfect — this is an independent second look at
  plumbing agencies rarely re-check. If they've got it perfect, $250 buys the
  receipt that says so."
- **"Are you legit?"** → link the free tools hub (`docs/index.html`): "these
  run entirely in your browser, nothing leaves the page — the same checks the
  paid audit runs against your full setup."
- **"Price?"** → "$250 is the diagnostic only. The fix list is yours — do the
  fixes yourself, hand them to your dev, or I quote implementation at
  $500–1,500."

## 5. Close, payment, fulfillment

**Payment first, then the 48h clock starts.** Stripe payment link or PayPal
invoice for $250. (If the Stripe connector is authorized in claude.ai, the
agent can create the payment link directly.)

**Intake (send after payment):** pixel ID(s), platform (Shopify / Woo / GHL /
Framer / custom), Events Manager screenshots (Overview + Test Events +
Diagnostics tabs), backend purchase count for the same 7 days.

**The audit itself (~2–3 hrs), mapped to the existing tools:**
1. Pixel install & sources — `docs/tools/pixel-source.html`
2. Pixel↔CAPI event_id dedup + 48h window — `docs/tools/id-pair.html`
3. fbp/fbc capture — `docs/tools/fbp-fbc.html`
4. Event Match Quality coverage — `docs/tools/emq-cover.html`
5. Platform vs backend purchase reconciliation — `docs/tools/count-gap.html`
6. Test-events walkthrough — `docs/tools/test-events.html`
7. Consent handling — `docs/tools/consent-capi.html`
8. Catalog / content_id (if e-com) — `docs/tools/content-id.html`
9. Stack-specific page: `stape-capi` / `framer-capi` / `ghl-form` /
   `shop-pay` as applicable

**Deliverable:** a 2–4 page findings doc — each item as **Found / Impact /
Fix / Priority** — plus one thing they're doing right, plus a 20-minute
walkthrough call or Loom. End with the implementation quote if fixes exist.

## 6. Operating math (so nobody lies to themselves)

Personalized cold outreach replies at ~1–5%. At 10 sends/day: first replies in
days, first paid diagnostic plausibly 2–6 weeks. Every send and outcome goes in
`ops/OUTREACH_LOG.csv` — that file is the only scoreboard. 50+ sends with zero
replies → change one variable (list, opener, or price), never all three, and
run another week.
