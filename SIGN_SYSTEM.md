# THE SIGN SYSTEM — unified battle plan
Owner: Motif · Status: building · Updated: 2026-09-11

Garrett's directive: tie EVERYTHING together. No half-assed scattered projects.
One machine: OSINT finds them, free tiers run it, the engine renders, Recordly
shows it, Kit's preview mechanic sells it, Kit websites cash the cross-sell.

## The machine (one loop)

```
OSINT client-finding ──> free mockup/preview ──> lead captured ──> monetize ──> Kit cross-sell
        │                        │                     │               │               │
  free-for.dev            SignPreview engine     $0 infra        shops / direct     $350 websites
  OSINT page              (one renderer)       (Vercel+free)    Vow & Post $$$
```

Every lane feeds every other lane. Nothing stands alone.

## Layer 1 — FIND (OSINT, from Garrett's OSINT page)

Ranked by signal value:

1. **New-business detection (highest value).** A business that just signed a lease
   needs a sign AND a website AND everything else.
   - Texas SOS business entity filings (new LLCs, Harris County)
   - Harris County assumed-name (DBA) certificates
   - "Now open" / "coming soon" posts, geotagged Humble/Atascocita/Kingwood
   - Commercial lease listings (LoopNet etc.) — new tenants
   - Google Maps "newly opened" / first reviews
2. **Bad-signage drive-bys.** Virtual Street View passes down Atascocita Rd,
   FM 1960, Kingwood Dr, Humble corridors. Faded / damaged / missing signs get
   a free mockup made and sent. The preview IS the pitch.
3. **Sign-shop mapping.** Every sign shop within 30 miles (Maps, Yelp) = the
   buyer side of the lead-arbitrage market + B2B tool prospects.
4. **Wedding-vendor mapping.** Planners + venues (The Knot, WeddingWire,
   Instagram #houstonwedding) = Vow & Post affiliates AND Kit website prospects.
5. **Trigger events.** Grand-opening Facebook events, "coming soon" banners
   spotted on social — timed outreach while intent is hot.

## Layer 2 — RUN ($0, from free-for.dev)

Non-negotiable: spend stays $0 until revenue exists.

- Hosting: Vercel (live) / Cloudflare Pages
- Image generation: free-tier APIs for the renderer (v1: pollinations, no key)
- Email alerts: Resend / Mailgun free tiers (lead notifications)
- Database: Supabase / Neon free tier (lead capture, v2)
- Video: Recordly (open-source, AGPL — used as a tool, not forked)

## Layer 3 — RENDER (SignPreview engine, one renderer, two skins)

`docs/signpreview.html` — v1 live on the Factory shelf.

- Input: business name + tagline, sign type (storefront / monument / banner /
  window), style (modern / classic / neon / rustic)
- Output: photorealistic mockup, watermark-light, shareable
- Skin A (B2B/consumer): "See your new sign" — lead magnet + shop demo
- Skin B (Vow & Post): wedding signage — welcome signs, seating charts, menus,
  table numbers. Brand rule: NEVER "AI wedding signs". Sell the craft.

## Layer 4 — SHOW (Recordly video line)

Recordly v1.3.0 Linux AppImage in `~/workspace/tools/recordly/` (smoke-tested
2026-09-11 under Xvfb). Every lane gets a polished demo video, produced
autonomously on the VM:

- Kit: walkthrough videos of sample sites + "your preview" for prospects
- SignPreview: 60-second "watch it work" for sign shops (B2B pitch)
- Vow & Post: product demos for couples/planners
- Factory tools: demo clips = X/Instagram content

Video outsells screenshots. The free-preview mechanic + a walkthrough video
is the highest-converting outreach in the system.

## Layer 5 — SELL (Kit's preview mechanic, transplanted)

The mechanic that works: "I made this for YOU already — want it?"

- Sign shops: "I sent you 3 free leads this week — keep them coming?" (lead
  arbitrage, $25–75/lead) + finished design packages ($150–300)
- Business owners: free mockup → design package or shop referral cut
- Wedding: instant-download designs ($29–79), planner affiliates (rev share)
- **Cross-sell under everything: Kit websites ($350).** Every sign lead is a
  business owner who needs a site. Every wedding vendor needs a site.

## Revenue math (rough, honest)

- Lead arbitrage: 10 mockups/wk → ~3 contacts → $40/lead × 2–3 shops ≈ $400/mo start
- Design packages: 2–4/mo × $200 ≈ $400–800/mo
- Vow & Post: 20 orders/mo × $49 ≈ $1k/mo
- Kit cross-sell: 1 site/mo from this flow = $350, compounding
- Stacked realistic 90-day target: $2–3k/mo across the system, $0 spend

## Build order (autonomous)

1. ✅ SignPreview v1 (docs/signpreview.html) — engine + consumer skin
2. ⏳ Recordly smoke test → first demo video (Kit sample walkthrough)
3. ⏳ Vow & Post skin (wedding templates in the same engine)
4. ⏳ Lead capture backend (Supabase free tier) — v2
5. ⏳ B2B embed page for sign shops ("put this on your quote page")
6. ⏳ OSINT sweep #1: new businesses, Humble/Atascocita/Kingwood
7. ⏳ First outreach batch: free mockups to bad-signage prospects

## Rules

- $0 spend until revenue. No exceptions without Garrett.
- Never "AI wedding signs". Craft brand only.
- AGPL: Recordly is a tool, not a fork. Don't distribute modified builds.
- Every artifact must serve the loop. If it doesn't find, render, show,
  sell, or cross-sell — it doesn't get built.
