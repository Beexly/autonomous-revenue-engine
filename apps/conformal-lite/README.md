# conformal-lite

Split conformal interval for a one-dimensional residual or score. Paste calibration residuals and one new score; get a prediction interval at a stated coverage (default 90%).

This does not rewrite. This does not publish. No Python, no MAPIE, no Stripe.

**Honesty:** finite-sample coverage holds **only if exchangeability holds** (calibration residuals and the new point are exchangeable). If the new score is from a different regime, the interval is not a coverage guarantee.

## Run in 3 commands

```
git clone https://github.com/Beexly/autonomous-revenue-engine.git
cd autonomous-revenue-engine/apps/conformal-lite
node cli.js --residuals 0.2,0.4,0.1,0.8,0.3,0.5,0.6,0.2,0.9 --score 1.1 --coverage 0.9
```

Or open `docs/conformal-lite.html` in a browser (no install).

```
npm test
```

Lower `q` means a tighter interval. If calibration is too small for the target coverage, the interval is infinite.
