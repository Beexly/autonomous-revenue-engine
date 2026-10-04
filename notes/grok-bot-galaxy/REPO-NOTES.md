# Grok Bot Galaxy — notes

Research notes, kept because they are competitive intelligence and pattern material, **not** a
product. Nothing here is for sale and nothing here should be published without a human approve step.

Collected 2026-09-23 from x.ai's own surfaces (event page, product pages, 91 news posts, 10 guides,
81 marketplace templates and their embedded agent definitions).

## What's in here

| Path | What it is |
| --- | --- |
| `README.md` | Package guide: what was collected, from where, and the caveats |
| `AGENT-BRIEF.md` | Handoff manual — state, environment gotchas, next actions |
| `analysis/under-leveraged.md` | What a first pass misses, and why it matters |
| `analysis/launch-timeline.md` | The six-week launch campaign (Aug 11 → Sep 22) with sources |
| `analysis/revenue-mechanics.md` | Packaging ladder, pricing, unit economics, distribution loop |
| `analysis/agent-prompt-corpus.md` | Analysis of 77 production agent specs (138,766 chars) |
| `analysis/glossary.md` | Every product term, system and named bot |
| `analysis/cross-session.md` | What repeats across ten role workshops; where speakers disagree |
| `analysis/quotes.md` | 37 verbatim quotes with timestamps |
| `data/` | Structured: launch timeline, metrics ledger (every number + source), packaging matrix, customers, creators, install links, catalogues |
| `agent-prompts/` | The 81 marketplace agents as readable definitions (77 include the full prompt) |
| `source-extracts/` | The 91 news posts and 10 guides as plain text |
| `sessions/` + `transcripts/` | Ten role workshops: briefs, and 61,506 words of transcript |
| `index.html` | Single-file dashboard over all of the above |

## Why it's worth keeping (and what to take from it)

1. **Distribution pattern, not content.** Every marketplace template carries a one-click install deep
   link (`data/install-links.json`, 137 of them). Publishing → template → one-click install → the
   recipient must connect their own tools. That is a loop worth understanding for any free-core
   surface with an affiliate or sponsorship path.
2. **Proof-point discipline.** Every serious claim is per unit of work: $0.20–$0.30 per support
   resolution vs a $1–$4 benchmark; 175% more tickets with no hires; > $100,000 found by one
   procurement bot. `data/metrics-ledger.json` keeps each number next to its source so marketing
   claims ("millions of bots") stay separated from measured ones.
3. **Agent operating patterns.** The corpus is a working reference for our own agent discipline —
   scope statements, explicit anti-jobs, first-run setup interviews, per-action approval gates
   ("a standing approval is not a go"), evidence bars on any recommendation. Useful internally; not
   inventory to sell.
4. **Packaging decision set.** Bundle vs SKU, a decoupled usage meter, tier gating, and a
   land-and-expand enterprise motion — documented in `analysis/revenue-mechanics.md`.

## Guardrails this material reinforces

- Nothing public ships without an explicit human approve (matches the owner-attestation rule).
- Draft-only by default; a send to another agent still counts as a send.
- Every number carries its source or it is labelled a claim.

## What not to do with it

- **Do not package or sell any of this as an agent kit, prompt pack, or template product.**
  `ops/STRATEGY.md` is explicit that the market is saturated and that is off the table.
- Do not republish the transcripts or prompts as our own content; they are third-party material kept
  for reference.
- Do not treat the demo numbers (Fly Low Airlines, XAIR, Northwind) as real results.

## Known gaps

The three full-day X broadcasts are not transcribed (need an authenticated X session) and hold
roughly 80% of the event's runtime. No Grok Bot price is published anywhere. Install-link tokens are
enumerated but never tested. Details in `AGENT-BRIEF.md`.
