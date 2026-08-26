# Meta Ads MCP — live status (2026-08-25)

- Ads: `https://mcp.facebook.com/ads` — installed as `user-meta-ads`. Auth fails: Cursor has no dynamic client registration for this server. Do not wait. Do not paste leaked tokens.
- Devtools: `https://mcp.facebook.com/devtools` — connected, read-only. App list currently empty (no app granted to this caller).
- CAPI/Pixel: `apps/conformal-lite/conformal_lite/capi.py` + `docs/ads-signal.html`. No send without env. Do not claim EMQ.
- Playbook: `ops/ADS_PLAYBOOK.md` is ACTIVE now. Spend still needs `APPROVE spend`.
- `ops/META_KEY.local` deleted from HEAD. Rotate. Never re-commit.
