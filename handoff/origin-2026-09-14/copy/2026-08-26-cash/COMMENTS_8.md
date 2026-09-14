# 8 paste-ready outbound comments — Gumroad $19 — 2026-08-26 CT

DRAFTS ONLY. Distro did not post. Did not log in. Did not spend. Did not publish X (still APPROVE).

**Stripe card path is dead until onboarding. Do not use buy.stripe.com in these.**

**Offer (one):** The Meta Tracking Audit Workbook, $19, in stock.
**URL (verified 2026-08-26, HTTP 200, InStock, 121 KB / 3 pages):** https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook
**What it is (from the live page):** 90-minute fill-in-the-blanks audit. 15 checks across four parts: deduplication, Event Match Quality, delivery health, fix-priority matrix. No code needed to run the checks.
**CTA:** Gumroad link + Baxley.Garrett@gmail.com / @SignaL_OriginHQ
**No $250. No $500–$1,500. No Stripe. No sports. No second SKU ($12 template / $9 checklist stay out of these threads).**

**Surface:** 8 Shopify Community Pixel/CAPI/event_id threads (same URLs as COMMENTS_8.md). HN last 14d had 0 Pixel/CAPI stories. Reddit blocked.

---

## 1. Shopify — HELP PLEASE! Purchase Event missing some Deduplication Parameters

**URL:** https://community.shopify.com/t/help-please-error-purchase-event-missing-some-deduplication-parameters-for-fb-pixel/400965
**Verified:** live topic, Mar 2025, 6 posts, 689 views. OP LozLSP quoted Meta banners on Purchase / AddToCart / InitiateCheckout / **PageView** missing a dedup key, “none of the solutions make any sense,” not technical. Replies jump to GTM datalayer + AdNabu.
**Pixel/CAPI/event_id:** YES — Gumroad $19 attached.
**Paste:**

PageView on that missing-parameter list is the tell. The official Facebook & Instagram channel does not send PageView over CAPI, so a “Purchase Event Missing Deduplication Parameter” card that also names PageView is almost never “Shopify forgot event_id.” It is a second browser origin (leftover `fbq` in theme.liquid, a custom pixel, GTM, Elevar/Stape, or the old Online Store → Preferences pixel) firing PageView/ATC/Purchase with no ID while the app already sends Purchase + CAPI with one. Meta then shows identical events that cannot merge. GTM is the wrong first move on a store whose owner already said they are not technical: a second implementation on top of a live sales channel is how 2× becomes 3×. Before anyone pastes `eventID: 'UNIQUE_EVENT_ID'` into the theme, open Events Manager → Purchase → event-source breakdown and run Test Events on one real checkout. You want one browser row and one server row with the **same** event_id, character for character, and a 7-day Meta Purchase count that sits on Shopify’s order count instead of 1.6–2× it. If the IDs already match, reconnecting the pixel (snapshot the 7-day first) is cheaper than a datalayer rebuild. If they do not, removing the second origin usually clears Purchase / ATC / InitiateCheckout together; PageView going quiet is how you know the leftover died. The 15-check workbook I use for this exact banner (dedup, EMQ, delivery, fix-priority, no code to run the checks) is $19: https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook — Baxley.Garrett@gmail.com / @SignaL_OriginHQ. The source-breakdown plus Test Events still answers the banner if you never buy.

---

## 2. Shopify — Purchase Event from the Server are not Deduplicated

**URL:** https://community.shopify.com/t/purchase-event-from-the-server-are-not-deduplicated/401366
**Verified:** live topic, Mar 2025, 7 posts, 930 views. OP esala25: Meta notice “Purchase Event from the Server are not Deduplicated,” asks if it hits sales. Later reply: same banner on AddToCart, InitiateCheckout, Purchase, **and ViewContent**. Replies say “add event_id in Shopify settings” (there is no such field) and that it will not lower sales.
**Pixel/CAPI/event_id:** YES — Gumroad $19 attached.
**Paste:**

