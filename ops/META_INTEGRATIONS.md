# Meta Integrations — MCP / Ads / Revenue / Dev Platform

Exploration for Signal Origin agent workflows (2026-08-25).

## Official Meta MCP servers

| Server | URL / Entry | Purpose |
|--------|-------------|--------|
| **Meta Developer Tools MCP** (aka Social Technologies MCP) | `https://mcp.facebook.com/devtools` | Manage Meta apps, webhooks, App Review, API health, rate limits, search developer docs |
| **Meta Ads MCP** | `https://mcp.facebook.com/ads` | Create/manage campaigns, ad sets, ads; pull Insights; catalog management; signals/datasets |

Both are remote HTTP MCP servers. Auth is OAuth (Facebook Login for Business) or user access token. Scopes are granular; grant minimum needed.

### Developer Tools MCP — key tools (devtools_*)
- `devtools_discovery` — search Meta developer docs
- `devtools_app_list` / `devtools_app` — list & inspect apps
- `devtools_app_review` — App Review status
- `devtools_api_health` / rate-limit visibility
- `devtools_webhook_list` / `devtools_webhook_manage` / `devtools_webhook_test`
- Changelog lookup

### Ads MCP — capability groups
1. Comprehensive reporting / Insights
2. Ad creation & management (campaigns, ad sets, ads)
3. Catalog creation & management
4. Signals and datasets (Pixel / CAPI health)
5. (Continuously expanding)

Required scopes (typical): `ads_read`, `ads_management`, `ads_mcp_management`, `catalog_management`, `business_management`, `pages_show_list`, `instagram_basic`.

## Marketing API / Insights (classic path)

Still available via Graph API (`/act_<AD_ACCOUNT_ID>/insights`, campaign/adset/ad edges). Useful when you need raw metrics (impressions, spend, clicks, actions, breakdowns) outside MCP. Versioned (v26+ as of 2026).

## Revenue relevance for Signal Origin

- **Paid attention**: Meta Ads MCP is the cleanest agent-native way to run / measure FB+IG campaigns promoting free cores (conformal-lite, fold-ruler, qi-check, etc.).
- **Dev platform**: Devtools MCP lets Origin Factory / Grok Bot inspect app status, webhooks, and docs without dashboard hopping.
- **Do not mix**: Sports/DFS product claims stay out of Meta ad creative until legal/compliance review. Free-path law still applies to the product being promoted.

## Local key (TEMPORARY — ROTATE IMMEDIATELY)

See `ops/META_KEY.local` (gitignored pattern recommended). User will rotate after first use.

```
# example env shape — do not commit real values long-term
META_LLM_KEY=LLM_...
# or
META_ACCESS_TOKEN=...
```

After rotation:
1. Remove the temporary file or overwrite with placeholder.
2. Put the live key only in local env / secret store (never in public prompts or ACTION_LOG).
3. Prefer OAuth via the MCP client over long-lived tokens when possible.

## Next actions for Grok Bot / Origin Factory

1. Wire Meta Ads MCP URL into the agent client that needs paid distribution.
2. Wire Devtools MCP for app/webhook health checks.
3. Keep conformal-lite and fold-ruler free cores independent of Meta billing.
4. Any Meta ad spend must be human-approved until a clear budget + APPROVE gate exists.
