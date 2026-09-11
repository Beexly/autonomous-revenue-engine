# Repo Intel: Commerce + Dropshipping — Code Teardowns (not README reads)

- Date: 2026-09-11
- Method: shallow clones, architecture-revealing files only (manifests, src
  trees, key modules). No exhaustive reads.
- Purpose: identify the exact components to FORK / MINE / SKIP for the
  post-Medusa stack (cinematic storefront → Stripe Checkout → n8n fulfillment
  → Supabase + Resend) and TASK-011 (n8n product-intel pipeline).
- Mirror: this file lives in both `Beexly/agent-bus`
  (`inbox/from-motif/REPO-INTEL-commerce-dropship.md`) and
  `Beexly/autonomous-revenue-engine` (`ops/repo-intel-commerce-dropship.md`).

## The stack: 3 repos

1. **superjack2050/1688-cli — FORK.** The 1688 sourcing + intelligence leg.
   Production-grade anti-bot scraping with agent-friendly JSON output.
   Nothing else in the set comes close. First file for the builder:
   `src/session/search-mtop.ts` — the Offer interface (orderCount,
   repurchaseRate, supplier verification flags) is our scoring rubric's input
   schema, already typed.
2. **ddyy/minshop — MINE.** The $0 commerce core. Lift
   `src/features/payments/` (provider port, Stripe adapter, webhook
   verification) and the secrets vault. First file for the builder:
   `src/features/payments/stripe.ts` — the exact Stripe-on-serverless
   pattern our checkout needs.
3. **kristynamarie99/pod-automation-system — MINE.** The fulfillment chain.
   First file for the builder: `n8n-workflows/04-printify-integration.json`
   — the Printify→Etsy publish call that deletes an entire Etsy API
   integration from the POD lane.

---

## 1. ddyy/minshop — the Cloudflare commerce engine
https://github.com/ddyy/minshop — 137★, MIT, pushed 2026-09-11.

**What it really is:** A full ecommerce engine (not a starter) on Astro +
Cloudflare Workers + D1 + R2: 30 migrations, full admin, theme system, MCP
server, multi-rail payments (Stripe / Lightning / OpenNode / demo) behind a
clean provider port. 7.1MB source. Bigger than the README implies.

**High-leverage components:**
- `src/features/payments/provider.ts` — PaymentProvider port
  (`createCheckout` / `verifyWebhook`); add/remove rails without touching
  checkout code.
- `src/features/payments/stripe.ts` — Stripe adapter using
  `Stripe.createFetchHttpClient()` (required on Workers, no Node HTTP) and
  async WebCrypto webhook verification. The exact serverless-Stripe code we
  need.
- `src/pages/api/webhook.ts` + `src/pages/api/webhook/[provider].ts` —
  provider-agnostic webhook: verify + normalize, persist, email. One
  endpoint per rail (one endpoint can only verify one signature).
- `src/features/secrets/` — encrypted secrets vault (keys in D1 encrypted,
  decrypted only at use). Grepped: no plaintext secrets anywhere.
- `src/features/orders/reservations.ts` — inventory reservation with TTL so
  checkout can't oversell.

**Gotchas:** The storefront is a theme system (30+ theme scripts) — it would
fight our art-directed cinematic bar, not serve it. Lightning/OpenNode rails
are crypto dead weight. The demo provider is always-on (must disable in prod
or customers "buy" for free).

**Verdict: MINE.** Lift `src/features/payments/` + secrets vault. Skip the
storefront and the full engine.

## 2. notrab/headless-dropshipping-starter — the POD webhook pattern
https://github.com/notrab/headless-dropshipping-starter — 847★, NO LICENSE,
pushed 2026-08-25.

**What it really is:** Next 12 storefront; Snipcart (paid cart SaaS) handles
the buy button; a Snipcart webhook fires `src/lib/create-order.ts`, which
maps the shipping address onto Printful's order API. The entire "dropship" is
one webhook handler.

**High-leverage components:**
- `src/lib/create-order.ts` — ~40 lines: webhook payload → recipient object
  → `printful.post("orders", ...)` with `external_variant_id` mapping. Maps
  1:1 to our Stripe-webhook → n8n → Printify/CJ chain; the
  address-normalization logic is directly reusable.

**Gotchas:** Snipcart is paid SaaS — violates the $0 rule, repo-as-base is
dead on arrival. Next 12 / React 17 (2022-era). Only Printful wired. No
error handling on the Printful post — a failed order silently vanishes.

**Verdict: MINE the pattern (`create-order.ts`), SKIP the repo.** Build it
on Stripe webhooks, not Snipcart's.

## 3. itswadesh/svelte-commerce — backend-agnostic storefront
https://github.com/itswadesh/svelte-commerce — 1809★, MIT, pushed 2026-09-09.

**What it really is:** SvelteKit storefront where the backend is one npm
package: `vite.config.ts` resolves a `$connector` alias to
`@misiki/<platform>-connector`; `src/lib/core/connectors/active.ts`
re-exports whatever that package provides. 26 per-backend files collapsed
into one 29-line module. Svelte 5.

