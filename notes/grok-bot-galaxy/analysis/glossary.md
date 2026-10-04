# Glossary — every recurring word, category and system in the Grok Bot Galaxy material

Built from the 10 session transcripts (61,506 words), the event page, and the Grok Bot product
pages. Where a term is garbled by auto-captions, the correction is given. Sources are marked
`[site]` (x.ai pages), `[transcript]`, or `[demo]` (fictional asset used on stage).

---

## 1. Company and product names

| Term | What it is |
| --- | --- |
| **SpaceXAI LLC** | The company behind x.ai in this material (footer of every page). Captions render it as "SpaceX AI", "Spacex AI", "SpaceX AAI". Staff say "SpaceXAI" and, in the Sales session, "Spacex AI". |
| **Grok Bot** | The product the whole event is about: a team of AI agents ("bots") that each get their own cloud computer and are messaged like colleagues. Captions mangle it as Grockbot / Grokbot / GrokBot / Grabot / Grubbot / Grogbot / Rockbot / GrobBot / Grockpot — 197 normalised mentions across the transcripts. |
| **Grok** | The model family (Grok 4.6 named on the pricing page; Grok 4.7 named on the Grok Build page). Chat, Build, Imagine, Voice, Bot and Grokipedia are the product surfaces in the site nav. |
| **Cursor** | The coding product/company now folded into SpaceXAI. Cursor Pro/Pro+/Ultra and Cursor Teams (Standard/Premium) are the plans that gate Grok Bot access; Cursor cloud agents are the first-party integration Grok Bot orchestrates. |
| **Grok Bot Galaxy** | The three-day event (Sept 15–17, 2026, The Howard, 661 Howard Street, San Francisco; 8:45am–6:00pm PT; also livestreamed). |
| **Grokipedia** | A product surface listed in the site nav. Mentioned only as a link. |

## 2. Core product concepts (the "systems")

| Term | Definition as used in the sessions |
| --- | --- |
| **Bot** | A single named AI agent with its own computer, its own memory and its own job. The unit of work in Grok Bot. |
| **Its own computer / own VM** | Every Grok Bot shares one persistent cloud computer per user (files, browser, logins). It is the reason bots can sign into tools that have no API and use them "just like you do". Isolation is per user, not per bot `[site: /bot FAQ]`. |
| **Routines** | Scheduled or event-triggered runs — described in the support session as "cron jobs or event-based triggers". Can fire on a schedule, a webhook or an inbound signal. |
| **Automations** | The Cursor-era predecessor of routines: agents started by triggers (e.g. a Slack message) rather than by a human. |
| **Memory** | Per-bot persistent context. Bots "keep context and learn from each other"; memory is scoped per bot, which is the stated reason to have many named bots rather than one. |
| **Skills** | Reusable taught procedures. Shown in the Sales Engineering session, where a skill is taught to one bot and then inherited by bots it creates. |
| **Cloud agents** | Cursor's cloud-hosted coding agents. Grok Bot has a first-party integration: it can start them, read their transcripts, verify their output and merge their PRs. |
| **Marketplace** | The template catalogue at `/bot/marketplace` — 80 published bots plus 4 featured (81 rows in `data/marketplace.json`), filterable into 9 categories. "Bots are meant to be multiplayer." |
| **Use cases** | The catalogue at `/bot/use-cases` — 56 role-shaped bot briefs across 9 categories (`data/use-cases.json`). |
| **Chief of staff** | The most repeated architectural pattern of the event: one front bot that holds the context and routes work to specialists, so the human talks to one agent. |
| **Guardrails / Auto Review** | Read-only first, then writes; manual approval for specific actions; per-bot permission scopes; sensitive actions can route through Auto Review `[site]`. |
| **Traces and evals** | Observability on what a bot is thinking and about to do, used to validate behaviour before letting it act (support session). |
| **Group chats / bot-to-bot** | Bots can be put in the same thread and pass work between themselves; used for standups, war rooms, EPD pods. |
| **Voice bot** | A bot trained to write in your voice, from your sent email/Slack history (Founders and Post Sales sessions). |
| **Computer use / take over** | A human can click through the bot's computer to complete logins, MFA or human-verification steps. |
| **Private workers** | Running bot-started agents on your own machines (e.g. Macs) rather than only in the cloud (Engineers session). |

## 3. Categories and role taxonomy

**Marketplace categories** (9): From Grok Bot Team, Engineering, Sales, Marketing, Design, Personal,
Recruiting & People, Product, Operations.

**Use-case categories** (9, with published counts): General (6), Sales (10), Marketing (13),
Customer Success & Support (4), Recruiting & People (4), Operations & Finance (5), Product (5),
Engineering (5), Life & Leverage (4) — 56 total.

