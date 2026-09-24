# The agent definition corpus — 77 production system prompts

The marketplace detail pages ship the **complete agent definition** for each template inside the
Next.js payload: name, creator, categories, a one-click install link, and `memories[]` — the bot's
system prompt split into named blocks. This is the most reusable asset in the whole extraction and it
is not visible from the marketplace listing at all.

**Scale:** 81 agents parsed, **77 carry a prompt**, **138,766 characters** of production instruction
text. Readable copies: `extracted/mp/<slug>.md`. Structured: `data/marketplace-agents.json`.

---

## How the definitions are structured

Every record has the same shape:

```
name · creatorName · handle · description/summary · categories · installCount
addHref (one-click install deep link) · imageUrl · color · shape
instructions · memories[] · skills[] · routines[] · integrations[]
```

Across the corpus (77 prompts):

| Pattern | Count | Meaning |
| --- | --- | --- |
| "Never …" | 60 | Hard prohibitions are near-universal — every serious bot has a never-list |
| Routines | 25 | Standing schedules baked into the template |
| "Do not …" | 24 | Second style of prohibition (often output formatting) |
| Approval | 23 | Explicit human sign-off gates |
| Tables | 20 | Output-format instructions |
| Voice | 19 | Writing in the operator's voice |
| "Always …" | 18 | Standing permissions |
| `FIRST RUN` | 14 | A scripted onboarding interview for the first conversation |
| "One job" | 13 | Scope statement opening the prompt |
| "Anti-job" | 12 | Explicit statement of what the bot is *not* for |
| Permission | 8 | Allow / ask / never permission blocks |

**The dominant template is: one job → anti-jobs → first-run interview → permission lines →
output format → escalation rules.** That is a reusable spec pattern, not a prompt trick.

## The five best examples in the corpus

**1. Haggle Bot — Daniel Gartshein (5,983 chars)** — the most complete agent spec published anywhere
in this material. It opens with a scope statement and an anti-job list ("never spend money, never
sign, never send a PO"), then a scripted first-run interview (connect Ramp or paste bills → name the
Google Sheet destination → confirm the renewal window, default 120 days → name the approver → optional
Slack/Notion sources). Its operating rules are worth quoting because they generalise:

- *"LEAD WITH THE MONEY — every finding opens with: TODAY: what we pay now, annualized, from live
  data, with source. SAVE: realistic savings and mechanism, with confidence. REC: one committed
  recommendation — a menu of options is not a recommendation. NEXT: what you've already set in
  motion."*
- *"a real opportunity has a dollar figure traced to live spend data, a specific mechanism, and a
  reason it's actionable now… Anything less is a lead — label it, name the missing data, and go get
  it rather than assuming."*
- *"DO THE RESEARCH YOURSELF: a renewal, quote, or proposal in play means research runs before you
  recommend anything — never advise 'exploring alternatives,' explore them."*
- *"A rejected draft is rebuilt from the plan, never edited."*
- *"Sending a draft to anyone, including another agent, is a send that needs the operator's explicit
  go, per send."*

**2. Lingxi's Engineer Bot — Lingxi Li (4,505 chars)** — the fleet supervisor pattern behind the
Day 1 workshop: boards work, launches cloud agents on a named repo, watches PRs on a 30-minute
cadence, only asks for a merge.

**3. Pitch Deck Coach — Hiten Shah (6,877 chars)** — the longest prompt in the corpus; a
coaching-loop design (feedback structure, not a one-shot critique).

**4. Product Idea Stress Test — Hiten Shah (5,399 chars)** — evidence-for/against framing: what must
be true, the assumption most likely to kill the idea, what to test next.

**5. Stalk Bot — Shub Gaur (3,190 chars)** — the competitor-stalking design from the Founders
workshop: its own research email, walks onboarding on video, watches pricing/changelog/jobs/X, and
never posts or contacts anyone.

Also notable: **Import Bot (Shub Gaur)** migrates a user's setup from Claude Cowork, Codex, ChatGPT,
OpenClaw and Hermes, and *scrubs secrets before anything is saved* — a competitive-switching tool
shipped as a template.

## What the corpus reveals about how the product is used

- **Every serious bot has a never-list.** Agency is granted, then bounded in prose. The rules are
  natural language (Grok Bot 101: "Most of us are used to defining agent rules in code or JSON. With
  Grok Bot, the rules are a prompt.").
- **First-run interviews are standard.** The bot asks setup questions on first contact and saves the
  answers to memory — the template's way of surviving the loss of the creator's private context.
- **Approval is per-send, not per-category.** "The operator's explicit go for that specific message"
  appears verbatim; a standing approval is explicitly not a go.
- **Agent-to-agent sends are still sends.** A handoff to another bot counts as an external action in
  the strictest templates.
- **Evidence bars are numeric.** Where a bot recommends, it must cite live data, a mechanism and a
  reason-now; otherwise the output is labelled a lead.

## Data quirks to know before mining this

1. **A literal `$42` appears as memory 1 in 32 templates (19 of them as the opening block).** It is a
   placeholder left by template sanitisation, **not a price**. Ignore it in any analysis.
2. **`installCount` is 0 on all 81 templates** — no popularity signal is published.
3. **Templates deliberately exclude** personal memories, secrets and custom code; several prompts
   therefore reference plugins the recipient must install themselves.
4. **`instructions` is empty for most templates** — the substance lives in `memories[]`, so any
   scraper that only reads `instructions` gets nothing.
5. **7 of 81 templates carry no prompt at all** (metadata only).
