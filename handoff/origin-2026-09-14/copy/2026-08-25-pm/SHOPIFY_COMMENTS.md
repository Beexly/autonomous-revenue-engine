# Shopify Community comment drafts — 2026-08-25 PM

**SUPERSEDED 2026-08-26. DO NOT PASTE.** Public paste pack is `/workspace/origin-drafts/2026-08-26-cash/COMMENTS_8.md` (Gumroad $19 only). $250 / $500–$1,500 in the bodies below are Lane 1 / old offer. Distro public comments may not use them. Stripe charges_enabled was false.

DRAFTS ONLY. Not posted. Did not log in. Did not create a Shopify Community account. Did not spend.

Verification: each URL below was opened with WebFetch (live Discourse topic, title + OP body present). Public pages; no auth.

Offer (at most one, late, optional): Meta tracking diagnostic $250 / 3 business days, then $500–$1,500 implementation if Meta is the leak. CTA only: Baxley.Garrett@gmail.com and @SignaL_OriginHQ.

---

## 1. Meta pixel fires Purchase twice when customer returns from a payment redirect (Paytrail / Shop Pay / MobilePay) — 1.34 events per order

**URL:** https://community.shopify.com/t/meta-pixel-fires-purchase-twice-when-customer-returns-from-a-payment-redirect-paytrail-shop-pay-mobilepay-1-34-events-per-order/662047

**Verified:** WebFetch 2026-08-25 — live topic, 8 posts, OP table 141 Shopify orders / 189 browser Purchase / 101 CAPI (1–7 Aug 2026), gateway-URL breakdown, questions on checkout_completed remount and 72% CAPI coverage.

**Why it fits:** Pixel + CAPI + event_id + Purchase double-count on the official Facebook & Instagram channel, isolated to Paytrail/Shop Pay/MobilePay redirect return — not a generic “my ads are off” thread.

### Comment

The 1.34 is not a second pixel — you already burned that list — and Maximum versus Enhanced was the wrong lever, which is why the browser ratio moved 1.33 → 1.40 when you flipped it. What the Marketing API URL split is showing is two *browser* Purchase events for one order after a Paytrail or Shop Pay return: the order-status page remounts, `checkout_completed` fires again, the Facebook & Instagram channel mints a fresh event_id, and Meta only collapses events that share event_name + event_id inside the window. Two different IDs on two browser hits never merge, and browser-versus-server dedup cannot eat the extra either, which is why the 41 gateway-URL events (OP, Nordea, MobilePay, shop.app) sit next to a CAPI stream that only covers 101 of 141 orders. The check I run on this exact pattern is a 7-day Meta Purchase count against Shopify orders for the same window, then Test Events on a live bank-redirect checkout watching whether the second fire reuses `checkout.token`. If it does not, the sales channel will not let you pin the ID; you have to own `checkout_completed` in a Customer Events pixel, set event_id to that token on every load, and send the same token from CAPI so both browser fires and the server twin hash to one Purchase. The 0.72 server coverage is the leak that actually hurts delivery — a complete CAPI path still counts the sale when the pixel double-fires or when the return never reloads your domain, and Maximum does not close a 28% hole. If you want that read done for you, I run a $250 Meta tracking diagnostic in 3 business days (Pixel + CAPI, shared event_id, Test Events, Meta-versus-Shopify 7-day count); implementation is $500–$1,500 only if Meta is the leak. Baxley.Garrett@gmail.com / @SignaL_OriginHQ. The token-reuse check still stands if you never write.

**Swap-test:** Dies on a generic Pixel thread. Load-bearing: 1.34 / 141 / 189 / 101, Paytrail gateway-URL extras, checkout_completed remount minting a new event_id, Maximum moving the ratio the wrong way, 72% CAPI hole.

---

## 2. Meta Pixel and Conversions API Deduplication Issues on Shopify

**URL:** https://community.shopify.com/t/meta-pixel-and-conversions-api-deduplication-issues-on-shopify/400958

**Verified:** WebFetch 2026-08-25 — live topic, OP (Dec 2024 official-app install, sudden afternoon diagnostic), quoted Meta banner on identical Purchase events not deduplicated, missing parameters on Purchase / AddPaymentInfo / InitiateCheckout / Search, unmatched content IDs, asks how to add event_id in Shopify.

**Why it fits:** Official Facebook & Instagram app + Pixel/CAPI + event_id + Meta diagnostics for Purchase double-count, plus the unmatched-content-ID companion error that people collapse into “just add event_id.”

### Comment

