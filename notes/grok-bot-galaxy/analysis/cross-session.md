# Cross-session synthesis — what repeats, what conflicts, what's missing

Ten workshops, ten speakers, three days. This is the pattern layer: the claims that recur
independently across speakers, the places where speakers disagree, and the gaps a next agent
should know about before building on this material.

---

## 1. The same narrative arc appears in seven of ten sessions

Speakers from engineering, PM, founders, sales, SDR, support and marketing all open with the same
curve. It is clearly a shared internal deck:

1. **Chat** — ask a question, get text.
2. **Co-pilots** — the agent does a task, but you babysit it and push it along.
3. **Bots** — you delegate a whole job; the bot finishes it and comes back with results, not text.
4. **Staff function** — a team of bots, each with a job, coordinating with each other.

Wording differs ("ephemeral agents", "task-based", "thought partner") but the four stages are
identical, and the destination is always the same: automate a staff function. Treat this as the
event's canonical framing, not as one speaker's opinion.

## 2. Claims that recur across independent speakers

| Claim | Who says it (independent) |
| --- | --- |
| The bot has **its own computer**, so it can use tools with no API | PM, Founders, Sales Eng, SDR, Support, MarOps, Marketing |
| **Always on / 24-7 / close your laptop** | Every session; the "caffeinated laptop" joke recurs |
| **Memory is per bot** — which is *why* you have many named bots | Engineers, PM, SDR, Marketing |
| **Routines** (schedule/webhook/signal) turn one-off work into permanent automation | Founders, Support, Post Sales, Sales |
| **Share bots / marketplace** so a whole team works from the same templates | Sales Eng, Sales, SDR, Marketing |
| **Guardrails**: read-only first, then writes, approvals before shipping | Support, MarOps, SDR |
| The real limit is **your imagination, not the bot** | Founders ("do things that don't scale… but scale them"), Post Sales (the "imagination gap") |
| **Named, scoped bots** beat one general agent | PM, Founders, Marketing, Engineers |
| **The human keeps judgment** — direction, architecture, relationships, final approval | Engineers, MarOps, Support, Founders |

## 3. The one architectural pattern that dominates: the chief of staff

Six of ten speakers route everything through a single front bot, even when they run a large team
behind it:

- Engineers: chief of staff routes to Craig / Steve / Hogan.
- PMs: Cora routes to Emily (who manages five engineering bots) and the rest.
- SDR: "I only talk to my chief of staff… I've offloaded all that context."
- Post Sales: Gus manages ~10; "I'm a team of one to two, depending on the day."
- MarOps: OP1 synthesizes what Fiser collects.
- Sales: Olive handles day-to-day.

The strongest version of the argument is in the SDR session: messaging many bots is itself a
context-switching tax, which is the exact problem Grok Bot was built to remove.

## 4. Where speakers disagree (real tensions, useful for any write-up)

| Tension | Positions |
| --- | --- |
| **How many bots** | Founders/PM/Marketing: build many, they compound. SDR: "I've had way too many… it's more chaotic and does more harm than good." Support: start simple, there is no meta playbook yet. |
| **Who you talk to** | Sales Eng and Post Sales talk to one front bot; Engineers and PMs talk to specialists directly. |
| **Autonomy vs approval** | Founders/MarOps push maximum agency; Support insists on read-only → writes → approvals and treats over-protective behaviour as acceptable. |
| **Routines** | Sales: "set it and forget it." Founders: be careful — a 15-minute routine is 100 runs a day and expensive; prefer signals and webhooks. |
| **Model honesty** | Sales Eng frames Grok Bot's willingness to say no as a differentiator; SDR warns bots will happily do similar, redundant jobs unless you interrogate the need. |
| **How mature the playbook is** | Marketing/PM present confident repeatable patterns; Support says the product is new and "I don't think there's one meta or one clear playbook." |

## 5. What the sessions say about money

- Grok Bot is gated by plan, not sold standalone: Cursor Pro/Pro+/Ultra, Cursor Teams
  Standard/Premium, SuperGrok, SuperGrok Plus, SuperGrok Heavy, Enterprise; weekly usage included,
  overage billed on token cost `[site]`.
- Only one speaker gives per-unit numbers (Support): $1–$2 per medium/complex ticket, ~20¢ for
  low-complexity tickets batched by script, against $1–$10 per resolution for commercial support
  agents.
- The cost lever everyone names is **routines and context discipline**: fewer, smarter, signal-driven
  runs; fewer, better-scoped bots; shared templates instead of rebuilding context per person.

## 6. The product surface the event points at (all captured in this package)

- `/galaxy` — the event page (10 session videos + 3 X broadcasts).
- `/bot` — product overview, 7 FAQs, pricing gate, download (macOS/Windows/iOS/Android), launch post.
- `/bot/guides` — 10 guides (Grok Bot 101, Engineering, Support, Templates, multiple teams, Marketing,
  mobile app dev, Designing with Grok Bot, GTM, PMs).
- `/bot/use-cases` — 56 use cases in 9 categories.
- `/bot/marketplace` — 81 templates in 9 categories, each with author and description.
- `/build` — Grok Build, powered by Grok 4.7 (subagent view, Plan Mode, mouse support, fullscreen TUI;
  `curl -fsSL https://x.ai/cli/install.sh | bash`).

## 7. Gaps, caveats and things a next agent should not assume

1. **All transcripts are YouTube auto-captions.** No human-reviewed transcript exists on the page.
   Product and person names are badly garbled — apply `data/caption-corrections.json` before quoting
   or full-text searching. "Grok Bot" alone has nine spellings.
2. **The three full-day broadcasts are X-hosted and were not transcribed here.** They contain the
   interstitial programming (the "cooking session", the hosts Matt/Lauren/Roshan) and any sessions
   not published individually. If that content matters, it needs an authenticated X session.
3. **The Marketing Operations transcript starts mid-sentence** ("And so, as I mentioned…"), so its
   opening minutes are missing. Treat that session's first section as partial.
4. **No agendas, slide decks or timestamps are published** by x.ai — the per-session agenda lists in
   `sessions/*.md` are reconstructed from what the speakers said, not from an official schedule.
5. **Two bot names remain unresolved** in the MarOps session ("Fiser"; "owned" most likely "Ondes").
6. **No attendance, registration or viewer numbers** are published anywhere on the page.
7. **Dollar figures for Grok Bot itself are absent** — only support-ticket economics and the plan
   gating. Do not infer a Grok Bot price.
8. **The event has already happened** (Sept 15–17, 2026; today is Sept 23, 2026). Everything here is
   post-event record, and the follow-up email's UTM points at the same page.
9. **Captions say "SpaceX AAI" / "Spacex AI"; the footer says SpaceXAI LLC.** Use SpaceXAI.
10. **Demo assets are fictional** — Fly Low Airlines/Flylo, Northwind, XAIR. Never present demo
    numbers as customer results.
