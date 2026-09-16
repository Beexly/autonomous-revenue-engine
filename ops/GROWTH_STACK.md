# GROWTH STACK — architecture, tooling and the 90-day flywheel

**Provenance:** supplied by the owner 2026-09-15 as a pasted plan (four blocks:
a 40-repo OSS list, a "10 repos beyond the 40" list, an A–F architecture, and a
90-day flywheel). It also referenced a GitHub agent-task link
(`…/autonomous-revenue-engine/tasks/a7736422-…`) which returns **404** to
anything but the originating session — so the task body is not readable from
here. This file is the normalised record so no agent has to re-derive it.

**Status:** platform plan, not yet built. Read the reality check at the end
before acting on it — parts of it conflict with this repo's own $0-spend rule.

---

## 1. Architecture (A–F)

**A. Public site layer** — Next.js app. Pages: Home, Services, Occasion landing
pages, Gallery, Quiz, Quote, Blog, Referral. Emits events to analytics + the
automation bus.

**B. Event + data layer (source of truth)** — Postgres (Supabase or managed PG).
Tables: `leads`, `lead_events`, `bookings`, `content_assets`, `referrals`,
`utm_sessions`, `reviews`. Every system writes lifecycle events here via
webhooks/API.

**C. Automation orchestration** — n8n as the workflow brain:
form submit → enrich lead → CRM create/update; new blog/UGC asset → social clip
pipeline; abandoned quote → email/SMS sequence; completed booking → review
request + referral prompt.

**D. Funnel / engagement** — Typebot (quiz funnels, "build your board"),
Mautic or Listmonk (lifecycle email), Documenso (proposal/contract e-sign),
Twenty CRM (pipeline + B2B accounts).

**E. Distribution / content ops** — content created on-site + gallery uploads;
n8n routes it to the short-form clip queue, social scheduling, email snippets,
blog schema refresh.

**F. Insight / optimisation** — Umami (top-level traffic), PostHog (behavioural
funnels), Metabase (revenue attribution dashboards).

## 2. Tooling

### Core web / UI (the "40")
Next.js · next-learn · create-t3-app · tailwindcss · shadcn/ui ·
motion (Framer) · GSAP · lenis · hamo · aos ·
react-three-fiber · drei · postprocessing · three.js · react-spring ·
radix-ui/primitives · chakra-ui · material-ui · cva · lucide ·
next-seo · next-sitemap · vercel/og-image · unhead · Lighthouse ·
sanity · contentful.js · strapi · keystone · payload ·
react-hook-form · resend-node · cal.com · stripe-js · vercel/commerce ·
posthog · plausible · microsoft/clarity · growthbook · supabase

