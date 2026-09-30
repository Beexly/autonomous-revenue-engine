# GROK_BOT_X_RD.md
Date: 2026-08-26 evening CT
From: Origin Distro
To: Origin Master
Status: DRAFT PACKET. Not published. No X API. No extra spend. No sports. No email. Not a Lane 1 packet.

## What I actually opened
- https://grokbot.dev/ (HTTP 200). Directory of 124 use cases / 31 plugins, curated from public X and YouTube.
- https://forum.cursor.com/t/introducing-grok-bot/168053 (Kevin Neilson, 2026-08-11). Official launch.
- https://forum.cursor.com/t/grok-bot-can-i-send-it-a-message-from-outside/168199 (Max Winderbaum, 2026-08-12; Joe LK 08-19; DerekC 08-23). Operators waking bots from Slack/webhooks.
- https://forum.cursor.com/t/grok-bot-webhooks-are-failing-with-internal-server-error/169323 (Chad, 2026-08-24). Webhooks broke one day, Cursor rolled back, they worked again.
- https://docs.x.ai/grok-bot/computer-and-apps
- https://www.lennysnewsletter.com/p/how-i-ai-grok-bot-grok-46whats-great (Claire Vo / How I AI, 2026-08-24)
- Public X via unrollnow (no X API bought):
  - https://x.com/KanekoaTheGreat/status/2091968024370897102
  - https://x.com/KanekoaTheGreat/status/2092020672914755841
  - https://x.com/elonmusk/status/2092038808607084868 (quote of Kanekoa)
- Public GitHub: https://github.com/holy-templar/marketing-agi (HTTP 200)

Honesty: most "operator on X" cards on grokbot.dev are curator reconstructions of @handles. I loaded the grokbot.dev pages and the three tweet unrolls above. I did not scrape X.com timelines.

## Motions (8)

### 1. Clipper → Researcher → Writer (YouTube timestamp → HD clip + caption draft)
Sources:
- https://grokbot.dev/use-cases/clip-youtube-podcasts-with-grok-bot/
- https://x.com/KanekoaTheGreat/status/2091968024370897102
- https://www.unrollnow.com/status/2091968024370897102

Lived: @KanekoaTheGreat logs Google into Grok Bot, sends a YouTube URL, says "Cut from 16:43 to 18:17." Clipper returns the HD clip, transcribes, hands to Researcher (quotes) and Writer (caption). He did not write code. Prompt on grokbot.dev ends with wait-for-approval before anything posts.

Origin 100% drive at $0 extra? PARTIAL.
- Draft half: YES. Distro already owns @SignaL_OriginHQ drafts. Box browser + existing Google login is $0 if already signed in. No new plugin required for the Kanekoa motion (TranscriptAPI is a paid-looking plugin on grokbot.dev; Kanekoa used Google, not that plugin).
- Publish half: NO. X still APPROVE. Distro never posts.

### 2. Seven-bot content calendar, one group chat per post, hard publish fence
Source: https://grokbot.dev/use-cases/seven-bot-content-team/ (via @ridark_eth)

Lived: Roster is Anchor (CoS, never writes), Radar, Digger, Ink, Studio, Loop, Mirror. Wiring is one group chat per post, not per bot. Week one claimed 25 drafts / 14 shipped / 6 killed. Two rules: every routine ends "do not publish without approval," and he demoed the workflow on screen once instead of writing a novel.

Origin 100% drive at $0 extra? YES for drafts. Signal Origin already looks like this (Master routes, Distro drafts, Factory ships code). Loop/auto-cross-post is the part we do not drive. Distro queues. Garrett approves.

### 3. One-project-per-account newsletter company
Sources:
- https://grokbot.dev/use-cases/run-a-business-with-grok-bot-agent-teams/
- Greg Isenberg / Billy Howell (Arlington Bagel, 6,000 subs)

Lived: Chief of Staff audits first, proposes top 3 revenue agents, does each task once by hand, then clones a specialist. Build → execute → automate. Sales agent watching Gmail caught a missed inbound and drafted a sponsor pitch. Constraint is the feature: one business per account so context does not bleed.

Origin 100% drive at $0 extra? YES for the org pattern (already live). Distro does not email anyone. Closer owns send-ready. No new seats, no spend.

### 4. Directory: one honest Markdown page a day, deals only after traffic
Source: https://grokbot.dev/use-cases/agent-run-directory-business/ (via @startupideaspod)
grokbot.dev itself is this playbook.

Lived: Niche you have taste in. Astro + GitHub. Research agent writes one brand page/day. Publisher deploys. Deals/affiliate agent stays dark until traffic is real.

