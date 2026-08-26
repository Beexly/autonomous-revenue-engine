# @signalorigin/qi-score

Deterministic quality-gate scorer for short-form drafts. Scores five axes
(first-screen density, fold structure, bait avoidance, length fitness,
burstiness), composites them, and returns a recommendation: **Hold**
(publishable), **Soft rewrite**, or **Hard rewrite**. Hold floor is 9.2,
Soft floor is 7.0. It scores; it never rewrites and never claims
AI-detection bypass.

## Usage

```js
import { scoreDraft, HOLD_FLOOR, SOFT_FLOOR } from "@signalorigin/qi-score";

const result = scoreDraft(
  "We killed the newsletter after 3 issues. It cost 6 hours a week and moved nothing.",
  { platform: "x" }
);

console.log(result.total, result.recommendation);
// e.g. 8.7 "Soft rewrite" — anything below HOLD_FLOOR (9.2) does not ship as-is
```

## DO NOT PUBLISH YET — owner action

This is a draft package. Publishing to npm is an **owner-only** action
(`npm publish` by Garrett Baxley). Until then it is a file in the repo.

## Source of truth

`index.js` is an exact byte-for-byte copy of `apps/qi-check/lib/score.js`
in this repo. That file is the source of truth; `test.mjs` asserts the copy
has not drifted.
