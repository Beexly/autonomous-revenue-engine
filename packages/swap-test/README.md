# @signalorigin/swap-test

Interchangeability scorer for drafts. It swaps first-person specifics for
"BrandX" and checks whether the copy still works as a generic brand pitch:
pronoun-free slogans, operator jargon without a lived constraint, missing
digits / proper nouns / decision verbs. Higher score = more
interchangeable (worse); the recommendation is **specific**,
**swap-risk**, or **interchangeable**. Lets the swap-test run in CI
without a browser. It does not rewrite.

## Usage

```js
import { scoreSwap } from "@signalorigin/swap-test";

const result = scoreSwap(
  "unlock exponential growth with the ultimate operator playbook and scale your personal brand today"
);
console.log(result.score, result.recommendation);
// 8 "interchangeable" — this copy survives the BrandX swap
```

## DO NOT PUBLISH YET — owner action

This is a draft package. Publishing to npm is an **owner-only** action
(`npm publish` by Garrett Baxley). Until then it is a file in the repo.

## Source of truth

`index.js` is an exact byte-for-byte copy of `apps/swap-check/lib/swap.js`
in this repo. That file is the source of truth; `test.mjs` asserts the copy
has not drifted.
