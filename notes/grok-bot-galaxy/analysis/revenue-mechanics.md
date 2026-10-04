# Revenue mechanics — how Grok Bot is packaged, priced, distributed and expanded

Everything here is sourced from x.ai pages and posts captured 2026-09-23. Raw data:
`data/packaging-matrix.json`, `data/metrics-ledger.json`, `data/install-links.json`,
`data/creators.json`, `data/customers.json`.

---

## 1. The packaging ladder

Prices from `/pricing` plan cards; availability from the decoded comparison matrix.

| Plan | Price | Grok Bot | Notes |
| --- | --- | --- | --- |
| Free | $0/mo | ✗ | Grok 4.6, Imagine, Build, connectors included |
| SuperGrok Lite | not printed | ✗ | — |
| **SuperGrok** | **$30/mo** | **✓** | cheapest tier that includes Grok Bot |
| **SuperGrok Plus** | **$100/mo** | **✓** | higher usage, 1080p video, priority at peak |
| SuperGrok Heavy | not printed | ✓ | highest individual usage |
| Business | not printed | ✗ *(per matrix)* | team seats, billing, RBAC, domain verification |
| Enterprise | contact sales | ✗ *(per matrix)* | SSO/SCIM, audit, CMEK, dedicated data plane |

**Read this carefully: Grok Bot is a mid-tier individual feature, not an enterprise SKU.** In the
pricing matrix it appears only in the three SuperGrok columns — not in Business or Enterprise. Yet the
Sep 3 post says it is available for enterprises, free for two weeks, with governance controls, and
activated from the admin dashboard. The two surfaces disagree; the likely resolution is that Grok Bot
entitlement is attached to Grok/Cursor subscriptions (including enterprise agreements) rather than
being a line item on the public plan grid. **Do not quote the pricing page as the whole story.**

Also gating it, per the launch posts: Cursor Pro / Pro+ / Ultra and Cursor Teams Standard & Premium —
which the public pricing page does not show at all.

## 2. The three monetisation levers visible in the material

1. **Tier upgrade.** Grok Bot is the reason to move from Free → SuperGrok ($30) or SuperGrok → Plus
   ($100). It is the first non-model feature in the ladder that only paid tiers get (only video
   generation and "Expert" have similar gating).
2. **Seat expansion.** Enterprise customers "can invite their whole organization, including people
   without an existing seat" — an explicit motion to widen a paid org beyond its licensed seats.
3. **Usage, deliberately decoupled.** "Grok Bot comes with its own usage, separate from your Grok and
   Cursor plans, so anything you hand off to a Bot won't count against your existing usage."
   That is a pricing *innovation*: it removes the fear of burning a scarce allowance, and creates a
   clean second meter to bill later. The /bot FAQ confirms the model: weekly usage included,
   "additional usage billed based on token cost."

There is **no standalone Grok Bot SKU, no per-bot price, and no published token rate** anywhere in the
corpus. Anyone modelling revenue has to work from the plan price and the usage meter.

## 3. Unit economics as stated

| Figure | Value | Source |
| --- | --- | --- |
| Grok Bot cost per support resolution | **$0.20–$0.30** | support case study |
| Traditional AI support tool | **$1–$4 flat per resolution** | same |
| Live-session ticket costs | $1–$2 (medium/complex), ~$0.20 (low complexity, batched) | Day 2 support workshop |
| Procurement savings found by one bot | **> $100,000** | procurement post |
| Support headcount avoided | **~200 people** (for a 175% ticket increase) | support post |
| Office-supply order cut | $14,629 → $6,143 (58%) | procurement post |
| Cost per install improvement (Rank'em) | 15x ($15 → $1) | mobile guide |
| D7 retention improvement (Rank'em) | ~4x | mobile guide |

The pattern in every proof point: **compare against the human or incumbent-tool alternative, and
express it per unit of work** (per ticket, per install, per renewal) rather than per token.

## 4. Distribution: the marketplace is the growth loop

The marketplace is not a gallery; it is a distribution surface with three properties:

- **81 templates, 45 named creators, 393 skills, 127 routines, 304 integrations** (`data/creators.json`).
- **Every template has a one-click install deep link** (`/bot/<token>`), captured in
  `data/install-links.json` — 81 template links plus 56 use-case install links. These are the
  shareable artefacts that circulate outside x.ai: "Add to Grok Bot".
- **Templates are recipes, not clones** — they carry skills, memories and plugins but exclude
  personal memories, secrets and custom code. That keeps the loop safe to share and still requires
  the recipient to connect their own tools (which pulls them into the product).

The creator list is the tell: alongside internal staff (Lingxi Li, Krista Letz, Josh Kim, Matt Palmer,
Shub Gaur, Simon Lackowski) sit recognisable external operators — **Lenny Rachitsky, Hiten Shah,
Kent C. Dodds, Claire Vo, Sawyer Merritt, Matt Van Horn, Lauren Tan, This Week in AI**. Seeding a
template marketplace with newsletter authors and DevRel figures is a co-marketing motion: their
audiences get a bot, the platform gets distribution, and the creator's name is the social proof.

**The loop:** guide → "here's the bot I use" → template → one-click install → the recipient's bot
needs connections and memory → they build their own → share as template → repeat.

## 5. The proof-point strategy

Every substantive post converts a function into a number:

| Function | Proof | Audience it sells to |
| --- | --- | --- |
| Customer support | 175% more tickets, no hires; $0.20–$0.30/resolution; 99% of refunds automated | COO / support lead |
| Procurement / finance | > $100k found; 43 idle seats; $85,662/yr unused SKUs | CFO / ops |
| Engineering | double-digit % of merged PRs; 200+ cloud agents per fleet; 2,000+ PRs by one engineer | CTO / eng lead |
| Mobile game studio | 15x cheaper installs, 4x D7 retention, 1,000 downloads | indie devs / growth |
| Sales / GTM / PM / marketing | qualitative workflows + the event workshops | revenue orgs |

The Galaxy event is the qualitative layer over that quantitative spine: ten functions, ten speakers,
all pointing at the same product and the same catalogue.

## 6. Where the money *isn't* yet

- No API/agent pricing for Grok Bot itself; it is bundled into model/plan subscriptions.
- `installCount` is **0 on all 81 templates** — the marketplace has no visible popularity signal yet,
  so template performance is unmeasurable from the outside.
- The enterprise post's "millions of bots created" and "thousands of organisations" are unverifiable
  marketing claims sitting next to the support post's precise, credible figures. Weight them
  differently.
- The X integration gives *paid* Grok Bot users free X API credits — a cost centre used as an
  acquisition sweetener; no numbers are given.
