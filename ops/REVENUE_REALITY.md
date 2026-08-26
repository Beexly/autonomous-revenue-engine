# REVENUE REALITY — the honest ranked plan

**Date:** 2026-08-25
**Author:** Claude (operator pass), from a full-repo audit + market research sweep
**Status:** Standing doc. Supersedes the revenue framing in STRATEGY.md (root),
ops/STRATEGY.md, and the paid-wedge sections of the master prompt where they conflict.

This project's own #1 non-negotiable is honesty surfaces. This document applies
that rule to the project itself.

---

## 1. The verdict

The engine has produced ~55 strategy documents, 13 scored drafts, 8 static
tools, and 6 micro-apps in two days of operation — and $0, because:

1. **Nothing is for sale anywhere.** No product page, no price, no payment
   rail. Stripe deferred, Lago unwired, x402 is dead code.
2. **Nothing is published anywhere.** Zero posts ever. GitHub Pages disabled.
   The only live surface is a raw.githack proxy nobody has visited.
3. **Every buyer-facing motion terminates in a closed human gate.** The
   operator is forbidden to publish, post, spend, or create accounts — and the
   human is simultaneously being told "do not post" by the gate system.
4. **The quality gate became an infinite publish-blocker.** The bar moved
   three times in 48 hours (42/60 → adversarial Pass → 9.2 composite). Posts
   that passed were retroactively killed. Current approved queue: zero.
5. **Strategy churn.** Three incompatible theses in 48 hours (X-payout content
   brand → affiliate micro-tool site → conformal stats lab / holding company).
   Each pivot reset execution to zero.

None of this is a talent problem. The shipped code is real and the discipline
against fake claims is genuinely enforced. It is a **contact-with-buyers
problem**: the system optimizes gate-passing, which produces documents, instead
of optimizing buyer contact, which produces money.

**Rule going forward: a cycle that does not touch a buyer-facing surface
(a published tool, a sent offer, a live listing, a shipped install path) is an
idle cycle, whatever it produced.**

## 2. On "don't put all eggs in one basket" and "fork everything"

Two direct corrections to the current operator instinct:

**Diversification before first revenue multiplies zero.** Ten half-open lanes
produced $0 here. Probes are cheap and fine; *funded* lanes (real hours, real
spend) must be few — two, maybe three — until one pays. Diversify *after* a
lane proves it can produce a dollar, by repeating the proven motion, not by
opening a new kind of motion.

**Forking is an input, not a business.** The scarce assets are distribution
and trust, and a fork inherits neither. Fork/reuse is allowed only when ALL
of these hold:
- License permits it (MIT/Apache/BSD: yes, keep notices; GPL/AGPL: the
  derivative must stay open — fine for free cores, fatal for proprietary
  wedges; no license = all rights reserved = do not touch).
- Attribution is kept. Stripping provenance would also torch the honesty brand.
- We add a genuine, nameable improvement for a nameable buyer — "rebranding"
  alone is a commodity move with zero pricing power.
- TIERED_FORKS.md contains zero license analysis across 15+ planned forks.
  No fork proceeds without a license line added to its entry.

## 3. What actually exists (assets, honestly valued)

| Asset | State | Honest value |
|---|---|---|
| conformal-lite | Now installable, tested, e-value math fixed (was invalid) | Credibility asset / OSS calling card. Not a product yet. Nobody pays for a thin ACI wrapper while MAPIE/crepes/TorchCP are free. |
| Meta CAPI/EMQ knowledge (ops docs + capi.py) | Real, current, correct | **Sellable as a service.** This is the most monetizable thing in the repo. |
| 5 JS linters + 8 static tools | Working, tested, undeployed | Funnel material once Pages is on. Regex heuristics against a house rubric — free forever, never paid. |
| Voice/gate apparatus (qi-check, 9.2 floor) | Working, self-referential | Internal QA. Currently negative-value (blocks all output). |
| X/IG/TikTok/YT accounts + X Premium | Created, zero posts | Cost center until posting starts. |
| ~55 strategy docs | Extensive | Sunk cost. This doc + master prompt + checklist are enough. |

## 4. The ranked lanes (probability × time-to-first-dollar)

### Lane 1 — Productized tracking service: Meta Pixel + CAPI dedupe + EMQ audit
**First dollar: 1–3 weeks. Probability: highest in this repo. This is the lane that feeds the family.**

Businesses running Meta ads pay real money for exactly what ops/META_ANALYTICS_LEVERAGE.md
already documents: Pixel+CAPI deduplication, EMQ ≥ 6, attribution-gap analysis.
Market research (Aug 2026) confirms the market and sharpens the shape:

- **Buyer:** Shopify/WooCommerce stores spending **≥$5k/month on Meta ads**
  (below ~$2k/mo ad spend, server-side tracking ROI doesn't pencil — local
  businesses are the WRONG target). Shopify forums are full of the exact
  dedup pain ("Purchase Event missing some Deduplication Parameters").
