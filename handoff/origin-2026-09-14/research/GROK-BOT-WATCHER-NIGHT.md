# GROK-BOT — watcher night (Windows babysits Hermes)

Windows owns overnight liveness. Grok Bot does not poll.

## Live (do not duplicate)

- CLIProxy 127.0.0.1:8317 — Windows task Beexly-CheapOvernight-Proxy
- Watchdog pid file: C:\Users\Garrett\Sports\handoff\cheap-overnight\watchdog.pid
- Hermes cheap queue: OVERNIGHT-2026-08-22-CHEAP.md, $0 Nous Laguna, 80-turn cap then fresh chat (no --resume)
- Beexly-CheapOvernight-Keepalive every 5 min
- Crash-loop brake: 5 deaths under 15s → STOP (protect free-route quota)

## Load-bearing

1. If `handoff/cheap-overnight/watchdog.pid` is live → **do not start a second Hermes**.
2. No Grok Bot routine more than once a day. No 5/15/30-minute Bot loops. Those eat SuperGrok. Windows scheduled tasks do not.
3. Overnight: one confirmation line, then stop generating.
4. Optional 08:00 Chicago glance only if Garrett asks. Default overnight: nothing.

## Kill switch

Write STOP to `C:\Users\Garrett\Sports\handoff\cheap-overnight\DONE.md`. Keepalive unregisters itself.

## Watcher law (if you ever speak)

CLEAN / BLOCK / FAKE-EDGE. Independent p, two-way q, no historical Odds API, no sportsbook HTML, no second MVE, no marketing PUBLIC_PICKS as PROVEN/CLV.
