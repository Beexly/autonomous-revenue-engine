# SignPreview v2 — Lead Capture Setup Guide

This document describes how to set up the lead capture system for SignPreview v2.
**Section 1 requires Garrett's direct action — the builder does not create accounts or handle credentials.**

## 1. Garrett creates the Supabase project (required)

1. Go to https://supabase.com and sign up (free tier is sufficient)
2. Create a new project — give it a name like "signpreview-leads"
3. Note your **Project URL** and **anon key** from Settings → API
4. Copy these values into `docs/js/config.js` — replace the placeholders:
   - `SUPABASE_URL` → your project URL (e.g. `https://xxxx.supabase.co`)
   - `SUPABASE_ANON_KEY` → your anon key

**This step is the only one requiring Garrett.** No other part of this setup needs credentials.

## 2. Deploy the schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Create a new query and paste the contents of `supabase/schema.sql`
3. Click **Run** — the `leads` table will be created with RLS policies

## 3. Set up the notification function (optional, free tier)

If you want email notifications when new leads come in:

1. Create a Resend account (free tier: 1,000 emails/month) at https://resend.com
2. In Supabase dashboard, go to **Edge Functions**
3. Create a new function called `notify-new-lead`
4. Paste the contents of `supabase/notify.js`
5. Set these environment variables in the function settings:
   - `RESEND_API_KEY` — your Resend API key
   - `SUPABASE_URL` — your project URL
   - `SUPABASE_SERVICE_ROLE_KEY` — your service role key (from Settings → API)
   - `FROM_EMAIL` — your notification email (default: `garrett@autonomous-revenue-engine`)
6. Deploy the function

## 4. Wire the frontend snippet

In `docs/signpreview.html`, add these before the closing `</body>` tag:

```html
<script src="/js/config.js"></script>
<script src="/js/lead-capture.js"></script>
```

The lead capture button is already wired to all "Get the full design package" buttons on the page.

## Verification

1. Fill out the form on SignPreview (name, contact, business name)
2. Submit — you should see the confirmation message
3. In Supabase dashboard, check the `leads` table — a new row should appear with your data

**No secrets, API keys, or credentials are committed to this repo. All credentials live in Supabase settings and Minis environment variables.**
