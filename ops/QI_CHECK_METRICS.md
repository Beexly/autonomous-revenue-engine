# qi-check metrics v1

**Product:** Viewport Hold / Qualified Impression Checker  
**Input:** user draft text (and optional platform = X)  
**Output:** scores + fix list — does **not** rewrite into a viral post package

## Core scores (0–10 each)

1. **First-screen density**  
   Does the core claim land in the first ~140–180 characters (or first 2 short lines)?  
   High = claim visible without expand.

2. **Fold structure**  
   Short opening line + concrete mechanism vs buried lede or pure hook bait.

3. **Bait pattern hits** (invert: more hits = lower score)  
   Numbered growth listicles, “hot take / will be banned”, share-this closers, empty “not X but Y” stacks, engagement-farm CTAs.

4. **Length fitness (X)**  
   Prefer focused single posts or tight threads; penalize sprawling unfocused walls with no early payoff.

5. **Burstiness / sentence variety (lightweight)**  
   Sentence-length coefficient of variation; very flat cadence = soft penalty.

6. **OCR alignment checklist**  
   Binary flags: original-angle present? reply-primary only? substance past first screen?

## Composite
- Weighted total → **Hold / Soft rewrite / Hard rewrite** recommendation  
- Never auto-publish  
- Never claim detector-proof or human-laundered

## Free tier limits (planned)
- N scores per day per IP/browser without account  
- Paid later: history, batch, export measurement log

## Non-metrics
- Follower count prediction  
- “Virality score” vanity  
- AI-detector bypass score
