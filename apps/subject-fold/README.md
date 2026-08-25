# subject-fold

Scores an **email subject** for fold/hold: a specific decision or cost in the subject vs newsletter bait (OCR_ALIGNMENT qualified-impression / hold attention, applied to email — not X posts, not HN titles).

Professional niche: operators writing launch/update emails.

**Higher score = holds / specific.** 0 is bait / empty. This Hold is its own scale for subjects; it is not a first-screen X scorer. This does not rewrite. It does not publish.

Free-core, human-primary: you paste your own subject. No account, no Stripe, no API keys.

## Run

```
git clone https://github.com/Beexly/autonomous-revenue-engine.git
cd autonomous-revenue-engine/apps/subject-fold
node cli.js --subject "Killed the Pass queue rather than ship generic"
```

JSON prints to stdout: `score` (0–10), `hits`, `recommendation` (`hold` | `soft` | `bait`).

Requires Node 18+.

## Tests

```
npm test
```

## Library

```
import { scoreSubject } from "./lib/fold.js";
```

Heuristics (deterministic, original):

- Length (too long buried, too short empty)
- CTA bait (“don't miss”, “you won't believe”)
- ALL CAPS
- Missing specific noun or number
- Re:/Fwd: noise
- Empty “update” / “newsletter #12”

## Not this tool

Not a rewriter. Not a first-screen X scorer. Complements qi-check; does not change qi-check scoring.
