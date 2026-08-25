# Meta Analytics, Metrics & Optimization Leverage Map (2026)

Deep reference for Signal Origin — maximize attention + paid leverage without mixing Sports/DFS claims.

## 1. Surfaces (what reports what)

| Surface | What it shows | Use for |
|---------|---------------|--------|
| **Meta Business Suite Insights** | Organic + light paid overview (Views, Follows, Content interactions, Audience, Messaging, Content table) | Daily/weekly organic health, content calendar, inbox |
| **Ads Manager** | Full paid hierarchy (Campaign → Ad Set → Ad), custom columns, breakdowns, attribution settings, Opportunity Score | All real optimization and spend decisions |
| **Events Manager** | Pixel / CAPI events, Event Match Quality (EMQ), deduplication, test events | Signal quality — the training data for Advantage+ |
| **Marketing API / Insights API** | Programmatic same metrics + advanced breakdowns | Agent automation (MCP Ads server preferred) |
| **Meta Ads MCP** (`mcp.facebook.com/ads`) | Agent-native create/manage/report | Grok Bot / Origin Factory paid distribution |

**Rule:** Never optimize spend from Business Suite alone. Suite is overview; Ads Manager (or MCP) is the control plane.

## 2. Core metrics that actually matter

### Delivery / Auction
- **Impressions / Views** — times shown
- **Reach** — unique accounts (unique metrics now more restricted in API)
- **Frequency** — impressions ÷ reach. Healthy <2–2.5 / 7d; fatigue often >3
- **CPM** — cost per 1k impressions (auction + competition signal)
- **Opportunity Score** (0–100) — compliance with Meta recommendations, *not* profitability

### Engagement
- **CTR (all)** / **Link CTR** — clicks ÷ impressions
- **CPC** — cost per click
- **Outbound clicks / Landing page views**
- **ThruPlay / video metrics** (where relevant)

### Conversion (the money layer)
- **Results / Conversions** (by optimization event)
- **Cost per result (CPA)**
- **ROAS / Purchase ROAS** (or value optimization)
- **Conversion rate**

### Attribution reality (2026)
- **Deprecated Jan 12 2026:** 7d_view and 28d_view windows (empty data, no error)
- **Current practical standard:** 7d click + 1d view (and engage-through)
- **Click redefined Mar 2026:** only real link clicks count as click-through; likes/comments/shares → 1d engage-through
- **Incremental attribution** available — measures lift vs baseline; use for calibration, not blind optimization at first
- Reported conversions often dropped 15–40% after view-window removal with *no real performance change*

**Calibration rule:** Always cross-check Meta-reported conversions against backend truth (Stripe, server logs, CRM). Use blended ROAS (total revenue ÷ total ad spend) as the business number. Many operators apply 1.3–1.5× multipliers or simply trust trends over absolute Meta numbers.

## 3. Signal quality = algorithm fuel

| Setup | Typical EMQ | Effect |
|-------|-------------|--------|
| Pixel only | 3–5 | Degraded optimization |
| Pixel + CAPI (deduplicated) | 6–8+ | Stronger delivery, lower CPA (~15–25% reported) |

**Must-haves:**
1. Pixel + Conversions API running in parallel
2. Shared `event_id` for deduplication (target 60–80% dedupe rate)
3. Hashed PII on CAPI events (email, phone, name, external_id, fbp/fbc) — biggest EMQ lift
4. Correct event prioritization under Aggregated Event Measurement
5. Domain verification + accurate event_time / action_source

Low EMQ = Advantage+ optimizes on a distorted picture of your buyers.

## 4. Structure & learning phase (2026)

- **~50 optimization events per ad set per rolling 7 days** to exit learning cleanly
- Minimum viable daily budget ≈ target CPA × 50 ÷ 7
- Prefer **fewer campaigns, fewer ad sets, more creative variety** inside them
- **Advantage+** is now the default path (unified with former manual flow). Broad targeting + strong creative + clean signal usually beats heavy manual segmentation
- ABO (ad set budget) for clean creative/audience tests; Advantage+ campaign budget (CBO-style) for scaling proven winners
- Avoid >20% budget swings, audience rewrites, or optimization-event changes that reset learning

## 5. Creative & fatigue levers

- Creative is the primary controllable lever under Advantage+
- Volume: multiple distinct angles (UGC, demo, lifestyle, offer) with many variants
- Watch frequency + CTR trend + CPM trend together for fatigue
- Advantage+ creative enhancements: enable low-risk ones (touch-ups, relevant comments, brightness); test AI overlays/CTA carefully and preview everything

## 6. Optimization playbook for Signal Origin free cores

1. **Organic first (Business Suite):** ship free core → measure Views, content interactions, link clicks, follows. Use Phoenix-aligned content on X; Meta is secondary distribution.
2. **Signal before scale:** Pixel + CAPI + EMQ ≥6 before serious spend.
3. **Test structure:** small ABO tests of creative angles → promote winners into Advantage+ Sales / broader campaigns.
4. **Calibration loop:** weekly — Meta reported vs backend events, EMQ, frequency, incremental vs standard attribution gap.
5. **Human gate:** any real spend still requires APPROVE until budget + rules exist.
6. **Never:** claim Sports/DFS edge in Meta creative; keep free-path law on the product being promoted.

## 7. Agent / MCP leverage

- Use **Ads MCP** for reporting + controlled campaign ops once authenticated
- Use **Devtools MCP** for app health, webhooks, App Review, docs
- Prefer MCP over raw Insights API for agent workflows (schemas designed for LLMs)
- Still fall back to Insights API for custom breakdowns or historical pulls when needed

## 8. Quick diagnostic checklist (performance drop)

- [ ] Learning phase reset? (budget/audience/creative/event change)
- [ ] EMQ dropped or events missing in Events Manager?
- [ ] Attribution window / reporting change (view windows gone)?
- [ ] Frequency >3 and CTR declining?
- [ ] One placement (e.g. Audience Network) dragging results?
- [ ] Backend conversions stable while Meta numbers fell? → measurement, not performance

---

Source synthesis: Meta docs, Ads Insights API changelogs 2025–2026, Advantage+ guidance, EMQ/CAPI best practices, Business Suite vs Ads Manager distinctions. Update when Meta ships material measurement or Advantage+ changes.
