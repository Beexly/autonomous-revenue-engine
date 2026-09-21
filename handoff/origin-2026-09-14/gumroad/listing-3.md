# Gumroad listing 3 — draft (do not publish from this file)

**Status:** artifact ready. Listing not created on Gumroad. Paste into signalorigin.gumroad.com → New product.

**Upload file:** `/workspace/gumroad/event-id-parity-checklist.pdf`  
**Printable source (optional extra file):** `/workspace/gumroad/event-id-parity-checklist.html`

**Suggested permalink:** `event-id-parity-checklist`  
**Public URL once live:** `https://signalorigin.gumroad.com/l/event-id-parity-checklist`

**Category:** Software and tech / Spreadsheets and templates (or “Other” if closer to a printable worksheet)

**Cover:** reuse Signal Origin mark + title on white; no sports imagery. One-line on cover: “Pixel vs CAPI · shared event_id · 7-day Shopify count.”

---

## Title

Pixel vs CAPI event_id Parity Checklist — stop Shopify orders from counting twice

## Price

$9

## Description (paste into Gumroad)

The one-page field sheet that tells you whether Meta is counting each Shopify order once or twice.

Print it. Fill it. In one sitting you (1) copy the Pixel `eventID` and the CAPI `event_id` from Events Manager Test events and mark ten Pass / Fail / N-A checks, then (2) pull the last full seven calendar days of Meta Purchases against Shopify paid orders on the count sheet. Meta only merges browser and server events when `event_name` and `event_id` match. Same purchase, two ids = two conversions = a CPA that is a lie.

Written for Shopify stores running Meta ads. No code required to run the checks. The classic failure this sheet is built for: native Shopify Pixel (or the Facebook & Instagram channel) plus a separate CAPI app, each inventing its own ids. Overview shows Browser and Server; dedup is 0%; budget scales into fiction.

What you get:

- How Meta actually dedupes (`eventID` on Pixel, `event_id` on CAPI, identical string, do not hash it)
- Where to read both values in Test events, plus blanks for this store’s Pixel source / CAPI source
- A 10-point parity checklist with evidence cells — including the Shopify single-stack check and the EU/UK consent-declined repeat
- Pull instructions for Ads Manager and Shopify Analytics (same 7 dates, same timezone, same attribution window)
- A 7-day Meta vs Shopify count + revenue table and a read of Δ %: ±5–15% is modeling, 30%+ high is double-counting, far low is delivery

Pairs with the deeper tools, does not replace them:

- Full 90-minute audit: [The Meta Tracking Audit Workbook](https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook) ($19)
- Ongoing weekly log: [Meta Ads Tracking & Reconciliation Tracker](https://signalorigin.gumroad.com/l/meta-ads-tracking-template) ($12)

Stuck, or want the before/after evidence produced for you? Email **Baxley.Garrett@gmail.com** (subject: parity) or DM [x.com/SignaL_OriginHQ](https://x.com/SignaL_OriginHQ).

Signal Origin, Houston TX. Independent publication; not affiliated with or endorsed by Meta Platforms, Inc. or Shopify Inc. Personal/company internal use; no resale.

## CTA (support / after-purchase)

Email Baxley.Garrett@gmail.com — subject line “parity”.  
Do **not** use a sports handle, Galaxy Sports, or any sports CTA on this listing.

## Call-to-action button

I want this!

## Short summary (for Gumroad “summary” / social if asked)

One printed page: Pixel vs CAPI event_id checklist plus a 7-day Meta-vs-Shopify count sheet. Catch double-counted purchases before you scale spend.

---

## What this is not

- Not a prompt pack
- Not sports
- Not a duplicate of the $19 workbook (that is the full 90-minute audit) or the $12 tracker (that is the ongoing spreadsheet)
- Not a live CAPI implementation, GTM container, or Shopify app

## Publish checklist (founder)

1. New product → upload `event-id-parity-checklist.pdf`
2. Title, $9, description above
3. Discoverable? yes. Affiliates optional.
4. Cross-link this URL from the workbook and tracker listings after it is live
5. Do not spend on Gumroad ads / Boost from this draft
