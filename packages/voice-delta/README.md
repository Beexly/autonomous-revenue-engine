# @signalorigin/voice-delta

Classic Burrows' Delta in plain JavaScript. Given a candidate text and a
set of reference documents, it computes the mean absolute z-score
difference over the top-n most frequent word features. Lower delta means a
closer stylistic match. It does not prove authorship, does not rewrite,
and does not publish. Also exports `tokenize`, `featureFreqs`,
`topFeatures`, and a `burstiness` (sentence-length CV) helper.

## Usage

```js
import { burrowsDelta } from "@signalorigin/voice-delta";

const references = [
  "We killed the newsletter after three issues. It cost six hours a week.",
  "I refused the retainer. The scope had no floor and the deadline had no date.",
];
const candidate =
  "We shipped the smaller tool first. It paid for the month in a week.";

const { centroidDelta, lowerIsCloser } = burrowsDelta(candidate, references, {
  nFeatures: 50,
});
console.log(centroidDelta, lowerIsCloser); // e.g. 0.83 true
```

## DO NOT PUBLISH YET — owner action

This is a draft package. Publishing to npm is an **owner-only** action
(`npm publish` by Garrett Baxley). Until then it is a file in the repo.

## Source of truth

`index.js` is an exact byte-for-byte copy of `apps/voice-delta/lib/delta.js`
in this repo. That file is the source of truth; `test.mjs` asserts the copy
has not drifted.
