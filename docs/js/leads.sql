-- SignPreview leads. Run in the Supabase SQL editor once.
-- Then paste project URL + anon key into docs/js/config.js locally. Do not commit keys.

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

-- Anon may insert. Anon must not read, update, or delete.
drop policy if exists leads_anon_insert on public.leads;
create policy leads_anon_insert
  on public.leads
  for insert
  to anon
  with check (true);

-- No SELECT policy for anon on purpose.
-- Read rows in the dashboard as the table owner / service role.

grant insert on public.leads to anon;
revoke select, update, delete on public.leads from anon;
