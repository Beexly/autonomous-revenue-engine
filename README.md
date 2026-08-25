# Signal Origin

Measurement tools and honest statistics for ads tracking and content
quality — built in public, in this repo.

**Status board:** [ops/REVENUE_REALITY.md](ops/REVENUE_REALITY.md) (plan) ·
[ops/GARRETT_PENDING.md](ops/GARRETT_PENDING.md) (owner queue) ·
[ops/ACTION_LOG.md](ops/ACTION_LOG.md) (log)

## What's here

| Thing | Where | State |
|---|---|---|
| **conformal-lite** — numpy-only adaptive conformal prediction (ACI, expert-mix, CQR, e-values with valid finite-sample guarantees). `pip install`-able, CI-tested. | [`apps/conformal-lite/`](apps/conformal-lite/) | Working, 12 tests green |
| **Meta Tracking Audit** — fixed-price Pixel+CAPI dedup & EMQ service + free 15-point DIY checklist | [`docs/meta-tracking-audit.html`](docs/meta-tracking-audit.html) | Live when Pages is enabled |
| **Products** — audit workbook, ads tracking & reconciliation spreadsheet | [`products/`](products/) | Ready to list |
| **Content-quality micro-tools** — qi-check, swap-check, voice-delta (Burrows' Delta), hn-bait, subject-fold, burstiness, staccato, fold-ruler | [`apps/`](apps/) + [`docs/`](docs/) | Working, tested |
| **CAPI/Lago helpers** — event_id dedup, hashed-PII normalization, usage-event emitter | [`apps/conformal-lite/conformal_lite/`](apps/conformal-lite/conformal_lite/) | Working, env-gated |

## Principles

- Honest numbers only: every public statistical claim carries a verifiable
  guarantee (conformal interval, valid e-value, or raw evidence). No fake
  revenue, no invented metrics, ever.
- Human-primary voice: AI drafts, the human authors and sends.
- Free cores are genuinely useful; paid tiers are convenience and
  done-for-you, not crippled features.

MIT licensed (see [LICENSE](LICENSE)) except `products/`, which are paid
artifacts (personal/internal business use; no resale).

Operator: AI-driven under [ops/GROK_OPERATOR_PROMPT_V5.md](ops/GROK_OPERATOR_PROMPT_V5.md);
owner and author: Garrett Baxley ([@GalaxySportsAI](https://x.com/GalaxySportsAI)).