That afternoon banner is not asking you to paste event_id into theme.liquid. “Identical Purchase events from your pixel code and the Conversions API, but they are not deduplicated” plus missing parameters on Purchase, AddPaymentInfo, InitiateCheckout, *and Search*, plus unmatched content IDs, is three failures sharing one Events Manager card, and stuffing a Liquid order number into `fbq` will not clear all three. I keep seeing the official Facebook & Instagram app run clean for months after a December-style install and then throw this overnight with no theme change: a second origin (leftover `fbq` in the theme, a custom pixel, Elevar / Stape / GTM, or the old Online Store → Preferences pixel) sending Purchase without the app’s event_id, so Meta receives two payloads that look like the same sale and cannot merge them. Search missing a dedup parameter is the leftover-origin tell, because the sales channel’s CAPI path barely bothers with Search. Unmatched content IDs will still be red after event_id starts matching — that is catalog `content_id` versus what ViewContent/Purchase actually send, a separate check. Before anyone writes a custom ID, open Events Manager → Purchase → event-source breakdown and run Test Events on one real checkout: you want one browser row and one server row with the same event_id, then a 7-day Meta Purchase count that sits on Shopify’s order count instead of 1.6–2× it. If those IDs already match and the banner remains, the app’s pairing broke and reconnecting the pixel is cheaper than a GTM rebuild. If they do not match, removing the second source usually clears Purchase / InitiateCheckout / AddPaymentInfo together. I will do that read as a $250 diagnostic in 3 business days (shared event_id, Test Events, Meta-versus-Shopify 7-day); implementation is $500–$1,500 only if Meta is the leak. Baxley.Garrett@gmail.com / @SignaL_OriginHQ. The source-breakdown plus Test Events still answers the banner if you never hire.

**Swap-test:** Dies on a generic double-count thread. Load-bearing: sudden diagnostic after a clean official-app install, Search on the missing-parameter list, unmatched content IDs as a separate catalog problem, do-not-patch-theme-liquid first.

---

## 3. Facebook Conversions API event match quality

**URL:** https://community.shopify.com/t/facebook-conversions-api-event-match-quality/30502

**Verified:** WebFetch 2026-08-25 — live topic, OP implemented Shopify CAPI with Customer data sharing Maximum, Purchase (Browser • Server) scored 7.7/10, later replies 7.9 and 4.6, last reply “abandon the FB app for GTM & SGTM.”

**Why it fits:** Shopify CAPI + Maximum data sharing + Event Match Quality on Purchase, not a Purchase-double-count thread — EMQ is the claim.

### Comment

7.7/10 on Purchase (Browser • Server) with Customer data sharing on Maximum is not a broken pixel and it is not a missing event_id. Event Match Quality is how many hashed customer fields on the payload actually resolve to a Meta account — email, phone, name, fbp, fbc, external_id, IP/UA — and Maximum on the Facebook & Instagram channel is a permission, not a guarantee those fields are populated on every order. I keep seeing native Shopify CAPI land in the 7–8 band when guest checkout, Shop Pay, or the consent banner drops email/phone from the *server* event even though the toggle says Maximum; the browser event can look healthy while the CAPI row that is supposed to recover iOS is the one Meta scores. Open Test Events on a real Purchase and read the parameter list on the server row, not the overview score. If em / ph / fn / ln / external_id are empty or “not matched,” raising EMQ is sending those fields hashed on CAPI with the same event_id the pixel already used, not ripping the app out for GTM. GTM raises EMQ only if you actually pass the PII; the container existing does nothing. Also pull a 7-day Meta Purchase count against Shopify orders before you chase 7.7, because a second pixel that is 1.8× events will sit next to a mediocre match score and the score is not the leak. I diagnose Pixel + CAPI (shared event_id, Test Events field coverage, Meta-versus-Shopify 7-day, EMQ) for $250 in 3 business days; if Meta is the leak, implementation is $500–$1,500. Baxley.Garrett@gmail.com / @SignaL_OriginHQ. The server-row parameter check is the whole first move if you never write.

**Swap-test:** Dies on a double-count or event_id thread. Load-bearing: 7.7/10 Purchase (Browser • Server) under Maximum, EMQ as field match not dedup, server row missing em/ph while the toggle is already Maximum, GTM-does-not-raise-EMQ-by-existing.

---

## 4. Facebook deduplication is not working

**URL:** https://community.shopify.com/t/facebook-deduplication-is-not-working/378447

