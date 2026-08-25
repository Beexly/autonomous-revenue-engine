# Conformal Prediction for Platform Metrics + RPM Benchmarks

## 1. What is the conformal prediction framework?

Conformal prediction (CP) is a distribution-free uncertainty quantification method that produces prediction sets or intervals with finite-sample coverage guarantees under exchangeability (or adaptive variants when exchangeability fails).

Core idea:
- Compute nonconformity scores on a calibration set (how "strange" a prediction is relative to truth).
- For a new point, form the set of labels whose scores are not more extreme than a (1-α) quantile of the calibration scores.
- Result: P(true label ∈ prediction set) ≥ 1-α (marginal coverage), without strong distributional assumptions.

Key variants already in `apps/conformal-lite`:
- **ACI** (Adaptive Conformal Inference): online update of α_t so long-run coverage tracks target under distribution shift.
- **SAOCP**: strongly adaptive mix of ACI experts at different learning rates (regime tracking).
- **CQR**: conformalized quantile regression — preferred when residuals are heteroscedastic (different noise levels).
- **E-value / soft-rank**: anytime-valid, post-hoc α selection while preserving validity bounds.

For non-stationary streams (X engagement, virality, CPM/RPM over time) prefer ACI / SAOCP / e-value over plain split conformal.

## 2. How to implement CP for these metrics

Platform metrics that benefit from conformal intervals/sets:

| Metric family | Score idea | Recommended mode | Use |
|---------------|------------|------------------|-----|
| Views / impressions / reach | residual = |log(pred) - log(actual)| or absolute | ACI or SAOCP | Forecast range for next post / day |
| CTR / engagement rate | absolute or pinball residual | CQR | Heteroscedastic by creative/niche |
| RPM / revenue per 1k | residual on log-RPM or absolute $ | CQR + e-value | Honest revenue forecast with coverage |
| Conversion / free-core signup | residual or classification score | ACI / e-value | Gate claims of "this post will convert X±" |
| Frequency / fatigue | residual on frequency trajectory | SAOCP | Detect regime shift before CPA explodes |

Implementation pattern (already supported by conformal-lite):

```python
from conformal_lite.core import make

# Example: online RPM forecast intervals
cp = make("cqr", alpha=0.1)  # or "saocp" / "aci" / "evalue"

# After each observed day / post:
cp.update(y_true=actual_rpm, y_pred=model_rpm)  # or quantile preds for CQR

# For new prediction:
lo, hi = cp.predict_interval(y_pred=next_rpm_point_estimate)
# Claim: with ~90% coverage, true RPM lands in [lo, hi]
```

For classification-style (will this creative beat median CTR?):
use set-valued prediction or e-value tests against a null.

Honesty rule: always state the coverage level and the exchangeability/adaptive assumption. X and short-form streams are non-exchangeable → prefer adaptive modes.

## 3. Specific RPM benchmarks by platform (2026, directional)

All figures are creator-reported / analyst ranges. Not guarantees. US-heavy audiences sit at the high end; global averages lower. Platform rules and thresholds change.

### YouTube
- **Long-form RPM (median across niches):** ~$2–$10; Education/Science ~$10+, Kids ~$0.30
- **Shorts RPM:** typically $0.02–$0.20 (most $0.04–$0.12); 3–14% of long-form RPM in same niche
- Finance / AI / tech Shorts can reach $0.15–$0.45 in strong cases
- 1M Shorts views ≈ $20–$150 typical; US finance higher
- Thresholds rising Feb 2027 (8k watch hours or 20M Shorts views)

### TikTok (Creator Rewards)
- Official range: ~$0.40–$1.00 per 1,000 qualified views
- Effective for many: $0.50–$2.00 depending on engagement, length (>60s), geo
- Eligibility: 10k followers, 100k views/30d, original >1 min, limited countries
- Shop affiliate / GMV and brand deals often dominate pure Rewards RPM

### Instagram
- Organic Reels payout for most creators: **~$0** (no general per-view program)
- Brand / sponsored Reels: rate-card by follower tier (micro $500–$5k typical range, highly variable)
- Facebook Reels (in-stream): creator-reported ~$0.30–$5 RPM by niche (finance higher); many reports $0.02–$0.20 for pure Reels share

### X (Twitter)
- Not a clean per-view RPM. Pays on **verified / Premium impressions** (Home timeline)
- Typical: ~$8–$12 per 1M verified impressions (~$0.008–$0.012 per 1k)
- Finance/crypto/tech can be substantially higher; US video higher still
- Eligibility and program terms have been changing (impression thresholds)

### Practical comparison (rough order of magnitude per 1M views/impressions)
1. YouTube long-form (good niche) — highest
2. TikTok Creator Rewards (qualified, eligible) — competitive short-form
3. Facebook Reels / in-stream — mid
4. YouTube Shorts — low per view, high volume possible
5. Instagram organic — ~0; value is distribution + brand deals
6. X — depends on verified share of audience

## 4. How Signal Origin should use this

- Free cores (conformal-lite, fold-ruler, qi-check) are the product. Platform RPM is secondary income or distribution fuel.
- Use CP intervals on RPM / engagement forecasts before making public claims or scaling paid.
- Prefer TikTok Rewards + Shop and YouTube long-form for direct platform revenue; treat IG and X primarily as attention + brand surfaces.
- Always calibrate platform-reported revenue against backend (Stripe, server events).

Update benchmarks when Studio / Ads Manager numbers for our own accounts become available.
