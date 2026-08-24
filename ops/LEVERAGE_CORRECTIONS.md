# Leverage corrections — second pass on ban/ignore

**2026-08-24** — Owner challenged incomplete work. Re-opened hard ban + ignore.

---

## Critical correction: tweazy was misclassified

**Wrong first read:** “X auto-engage like reply bots.”  
**Actual:** [aaronjmars/tweazy](https://github.com/aaronjmars/tweazy) is **pay-per-query AI + MCP monetization** using **x402**, Coinbase CDP Smart Wallets, passkeys, paymaster, ~0.01 USDC/query on Base. MIT.

**No X posting/scraping in the product description.** Name is misleading for our taxonomy.

**Leverage for Signal Origin / qi-check:**
- Pattern for **usage-priced micro-tool** without classic Stripe subscription friction
- HTTP 402 → pay → unlock inference/result
- Relevant if qi-check or a research endpoint wants micropayments (crypto-native users)
- Not required day-one; Stripe still simpler for US mainstream
- **Move: Hard ban → Tier-2 monetization reference**

---

## ai-reply-guy — split, don’t blanket-ban the whole repo

| Component | Verdict |
|-----------|--------|
| **Chrome debugger auto-poster** (keystroke bypass on x.com) | **Hard ban** — policy/OCR/automation risk |
| **Dashboard + AI reply drafts + chat refine + manual Memory/Style guide** | **Salvageable pattern** — human posts the final text |

Use case for us: optional later “reply draft assist” for *owner* engagement on high-signal threads — drafts only, paste manually. Style guide manual edit aligns with human-primary. Do **not** ship the extension poster.

---

## Still hard ban (confirmed)
- MoneyPrinter* family — bulk low-quality video pipelines  
- Unofficial grok2api / free web API wrappers — redundant + ToS  
- Any tool whose primary value is **undetectable auto-post/auto-reply** on X  

---

## Ignore list — second look

| Item | Second look |
|------|-------------|
| Countly | Lite exists, but ops cost >> benefit for one X account. Use X analytics + simple sheet. **Stay ignore.** |
| Branch iOS SDK | Mobile deep links; we have no iOS app. **Ignore until native app.** Web UTM/simple links enough for qi-check. |
| Sherlock | Username OSINT across sites — weak brand-protection use only. **Ignore.** |
| hosts / zcash / Wallos / internships / Discord bots / Pintree / LBRY / money libs | Confirmed no leverage. |
| UncleJ-h/xs | Could not establish clear Signal Origin value from name alone; treat as ignore unless README proves otherwise. |

---

## New leverage map (corrected)

1. **Content quality / SO-010** — unchanged priority  
2. **qi-check product** — monetize via Stripe **or** study **tweazy/x402** pattern for pay-per-use  
3. **Postiz + Pass gate** — publish orchestration later  
4. **content-ideas / Apify** — research only  
5. **reply-guy dashboard patterns** — draft assist, never auto-post  
6. **agentic-ai-starters** — reviewer/worker patterns  
7. **awesome-oss-monetization** — pricing taxonomy  

Missed on first pass: **tweazy = micropayment AI architecture, not tweet spam.** That is real product leverage for a usage-priced tool.
