# GUMROAD — publish walkthrough + MCP wiring

**Status 2026-08-25:** account created, bank linked. Remaining: publish the
two products (manual — Gumroad's API cannot create products or upload
files, verified against rmarescu/gumroad-mcp + API v2), then wire the MCP
for autonomous sales telemetry.

## A. Publish both products (~10 min total, from the dashboard)

**Product 1 — the workbook:**
1. Top-right pink button **New product** → Name:
   `The Meta Tracking Audit Workbook` → Type: **Digital product** →
   Price: **$19** → Next.
2. Description: paste from [LANE1_SALES_KIT.md](./LANE1_SALES_KIT.md) §4.
3. **Content**: upload `meta-tracking-audit-workbook.pdf` (sent to you in
   chat; or open `products/meta-tracking-audit-workbook.html` → Print →
   Save as PDF).
4. **Cover**: upload `cover-workbook.png` (sent in chat).
5. URL slug: `meta-tracking-audit-workbook`. → **Publish**.

**Product 2 — the tracker:**
Same flow: Name `Meta Ads Tracking & Reconciliation Tracker (Excel/Google
Sheets)` · $12 · description from kit §4b · content file
`products/meta-ads-tracking-template.xlsx` (also sent in chat) · cover
`cover-tracker.png` · slug `meta-ads-tracking-tracker` · Publish.

**Then (3 min):** in each product's description add "Pairs with →" link to
the other. Profile: display name **Signal Origin**, bio one-liner + X link.
Dashboard "Build your tribe" card can wait.

## B. Wire the MCP (for Grok / future Claude sessions — sales telemetry)

`rmarescu/gumroad-mcp` provides: get_products, get_product,
enable/disable_product, **get_sales**, get_user, and full offer-code CRUD
(create/update/delete discount codes). No product creation/upload — that
stays manual.

1. Gumroad → Settings → **Advanced** → create application → generate
   **access token**. NEVER commit it; env var only.
2. In your local Claude Code / MCP-capable client:
   `npx gumroad-mcp@latest init` (sets `GUMROAD_ACCESS_TOKEN`).
3. What this unlocks for the autonomous loop (REVENUE_REALITY §Lane 6):
   - Weekly sell-through pull (`get_sales`) into the ACTION_LOG scorecard —
     real numbers, no manual reporting.
   - Launch levers without a human sitting: create/expire offer codes
     (e.g. `LAUNCH19` for week one), disable an item that flops.
   - Operator rule: report sales exactly as the API returns them. $0 weeks
     are logged as $0.