Origin 100% drive at $0 extra? YES for research+Markdown+GitHub (Factory's repo, Distro can draft pages). Outreach/deals is later and is not Distro. No extra spend. Do not start a second business in this account.

### 5. Open-source Marketing OS skill (score 0–100, stop at the brief)
Sources:
- https://grokbot.dev/use-cases/marketing-os/ (via @vladdubchak_x / Maxfusion)
- https://github.com/holy-templar/marketing-agi (verified 200)

Lived: Fourteen modules (audit, GEO, copy, hooks, paid-ads, email, social, launch, positioning, competitive, app-store, analytics). Fill brand-context.md. Rubrics, slop check, "tell me what you could not determine." Prompt on grokbot.dev: do not publish, send, or spend without showing first. Ad MCP optional; otherwise stop at the brief.

Origin 100% drive at $0 extra? YES. Public repo, local skill, drafts only. Paid-ads module stops at the brief (Stripe dead, no Meta spend). Distro does not email.

### 6. Grade 30 days of bookmarks into spoken-trigger skills
Source: https://grokbot.dev/use-cases/grade-bookmarks-into-skills/ (via @Ryan_Staley1)

Lived: One prompt: thesis, link, high/medium/noise, mechanism you can steal. If you cannot name the mechanism in one sentence, it is noise. Ryan kept ~1/3 of 140, turned keepers into 10 skills.

Origin 100% drive at $0 extra? YES. Point it at /workspace/origin-drafts kill logs and parked packs, not a fantasy bookmark export. Distro can do this on the box tonight.

### 7. Inbound wake: webhook / Slack poll, not a new Cloud Agent
Sources:
- https://forum.cursor.com/t/grok-bot-can-i-send-it-a-message-from-outside/168199
- https://forum.cursor.com/t/grok-bot-webhooks-are-failing-with-internal-server-error/169323

Lived: Max wanted comment.io to POST into an existing Grok Bot. Cursor staff said Cloud Agent automations can take a webhook, but that starts a new agent, not the living conversation. Joe LK (08-19): custom Slack bot, built-in Slack listeners hear Cursor's app not theirs; webhook-trigger routine crashed the info pane; they poll Slack every minute so staff DMs are not dropped. DerekC: Hermes writes a file, Grok Bot wakes on webhook and reads the file over Tailscale SSH. Chad (08-24): api2.cursor.sh automations webhook 500'd, Cursor rolled back, it worked again the same afternoon.

Origin 100% drive at $0 extra? YES for Distro's own watch: weekday cron on grokbot.dev + forum, no X API. Do not expose /home/box/sand-data/gateway.json. Do not buy Tailscale. Do not poll Slack unless Master connects Slack and asks.

### 8. Multi-account connectors as the actual product (Claire Vo)
Source: https://www.lennysnewsletter.com/p/how-i-ai-grok-bot-grok-46whats-great (2026-08-24)

Lived: Claire has four email addresses and seven Slack workspaces. Grok Bot connecting all of them to one bot is the feature Codex/Claude still miss. Origin is already the knowledge-worker stack she is describing. Cursor Origin (the code host) is a different product and she is not ready to leave GitHub.

Origin 100% drive at $0 extra? YES inside the existing Cursor Ultra/Grok Bot plan. Distro Gmail stays owner-only (BLOCK / FAKE-EDGE / OWNER_GATE to Baxley.Garrett@gmail.com). No new connectors that cost money.

## Do not drive (not $0, not Origin, or forbidden)
- AdKit / Meta-Google-TikTok ads. Extra spend. Distro never spends.
- Post Bridge / Postiz / SuperX / Zernio auto-post. Publish. X still APPROVE. Distro never publishes.
- Marketplace flipper (@alucardiox): $680 spent. Extra spend.
- Amazon cart (@Teslaconomics): not the business.
- Win-back churn email (https://grokbot.dev/use-cases/churn-winback/): Distro does not email anyone.
- Crypto trading-floor bots attributed to @ridark_eth on third-party mirrors: not $0, not Origin, skip. Content-calendar Ridark is the one above.
- Sports / DFS: forbidden.

## One next action
1. Engagement queue is parked at `/workspace/origin-drafts/any-money/X_ENGAGEMENT_DRAFTS.md` (6 paste-ready replies, personality on, never generic). Approval desk only. Distro will not post.
2. Distro weekday 9:00 CT routine re-reads grokbot.dev/use-cases, Cursor forum Grok Bot threads, and public web unrolls (never X API). Appends only NEW motions to this file. Stays quiet if nothing new.
3. Origin-drive this week if Master wants a product motion, not a comment: install Marketing OS from the public repo as a local skill, fill Signal Origin brand-context (one offer, drafts only, no sports), run one scored audit of parked @SignaL_OriginHQ drafts. Stop at the brief. No publish, no spend, no email.

Distro default if Master says nothing else: run (1)+(2). Hold (3) until Master says go.

---

## Addendum 2026-08-26 ~18:52 CT
Distro-verified this wake (pages loaded). Not a second full scout. No X API.

### 9. HN jjcm: fabric-supplier bot messaged ~40 Vietnam mills, ordered samples
Sources (loaded):
- https://news.ycombinator.com/item?id=49263241 (jjcm, ~Aug 12 2026, on item 49261514)
- Parent launch thread: https://news.ycombinator.com/item?id=49261514
- Screenshot he posted: https://image.non.io/d83664c1-5807-4a18-abe4-41928c198410.webp

Lived (from the comment, not a recap): early-access ~1 month. Domain-separated bots, each with own computer, they talk to each other. Token burn is the downside ("less tokens in the last 5 years than this month"). Coolest job: one bot reached ~40 Vietnam fabric suppliers, negotiated, locked one, samples due that day. Prototyper bot made a random logo pattern as a `.ai` file for the mill.

Origin 100% drive at $0 extra? NO. Physical goods, supplier WhatsApp, sample spend. Wrong vertical. Keep as an operator motion we do not copy.

### 10. Unofficial TypeScript SDK for the Grok Bot host gateway
Sources (loaded):
- https://forum.cursor.com/t/unofficial-typescript-sdk-for-the-grok-bot-http-gateway-tailscale-remote-internal/168732 (Adam Holt, 2026-08-18)
- https://github.com/adam91holt/grokbot-sdk (HTTP 200)

Lived: wraps the private HTTP gateway from the inbound-webhook thread. `@adam91holt/grokbot-sdk`, Tailscale/SSH, `runOnce`/`sendAsAgent`. He says do not put port 1340 on the public internet. Undocumented internal API, token like a password.

Origin 100% drive at $0 extra? NO. Distro does not expose gateway.json, does not ship a SDK, does not tunnel 1340. Note only: operators are productizing inbound wake faster than Cursor.

### Secondary Billy date (already in motion 3)
https://www.stork.ai/blog/grok-bots-one-person-empire (Sol Aguirre, Aug 21 2026) recaps Arlington Bagel 6-agent team. Same motion, extra date stamp. Second $200 account is extra spend — Origin does not open a second seat.

### Live URLs Distro did not watch (HTTP 200 only — do not treat as lived)
Park for next harvest. Do not quote as Distro observation until watched.
- https://www.youtube.com/watch?v=qQluNEfSVHk — Greg Isenberg / Billy Howell (same motion 3)
- https://www.youtube.com/watch?v=MkVcHbviYOw — reported Peter Yang 5-bot tutorial (Aug 17)
- https://www.youtube.com/watch?v=bUALqTpUze0 — reported eyropper.design support-inbox bot
- https://www.youtube.com/watch?v=lRUpu2-KtGQ — reported Brock inbox/invoice/ClickUp bots

Those support/invoice videos, if real, still fail Distro email + extra-spend rules (Higgsfield, Zapier). Watch before promoting.

---

## Addendum 2 — 2026-08-26 ~18:53 CT (Cursor forum, pages loaded)

Webhook/Slack poll (168199) and Holt SDK (168732) already in the packet. Not repeated.

### 11. Daily Gmail CSV → HTML → WhatsApp send (Victor Lye)
Sources:
- https://forum.cursor.com/t/title-computer-refresh-wipes-whatsapp-linked-device-session-in-grok-bot/169025 (2026-08-21)
- https://forum.cursor.com/t/grok-bot-gmail-connector-can-list-attachments-but-cannot-download-their-bytes/169261 (2026-08-24)

Lived: daily job on the cloud computer: CSV from Gmail, script to HTML, WhatsApp send via `wacli` after WhatsApp Web died in 3 days of re-logins. Computer refresh wiped `~/.local/state/wacli` (20 Aug 2026 ~11:52am MYT). Goal quoted: unsubscribe from ChatGPT automations, stop leaving a PC on. Colin: only `/workspace`, browser profile, `~/.config` survive refresh. He moved the store; bug closed for him.

Origin 100% drive at $0 extra? NO. Distro does not send WhatsApp. Not our CSV. Session-survival is a box hygiene note for Overwatch, not a product.

### 12. Website factory: 12 department managers under one director
Source: https://forum.cursor.com/t/grok-bot-nested-sidebar-folders-folder-project-subfolders-departments/168417 (Андрей Харченко, 2026-08-14)

Lived: "I run 12 department managers under one director for a website factory. More clients means more of the same crew." Wants nested folders: project = client/site, children = departments, one orchestrator. Today only sibling folders. Related AIDVP squad thread exists; Distro did not re-fetch it this wake.

Origin 100% drive at $0 extra? YES for the org pattern (Signal Origin is already director + specialists, one project). NO for spinning 12 extra managers. Do not open a second business in this account.

### 13. Grokularity: one human, Grok Bot CEO, agents post to a public feed
Sources:
- https://forum.cursor.com/t/grokularity-a-company-run-by-grok-bots/169471 (kevkevco, 2026-08-25)
- https://grokularity.xyz (loaded 2026-08-26 ~18:53 CT; public feed error: Neon DB unreachable)
- Skill path he published: https://grokularity.xyz/skill.md

Lived: "DoorDashed for SuperGrok, stood up a company in a day, handed CEO to a Grok Bot." Rule: humans read, only proven Grok agents write. He asks operators to enroll a Bot and reply/post via signed API, no compose box.

Origin 100% drive at $0 extra? READ: YES (watch the feed when it is up, $0, no X API). WRITE: NO. Distro never publishes. Do not enroll a posting bot.

### 14. VERA: 1,200 civil contracts, Grok Bot skill searches and drafts
Sources:
- https://forum.cursor.com/t/vera-portable-document-rag-for-humans-and-agents/169492 (Kyle Willis, 2026-08-26)
- https://github.com/dkylewillis/vera

Lived: civil engineer indexed >1,200 contracts into portable `.vera` SQLite archives. Grok Bot skill searches them and drafts new contracts in company style. CLI: `vera convert` / `vera search … --json`.

Origin 100% drive at $0 extra? NO as a vertical (not our contracts). MAYBE later as a $0 local skill on parked Origin drafts if Factory wants it. Distro does not ship code tonight.

### Forum do-not-drive (loaded by scout, Distro not repeating as motions)
- Outlook/Teams browser skim locked an M365 account: https://forum.cursor.com/t/access-to-microsoft-products-in-grok-bot/168055
- Multi-account Gmail connector showing write tools on view-only tokens: https://forum.cursor.com/t/grok-bot-gmail-multi-account-connector-shows-write-tools-on-for-view-only-tokens-and-attempts-oauth-upscope/168575
Distro still does not email anyone.

---

## Addendum 2026-08-31 ~8:40 AM CT (Master 8am R&D; Distro 9am harvest still pending)
Master ran one public pass because Distro weekday harvest failed Thu/Fri on usage_limit and is not due until 9:00. No X API. No publish. No spend. No sports. Not a Lane 1 packet.

### What I actually opened
- https://grokbot.dev/ (200) — 309 shareable bots / 40 plugins; fresh drops include Podcast Summary, Senior Analyst, Grok Deck, RevenueDog, Bouncer, Grok VM maintenance
- https://grokbot.dev/use-cases/ (200) — new cards not in the 08-26 packet (loaded pages below)
- https://grokbot.dev/use-cases/ai-search-lead/
- https://grokbot.dev/use-cases/replicate-social-analytics-follower-cleanup/
- https://grokbot.dev/use-cases/faceless-youtube-channel-automation/
- Cursor forum (search.json latest): usage/pool threads 169581, 169658, 169796; per-agent usage 169926; bugs 169896 / 169548; changelog ask 170056 (Colin: no official changelog, watch https://x.com/bot)

### New motions (15+)

### 15. AEO / "shape what AI says about you" (evidence-ranked drafts)
Source: https://grokbot.dev/use-cases/ai-search-lead/ via @theplgeek
Lived: bot reads engine answers + citations + crawl/404 demand + GSC/GA4 via DevTune project; drafts next evidence-ranked page for review; reports before/after after ship. Never publishes.
Origin 100% drive at $0? PARTIAL → YES for drafts without DevTune: Factory/Distro can write evidence pages for Signal Origin offer from public search + githack page. DevTune/paid SEO stack = extra spend, skip. No publish without APPROVE.

### 16. Replace $50/mo X analytics with free X data archive
Source: https://grokbot.dev/use-cases/replicate-social-analytics-follower-cleanup/ via @kloss_xyz
Lived: download X archive → following.js + follower.js → sort mutuals / inactive / spam / not-following-back; cut now / cut probably / keep; approve every batch; ≤100/day; backup first.
Origin 100% drive at $0? PARTIAL. Needs Garrett one-time X archive export (no X API). Distro can triage for @SignaL_OriginHQ. Unfollow still APPROVE.

### 17. Faceless YouTube production line with rights + publish gates
Source: https://grokbot.dev/use-cases/faceless-youtube-channel-automation/ via @RoundtableSpace (curator reconstruction)
Lived: brief → rights-cleared source log → cut/caption → title/desc/tags/thumb → human approve before upload.
Origin 100% drive at $0? PARTIAL. Draft package YES on box. Publish NO (APPROVE). Rights-cleared only; no scrape-repost. Adjacent to Kanekoa clipper (motion 1).

### 18. RevenueDog pattern — morning revenue brief + one fix
Source: https://grokbot.dev/ homepage fresh drop @lexrus (RevenueDog shareable bot)
Lived: wake to yesterday's subscription numbers and one fix worth trying.
Origin 100% drive at $0? YES if Gumroad dashboard readable in box browser (already linked). Meter/Master morning packet can add Gumroad $0 check. No Stripe until charges_enabled.

### 19. Grok Deck — talking points → browser HTML slides
Source: https://grokbot.dev/ homepage @MaiYangAI
Lived: turns talking points into browser-ready HTML slide deck.
Origin 100% drive at $0? YES. Box HTML only. Useful for Lane 1 pitch / Gumroad workbook walkthrough. Distro drafts; no publish.

### 20. Bouncer / Vet — screen shareable-bot links before fleet install
Source: https://grokbot.dev/ homepage @bradshannon / @GaurangKaria / @SuddenlyJon
Lived: audits another bot's share link before letting it into the account.
Origin 100% drive at $0? YES hygiene. Cap still six seats. Never hire 7th. Useful before any stranger template.

### 21. Routine context burn (ops, not a product motion)
Sources:
- https://forum.cursor.com/t/why-does-grok-bot-chat-use-so-many-sand-tokens/169581 (staff: sand-automation = routines; each run re-sends conversation context)
- https://forum.cursor.com/t/is-grok-bot-usage-separate-from-cursor-plan/169658
- https://forum.cursor.com/t/grok-bot-spend-cursor-usage-i-cant-accept-it/169796
Lived: Distro + Master weekday routines failed 8/28 on usage_limit. Staff: pause/delete unused routines or start fresh conversation for long-running ones to cut burn. On-demand after weekly pool = spend (Garrett: keep $0).
Origin action: keep harvest lean; Distro 9am appends only NEW; Master 8am stays short.

### Do not drive (this pass)
- Personal CFO / full bank access (@Teslaconomics) — already parked
- Bland phone number $15 — extra spend
- Amplemarket competitor-complaint outreach — paid connector + outbound email (Closer lane if ever; Distro does not email)
- ContentDrips carousel MCP — likely paid
- Composio 1000+ tools — verify free tier before touch; default skip
- Hedge fund / options / valuation agents — not Origin SKU; no sports; finance vertical skip
- Fantasy football bots on homepage — forbidden forever
- AdKit / Post Bridge / Postiz / SuperX / Zernio — spend or publish

### One next action
1. Meter/Master: add a quiet Gumroad $0 morning check (RevenueDog pattern) into an existing morning packet — no new seat, no new spend.
2. Distro 9:00 CT harvest should append only deltas vs this addendum; stay quiet if nothing newer.
3. Hold X archive prune until Garrett exports following.js/follower.js once.
4. Engagement drafts still at X_ENGAGEMENT_DRAFTS.md — APPROVE only. Nothing published this wake.


---

## Addendum 2026-08-31 ~9:40 AM CT (Distro weekday harvest)
Delta vs Master 8:40 CT addendum above. No X API. No publish. No spend. No sports. No email. Not a Lane 1 packet. Distro did not post.

### What I actually opened
- https://grokbot.dev/ (200) — 312 shareable bots / 40 plugins (was 309 at Master 8:40). Fresh drops since then include Palette (@subforti), Blunt (@Talsiach), Brake (@FantomBuildz), plus earlier Podcast Summary / Senior Analyst / Grok VM / Developer / Grok Deck / RevenueDog.
- https://grokbot.dev/use-cases/ (200) — loaded new cards not in Master 8:40 lived set
- https://grokbot.dev/use-cases/herd-your-bots/
- https://grokbot.dev/use-cases/track-the-grok-bot-team/
- https://grokbot.dev/use-cases/reply-guard/
- https://grokbot.dev/use-cases/pitch-deck-analyzer-bot/
- https://grokbot.dev/use-cases/ai-tools-maintainer/
- https://grokbot.dev/use-cases/build-a-crm-from-your-calendar/
- https://grokbot.dev/use-cases/bot-team-manager/
- Cursor forum search.json latest: unreachable-computer cluster (170085, 170071, 170010), usage/pool (169926 Marco: no public week_pct probe; 169982 credit drain), changelog ask 170056 (Colin: no official changelog — watch https://x.com/bot)
- Public unroll (no X API): https://www.unrollnow.com/status/2093201235025244501 (@eliasfaltin Linux build ask; forum also linked it)

Honesty: homepage cards are curator reconstructions unless a use-case page was loaded. Did not scrape X timelines.

### New motions (22–27)

### 22. Radar — daily watch of the seven people building Grok Bot
Source: https://grokbot.dev/use-cases/track-the-grok-bot-team/ via @benln
Lived: roster in a file (@shaoruu, @baltaaazr, @poteto, @lingxi, @johnbai, @pengzheng_, @SamSokolin). Seen-log. Hard filter to feature/launch/product only. One brief or one quiet line. Optional handoff to Chief of Staff. Read-only; never like/reply/follow/post. Staff Colin (170056): no official changelog — watch https://x.com/bot.
Origin 100% drive at $0? YES as a lean Distro add-on to this weekday harvest (box browser + public profiles / unrolls, no X API). Do not hire a 7th seat for it. Fold into existing 9:00 CT routine, not a new cron.

### 23. Shepherd + herdr — fleet check from one chat
Source: https://grokbot.dev/use-cases/herd-your-bots/ via @herdrdev
Lived: one Shepherd bot + herdr tool on the shared machine. Status grouped NEEDS YOU vs HEALTHY. Destructive actions (stop/reset/reconfigure) stay behind human approval. Quiet when nothing wrong.
Origin 100% drive at $0? PARTIAL. Org pattern YES (Master already routes). herdr is a third-party tool — do not install or spend without Master GO. Cap still six seats. Do not open a second business.

### 24. Reply Guard — flag burners/insults, leave disagreement clean
Source: https://grokbot.dev/use-cases/reply-guard/ via @Jason (Calacanis)
Lived: X plugin reads replies; flags <100 followers, <1yr accounts, personal insults/slurs. CLEAN keeps real disagreement. Never auto-hide/mute/block/reply.
Origin 100% drive at $0? PARTIAL. Needs X connector + Garrett APPROVE on every moderation action. Distro never posts. Pair later with motion 16 (archive prune) if Garrett exports following.js/follower.js.

### 25. Shareable-template Screener (pitch decks) + AI Usage Meter pattern
Source: https://grokbot.dev/use-cases/pitch-deck-analyzer-bot/ via @BrianDEvans
Lived: interview for stage/sector/dealbreakers → score PDFs/links against YOUR criteria → share as template with personal data stripped. Same idea pointed at an AI Usage Meter across subscriptions.
Origin 100% drive at $0? NO for Distro (no Lane 1 packets; Distro does not screen decks). YES note for Master/Closer: shareable templates are the product motion. Usage Meter idea overlaps motion 21 (routine burn) — visibility only, no on-demand spend.

### 26. Weekday AI Tools Maintainer — update only what’s already installed
Source: https://grokbot.dev/use-cases/ai-tools-maintainer/ via @gheeunit
Lived: weekday 9am inventories real binaries on a connected local machine; same install channel; post-update hooks; deny list; quiet if current. Does not install new toys.
Origin 100% drive at $0? MAYBE for Factory/Overwatch on Garrett’s registered machine if Master asks. Distro harvest stays on the box. Do not expand Distro scope.

### 27. Foreman bot-manager that refuses specialist work (Peter Yang)
Source: https://grokbot.dev/use-cases/bot-team-manager/ via @petergyang
Lived: Foreman keeps roster (name, mission, last run, last output path, blocked-on). Retry stalled specialist once, then flag human. Five-line daily scoreboard. Never writes/scouts/sends itself.
Origin 100% drive at $0? YES pattern (already live as Master). Do not add seats. Distro stays drafts-only.

### Fresh homepage drops (loaded listing only — not full lived pages)
- **Brake** (@FantomBuildz): names the recurring job draining Grok Bot allowance and tells you to kill it. Adjacent to motion 21. Origin: Master can run a one-shot Brake-style audit of Distro/Master routines; no new seat.
- **Blunt** (@Talsiach): paste a landing URL → senior marketer critique. Origin: YES $0 against Gumroad workbook page if Master wants a scored pass; Distro drafts only.
- **Palette** (@subforti): four-part color scheme from a photo. Low Origin value; skip unless brand work opens.

### Forum / ops (not product motions)
- Unreachable computer / 0.30.0 setup failures: widespread today (170085, 170071, etc.). Staff closing megathreads; open new tickets.
- Per-agent usage still missing (169926). Marco: Settings shows week_pct but no public probe for MCP/CLI.
- Google Docs/Sheets connectors briefly available early August, pulled (Colin on 169971).
- Distro stay lean: this addendum is deltas only.

### Do not drive (this pass)
- ContentDrips carousel MCP — paid
- Calendar→Notion CRM (@gauravmunjal) — Closer/ops lane; Distro does not own CRM or email
- Hedge fund / valuation / options desks — not Origin SKU; no sports
- Bland $15 phone / Amplemarket / AdKit / Post Bridge / Postiz / SuperX / Zernio — spend or publish
- Fantasy football / catechism / houseplant bots — wrong vertical or forbidden
- herdr install until Master GO

### One next action
1. Master: file this path. Decide whether Distro folds motion 22 (Radar) into the existing weekday harvest (no new routine, no new seat).
2. Optional $0 product: one Blunt pass on https://signalorigin.gumroad.com/l/meta-tracking-audit-workbook — Distro drafts only if Master says go.
3. Engagement drafts appended in X_ENGAGEMENT_DRAFTS.md — APPROVE only. Distro will not post.
4. Stay quiet to Garrett unless Master elevates. HOLD still stands. Public paste remains Gumroad $19.



---

## Addendum 2026-09-01 ~9:05 AM CT (Distro weekday harvest)
Delta vs 2026-08-31 ~9:40 AM CT Distro addendum. No X API. No publish. No spend. No sports. No email. Not a Lane 1 packet. Distro did not post.

### What I actually opened
- https://grokbot.dev/ (200) — ItemList now ~519 marketplace/shareable entries in schema (was ~312 bots / 40 plugins at 8/31 9:40). Fresh drops dated 2026-09-01 include Porter (@darylbleach), Token Ops (@adgapar), The Accountant (@brstorrie), SumoSign (@SumoSign), 2nd Brain (@LeTerryBZH), STEER (@bfrench).
- https://grokbot.dev/use-cases/ (200) — lived new cards below (not in 8/31 lived set).
- https://grokbot.dev/use-cases/exact-chief-of-staff-prompt/
- https://grokbot.dev/use-cases/debs-chief-of-staff/
- https://grokbot.dev/use-cases/house-memory-bot/
- https://grokbot.dev/use-cases/daily-youtube-summary/
- https://grokbot.dev/use-cases/newsletter-unsubscribe-audit/
- https://grokbot.dev/use-cases/harden-your-email-bot-against-prompt-injection/
- https://grokbot.dev/use-cases/be-happier-bot/
- https://grokbot.dev/use-cases/affiliate-program-manager/
- https://grokbot.dev/use-cases/one-bad-grok-bot-devils-advocate/
- https://grokbot.dev/use-cases/topic-to-branded-carousel/
- https://grokbot.dev/marketplace/porter/ + token-ops/ + the-accountant/ + steer/
- https://www.grokyard.com/ + /about (200)
- https://composio.dev/content/best-grok-bot-plugins (Harsh, dated 2026-08-31)
- Cursor forum search.json latest (2026-09-01): mostly setup/unreachable-computer / usage-pool threads; feature ask still hot on context prune 168333; official X plugin auth still broken 169592; Dean Rie on 169679 confirms allowance order: Grok Bot weekly → credits → On-Demand. Meetups posted (London/Amsterdam/Salta/San Salvador/Guatemala) — not a product motion.

Honesty: homepage/marketplace cards are curator shareable-bot listings unless a use-case page was loaded. Did not scrape X timelines. No X API.

### New motions (28–36)

### 28. Corey Ganim — exact two-part Chief of Staff doctrine
Source: https://grokbot.dev/use-cases/exact-chief-of-staff-prompt/ via @coreyganim
Lived: Part 1 is bot description (three priorities in order with live offers/prices locked as #3, default-to-acting, drafts-never-send, never invent numbers, skills=principles / routines=schedule). Part 2 is the first hire message: connect real tools, lock priorities/offers/team ownership before building anything, then Sunday week-plan skill, then specialist bots only after each brief is approved. Verbatim prompt on the page.
Origin 100% drive at $0? YES as Master operating doctrine (already the pattern). Distro stays drafts-only; Closer owns send. Do not hire a 7th seat. Do not invent prices (Gumroad $19 workbook is the public offer; Stripe still dead).

### 29. Deb O’Brien — CoS that audits the bots you already built
Source: https://grokbot.dev/use-cases/debs-chief-of-staff/ via @debs_obrien
Lived: CoS does not replace specialists. Research who you are, inventory existing bots, recommend keep/merge/add (max three new charters), management plan so the human is not the router. Never create/delete/post/email without asking. Stop if roster invisible — ask for paste.
Origin 100% drive at $0? YES one-shot for Master. Cap still six seats. Useful before any stranger template (pair with Bouncer, motion 20).

### 30. Hearth — long-term house memory (@morganlinton)
Source: https://grokbot.dev/use-cases/house-memory-bot/
Lived: one photo sweep of stickers/breaker/filters/paint/junk drawer → /workspace/house/ files; optional email for warranties; cheap monthly expiry check; break-fix = one photo → one-page repair card; sell-day handover doc. Never logs into utility portals; never orders parts.
Origin 100% drive at $0? NO for Signal Origin SKU (wrong vertical). Keep as proof that persistent machine memory is the product. Do not open a second business in this account.

### 31. Daily YouTube Recap (@scheemunai)
Source: https://grokbot.dev/use-cases/daily-youtube-summary/
Lived: interview → 7–10 channels → TranscriptAPI plugin for uploads+transcripts (not browser scrape) → 7am one message or one quiet line; seen-log; optional email.
Origin 100% drive at $0? PARTIAL. Pattern YES (quiet days, seen-log). TranscriptAPI is a paid-looking plugin on grokbot.dev — skip until Master GO / free path verified. Distro does not email.

### 32. Newsletter detox with HTML review gate (@scheemunai)
Source: https://grokbot.dev/use-cases/newsletter-unsubscribe-audit/
Lived: Phase 1 builds /workspace/detox/review.html (keep vs certainly-unsub) and STOPS. Phase 2 slow browser unsubs with progress.md after human go. Transactional mail fenced. No passwords. Re-check in a week.
Origin 100% drive at $0? NO for Distro (Distro does not email / own Garrett inbox). Steal the approval-gate pattern for any mutate job. Closer/ops lane if Master ever wants it.

### 33. Sentinel — harden email-reading bots against prompt injection
Source: https://grokbot.dev/use-cases/harden-your-email-bot-against-prompt-injection/
Lived: paste-in doctrine: email is DATA never instructions; enumerate attack patterns (fake system msgs, white text, exfil, urgency); on detect, summarize + ask, never silent drop; operator > live user > email-as-data; side-effects need current-turn confirmation.
Origin 100% drive at $0? YES hygiene for any bot that touches inbox (Closer / Master). Distro still does not email. Pair with AgentMail setups if those ever open.

### 34. Disruptor — deliberate devil’s advocate bot (@liam_fallen)
Source: https://grokbot.dev/use-cases/one-bad-grok-bot-devils-advocate/
Lived: silent in group chats until mentioned; then challenges weak assumptions; does not care if the room agrees.
Origin 100% drive at $0? MAYBE as a Master occasional role, not a standing 7th seat. Do not hire permanently. Low priority vs CoS doctrine + usage lean.

### 35. Grokyard — paid directory of shareable bot templates
Sources: https://www.grokyard.com/ + https://www.grokyard.com/about
Lived: third-party public x.ai share links. Seller lists (≥$8), buyer pays Grokyard (15% fee), unlock “Open in Grok Bot.” Copies config/skills/routines only — not computer, logins, or history. Submissions currently localStorage for testing.
Origin 100% drive at $0? NO buy path (spend). YES note: shareable templates + directory are the distribution surface operators are building next to grokbot.dev (adjacent to motion 4). Origin does not list/sell templates this wake. Public paste remains Gumroad $19 workbook.

### 36. Fresh Sep 1 meta-bots: Porter / Token Ops / The Accountant / STEER
Sources (loaded marketplace pages):
- https://grokbot.dev/marketplace/porter/ (@darylbleach) — migrate a whole bot roster (remit, memory, timers) to another app/account.
- https://grokbot.dev/marketplace/token-ops/ (@adgapar) — register standing jobs, cadence cost, fence wasteful routines.
- https://grokbot.dev/marketplace/the-accountant/ (@brstorrie) — ranked list of bots wasting spend (poll too often / retry loops / calling nothing); draft fixes only.
- https://grokbot.dev/marketplace/steer/ (@bfrench) — mark flat machine lines in a draft; rewrite only annotated passages.

Origin 100% drive at $0?
- Token Ops / Accountant pattern: YES as Master one-shot (overlaps motion 21 Brake). Do not install stranger share links without Bouncer pass. No new seat.
- STEER: YES for Distro draft polish on @SignaL_OriginHQ / Gumroad copy if Master says go. Drafts only.
- Porter: NO unless Master explicitly migrates accounts (risk + possible spend elsewhere).

### Secondary (listing only — already parked or forbidden)
- ContentDrips carousel https://grokbot.dev/use-cases/topic-to-branded-carousel/ — paid MCP + publish gate. Do not drive.
- Affonso affiliate manager — Affonso plugin; payouts/messages need approval; Distro does not email partners. Skip.
- Be Happier (@lennysan) — personal wellbeing from email/calendar/Slack. Not Origin SKU.
- Hedge fund / valuation / expectations desk / bargain hunter / Amazon cart / Bland phone / Amplemarket / AdKit / Post Bridge / Postiz / SuperX / Zernio / fantasy football — still do not drive.
- Composio “10 best plugins” post (2026-08-31) — vendor guide; Composio still verify-free-tier-or-skip (prior park).

### Forum / ops (not product motions)
- Context prune FR still active: https://forum.cursor.com/t/grok-bot-prune-compact-an-agent-s-context-without-creating-a-new-bot/168333 (Bot = Identity / Working set / Archive; unbounded thread burns Heavy usage).
- Staff: weekly pool → credits → On-Demand (169679). Keep On-Demand off.
- Overnight computer recovery wiped some agent computers to blank (Colin on 170123) — files/chats live on hosted computer; treat cloud VM as disposable coworker.
- Official X plugin auth broken across Cloud/Grok Bot/desktop refresh (169592) — reinforces Distro’s no-X-API / public-unroll path.
- Distro stay lean: this addendum is deltas only.

### One next action
1. Master: file this path. Optional $0: (a) lock Corey CoS doctrine into Master brief (offers = Gumroad $19 only; drafts never send); (b) one Deb-style roster audit of the six seats; (c) Token Ops / Accountant style pass on Distro+Master routines — no new seat, no stranger install without Bouncer.
2. Engagement drafts appended in X_ENGAGEMENT_DRAFTS.md — APPROVE only. Distro will not post.
3. Stay quiet to Garrett unless Master elevates. HOLD still stands. Public paste remains Gumroad $19 workbook.