That banner is not asking you to find an event_id field in Shopify settings. There isn’t one. “Purchase Event from the Server are not Deduplicated” means Meta received a server Purchase and a browser Purchase whose event_id did not match, so it added them. When the same card then shows up on AddToCart, InitiateCheckout, **and ViewContent**, it is not a Purchase-only pairing bug: a second origin is sending the whole funnel without the app’s ID. ViewContent on a server-not-deduplicated list is the leftover-pixel tell, because native Shopify CAPI barely bothers with ViewContent. It will not cut the orders that already happened. It **will** make Ads Manager think you are converting at ~2×, which is how budgets scale into a hole. Do not start with GTM on a store that already has the Facebook & Instagram channel. Take a 7-day Meta Purchase count versus Shopify orders so you know the ratio, then one test order in Test Events: browser event_id has to equal server event_id on Purchase **and** on AddToCart. If they differ, reconnecting the pixel sometimes rewrites the pairing (it can drop CAPI for a day, which is why you snapshot first). If they match and the banner remains, a leftover theme pixel or another app is firing a third event with no ID. I keep those checks in a $19 workbook (15 fill-in-the-blank items, dedup first): https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook — Baxley.Garrett@gmail.com / @SignaL_OriginHQ. The Test Events ID match still closes the banner if you never buy.

---

## 3. Shopify — Some conversions are not showing up (20 recorded, 11 in Meta)

**URL:** https://community.shopify.com/t/meta-ads-conversion-tracking-issue-some-conversions-are-not-showing-up/397264
**Verified:** live topic, Feb 2025, 16 posts, 1.2k views. OP: 20 conversions recorded, 11 in Business Manager; CAPI “connected partner (Shopify)”; Automatic Advanced Matching on; **Facebook code pasted in theme.liquid after `<head>`**; Pixel Helper green on a 100% discount test; PayPal Express Pixel Helper miss (~4 PayPal); some purchases never appear after 72h–a week. Thread later asks “did you able to fix” with no close.
**Pixel/CAPI/event_id:** YES — Gumroad $19 attached.
**Paste:**

The 20-versus-11 is two different problems sharing one thread, and the theme.liquid paste is the one I would kill first. You already have Shopify as the connected CAPI partner **and** a manual pixel in the theme. That is two browser origins. Pixel Helper going green on a 100% discount checkout only proves *a* Purchase fired in that browser, not that Ads Manager received one event_id, and it cannot see the server twin at all. PayPal Express leaving the store is a CAPI problem, not a Helper problem: Helper will miss the thank-you page, CAPI should still land the order if the sales channel is actually sending. Four PayPal checkouts do not explain nine missing purchases, so the rest is either (a) Meta-attributed purchases versus all Shopify orders — different windows — or (b) CAPI stale after the channel looked “connected.” Before anyone stands up a second pixel through GTM (the Facebook-officer advice in this thread is how you get 2× on the events you *do* catch), open Purchase in Events Manager and read last-received time on the **server** row, EMQ on that row, and a 7-day Meta Purchase count against Shopify orders for the same dates. If the server is hours behind, reconnect the Facebook & Instagram channel (snapshot first) and delete the theme.liquid `fbq`. If server is live and the gap is still ~11/20, Test Events on a real PayPal Express order is the next screenshot, not a datalayer. The workbook I use for that pass is $19, 15 checks, no code: https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook — Baxley.Garrett@gmail.com / @SignaL_OriginHQ. The server last-received plus the 7-day ratio still answers it if you never buy.

---

## 4. Shopify — Remove duplicate purchase events in Meta Pixel

**URL:** https://community.shopify.com/t/remove-duplicate-purchase-events-in-meta-pixel/398470
**Verified:** live topic, Mar 2025, 5 posts, 984 views. OP Jinyoung: duplicate Purchase, “I need to add event_id to the payload.” Replies put `event_id` **inside** the custom-data object (`{ value, currency, event_id: '{{ order.order_number }}' }`), which Meta does not use for dedup, and pitch AdNabu.
**Pixel/CAPI/event_id:** YES — Gumroad $19 attached.
**Paste:**

The screenshot is right that you need an event_id. The copy-paste in this thread is putting it in the wrong place. Meta dedupes on the **option** `eventID` (fourth argument to `fbq`), not a custom-data key named `event_id`. This:

`fbq('track', 'Purchase', { value: 100, currency: 'USD', event_id: '{{ order.order_number }}' })`

never reaches the dedup table. This does:

