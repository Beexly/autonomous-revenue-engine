# Weekday Lane 1 hunt — 2026-08-31 ~10:20am CT
**Method:** Firecrawl search+scrape (API key). No SendToAgent this seat (automation subagent). No apply. No Connects spend. No sports.
**Offer lock:** $250 Meta Pixel+CAPI diagnostic, then $500–$1,500 impl. CTA mailto Baxley.Garrett@gmail.com / @SignaL_OriginHQ.

## Scout list (live, last ~48h)

| # | ID | Title | Posted | Keep? |
|---|-----|-------|--------|-------|
| 1 | ~022094239530766836149 | GTM + Meta Pixel & CAPI — SamCart Purchase dup/false Purchase | yesterday | KEEP |
| 2 | ~022094240601146400416 | Marketing Analytics & Attribution — GA4/GTM/Meta Pixel/CAPI | yesterday / Aug 30, 2026 | KEEP (Meta slice) |
| 3 | ~022094208464810959972 | Tracking and Conversion Specialist (vague C2H) | yesterday | DROP |
| 4 | ~022094261267705176278 | Shopify / Meta Ads — CampYard equine | yesterday | DROP (ads retainer) |

Public URLs:
- https://www.upwork.com/jobs/Google-Tag-Manager-Meta-Pixel-CAPI-Expert-Fix-SamCart-Tracking-Duplication_~022094239530766836149/
- https://www.upwork.com/jobs/Marketing-Analytics-Attribution-Specialist-GA4-GTM-Meta-Pixel-CAPI_~022094240601146400416/

---

## Job 1 — SamCart false Purchase / CAPI dup — four angles

### 1. Research
Buyer needs a technical tracking fix on SamCart: failed payment attempts land in Meta as successful Purchase. Stack named: GTM, Meta Pixel + CAPI, Events Manager, dedup, browser+server, SamCart checkout, GA4. Posted yesterday. Hourly $35–$95, Expert, 30+ hrs/week, 1–3 months, US-only listing. 15–20 proposals. Client last viewed yesterday. Real ID from URL.

### 2. Analysis
Failure in their words: Purchase fires on payment *attempt*, not completed order. Suspects SamCart built-in pixel on attempt and/or thank-you + CAPI double-send. Exact Lane 1 shape (false/dup Purchase, event_id / trigger path).

### 3. Alternatives
Generic pitch: take the $35–$95/hr retainer and rebuild GTM. We refuse the seat. Offer fixed $250 diagnostic on where Purchase fires (SamCart native vs GTM vs CAPI), then $500–$1,500 to leave only successful purchases deduped. Do not bid full 1–3 month agency seat.

### 4. Verification
PASS. Apply + public job URLs load logged-out. ID ~022094239530766836149. Posted yesterday (<48h). Not sports. Claims match page text. FLAG: US-only + ongoing hourly — Garrett still has to send; Connects were 0 last known.

**Council:** KEEP diagnostic slice.

---

## Job 2 — Santa’s Secret Workshop Meta Lead/Purchase — four angles

### 1. Research
Founder wants measurement repair after an audit. Explicit Meta issues: Lead on homepage/page views; Purchase missing value/currency; CAPI/server need verify + dedup. Also wants GA4/GTM cleanup, UTM SOP, founder dashboard. $1,000 fixed, Expert, Worldwide, posted Aug 30 / yesterday. 20–50 proposals, 0 interviewing. USA client, $3.6K spent. Real ID from URL.

### 2. Analysis
Meta slice is Lane 1: Lead misfire + missing Purchase + CAPI dedup. Rest of $1k scope is GA4 architecture + reporting (not our locked offer).

### 3. Alternatives
Generic: bid whole $1,000 analytics build. We refuse full attribution/dashboard seat. Pitch $250 Meta diagnostic from their audit (Lead trigger + Purchase + CAPI dedup in Events Manager), then $500–$1,500 Meta impl. Leave GA4/UTM/dashboard to them or a later scoped job.

### 4. Verification
PASS. Public/apply pages load. ID ~022094240601146400416. Posted Aug 30, 2026 (inside 48h as of Aug 31 morning CT). Not sports. Meta claims match summary.

**Council:** KEEP Meta slice only.

---

## Dropped

### Tracking and Conversion Specialist (~022094208464810959972)
One-line ask (GTM/GA4/Meta/CAPI/server). No concrete failure. Contract-to-hire, 20–50 proposals, interviewing 1, last viewed 10h ago. Angles 1–3 disagree on diagnostic fit → DROP.

### CampYard Shopify/Meta Ads (~022094261267705176278)
Primary ask is Meta sales campaigns + ROAS. Pixel/CAPI is a pre-spend checkbox. DROP (ads retainer, not tracking repair). Equine niche noted; not the drop reason.

---

## Send-ready bids (Closer voice — never sent)

### Bid A — SamCart (~022094239530766836149)

Hey,

Failed SamCart checkouts showing up as Purchase in Meta is almost always the pixel or CAPI firing on the attempt path (or thank-you + server both counting without one event_id). I'll find which pipe is wrong before anybody rebuilds the whole GTM tree.

Houston. Flat $250 diagnostic, written list in 48 hours: which trigger fires Purchase, whether CAPI and browser share an event_id, and what to cut so only paid orders count. If the Meta slice needs a fix after that, impl is $500–$1,500. Not bidding the 30-hour retainer.

Garrett

### Bid B — Santa’s Secret Workshop (~022094240601146400416)

Hey,

Your audit already named the Meta mess: Lead on page views, Purchase missing value/currency, CAPI/dedup unverified. That's the slice I take first. I won't pitch a full GA4/UTM/dashboard rebuild in this proposal.

Houston. $250 diagnostic against Events Manager (Lead trigger, Purchase payload, browser vs server dedup). Written list in 48 hours. Meta impl after that is $500–$1,500 if you want it. Happy to answer your six apply questions once we're on the Meta path.

Garrett
