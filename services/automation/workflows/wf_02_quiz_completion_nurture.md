# WF-02 Quiz Completion Nurture

## Objective

Turn quiz completions into segmented nurture entrants with a complete intent profile stored in PostgreSQL and mirrored into CRM.

## Trigger and example payload

**Trigger:** Typebot webhook on successful quiz completion.

**Payload contract:**

```json
{
  "idempotency_key": "quiz_01J91G8B7K4B98RWMY2KQ3C2JG",
  "completed_at": "2026-09-16T01:05:00Z",
  "lead": {
    "full_name": "Maya Chen",
    "email": "maya@example.com",
    "phone": "+15555550200",
    "event_type": "corporate",
    "guest_count": 60,
    "budget_band": "mid",
    "timeline_days": 21,
    "consent_email": true,
    "consent_sms": false
  },
  "answers": {
    "style": "modern_minimal",
    "service_interest": "boxed_catering",
    "city": "Austin",
    "pain_point": "need_fast_quote"
  },
  "session": {
    "session_key": "sess_3dc67210",
    "utm_source": "google",
    "utm_medium": "organic",
    "landing_path": "/quiz"
  },
  "source_system": "typebot.quiz"
}
```

## n8n-oriented nodes and actions

1. **Webhook** - receive Typebot payload and validate source secret.
2. **Function** - map answer bundle to `nurture_segment`, `service_interest`, and `notes`.
3. **PostgreSQL** - upsert `leads` with quiz context and consent flags.
4. **PostgreSQL** - upsert `utm_sessions` by `session_key`.
5. **PostgreSQL** - insert `lead_events` row with `event_type = 'quiz_completed'` and answer payload.
6. **HTTP Request / Twenty CRM** - update lead profile fields and owner rules.
7. **HTTP Request / Listmonk** - subscribe the lead to the mapped segment and trigger sequence 1.
8. **If node** - if `timeline_days <= 14`, create a task in CRM for same-day follow-up.
9. **Respond to Webhook** - return segment, lead id, and follow-up priority.

## Idempotency strategy

- Use `idempotency_key` as the sole idempotent execution token.
- Permit lead profile updates on re-run but prevent duplicate `quiz_completed` events for the same key.
- Segment assignment is deterministic from mapped answers to avoid drift.

## Observability events to emit

- `workflow_started`
- `lead_upserted`
- `quiz_segment_assigned`
- `crm_sync_succeeded` or `crm_sync_failed`
- `nurture_enrolled`
- `workflow_completed`

## Failure handling and dead-letter strategy

- Retry CRM and Listmonk nodes 3 times with backoff: 30s, 5m, 15m.
- If answer mapping fails validation, route to DLQ with reason `mapping_error` and notify operator.
- If consent is false, workflow completes without email enrollment and logs `nurture_skipped_no_consent`.

## Test cases

### Happy path
- Corporate quiz completion enrolls the lead in the correct segment and creates a CRM task when `timeline_days <= 14`.

### Edge case 1
- Duplicate webhook updates the existing lead but does not insert a second `quiz_completed` event.

### Edge case 2
- Unsupported answer value falls back to `general_inquiry` segment and raises an operator alert.

### Edge case 3
- Lead opts out of email; workflow persists quiz data and CRM sync but skips Listmonk enrollment cleanly.