- **Offer shape that wins:** fixed-price **$150–$400 tracking diagnostic**
  (Events Manager review, dedup check, EMQ score, prioritized fix list) that
  converts into a **$500–$1,500 fix/implementation**. Productized specialists
  (e.g. TrackingFixes, $645 flat + $48/mo) beat both the $10 Fiverr floor and
  $2–5k agency quotes. Sell measured EMQ lift, not "CAPI setup" —
  generic setup is commoditized from below ($10–25 gigs) and automated from
  above ($145–950/mo Shopify apps like Analyzify/Elevar).
- **First-client channels:** live Upwork fix-jobs (fastest deal flow — posted
  continuously), Stape's free partner program (up to 40% lifetime commission
  + public directory listing = inbound), Shopify community dedup threads.
- **Realistic timeline:** first $100–$500 ticket in 2–6 weeks; $2–5k/month
  run-rate in 3–6 months of consistent effort.

Operator deliverables (no approval needed): offer one-pager, the diagnostic
checklist productized from the existing docs, Upwork proposal templates,
Stape partner application draft, 10-prospect outreach drafts. Human gate
(minutes): approve and send under his own name. The voice gate does NOT
apply to service outreach — a DM offering to fix someone's conversion
tracking is not public content and needs no 9.2 score.

### Lane 2 — Contract/freelance income (Python, data, tracking, automation)
**First dollar: 1–4 weeks. Probability: highest overall. Not the dream — the bridge.**

Said plainly, because nobody else in this repo's history has said it: for an
unemployed founder whose family needs money now, the highest-EV engine is
selling hours while the compounding lanes grow. The repo is now a real
portfolio (installable stats package with honest math, working micro-tools,
deep Meta measurement docs). Use it as proof-of-skill in applications and
proposals. The autonomous engine's job is to make this cheap: proposals,
portfolio framing, and Lane-1 productization are all operator work.

### Lane 3 — Free-core distribution → credibility → small paid wedges
**First dollar: 2–6 months. Compounding. This is the "attention OS" lane, honestly timed.**

Sequence that actually works: publish conformal-lite to PyPI → enable GitHub
Pages → one honest Show HN / r/MachineLearning post ("numpy-only adaptive
conformal prediction with honest caveats") → GitHub Sponsors + Polar.sh link
→ only after real users exist, a paid wedge with a real differentiator
(hosted calibration-as-a-service: send predictions+outcomes, get always-valid
intervals/alerts, metered via the existing Lago hook). "Higher coverage" is
not a paid tier — α is a free parameter of the open code; the wedge must be
hosting, streaming, and integration, not the math.
Expected money is small for months — honestly: Sponsors for a no-audience new
project realistically pays **$0–$25/mo** (the ~$100M lifetime program total
across 70k+ maintainers skews heavily to established names). If selling a
paid artifact, use Gumroad (same-day checkout; verify ID immediately so the
payout minimum drops $100→$10) and start Polar's ~2-week account review in
parallel. x402/CDP micropayments are confirmed dead as an earnings channel
in 2026 (~$28–42k/day settlement across the ENTIRE protocol) — the eip3009.js
dead code stays dead. This lane's real yield is inbound credibility for
Lanes 1–2.

### Lane 4 — Platform payouts (X OCR, YT/TikTok/IG)
**First dollar: 90+ days, small. Treat as distribution, never as income.**

Verified numbers (Aug 2026): X revenue sharing needs Premium + 500 verified
followers + **5M impressions in 90 days** from an account with zero posts,
pays ~$8–12/M verified (Premium-viewer) impressions, and disqualifies
automated content — which permanently caps how "autonomous" this lane can be.
YouTube Shorts pays ~$0.03–0.08 RPM and doubles its thresholds Feb 1, 2027.
TikTok Creator Rewards is the only program with both a reachable gate (10k
followers + 100k views/30d) and real RPM ($0.40–1.00 per 1k qualified views)
— if short-form gets made, make it TikTok-first ≥60s and cross-post.
Expected 90-day payout revenue for a <5k-follower account across ALL four
platforms combined: **$0–$100.** Post because it feeds Lanes 1–3, not for
the payout.

### Lane 5 — Fork-and-brand farming
**Not a lane.** See §2. Forks are raw material for Lanes 1 and 3 only, under
the license rules above.

### Lane 6 — Rented distribution: marketplaces & the many-small-items engine
**First dollar: days-to-weeks per item. The honest version of "10,000 items × $0.50."**

The insight that makes this lane real: Lanes 1–4 all require *building*
distribution from zero — the project's #1 structural weakness. Marketplaces
*rent* distribution: buyers are already there searching. The engine motion is
produce → list → measure sell-through → double down on what sells → kill the
rest.

The honest math first: long-tail item revenue is power-law, not uniform.
10,000 items do not make $0.50 each — a handful make most of the money and
the median item makes $0. Marketplaces in 2026 are also actively raising
bars against AI-flood content (Etsy AI policies, stock-site submission caps,
app-store review). So the engine that works is NOT spray-10,000; it is:
**ship 10–20 quality items in niches where we hold real edge, measure weekly
sell-through, iterate the winners into families, kill the rest.** Volume
comes from iterating winners, not from spraying.

Ranked by (our edge × marketplace demand × effort):
1. **Productized-knowledge ladder off Lane 1** (live now): free checklist page
   (`docs/meta-tracking-audit.html`) → **$19–39 packaged workbook on Gumroad**
   (same content, polished PDF + fillable evidence templates + walkthrough)
   → $250 diagnostic → $500–1,500 done-for-you. Every tier funnels to the
   next. This is the first real "item" and it exists today.
2. **Template families** (Notion / Canva creator program / spreadsheet
   templates on Gumroad-Etsy): ad-tracking trackers, UTM planners,
   measurement dashboards — knowledge we already hold, near-zero marginal
   cost per variant, real marketplace search demand. $5–29 price points.
3. **A tiny Shopify app** (later, after Lane 1 revenue): "CAPI Dedup Monitor"
   — continuously verifies event_id parity + EMQ and alerts. Recurring $5–15/mo
   per store, sold where the exact buyer already shops. Higher effort, real
   moat from Lane 1 casework. Requires app review; not a week-one move.
4. **Stock/asset marketplaces**: only where AI-assisted work is allowed with
   disclosure, only in niches with demonstrated search volume. Lowest edge,
   strictest floors — probe with 5 items max before investing further.
Dead ends (verified): VS Code / Chrome extensions have no native payment
rails; GPT-store-style listings pay ~nothing; x402 covered above.

Rule: every item ships with honest descriptions, no fake reviews/social
proof ever, and each marketplace listing is a Garrett-approval (it's a
public surface with his name on the account).

## 4b. Social growth mechanics (what "blow up" actually takes)

Nobody can promise virality — anyone who does is selling something. What
compounds reach for a small account is mechanical and boring:

- **X (primary).** The Phoenix weights the repo already holds say it: replies
  are worth 5–20× and copy-link shares ~20×. The proven small-account motion
  is **reply-first**: 20–40 genuinely value-dense replies/day to large
  accounts in the niche (ads/measurement/analytics), inside the first hour
  of their posts, from Garrett's account. Original posts 3–5×/week (voice
  gate applies). Grok may draft reply candidates; Garrett edits and sends —
  X's Original Content Rewards disqualifies automated content, so
  human-primary here is not just brand law, it is eligibility law.
