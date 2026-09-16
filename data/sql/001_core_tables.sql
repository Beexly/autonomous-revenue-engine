-- Core Growth Ops schema for charcuteriechick.ai
-- Apply before 002_attribution.sql.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

DO $$
BEGIN
  CREATE TYPE lead_status AS ENUM ('new', 'qualified', 'quoted', 'proposal_sent', 'booked', 'lost', 'unsubscribed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE lead_event_type AS ENUM (
    'session_started',
    'quote_started',
    'quote_submitted',
    'quiz_completed',
    'proposal_sent',
    'booking_confirmed',
    'booking_fulfilled',
    'review_requested',
    'review_submitted',
    'referral_shared',
    'referral_converted',
    'feedback_voted',
    'content_published'
  );
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE booking_status AS ENUM ('draft', 'sent', 'signed', 'booked', 'fulfilled', 'cancelled', 'no_show');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE content_asset_type AS ENUM ('blog_post', 'landing_page', 'gallery', 'reel', 'carousel', 'email', 'testimonial', 'faq');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE content_asset_status AS ENUM ('draft', 'approved', 'scheduled', 'published', 'archived');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE referral_status AS ENUM ('sent', 'clicked', 'qualified', 'booked', 'rewarded', 'expired');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE review_status AS ENUM ('requested', 'submitted', 'published', 'resolved', 'suppressed');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

CREATE TABLE IF NOT EXISTS leads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text,
  phone text,
  full_name text,
  company_name text,
  lead_source text NOT NULL DEFAULT 'website',
  service_interest text,
  event_type text,
  event_date date,
  guest_count integer CHECK (guest_count IS NULL OR guest_count >= 0),
  budget_min_cents integer CHECK (budget_min_cents IS NULL OR budget_min_cents >= 0),
  budget_max_cents integer CHECK (budget_max_cents IS NULL OR budget_max_cents >= 0),
  nurture_segment text,
  status lead_status NOT NULL DEFAULT 'new',
  consent_email boolean NOT NULL DEFAULT false,
  consent_sms boolean NOT NULL DEFAULT false,
  crm_contact_id text,
  notes text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (email IS NOT NULL OR phone IS NOT NULL),
  CHECK (budget_max_cents IS NULL OR budget_min_cents IS NULL OR budget_max_cents >= budget_min_cents)
);

CREATE TABLE IF NOT EXISTS utm_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL UNIQUE,
  anonymous_id text,
  lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  first_seen_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  converted_at timestamptz,
  landing_path text,
  exit_path text,
  referrer_url text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  device_type text CHECK (device_type IS NULL OR device_type IN ('desktop', 'mobile', 'tablet', 'bot', 'unknown')),
  country_code char(2),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (country_code IS NULL OR country_code ~ '^[A-Z]{2}$')
);

CREATE TABLE IF NOT EXISTS lead_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
  utm_session_id uuid REFERENCES utm_sessions(id) ON DELETE SET NULL,
  event_type lead_event_type NOT NULL,
  source_system text NOT NULL,
  event_value numeric(12,2),
  event_payload jsonb NOT NULL DEFAULT '{}'::jsonb,
  occurred_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE RESTRICT,
  booking_reference text NOT NULL UNIQUE,
  status booking_status NOT NULL DEFAULT 'draft',
  event_name text,
  event_type text,
  venue_name text,
  scheduled_start_at timestamptz,
  scheduled_end_at timestamptz,
  guest_count integer CHECK (guest_count IS NULL OR guest_count >= 0),
  revenue_cents integer NOT NULL DEFAULT 0 CHECK (revenue_cents >= 0),
  deposit_cents integer NOT NULL DEFAULT 0 CHECK (deposit_cents >= 0),
  external_documenso_id text,
  external_crm_deal_id text,
  fulfilled_at timestamptz,
  cancelled_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (scheduled_end_at IS NULL OR scheduled_start_at IS NULL OR scheduled_end_at >= scheduled_start_at),
  CHECK (deposit_cents <= revenue_cents)
);

CREATE TABLE IF NOT EXISTS content_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  asset_type content_asset_type NOT NULL,
  status content_asset_status NOT NULL DEFAULT 'draft',
  title text NOT NULL,
  slug text,
  channel text,
  canonical_url text,
  source_asset_id uuid REFERENCES content_assets(id) ON DELETE SET NULL,
  related_booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  published_at timestamptz,
  performance_snapshot jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (canonical_url IS NULL OR canonical_url ~ '^https?://')
);

