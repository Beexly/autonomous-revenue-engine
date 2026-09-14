# AGENT.md — shared status (append-only)

Canonical path: C:\\Users\\Garrett\\Sports\\docs\\ops\\AGENT.md
Also copy to: C:\\Users\\Garrett\\tmp\\AGENT.md if Sports is dirty.

Every agent (Grok CLI, Grok Bot / CoS, Lane Watcher, Claude, Hermes) appends one block per material change. No novels. No secrets.

## Format
### YYYY-MM-DD HH:MM CT | AGENT | CLEAN|BLOCK|FAKE-EDGE|OWNER_GATE
- Who / what
- Evidence (PR, HTTP, PID)
- Next action (one owner)

## Rules
- Do not start a second Hermes if handoff/cheap-overnight/watchdog.pid is live.
- No Odds event-odds or historical from bots.
- Do not market PUBLIC_PICKS as PROVEN/CLV.
- Phone: email Baxley.Garrett@gmail.com only on BLOCK / FAKE-EDGE / OWNER_GATE.

## Now (2026-08-22 01:38 CT)
### 2026-08-22 01:38 CT | Chief of Staff | OWNER_GATE + BLOCK + FAKE-EDGE
- Odds /v4/sports 401; remaining file 0/0. Neon P1001. Public picks model_signal n=0.
- Windows babysits Hermes+8317. Lane-watch overnight paused. Morning glance 08:00 CT.
- Next: founder (Vercel THE_ODDS_API_KEY + Neon). Claude (copy/gating). Hermes (T11 cheap queue).

### 2026-08-22 01:45 CT | Chief of Staff | OWNER_GATE (key) + no live edges
- Paid Odds key located in Gmail; backup at C:\Users\Garrett\tmp\.odds-api-key (not git). Vercel env not written (CLI logged out; Windows spawn aborted). Do not print key.
- No live book edges: Neon P1001, prod deploy ERROR, Kalshi public GET 429, no in-repo odds snapshots.
- Real program remains X1 Shin (needs Odds, preseason ~ends Aug 28) then X4 Kalshi $0. STOP confidence-as-model.
- CoS: no extra Grok agents, no Odds event-odds, no second Hermes. Morning glance 08:00 CT.
