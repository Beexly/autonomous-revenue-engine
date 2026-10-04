# Day 2 — Grok Bot for SDRs

**Speakers:** Simon Lackowski — Go-to-market team, SDR, SpaceXAI
**Day:** 2  |  **Duration:** 00:34:04  |  **Transcript:** 7,174 words
**Video:** https://youtu.be/Iia8EF7niiA
**Transcripts:** `transcripts/Iia8EF7niiA.txt` (prose) · `transcripts/Iia8EF7niiA.timed.txt` (40-second segments with timestamps) · `transcripts/Iia8EF7niiA.raw.txt` (per-caption-line audit trail)

## Premise

The most candid session about failure modes: how to build an SDR system end to end, and why too many bots makes things worse.

## Agenda as presented

- What Grok Bot is, why they use it internally, SDR use cases
- Demo of his actual environment, then Q&A
- Maturity curve for SDRs: prompting, co-pilots (Gmail MCP/API), automating whole jobs, staff function
- Training: per-bot context and memory; teaching your voice from your own sent mail
- Sharing templates across the SDR team

## Use cases shown

- ICP discovery — analyze deals that closed or reached stage 1 to find the titles that carry deals
- Prospect enrichment and scoring
- Outbound that actually sends, end to end
- Screen recording to teach workflows where no API exists (bot owns its own VM and browser)

## Bots / agents demoed

| Bot | Role |
| --- | --- |
| Chief of staff | The only bot he talks to; everything else happens behind it |
| Email / outbound bot | Writes in his voice, learned from his Gmail history |
| Various specialists | He explicitly warns he has had too many at points |

## Tools, integrations and surfaces named

Gmail MCP/API, Slack, browser login on the bot's own VM, screen recording, shared templates, routines

Frequent tool vocabulary in the transcript: `gmail`, `salesforce`, `api`, `slack`, `calendar`, `mcp`, `rest`, `teams`, `linkedin`

## Takeaways the speaker stated

- Push bots to do the entire workflow, not one task — painful up front, far more valuable later
- Be intentional: route work through a chief of staff instead of messaging many bots
- Think systematically — every new bot costs tokens and attention; ask why an existing bot can't do it
- Convert repeated prompts into routines

## Notes for the next agent

The clearest statement of the anti-pattern: 'as someone who's built an army of bots, I promise you, I've had way too many at some points... it's honestly more chaotic and it does more harm than good.' Good counterweight to the more enthusiastic sessions.

