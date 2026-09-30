# Dev.to technical article draft — do not post, do not publish

**Title:** The Hold floor is 9.2: how qi-check scores a draft without writing one

**Tags:** javascript, webdev, opensource, writing

**Destination (verified, not submitted):** https://dev.to/new — WebFetch title "New Post - DEV Community"; unauthenticated view is the join/sign-in wall ("Join the DEV Community", Continue with GitHub/Google/etc.). Box curl: HTTP 200. Did not log in. Did not create an account. Did not submit.

**Canonical / source URLs:**
- Repo: https://github.com/Beexly/autonomous-revenue-engine (`apps/qi-check`, `lib/score.js`)
- Live page: https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/qi-check.html (static HTML; scoring in-page; no server, no account, no Stripe in the scoring path)

**Offer (one):** the free githack page. No Stripe. No PDF.

---

## Body (paste into the Dev.to editor)

---
title: The Hold floor is 9.2: how qi-check scores a draft without writing one
published: false
tags: javascript, webdev, opensource, writing
canonical_url: https://github.com/Beexly/autonomous-revenue-engine
---

Three drafts cleared our internal Pass queue. qi-check scored the lead one (SO-010) 8.3 — Soft rewrite, not Hold. Hold is 9.2. Approved to publish: none. The kill was interchangeability: swap those lines onto a hundred other operator accounts and the join would not show. That gap is why the scorer exists, and why it is not a rewriter.

qi-check is a deterministic gate in [`apps/qi-check/lib/score.js`](https://github.com/Beexly/autonomous-revenue-engine/blob/main/apps/qi-check/lib/score.js). You paste a draft. It returns a composite, five axis scores, a recommendation, and a fix list. It does not write a replacement. It does not publish. The same functions are inlined on a static page so you can run them with no install and no server:

https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/qi-check.html

The page says that on the first screen: scoring runs in this page, no server required. There is no Stripe in the scoring path.

## Floors, not vibes

```js
export const HOLD_FLOOR = 9.2;
export const SOFT_FLOOR = 7.0;
```

Empty input short-circuits to Hard rewrite. Everything else is a weighted sum of five axes, rounded to one decimal, then branched:

- **Hard rewrite** if `total < SOFT_FLOOR` (7.0) **or** `baitAvoidance < 6`.
- **Soft rewrite** if not Hard, and any of: `total < HOLD_FLOOR` (9.2), `firstScreenDensity < 8`, `baitAvoidance < 9`, or three or more fixes.
- **Hold** only if none of those fire.

A composite of 9.3 can still miss Hold if the first screen is thin or a bait pattern hits. 8.3 cannot Hold. That is how SO-010 stayed Soft rewrite after Pass had already waved it through.

Weights in `scoreDraft`:

| axis | weight |
| --- | --- |
| firstScreenDensity | 0.30 |
| foldStructure | 0.20 |
| baitAvoidance | 0.25 |
| lengthFitness | 0.15 |
| burstiness | 0.10 |

No model. Same input, same number.

## What each axis actually measures

**firstScreenDensity** looks at the first ~160 characters after whitespace collapse. A concrete claim in that window (decision verbs such as killed / paid / refused / built / measured / failed / shipped / cut / deferred, a digit, or a head longer than 40 characters) starts at 7; otherwise 4. A buried lede (`so`, `well`, `today`, `in this`, `let me`, `I've been`) subtracts 2. A question in a head shorter than 80 characters subtracts 1. A decision verb in the opening sentence adds 1.5. Scores clamp to 0–10.

**foldStructure** wants a short open line (≤90 characters) and a body after it. All-caps opens longer than 20 characters are penalized. Three or more paragraphs get a small bonus. The job is to keep the lede from eating the fold.

**baitAvoidance** starts at 10 and subtracts 2 per hit on a small regex list: "hot take", "will be banned", "like if you agree", "comment yes/below/if", "share/retweet this", thread-plus-emoji, "N ways/tips/habits/mistakes", "not financial advice", "growth hack". This is not a toxicity model. It is a refusal to treat engagement-farm phrasing as shippable.

**lengthFitness** is a band, not a word-count fetish: under 40 characters scores 3; up to 400 scores 9; up to 900 scores 7; up to 2000 scores 5; longer than that is 3. The scorer is built for a first screen that has to stand, not for a 4,000-word essay.

**burstiness** is the coefficient of variation of sentence word-counts. Flat cadence (cv under 0.2) scores 4. Moderate variation lands at 6 or 8. cv at or above 0.55 scores 9. A single sentence is 6 — there is nothing to vary yet.

Fixes are derived from those scores (weak first screen, buried fold, bait, sprawl, flat cadence, missing a specific decision/cost/failure) plus a line that names the composite against the Hold floor. The page renders the recommendation, the total, the five numbers, a first-screen preview, and that list. It never proposes replacement copy.

## What it will not do

It will not rewrite the post. It will not publish. It will not claim AI-detection bypass. The interchangeability kill on those three Pass-cleared drafts was a human log, not a score — qi-check had already refused Hold at 8.3. The scorer is the part that refuses to author. If you need a number on a draft you were about to ship, the page above is the whole offer.

Repo: https://github.com/Beexly/autonomous-revenue-engine

---

**Swap-test (not part of the post):** Holds only as an explanation of this scorer — HOLD_FLOOR 9.2, SOFT_FLOOR 7.0, the five named axes and weights, the Hard/Soft/Hold branches, and the lived 8.3 / Pass-queue / interchangeability kill. Swap onto a generic detector, humanizer, or "how I use LLM judges" article and those floors and the does-not-rewrite constraint fall out.

**Verification (not part of the post; 2026-08-25):**
- https://dev.to/ — WebFetch returned the DEV Community homepage (article feed, "Log in / Create account"). Box curl: HTTP 200.
- https://dev.to/new — WebFetch returned "New Post - DEV Community" then the unauthenticated join/sign-in wall. Box curl: HTTP 200. Not logged in. Not submitted.
- https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/qi-check.html — WebFetch returned the Viewport Hold scorer page (paste, Score, does not write, does not publish, in-page scoring). GitHub raw of `docs/qi-check.html` confirmed inlined `score.js` v0.2.0. jsDelivr of `apps/qi-check/lib/score.js` returned the same HOLD_FLOOR / SOFT_FLOOR / five-axis `scoreDraft`. Box curl to githack: Cloudflare HTTP 403; content confirmed via WebFetch + GitHub raw + jsDelivr.