**Session role categories** (the event's own segmentation): Engineers · Product Managers · Founders ·
Sales Engineers · Sales · SDRs · Customer Support · Marketing Operations · Post Sales · Marketing.

**Grok Bot plan gating** `[site: /bot]`: included with Cursor Pro/Pro+/Ultra, Cursor Teams
(Standard/Premium), SuperGrok, SuperGrok Plus, SuperGrok Heavy, and Enterprise. Weekly usage is
included; overage is billed on token cost.

## 4. Tools, integrations and surfaces named across the sessions

Slack (57 mentions, by far the most) · Microsoft Teams · Notion · Salesforce (CRM) · Gmail ·
Google Calendar · Google Docs · Google Drive · Google Sheets · Linear · Jira · Figma ·
Granola (call recording/notes) · Gong · Amplitude · Stripe · Snowflake · Supabase · Zendesk ·
Intercom · Plane (ticketing) · Zoom · Confluence · GitHub · LinkedIn · Vercel (captioned "Verscell"/"Versel") ·
Cursor cloud agents · TestFlight · MCPs and APIs generally · cron/scheduled routines · SSO/SAML/OIDC ·
DLP/proxy/network controls (enterprise) · OpenClaw and Hermes (agents the Founders/import story compares
against) · "Claude Cowork, Codex, ChatGPT, OpenClaw, Hermes" (the import sources listed on the
marketplace's Import Bot template).

## 5. Event-specific and demo assets

| Asset | Where it appears |
| --- | --- |
| **Fly Low Airlines / Flylo** | The shared demo environment (`[demo]`) used in the PM, Founders and Marketing sessions — an airline booking product. |
| **Northwind** | Demo customer in the Founders session `[demo]`. |
| **XAIR** | Net-new airline product built as the subject of the Marketing session's end-to-end campaign `[demo]`. |
| **Matt, Lauren, Roshan** | The "cooking session" hosts who take the livestream back between workshops. |
| **Day 1/2/3 Broadcasts** | Three X broadcasts (see `data/broadcasts.json`) that carry the full days including the sessions not published individually. |
| **QR-code coasters** | Physical cards at the venue linking to marketplace bot templates. |

## 6. Bot names collected from the sessions

Named bots are the clearest cultural signal of the event — every speaker ran a *team* of named
agents, and several named them after music hardware or their dog.

- **Engineers:** chief of staff ("Link Shishi" — spelling uncertain), Craig (UI), Steve (DevX),
  Hogan (infra), Nightly (the marketplace Nightly Audit Engineer, renamed to Steve).
- **PMs:** Cora (chief of staff), Emily (eng manager), Ashley (data science), PMP Pete (product),
  Pixel (design), Rey (recruiting); engineering bots named Einstein, Eigor, Nova, Larry, Eileen.
- **Founders:** Closebot, Prodbot, Stockbot, Protobot.
- **Sales Engineering:** Sherlock (source of truth), Serena (competitor testing), Mimi (case-study
  slides), Battlecard Blair, Demo Drake, AI Radar.
- **Sales:** Olive (chief of staff, named after her dog), PG (outbound), Echo (call-to-deck),
  customer-expert bot, engineer bot.
- **SDRs:** chief of staff + email/outbound bot (deliberately few).
- **Customer Support:** Build, Reply, Alert, Tune.
- **Marketing Operations:** OP1 (after the Teenage Engineering OP-1), Fiser, Juno, Ondes (captioned
  "owned"), territory-planning bot.
- **Post Sales:** Gus (chief of staff, manages ~10), Frankie (follow-ups), Wally (voice).
- **Marketing:** market researcher, product marketer, website ops, performance marketer, marketing
  analyst, project manager.

## 6b. Terms added in the second pass (guides, news corpus, marketplace payload)

| Term | What it is |
| --- | --- |
| **Five primitives** | The design vocabulary from the Sep 3 essay: **Bots** (persistent agents with identity, memory, runtime, tools), **Chats** (the conversational surface), **Prompts** (one-off, saved as **Skills**, triggered as **Routines**), **Tools** (APIs, connectors, shell, computer use), **Artifacts** (durable outputs). |
| **Capability vs context boundary** | Architecture rule: Tools and Skills are account-scoped; Memory and Routines are bot-scoped. |
| **Reviewer / review agent** | A separate agent that checks proposed actions against allow/block lists and can allow, block or escalate. Rules are natural-language, set in Settings > General > Agent. |
| **Avatar state system** | idle · working · waiting · blocked · thinking · done — carried by the bot avatar's motion. |
| **Three computer access levels** | status (title-bar icon turns purple) · preview (pinned side panel) · takeover (full screen, then hand back). |
| **Share as Template** | Packages skills, memories, routines and plugins — a recipe, not a clone. Excludes personal memories, secrets and custom code. Can be team-only or public via link. |
| **Group chat / handoffs** | Bots in one thread pass work directly; a bot handing work to another bot is what makes it a team. |
| **Attention list** | PM work primitive (Kevin Niparko): an emergent list of what you're actually focused on, derived hourly from email, Slack, Granola and calendar — replaces the stale priority list. |
| **Anti-slop skill** | Krista Letz's standing skill for filtering output she doesn't like. |
| **Outer loop / inner loop** | Engineering pattern: Grok Bot gathers context and writes the prompt (outer loop); a Cursor cloud agent does the build (inner loop) — keeps dirty context away from executors. |
| **P0 urgency process** | Saying a task is P0 starts a temporary 5-minute-check routine that steers the cloud agent; explicitly token-hungry. |
| **Haggle Bot** | The procurement agent: > $100,000 found, full system prompt published. |
| **Amazon Bot** | The second procurement bot that places the weekly office order (Gmail, Ramp, Google Sheets, Rippling, Vercel). |
| **Jenny** | Lingxi Li's non-coding head-of-operations bot: 5am 1:1s with every engineer bot, postmortems, playbook updates, onboarding new bots. |
| **Quill / Baltata / Shaoruru / Hogan / Craig** | Lingxi's five engineer bots: harness, mobile/iOS shared layer, desktop client + CI/CD, infrastructure, Android. |
| **Self-improvement scan** | Weekly (Wednesday) routine that audits your own bot setup for manual work that should be automated. |
| **Voice learning** | Diffs what a bot drafted against what was actually sent, and feeds the delta back to the voice bot. |
| **Project Ops skill** | In Eric Zakariasson's multi-team pattern: creates a project, opens a channel, staffs it with existing bots. |
| **Six-seat studio pattern** | Ryan Perry's mobile-game org: Mobile Orchestrator, Analytics Agent, Creatives Agent, Rank'em Engineer, GCS Agent, Bug fix Agent — each with a job description. |
| **Rank'em** | Ryan Perry's mobile game, the third-party case study (1,000 downloads; 15x CPI, 4x D7). |
| **XAIR / X-Air** | The fictional airline used in the Marketing workshop *and* the marketing guide. |
| **Plain** | The ticketing system SpaceXAI support runs on (the site's Solutions page also references Zendesk/Intercom). |
| **Datadog** | Backend error source wired into the support bot. |
| **Hex** | Analytics surface used by Haggle Bot. |
| **Ramp** | Spend/expense system at the centre of the procurement workflow. |
| **Rippling** | HR system used by Amazon Bot for headcount. |
| **Legora / Supermicro / ServiceTitan** | Named enterprise customers in the Sep 3 post. |
| **Roman / Fiona / Vincent / Bennett / Emma** | Internal testimonial voices quoted in the launch post, by function (Product, Community, Growth, Sales, Operations). |
| **Free X API credits** | Bundled with paid Grok Bot when connecting an X account. |
| **Grok Bot's own usage** | The decoupled meter: handoffs don't consume Grok or Cursor plan usage; weekly allowance included, overage billed on token cost. |
| **Auto Review** | Sensitive actions can route through review before they run (`/bot` FAQ). |

## 7. Numbers stated in the sessions

| Number | Context |
| --- | --- |
| Double-digit % of merged PRs | Grok Bot's share of internal merged PRs at SpaceXAI (PM session) `[transcript 00:08:58]`. |
| 15 cloud agents | The number of Cursor cloud agents the engineer was managing before Grok Bot `[00:04:07]`. |
| 3am / 4am | When the nightly audit runs (engineer's own setup vs the marketplace default). |
| ~10 minutes | The window before on-call is paged if the bot hasn't resolved a CI failure. |
| $1–$2 per ticket | Cost to answer a medium-to-complex support ticket. |
| ~20¢ per ticket | Cost after batching low-complexity tickets with a script (about half a day of tuning). |
| $1–$10 per resolution | Typical commercial support-agent pricing, for comparison. |
| 100 runs/day | What a 15-minute routine costs you — the cautionary token example. |
| 1,400 tickets yesterday; 58% web / 42% mobile; 25% family | Demo data points in the PM session `[demo]`. |
| $1,000 credits | The activation-incentive example in the Founders session `[demo]`. |
| 6+ months | The customer tenure threshold in the support session's churn-alert example. |
| 15–20 minutes | How long a founder has on a customer call, per the Founders session; also the lead time on the Post Sales call-prep routine. |
| 80 templates / 56 use cases | Marketplace and use-case catalogue sizes `[site]`. |