CREATE TABLE IF NOT EXISTS referrals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  referral_code text NOT NULL UNIQUE,
  status referral_status NOT NULL DEFAULT 'sent',
  referrer_lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE RESTRICT,
  origin_booking_id uuid REFERENCES bookings(id) ON DELETE RESTRICT,
  referred_lead_id uuid REFERENCES leads(id) ON DELETE SET NULL,
  referred_booking_id uuid REFERENCES bookings(id) ON DELETE SET NULL,
  landing_path text,
  reward_type text,
  reward_value_cents integer CHECK (reward_value_cents IS NULL OR reward_value_cents >= 0),
  expires_at timestamptz,
  converted_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id uuid NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  lead_id uuid NOT NULL REFERENCES leads(id) ON DELETE RESTRICT,
  platform text NOT NULL CHECK (platform IN ('google', 'yelp', 'facebook', 'tripadvisor', 'internal')),
  status review_status NOT NULL DEFAULT 'requested',
  rating integer CHECK (rating IS NULL OR rating BETWEEN 1 AND 5),
  review_text text,
  review_url text,
  external_review_id text,
  requested_at timestamptz,
  submitted_at timestamptz,
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CHECK (review_url IS NULL OR review_url ~ '^https?://'),
  UNIQUE (booking_id, platform)
);

CREATE INDEX IF NOT EXISTS idx_leads_status_created_at ON leads (status, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_email_unique ON leads (lower(email)) WHERE email IS NOT NULL;
CREATE UNIQUE INDEX IF NOT EXISTS idx_leads_phone_unique ON leads (phone) WHERE phone IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_leads_crm_contact_id ON leads (crm_contact_id) WHERE crm_contact_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_utm_sessions_lead_id ON utm_sessions (lead_id, first_seen_at);
CREATE INDEX IF NOT EXISTS idx_utm_sessions_channel ON utm_sessions (utm_source, utm_medium, utm_campaign);
CREATE INDEX IF NOT EXISTS idx_utm_sessions_converted_at ON utm_sessions (converted_at) WHERE converted_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_lead_events_lead_occurred_at ON lead_events (lead_id, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_events_event_type_occurred_at ON lead_events (event_type, occurred_at DESC);
CREATE INDEX IF NOT EXISTS idx_lead_events_payload_gin ON lead_events USING gin (event_payload);

CREATE INDEX IF NOT EXISTS idx_bookings_status_start ON bookings (status, scheduled_start_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_lead_id ON bookings (lead_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_bookings_external_documenso_id ON bookings (external_documenso_id) WHERE external_documenso_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_content_assets_status_published ON content_assets (status, published_at DESC);
CREATE INDEX IF NOT EXISTS idx_content_assets_asset_type_channel ON content_assets (asset_type, channel);
CREATE INDEX IF NOT EXISTS idx_content_assets_source_asset_id ON content_assets (source_asset_id) WHERE source_asset_id IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_referrals_referrer_status ON referrals (referrer_lead_id, status, created_at DESC);
CREATE UNIQUE INDEX IF NOT EXISTS idx_referrals_origin_booking_id_unique ON referrals (origin_booking_id) WHERE origin_booking_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_referrals_referred_lead_id ON referrals (referred_lead_id) WHERE referred_lead_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_referrals_converted_at ON referrals (converted_at) WHERE converted_at IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_reviews_booking_id ON reviews (booking_id);
CREATE UNIQUE INDEX IF NOT EXISTS idx_reviews_external_review_id_unique ON reviews (external_review_id) WHERE external_review_id IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_reviews_platform_status ON reviews (platform, status, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews (rating) WHERE rating IS NOT NULL;

DROP TRIGGER IF EXISTS set_leads_updated_at ON leads;
CREATE TRIGGER set_leads_updated_at
BEFORE UPDATE ON leads
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_utm_sessions_updated_at ON utm_sessions;
CREATE TRIGGER set_utm_sessions_updated_at
BEFORE UPDATE ON utm_sessions
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_lead_events_updated_at ON lead_events;
CREATE TRIGGER set_lead_events_updated_at
BEFORE UPDATE ON lead_events
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_bookings_updated_at ON bookings;
CREATE TRIGGER set_bookings_updated_at
BEFORE UPDATE ON bookings
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_content_assets_updated_at ON content_assets;
CREATE TRIGGER set_content_assets_updated_at
BEFORE UPDATE ON content_assets
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_referrals_updated_at ON referrals;
CREATE TRIGGER set_referrals_updated_at
BEFORE UPDATE ON referrals
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS set_reviews_updated_at ON reviews;
CREATE TRIGGER set_reviews_updated_at
BEFORE UPDATE ON reviews
FOR EACH ROW
EXECUTE FUNCTION set_updated_at();
