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
Freelance/agency rates for server-side tracking setups run roughly $300–$1,500
per one-off setup/audit and $200–$1,000/mo retainers for measurement upkeep;
Upwork/Fiverr listings and agency subcontracting are full of this work. It is
unsexy, in-demand, and Garrett already holds the knowledge — the repo docs prove it.

Operator deliverables (no approval needed): offer one-pager, audit checklist
productized from the existing docs, Upwork/Fiverr listing drafts, 10-prospect
outreach drafts. Human gate (minutes): approve and send under his own name.
The voice gate does NOT apply to service outreach — a DM offering to fix
someone's conversion tracking is not public content and needs no 9.2 score.

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
Expected money is small for months (Sponsors for a new small project is
typically $0–low hundreds/mo). Its real yield is inbound credibility for
Lanes 1–2.

### Lane 4 — Platform payouts (X OCR, YT/TikTok/IG)
**First dollar: 90+ days, small. Treat as distribution, never as income.**

X OCR needs 500 verified followers + 500K verified impressions/90d from an
account with zero posts, pays ~$8–12/M verified impressions, and explicitly
disqualifies automated content — which caps how "autonomous" this lane can
ever be. YouTube/TikTok thresholds are rising. Post because it feeds Lanes
1–3, not for the payout.

### Lane 5 — Fork-and-brand farming
**Not a lane.** See §2. Forks are raw material for Lanes 1 and 3 only, under
the license rules above.

## 5. Operating loop (replaces gate-first loop)

Weekly: 1 buyer-facing ship (Lane 1/3), 1 outreach batch prepared (Lane 1/2),
1 improvement to an existing asset. Gate check: the 9.2 Hold floor applies to
public *brand voice* posts only. Service outreach, PyPI releases, README
copy, and Show HN technical posts are governed by "is every claim true and
verifiable" — the honesty gate — not the voice gate. The voice gate protects
the brand; it must stop preventing the brand from existing.

## 6. Human APPROVE queue (total ~30 minutes, ranked)

1. **Rotate the leaked Meta token** (app 1099624436068516) and confirm here.
   It is still recoverable from public git history. 10 min. Negative-revenue
   insurance.
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
