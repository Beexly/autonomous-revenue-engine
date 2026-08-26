# GARRETT'S PENDING WORK

**Updated:** 2026-08-24 19:26 CDT  
**Repo:** Beexly/autonomous-revenue-engine  
**Rule:** Minimum human steps. Everything else is operator-owned.

---

## Do now -- security (do this first)

1. **Rotate or revoke the Meta access token for Meta app ID 1099624436068516.** This token is still fully recoverable from this repo's git history — run `git show 0a38eed:ops/META_KEY.local` to see it — even though the file that held it was deleted from HEAD. Deleting the file did not revoke the token; it is still live until rotated. This is an account action only Garrett can take, in the Meta App Dashboard, and is unrelated to any code change.

2. **PR 17 needs a decision from Garrett.** https://github.com/Beexly/autonomous-revenue-engine/pull/17 (branch `claude/signal-origin-handoff-vzl6b0`) is open and carries content not yet on main. No automated session can touch that branch or self-merge it, so only Garrett can rebase it (or merge main into it) or close it.

---

## Do now

1. **Apply CRT identity** (Identity tab / brand pack)
   - Avatar → X, Instagram, TikTok, YouTube, Gmail
   - X header + YouTube banner
   - Kill any old ring mark

2. **Do not post.** Hold floor is **9.2**. SO-012 was 7.9 (Soft rewrite). Paste SO-013 into qi-check after Build threshold sync; only publish if it shows Hold ≥ 9.2 and is listed under Approved in [PASS_QUEUE.md](./PASS_QUEUE.md).

3. **Optional — Grok 4.6 Build prompt** (if you open Build to sync the gate):

```
Signal Origin qi-check gate sync.

1. Hold recommendation requires composite >= 9.2 AND firstScreenDensity >= 8 AND baitAvoidance >= 9. Soft rewrite for 7.0–9.19. Hard rewrite below 7.0 or bait < 6. The UI currently labels 7.9 as Hold — that is wrong.
2. VoiceFit must hard-penalize one-word / two-word staccato lines ("Clean structure." "Not policy. Quality."). Fragments like that are Soft rewrite maximum.
3. Score this draft and report full breakdown + recommendation:

We killed three posts that had already cleared our own Pass gate.

Each one was clean and structured enough that a hundred AI-operator accounts could have run the same lines. The swap would not have shown.

We chose silence over a first impression that teaches people we are generic.

4. If composite < 9.2, propose one Soft rewrite that keeps human-primary authorship (no new facts, no CTA, no hashtags) and re-score. Do not mark Hold until the floor is cleared.
5. Commit threshold constants to the score module so 8.x can never display as Hold again.
```

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
