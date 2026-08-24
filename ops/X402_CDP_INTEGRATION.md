# x402 + CDP wallets — integration plan

**For:** Signal Origin / qi-check micropayments  
**Note:** CDP = Coinbase Developer Platform (not “CPD”).

---

## 1. x402 in one page

**What:** Open HTTP-native payment standard (Linux Foundation x402 Foundation, 2026). Revives **HTTP 402 Payment Required**.

**Flow:**
1. Client requests resource  
2. Server returns **402** + payment requirements (price, asset, network, payee)  
3. Client retries with signed payment (stablecoin, often USDC) in payment headers  
4. **Facilitator** verifies + settles on-chain; server returns the resource  

**Roles:** client (human or agent) · resource server (us) · facilitator (e.g. CDP-hosted; free tier ~1k tx/mo then small fee)

**Why it matters for us:** Pay-per-score / pay-per-API without accounts, API keys, or Stripe customer objects. Agents can pay. Humans with wallets can pay. V2 adds multi-chain, discovery, wallet identity (less repay-every-call friction).

**Ecosystem:** Spec + SDKs (TS/Python/Go), middleware one-liners, Stripe/Visa/MC among foundation members (fiat paths evolving). Volume is real (tens of millions of txs, mostly sub-dollar).

**Risks:** Crypto UX for non-wallet users; regulatory/compliance still evolving; USENIX-class security research on protocol risks — don’t be sole payment rail for mainstream US users day one.

---

## 2. CDP wallets (codebase-relevant)

Coinbase Developer Platform wallet products:

| Product | Custody | Best for |
|---------|---------|----------|
| **Embedded Wallet** | End user | App users, email/social/passkey auth, smart accounts |
| **Server Wallet** | Developer | Backend automation, treasury |
| **Agentic Wallet** | Agent-auth | AI agents spending under guardrails + x402 skills |

**Smart Accounts (ERC-4337):** batching, **paymaster** gas sponsorship (CDP paymaster on Base), spend permissions.

**Passkeys:** User unlocks smart wallet with biometrics/PIN; no seed phrase UX.

**x402 hooks:** `@coinbase/cdp-hooks` `useX402` / `fetchWithPayment` — client auto-handles 402 → sign → retry. Server uses x402 middleware + facilitator.

**tweazy reference:** Production-shaped demo of x402 + CDP Smart Wallets + passkeys + paymaster + MCP-priced AI calls (~0.01 USDC).

---

## 3. Integration design for qi-check

### Dual rail (recommended)
```
POST /v1/score  or  GET /check?url=

├── Stripe Checkout / payment link     ← default US mainstream
└── x402 on same route                 ← agents + crypto-native
```

Same product, two settlement paths. Do not crypto-only.

### Minimal x402 server (concept)
- Vercel/FastAPI/Next route protected with x402 `paymentMiddleware`
- Price e.g. **$0.01–0.05 USDC** per score on **Base**
- Facilitator: CDP free tier while volume low
- On settlement success → run qi-check → return JSON

### Client paths
| Buyer | Path |
|-------|------|
| Human (no wallet) | Stripe |
| Human (wallet) | Browser + CDP embedded/passkey or any x402 client |
| Agent | x402 headers autonomously; optional Agentic Wallet skills |

### What we do **not** do yet
- Hold user private keys in our process  
- Require crypto to use the product  
- Mix payment with X auto-posting  

---

## 4. Implementation phases

| Phase | Work | Dependency |
|-------|------|------------|
| **0** | qi-check works free or Stripe-only | Product MVP |
| **1** | Add x402 middleware on score endpoint + CDP facilitator testnet | Phase 0 |
| **2** | Mainnet Base USDC + pricing experiment | Phase 1 stable |
| **3** | Optional embedded wallet UI for humans who want passkey pay | Demand |
| **4** | Agent docs (“pay with x402 to call /v1/score”) | Agent traffic |

### Owner setup later (not now)
- CDP project + API keys in Vercel secrets  
- Receive address for USDC settlements  
- Stripe remains primary fiat rail  

### Packages to study
- `x402` / `@x402/mcp` / `x402-fetch`  
- `@coinbase/cdp-hooks`, `@coinbase/cdp-core`  
- tweazy as end-to-end reference  
- Spec: github.com/x402-foundation/x402  

---

## 5. Decision

**Add to roadmap as second payment integration** after qi-check has a working score path.  
**Primary revenue near-term:** X OCR path + Stripe for tool.  
**x402/CDP:** strategic for agent buyers and micropay conversion without accounts — not a blocker for SO-010 or first tool users.
