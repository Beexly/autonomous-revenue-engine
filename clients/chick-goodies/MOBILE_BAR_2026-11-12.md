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
- Home gateway (OryzoShell Lineup) — fifth card "Mobile bar → Open bar packages".
  Grid CSS: repeat(5) at >=1440, repeat(3) at 1100-1439 (no orphan row).
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
2. Zola "85 point of view views" is garbled. No Zola number on the site until she confirms
   the wording. Blank beats invented.
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

## Gates run

typecheck clean; catering+holidays 36/36; build clean; playwright full suite (print/a11y/
smoke/viewport/door/security) — see commit message for final counts; audit:live after
deploy; print page count re-verified (bar block added length).
