# The Grok Bot launch campaign — chronological record

The event was not a standalone thing. It was the end of a six-week campaign that started with the
product launch on **August 11, 2026**. This is the whole arc, with sources. Machine-readable copy in
`data/launch-timeline.json`.

---

## The campaign in five moves

| Move | When | What it did |
| --- | --- | --- |
| 1. **Launch in beta** | Aug 11 | Product live to SuperGrok and Cursor paid tiers. Enterprise joins a waitlist. |
| 2. **Publish the playbooks** | Aug 15 – Sep 11 | Ten role guides, written by the people doing the job, each ending in "start with this bot". |
| 3. **Widen access** | Aug 26 | Included with *all* SuperGrok and Cursor Pro/Teams plans. |
| 4. **Land the enterprise** | Sep 3 | Governance (access, network, audit), two weeks free, invite the whole org — plus named logos. |
| 5. **Prove it with numbers** | Sep 4, Sep 22 | Two hard-results case studies (procurement savings, support cost) then the three-day event. |

The **Grok Bot Galaxy event (Sep 15–17)** sits between the enterprise launch and the proof posts.
The **follow-up email (Sep 21)** went out the same day the ten recordings were published.

## Dated entries

**2026-08-11 — Grok Bot launched in beta** (`news/introducing-grok-bot`)
Available for SuperGrok / Plus / Heavy, Cursor Pro / Pro+ / Ultra and Cursor Teams Standard & Premium,
on desktop and iOS. Enterprise joins a waitlist. Critically: **"Grok Bot comes with its own usage,
separate from your Grok and Cursor plans"** — handoffs don't consume your existing allowance.
The post also states the origin story: built as an internal prototype, adopted across the company
(sales outbound, marketing campaigns, office operations, bug fixes) before being opened up.

**2026-08-14 — Cursor becomes part of SpaceXAI** (`news/grok-bot-customer-support`)
This is the corporate event that makes the plan structure make sense: Grok Bot is gated by *Cursor*
plans as well as SuperGrok plans because the two companies merged two weeks after the Grok Bot beta
launch. The support post dates the merger explicitly.

**2026-08-15 → 2026-09-11 — Ten guides published** (`bot/guides/*`)
Authored by named staff: Kevin Niparko (PMs, Aug 15), Krista Letz (GTM, Aug 16), John Bai (design,
Aug 24), Ryan Perry (mobile dev, Aug 25), Eric Zakariasson (multi-team pattern, Aug 27), Matt Palmer
(Templates, Sep 8; Grok Bot 101, Sep 11), David Gan (support, Sep 9), Lingxi Li (engineering, Sep 10),
Josh Kim (marketing, Sep 18 — published *after* the event). See `data/guides.json`.

**2026-08-21 — Grok 4.6 on Gemini Enterprise Agent Platform** (`news/grok-4-6-vertex-ai`)
Model distribution through Google's Model Garden: 500k context, configurable reasoning effort
(low/medium/high/xhigh). Context for the platform the agents run on, not a Grok Bot feature.

**2026-08-26 — "Grok Bot is now included with more plans"** (`news/grok-bot-more-plans`)
Access widened to all SuperGrok and Cursor Pro/Teams plans. The post also lists nine concrete jobs
bots were doing (sales prospector, website builder, digital declutterer, customer support, game
artist, office manager, inbox manager, meeting stand-in, refunds manager) — a de facto job catalogue.

**2026-08-29 — Grok Bot works with X** (`news/grok-bot-and-x`)
X connector plus an X plugin (search posts, read timelines, pull trends, manage bookmarks).
**Paid Grok Bot users get free X API credits**, and a developer account is created if the user has
none — a bundling play that feeds X's API ecosystem.

**2026-09-03 — Grok Bot for Enterprise** (`news/grok-bot-for-enterprise`)
Access, network and audit controls; each user's work in an isolated environment; "a Bot has no access
by default and reaches only the accounts you sign it into." Free for two weeks for Grok and Cursor
Enterprise customers, who can invite the **whole organisation, including people without an existing
seat** — a seat-expansion motion. Named customers: **Legora, Supermicro, ServiceTitan**. Claims
"thousands of organisations" and "[millions] of bots created in the past few weeks."

**2026-09-03 — Design essay** (`news/designing-grok-bot`)
Not marketing: a product-design argument for persistent agents, naming the five primitives
(Bots, Chats, Prompts, Tools, Artifacts), the avatar state system, the three levels of computer
access, and the rule that **capabilities are account-scoped while context is bot-scoped**.

**2026-09-04 — Haggle Bot procurement write-up** (`news/grok-bot-procurement`)
The single richest artefact in the corpus: **> $100,000 in direct savings**, a **complete published
system prompt**, specific findings (43 idle seats = $14,220; $85,662/yr of unused SKUs; a weekly tech
order cut from $14,629 to $6,143, 58%), and the systems it touched (Slack, Notion, Drive, Gmail, Hex,
Ramp) plus a second bot, **Amazon Bot**, that places the office order.

**2026-09-08 → 09-11 — Three more guides** (Templates; Support; Engineering; Grok Bot 101).

**2026-09-15 → 09-17 — Grok Bot Galaxy** (`x.ai/galaxy`)
Three days, 8:45am–6:00pm PT, The Howard, 661 Howard Street, San Francisco, livestreamed.
Ten role workshops; the full days live on as three X broadcasts. See `data/sessions.json`.

**2026-09-17 → 09-18 — Marketing guide published** (Josh Kim, Sep 18) — the guide version of the
closing workshop, using the same X-Air demo.

**2026-09-21 — Recordings published + follow-up email**
All ten workshops on YouTube (view counts 33–192 as of Sep 23 — effectively unlisted distribution).
The customer.io email (`utm_campaign=20260921_Grok-Bot-Galaxy-Livestream-Follow-Up`) routes recipients
back to the event page, which is the durable hub: sessions → broadcasts → product CTAs.

**2026-09-22 — Support case study** (`news/grok-bot-customer-support`)
The proof post, published the day after the email: **175% more tickets, no new hires** (would have
needed ~200 people), **$0.20–$0.30 per resolution** against a $1–$4 traditional-tool benchmark,
99% of refunds resolved without a human, trained on 1,000,000+ human interactions, 20,000+ pieces of
product feedback synthesised daily.

## What the chronology tells you

1. **The event is a demand-capture node, not the campaign.** Six weeks of publishing preceded it and
   two proof posts followed within a week.
2. **Access widened before the event and governance landed before it too** — so by the time the
   workshops ran, the audience could actually sign up on any paid tier.
3. **Every guide ends with a bot to install**, and every bot has a one-click install link. Publishing,
   marketplace and event all point at the same catalogue (`data/install-links.json`).
4. **The proof posts are sequenced by audience**: procurement (Sep 4, cost savings for finance),
   support (Sep 22, headcount for ops). The event covered the remaining functions.
5. **Nothing in the corpus prices Grok Bot separately.** It is always "included with" a plan and
   "comes with its own usage" — the monetisation is plan-tier upgrade and seat expansion, not a
   standalone SKU.
