# Free-core micro-tool — experiment spec

**Status:** Draft locked for build path  
**Date:** 2026-08-24  
**Constraint:** Not AI packages / prompt packs / agent kits. Free core → paid wedge.

---

## Niche (chosen)

**Name working title:** Viewport Hold / Qualified Impression Checker (internal code: `qi-check`)

**One-liner:**  
A free tool that scores a draft post for *first-screen density* and *qualified-impression fitness* (Premium Home Timeline ≥50% visible proxy heuristics) before you publish — aimed at operators optimizing for Original Content Rewards-style ranking, not engagement bait.

**Why this niche**
- Aligns with OCR doctrine already in `ops/OCR_ALIGNMENT.md`
- Differentiated from saturated “AI caption generators”
- Human-primary: user pastes *their* draft; tool scores structure/viewport/holds — does not write the post for them as a package
- Clear free vs paid wedge

## Free core
- Paste text → scores: first-screen substance, estimated fold length, bait-pattern hits, basic burstiness/length variance, checklist against OCR-oriented rules
- Export short “fix list” (not a rewritten viral post)
- No account required for limited daily uses

## Paid wedge (later)
- History + saved brand voice notes (user-owned)
- Batch score threads
- Measurement log template export tied to impression proxies
- Optional API for power users

## Non-goals
- Auto-posting
- “Humanizer” / detector bypass
- Selling prompts or agent swarms

## Success criteria (30-day experiment)
- 50+ organic uses or waitlist signups without paid ads
- At least 3 written case notes from real drafts (Signal Origin own posts count)
- Clear keep / kill / pivot decision logged in ACTION_LOG

## Build order
1. Spec only (this file) — done  
2. Minimal web UI on free host (Vercel) when owner capacity allows — no purchase required for free tiers  
3. Stripe only after paid wedge is defined and used internally first  

SO-008 stays Rewrite/Hold: public “market voted against packages” post only after this niche has a named public face.
