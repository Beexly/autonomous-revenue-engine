# LANE 1 SALES KIT — copy, paste, send

Everything below is ready to send after you swap the `[bracketed]` bits.
Grok: keep 3 fresh proposals drafted against live Upwork listings at all
times; Garrett only edits and sends.

---

## 1. Upwork profile

**Title:** Meta Pixel + Conversions API specialist — dedup fixes & EMQ lift, evidence included

**Overview:**
I fix broken Meta ads tracking for Shopify and WooCommerce stores. Specifically: Pixel + CAPI double-counting (missing event_id dedup), low Event Match Quality, and Meta-vs-backend number mismatches.

What you get that most setups skip: proof. Every engagement ends with a before/after record — dedup verification, EMQ per event, and a 7-day reconciliation of Meta-reported vs your actual orders — so you can see the fix worked in your own Events Manager.

Fixed prices, no retainers: $250 diagnostic (3 days, prioritized fix list) · $500–$1,500 implementation (scoped from the diagnostic, quoted before work starts).

I publish my measurement tooling as open source: github.com/Beexly/autonomous-revenue-engine (CAPI dedup/hashing helpers, calibration library). Same discipline in client work — numbers you can verify, nothing you can't.

## 2. Proposal templates (match to the job post's own words)

**A — "our purchases are double-counting / numbers don't match":**
> Your symptom (Meta reporting [X]% more purchases than your store) is almost always one specific defect: browser Pixel and CAPI firing without a shared event_id, so Meta can't deduplicate. I'll verify it in your Events Manager in the first hour, then fix event_id parity across both channels and prove it with a live test event plus a 7-day reconciliation against your backend. Fixed price: $[250–500] including the before/after evidence report. I can start [today/tomorrow]. One question so I scope it right: is your CAPI from [platform-native / a plugin / custom server code]?

**B — "need CAPI / server-side tracking set up":**
> I'll set up Conversions API alongside your existing Pixel the way Meta's dedup actually requires: shared event_id per action, true action_source, and hashed customer parameters normalized before hashing (that last step is where most setups silently lose Event Match Quality). Deliverables: working server events, dedup verified live via test_event_code, EMQ at 8+ on Purchase, and a short doc your team can maintain. Fixed price: $[500–900], [X] days. Which platform is the store on?

**C — "tracking audit / EMQ improvement":**
> I run a 15-point diagnostic: full event inventory, dedup verification, EMQ scoring per event with the exact parameters you're missing, Diagnostics-tab issues, consent-path behavior, and a 7-day Meta-vs-backend reconciliation. You get a prioritized fix list with effort estimates — fix them yourself or I quote the implementation flat. $250, 3 business days, starts with read access to Events Manager only.

**Bidding rules:** only jobs posted <24h ago; ≤4 sentences before the price; always end with one scoping question; never bid below $100; 3–5 bids/day beats 20 generic ones.

## 3. Warm-network note (text/DM/email to ~20 people)

> Hey [name] — quick one. I've gone independent doing Meta ads tracking repair: fixing the Pixel/CAPI double-counting and match-quality problems that quietly inflate ad costs for stores spending $5k+/mo. Fixed prices, proof included. If you know anyone running Shopify/Woo ads whose numbers never quite add up, I'd appreciate the intro. Either way — hope you're doing well.

## 4. Gumroad listing (for products/meta-tracking-audit-workbook.html → print to PDF)

**Title:** The Meta Tracking Audit Workbook — find the Pixel+CAPI defects inflating your ad costs
**Price:** $29 (launch $19 for the first week is fine)
**Description:**
> A 90-minute, fill-in-the-blanks audit of your Meta ads tracking. 15 checks across four parts: deduplication (are you double-counting purchases?), Event Match Quality (which parameters you're missing and why normalization matters), delivery health (rejected events, consent-path behavior), and a fix-priority matrix with a before/after evidence record. Written for store owners and marketers — no code needed to run the checks; every fix is flagged for whoever owns your site. If Meta's numbers and your backend's numbers disagree, this finds why.
**Also:** enable "ratings", add the checklist page URL as your "free preview" link.

## 5. Job applications (parallel lane — this is also revenue)

Portfolio paragraph for applications/LinkedIn:
> Recent independent work: built and published an open-source calibration library (adaptive conformal prediction, e-values with valid finite-sample guarantees; pip-installable, CI-tested) and a Meta Conversions API measurement toolkit; run a productized tracking-audit service for e-commerce stores. Repo: github.com/Beexly/autonomous-revenue-engine.
