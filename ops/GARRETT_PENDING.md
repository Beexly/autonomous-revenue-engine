# GARRETT'S PENDING WORK

**Updated:** 2026-08-26  
**Repo:** Beexly/autonomous-revenue-engine  
**Rule:** Minimum human steps. Everything else is operator-owned.

---

## OWNER ACTION — DO THIS FIRST

**Rotate the Meta credential.** A Meta platform credential (`META_LLM_KEY`) was committed to this public repo in `0a38eed` and, although later deleted from HEAD, is still retrievable from git history by anyone who clones the repo. **History rewrite or repo re-creation is the only way to remove the blob; rotation is the only way to make it harmless.** Rotate it now at the Meta App Dashboard — this cannot be done from inside the repo or by an agent working in it. Full detail, with nothing sensitive reproduced: `SECURITY_INCIDENT.md` at repo root.

---

## Do now

1. **Apply CRT identity** (Identity tab / brand pack)
   - Avatar → X, Instagram, TikTok, YouTube, Gmail
   - X header + YouTube banner
   - Kill any old ring mark

2. **Do not post without your own review.** Hold floor is **9.2**, unchanged. Paste any candidate into qi-check yourself before pasting to X; only publish if it shows Hold ≥ 9.2 and is listed under Approved in [PASS_QUEUE.md](./PASS_QUEUE.md).

3. ~~Optional — Grok 4.6 Build prompt (sync the gate)~~ — **done directly in code, 2026-08-26.** This item asked an external tool to make sure "8.x can never display as Hold again." That was backwards: the actual bug was that the scorer's ceiling (9.0) sat *below* its own 9.2 Hold floor, so *nothing* — not even a perfect draft — could ever reach Hold. Fixed in `apps/qi-check/lib/score.js` (real paths to 10 on `firstScreenDensity`/`foldStructure`, a hard staccato-fragment cap replacing the never-implemented "VoiceFit" idea above). Proven by `apps/qi-check/lib/score.test.js`: a named excellent draft now reaches Hold, a named mediocre one and a staccato-heavy one do not, and all three hand-synced copies of the scorer (`lib/score.js`, `public/hold.html`, `docs/qi-check.html`) are asserted identical. Nothing was lowered to make this pass.

---

## Done (do not redo)

- [x] Create X / IG / TikTok / YouTube / Gmail
- [x] X Premium paid (personal, not Business)
- [x] X bio applied
- [x] OpenRouter key + Laguna-S / ox-alpha route
- [x] Hold floor **9.2** locked in repo (2026-08-24)

---

## Later

| Item | When |
|------|------|
| Domain + ~$50 | After first real Hold post |
| X API paid credits | Only when poster scaffold is ready |
| Notion operator grant | Optional |
| Stripe / x402 mainnet | Not now |

## Do not
- Post anything under 9.2 Hold
- Open gadget-market-intelligence-dashboard
- Generate a second brand mark
- Buy paid LLM credits
- Use `@Signal_origin` (wrong handle)