**High-leverage components:**
- `src/lib/core/connectors/active.ts` — the cleanest "backend is a plug"
  implementation seen; version-skew-safe (optional hooks via casts).

**Gotchas:** "Stripe Checkout + nothing" is NOT a supported shape — the
connector must implement the full `@misiki/kitcommerce-core/services`
surface (products, cart, checkout, orders). Pointing it at no-backend means
hand-writing a connector against a phantom API: more work than our
architecture needs. Also SvelteKit vs our Next.js/Vercel stack.

**Verdict: SKIP.** Admire `active.ts`; steal nothing structural.

## 4. moh3a/ae_sdk — the AliExpress endpoint map
https://github.com/moh3a/ae_sdk — 69★, MIT, stale (last push 2025-03).

**What it really is:** Typed TypeScript SDK over the AliExpress Open
Platform: `ds_client.ts` (Dropshipper) wraps 12 endpoints,
`affiliate_client.ts` wraps 11, full types in `src/types/`. 2,857 lines.

**High-leverage components:**
- `src/utils/ds_client.ts` — the money endpoints:
  `aliexpress.ds.order.create` (PROGRAMMATIC ORDERING, no browser),
  `aliexpress.logistics.ds.trackinginfo.query`,
  `aliexpress.logistics.buyer.freight.calculate`,
  `aliexpress.ds.product.get`, `aliexpress.ds.recommend.feed.get`,
  `aliexpress.ds.commissionorder.listbyindex`.
