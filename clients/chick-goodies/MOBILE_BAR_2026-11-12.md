# Mobile bar + Nov-11 approvals — decision log (2026-11-12)

Tricia's 9:21 AM email (with partner flyer IMG_8161.jpeg) + her Nov 11 answers, executed
autonomously under the best-decision protocol. Garrett relayed both; no further sign-off
was available (she's post-surgery, asked for a rest day).

## What shipped (Vercel site only, charcuterie-chick-table.vercel.app)

- `src/lib/catering.ts` — new `MOBILE_BAR` block: Silver $16 / Gold $19 / Platinum $22 per
  person, 4 hours; cash-bar lines Silver $6/$7/$8, Gold $6/$8/$10, Platinum $7/$10/$14.
  Source: partner flyer front panel, +$2 markup on every per-person number. Zero partner
  branding (no name, phone, email, handle) — enforced by test.
- `/menus/` — new "Mobile bar" section (#bar) after Carts/boards: bold rate line
  "$16 per person · 4 hours" per Tricia's dictate, pours list, cash-bar line, reserve-by-text.
  Static crawl-first twin updated to match (descriptions, JSON-LD ItemList of the 3 tiers,
  body table).
- Home `Services` section — new "03 · Mobile bar" block after full service: three tiers with
  the bold "$16/$19/$22 per person · 4 hours" rate line, cash bars, and a /menus/#bar CTA.
  Side index gains "Mobile bar". (The first attempt went into `Lineup`, which App.tsx never
  renders — dead code. Reverted; verify home copy by grepping the built `main-*.js`.)
- `answers/` — new FAQ "Do you have a mobile bar?" (JSON-LD + visible).
- `public/llms.txt` — Mobile bar section; "Catering Chick" flipped from unapproved working
  name to owner-approved (Nov 11); owners line now "Tricia and Stacey".
- Home about scene — "Tricia and Stacey own and run the kitchen together."
- Tests: 3 new in catering.test.ts (markup rates exact, cash-bar markup, no partner
  branding, four-hour framing). Suite 36/36 before deploy.

## Decisions I made (flag for Tricia's call-back)

1. +$2 applies to cash-bar lines too, not just the three headline rates. Her stated reason
   is a resale markup ("that's not my company"); it covers everything she resells. Reverting
   = one edit in MOBILE_BAR.
2. Zola "85 point of view views" was a dictation mangle, resolved 2026-11-12 per Garrett:
   the line is "85 profile views" (profile -> point of view, views kept). Published as
   "Zola · 85 profile views" in the reviews ledger and "Zola: 85 profile views" in the
   weddings points, live on both Vercel and the Shopify store. audit:live guards it.
3. Bar-only bookings carry no minimum claim in copy ("text Tricia and she will size the
   package"). Whether the 40-guest/$2,500 minimum applies to bar-only events is her call.
4. No menu-book leaf this cycle (two-book DOM is fragile; she asked for a rest day) and no
   Shopify product/admin edits (need her admin access).

## Deliberately NOT touched

- Shopify draft theme / food-menu-page.liquid — sync after her wake-up, so the store menu
  and the Vercel menu carry the bar together.
- The stale `scripts/check-structured-data.mjs` guard: it asserts menus/index.html emits
  zero JSON-LD, but the approved SEO graph has been in that file since the Nov 11 layer
  (pre-existing failure, wired into no npm script, CI never runs it). Left as-is; the guard
  needs a governance decision, not a silent weakening.
- Custom board pricing (stays "on request" — her Nov 11 answer), pie/dessert prices (her
  Nov 11 "All pie and dessert options are here" confirms the existing transcription).

## Gates run (final)

typecheck clean; catering+holidays 36/36; build clean; playwright full suite 47 passed +
2 load flakes (green on solo rerun) + 1 skipped; deploy READY; audit:live 44/44;
live DOM verified on / and /menus/ (both render the bold per-person/4-hour rate);
print spec green (flat menu stays 2 white pages).

Pre-existing repairs made along the way: the two-book merge (Nov 11) had left 16 red
browser specs — a duplicate `<main>` landmark and three h1s per page. Fixed in MenuBook
(`standalone` prop) rather than by relaxing the tests.
