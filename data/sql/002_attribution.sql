-- Attribution layer for Growth Ops reporting.
-- Apply after 001_core_tables.sql.
-- Refresh guidance:
--   1. REFRESH MATERIALIZED VIEW analytics_channel_revenue_mv;
--   2. For higher scale, create the unique index below first and use REFRESH MATERIALIZED VIEW CONCURRENTLY.
-- Validation examples are included at the bottom of this file.

CREATE OR REPLACE VIEW analytics_first_touch_attribution_v AS
SELECT DISTINCT ON (l.id)
  l.id AS lead_id,
  us.id AS utm_session_id,
  COALESCE(NULLIF(us.utm_source, ''), 'direct') AS channel_source,
  COALESCE(NULLIF(us.utm_medium, ''), 'none') AS channel_medium,
  COALESCE(NULLIF(us.utm_campaign, ''), 'unattributed') AS channel_campaign,
  us.landing_path,
  COALESCE(us.first_seen_at, us.created_at) AS touch_at
FROM leads l
LEFT JOIN utm_sessions us
  ON us.lead_id = l.id
ORDER BY l.id, COALESCE(us.first_seen_at, us.created_at) ASC NULLS LAST, us.id;

CREATE OR REPLACE VIEW analytics_last_touch_attribution_v AS
SELECT DISTINCT ON (l.id)
  l.id AS lead_id,
  us.id AS utm_session_id,
  COALESCE(NULLIF(us.utm_source, ''), 'direct') AS channel_source,
  COALESCE(NULLIF(us.utm_medium, ''), 'none') AS channel_medium,
  COALESCE(NULLIF(us.utm_campaign, ''), 'unattributed') AS channel_campaign,
  us.exit_path,
  COALESCE(us.converted_at, us.last_seen_at, us.updated_at, us.created_at) AS touch_at
FROM leads l
LEFT JOIN utm_sessions us
  ON us.lead_id = l.id
ORDER BY l.id, COALESCE(us.converted_at, us.last_seen_at, us.updated_at, us.created_at) DESC NULLS LAST, us.id DESC;

CREATE OR REPLACE VIEW analytics_multi_touch_path_v AS
SELECT
  l.id AS lead_id,
  us.id AS utm_session_id,
  ROW_NUMBER() OVER (
    PARTITION BY l.id
    ORDER BY COALESCE(us.first_seen_at, us.created_at), us.id
  ) AS touch_number,
  COUNT(us.id) OVER (PARTITION BY l.id) AS touch_count,
  COALESCE(NULLIF(us.utm_source, ''), 'direct') AS channel_source,
  COALESCE(NULLIF(us.utm_medium, ''), 'none') AS channel_medium,
  COALESCE(NULLIF(us.utm_campaign, ''), 'unattributed') AS channel_campaign,
  us.landing_path,
  COALESCE(us.converted_at, us.last_seen_at, us.first_seen_at, us.created_at) AS touch_at,
  MAX(COALESCE(us.converted_at, us.last_seen_at, us.first_seen_at, us.created_at)) OVER (PARTITION BY l.id)
    = COALESCE(us.converted_at, us.last_seen_at, us.first_seen_at, us.created_at) AS is_last_touch,
  EXISTS (
    SELECT 1
    FROM bookings b
    WHERE b.lead_id = l.id
      AND b.status IN ('booked', 'fulfilled')
  ) AS has_booked_revenue
FROM leads l
JOIN utm_sessions us
  ON us.lead_id = l.id;

DROP MATERIALIZED VIEW IF EXISTS analytics_channel_revenue_mv;

CREATE MATERIALIZED VIEW analytics_channel_revenue_mv AS
WITH booked_revenue AS (
  SELECT
    b.id AS booking_id,
    b.lead_id,
    date_trunc('month', COALESCE(b.fulfilled_at, b.scheduled_start_at, b.created_at)) AS booking_month,
    b.revenue_cents
  FROM bookings b
  WHERE b.status IN ('booked', 'fulfilled')
    AND b.revenue_cents > 0
)
SELECT
  'first_touch'::text AS attribution_model,
  br.booking_month,
  COALESCE(ft.channel_source, 'direct') AS channel_source,
  COALESCE(ft.channel_medium, 'none') AS channel_medium,
  COALESCE(ft.channel_campaign, 'unattributed') AS channel_campaign,
  COUNT(DISTINCT br.booking_id) AS booking_count,
  SUM(br.revenue_cents) AS revenue_cents
FROM booked_revenue br
LEFT JOIN analytics_first_touch_attribution_v ft
  ON ft.lead_id = br.lead_id
GROUP BY 1, 2, 3, 4, 5

UNION ALL

SELECT
  'last_touch'::text AS attribution_model,
  br.booking_month,
  COALESCE(lt.channel_source, 'direct') AS channel_source,
  COALESCE(lt.channel_medium, 'none') AS channel_medium,
  COALESCE(lt.channel_campaign, 'unattributed') AS channel_campaign,
  COUNT(DISTINCT br.booking_id) AS booking_count,
  SUM(br.revenue_cents) AS revenue_cents
FROM booked_revenue br
LEFT JOIN analytics_last_touch_attribution_v lt
  ON lt.lead_id = br.lead_id
GROUP BY 1, 2, 3, 4, 5;

-- Index guidance for fast dashboard queries and concurrent refresh.
CREATE UNIQUE INDEX IF NOT EXISTS idx_analytics_channel_revenue_mv_key
  ON analytics_channel_revenue_mv (
    attribution_model,
    booking_month,
    channel_source,
    channel_medium,
    channel_campaign
  );

CREATE INDEX IF NOT EXISTS idx_analytics_first_touch_lead_id
  ON utm_sessions (lead_id, first_seen_at);

CREATE INDEX IF NOT EXISTS idx_analytics_last_touch_lead_id
  ON utm_sessions (lead_id, converted_at, last_seen_at);

-- Sample validation queries:
-- 1) First-touch lead count should match the number of leads with or without sessions.
--    SELECT COUNT(*) FROM analytics_first_touch_attribution_v;
--
-- 2) Last-touch attribution should return a single row per lead.
--    SELECT lead_id, COUNT(*) FROM analytics_last_touch_attribution_v GROUP BY 1 HAVING COUNT(*) > 1;
--
-- 3) Multi-touch helper should expose the ordered path per lead.
--    SELECT lead_id, STRING_AGG(channel_source || ':' || channel_medium, ' -> ' ORDER BY touch_number)
--    FROM analytics_multi_touch_path_v
--    GROUP BY 1
--    ORDER BY 1
--    LIMIT 20;
--
-- 4) Revenue rollups should reconcile with booked revenue in base tables when filtered to one attribution model at a time.
--    SELECT SUM(revenue_cents) FROM analytics_channel_revenue_mv WHERE attribution_model = 'first_touch';
--    SELECT SUM(revenue_cents) FROM analytics_channel_revenue_mv WHERE attribution_model = 'last_touch';
--    SELECT SUM(revenue_cents) FROM bookings WHERE status IN ('booked', 'fulfilled');
