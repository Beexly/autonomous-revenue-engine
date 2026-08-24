# X API Rate Limits — Alignment & Optimization

**Official reference:** https://docs.x.com/x-api/fundamentals/rate-limits  
**Rule:** Respect limits; prefer header-driven backoff; never burn quota on ungated or low-value calls. Publishing remains owner/gated-Pass only.

---

## 1. How limits work (2026)

- **Per-endpoint**, not one global bucket.
- Windows usually **15 minutes** or **24 hours**.
- **Per-app** (Bearer) vs **per-user** (OAuth user context) counters differ.
- Exceeding → **429** until reset.
- Separately, **pay-per-use / monthly caps** and occasional **usage-capped** 429s can fire even when `x-rate-limit-remaining` looks healthy — design for both rate-limit headers *and* product usage caps.

Always read response headers:
- `x-rate-limit-limit`
- `x-rate-limit-remaining`
- `x-rate-limit-reset`

---

## 2. Limits that matter for SignalOrigin

Approximate v2 figures (verify live in Developer Console; tiers change):

| Endpoint | Notes |
|----------|--------|
| `POST /2/tweets` | Per-user window + per-app 24h caps; docs have historically shown conflicting numbers — treat console + headers as truth; also watch shared 3-hour post/repost style caps where documented |
| `DELETE /2/tweets/:id` | Lower per-user window |
| `GET /2/tweets/search/recent` | ~450/15m app, ~300/15m user; max 100 results; 7-day lookback |
| `GET /2/tweets/search/all` | Full archive; **1 req/sec** often binds before the 15m bucket |
| `GET /2/tweets` batch lookup | High; up to 100 IDs per call — **batch** |
| `GET /2/users/:id/tweets` | Timeline pulls; useful for competitor/self audit |
| Media upload family | Separate windows; initialize/append/finalize |

**Access/pricing context:** Free/Basic/Pro-style packages and **pay-per-use** migration mean cost and monthly post-read caps can dominate before theoretical 15m limits. Design for minimum reads per insight.

---

## 3. Optimization playbook

1. **Batch** tweet lookups (100 IDs) instead of N single GETs.  
2. **Cache** user ids, post ids, and metrics; don’t re-fetch static data.  
3. **Header-driven wait:** sleep until `x-rate-limit-reset` when remaining is low — better than blind fixed sleep.  
4. **Exponential backoff + jitter** on 429; distinguish rate-limit vs usage-capped where body allows.  
5. **Prefer recent search** over full-archive unless history is required (1/sec trap).  
6. **Write sparingly:** only Pass assets; cadence well under per-user post windows.  
7. **Single worker per token** unless a deliberate multi-token architecture exists (compliance + complexity).  
8. **No scrape-as-substitute** for gated publish — product is original content, not API spam.

---

## 4. Repos / libraries to align with

| Resource | Link | Use |
|----------|------|-----|
| Official rate limits | https://docs.x.com/x-api/fundamentals/rate-limits | Source of truth |
| **twitter-api-v2** rate-limit plugin | https://github.com/alkihis/twitter-api-v2-plugin-rate-limit | Node: store remaining/limit/reset per endpoint |
| **tomasbasham/ratelimit** | https://github.com/tomasbasham/ratelimit | Generic Python call ceiling decorator |
| **Tweepy** | https://github.com/tweepy/tweepy | Python client; `wait_on_rate_limit` patterns (still verify v2 behavior on your tier) |
| XDK Python rate-limit guides | Vendor/docs patterns for backoff + batching | Copy algorithms, not blind dependency |
| Example Redis-backed limit tracking | Patterns in production bots (e.g. rate keys per endpoint) | For multi-process deployments later |

Legacy `python-twitter` rate modules are v1.1-era — prefer v2-native clients + header parsing.

---

## 5. SignalOrigin policy

- Research/competitor pulls: budgeted, cached, rate-limit aware.  
- Publish path: **not** API-automated from this operator without owner account + Pass gate (HANDOFF).  
- When API access exists, log remaining/reset alongside ACTION_LOG for Learning.  
- Cost control under PPU: every read should map to a gate, measurement, or research packet — no idle polling.
