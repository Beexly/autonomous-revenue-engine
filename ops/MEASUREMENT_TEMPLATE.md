# Measurement Template — Premium / Verified Impression Proxies

**Status:** Locked for process.  
**Date:** 2026-08-25  
**Purpose:** Define log schema and intake so a daily revenue-score *job* can be proposed later. This file is not the job itself.

---

## 1. Ground-truth definition (when accounts exist)

From X OCR language (ops/OCR_ALIGNMENT.md):

- **Qualified impression** = unique impression from a **Premium** user on the **Home Timeline** where **≥50% of the post is visible**.
- Replies excluded from the 500k verified HT impression eligibility bar.
- Real metrics become available only after owner creates the handle + Premium and posts begin.

Until then we log **proxies only**. No invented revenue numbers. No fake impression counts.

---

## 2. Pre-account proxy log schema (CSV / Notion / ACTION_LOG compatible)

One row per candidate evaluation or post attempt:

| Field | Type | Description |
|-------|------|-------------|
| `log_id` | string | e.g. LOG-030 or SO-002-v2 |
| `timestamp` | ISO-8601 | When scored |
| `asset_id` | string | SO-xxx |
| `disposition` | enum | Pass / Rewrite / Kill |
| `originality_total` | int | 0–60 |
| `originality_min` | int | lowest dimension |
| `qi_check_composite` | float | if run; Hold floor 9.2 |
| `proxy_first_screen` | 0–10 | Claim in first 140–180 chars |
| `proxy_viewport_hold` | 0–10 | Skeptical Premium stop test |
| `proxy_audience_fit` | 0–10 | Operator vs bait |
| `proxy_reply_primary_risk` | 0–10 | inverted: high = low risk |
| `proxy_notes` | text | Free text |
| `published` | bool | Always false until owner posts |
| `real_premium_ht_imps` | int/null | Null until account live |
| `real_verified_followers` | int/null | Null until account live |
| `revenue_signal_usd` | float/null | Null until real payouts/tips/affiliates |

---

## 3. Intake path

1. Every originality + adversarial decision writes a row (or ACTION_LOG equivalent).
2. When owner posts a Pass asset, operator appends real metrics as they become visible in analytics (no automation of scraping that violates ToS).
3. Learning seat aggregates weekly: which proxy scores correlated with later real hold / engagement quality.
4. Daily revenue-score **job** may be proposed only after ≥7 consecutive days of consistent schema use and at least one real-metric row exists.

---

## 4. What this template deliberately excludes

- Predicted virality or follower growth forecasts presented as fact.
- Invented OCR payout estimates.
- Any Stripe / payment / account-creation flow.
- Auto-posting or engagement pods.

---

## 5. Unlock condition for daily revenue score job

All three must be true:

1. This schema is used on every gated candidate for ≥7 days.
2. Log intake is consistent (repo + Notion).
3. Learning loop has at least one synthesis pass that consumes the log.

Until then: **deferred** (see RESEARCH_LOG.md).
