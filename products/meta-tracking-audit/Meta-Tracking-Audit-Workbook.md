# Meta Tracking Audit Workbook (v1.0)
**Pixel + Conversions API (CAPI) Deduplication, `event_id` Pairing & EMQ >= 8.0 Diagnostic Playbook**  
*Signal Origin · Autonomous Revenue Engine*

---

## How to Use This 90-Minute Workbook
If you spend $5,000+/month on Meta Ads, broken Pixel + CAPI tracking quietly inflates your CPA by 15%–40% through double-counted conversions, low Event Match Quality (EMQ), or dropped `fbp`/`fbc` attribution.

Work through Parts 1–5 in order and record your **Before** and **After** evidence in `Meta-EMQ-Audit-Checklist.csv`.

---

## Part 1: Event Inventory & Pixel vs. CAPI Deduplication

### 1.1 Connection Method Audit
Open **Meta Events Manager → Data Sources → [Your Pixel] → Overview**.  
Every revenue-critical event (`Purchase`, `Lead`, `InitiateCheckout`, `Schedule`, `CompleteRegistration`) should show **Browser + Server** ("Multiple").

| Event Name | Browser Active? | Server (CAPI) Active? | Deduplication Status | Action Required |
|---|---|---|---|---|
| `PageView` | Yes / No | Yes / No | Deduplicated / Double-Counted | |
| `ViewContent` | Yes / No | Yes / No | Deduplicated / Double-Counted | |
| `AddToCart` | Yes / No | Yes / No | Deduplicated / Double-Counted | |
| `InitiateCheckout` | Yes / No | Yes / No | Deduplicated / Double-Counted | |
| `Lead` / `Schedule` | Yes / No | Yes / No | Deduplicated / Double-Counted | |
| `Purchase` | Yes / No | Yes / No | Deduplicated / Double-Counted | |

### 1.2 The `event_id` Pairing Rule
Meta deduplicates **only** when both conditions are met within the **48-hour deduplication window**:
1. `event_name` matches **character-for-character** (`Purchase` === `Purchase`, not `purchase`).
2. `event_id` matches **character-for-character** between the browser `fbq('track', ...)` call and the server CAPI `events[0].event_id` payload.

**Correct Browser Snippet:**
```javascript
const eventId = 'evt_' + crypto.randomUUID();
fbq('track', 'Purchase', {
  value: 149.00,
  currency: 'USD'
}, { eventID: eventId });
// Pass the exact same `eventId` to your backend / webhook / GTM server container
```

**Correct Server CAPI Payload:**
```json
{
  "data": [{
    "event_name": "Purchase",
    "event_time": 1795000000,
    "event_id": "evt_550e8400-e29b-41d4-a716-446655440000",
    "action_source": "website",
    "event_source_url": "https://yourdomain.com/thank-you",
    "user_data": {
      "em": ["<sha256_lowercase_trimmed_email>"],
      "ph": ["<sha256_e164_digits_only_phone>"],
      "client_ip_address": "203.0.113.42",
      "client_user_agent": "Mozilla/5.0 ...",
      "fbp": "fb.1.1794999900.1234567890",
      "fbc": "fb.1.1794999900.IwAR0xyz..."
    },
    "custom_data": {
      "value": 149.00,
      "currency": "USD"
    }
  }]
}
```

### 1.3 Common Deduplication Traps
- **Nightly batch uploads** of events already fired by the Pixel: if the server batch arrives >48h later (or lacks `event_id`), Meta double-counts every order.
- **Mismatched `event_id` generators**: generating `uuid()` separately on client and server never deduplicates. Generate once (e.g., `order_id` or checkout session token) and reuse in both places.
- **Double Pixel installation**: having both a hardcoded `fbq('init', ...)` in theme.liquid *and* Shopify/GTM firing a second Pixel inflates browser counts 2x.

---

## Part 2: Event Match Quality (EMQ) Scoring >= 8.0

Events Manager scores server events from **1.0 to 10.0**. Target **>= 8.0** on `Purchase` and `Lead` (and >= 6.5 on upper-funnel events).

### 2.1 EMQ Parameter Weights & Normalization Rules
**Critical:** Always normalize **before** SHA-256 hashing. Hashing mixed-case or un-trimmed strings silently destroys match rate.

