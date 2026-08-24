# X Original Content Rewards — Alignment & Optimization

**Status:** Active doctrine  
**Source:** [X Help — Original Content Rewards](https://help.x.com/en/using-x/original-content-rewards) (as of 2026-08)  
**Rule:** Maximize *legitimate* eligibility and qualified-impression yield. No policy evasion, no fake engagement, no aggregator games.

---

## 1. What the program pays for

**Qualified impressions** = unique impressions from **Premium** users on the **Home Timeline**, where **≥50% of the post is visible**.

Not: reply impressions, pure quote-farming, non-Premium views, off-timeline surfaces as the primary meter.

**Eligibility (must clear all):**
- Active Premium / Premium+ / Premium Business
- ≥500 verified followers
- ≥500,000 Home Timeline impressions from verified users in last 90 days (replies excluded)
- 18+, eligible country, good standing, personal or business account (not political/gov org)
- **Actively post original content** as defined by X

Admission is not automatic even if thresholds are met — application required.

Old Creator Revenue Sharing: closed to new enrollments; winds down through early September 2026. OCR is the forward path.

---

## 2. How SignalOrigin aligns

| OCR pressure | Our response |
|--------------|--------------|
| Original content required | Human-primary authorship + originality gate (42/60, floor 5) + adversarial Pass |
| Not aggregator / not low-effort | Kill listicle bait, hot-take closers, pure automated output |
| Premium Home Timeline visibility | Optimize for *hold attention past 50% viewport* — clear hooks, scannable structure, substance in first screen |
| Verified/Premium audience quality | Content aimed at operators and high-signal users, not pure engagement bait |
| Sustained posting of original work | Next-man-up internal queue of Pass-only candidates; no publish without gate |

---

## 3. Optimization levers (legitimate)

### Account stack (owner actions)
1. Create dedicated SignalOrigin handle.
2. Premium on that account (required).
3. Grow verified followers toward 500+ without bots or pods.
4. Accumulate verified Home Timeline impressions (replies don’t count toward the 500k bar).

### Content stack (operator / gates)
1. **Every public candidate must Pass originality + adversarial.** OCR explicitly rewards original work; our gate is the filter.
2. **First-screen density:** Opening lines must carry the angle so ≥50% visible still conveys value (qualified impression definition).
3. **Avoid reply-primary distribution** for monetization math; main posts on Home Timeline are the unit of pay.
4. **Voice consistency via Burrows’ Delta:** Build a reference corpus from approved Pass assets; flag drafts that drift into generic-AI or off-brand function-word profiles.
5. **No engagement bait as primary purpose** — instant fail in our gate and toxic for long-term OCR standing.
6. **Measurement:** When accounts exist, log proxies for Premium/verified impression quality (even before payout eligibility) so Learning can rank formats that hold viewport.

### What we do *not* do
- Buy followers or impressions
- Engagement pods / reciprocal spam
- Repost aggregates as “original”
- Humanizer-launder pure model output to game detectors
- Claim OCR payouts we have not earned

---

## 4. Exposure path (order of operations)

1. Owner: account + Premium.  
2. Operator: continuous Pass-only candidate pipeline (already running).  
3. Owner: publish cadence of Pass assets only.  
4. Hit follower + verified HT impression thresholds.  
5. Apply to OCR when eligible.  
6. Iterate formats using payout and impression evidence (Learning loop).  
7. Layer affiliate on the same high-signal posts where relevant (secondary revenue).

---

## 5. Burrows’ Delta role under OCR

OCR is not a stylometry contest, but:
- Consistent human voice across posts supports “original creator” perception and reduces automation-signature risk.
- Delta against our own Pass corpus detects drift toward generic model cadence before publish.
- Combined with burstiness / lexical features, it hardens the automation-risk dimension of the originality gate.

Implementation details: `ops/BURROWS_DELTA.md` + linked upstream repos.