**Verified:** WebFetch 2026-08-25 — live topic, OP Ads Manager double-counting Purchase *and* AddToCart because browser + server are added, Shopify Facebook & Instagram integration, Diagnostics empty, Test Events screenshot, “I am not a developer,” later reply asking if it was figured out.

**Why it fits:** Pixel + CAPI dual-path adding instead of merging, all events (not just Purchase), official app, no diagnostic banner — the quiet-Diagnostics double-count case.

### Comment

If Ads Manager is adding browser and server together on Purchase *and* AddToCart, and Diagnostics is quiet, you are not looking at the “missing deduplication parameter” warning — you are looking at two event_ids for one action. The Facebook & Instagram app is supposed to mint one ID and stamp it on both the pixel and CAPI; when it does not, Test Events still shows two rows and neither says Deduplicated, which is the screenshot that makes every event 2× Shopify. I do not start with GTM on a store that already has the official integration and is not a developer, because a second implementation on top of a live app is how 2× becomes 3×. Take a 7-day Meta Purchase count versus Shopify orders first so you know the ratio you are trying to return to, then one test order in Test Events: the browser event_id has to equal the server event_id character for character, on Purchase *and* on AddToCart, because a pairing that only matches Purchase will still double the funnel events your ads guy is reading. If the IDs differ, the app is the leak and reconnecting the pixel sometimes rewrites the pairing (it can also drop CAPI for a day, which is why you snapshot the 7-day count first). If they match and Ads Manager still doubles, a leftover theme pixel or another app is firing a third event with no ID. That is the whole diagnostic; GTM is a rebuild, not a first step, and the free-app replies in this thread do not tell you whether your IDs already match. I will run that diagnostic for $250 in 3 business days; $500–$1,500 to implement only if Meta is the leak. Baxley.Garrett@gmail.com / @SignaL_OriginHQ.

**Swap-test:** Dies on a “missing parameter” diagnostic thread or an EMQ thread. Load-bearing: Diagnostics empty, ATC doubled with Purchase, Test Events two rows not marked Deduplicated, not-a-developer so do-not-layer-GTM, 2× becoming 3×.

---

## 5. Events Duplication Meta

**URL:** https://community.shopify.com/t/events-duplication-meta/348557

**Verified:** WebFetch 2026-08-25 — live topic, OP ChrisW3 quoting ads guy “reinstall pixel/CAPI or optimize both,” store www.physioworldshop.co.uk, reply claiming event_id already present via Pixel Helper, later ask where the Test Events Deduplicated view lives.

**Why it fits:** Pixel/CAPI “duplication” as read by an ads manager versus what Test Events actually shows; official-stack event_id; reinstall as the proposed fix.

### Comment

Do not reinstall yet. Your ads person is reading “browser + server” in Events Manager as duplication, which is the intended dual path, and “optimize Pixel/CAPI” as a reinstall, which is how the channel token dies and CAPI coverage falls off for a week. Someone already pulled physioworldshop.co.uk and saw an event_id on the pixel helper; that only proves the *browser* is sending an ID, not that CAPI is sending the same one, and not that Meta is merging them. The check is Test Events on a real Purchase: two rows, same event_id, one marked Deduplicated, then a 7-day Meta Purchase count against Shopify orders — 1.0–1.15× is healthy dual-path, 1.8–2.2× is unmatched IDs or a second pixel. Reinstalling before that comparison throws away the only baseline you have. If Test Events already deduplicates, the ads account is looking at attributed conversions inside the click window, which is not a Shopify pixel bug and will not move when you rip the channel out. If it does not, leave the app in place, kill any second `fbq` or custom pixel, and only then consider owning event_id yourself. The Test Events screen that shows the Deduplicated badge is Events Manager → Test Events on that pixel, during a live checkout, not the overview graph. I diagnose that stack (shared event_id, Test Events, Meta-versus-Shopify 7-day) for $250 in 3 business days; implementation is $500–$1,500 if Meta is the leak. Baxley.Garrett@gmail.com / @SignaL_OriginHQ. The Test Events + 7-day count still answers the ads guy if you never hire.

**Swap-test:** Dies on a missing-parameter or Paytrail-redirect thread. Load-bearing: ads-guy reinstall advice, physioworldshop.co.uk Pixel Helper already showing an event_id, browser ID ≠ proof of CAPI match, “browser + server” is the intended path, where the Deduplicated badge actually lives.

---

**Posted:** no.


---
SUPERSEDED 2026-08-26 evening CT. Do not paste. Canonical Shopify pack is 2026-08-26-cash/COMMENTS_8.md ($19 Gumroad). Public CTA is Gumroad $19 until Stripe charges_enabled.
