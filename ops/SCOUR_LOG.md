# Scour Log — GitHub / Monetization Sweep

**Date:** 2026-08-24  
**Operator:** Grok  
**Scope:** Repos and opportunities relevant to current gates, free-core micro-tool direction, and near-term revenue.  
**Guardrails applied:** Human-primary authorship; no raw automated output; no AI packages / prompt products; no adult; no publish without gate Pass; daily revenue job still deferred.

---

## A. Fork / Integrate NOW (gate & product core)

### Tier 1 — Originality gate (immediate)
| Repo | Why | Action |
|------|-----|--------|
| [fastdatascience/faststylometry](https://github.com/fastdatascience/faststylometry) | Production-ready Burrows’ Delta + author z-scores | Vendor/adapt into `gates/` for voice consistency |
| [craigtrim/pystylometry](https://github.com/craigtrim/pystylometry) | 50+ metrics: TTR/MTLD, Burrows/Cosine Delta, readability, stylistic markers | Selective metric import for multi-factor originality score |
| [jamesosullivan/stylometry](https://github.com/jamesosullivan/stylometry) | Clear Burrows Delta + dendrogram/MDS scripts | Reference implementation for offline calibration |
| Statistical burstiness/CV patterns (stdlib-style detectors in public issues/tools) | Sentence-length CV, successive difference — no LLM required | Implement as pure functions in gate (no dependency on “humanizer” products) |

**Do not fork as product direction:** AI humanizer / detector-bypass repos (text-humanizer, StealthHumanizer, avoid-ai-writing as launderers, claude-text-washer rewrite paths). Those conflict with human-primary + anti-launder stance. Detection *features* only; no rewrite-to-fool-detectors product.

### Tier 2 — Free-core micro-tool shell (when niche is named)
| Repo | Why | Action |
|------|-----|--------|
| Official / high-star Next.js SaaS starters with Stripe (e.g. nextjs saas-starter class, openstarterkit, saasyachtclub/saas-boiler patterns) | Auth + Stripe + Postgres path without buying a boilerplate | Fork only after experiment spec names the niche; strip AI-writer defaults |
| Minimal credit/subscription ledgers in open AI-SaaS starters | Payment wiring reference | Copy patterns, not the “AI content generator” product shape |

### Tier 3 — Distribution / ops (after accounts exist)
| Repo | Why | Action |
|------|-----|--------|
| Postiz / Mixpost / OpenPost / TryPost | Self-hosted schedulers | Evaluate only for *gated* queue push; never auto-publish ungated content |
| langchain-ai/social-media-agent | HITL LangGraph pipeline | Pattern reference for research→draft→human approve; keep adversarial gate as hard stop |

---

## B. Revenue opportunities (aligned)

1. **X Original Content Rewards (primary surface)**  
   - Program live; old Revenue Sharing closing.  
   - Pays on qualified Premium/verified Home Timeline impressions of *original* content.  
   - Eligibility stack: Premium + follower/impression thresholds.  
   - Our gates exist specifically to optimize for this (human-primary, non-aggregator, non-bait).

2. **Affiliate (secondary, no eligibility floor)**  
   - [Affitor/open-affiliate](https://github.com/Affitor/open-affiliate) — open registry of programs + MCP/CLI for agents.  
   - Creator-tool and infra affiliates (hosting, analytics, schedulers, email) fit SignalOrigin “operator” voice better than generic Amazon spam.  
   - Disclosure required; only recommend tools we would use in the pipeline.

3. **Free-core micro-tool → paid tier**  
   - HANDOFF direction: narrow professional niche, free core, not prompt packs.  
   - Monetize via: usage limits, pro analytics, team seats, or API — once niche experiment spec is written.  
   - Stripe path from open SaaS starters when product shape is fixed.

4. **Not pursuing now**  
   - Selling AI packages / agent kits / prompt products (locked out).  
   - Ad networks on a site with no traffic yet.  
   - Auto-post farms / engagement pods (policy + OCR death).

---

## C. Immediate operator queue (from this scour)

1. Add `gates/` stubs that call or reimplement: Burrows’ Delta (faststylometry patterns), sentence-length burstiness CV, basic lexical diversity.  
2. Finish Rewrite cycle on SO-002 / SO-005 using stronger metric language (already in FIRST_BATCH).  
3. Write **one** free-core micro-tool experiment spec (niche + free vs paid wedge).  
4. Draft affiliate shortlist from open-affiliate categories that match operator tooling (no spam verticals).  
5. Keep measurement template work so daily revenue score can unlock later.

---

## D. Explicit rejects from this sweep

- Humanizer / bypass repos as product or as default rewrite path.  
- Pure auto-publish social agents without HITL + our adversarial veto.  
- Generic “AI SaaS that writes posts” clones (saturated + conflicts with OCR originality).

---

**Status:** Scour complete for this cycle. Fork list and revenue paths locked above. Next commits should be gate code + experiment spec, not more pure research.
