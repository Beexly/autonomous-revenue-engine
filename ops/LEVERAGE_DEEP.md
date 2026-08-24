# Deep leverage pass — full dump

**2026-08-24**

---

## 1. Postiz agent architecture (Tier-1 future)

**What:** Self-hosted / cloud social scheduler built for agents (AGPL-3.0).

**Agent path:**
- **MCP server** at `https://api.postiz.com/mcp/:apiKey` (or self-host equivalent)
- Tools include: `integrationList`, `integrationSchema`, `schedulePostTool` (draft | schedule | now), `postsListTool`, image/video generate tools
- CLI skill for OpenClaw/Claude-style agents
- Public REST API + `@postiz/node` SDK
- Temporal for workflow orchestration in monorepo

**X path:** User OAuth to X inside Postiz (not us holding keys in chat). Agent calls schedule with `integrationId` for X.

**Leverage for Signal Origin:**
```
[Pass gate in our repo] → only approved text IDs
        ↓
[Owner or agent] schedulePostTool type=schedule|now
        ↓
Postiz → X OAuth token → publish
```
**Must add ourselves:** hard gate so agent **cannot** call `now`/`schedule` unless asset ID is in `PASS_QUEUE` Approved. Postiz does **not** ship that gate natively — without it, agentic = OCR “automated means” + quality death.

**When:** After 3–5 manual Pass posts prove voice. Not before SO-010 ships and holds.

**Infra:** Docker + Postgres (+ Temporal). Or Postiz cloud trial. Coolify/Dokploy only if self-host later.

---

## 2. Apify MCP server (Tier-2 research only)

**What:** MCP bridge so agents can search/run Apify Store Actors (scrapers, RAG browser, docs).

**Tools:** search-actors, fetch-actor-details, call-actor, rag-web-browser, docs search.

**Leverage:** Competitor/post performance research, SERP, public X thread pulls via Store actors — **paid per run**, needs `APIFY_TOKEN`.

**Not for:** Auto-engagement, reply spam, mass scrape-to-repost (OCR kill).

**Rule:** Research ingest only → human-primary angle → Pass gate. Never scrape→ship.

---

## 3. Item-by-item leverage (every link)

| Item | Leverage | Action |
|------|----------|--------|
| Lenny / Grok bot article | Product inspiration | Read optional; no code |
| Morphic Grok Imagine guide | Image pipeline later | Optional media skill |
| chenyme/grok2api | Unofficial API | **Skip** — native tools exist; ToS risk |
| xai-org repos | Ranking source of truth | **Keep using** x-algorithm |
| DE0CH/grok-frontend | UI clone | Skip |
| omgpizzatnt/grok-free-web-api-vercel | Unofficial | **Skip** |
| Dokploy / Coolify / Kubero | Self-host PaaS | Only if Postiz self-host |
| spliit-app | Expense split | Irrelevant |
| hot-opensource-projects | List spam | Ignore |
| UncleJ-h/xs | Unknown thin | Ignore unless stars/docs prove |
| **ai-reply-guy** | AI draft + **Chrome debugger post to bypass API reply blocks** | **Hard ban** for Signal Origin / OCR |
| Branch Metrics iOS | Deep links | Irrelevant now |
| Countly | Analytics suite | Overkill; use X native analytics |
| Sherlock | Username OSINT | Not needed |
| **postiz-app** | **Primary publish orchestration later** | Architecture above |
| StevenBlack/hosts | Adblock hosts | Irrelevant |
| awesome-n8n-templates | Workflow glue | Later with Postiz |
| **apify-mcp-server** | Research agents | Tier-2 paid research |
| apify org | Store actors | Same |
| MoneyPrinter* (all) | Bulk AI YouTube | **Hard ban** — sludge + OCR risk |
| moneyphp / RubyMoney | Currency libs | Irrelevant |
| zcash | Crypto | Irrelevant |
| automatisch | OSS automation | Alternative to n8n later |
| easychen howto-make-more-money | Essay list | Optional read |
| mezod/awesome-indie | Indie links | Optional |
| Wallos | Subscription tracker | Personal finance only |
| OSS internships list | Irrelevant |
| **XiaomingX/ai-money-maker-handbook** | Side-hustle museum | Idea scan only; many wrappers |
| show-me-the-money | List | Low |
| Gemini Discord bot | Irrelevant |
| 10up/classifai | WP AI | Irrelevant |
| **bradautomates/content-ideas** | Competitor engagement → ideas (ScrapeCreators) | **Useful ideation plugin** — ideas only, still Pass gate |
| awesome-seo | SEO links | Secondary |
| awesome-generative-ai-apps | Catalog | Skim |
| Pintree | Bookmark UI | Skip |
| saasify | Legacy SaaS | Skip |
| **PayDevs/awesome-oss-monetization** | Monetization taxonomy | Use for qi-check pricing modes |
| velobase-harness | Unclear | Low |
| lbry-sdk | Decentralized video | Out of scope |
| **cporter202/agentic-ai-starters** | Planner/worker/reviewer patterns, social listening, SEO content | **Steal patterns**, not deploy whole |
| XPack-MCP-Marketplace | MCP catalog | Browse later |
| **tweazy** | X automation class | **Ban** same as reply-guy |
| Build-Share-Sell OpenAI Assistants | Assistants marketplace era | Mostly outdated pattern |

---

## 4. Real leverage stack (ordered)

1. **Quality Pass content** (SO-010 → next non-meta) — only path to OCR thresholds  
2. **qi-check micro-tool** — paid-access / open-core from OSS monetization list  
3. **content-ideas style research** — competitor overperformers → *our* angle (not copy)  
4. **Postiz + our Pass gate** — when manual prove-out done  
5. **Apify MCP** — optional paid research, never publish path  
6. **agentic-ai-starters patterns** — reviewer agent = our adversarial seat in code  

Everything else is distraction or active harm under OCR + 110% bar.
