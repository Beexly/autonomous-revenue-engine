# Marketing Audit — parked Origin drafts + live offer URLs
2026-08-26 evening CT · Overall score: 53/100
Basis: Marketing AGI `audit.md` + `audit-rubric.md` (local copy `/workspace/origin-drafts/marketing-agi/`) plus `social.md` + `slop-patterns.md` for X/Shopify paste bodies. Own-site register. Scores are heuristics, not measured conversion.

Inspected:
- `/workspace/origin-drafts/2026-08-25-pm/X_ROOTS.md`
- `/workspace/origin-drafts/TUESDAY_ROOT.md`
- `/workspace/origin-drafts/SHOW_HN.md`
- `/workspace/origin-drafts/2026-08-26-cash/COMMENTS_8.md` (canonical $19)
- `/workspace/origin-drafts/2026-08-25-pm/SHOPIFY_COMMENTS.md` (stale $250)
- `/workspace/origin-drafts/any-money/X_ENGAGEMENT_DRAFTS.md`
- https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook (live $19, InStock)
- https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/meta-tracking-audit.html (still lists $250 / $500–$1,500)

Not inspected: Ads Manager, Gumroad analytics, whether any Shopify comment was actually posted. Those are unknown, not fails.

STOP at the brief. Distro did not rewrite the eight comments. Did not post. Did not spend. Did not email. Did not touch paid ads.

## The one thing
The live SKU is a $19 workbook. The parked pile still argues like three companies: a $19 Gumroad, a $250 diagnostic with a dead card path, and a qi-check/conformal tools show. A stranger cannot tell in five seconds which of those @SignaL_OriginHQ is. COMMENTS_8 is the only pack that matches the live checkout. Everything else is leaking into the old offer or a second product.

## Scorecard
All scores 0-100 bands from `audit-rubric.md`. Weighted total = 0.25·58 + 0.20·47 + 0.20·42 + 0.15·71 + 0.10·43 + 0.10·55 = 52.75 → **53**.

| Dimension | Score | Weight | Weighted | Verdict |
|---|---|---|---|---|
| Messaging & positioning | 58 | 25% | 14.5 | Leaking. Mechanism is sharp; offer identity is not. |
| Conversion | 47 | 20% | 9.4 | Two primary CTAs on the offer page; unposted drafts convert nothing. |
| Search & discoverability | 42 | 20% | 8.4 | Gumroad is the only real listing. githack is a raw file. Drafts are not indexed. |
| Competitive position | 71 | 15% | 10.65 | Strong. Named GTM/Stape/Elevar/theme `fbq`. Refuses the retainer. |
| Trust & credibility | 43 | 10% | 4.3 | Houston + not-Meta is fine. Zero named customers. "$5k+/month" is uncited. |
| Growth & retention | 55 | 10% | 5.5 | $19 → diagnostic → implementation exists on paper. Stripe path is dead. |

## Fix these first

### 1. One public offer in every paste body
Kill $250 / $500–$1,500 / buy.stripe.com from anything Distro would paste. Canonical: Gumroad $19.

Replacement for the Fri Aug 28 X root (was the $250 diagnostic). Do not post until APPROVE:

I will not take a 90-day media-buying retainer to find out whether Pixel and CAPI are double-counting. The 90-minute workbook is $19: 15 checks, dedup, EMQ, delivery, fix-priority, no code. https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook — Baxley.Garrett@gmail.com / @SignaL_OriginHQ. Houston. Not affiliated with Meta.

Effort: S. Confidence: high.
Stale files to stamp SUPERSEDED, not paste: `2026-08-25-pm/SHOPIFY_COMMENTS.md`, `X_ROOTS.md` Fri block, githack "Done-for-you $250" until Stripe `charges_enabled`. Distro does not edit Factory HTML tonight.

### 2. One project in the public comments
qi-check and conformal-lite stay in the tools pack / Show HN. They do not ride inside Pixel threads. COMMENTS_8 already obeys this. Do not mix.

