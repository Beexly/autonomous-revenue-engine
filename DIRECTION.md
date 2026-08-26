# Direction — 2026-08-26

**One direction gets worked from here: D, the Meta tracking service.**

## Why D, argued rather than accepted on the owner's say-so

Four candidates existed with real work behind them:

- **A — X content brand.** Requires reach before it pays: OCR eligibility alone needs 500 verified followers and 500k qualified Home-Timeline impressions in 90 days. Zero posts have shipped in three days of work on the gate that was supposed to produce them. Slowest path to a dollar of the four.
- **B — qi-check / Viewport Hold.** The stated "locked direction." Its blocker — the Hold floor was mathematically unreachable — is fixed as of this session (see `apps/qi-check/lib/score.js`, `score.test.js`). But fixing the gate produces posts, not customers: there is no priced offer, no named buyer, and the paid wedge ("history/batch/API, later") has never been scoped past that one phrase in every doc that mentions it.
- **C — conformal-prediction infrastructure + Lago billing.** The single largest code artifact in the repo, now also the most correct after this session's fixes (real coverage, a valid e-value, honest CQR docs). It appears in zero strategy documents — not `OPERATING.md`, not `STRATEGY.md`, not `EXPERIMENT_NICHE.md`, not `FIRST_BATCH.md`. That absence isn't neutral: the people writing this repo's own strategy never once reached for it as the business. It reads as a research interest that got built because it was interesting to build, not because a customer was asking for it. Selling calibrated uncertainty quantification is also a long, technical sales cycle to a narrow enterprise buyer — a bad match for an operator with $0 revenue and no sales motion.
- **D — Meta tracking service.** Shipped by accident: never named in a strategy document, visible only in one commit and the live page it produced. And yet it is the only candidate with an actual priced, buyer-facing artifact (`docs/meta-tracking-audit.html` — $250 diagnostic, $500–1,500 implementation) backed by twelve working diagnostic tools (`docs/tools/*`) against a narrow, well-understood, expensive-to-get-wrong problem: Meta Pixel/CAPI event deduplication and event-match quality. Businesses already pay agencies for exactly this audit; the market is proven even though this specific instance has zero customers yet. "It got there by escaping the process" is uncomfortable, but it is evidence of pull, not an argument against it — nothing else on this list has pull.

D wins on the one axis that matters most for an operator at $0 revenue: distance to the first dollar. It is not the most technically interesting work in the repo (that's C) and it is not the direction three days of strategy docs pointed at (that's B) — it is the direction closest to a stranger being able to pay for something.

## Parked, with reasons

- **A (X content brand)** — parked. Revisit once B's fixed gate has actually produced a run of Hold-passing posts and there's an audience worth measuring; not before.
- **B (qi-check / Viewport Hold)** — parked as the *primary* direction, not abandoned. The gate fix from this session stands on its own merits regardless of which direction is primary, and the one artifact shipped this cycle (see below) is a B artifact — finishing what was already 95% done costs nothing and proves the fix works end to end. Revisit as a primary direction only if D fails to find a buyer after real outreach.
- **C (conformal-prediction infrastructure)** — parked. The fixes from this session (real coverage test, valid e-value, honest CQR docs, working package) are worth keeping regardless — a correct free tool is better than a broken one whether or not it's the business — but building further on it without a named buyer would repeat the exact mistake this file exists to stop.

## What "worked" means starting now

New effort goes to D: finding out whether a real prospect will pay for the Meta tracking audit, using the tools that already exist. That means owner-gated outreach and conversation, not more tool-building — twelve tools already exist against this problem; the gap is a buyer, not more code. Nothing here authorizes contacting a prospect, sending anything, or spending money — those stay owner actions per every standing rule in this repo.

## What shipped this cycle

`ops/PASS_QUEUE.md`'s SO-013 — the post rewritten five times across three days — was run through the fixed qi-check gate and staged for owner approval. See `ops/PASS_QUEUE.md` for the result and exact gate output.
