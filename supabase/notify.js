// SignPreview v2 — Resend (free tier) email notification on new lead
// Requires: RESEND_API_KEY in Supabase Edge Function env (twilight)
// Triggered by: new row inserted into `leads` table

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
const resendApiKey = Deno.env.get('RESEND_API_KEY') || '';
const fromEmail = Deno.env.get('FROM_EMAIL') || 'garrett@autonomous-revenue-engine';

serve(async (req) => {
  // Only accept POST
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 });
  }

  try {
    const payload = await req.json();
    const newRecord = payload.new;

    if (!newRecord) {
      return new Response('No new record', { status: 400 });
    }

    // Send notification email via Resend (free tier: 1,000 emails/month)
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromEmail,
        to: newRecord.contact || '',
        subject: `New lead: ${newRecord.business_name} — SignPreview`,
        html: `
          <p>A new lead submitted through SignPreview:</p>
          <table style="border-collapse:collapse;width:100%;max-width:400px">
            <tr><td style="padding:8px 0;font-weight:bold;color:#6b5a44">Name</td><td style="padding:8px 0">${escapeHtml(newRecord.name)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#6b5a44">Contact</td><td style="padding:8px 0">${escapeHtml(newRecord.contact)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#6b5a44">Business</td><td style="padding:8px 0">${escapeHtml(newRecord.business_name)}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#6b5a44">Sign Type</td><td style="padding:8px 0">${escapeHtml(newRecord.sign_type || '')}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#6b5a44">Style</td><td style="padding:8px 0">${escapeHtml(newRecord.style || '')}</td></tr>
            <tr><td style="padding:8px 0;font-weight:bold;color:#6b5a44">Mockup URL</td><td style="padding:8px 0"><a href="${escapeHtml(newRecord.mockup_url || '')}">View mockup</a></td></tr>
          </table>
          <p style="color:#6b5a44;font-size:12px;margin-top:16px">Source: ${escapeHtml(newRecord.source || 'signpreview')}</p>
        `,
      }),
    });

    if (!response.ok) {
      const errBody = await response.text();
      console.error('Resend error:', response.status, errBody);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (err) {
    console.error('Function error:', err);
    return new Response(JSON.stringify({ error: err.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
});

function escapeHtml(str) {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}
