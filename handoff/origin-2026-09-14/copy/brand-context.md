# Brand context
Signal Origin — filled 2026-08-26 CT by Origin Distro from parked drafts + live Gumroad.
Marketing AGI template. Every module reads this.

---

## Product
What it is, in one sentence a stranger would understand:
A $19 fill-in-the-blanks workbook that finds why a Shopify store's Meta Pixel and CAPI numbers do not match real orders.

What it actually does (the mechanism, not the promise):
15 checks in four parts: deduplication (shared event_name + event_id), Event Match Quality, delivery health, fix-priority matrix with a before/after evidence record. 90 minutes. No code to run the checks.

What it does NOT do:
It does not buy ads, set budgets, run media, touch production pixels, write code, or process card charges on Stripe until onboarding is done (`charges_enabled` was false 2026-08-26). It is not a qi-check post scorer. It is not conformal-lite. Sports/DFS is not in the service.

## Audience
Who buys it:
Shopify store owners and marketers who already spend on Meta and can see Events Manager, and who are not technical enough to want GTM as the first move.

What they believe before they arrive:
The Facebook & Instagram channel is "Connected," so tracking is fine. Or GTM/Stape/Elevar will fix a banner about missing dedup parameters.

What they worry about at 2am:
Ads Manager Purchase is 1.6–2× Shopify orders (or half of them), CPA looks insane, they do not know if the leak is the pixel or the ads.

What they'd use instead if you didn't exist:
Paste event_id into theme.liquid, add a second pixel through GTM, hire a media buyer, or ignore the Meta banner.

## Positioning
The one thing true about us that a competitor could not also say:
We refuse the 90-day media retainer until Test Events on a real checkout shows one browser row and one server row with the same event_id, and a 7-day Meta Purchase count sits on Shopify's order count.

Category we compete in:
Shopify Meta Pixel + CAPI measurement / tracking audit. Not creative. Not media buying.

Named competitors:
GTM + sGTM rebuilds, Stape, Elevar, AdNabu, leftover `fbq` in theme.liquid, "just reconnect the pixel."

## Proof
Numbers we can cite (with source and date):
- Live SKU 2026-08-26: https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook — $19, InStock, 121 KB, 3 pages. Title: "The Meta Tracking Audit Workbook — find the Pixel+CAPI defects inflating your ad costs."
- Public repo: https://github.com/Beexly/autonomous-revenue-engine
- qi-check Hold floor 9.2 is a different product (static page on githack). Do not mix into Pixel comments.

Named customers we're allowed to name:
[NEED: none on file]

Claims that need legal sign-off:
"Four-figure annual leak" and "$5k+/month" on the githack offer page. [NEED: a named store, or delete.]
Not affiliated with Meta.

## Voice
How we sound:
Dry operator. Decision in line one. Full sentences. Specific (event_id, Test Events, 7-day count). Swap-test: if you could paste it on any agency account, kill it.

How we never sound:
"Unlock growth." Media-buyer swagger. Sports. Generic Pixel Helper tutorials. "Thoughts?"

Words we always use:
event_id, Test Events, Events Manager, browser vs server, 7-day Meta Purchase vs Shopify orders, leftover pixel / second origin.

Words we never use:
seamless, unlock, supercharge, journey, leverage, world-class, DFS, sportsbook.

## Constraints
Regulatory or legal limits:
Not affiliated with or endorsed by Meta Platforms, Inc. Houston. Independent.

Anything off-limits:
Do not publish without Garrett APPROVE. Do not spend. Do not buy X API. Do not email anyone except Baxley.Garrett@gmail.com for BLOCK / FAKE-EDGE / OWNER_GATE. Do not paste buy.stripe.com while charges_enabled is false. One in-thread offer max: the $19 Gumroad workbook. $12 tracker and $9 checklist stay out. No sports. Distro drafts only.
