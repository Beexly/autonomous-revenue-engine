# What the first pass missed — under-leveraged material and a new frame

The first extraction treated **the event** as the unit of study. The second pass shows that was the
wrong frame: the event is one node in a six-week campaign, and the richest artefacts are not on the
event page at all. This file lists what was missed, why it matters, and what to do with it.

---

## A. The frame was wrong: it's a campaign, not an event

**Missed:** six weeks of publishing before and after the event — launch (Aug 11), plan expansion
(Aug 26), X integration (Aug 29), enterprise (Sep 3), design essay (Sep 3), procurement proof
(Sep 4), ten guides (Aug 15–Sep 18), support proof (Sep 22).

**Why it matters:** the campaign is a complete, observable GTM playbook — launch → widen access →
land enterprise → publish proof → run a teaching event → follow up by email. Any agent building a
revenue engine can copy the *shape*.

**Do this:** `analysis/launch-timeline.md` and `data/launch-timeline.json`.

## B. 137 one-click install links that were never enumerated

**Missed:** every marketplace template and use case carries an install deep link
(`/bot/<token>`) — 81 template links plus 56 use-case links. These are the artefacts that travel
outside x.ai; they are the growth loop's payload.

**Why it matters:** this is a distribution surface with trackable tokens, not a UI detail. It also
means the catalogue can be *shipped* to someone rather than described to them.

**Do this:** `data/install-links.json`. Unexplored: whether the tokens are per-recipient, whether
they carry referral attribution, and whether an unauthenticated visitor can redeem one.

## C. The marketplace is seeded by named creators — including outsiders

**Missed:** 45 distinct creators, with recognisable external operators alongside staff —
**Lenny Rachitsky, Hiten Shah, Kent C. Dodds, Claire Vo, Sawyer Merritt, Matt Van Horn, Lauren Tan,
This Week in AI**. Total catalogue metadata: 393 skills, 127 routines, 304 integrations.

**Why it matters:** creator-seeded template marketplaces are a co-marketing engine. The creator gets
distribution to their audience; the platform gets credible inventory and social proof. The most
common integrations (Notion 18, Slack 11, Google Sheets 7, Linear 6) tell you which tools the
catalogue assumes.

**Do this:** `data/creators.json`.

## D. 77 production system prompts were sitting in the page payload

**Missed entirely:** the marketplace detail pages ship each bot's full definition — including
`memories[]`, which *is* the system prompt — inside the Next.js flight payload. **138,766 characters**
of production agent specification, invisible in the marketplace UI.

**Why it matters:** this is a corpus of working agent specs with scope statements, anti-jobs,
first-run interviews, permission lines, approval gates and output contracts. It is directly
transferable to any agent product — including a "vertical agent kit" business.

**Do this:** `analysis/agent-prompt-corpus.md`, `extracted/mp/*.md`,
`data/marketplace-agents.json`.

## E. The pricing story is more interesting than "it costs $30"

**Missed:** three separate mechanics.
1. **Usage is decoupled** — "Grok Bot comes with its own usage, separate from your Grok and Cursor
   plans, so anything you hand off to a Bot won't count against your existing usage." That removes
   the scarcity anxiety that suppresses usage, and creates a second meter.
2. **Grok Bot is a mid-tier individual feature** (SuperGrok $30 / Plus $100 / Heavy) — the first
   non-model capability gated to paid tiers — *and* an enterprise motion at the same time.
3. **The public surfaces disagree:** the pricing matrix shows Grok Bot only in the three SuperGrok
   columns (not Business, not Enterprise), while the Sep 3 post says enterprises get it with
   governance controls. Do not quote one without the other.

**Why it matters:** if you are modelling a similar product, this is the packaging decision set —
bundle vs SKU, decoupled meter, tier gating, seat expansion.

**Do this:** `analysis/revenue-mechanics.md`, `data/packaging-matrix.json`.

## F. Enterprise expansion is explicit

**Missed:** enterprise customers "can invite their whole organization, **including people without an
existing seat**", free for two weeks, activated from the admin dashboard. Governance ships as
access + network + audit controls; each user's work is isolated; "a Bot has no access by default."

**Why it matters:** that is a land-and-expand motion stated in plain language, with the security
posture that unblocks it.

**Do this:** `data/customers.json` (Legora, Supermicro, ServiceTitan named) and the enterprise entry
in `data/launch-timeline.json`.

## G. Proof points are sequenced by buying centre, and they are quotable