Effort: S. Confidence: high.

### 3. Shopify pastes: keep the first line, cut the lecture
`social.md`: first line is 80%. COMMENTS_8 first lines are good. The bodies are 200+ words of operator essay plus the offer. Brief, not a rewrite of all eight — one skeleton:

PageView on that missing-parameter list is the tell. The official channel does not send PageView over CAPI, so the banner is almost never "Shopify forgot event_id." It is a second browser origin. Test Events on one real checkout: one browser row, one server row, same event_id, then a 7-day Meta Purchase count against Shopify orders. Workbook if you want the 15 checks written down: https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook

Effort: M (apply skeleton to the other seven only if Garrett wants a second pass). Confidence: med.

### 4. Offer page CTA hierarchy (brief for Factory, Distro does not ship)
githack currently puts $19 and $250 as peer "Buy now / Done-for-you." Rubric caps conversion at 50 when the primary CTA is not one thing. Replacement above-the-fold:

Your Meta ads are being billed on broken data.
$19 workbook — 15 checks, 90 minutes, no code.
[Add to cart on Gumroad]

Park $250 as "email after Stripe is live," not a sibling button, until charges_enabled.

Effort: S for Factory. Confidence: high. Distro stopped at this brief.

### 5. Proof or delete
Replace "If you spend $5k+/month… four-figure annual leak" with a checkable line or cut it.

Replacement if no customer:

If Meta Purchase for seven days is 1.6× your Shopify order count, you are usually looking at two event_ids for one order. The workbook is how you prove that in Events Manager before you touch the theme.

Effort: S. Confidence: high. [NEED: a named store before any % leak claim.]

## What's already working
- COMMENTS_8 first lines are operator sentences, not "What if there were a better way?"
- Dedup mechanism is specific enough to fail a swap-test (event_id vs custom-data `event_id`, PageView as leftover-pixel tell).
- Live Gumroad title names the outcome. InStock. $19. No code.
- Engagement queue has a voice. X roots Wed (zero offer) is the right shape for an APPROVE day.

## Slop pass (parked prose)
COMMENTS_8: not empty-intensifier slop. Risk is metronomic length and reflexive "I keep seeing." Pass as operator register, fail as feed posts if pasted to X unchanged.
X_ROOTS Wed: pass. Specific, uneven, falsifiable.
X_ROOTS Fri: fail on offer truth, not on slop.
SHOW_HN: pass. Names Hold 9.2 and will-not-write.
Engagement drafts: pass the bar test. Stay on the desk.

## Full findings
Messaging: stranger understands Pixel+CAPI workbook on Gumroad. Stranger looking at the draft folder also sees qi-check, conformal-lite, and $250. Automatic 60-cap logic ("headline names audience or outcome") is satisfied by Gumroad and violated by the pile. 58.

Conversion: Gumroad Add to cart is a real CTA. Unpublished comments convert 0. Offer page splits the fold. 47.

Search: no Origin domain in this audit. Gumroad listing is the indexable page. githack will not rank. 42.

Competitive: refuses GTM-first, names the leftover pixel, refuses the retainer. Hard to copy if we keep doing it. 71.

Trust: no customers, no Origin-measured 7-day ratio we can cite. Honesty about qi-check 8.3 is the wrong product's proof. 43.

Growth: upgrade path is written on githack and unusable on Stripe. Free 15-point checklist is the one acquisition surface that is live. 55.

## Appendix
- Do not copy fabric/Holt/WhatsApp/VERA/Grokularity-write. Out of scope.
- Paid-ads module not run (no spend, no live campaigns).
- Email module not run (Distro does not email).
- Copy module not run past the replacement lines above (stop at the brief).

## What I couldn't determine
- Gumroad views, conversion rate, or any sale.
- Whether Master/Garrett already posted any of COMMENTS_8.
- Current Stripe `charges_enabled` (last Distro fact: false, 2026-08-26).
- A named customer or a first-party 7-day Meta-vs-Shopify ratio.
- X reach (no X API, nothing posted).
