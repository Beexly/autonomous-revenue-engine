# Growth Ops Runbook and Checklist

References:
- Architecture: `docs/architecture.md`
- 90-day plan: `docs/flywheel-90-day.md`
- Workflow specs: `services/automation/workflows/`

## Severity levels

| Severity | Definition | Response target |
| --- | --- | --- |
| Sev 1 | Revenue-blocking outage or data loss in quote/booking flow | 15 minutes |
| Sev 2 | Major degradation with workaround, stale attribution, or email delivery failure | 60 minutes |
| Sev 3 | Minor issue, isolated workflow failure, or dashboard discrepancy | Same business day |

## Daily checklist

- [ ] Confirm marketing site, quote form, and Typebot load successfully on desktop and mobile.
- [ ] Submit one internal test quote and verify `leads`, `utm_sessions`, and `lead_events` writes.
- [ ] Clear n8n failed executions and replay any safe DLQ items.
- [ ] Review new CRM leads for owner assignment and missing contact fields.
- [ ] Check Listmonk bounce, spam complaint, and unsubscribe spikes.
- [ ] Review top pages and funnel drop-offs in Umami and PostHog.

## Weekly checklist

- [ ] Run the Monday metrics review from `docs/flywheel-90-day.md`.
- [ ] Spot-check attribution views against raw tables using the validation SQL in `data/sql/002_attribution.sql`.
- [ ] Review content pipeline status and approve/reject queued `content_assets`.
- [ ] Audit one completed booking for review and referral workflow completion.
- [ ] Verify Fider votes are triaged into content, offer, or product backlog buckets.
- [ ] Rotate any expiring secrets or webhook tokens due within 30 days.

## Monthly checklist

- [ ] Review SLO performance and incident counts.
- [ ] Refresh backup-restore test for PostgreSQL and n8n credentials/config.
- [ ] Audit CRM field mapping, nurture segments, and dead-letter replay patterns.
- [ ] Review top revenue channels and retire one low-yield content/distribution pattern.
- [ ] Confirm retention and deletion policies for PII and analytics exports.

## Incident playbook: automation outage

**Severity guidance:** Sev 1 if quote, booking, or review workflows stop; Sev 2 if only content distribution fails.

### Triage
1. Check n8n health endpoint, queue backlog, and recent failed executions.
2. Confirm database connectivity and credential validity.
3. Identify the first failed workflow and isolate whether the issue is upstream payload, database, or external API.

### Immediate actions
- Pause non-critical workflows first.
- Switch quote acknowledgments to a manual fallback inbox/SMS if customer-facing automations are down.
- Export failed execution payloads before replay.

### Rollback guidance
- Revert the last workflow change or credential rotation.
- Re-enable the prior stable workflow version, then replay customer-facing events in chronological order.
- Validate idempotency before replay to avoid duplicate sends or CRM records.

## Incident playbook: tracking or data drift

**Severity guidance:** Sev 2 when attribution dashboards are stale or mismatched; Sev 1 if lead writes are missing.

### Triage
1. Compare last 24 hours of `utm_sessions`, `lead_events`, and analytics events.
2. Run the validation queries from `data/sql/002_attribution.sql`.
3. Check recent frontend deploys, middleware changes, and cookie/consent banner behavior.

### Immediate actions
- Freeze experiment launches until tracking integrity is restored.
- Backfill missing rows from logs or event exports where possible.
- Flag affected date ranges in Metabase dashboards.

### Rollback guidance
- Roll back the latest tracking or middleware change.
- Restore the previous attribution query version if the breakage is in derived views.
- Recompute materialized views after backfill completes.

## Incident playbook: email deliverability drop

**Severity guidance:** Sev 2 for bounce/complaint spikes; Sev 1 if transactional confirmations fail.

### Triage
1. Check sending provider health, domain authentication, and recent bounce/complaint metrics.
2. Segment failures by campaign, template, and audience source.
3. Confirm Listmonk suppression lists and consent filters are functioning.

### Immediate actions
- Pause the lowest-performing nurture or recovery sequence first.
- Route critical confirmations through the backup transactional sender.
- Remove obviously invalid addresses and recent hard bounces from active lists.

### Rollback guidance
- Revert the last template or sending-domain change.
- Restore the previous list segment rules if a mapping change caused the spike.
- Reintroduce sends gradually after monitoring recovery for 24 hours.

## Incident playbook: conversion-rate anomaly

**Severity guidance:** Sev 2 when quote or booking conversion drops >20% week over week; Sev 1 if conversion effectively stops.

### Triage
1. Check site uptime, form errors, Typebot completion rate, and booking workflow health.
2. Segment the anomaly by landing page, device, traffic source, and campaign.
3. Review recent page changes, pricing changes, experiments, and content/channel mix shifts.

### Immediate actions
- Pause the latest experiment or newly launched landing page if it correlates with the drop.
- Reinstate the last known winning CTA, quote form, or proof block variant.
- Notify operators to handle hot leads manually while the issue is investigated.

### Rollback guidance
- Roll back the latest frontend change, copy change, or workflow rule tied to the drop.
- Restore the previous version of the quote flow and rerun a live test submission.
- Keep the rollback in place until one full business cycle confirms recovery.
