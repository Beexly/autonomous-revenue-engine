# Multi-Platform Engagement & Revenue Paths (Signal Origin)

The Meta-only view is incomplete. Full attention + revenue surface map.

## Platform Map (2026)

| Platform | Organic Engagement | Paid / Ads | Direct Revenue Paths | Agent / API Access |
|----------|--------------------|------------|----------------------|--------------------|
| **X (Phoenix primary)** | Copy-link 20×, reply 5–20×, like 0.5 | X Ads MCP emerging | Subscriptions, tips, future | Native X tools + Ads MCP |
| **Instagram (Meta)** | Views (new primary), Reels, Stories, Reach, interactions | Meta Ads MCP + Advantage+ | Brand deals, Shopping, limited Reels pay on FB side | Graph API + Meta Ads MCP + Business Suite |
| **YouTube** | Engaged views, watch hours, CTR, audience retention | YouTube Ads / Google Ads | YPP ad share, Shorts Creator Pool (45%), Super Thanks, memberships, Shopping affiliate | YouTube Analytics + Reporting APIs |
| **TikTok** | Views, completion, shares, follows | TikTok Marketing API / Smart+ | Creator Rewards (~$0.40–$1 RPM), TikTok Shop affiliate/GMV, Live gifts, brand deals | Marketing API + organic business APIs (own account); third-party for broader data |

## Instagram (beyond Meta Ads)

- **Primary metric shift:** Views replacing plays/impressions across Reels, Feed, Stories (2026).
- Organic Insights via Graph API / Business Suite: views, accounts reached, interactions, profile activity, Reels metrics, reposts.
- Monetization reality: Instagram itself pays little/none on Reels for most creators; Facebook Reels historically higher. Brand deals + Shopping + distribution are the real paths.
- Free-core promotion: treat IG as distribution + retargeting pool, not primary ad revenue engine.

## YouTube

**Monetization thresholds (rising Feb 2027):**
- 1,000 subs +
  - Long-form: 8,000 qualified watch hours / 365d (was 4k)
  - Or Shorts: 20M qualified Shorts views / 90d (was 10M)
- Maintenance for Shorts pool: 10M qualified views / rolling 90d or drop from Creator Pool.

**Revenue math:**
- Shorts RPM typically 3–14% of long-form. ~$0.01–$0.07 / 1k views common; US-heavy higher.
- 1M Shorts views ≈ $20–$150 typical (US-heavy finance can print higher). **Corrected 2026-08-26** — this line previously said "$150–$300 depending on geo"; `ops/CONFORMAL_FOR_PLATFORM_METRICS.md:48` retracted that figure ("Do not cite $150–$300 as typical") but this file was never updated to match. Three-column check: stated $150–$300, recalculated (from the same creator-reported ranges the retraction cites) $20–$150, now reconciled here.
- Long-form still the real money (RPM $2–$10+).
- Additional: Super Thanks, memberships, Shopping affiliate, brand deals, targeted Shorts ads (45% direct share in narrow cases).

**Analytics:** YouTube Analytics API (real-time queries) + Reporting API (bulk + financial/revenue reports including Shorts pools).

**Strategy for Signal Origin:** Shorts as top-of-funnel / discovery; long-form or external free-core links as conversion. Do not treat Shorts as primary revenue until thresholds and engaged-view share are real.

## TikTok

**Organic + Creator:**
- Creator Rewards Program: ~$0.40–$1.00 per 1k views (far above old Creator Fund).
- Live gifts (creator keeps 30–50%).
- Brand sponsorships still largest for many.

**Commerce engine:**
- TikTok Shop: major GMV; creators drive large % of US Shop sales.
- Affiliate commissions can dominate for product-adjacent free cores.
- Ads + Shop together outperform either alone on conversions / ROAS / new customers.

**Ads:**
- Marketing API + Smart+ / Upgraded automation.
- TikTok Pixel + Conversion API (same dual-signal principle as Meta).
- Creative volume is the lever; CPMs often lower than Meta.
- Spark Ads amplify organic winners.

**Data limits:** Official APIs largely limited to your own accounts for commercial use. Research/ad-library routes restricted. Third-party / MCP connectors fill gaps for broader intelligence.

## Cross-platform agent leverage

Existing / emerging MCP-style connectors (publishing + analytics):
- Multi-network publishing servers (TikTok, IG, YouTube Shorts/Reels, X, Threads, etc.)
- Creator intelligence (search across YT/IG/TikTok)
- Platform-specific: Meta Ads MCP (official), YouTube Reporting/Analytics, TikTok Marketing API

Wire these into Miner + Voice/Content + Measurement fleets. Prefer official APIs where available; use reputable multi-publish MCPs for distribution only after human voice lock + free-path checks.

## Unified Signal Origin play (all platforms)

1. **Organic first, multi-surface**
   - X (Phoenix) primary for high-signal attention
   - IG Reels + TikTok + YT Shorts for discovery/volume
   - Same free core, platform-native packaging, locked voice

2. **Signal quality before paid**
   - Meta: Pixel + CAPI + EMQ
   - TikTok: Pixel + CAPI equivalent
   - YouTube: Analytics engaged views + conversion tracking on destination

3. **Creative test → amplify**
   - Organic winners on TikTok/IG → Spark / Boost / Advantage+
   - Shorts that drive engaged views → long-form or external free-core CTA

4. **Revenue stack priority**
   - Free core value proven
   - Affiliate / Shop / brand where product fits
   - Platform creator pools only after thresholds are realistic
   - Paid ads last, human APPROVE, calibrated against backend

5. **Calibration across all**
   - Never trust platform-reported revenue alone
   - Backend truth (Stripe, server events) is source of truth
   - Weekly: platform metrics vs real conversions / revenue

## Gaps still to close (Grok Bot / Origin Factory)

- [ ] YouTube Analytics + Reporting API connection for any channel we own
- [ ] TikTok Marketing API + organic posting path (own accounts)
- [ ] Instagram Graph insights + Reels publishing pipeline
- [ ] Multi-publish MCP evaluation (only after voice lock)
- [ ] Cross-platform measurement template (views/engaged views → free-core conversion → revenue)
- [ ] No Sports/DFS claims on any of these surfaces

Update this file as APIs, thresholds, and MCP servers change.
