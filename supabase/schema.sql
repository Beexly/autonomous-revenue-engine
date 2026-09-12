-- SignPreview v2 — leads table
-- Supabase free tier compatible. Runs clean on a fresh project.

CREATE TABLE IF NOT EXISTS leads (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at  timestamptz DEFAULT now(),
  name        text NOT NULL,
  contact     text NOT NULL,
  business_name text NOT NULL,
  mockup_url  text,
  sign_type   text DEFAULT 'storefront',
  style       text DEFAULT 'modern',
  source      text DEFAULT 'signpreview'
);

-- RLS: anon key can INSERT only; reads restricted to service role.
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;

CREATE POLICY "anon can insert leads" ON leads
  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "anon cannot read leads" ON leads
  FOR SELECT TO anon USING (false);

CREATE POLICY "anon cannot update leads" ON leads
  FOR UPDATE TO anon USING (false);

CREATE POLICY "anon cannot delete leads" ON leads
  FOR DELETE TO anon USING (false);
