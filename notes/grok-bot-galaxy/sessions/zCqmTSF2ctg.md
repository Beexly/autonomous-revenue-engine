# Day 1 — Grok Bot for Engineers

**Speakers:** Lingxi Li — Software engineer, SpaceXAI (joined via Cursor, which is now SpaceXAI)
**Day:** 1  |  **Duration:** 00:45:10  |  **Transcript:** 7,331 words
**Video:** https://youtu.be/zCqmTSF2ctg
**Transcripts:** `transcripts/zCqmTSF2ctg.txt` (prose) · `transcripts/zCqmTSF2ctg.timed.txt` (40-second segments with timestamps) · `transcripts/zCqmTSF2ctg.raw.txt` (per-caption-line audit trail)

## Premise

The deepest technical session of the three days: how an engineer runs a fleet of named bot 'colleagues' that supervise Cursor cloud agents, plus the arc of coding AI that led there.

## Agenda as presented

- History of coding AI at Cursor/SpaceXAI: autocomplete to tab completion to ask/edit to agentic coding (Cursor 2/3) to automations on cloud agents to Grok Bot as the orchestration layer
- Why Grok Bot exists: managing 15 cloud agents was already too much context switching; he wanted something to kick off follow-ups, queue messages and interrupt/nudge agents
- What Grok Bot is: team of autonomous agents, 24/7, own computer, no laptop required
- Capabilities: manages coding agents (first-party Cursor cloud-agent integration), connects to tools (Vercel MCP, Slack MCP), per-bot memory + routines, all platforms (iOS/Android/iPad/Windows/Linux/macOS), human can take over the bot's computer for logins and verification
- Engineering use cases (see below)
- How he organizes a fleet: chief of staff + specialist engineer bots
- Live demo: marketplace install, bot-to-bot onboarding, nightly audit run
- Wrap-up lessons

## Use cases shown

- Unblock teammates while away — bot monitors Slack, applies your review criteria (screenshots, non-fake tests), approves or replies to the requester
- Monitor X for bug reports about the product, reproduce on main, fix, open a PR for review
- Nightly code cleanup/audit at 3am: a research cloud agent sweeps the monorepo for code quality, modularization, comment hygiene and security issues; he wakes up to a set of PRs (published as 'Nightly Audit Engineer' on the marketplace)
- Internal tooling without building a dashboard: a Slack message that mentions the bot is the interface (e.g. add people to TestFlight by email)
- Autofix everything: CI red / deployment errors / flaky tests cause the bot to investigate, spin a cloud agent, and merge under your stated conditions; on-call only paged if unresolved after ~10 minutes
- Teaching boundaries: instruct the bot to say no and why — memory persists so you don't repeat it

## Bots / agents demoed

| Bot | Role |
| --- | --- |
| Chief of staff (called 'Link Shishi' — caption spelling uncertain) | Single point of contact; routes requests to specialist engineers; holds engineering workflow context |
| Craig | UI engineering specialist bot |
| Steve | DevX specialist bot (the Nightly Audit Engineer renamed and onboarded into the fleet) |
| Hogan | Infrastructure specialist bot |

## Tools, integrations and surfaces named

Cursor cloud agents (first-party), Slack MCP, Vercel MCP, Notion, TestFlight, Grok Bot marketplace, routines/webhooks, private workers on Macs

Frequent tool vocabulary in the transcript: `slack`, `pr`, `merge`, `mcp`, `ci`, `notion`, `deploy`, `terminal`, `drive`, `sheets`, `pip`, `shell`, `teams`

## Takeaways the speaker stated

- Treat them like interns — message-based instruction beats elaborate skill invocation
- Go one level further than 'fix this': if you repeat a prompt, extract it into a playbook or another bot
- Always close the loop — agents need a success/failure signal (computer-use checks are the easiest)
- Multiple engineer bots beat one: separate context limits, separate pipelines, separate memories

## Notes for the next agent

Splits the human/bot boundary explicitly: bots handle routing, reviews and follow-ups; humans keep product direction, architecture, performance work and design detail. Includes a live, partially unscripted demo — he installs bots from the marketplace on stage and lets his existing engineer bot onboard the new one by plain-text handshake.

