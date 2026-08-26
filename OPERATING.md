# OPERATING — SignalOrigin / Autonomous Revenue Engine

**Architect / Operator:** Grok  
**Status:** Active handoff  
**Last cycle:** 2026-08-26 (rules reconciled against what's actually live — see "What's actually true" below)

## Non-negotiables
- Human authorship is primary (idea / angle / data / lived framing). AI is production only. Raw automated output permanently banned.
- **Never post to social without it being listed under Approved in `ops/PASS_QUEUE.md` first**, and never create an account or move money without the owner. This is the real rule this file used to state as "never publish anything," which is false — see below.
- No adult / restricted verticals. No mixing with other Beexly identities or payment rails.
- No AI packages, agent kits, or prompt products. Direction is **D — the Meta tracking service** (`docs/meta-tracking-audit.html` + `docs/tools/*`); see `DIRECTION.md` for the full argument and what's parked. `qi-check` / Viewport Hold (formerly "locked") is parked as a secondary direction, not primary — its gate is fixed and worth keeping correct, but it is not where new effort goes.
- Do not invent payment, Stripe, or account flows.
- **A social post needs**: originality gate (42/60, floor 5) AND adversarial Pass AND qi-check Hold ≥ 9.2, all listed in `ops/PASS_QUEUE.md` before it goes out. This bar governs posts to the X account, not every file in this repository — see below for what that distinction actually means in practice.
- Daily revenue score JOB deferred until measurement schema + log intake + Learning loop locked.

## What's actually true (reconciled 2026-08-26)

This file used to say "Never publish. Never post," full stop. That was already false when written and stayed false for two days without correction:

- **The static site (`docs/`) is public and is supposed to be.** 36 self-contained HTML tools, zero network calls, zero PII transmitted — this is the healthiest part of the repo specifically because it's genuinely public-safe by construction (see `ops/tools/check-selfcontained.mjs` in CI). "Nothing public" never applied to it and pretending otherwise just means the rule doesn't describe reality.
- **`docs/meta-tracking-audit.html` is live, public, and priced** ($250 diagnostic, $500–1,500 implementation, `mailto:` CTA), linked from `docs/index.html`. It shipped in one commit, outside every gate this file describes, and no ops file ever recorded it passing origination/adversarial/qi-check review. It is not retroactively gated here — those gates are built for short-form social copy (first-screen density, bait patterns, X-specific length bands) and don't fit a sales page's job. Stated plainly instead: **this page shipped outside the process, it is the most promising thing in the repo (see `DIRECTION.md`), and the rule that should have caught or blessed it never existed.** If it needs changes, review it as a sales page on its own terms, not by forcing it through the X-post gate.
- **The six named accounts are live** (X `@SignaL_OriginHQ` — Live + Premium — TikTok, Instagram, YouTube, Gmail, Notion; see `ops/LIVE_SURFACES.md`). Account creation already happened; the rule this file states now is about *posting*, not about accounts not existing.
- **What "never publish" actually still means, correctly scoped:** never post to the X/TikTok/Instagram/YouTube accounts, never send anything from the Gmail account, never upload to Notion beyond internal mirroring, without the specific piece being listed under Approved in `ops/PASS_QUEUE.md` (for social copy) or explicitly reviewed on its own terms (for anything else, like a sales page). That rule is real and still holds.

## Authority
Full ownership of all internal seats. Human owner Garrett Baxley consulted ONLY for irreversible external actions (accounts, Premium, domain purchase, budget, optional ads, and any post/send/upload to a live account or surface). Those items are blocked status only — not nagged in a loop.

## Hard stops
About to post to a live account, send from the Gmail account, upload to Notion, create an account, or move money → stop, get the owner.  
About to invent a payment or account flow → stop.  
Candidate fails originality/policy → Kill, log pattern, do not ship.  
Unsure whether something is public-facing → check `docs/` and `ops/LIVE_SURFACES.md` first; several things already are. Unsure whether something is postable to a live account → it is not, until it's listed under Approved in `ops/PASS_QUEUE.md`.

Revenue is the only scoreboard.