- `src/utils/affiliate_client.ts` —
  `aliexpress.affiliate.hotproduct.query` + `hotproduct.download` (the
  intel pipeline's demand feed), `affiliate.link.generate`
  (auto-monetizable links), `product.smartmatch`,
  `featuredpromo.products.get`.
- `src/types/ds.ts` (683 lines) — typed request/response shapes; saves
  hours of doc-reading.

**Gotchas:** Stale 18 months — re-verify every endpoint against current
Open Platform docs before wiring (`ds.image.search` is already commented
out = dead). Review signing logic in `client.ts` against current auth. The
free developer app (Garrett's OAuth) is the gate.

**Verdict: MINE.** The endpoint inventory is the deliverable — the exact
API surface TASK-011's ingest stage needs.

## 5. ndgigliotti/shopify-spy — the products.json trick
https://github.com/ndgigliotti/shopify-spy — 117★, MIT, pushed 2026-04-03.

**What it really is:** Scrapy spider that tries every Shopify store's bulk
`/products.json` endpoint FIRST (free structured JSON nearly every Shopify
store exposes), falls back to sitemap crawling, then per-product `.json`
endpoints. UA rotation only on 403. Also a WooCommerce spider. Clean, tested.

**High-leverage components:**
- `shopify_spy/spiders/shopify.py` (`start()` + `parse_products_json`) —
  bulk-first with graceful fallback chains. The single cheapest
  structured-data source on the web for competitor research.
- `shopify_spy/utils.py` (`find_all_values`) — recursive key extraction
  from nested JSON; dead simple, robust.
- `shopify_spy/middlewares.py` — UA swap only on 403, not every request
  (avoids fingerprinting via UA churn).

**Gotchas / drift relevance:** Fallback chains but no field-shape
validation — if Shopify changes the JSON schema, it emits garbage with
HTTP 200 and nobody notices. Exactly the failure mode TASK-011's
drift-monitoring spec exists for. `products.json` is a platform courtesy,
not a contract — fragile source, needs a canary.

**Verdict: MINE.** The products.json-first pattern is TASK-011's
competitor-research leg. Pair with drift monitoring.

## 6. superjack2050/1688-cli — the most sophisticated repo in the set
https://github.com/superjack2050/1688-cli — 84★, MIT, updated 2026-09-10.

**What it really is:** A full Playwright-driven 1688 buyer agent: persistent
browser profile + warm daemon + direct hits on 1688's internal mtop JSONP API
(appId 32517), QR-code login, cookie identity, per-command throttling with
jitter, navigation guards, recovery flows, stable JSON contracts for AI
agents. 30+ test files.

**High-leverage components:**
- `src/session/search-mtop.ts` — the Offer interface: offerId, price
  min/max, supplier (name, years, verified factory/business/superFactory
  flags), **demand data (orderCount, repurchaseRate)**, P4P flag, service
  tags. Our scoring rubric's input schema, pre-built.
- `src/daemon/throttle.ts` — per-command-type rate limiter: 1,200ms minimum
  gap + up to 1,800ms jitter. Simple, effective anti-bot pacing.
- `src/daemon/` (server, manager, protocol) — warm-session daemon keeps the
  browser alive between commands; author notes this "reduces risk control
  hits" (the answer to the open June 2026 anti-bot issue).
- `src/auth/cookies.ts` — identity from `unb`/`tracknick` cookies; session
  verification without re-login.
- `src/session/recovery.ts` + `navigation-guard.ts` — structured recovery
  from bot-checks and nav failures (typed failure handling, matching the
  TASK-011 spec).

**Gotchas:** Drives a real browser — needs a VM with Playwright + Chromium,
not serverless-friendly. Login is QR-code (Garrett scans once, session
persists). 1688 risk-control is genuinely aggressive; daemon + throttle +
jitter is mitigation, not immunity. Checkout commands exist but placing real
orders autonomously needs Garrett's explicit order-by-order approval per
standing rules.

**Verdict: FORK.** The 1688 sourcing + intelligence leg, production-grade,
actively maintained, MIT.

## 7. kristynamarie99/pod-automation-system — the n8n POD chain
https://github.com/kristynamarie99/pod-automation-system — 10★, MIT, updated
2026-09-06.

**What it really is:** Four n8n workflows (webhook-triggered): Slack command
handler → Claude AI agent (tool-workflows for design gen + status) → image
gen pipeline (prompt-enhance → image gen → quality-check → Airtable → Slack)
→ Printify integration. Airtable CSV schemas for the whole state machine.

**High-leverage components:**
- `n8n-workflows/04-printify-integration.json` — THE find: upload image →
  create Printify product → **publish to Etsy THROUGH Printify's API**
  (`/v1/shops/{id}/products/{id}/publish.json`). No Etsy API integration
  needed — Printify's existing Etsy connection does it. Collapses the POD
  lane's hardest integration to one HTTP call.
- `n8n-workflows/02-ai-agent.json` — tool-workflow agent pattern: n8n
  sub-workflows exposed as agent tools with window-buffer memory. Clean
  pattern for the intel pipeline's agent layer.

**Gotchas:** Hard deps on Anthropic Claude API (paid after $5 free),
Airtable (another silo), Slack bot, Gemini image API (free tier via AI
Studio — confirm). For our $0 stack: swap Claude → Gemini free tier,
Airtable → Supabase.

**Verdict: MINE.** The Printify→Etsy publish chain deletes an entire
integration. Adopt the tool-workflow agent pattern; swap the paid parts.

## 8. dachengzi065-gif/marketeye — the tiny monitor
https://github.com/dachengzi065-gif/marketeye — 1★, MIT, pushed 2026-06-16.

**What it really is:** 1,244-line Python price monitor: httpx +
BeautifulSoup with regex price/stock extraction (multi-currency, EN+CN),
SQLite snapshot store (`products` + `price_snapshots`), async check engine
with change detection, email + webhook alerts, web dashboard, CSV export.

**High-leverage components:**
- `core/scraper.py` — `PRICE_PATTERNS`/`STOCK_PATTERNS` regex sets covering
  $, ¥, €, £, ฿, ₩, ₽, ₹, 元 + `raw_hash` per page for content-change
  detection.
- `core/engine.py` — check loop: fetch → parse → compare vs latest snapshot
  → `CheckResult` with `price_changed`/`stock_changed`/`content_changed`.
  The right minimal model for TASK-011's monitor stage.
- `core/database.py` — sqlite-utils schema with per-product CSS selector
  overrides (per-site customization without code changes).

**Gotchas:** Single hardcoded UA, no proxy support, no field-shape
validation (snapshot-only = the silent-drift failure mode), email needs
SMTP config. A personal tool, not production infra — but the patterns are
sound.

**Verdict: MINE the patterns** (snapshot schema, regex extraction sets,
change-detection flags). Needs drift-monitoring, UA rotation, multi-source
upgrades before pipeline-grade.

---

## Adoption map for the builder (Hermes)

| Repo | Verdict | Take |
|---|---|---|
| 1688-cli | FORK | 1688 sourcing + intel leg. Read `src/session/search-mtop.ts` first. |
| minshop | MINE | `src/features/payments/` + secrets vault. Read `src/features/payments/stripe.ts` first. |
| pod-automation-system | MINE | `n8n-workflows/04-printify-integration.json` (Printify→Etsy publish). Swap Claude→Gemini, Airtable→Supabase. |
| ae_sdk | MINE | Endpoint inventory for TASK-011 ingest. Re-verify endpoints (stale Mar 2025). |
| shopify-spy | MINE | products.json-first competitor research + drift monitoring. |
| marketeye | MINE | Snapshot/alert monitor patterns for TASK-011 monitor stage. |
| headless-dropshipping-starter | MINE pattern / SKIP repo | `src/lib/create-order.ts` webhook→fulfillment template. Snipcart is paid — dead as a base. |
| svelte-commerce | SKIP | Wrong framework; connector abstraction heavier than our needs. |

## Standing constraints (unchanged)
- $0 rule: nothing paid moves in until its lane pays for it twice.
- No autonomous order placement — Garrett approves orders explicitly.
- No counterfeit/brand-adjacent goods, ever (the Pandabuy lesson).
- QR-code login for 1688 is Garrett's one scan; session persists after.
