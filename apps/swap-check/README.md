# swap-check

Interchangeability gate. Scores whether a draft could be swapped onto any AI-growth brand and still “work” (QUALITY_BAR fail pattern + SO-010: the swap would not have shown).

**Higher score = more interchangeable (worse).** 0 is specific / non-substitutable. This does not rewrite. It does not publish.

Free-core, human-primary: you paste your own draft. No account, no Stripe, no API keys.

## Run

```
git clone https://github.com/Beexly/autonomous-revenue-engine.git
cd autonomous-revenue-engine/apps/swap-check
node cli.js --text "We killed three Pass posts."
```

JSON prints to stdout: `score` (0–10), `hits`, `recommendation` (`specific` | `swap-risk` | `interchangeable`), `notes`.

Optional: `--brands GrowthOS,PromptForge,OperatorKit` (defaults to those three generic stand-ins).

Requires Node 18+.

## Tests

```
npm test
```

## Library

```
import { scoreSwap, DEFAULT_BRANDS } from "./lib/swap.js";
```

Heuristics (deterministic, original):

1. Pronoun-free brandable slogans
2. Generic operator jargon (leverage, unlock, 10x, agentic, playbook, scale, growth, personal brand) without a specific number / decision / failure verb (killed, paid, refused, shipped, deferred, cut)
3. Sentences that still parse after swapping first-person specifics for BrandX
4. Missing lived constraint (no digits, no proper nouns, no kill/refuse/pay verbs)

## Not this tool

Not a rewriter. Not a first-screen X scorer. Complements qi-check; does not change qi-check scoring. Static page: `docs/swap-check.html`.