`fbq('track', 'Purchase', { value: 100, currency: 'USD' }, { eventID: '<same string CAPI sends>' })`

On a Shopify store with the Facebook & Instagram app already sending CAPI, you usually should **not** add either one. The app is supposed to mint one ID and stamp it on pixel + server. A payload you add in the theme or in Additional Scripts is a second Purchase with a different ID, which is how the duplicate warning started. Check Events Manager → Purchase → event-source breakdown before you write Liquid. If you already have Browser + Server from the sales channel **plus** a theme/GTM fire, delete the extra fire; do not “fix” it by stuffing an order number into custom data. Then Test Events on one order: one browser row, one server row, same event_id, 7-day Meta Purchase count on Shopify’s order count. I keep that sequence as a $19 fill-in workbook (dedup is part 1 of 4): https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook — Baxley.Garrett@gmail.com / @SignaL_OriginHQ. Deleting the extra fire still comes first if you never buy.

---

## 5. Shopify — Pixel “Connected” but Purchase not firing (Feb 2026)

**URL:** https://community.shopify.com/t/meta-pixel-shows-connected-in-shopify-but-purchase-event-is-not-firing-in-events-manager-ads-manager/588255
**Verified:** live topic, 2026-02-13, 4 posts, 665 views. OP Wiley22: Shopify Admin shows pixel **Connected**; Events Manager “No recent activity” / Purchase not appearing; Ads Manager not attributing; InitiateCheckout / AddToCart possibly missing too. Replies: Maximum + CAPI may have silently disconnected; one reply wants two pixels (GTM + native).
**Pixel/CAPI/event_id:** YES — Gumroad $19 attached.
**Paste:**

“Connected” in Shopify is a channel-token status, not a statement that Events Manager has received a Purchase this week. I keep seeing the Facebook & Instagram app sit on Connected while the **server** last-received time on Purchase is days old — CAPI token died, browser events are getting eaten by ITP/adblock, and Ads Manager has nothing to attribute. Two pixels (GTM plus native) is the opposite of a first move on a dataset that is already dark: you will not know which origin is empty. Test Events on one real paid order, incognito, and read three things: did a browser Purchase arrive, did a server Purchase arrive, do they share event_id. If both are missing, Maximum data sharing + reconnect the sales channel (snapshot any 7-day counts first; reconnect can drop CAPI for a day). If browser arrives and server does not, the partner integration is the leak, not the theme. If neither arrives, look for a leftover `fbq` **and** the app both installed, or a consent banner swallowing Customer Events. Then a 7-day Meta Purchase count versus Shopify orders so you know whether you are debugging “zero” or “under-count.” Those checks are in a $19 workbook (delivery-health plus dedup, no code to run them): https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook — Baxley.Garrett@gmail.com / @SignaL_OriginHQ. Test Events plus last-received on the server row is the whole first screenshot if you never buy.

---

## 6. Shopify — Duplicate number of orders for 3 months (same value)

**URL:** https://community.shopify.com/t/problem-with-duplicate-number-of-orders/409410
**Verified:** live topic, 2025-04-18, 2 posts, 40 views. OP Zinabyounis: Meta Ads Manager duplicate order **count** for 3 months; **value matches one order**; Shopify count is correct. One reply: Test Events, two event_ids, leftover theme pixel + native/CAPI app.
**Pixel/CAPI/event_id:** YES — Gumroad $19 attached.
**Paste:**

Same value, doubled count, for three months, with Shopify’s order number correct, is not a catalog or EMQ problem. Meta is counting two Purchase events per order and keeping one order’s value on each, which is exactly what happens when browser + server land without a shared event_id, or when a leftover theme pixel fires a second browser Purchase with a new ID. Three months means this is not a one-day reconnect glitch. Test Events on a fresh order: if you see two rows with **different** event_ids, that is the whole diagnosis. The usual pair is Facebook & Instagram channel (pixel + CAPI, one ID) plus a hardcoded `fbq` in theme.liquid / checkout additional scripts / a second CAPI app (different ID). Delete the extra origin; do not add a third via GTM. Then a 7-day Meta Purchase count against Shopify orders — you want ~1.0×, not 2.0× — and a screenshot of Test Events showing Deduplicated on the server row. I keep that as a $19 workbook (part 1 is the double-count checks): https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook — Baxley.Garrett@gmail.com / @SignaL_OriginHQ. The two-ID screenshot still diagnoses it if you never buy.

