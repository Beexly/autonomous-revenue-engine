# voice-delta

Classic Burrows' Delta in original JavaScript. Scores a candidate draft against a Pass-style reference corpus.

**Lower Δ ⇒ closer stylistic match.** This does not prove human authorship. It does not rewrite. It does not publish.

Free-core, human-primary: you supply your own candidate and your own reference texts. No account, no Stripe, no API keys.

## Run

```
git clone https://github.com/Beexly/autonomous-revenue-engine.git
cd autonomous-revenue-engine/apps/voice-delta
node cli.js --candidate data/voice_reference/sample-a.txt --reference data/voice_reference
```

JSON prints to stdout. `centroidDelta` is Δ versus the reference centroid (mean z of the refs). Per-file Δ is under `perReference`. Burstiness (sentence-length CV) is included as a helper. Delta is the product.

Need at least two reference documents so σ is defined. The two seed files are Pass-style samples. For a real check, add more Pass-only `.txt` files and score a new candidate.

Requires Node 18+.

## Library

```
import { tokenize, featureFreqs, burrowsDelta, burstiness } from "./lib/delta.js";
```

Algorithm (classic form):

1. Tokenize (lowercase word tokens; function-word-heavy profile)
2. Relative frequencies of top n features (default 50, from the combined corpus)
3. Per-feature mean μ and std σ across reference documents
4. `z_i(D) = (f_i(D) - μ_i) / σ_i` (σ = 0 features are skipped)
5. `Δ(T,A) = (1/n) * Σ |z_i(T) - z_i(A)|`
6. Also Δ versus the reference centroid

## Tests

```
npm test
```

## Not this tool

Not a humanizer. Not a detector bypass. Complements qi-check (Hold floor 9.2 stays there). Does not change qi-check scoring.
