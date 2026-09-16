# 90-Day Growth Ops Flywheel

Goal: launch a measurable loop where **content -> social clips -> lead capture -> nurture -> booking -> review -> referral -> more content** compounds every week.

Related references:
- Architecture: `docs/architecture.md`
- Data model: `data/sql/001_core_tables.sql`
- Workflow specs: `services/automation/workflows/`

## Days 1-30: foundation and instrumentation

### Weekly cadence

- **Monday**: metrics review, instrumentation QA, page/content brief approval.
- **Tuesday**: build or refine one conversion page and one automation workflow.
- **Wednesday**: publish one SEO page and one gallery/story asset.
- **Thursday**: test quote path, quiz path, and attribution writes end to end.
- **Friday**: nurture review, CRM cleanup, issue log, next-week content selection.

### Deliverables

- Core pages live: home, services, weddings, corporate, grazing tables, gallery, quote, quiz.
- Tracking active in Umami and PostHog for all primary CTAs.
- PostgreSQL tables and attribution views applied.
- Workflows 01, 02, and 04 implemented in n8n.
- Listmonk segments and first-touch nurture sequences live.
- Baseline Metabase dashboard for sessions, leads, quotes, and bookings.

### KPIs and target thresholds

| KPI | Threshold by day 30 |
| --- | --- |
| Tracked sessions with UTM/referrer | >= 90% |
| Visitor -> quote start rate | >= 4% |
| Quote start -> quote submit rate | >= 35% |
| Median first response time | <= 5 minutes |
| Lead records with usable contact data | >= 95% |

### Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Broken attribution from inconsistent UTM capture | Store session key in first-party cookie and validate writes every Thursday |
| Fancy UI hurts performance | Ship cinematic effects behind performance budgets and lazy-load 3D/media |
| Workflow spam or duplicate leads | Enforce idempotency keys and CRM upsert rules from day 1 |
| Email consent gaps | Require explicit opt-in fields and block nurture on missing consent |

### Exit criteria

- Quote submission workflow succeeds at or above 99% for 7 consecutive days.
- Dashboards match raw SQL spot checks for leads, sessions, and bookings.
- At least 3 nurture segments are live with audited copy and links.

## Days 31-60: distribution velocity

### Weekly cadence

- **Monday**: metrics review and topic selection using top landing pages and booked-revenue signals.
- **Tuesday**: publish one long-form SEO asset and repurpose into three short-form concepts.
- **Wednesday**: schedule clips, carousels, and email snippets.
- **Thursday**: review channel performance, refresh attribution views, and prune weak topics.
- **Friday**: update partner/referral outreach list and Fider vote prompt.

### Deliverables

- Workflow 03 live for repurpose and distribution.
- Minimum content operating tempo reached: 2 SEO posts, 4 short clips, 2 carousels, 1 email per week.
- Referral landing page and post-booking workflow draft ready.
- Fider board launched with at least 3 active offer questions.
- Metabase channel-to-revenue rollup reviewed weekly.

### KPIs and target thresholds

| KPI | Threshold by day 60 |
| --- | --- |
| Organic impressions vs baseline | >= 2x |
| Social-assisted lead share | >= 20% |
| Email open rate on nurture sequence 1 | >= 45% |
| Clip-to-site click-through rate | >= 1.5% |
| Leads entering referral path | >= 10% |

### Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Content velocity outruns QA | Require `content_assets.status = approved` before publish nodes fire |
| Low social conversion | Rework hooks weekly based on top saved/shared assets |
| Distribution tools throttle or fail | Queue publishes in n8n and retry with channel-specific backoff |
| Referral code leakage | Issue single-use or campaign-scoped codes with expiry |

### Exit criteria

- Distribution workflow produces at least 4 consecutive weeks of on-time publishes.
- At least one non-brand content cluster drives qualified quote submissions.
- Referral tracking and review request flows are connected to booked customers.

## Days 61-90: optimization and compounding

### Weekly cadence

- **Monday**: metrics review, funnel anomaly scan, experiment selection.
- **Tuesday**: launch one landing-page or quote-form experiment.
- **Wednesday**: analyze nurture drop-off and adjust sequence logic.
- **Thursday**: review booking, review, and referral conversion by segment.
- **Friday**: retire low-yield channels and double down on highest revenue-per-asset themes.

### Deliverables

- Workflow 05 live for review and referral automation.
- A/B tests running on hero messaging, quote form depth, and proof placement.
- Partner pipeline in CRM for venues, planners, and photographers.
- Monthly revenue attribution deck exported from Metabase.
- Authority assets live: FAQ hub, event planning checklist, and local comparison pages.

### KPIs and target thresholds

| KPI | Threshold by day 90 |
| --- | --- |
| Quote submit -> booked rate | >= 20% |
| Review request -> published review rate | >= 18% |
| Referral-sourced booked revenue share | >= 8% |
| Non-paid traffic share | >= 30% |
| Revenue per content asset published | trending upward 3 consecutive weeks |

### Risks and mitigations

| Risk | Mitigation |
| --- | --- |
| Team chases vanity metrics | Review channel-to-revenue and booked-rate metrics first every Monday |
| Experiment noise from low traffic | Run tests only on pages with sufficient weekly sessions and clear win criteria |
| Deliverability declines as send volume rises | Warm domains gradually and monitor bounce/spam complaint thresholds weekly |
| Reporting lag hides problems | Refresh materialized views hourly and alert on stale data |

### Exit criteria

- Attribution dashboards are trusted enough to guide budget and content prioritization.
- At least one referral or partner channel produces repeatable booked revenue.
- The team can run weekly experiments without breaking baseline funnel performance.

## Weekly operator checklist

- [ ] Review Monday scorecard before approving new work.
- [ ] Spot-check 5 fresh `utm_sessions` rows and 5 fresh `lead_events` rows.
- [ ] Test one quote submission and one quiz completion end to end.
- [ ] Confirm nurture sends respect consent and segment rules.
- [ ] Approve or reject all `content_assets` queued for publish.
- [ ] Check booked-revenue attribution by first-touch and last-touch.
- [ ] Clear workflow failures, DLQ items, and CRM ownerless leads.
- [ ] Log one insight, one bottleneck, and one next experiment.

## Monday metrics review template

```text
Week of:
Owner:

1. Acquisition
   - Sessions:
   - Organic impressions / clicks:
   - Top 3 landing pages:
   - Top 3 channel sources:

2. Conversion
   - Quote starts:
   - Quote submissions:
   - Bookings created:
   - Quote submit -> booked rate:

3. Revenue and attribution
   - Booked revenue:
   - First-touch winners:
   - Last-touch winners:
   - Assisted channels worth keeping:

4. Nurture and retention
   - New nurture entrants:
   - Open / click / reply rate:
   - Review requests sent:
   - Referrals shared / converted:

5. Operations
   - Workflow failures this week:
   - Tracking anomalies:
   - Deliverability issues:
   - Top priority fix:

6. Decisions
   - Stop doing:
   - Double down on:
   - Experiments to launch:
```