- **Content pillars tied to lanes** so every impression has a job:
  (1) build-in-public with real numbers — the honesty brand is the
  differentiator; (2) Meta tracking failure autopsies → feeds Lane 1;
  (3) calibration/uncertainty explainers → feeds Lane 3.
- **Short-form: TikTok-first** (only reachable payout gate + discovery-based
  distribution where small accounts genuinely can pop), ≥60s, cross-post to
  Shorts/Reels. Hook in the first 1.5s, one idea per video.
- **Every profile carries the funnel**: link → audit page + Gumroad + email
  capture. A viral post with no capture is a wasted lottery win.
- **Realistic bar:** 90 days of daily reps to reach 1–5k engaged followers
  is a *good* outcome; payouts stay ~$0 (§Lane 4) — the reach's value is
  funnel traffic. Forecast reach with conformal intervals before any public
  growth claim (CONFORMAL_FOR_PLATFORM_METRICS.md); never claim numbers we
  can't show.

## 5. Operating loop (replaces gate-first loop)

Weekly: 1 buyer-facing ship (Lane 1/3), 1 outreach batch prepared (Lane 1/2),
1 improvement to an existing asset. Gate check: the 9.2 Hold floor applies to
public *brand voice* posts only. Service outreach, PyPI releases, README
copy, and Show HN technical posts are governed by "is every claim true and
verifiable" — the honesty gate — not the voice gate. The voice gate protects
the brand; it must stop preventing the brand from existing.

## 6. Human APPROVE queue (total ~30 minutes, ranked)

1. **Rotate the leaked Meta credential** (see `ops/GARRETT_PENDING.md` —
   details go to Garrett out of band, not into this public file) and confirm
   here. It is still recoverable from public git history. 10 min.
   Negative-revenue insurance.
2. **Enable GitHub Pages** (Settings → Pages → main /docs). One click. Turns
   8 finished tools into a real URL.
3. **Merge the PR from this branch** (LICENSE, installable package, fixed
   math, real CI). Without the LICENSE the "free cores" are legally not
   reusable by anyone.
4. **Approve Lane 1 offer + first outreach batch** once drafted (operator
   drafts within a cycle; you send under your name).
5. **Create PyPI account** and run one `twine upload` when asked (operator
   prepares everything). Also enable GitHub Sponsors when convenient.
6. Only after 1–5: revisit posting cadence with the recalibrated gate rule.

## 7. Unchanged

Human primary on public voice and money. No fake claims, no fake revenue, no
invented URLs. Sports/GSE stays walled off. No spend without APPROVE. No
secrets in the repo. Honesty surfaces on every public statistical claim —
which, as of this branch, the e-value module finally satisfies.
