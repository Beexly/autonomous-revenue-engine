# Base Sepolia — qi-check x402 test path

## Goal
Prove 402 → EIP-3009 signature → facilitator verify/settle → score response on testnet before Base mainnet.

## Network
- Chain ID: **84532**
- USDC (test): `0x036CbD53842c5426634e7929541eC2318f3dCF7e` (confirm on Circle/Base docs before funding)
- Explorer: https://sepolia.basescan.org

## Owner one-time (when ready to test payments)
1. CDP Portal project → API key ID + secret → Vercel env `CDP_API_KEY_ID` / `CDP_API_KEY_SECRET`
2. Receive address for test USDC (`QI_PAY_TO`)
3. Optional: embedded wallet test user with passkey on Sepolia
4. Fund test wallet with Sepolia ETH (paymaster may sponsor) + Sepolia USDC faucet if required

## Deploy app
```bash
cd apps/qi-check
npm i
npm run build
# Vercel: root apps/qi-check or monorepo filter
```

Free score path needs **no** chain:
```bash
curl -X POST https://<host>/api/score -H 'content-type: application/json' -d '{"text":"..."}'
```

## x402 attach order
1. Free `/api/score` live  
2. Middleware returns 402 with `paymentRequirementsTemplate({ network: "base-sepolia", to: process.env.QI_PAY_TO })` when `X402_ENABLED=1`  
3. Client retries with payment signature  
4. Server calls CDP facilitator verify → run score → settle → 200  

## Do not
- Enable mainnet until Sepolia round-trip works once  
- Put private keys in repo or chat  
- Require crypto for all users (Stripe remains default rail)
