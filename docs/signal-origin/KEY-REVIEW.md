# Supabase lead-capture key review — 2026-09-14

## What is in git (correct)

`docs/js/config.js` still has placeholders:

- `SUPABASE_URL = 'https://YOUR_PROJECT_URL.supabase.co'`
- `SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE'`

No live key is in this repository. Keep it that way. The anon key is public by design once filled; the **service_role** key must never ship in `docs/`.

## What was broken

TASK-004: form showed success when the insert never happened. Motif fixed the fake-success UI (2026-09-13). Remaining block: **no project**. Placeholders mean every submit used to die silently; after the honesty fix it showed an error and only offered Instagram.

Instagram-only fallback is a second loss path (app not installed, IG blocked, brand bleed onto `@gbeexly`).

## What this branch does

1. `LEAD_MAILTO = 'Baxley.Garrett@gmail.com'` — not a secret.
2. If placeholders are still in `config.js`, submit opens a prefilled mailto and says so. It does **not** claim the database got it.
3. If keys exist and insert fails, same mailto, plus the error panel.
4. `docs/js/leads.sql` — `leads` table, RLS on, **anon INSERT only, no SELECT**. Run this before filling keys. Without it, a real key still 401s.

## Owner steps (do not commit the result)

1. Create a free Supabase project.
2. Run `docs/js/leads.sql` in the SQL editor.
3. Copy Project URL + `anon` `public` key into `docs/js/config.js` **on the deploy machine only**.
4. Confirm Dashboard → Authentication → Policies: anon cannot SELECT `leads`.
5. Test: submit SignPreview → row appears. Then submit with keys yanked → mail app opens.
6. Never paste `service_role` into this file.

Until step 3, mailto **is** capture. That is enough for a $150 mockup lead. The database is for volume, which we do not have.
