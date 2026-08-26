# Pass queue

**Account:** @SignaL_OriginHQ  
**Bar:** QUALITY_BAR + adversarial + **qi-check Hold ≥ 9.2**

**2026-08-26 gate fix:** `apps/qi-check/lib/score.js`'s composite ceiling was capped at exactly 9.0 — below the 9.2 Hold floor for every possible input, an arithmetic bug, not a quality bar. Fixed; see `ops/QUALITY_BAR.md` and `score.test.js`. Scores below predating this fix (SO-010, SO-012) were computed under the old, capped scorer and are reconciled inline below where they changed.

## Approved to publish

### SO-013 — cleared the fixed gate 2026-08-26

```
We killed three posts that had already cleared our own Pass gate.

Each one was clean and structured enough that a hundred AI-operator accounts could have run the same lines. The swap would not have shown.

We chose silence over a first impression that teaches people we are generic.
```

**qi-check output** (`apps/qi-check/lib/score.js`, run directly, not hand-computed):

| sub-score | value |
|---|---|
| firstScreenDensity | 10 |
| foldStructure | 10 |
| baitAvoidance | 10 |
| lengthFitness | 9 |
| burstiness | 6 |
| **composite** | **9.5** |
| **recommendation** | **Hold** |

Clears every AND-condition in `ops/QUALITY_BAR.md`: composite 9.5 ≥ 9.2, density 10 ≥ 8, bait 10 ≥ 9. Only remaining fix flagged by the scorer itself: "Vary sentence length; avoid flat model cadence" (burstiness 6/10) — a real but non-blocking note, not a floor violation.

**Adversarial read against `ops/QUALITY_BAR.md`'s Pass requirements** (done directly, since a fresh pair of human eyes isn't available in this session — the owner should still apply their own before pasting):
1. Specific ✓ — a real number ("three posts"), a real decision ("killed").
2. Voice ✓ — first-person, reflective, not brand-deck.
3. First screen ✓ — the decision is the opening clause.
4. Tension ✓ — reputational risk (shipping something swappable/generic), refused.
5. Non-substitutable — **the one real risk**: "we killed our own posts for being generic" is itself a familiar self-aware-quality-theater narrative in AI-operator circles. It clears the letter of QUALITY_BAR's fail patterns (no balanced triples, no empty contrast, no sermon closer — the last line stays tied to one concrete action) but a skeptical reader could still read the closing line as a tidy moral. Judgment call, not a kill.
6. Human-primary ✓ — angle and idea are this operator's own doctrine, not invented here.

**Verdict: Pass (conditional)** — same framing `ops/REVIEW_SO009_011.md` used for this exact family of post. Ship only as one post, not a series, per that same review's rule.

## Owner action — the one click left

Paste the SO-013 text above on `@SignaL_OriginHQ`. That is the only step this repo cannot take for you — everything upstream of it (rewrite, gate, adversarial read) is done. Update this file's status to POSTED afterward.

---

## Soft rewrite / internal

(SO-013 moved to **Approved to publish** above, 2026-08-26 — cleared the fixed gate. Kept here only as the record of why that phrasing was chosen: kill + number in sentence one for density; full sentences only, no staccato fragments; the lived cost is choosing silence after an internal Pass; ~55 words, the X band that holds.)

### SO-012 — failed (7.9 as recorded)
Density 7, one-word cadence flagged under a dimension this doc called "voiceFit." `voiceFit` was never implemented in `score.js` or `ops/QI_CHECK_METRICS.md` — a phantom scoring dimension governing a real publish decision. Fixed 2026-08-26: the one/two-word staccato-fragment pattern this was trying to catch is now a hard cap inside `burstiness` (`hasStaccatoOveruse` in `score.js`) — a draft that's more than 40% staccato fragments cannot reach Hold, regardless of composite. SO-012's original draft text is `MISSING` (not found anywhere in this repo), so its 7.9 cannot be recomputed against the fixed scorer. Soft rewrite. Superseded by SO-013.

### SO-010 — failed (8.9, recomputed; previously recorded as 8.3)
Kill buried on line three (real text: `ops/REVIEW_SO009_011.md`). Soft rewrite under the 9.2 floor both before and after the gate fix — `firstScreenDensity` stays capped below 8 because the opening clause ("We marked three posts Pass") carries no decision word. The 8.3 previously recorded here came from an external sandbox score that was never run against the shipped scorer; `score.js` (both before and after the 2026-08-26 fix) has never returned 8.3 for this text — see `apps/qi-check/lib/score.test.js`.

---

## Not approved
- SO-009, SO-011, SO-001–008 — as before
