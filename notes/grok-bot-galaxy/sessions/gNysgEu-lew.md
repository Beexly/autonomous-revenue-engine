# Day 1 — Grok Bot for Product Managers

**Speakers:** Kevin Niparko, Roshan Sadanani — SpaceXAI product team
**Day:** 1  |  **Duration:** 00:35:12  |  **Transcript:** 7,182 words
**Video:** https://youtu.be/gNysgEu-lew
**Transcripts:** `transcripts/gNysgEu-lew.txt` (prose) · `transcripts/gNysgEu-lew.timed.txt` (40-second segments with timestamps) · `transcripts/gNysgEu-lew.raw.txt` (per-caption-line audit trail)

## Premise

Two PMs describe the product brief behind Grok Bot (colleague-like agents) and run a full PM workflow end to end on a fake airline, from a data question to mocks to engineering.

## Agenda as presented

- Framing: DHH — 'Software is product management' — the craft is changing fast
- Motivation: the chat box was limiting; internally people were treating agents as colleagues
- The four-part brief for a 'colleague' agent: ties multiple tools together, long-running context and learning, independence (its own computer), messaging (interrupt, drive, rapid-fire)
- Three PM use cases: the attention list, research/customer context, shipping
- Why many named bots instead of one
- Live demo across a bot team
- Hard-learned lessons

## Use cases shown

- Attention list — diff what you've actually been paying attention to against your priority list
- Data questions and charts on demand (no SQL spelunking), plus routines for a 6am daily pulse and hourly reports during launches
- Funnel analysis to PRD to design mocks to engineering implementation, handed bot to bot
- Inbox grooming and noise reduction; escalate only what matters

## Bots / agents demoed

| Bot | Role |
| --- | --- |
| Cora | Chief of staff — email, calendar, Slack; builds a model of how you work |
| Emily | Engineering manager — deliberately not a coder; manages five engineering bots, deconstructs large chunks of work and runs verification loops |
| Ashley | Data science / analytics — connected to the data warehouse (Databricks, Snowflake, etc.) |
| PMP Pete | Product assistant — drafts PRDs, synthesizes customer insight, lower-level product work |
| Pixel | Designer — loaded with an 'S-tier design' skill from best public design thinking |
| Rey | Recruiter — sourcing and hiring pipeline |

## Tools, integrations and surfaces named

Notion, Slack, Gmail, MCPs, data warehouse (Databricks/Snowflake), design skill

Frequent tool vocabulary in the transcript: `notion`, `slack`, `drive`, `figma`, `teams`, `linear`, `salesforce`, `docs`, `jira`, `calendar`, `sql`, `merge`, `mcp`, `gmail`

## Takeaways the speaker stated

- Named agents with separate memory perform better than one general agent
- Expect an onboarding phase — they are not great on day zero
- Reduce noise in the system: tell routines to stay silent on a no-op
- 'Agents all the way down' — managers of agents, agents coordinating cloud agents

## Notes for the next agent

Contains the single best internal statistic of the event: Grok Bot represents a double-digit percentage of merged PRs inside the company, and it lets product people ship PRs to production. Demo runs on 'Fly Low Airlines' (also called Flylo), a shared demo environment reused in the Founders and Marketing sessions.

