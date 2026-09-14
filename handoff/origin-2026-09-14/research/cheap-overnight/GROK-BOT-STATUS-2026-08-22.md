# Grok Bot status 2026-08-22 ~07:14 CT

## Facts
- Neon `gse-postgres` main compute `ep-summer-moon-apv5ccys` ACTIVE. SELECT 1 ok.
- origin/main `9d230f17` (#523). Live alias still `2e016327`.
- Prior prod Errors `sports-kp8jm1mkl` / `sports-23xggx350`: P1001 during migrate (compute asleep at ~06:59 CT). FAIL-CLOSED. Did not set MIGRATE_GATE_ALLOW_UNVERIFIED.
- New prod rebuild BUILDING: dpl_CJnC4EhgtTDoSPftDdFAN9ZnD3sU (sports-lox29tbme) SHA 9d230f17.
  Inspect: https://vercel.com/pick-pilot-s-projects/sports-web/CJnC4EhgtTDoSPftDdFAN9ZnD3sU
- Live truth: SHA 2e016327, oddsKeyPresent true, oddsInserting lastSuccessAt null, settlement null, calibration RED, canExposePublicPicks true. That is not a live edge (e=p−q). FAKE-EDGE if marketed as CLV.
- Live crons: Odds 402 circuit on old SHA; Prisma P1001 to pooler host while compute was idle.
- Hermes Ox Alpha already launched (watchdog 10308). Job hermes/ox-alpha-q-integrity. Do not start a second Hermes. Do not rebuild #522.
- Preview THE_ODDS_API_KEY still missing in Vercel UI (all branches).

## Assumptions
- Waking Neon + rebuild while compute is up is enough for migrate. If still P1001, DIRECT_URL host mismatch, not asleep.

## Completed
- Neon wake confirmed.
- Production redeploy of current main kicked (CLI, no main push).
- Spec holes recorded; Hermes owns slug/cap-sort/N+1.

## Waiting-approval
- Preview Odds key: Vercel UI, do not paste in chat.

## Blocked
- Live SHA until this rebuild is Ready.
- 0-credit remaining check after Ready SHA (not the old 402 SHA).
- X1 Shin until remaining > 5000 AND persist proven AND two-way mids.
- X4 Kalshi $0, 429 possible, not a pick list.

## Sources
- https://github.com/Beexly/Sports/commit/9d230f170176659ccb8c5d6c2d2bfc812d24cd0c
- https://www.galaxysportsedge.com/api/ops/public-surface-truth
- https://vercel.com/pick-pilot-s-projects/sports-web
