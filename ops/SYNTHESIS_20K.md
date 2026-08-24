# 20,000-ft synthesis — 2026-08-24 evening

## Facilitator architecture (x402)

Facilitator = optional but recommended service that **verifies** signed payment payloads and **settles** them on-chain so the resource server never talks to a chain.

**CDP Facilitator APIs:** `POST /v2/x402/verify` · `POST /v2/x402/settle`  
Auth: CDP API key. Screening: OFAC/KYT. Networks: Base, Polygon, Arbitrum, World, Solana (ERC-20 via EIP-3009 or Permit2; SPL on Solana).

**Seller flow with facilitator:**
1. Client request  
2. Server 402 + requirements  
3. Client pays, retries with signature  
4. Server → facilitator **verify**  
5. If valid → server does work (e.g. qi-check)  
6. Server → facilitator **settle**  
7. 200 + resource + payment response header  

We never run a node. We never validate signatures ourselves unless we choose to.

## Coinbase Smart Wallet / Embedded SDK

Packages: `@coinbase/cdp-core`, `cdp-hooks`, `cdp-react`, `cdp-wagmi`  
Auth: email / SMS / OAuth / **passkeys**  
Account types: EOA or **smart** (ERC-4337) via config `ethereum: { createOnLogin: "smart" }`  
Paymaster: gas sponsorship on Base  
x402: `useX402` / `fetchWithPayment` auto-handles 402→sign→retry  

**Seller side** does not require embedding Smart Wallet — only buyers who pay crypto need a wallet. Facilitator + middleware is enough for agent/wallet clients. Smart Wallet UI is optional polish for human crypto path.

---

## What this project actually is (tied together)

Two money paths, one brand:

| Path | Job | Constraint |
|------|-----|------------|
| **A. X Signal Origin** | Attention → OCR thresholds → creator payout | 110% originals only; no automation sludge |
| **B. qi-check micro-tool** | Usage revenue (Stripe + later x402) | Product must work; dual pay rails |

Everything else is infrastructure in service of A or B:
- Gates (quality, adversarial, originality) protect A and brand  
- Postiz + Pass queue = later publish pipe for A  
- x402 + CDP facilitator = later pay pipe for B  
- Research tools (Apify, content-ideas) feed angles for A, never copy-paste  
- Mutual-reply boost = late-graph effect, not day-one strategy  

## What’s working
- Surfaces live (X Premium, YT, IG, TT, Gmail, dev app $0)  
- Honest quality reset; SO-010 approved  
- OCR/ranking literacy  
- Monetization map (Stripe + x402) documented  
- Ban list corrected (tweazy = pay pattern, not spam)  

## What’s broken / incomplete
- **Zero public posts** — machine without a ship  
- **No qi-check MVP** — no product to put x402/Stripe on  
- **OCR miles away** (0/500 verified, 0/500k HT)  
- **Notion share** still blocked  
- Process docs > shipped artifacts  

## Ordered execution (stop expanding research)

### Now (owner minutes)
1. Paste **SO-010** when ready  
2. Optional bios / Notion share  

### Now (operator)
1. Next **non-meta** Pass drafts under QUALITY_BAR  
2. **qi-check** minimal implementation plan → scaffold on Vercel (score endpoint, free tier first)  
3. Stop repo tourism unless it unblocks 1–2  

### Next
4. Stripe on qi-check when tool returns real scores  
5. x402 middleware + CDP facilitator testnet on same route  
6. Postiz only after 3–5 manual Pass posts and a Pass-gate adapter  

### Later
7. Smart Wallet embedded UI if crypto buyers appear  
8. Mutual graph / OCR threshold grind via consistent high-signal originals  

## Improve
- **Ship bias over research bias** — facilitator/SDK knowledge is enough to build; more reading won’t score posts or run qi-check  
- **One public proof** of the quality bar (SO-010)  
- **One product proof** (qi-check returns a useful score)  
- Then money rails and schedulers earn their complexity  

**20k rule:** If it doesn’t make SO-010 better, produce the next Pass, or advance qi-check MVP, it waits.
