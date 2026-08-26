# Pass queue

**Account:** @SignaL_OriginHQ  
**Bar:** QUALITY_BAR + adversarial + **qi-check Hold ≥ 9.2**

**2026-08-26 gate fix:** `apps/qi-check/lib/score.js`'s composite ceiling was capped at exactly 9.0 — below the 9.2 Hold floor for every possible input, an arithmetic bug, not a quality bar. Fixed; see `ops/QUALITY_BAR.md` and `score.test.js`. Scores below predating this fix (SO-010, SO-012) were computed under the old, capped scorer and are reconciled inline below where they changed.

## Approved to publish

**None yet under this section — see `DIRECTION.md` / the current cycle's shipped-artifact note for whether SO-013 cleared the fixed gate.**

Nothing had cleared 9.2 before the fix. Do not post anything that hasn't gone through the fixed scorer *and* adversarial Pass.

---

## Soft rewrite / internal

### SO-013 — active candidate (re-score in Build)

```
We killed three posts that had already cleared our own Pass gate.

Each one was clean and structured enough that a hundred AI-operator accounts could have run the same lines. The swap would not have shown.

We chose silence over a first impression that teaches people we are generic.
```

**Why this version:**
- Kill + number in sentence one (density)
- Full sentences only — no “Clean structure.” / “Not policy. Quality.” staccato (burstiness's staccato-fragment cap in `score.js`)
- Lived cost: chose silence after an internal Pass
- ~55 words (X band that actually holds)

**Gate:** Paste into qi-check. Require composite ≥ 9.2 + recommendation Hold + adversarial Pass. Only then move to Approved.

### SO-012 — failed (7.9 as recorded)
Density 7, one-word cadence flagged under a dimension this doc called "voiceFit." `voiceFit` was never implemented in `score.js` or `ops/QI_CHECK_METRICS.md` — a phantom scoring dimension governing a real publish decision. Fixed 2026-08-26: the one/two-word staccato-fragment pattern this was trying to catch is now a hard cap inside `burstiness` (`hasStaccatoOveruse` in `score.js`) — a draft that's more than 40% staccato fragments cannot reach Hold, regardless of composite. SO-012's original draft text is `MISSING` (not found anywhere in this repo), so its 7.9 cannot be recomputed against the fixed scorer. Soft rewrite. Superseded by SO-013.

### SO-010 — failed (8.9, recomputed; previously recorded as 8.3)
Kill buried on line three (real text: `ops/REVIEW_SO009_011.md`). Soft rewrite under the 9.2 floor both before and after the gate fix — `firstScreenDensity` stays capped below 8 because the opening clause ("We marked three posts Pass") carries no decision word. The 8.3 previously recorded here came from an external sandbox score that was never run against the shipped scorer; `score.js` (both before and after the 2026-08-26 fix) has never returned 8.3 for this text — see `apps/qi-check/lib/score.test.js`.

---

## Not approved
- SO-009, SO-011, SO-001–008 — as before

## Owner step when ready
Draft shows **Hold ≥ 9.2** → listed under **Approved to publish** here → paste once on X → stop for the day.