---

## 7. Shopify — Meta conversions showing Unknown/Direct after reconnect (best month)

**URL:** https://community.shopify.com/t/how-to-fix-shopify-conversion-tracking-issues-with-meta-ads/568438
**Verified:** live topic, Sep 2025, 4 posts, 2.1k views. OP: ~7 days ago Shopify started tagging Meta conversions as Unknown/Direct; Meta still sees the paid conversions; store was **disconnected and reconnected**; UTMs rewritten; campaigns moved website-only after Shop checkout deprecation; “best month ever” looks like a tank in Shopify analytics heading into BFCM. Replies name Pixel/CAPI token reset and missing dedup after reconnect.
**Pixel/CAPI/event_id:** YES — Gumroad $19 attached.
**Paste:**

Shopify Analytics saying Direct/Unknown while Meta still claims the sale is not proof CAPI is healthy. After a disconnect/reconnect, the usual failure is a **new** pixel/CAPI token alongside leftovers: two datasets, or one dataset with two origins that no longer share event_id. UTMs do not create Meta Purchase events, and they will not duplicate them; they also will not repair a token that reset. Before Triple Whale, check Events Manager on the dataset Shopify thinks it is sending to: last-received on the **server** Purchase row, whether Browser+Server still says Deduplicated, EMQ on that row, and a 7-day Meta Purchase count versus Shopify orders for the same window. If server last-received died at the reconnect date, the channel token is the leak — one pixel, Maximum data sharing, reconnect once, snapshot first. If server is live and Shopify still cannot see Meta as the source, that is `fbclid`/landing-domain loss into checkout, a different ticket from double-counting. Do not stand up a second pixel to “backup” the one that just came back; that is how the 2× starts the week you needed a clean BFCM baseline. The workbook I run after a reconnect is $19 (dedup + delivery health + a before/after evidence record): https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook — Baxley.Garrett@gmail.com / @SignaL_OriginHQ. Last-received versus the reconnect date still tells you which ticket it is if you never buy.

---

## 8. Shopify — Meta 2–3× purchases (325 partner integration vs 190 Shopify)

**URL:** https://community.shopify.com/t/meta-has-2-3x-times-purchases-shopify-data-in-meta-is-wrong-and-i-need-help-to-fix-it/404737
**Verified:** live topic, Apr 2025, 4 posts, 249 views. OP bieco_spielware, official Shopify Facebook app. **Partner integration: 325 purchases in last 7 days. Shopify: 190.** Screenshot attached. Over-reporting, not under-count.
**Pixel/CAPI/event_id:** YES — Gumroad $19 attached.
**Paste:**

325 in the partner-integration card against 190 Shopify orders is 1.71×, not “Meta is a bit high.” The partner-integration number is what Shopify’s Facebook & Instagram channel is sending as Purchase (browser + server). When that sits ~1.7× on real orders, Meta is not inventing sales — it is failing to merge two payloads per order. Same event_name without the same event_id, inside the window, counts twice. Test Events on one order: two rows with different IDs, or two browser hits plus a server hit, is the screenshot that matches 325/190. Do not optimize to the 325. Do not add GTM on top of a live official app. Pull a clean 7-day Shopify order count (you already have 190), then Events Manager → Purchase → event-source breakdown and look for a second origin (theme `fbq`, custom pixel, another CAPI app). Remove it, then re-run Test Events until browser and server share one event_id and the 7-day ratio falls toward 1.0×. The $19 workbook is built for that 325/190 class of defect (dedup first, then a fix-priority matrix): https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook — Baxley.Garrett@gmail.com / @SignaL_OriginHQ. The 325/190 ratio plus Test Events IDs still close it if you never buy.

---

## Operator notes (not for paste)

- Kill COMMENTS_8.md Stripe CTAs. Do not paste those.
- All 8 are Pixel/CAPI/event_id → Gumroad $19 allowed. No Stripe.
- One offer. No sports. No $12 / $9 SKUs in-thread.
- Did not post. X still APPROVE.
- Path: `/workspace/origin-drafts/2026-08-26-cash/COMMENTS_8_GUMROAD.md`
