-- Canonical copy: docs/js/leads.sql
-- Run in the Supabase SQL editor once. Then paste project URL + anon key
-- into docs/js/config.js ON THE DEPLOY MACHINE. Do not commit keys.
-- Until keys exist, lead-capture.js opens mailto:Baxley.Garrett@gmail.com.

create table if not exists public.leads (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  name text not null,
  contact text not null,
  business_name text not null,
  mockup_url text,
  sign_type text,
  style text,
  source text not null default 'signpreview'
);

alter table public.leads enable row level security;

drop policy if exists leads_anon_insert on public.leads;
create policy leads_anon_insert
  on public.leads
  for insert
  to anon
  with check (true);

-- No SELECT / UPDATE / DELETE for anon. Read in the dashboard as owner.
grant insert on public.leads to anon;
revoke select, update, delete on public.leads from anon;
