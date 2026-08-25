# Meta Ads MCP — research (2026-08-25)

Official remote servers (not in the Cursor plugin catalog as a one-click install):

- Ads: `https://mcp.facebook.com/ads` — campaigns, insights, catalogs, Pixel/CAPI datasets
- Devtools: `https://mcp.facebook.com/devtools` — apps, webhooks, App Review, docs

Auth: Facebook Login for Business / user token. Typical scopes: `ads_read`, `ads_management`, `business_management`.

**This agent:** no Meta Ads MCP connected. Cursor plugin search did not return an official Ads MCP bundle. Metavr (Quest) is installed and broken on linux-x64 — not Ads Manager.

**Do not spend.** Real ads need human APPROVE plus budget rules.

**CAPI/Pixel in-repo:** `apps/conformal-lite/capi.py` builds shared `event_id` + hashed PII. Sends only if `META_PIXEL_ID` and `META_ACCESS_TOKEN` are in env. Attribution assumed 7d click + 1d view. EMQ is unknown until Events Manager is live. Do not claim EMQ ≥6.

**Secret:** `ops/META_KEY.local` was on the public tree. Removed on this branch. Rotate that token. Never commit it again.
