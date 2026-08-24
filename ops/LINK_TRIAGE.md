# Link triage + mutual-reply boost + OCR thresholds

**2026-08-24** — Owner dump triaged. Most links are noise for Signal Origin.

---

## A. Mutual reply boost mechanics

From `xai-org/x-algorithm` (param.rs + BIDIRECTIONAL_BOOST_CHANGE docs):

- Base **ReplyWeight** = 5.0
- **BidirectionalFollowReplyWeightBoost** = **15.0** (production after July 2026 A/B; tested 5/10/15/20)
- Effective reply coefficient on an **original post from an author you mutually follow** ≈ **20.0**
- Boost applies to the predicted reply probability on **their original posts in your feed** — not “your reply floats because you replied to a mutual.”
- **BidirectionalFollowDwellWeightBoost** = **0.0** (not shipped)
- Replies/reposts themselves are weaker candidates for out-of-network; originals index better

**For @SignaL_OriginHQ (0 followers):**
- Mutual boost does **nothing** until real bidirectional follows exist
- Path: earn mutuals in a niche by being worth following — not by mass-follow games
- Early reach = new-author effects + out-of-network retrieval if the post predicts high-value actions for some viewers
- Do not build strategy around mutual boost until graph exists

---

## B. OCR Premium viewer thresholds

**Eligibility (apply gate)** — all required:
- 18+, supported country (US included)
- Personal or Business account (not political/gov)
- Active **Premium, Premium+, or Premium Business** (Basic not listed for creator sub requirement)
- **≥ 500 verified followers**
- **≥ 500,000 Home Timeline impressions from verified users in last 90 days** — **replies excluded**
- Actively post original content; good standing
- Application + review; not automatic

**Payout unit — qualified impression:**
- Unique impression from Premium user (Basic / Premium / Premium+ / Premium Business)
- On **Home Timeline**
- **≥ 50% of the post visible**
- Excludes: repeat same account/post, paid/promoted/artificial, fraud

**Content ineligible for program value includes:**
- Copied / minimally modified / aggregated / cross-platform reuploads not by author
- **Created or posted using automated means**
- Exclusively monetization-coaching / payout-max discussion
- Disinfo, harmful, Community Notes hit, etc.

**Implication:** Reply farming can help rank but **does not** fill the 500k verified HT gate. Automation of posting is a hard OCR risk. SO-010 structure (short original, full point visible) is aligned with ≥50% visible.

**Distance for us:** Premium ✅ · verified followers 0/500 · 500k HT 0/500k · originality process in place · no auto-post yet

---

## C. Link dump triage

### Tier 1 — relevant to study (not necessarily fork now)
| Link | Verdict |
|------|--------|
| **gitroomhq/postiz-app** | Best scheduler candidate later: OSS, X support, API/MCP/agent-oriented, AGPL. Aligns with Pass-only poster *after* quality bar proven. Do not auto-post ungated. |
| **xai-org repositories / x-algorithm** | Canonical ranking source. Already used. |
| **PayDevs/awesome-oss-monetization** | Scan for legal OSS $ patterns; secondary to OCR/X path |
| **mezod/awesome-indie** | Indie distribution ideas; low priority |
| **enescingoz/awesome-n8n-templates** | Workflow glue later if self-host poster |
| **automatisch/automatisch** | OSS Zapier-like; later |

### Tier 2 — related but constrained / careful
| Link | Verdict |
|------|--------|
| **per-simmons/ai-reply-guy-opensource** | Reply automation → OCR “automated means” + spam risk. **Do not deploy** for Signal Origin. |
| **aaronjmars/tweazy** | Same class — inspect only |
| **chenyme/grok2api, grok-free-web-api, DE0CH/grok-frontend** | Unofficial Grok access wrappers — ToS/risk; we already have native tools |
| **dokploy / coolify / kubero** | Self-host platforms if we ever need cheap infra; Vercel first |
| **apify / apify-mcp-server** | Scraping/agents; only for research, not engagement farming |
| **XiaomingX/ai-money-maker-handbook** | Broad side-hustle dump (CN-heavy). Ideas only; much is wrapper/content spam adjacent |
| **Lenny newsletter Grok piece** | Product reading; not pipeline code |
| **morphic grok imagine guide** | Image gen how-to; optional later media |

### Tier 3 — ignore for this project
MoneyPrinter* family (YouTube bulk spam aesthetics — brand poison + OCR risk), zcash, hosts, sherlock, Branch iOS, Countly (overkill), classifai, saasify, lbry, intern lists, Discord bots, pintree, velobase, XPack marketplace noise, generic “show me the money” lists, wallos, etc.

**Hard no for Signal Origin:** anything that bulk-generates low-quality video/posts or auto-replies at scale.

---

## D. Operator takeaway
1. Mutual boost is a **later-graph** lever — not day-one strategy.  
2. OCR is a **long threshold** (500 verified + 500k verified HT). Quality originals on HT are the only honest path.  
3. From the dump, only **Postiz** is a serious future fork/self-host candidate for *gated* scheduling.  
4. MoneyPrinter-class and reply-guy-class tools are anti-aligned with OCR and the 110% bar.