**Missed:** the numbers were scattered. Collected: **175% more support tickets with no hires
(~200 people avoided)**, **$0.20–$0.30 per resolution vs $1–$4 for traditional AI support tools**,
**> $100,000 found by one procurement bot**, **99% of refunds automated**, **1,000,000+ human
interactions used for tone**, **20,000+ feedback points synthesised daily**, **200+ cloud agents per
fleet vs 15 manual**, **2,000+ PRs by one engineer in a month**, **15x cheaper installs and 4x D7
retention for a mobile game**.

**Why it matters:** these are benchmark anchors for pricing and for writing your own proof posts.

**Do this:** `data/metrics-ledger.json` (24 entries, each with source).

## H. The event's own runtime was mostly not published

**Missed:** the three-day programme runs ~27.75 hours (3 × 9h15m). The ten workshops total ~5h30m —
**about 20%**. The rest — interstitials, the "cooking session" hosts (Matt, Lauren, Roshan), build
time, Q&A — exists only in the three X broadcasts.

**Why it matters:** anyone claiming to have "the whole event" has a fifth of it. The format choice is
also notable: continuous livestream with a cooking segment between technical workshops is a
deliberate anti-corporate format.

**Do this:** transcribe the broadcasts (needs an X session) if the interstitial matters.

## I. Self-improvement loops are the emergent operating model

**Missed:** three independent instances of agents improving agents.
- Support: "Grok Bots can coach other Grok Bots… identify gaps in the knowledge system, fill those
  gaps, and feed what they learn back." Weekly leadership summary of where AI answers fall short.
- Engineering: **Jenny**, a non-coding ops bot, holds 5am 1:1s with every engineer bot, runs
  postmortems when a bot underperforms, and updates the shared playbook.
- Post Sales: a weekly **self-improvement scan** audits the whole system for manual work that should
  be automated, and a voice-learning loop diffs drafts against what was actually sent.

**Why it matters:** this is the actual mechanism by which a bot fleet gets better, and it is a
design pattern you can copy directly (an ops bot whose only job is improving the others).

**Do this:** `sessions/EGt8FfTmTMY.md`, `analysis/glossary.md` (Jenny, self-improvement scan).

## J. Product architecture stated exactly once

**Missed:** the design essay (Sep 3) is the only place the architecture rule appears:
**"capabilities can be shared broadly while context remains with the role that needs it"** —
Tools and Skills live at the account level; Memory and Routines belong to the bot. It also names the
five primitives (**Bots, Chats, Prompts, Tools, Artifacts**), the avatar state system (idle, working,
waiting, blocked, thinking, done) and three levels of computer access (status, preview, takeover).

**Why it matters:** this is the product's conceptual spine, and it explains *why* the chief-of-staff
pattern works (scoped memory) and why bots can share tools but not context.

**Do this:** `extracted/news/designing-grok-bot.md`.

## K. Security caveats buried in a guide

**Missed:** Grok Bot 101 states that bots share one computer per user, that a **separate review agent**
checks proposed actions against natural-language allow/block lists, and — critically —
**"if you log into a site with one bot, every other bot can reach that site too."** It also notes
bots can be sent a secure form for passwords or API keys, and that a human can take the desktop over
for CAPTCHA/2FA.

**Why it matters:** it is the risk surface, stated plainly by the vendor, in a place nobody reads.

**Do this:** `extracted/guides/grok-bot-101.md`.

## L. Data-quality artefacts that would corrupt an analysis

- **A literal `$42` appears as memory 1 in 32 templates** — a sanitisation placeholder, **not a price**.
- **`installCount` is 0 across all 81 templates** — no popularity signal exists.
- **7 of 81 templates have no prompt**; `instructions` is empty for most — the substance is in
  `memories[]`.
- **YouTube view counts are 33–192** — the recordings are lifecycle assets for the email list, not
  public marketing. Low reach, high intent.
- **The captions garble names** (see `data/caption-corrections.json`).

## M. What the corpus still does not contain

No Grok Bot price or token rate · no competitor comparison beyond the $1–$4 support benchmark ·
no retention or churn data · no template ranking, curation or review policy · no API for Grok Bot ·
no attendance or registration numbers for the event · nothing about the three X broadcasts ·
no revenue figures of any kind. Anyone needing these has to go further than x.ai.

---

## The reframe, in one line

The first pass delivered **the event**. This pass shows the material is really a **published
playbook for launching and monetising an agent product** — with a reusable prompt corpus, a
measurable distribution loop, a packaging decision set, and a metrics ledger, all captured from the
vendor's own surfaces.
