# Day 2 — Grok Bot for Customer Support

**Speakers:** David Gan — Software engineer, user ops org, SpaceXAI
**Day:** 2  |  **Duration:** 00:30:47 (caption-derived, approximate)  |  **Transcript:** 4,190 words
**Video:** https://youtu.be/BSB--jUnx9U
**Transcripts:** `transcripts/BSB--jUnx9U.txt` (prose) · `transcripts/BSB--jUnx9U.timed.txt` (40-second segments with timestamps) · `transcripts/BSB--jUnx9U.raw.txt` (per-caption-line audit trail)

## Premise

Demo-heavy support session with the only hard cost-per-ticket numbers of the event, plus a four-bot support org that improves itself.

## Agenda as presented

- What Grok Bot is; always-on; routines as cron/event triggers; connectors marketplace; build what's missing with cloud agents
- Support use cases
- Demo of a four-bot support team
- Guardrails and rollout
- Q&A (including pricing)

## Use cases shown

- Answering tickets — crawl/walk/run: read and summarize, then draft a response as a ticket note, then auto-reply once confident
- Alerting — e.g. an hourly routine that classifies churn threats from customers of 6+ months and posts to a Slack channel
- Internal Q&A agent — query public docs/help center plus internal SOPs from Slack
- Self-improvement — review the last week of tickets and find what could have been handled better or flagged earlier

## Bots / agents demoed

| Bot | Role |
| --- | --- |
| Build | Sets up infrastructure and configuration |
| Reply | Answers users in the ticketing system and in Slack |
| Alert | Pinged by Reply; posts and tags him in Slack |
| Tune | Continuously improves the system |

## Tools, integrations and surfaces named

ticketing systems (Plane, Zendesk, Intercom), Slack, Notion knowledge base, cloud agents, evals and traces

Frequent tool vocabulary in the transcript: `slack`, `docs`, `stripe`, `notion`, `script`, `cron`, `zendesk`, `intercom`, `supabase`, `sso`, `rest`

## Takeaways the speaker stated

- Set guardrails confidently: read-only first, then writes, manual approvals for specific actions, per-bot permission scopes
- Start simple — there is no meta playbook yet; make bots fit how you work
- Experiment; have Grok Bot build whatever connector is missing

## Notes for the next agent

Key economics from Q&A: usage is billed against your Grok/Cursor subscription; roughly $1–$2 per medium-to-complex ticket, down to about 20 cents for low-complexity tickets batched with a script, versus $1–$10 per resolution for commercial support agents and more for humans. He reached the 20-cent figure with about half a day of tuning.

