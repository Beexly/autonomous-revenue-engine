// SignPreview v2 — backend configuration
// DO NOT commit real Supabase keys. Fill from the dashboard on the machine that deploys.
// Anon key is public by design. RLS must deny SELECT to `anon` or every lead is world-readable.

/** @type {string} e.g. https://xxxx.supabase.co — placeholders keep capture in mailto fallback */
export const SUPABASE_URL = 'https://YOUR_PROJECT_URL.supabase.co';

/** @type {string} anon/public key. Never the service_role key. */
export const SUPABASE_ANON_KEY = 'YOUR_ANON_KEY_HERE';

/** @type {string} $0 capture path when Supabase is unconfigured. Kit/SignPreview face. */
export const LEAD_MAILTO = 'Baxley.Garrett@gmail.com';
