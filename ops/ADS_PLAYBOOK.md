# Ads playbook — ACTIVE now (2026-08-25)

Not deferred. Spend is still human APPROVE. Everything else in this file is in motion.

## Hard gates
- No spend, no campaign create, no budget, no unpause until Garrett types `APPROVE spend` plus a daily cap.
- No Sports/DFS in creative, targeting, or claims.
- No public posts until `APPROVE SHOW HN` / `APPROVE ROOT` / `APPROVE HN`.
- Never claim EMQ, RPM, or ROAS we did not measure.
- Cursor cannot OAuth Meta Ads MCP (dynamic client registration unavailable). Do not wait on it. Use CAPI helpers + Events Manager + Devtools docs.

## This week (no spend)
1. Dual-signal kit lives at `docs/ads-signal.html` (shared `event_id`, SHA-256 PII, Pixel + CAPI payloads). It does not send.
2. Python twin: `apps/conformal-lite/conformal_lite/capi.py`. Sends only if `META_PIXEL_ID` and `META_ACCESS_TOKEN` are in env. Attribution: 7d click + 1d view.
3. Log every test row in `ops/ADS_CALIBRATION.csv` (platform number vs backend number). Empty cells stay empty. No invented fills.
4. Destination for any future paid click: githack hub / qi-check, not a fake Vercel URL.
5. Organic winners only. Drafts in Distro. Human posts.
6. Meta Devtools MCP is connected (read-only). Ads MCP stays dark until Meta supports this client or a Meta app CLIENT_ID exists in env. Work around, do not park.

## Signal order (still no spend)
1. Pixel + CAPI sharing `event_id`.
2. Hashed email/phone/external_id/fbp/fbc on CAPI only.
3. Events Manager test events until Pixel and CAPI show as deduped.
4. Record EMQ from Events Manager when it exists. Do not write EMQ >=6 until that number is real.
5. Only then request `APPROVE spend` with a $1-$5/day ABO creative test against the free-core URL.

## Paid (blocked)
ABO creative tests then winners into Advantage+. Backend (Stripe/server) is the money number. Meta reported conversions are a lagging proxy. Frequency above 3 plus CTR down means fatigue: pause, do not scale.

## Calibration
Use conformal-lite (`cd apps/conformal-lite`, `from core import make`) on CPM/CTR/RPM streams with ACI/SAOCP. CQR needs real `q_lo`/`q_hi`. Omitting them is a dummy +/-1 band.

## Sports
Out. Forever. Not a SKU, not a targeting interest, not a case study.
