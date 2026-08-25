# hn-bait

Scores a **Show HN / HN / launch title** for bait vs specific substance (QUALITY_BAR bait + OCR_ALIGNMENT kill listicle/hot-take bait, applied to titles — not X post first-screen).

**Higher score = heavier bait.** 0 is a specific Show HN. This does not rewrite the title. It does not publish.

Free-core, human-primary: you paste your own title. No account, no Stripe, no API keys.

## Run

```
git clone https://github.com/Beexly/autonomous-revenue-engine.git
cd autonomous-revenue-engine/apps/hn-bait
node cli.js --title "Show HN: swap-check – interchangeability gate"
```

JSON prints to stdout: `score` (0–10), `hits`, `recommendation` (`ok` | `bait-risk` | `bait`).

Requires Node 18+.

## Tests

```
npm test
```

## Library

```
import { scoreHnBait } from "./lib/bait.js";
```

Heuristics (deterministic, original):

- Listicle (N ways/tips)
- Sensational (killed/destroyed/secret)
- Empty superlatives (ultimate, insane, game-changing)
- Missing artifact (no verb of shipping/building/showing a thing)
- All-caps
- Emoji
- “Ask HN” ragebait vs a named project

## Not this tool

Not a rewriter. Not a first-screen X scorer. Complements qi-check; does not change qi-check scoring.
