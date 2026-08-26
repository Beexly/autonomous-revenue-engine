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
- **CQR**: conformalized quantile residuals — preferred when residuals are heteroscedastic (different noise levels).
- **E-value / soft-rank**: anytime-valid, post-hoc α selection while preserving validity bounds.

For non-stationary streams (X engagement, virality, CPM/RPM over time) prefer ACI / SAOCP / e-value over plain split conformal.

## 2. How to implement CP for these metrics

`apps/conformal-lite` is a pip-installable package (`pip install ./apps/conformal-lite`); its import name is `conformal_lite`.

```python
from conformal_lite import make

cp = make("cqr", alpha=0.1)  # or "saocp" / "aci" / "evalue"

# CQR: pass real quantile edges. If q_lo/q_hi are omitted, the core uses a dummy +/-1 band.
cp.update(y_true=actual_rpm, y_pred=model_rpm, q_lo=q_lo, q_hi=q_hi)

lo, hi = cp.predict_interval(y_pred=next_rpm_point_estimate)
# Claim only after n>=10 updates: with ~90% coverage, true RPM lands in [lo, hi]
```

Honesty rule: always state the coverage level and the exchangeability/adaptive assumption. X and short-form streams are non-exchangeable so prefer adaptive modes. Cold start uses a fat interval.

Sports/DFS is not a product of this package. Do not use these RPM tables in public copy. They are directional, not Origin-measured.

## 3. Specific RPM benchmarks by platform (2026, directional)

All figures are creator-reported / analyst ranges. Not guarantees. Not Origin Studio numbers. Do not paste into ads, Show HN, or X.

### YouTube
- Long-form RPM (median across niches): about $2–$10; Education/Science ~$10+, Kids ~$0.30
- Shorts RPM: typically $0.02–$0.20 (most $0.04–$0.12); 3–14% of long-form RPM in same niche
- 1M Shorts views typical band $20–$150. US-heavy finance can print higher. Do not cite $150–$300 as typical.
- Thresholds rising Feb 2027 (8k watch hours or 20M Shorts views)

### TikTok (Creator Rewards)
- Official range: about $0.40–$1.00 per 1,000 qualified views
- Eligibility: 10k followers, 100k views/30d, original >1 min, limited countries
- Shop affiliate / GMV and brand deals often dominate pure Rewards RPM

### Instagram
- Organic Reels payout for most creators: about $0
- Brand / sponsored Reels: rate-card by follower tier, highly variable

### X (Twitter)
- Not a clean per-view RPM. Pays on verified / Premium impressions (Home timeline).
- Origin primary unit is Phoenix: copy-link ~20x, reply 5–20x, like 0.5. Do not optimize X for RPM tables.

## 4. How Signal Origin uses this NOW

- Free cores are the product. Platform RPM is secondary.
- Ads playbook (`ops/ADS_PLAYBOOK.md`) is ACTIVE. Pixel + CAPI + event_id now. Spend still `APPROVE spend`.
- Calibrate platform-reported numbers against backend in `ops/ADS_CALIBRATION.csv`. Empty stays empty.
