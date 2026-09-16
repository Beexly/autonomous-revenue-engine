# WF-05 Post-Booking Review Referral

## Objective

Turn fulfilled bookings into public reviews and a single trackable referral-program entry per qualifying booking without manual operator follow-up.

## Trigger and example payload

**Trigger:** booking status update to `fulfilled` from CRM, web app admin, or Documenso completion callback.

**Payload contract:**

```json
{
  "idempotency_key": "booking_01J91GQAF4X0G7XAGQ1KM2V4Q7",
  "booking": {
    "booking_id": "19ab8b2e-3d7a-4eb3-9e69-02bd9168562b",
    "booking_reference": "CC-2026-0916",
    "lead_id": "17f9ea06-e0fe-4c46-85c1-6b0d78781f57",
    "revenue_cents": 350000,
    "fulfilled_at": "2026-09-15T22:00:00Z"
  },
  "lead": {
    "full_name": "Jordan Avery",
    "email": "jordan@example.com",
    "phone": "+15555550199",
    "consent_email": true,
    "consent_sms": true
  },
  "source_system": "crm.booking_status"
}
```

## n8n-oriented nodes and actions

1. **Webhook** - receive booking fulfillment event and verify signature.
2. **PostgreSQL** - load `bookings`, `leads`, and prior `reviews` / `referrals` for the booking.
3. **PostgreSQL** - insert `lead_events` row with `event_type = 'booking_fulfilled'` if missing.
4. **Email/SMS node** - send review request 24 hours after fulfillment.
5. **Wait node** - pause 72 hours for review callback or status sync.
6. **If node** - if no review exists, send one reminder; otherwise continue.
7. **PostgreSQL** - create `reviews` row on request and update on submission/publish callbacks.
8. **If node** - continue to referral only when the review row has `status` equal to `submitted` or `published`, and either `rating >= 4` or `mapped_sentiment = positive`; otherwise stop after the reminder path and create a CRM follow-up or service-recovery task if needed.
9. **Function** - generate unique referral code and reward terms.
10. **PostgreSQL** - create or update the single `referrals` row with `origin_booking_id = booking.booking_id` and insert `referral_shared` event.
11. **Email/SMS node** - send referral invite with tracked link.
12. **HTTP Request / Twenty CRM** - log customer advocacy activity on the account.

## Idempotency strategy

- One review-request journey and one referral-program row per `booking.booking_id`.
- Review callback updates must upsert by `external_review_id` or `booking_id + platform`.
- Referral code generation must be deterministic or uniqueness-checked before send.

## Observability events to emit

- `workflow_started`
- `review_requested`
- `review_reminder_sent`
- `review_submitted`
- `referral_created`, `referral_skipped_no_review`, or `referral_skipped_low_rating`
- `referral_invite_sent`
- `workflow_completed`

## Failure handling and dead-letter strategy

- Retry send nodes 3 times with backoff: 15m, 2h, 12h.
- If review provider callback fails validation, hold the payload in DLQ and require manual review before replay.
- If referral creation fails after a qualifying review, alert the operator but do not resend the review request.

## Test cases

### Happy path
- Fulfilled booking sends review request, records a published review, creates a referral code, and logs CRM activity.

### Edge case 1
- Booking already has a published review; workflow skips request steps and creates one referral invite only once.

### Edge case 2
- Review is submitted with rating 2; workflow logs the review, skips referral creation, and opens a service-recovery follow-up instead.

### Edge case 3
- Review provider callback arrives before the wait period ends; workflow resumes, marks review submitted, and avoids reminder send.
