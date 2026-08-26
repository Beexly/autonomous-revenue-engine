# @signalorigin/hold-floor

The publish-gate constants as a tiny one-file module other gates can
depend on: `HOLD_FLOOR` (9.2) and `SOFT_FLOOR` (7.0), plus a
`classify(score)` helper. A score at or above 9.2 is **Hold**
(publishable as-is), 7.0–9.1 is **Soft** (soft rewrite), below 7.0 is
**Hard** (hard rewrite or kill).

## Usage

```js
import { HOLD_FLOOR, SOFT_FLOOR, classify } from "@signalorigin/hold-floor";

classify(9.5); // "Hold"
classify(8.0); // "Soft"
classify(6.0); // "Hard"
console.log(HOLD_FLOOR, SOFT_FLOOR); // 9.2 7.0
```

## DO NOT PUBLISH YET — owner action

This is a draft package. Publishing to npm is an **owner-only** action
(`npm publish` by Garrett Baxley). Until then it is a file in the repo.

## Source of truth

The constant values mirror the `HOLD_FLOOR` and `SOFT_FLOOR` exports in
`apps/qi-check/lib/score.js` in this repo. That file is the source of
truth for the values; `test.mjs` asserts they match its exports.