| Parameter | CAPI Key | Required Normalization Before SHA-256 | Target Coverage |
|---|---|---|---|
| Email | `em` | `trim().toLowerCase()` | >= 95% |
| Phone | `ph` | Strip `+`, spaces, dashes, parens; include country code (e.g. `17135550100`) | >= 85% |
| First / Last Name | `fn`, `ln` | `trim().toLowerCase()`, strip punctuation | >= 85% |
| City / State / Zip / Country | `ct`, `st`, `zp`, `country` | Lowercase, no spaces (`ct`), 2-letter (`st`, `country`) | >= 80% |
| External ID | `external_id` | Stable customer/user ID (SHA-256 recommended) | >= 90% |
| Client IP & User-Agent | `client_ip_address`, `client_user_agent` | **Do NOT hash** — send raw for `website` events | 100% |
| Browser ID | `fbp` | **Do NOT hash** — read `_fbp` cookie (`fb.1.<ts>.<rand>`) | >= 90% |
| Click ID | `fbc` | **Do NOT hash** — read `_fbc` cookie or construct `fb.1.<ts>.<fbclid>` | 100% when `fbclid` present |

---

## Part 3: `fbp` / `fbc` Preservation Across Redirects & Checkouts

1. **First-party cookie capture:** On landing, read URL param `fbclid`. If `_fbc` cookie is missing, set `_fbc = fb.1.${Date.now()}.${fbclid}` with `SameSite=Lax; Path=/; Max-Age=7776000`.
2. **Cross-domain checkout handoff:** If checkout moves from `www.brand.com` to `checkout.shopify.com` or `pay.stripe.com`, persist `_fbp`, `_fbc`, and `event_id` in checkout metadata / custom attributes so the server webhook can attach them to `Purchase`.
3. **Consent Mode check:** Test with a declined-consent browser session to verify whether server-side CAPI respects your consent policy and does not drop `event_id` on consented sessions.

---

## Part 4: Platform-Specific Checklists

### 4.1 Shopify (OS 2.0 + Checkout Extensibility)
- [ ] Use **Meta Sales Channel (Maximum data sharing)** or a single custom Web Pixel—never both.
- [ ] Remove legacy `fbq` scripts from `theme.liquid` and Additional Scripts (`checkout.liquid` is deprecated).
- [ ] Verify `Purchase` value excludes/matches your chosen tax & shipping convention consistently across Pixel and CAPI.
- [ ] Confirm `Test Events` shows **1 Browser + 1 Server** row with **Deduplicated** badge.

### 4.2 GoHighLevel (GHL)
- [ ] Pass `fbp` and `fbc` into hidden form/calendar fields (`_fbp`, `_fbc`) on every funnel step.
- [ ] In GHL Workflows, ensure the **Facebook Conversion API** action includes `event_id` matching the funnel thank-you page Pixel `eventID`.
- [ ] Set `action_source` to `website` for web form/calendar bookings and `system_generated` / `other` only for offline CRM stage changes.

### 4.3 Framer
- [ ] Inject Meta Pixel base code once in **Site Settings → Custom Code → Start of `<head>`**.
- [ ] On form submit, capture `_fbp` / `_fbc` cookies + generated `event_id` in hidden inputs or webhook payload to Make/n8n/Stape.
- [ ] Fire `fbq('track', 'Lead', {}, { eventID })` on actual form success callback—not on button click.

### 4.4 Stape (Server-Side GTM)
- [ ] Enable **Custom Loader** + **Cookie Keeper** power-ups on a first-party subdomain (`sgtm.yourdomain.com`) to survive Safari ITP 7-day cookie caps.
- [ ] Map `x-fb-event-id` from GA4/Data Tag client into both Web Meta Pixel tag and Server Facebook CAPI tag.
- [ ] Verify Stape preview logs return HTTP `200` with `events_received: 1` and zero `Invalid parameter` warnings.

---

## Part 5: 7-Day Backend Reconciliation & Sign-Off

1. Export **7 days** of actual paid orders / qualified leads from your backend (Shopify / Stripe / CRM).
2. Compare against **Meta Events Manager** `Purchase` / `Lead` totals:
   - **Within ±5%–15%:** Healthy (minor ad-blocker / cross-device variance).
   - **+30% or higher in Meta:** Likely double-counting (missing `event_id` or duplicate Pixel).
   - **-25% or lower in Meta:** Likely blocked browser Pixel without CAPI fallback or dropped `Purchase` webhook.
3. Re-run `Test Events` after every theme, checkout, or funnel update.
