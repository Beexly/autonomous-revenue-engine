# WF-01 Quote Submission

## Objective

Convert every valid website quote submission into a tracked lead, a CRM record, and an immediate response sequence within the SLA defined in `docs/architecture.md`.

## Trigger and example payload

**Trigger:** `POST /webhooks/quote-submitted` from the Next.js quote form.

**Payload contract:**

```json
{
  "idempotency_key": "quote_01J91G4EJY3R1N6Z6Q4H1F9R0A",
  "submitted_at": "2026-09-16T01:00:00Z",
  "lead": {
    "full_name": "Jordan Avery",
    "email": "jordan@example.com",
    "phone": "+15555550199",
    "event_type": "wedding",
    "event_date": "2026-11-08",
    "guest_count": 120,
    "budget_min_cents": 250000,
    "budget_max_cents": 400000,
    "service_interest": "grazing_table",
    "consent_email": true,
    "consent_sms": true
  },
  "session": {
    "session_key": "sess_9a1bd6c1",
    "utm_source": "instagram",
    "utm_medium": "social",
    "utm_campaign": "fall_weddings",
    "landing_path": "/weddings"
  },
  "source_system": "web.quote_form"
}
```

## n8n-oriented nodes and actions

1. **Webhook** - receive payload and verify HMAC signature.
2. **Function** - normalize email, phone, dates, and cents fields.
3. **PostgreSQL** - upsert `leads` by lower(email) or phone.
4. **PostgreSQL** - upsert `utm_sessions` by `session_key`, linking `lead_id` and `converted_at`.
5. **PostgreSQL** - insert `lead_events` row with `event_type = 'quote_submitted'`.
6. **HTTP Request / Twenty CRM** - upsert contact and opportunity; return `crm_contact_id`.
7. **PostgreSQL** - patch `leads.crm_contact_id` and `leads.status = 'qualified'`.
8. **HTTP Request / Listmonk** - add lead to `quote_submitted` segment if `consent_email = true`.
9. **Email/SMS node** - send confirmation message with expected response window.
10. **PostgreSQL** - insert `lead_events` row with `event_type = 'quote_started'` only if missing and provided by frontend history.
11. **Respond to Webhook** - return `202 accepted` with `lead_id`, `crm_contact_id`, and workflow run id.

## Idempotency strategy

- Use `idempotency_key` as the workflow execution key in n8n static data or Redis.
- Treat CRM and Listmonk operations as upserts, never blind inserts.
- Reject duplicate execution when the same `idempotency_key` already produced a `quote_submitted` event within 24 hours.

## Observability events to emit

- `workflow_started` with workflow name and `idempotency_key`
- `lead_upserted`
- `session_linked`
- `crm_sync_succeeded` or `crm_sync_failed`
- `nurture_enrolled`
- `confirmation_sent`
- `workflow_completed`

## Failure handling and dead-letter strategy

`automation_dlq` storage contract: use an n8n Data Store named `automation_dlq` with keys `workflow_name`, `idempotency_key`, `lead_id`, `error_code`, `payload_json`, `first_failed_at`, `retry_after`, and `retry_count`.

- Retry CRM, Listmonk, and messaging nodes 3 times with exponential backoff: 30s, 2m, 10m.
- If database write fails, stop immediately and return non-2xx so the caller retries.
- If CRM sync fails after DB success but before step 7, keep the lead in `status = 'new'`, move payload plus `lead_id` into `automation_dlq`, and alert Slack/email.
- If Listmonk or messaging fails after step 7, preserve `status = 'qualified'`, dead-letter only the failed downstream task, and alert Slack/email.
- Dead-letter items must be replayable with the original `idempotency_key`.

## Test cases

### Happy path
- Valid quote payload creates one lead, one session link, one `quote_submitted` event, one CRM record, and one nurture enrollment.

### Edge case 1
- Duplicate submission with the same `idempotency_key` returns success without creating duplicate `lead_events` or CRM opportunities.

### Edge case 2
- Missing email but valid phone still upserts the lead and skips Listmonk enrollment.

### Edge case 3
- CRM API timeout after DB success creates a DLQ item and leaves the lead in `new` until the CRM replay succeeds.