### The distribution / authority / retention layer (the "10 beyond the 40")
| Tool | Job for us |
|---|---|
| [n8n](https://github.com/n8n-io/n8n) | Auto-posting, lead routing, review follow-ups, content repurposing |
| [Appsmith](https://github.com/appsmithorg/appsmith) | Internal growth-ops dashboards: leads, campaign health, keyword movement |
| [Metabase](https://github.com/metabase/metabase) | Which pages/channels convert to booked calls |
| [Documenso](https://github.com/documenso/documenso) | Quote → contract e-sign for corporate/events |
| [Twenty](https://github.com/twentyhq/twenty) | CRM: planners, venues, repeat buyers, referral partners |
| [Mautic](https://github.com/mautic/mautic) | Lifecycle email: inquiry → menu education → urgency → booking |
| [Typebot](https://github.com/baptisteArno/typebot.io) | "Build your perfect grazing table" quiz that captures intent + budget |
| [Listmonk](https://github.com/knadh/listmonk) | Segmented newsletter (wedding / corporate / holiday) |
| [Fider](https://github.com/getfider/fider) | Public voting board: seasonal boxes, new menu ideas |
| [Umami](https://github.com/umami-software/umami) | Privacy-first analytics |

### Self-host vs SaaS (as supplied)
- **Self-host now:** n8n, Listmonk, Umami, Metabase, Fider — low/medium ops
  burden, high control, cheap at scale.
- **SaaS first:** PostHog Cloud, Documenso Cloud, Typebot Cloud — fastest to
  market, fewer failure points on revenue-critical actions.
- **Conditional:** Twenty (SaaS if solo/small, self-host if data governance
  matters), Mautic (self-host only if you can run email infra — otherwise
  Listmonk + a transactional provider, add Mautic later).

### Deployment topology (as supplied)
Vercel for the Next.js frontend · Railway/Render/Fly.io (or a Docker host) for
n8n, Listmonk, Umami, Fider, Metabase · managed Postgres (Supabase/Neon/RDS) ·
S3-compatible object storage for media · Resend/Postmark/SES for email ·
Cloudflare for CDN, WAF and image optimisation.

### Target repo structure (as supplied)
```
autonomous-revenue-engine/
  apps/web/                     # Next.js marketing + conversion site
  services/automation/          # n8n workflow exports + docs
  services/analytics/           # Umami/PostHog event specs
  services/crm-sync/            # webhook handlers for Twenty
  services/referral-engine/     # referral link + reward logic
  data/sql/001_core_tables.sql, 002_attribution.sql, 003_retention_views.sql
  content/seo/keyword-clusters.json, schema-templates/
  docs/architecture.md, flywheel-90-day.md, runbooks/
```

## 3. Event spec (instrument these first)

`view_service` · `start_quiz` · `complete_quiz` · `start_quote` · `submit_quote`
· `book_call` · `referral_share`

## 4. 90-day flywheel

**Days 1–30 — foundation + instrumentation.** Ship the high-conversion pages
(home, 3 service LPs, quote, quiz). Implement the event spec. Wire automations:
quote submitted → CRM + instant response + follow-up; quiz completed →
segmented nurture. Publish 8–12 SEO pages (service + location intent). Install
schema, sitemap, OG image generation.
*Targets: 3–5% visitor→lead, 90%+ sessions with UTMs, first 30 qualified leads
in CRM.*

**Days 31–60 — distribution velocity.** Weekly: 2 blog posts, 4 short-form
clips, 2 carousels. n8n repurposes blog → captions, gallery → reel storyboard,
top FAQs → shorts + email snippets. Launch the referral loop (past clients get a
tracked share link; source tracked through booking). Launch Fider voting
campaigns ("next seasonal board?", "new corporate tier?").
*Targets: 2× organic impressions, 20–30% of leads from social/UGC, 10%+ of leads
entering the referral path.*

**Days 61–90 — optimisation + scale.** Funnel experiments (hero variant, quote
form length, pricing presentation). Lifecycle nurture segmented by wedding
planners / corporate admins / holiday-private. Partnership pipeline in CRM
(venues, photographers, planners, local brands). Metabase attribution dashboard:
channel → lead → quote → booking → repeat/referral. Authority content:
downloadable event-planning checklist, portion calculators, local trend report.
*Targets: 25–40% lift in quote→booking, 30%+ traffic non-paid, meaningful
repeat/referral revenue.*

## 5. What most teams forget (as supplied, kept verbatim in spirit)

They track clicks, not revenue attribution · they post content but never build
repurposing automation · they collect leads without nurture segmentation · they
ask for referrals without tracked links · they build pretty pages and never run
a weekly test.

---

## 6. Reality check before anyone builds this

1. **This repo's own rule is $0 spend until revenue exists** (`SIGN_SYSTEM.md`,
   `ops/LOCAL_PITCH.md`). PostHog Cloud, Documenso Cloud, Typebot Cloud, Neon
   and Supabase all sit on the paid side of that line past the free tier. Every
   line item above needs a free-tier answer or an owner decision first.
2. **The client work in `clients/` is deliberately static HTML**, not Next.js.
   A $150 one-pager and a $600 local site must stay hand-editable and load in a
   parking lot; the Next.js app is for *our* surface, not a client's. Do not
   rebuild a client build on this stack.
3. **Sequence:** the chick job is the pilot that pays for the stack. Instrument
   the pilot manually (calls, quotes, bookings logged by hand in one file)
   before standing up n8n + Postgres + Metabase to instrument the same thing.
4. **Neon is already available read-only** to this project (see the Neon entry
   in agent memory) — the `data/sql/` schema above is the natural first artifact
   to write there, and it costs nothing to draft.
5. The `tasks/` link is not readable outside its originating session; if the
   owner wants that task executed, paste its body into this repo.
