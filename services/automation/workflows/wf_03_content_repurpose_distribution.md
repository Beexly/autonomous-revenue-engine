# WF-03 Content Repurpose Distribution

## Objective

Convert every approved content asset into a timed set of derivative assets and publish tasks across SEO, social, and email channels.

## Trigger and example payload

**Trigger:** n8n cron or webhook when a `content_assets` row changes to `approved`.

**Payload contract:**

```json
{
  "idempotency_key": "content_01J91GCY3FQRDVYZVJNF9EGM3P",
  "asset": {
    "content_asset_id": "f559e9d2-b5d5-42c9-8a54-e56fb0c4c0bd",
    "asset_type": "blog_post",
    "title": "How to Plan a Grazing Table for 100 Guests",
    "channel": "seo",
    "canonical_url": "https://www.charcuteriechick.ai/blog/grazing-table-100-guests"
  },
  "brief": {
    "primary_keyword": "charcuterie catering for weddings",
    "target_city": "Austin",
    "cta": "request_quote",
    "publish_at": "2026-09-18T15:00:00Z"
  },
  "source_system": "content_ops"
}
```

## n8n-oriented nodes and actions

1. **Webhook/Cron** - fetch approved asset or accept direct payload.
2. **PostgreSQL** - read the full `content_assets` row and reject if status is not `approved`.
3. **Function** - build derivative task list: reel, carousel, email snippet, internal links, referral CTA.
4. **PostgreSQL** - insert child `content_assets` rows using `source_asset_id`.
5. **HTTP Request / publishing APIs** - send publish or schedule calls to CMS/social tools.
6. **HTTP Request / Listmonk** - create email campaign draft tied to the parent asset.
7. **PostgreSQL** - update asset statuses to `scheduled` or `published` and insert `content_published` events.
8. **Notification node** - send operator summary with publish URLs and failed derivatives.

## Idempotency strategy

- One repurpose run per `asset.content_asset_id` + `brief.publish_at`.
- Child asset slugs must be deterministic and unique by parent asset + channel.
- If rerun, update existing child assets rather than insert duplicates.

## Observability events to emit

- `workflow_started`
- `content_children_created`
- `publish_scheduled`
- `publish_completed`
- `publish_failed`
- `workflow_completed`

## Failure handling and dead-letter strategy

- Retry external publish calls 3 times with backoff: 1m, 10m, 30m.
- If one downstream channel fails, continue other publishes and mark only failed child assets for replay.
- Send failed publish payloads to DLQ with `content_asset_id`, channel, and provider response body.
- Operator replay must preserve the same child asset ids and timestamps.

## Test cases

### Happy path
- Approved blog post creates derivative reel, carousel, and email child assets, then schedules all three successfully.

### Edge case 1
- Asset status changes back to `draft` before execution; workflow exits without publishing.

### Edge case 2
- Social API rate limits one channel; other channels publish and the failed channel lands in DLQ for replay.

### Edge case 3
- Second run with the same idempotency key updates the existing child assets instead of creating duplicates.
