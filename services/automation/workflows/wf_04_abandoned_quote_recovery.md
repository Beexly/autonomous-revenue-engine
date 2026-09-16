# WF-04 Abandoned Quote Recovery

## Objective

Recover high-intent visitors who started but did not submit a quote by re-engaging them with the right channel and message timing.

## Trigger and example payload

**Trigger:** scheduled n8n query every 30 minutes for leads or sessions with `quote_started` but no `quote_submitted` after 60 minutes.

**Payload contract:**

```json
{
  "idempotency_key": "recover_sess_9a1bd6c1_2026-09-16",
  "lead": {
    "lead_id": "17f9ea06-e0fe-4c46-85c1-6b0d78781f57",
    "email": "jordan@example.com",
    "phone": "+15555550199",
    "consent_email": true,
    "consent_sms": true
  },
  "session": {
    "session_key": "sess_9a1bd6c1",
    "landing_path": "/quote",
    "utm_source": "instagram",
    "utm_medium": "social"
  },
  "recovery_reason": "quote_started_without_submit",
  "source_system": "n8n.recovery_scan"
}
```

## n8n-oriented nodes and actions

1. **Cron** - run every 30 minutes.
2. **PostgreSQL** - select quote starters without `quote_submitted` in the last 24 hours.
3. **Function** - score recovery priority based on event type, budget, and recency.
4. **If node** - send SMS if consent exists; otherwise send email; otherwise create CRM task only.
5. **HTTP Request / Listmonk** - add lead to `abandoned_quote_recovery` sequence when email consent exists.
6. **HTTP Request / Twenty CRM** - create follow-up task with due time based on priority.
7. **PostgreSQL** - insert a `lead_events` note in `event_payload` describing the recovery attempt.

## Idempotency strategy

- One recovery attempt per `session_key` per 24-hour window.
- Use a stable key derived from `session.session_key` plus the UTC recovery-window date, for example `recover_<session_key>_<yyyy-mm-dd>`.
- Track the last recovery attempt in event payload or CRM custom field before firing a new one.

## Observability events to emit

- `workflow_started`
- `recovery_candidate_found`
- `recovery_message_sent`
- `recovery_message_skipped`
- `crm_follow_up_created`
- `workflow_completed`

## Failure handling and dead-letter strategy

- Retry messaging and CRM calls twice with backoff: 5m, 20m.
- If outreach fails on all channels, create a high-priority CRM task and alert the operator.
- Store failed recovery payloads in DLQ for same-day replay only; do not replay older than 24 hours.

## Test cases

### Happy path
- Lead with consent receives one recovery message and one CRM task after abandoning the quote.

### Edge case 1
- Lead already submitted a quote after the scan query snapshot; workflow re-checks before send and exits cleanly.

### Edge case 2
- No consent for SMS or email; workflow skips messaging and creates CRM follow-up only.

### Edge case 3
- Repeated scheduled scans within 24 hours do not send duplicate recovery messages for the same session.
