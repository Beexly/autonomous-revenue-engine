# White-Label Shopify OS 2.0 Zero-App Catering Theme & Bookings Kit

**Demo Brand:** Atelier Catering Demo · `hello@example.com` · `555-0100`

A zero-app, zero-monthly-fee catering booking calendar, interactive station/cart builder, and cent-accurate quote engine for Shopify OS 2.0 and TypeScript storefronts.

---

## What's Included

| File | Purpose |
|---|---|
| `sections/bookings-calendar.liquid` | Shopify OS 2.0 section: live date availability checker, minimum guest/spend guardrails, 1-tap phone CTA |
| `assets/cc-bookings.js` | Pure JS date-blocking engine (Google Sheets public CSV / JSON feed + manual comma-separated blocks + past-date & minimum-order enforcement) |
| `assets/graze-carts-core.js` | Grazing cart & board configurator logic |
| `assets/bmb-core.js` | Build-your-own bar/box configurator logic |
| `assets/cakes-and-shakes-core.js` | Dessert & beverage station configurator logic |
| `lib/catering.ts` | Cent-accurate TypeScript catering quote calculator (per-person tiers, setup fee, tax, custom enquiry builder) |
| `tests/cc-bookings.test.js` | 6 Node unit tests for booking calendar rules |
| `lib/catering.test.ts` | 19 Node unit tests for cent-accurate quote & enquiry math |

---

## Merchant Setup Guide (15 Minutes)

### 1. Upload Assets & Section to Shopify OS 2.0
1. In **Shopify Admin → Online Store → Themes → Edit code**:
   - Upload `assets/cc-bookings.js`, `assets/graze-carts-core.js`, `assets/bmb-core.js`, and `assets/cakes-and-shakes-core.js` to **Assets/**.
   - Create `sections/bookings-calendar.liquid` and paste the contents of `sections/bookings-calendar.liquid`.
2. In the **Theme Customizer**, add the **Bookings Calendar** section to your Catering or Quote page.

### 2. Connect Your Google Sheet Availability Feed (Optional — $0/mo)
1. Create a Google Sheet with a `Booked_Dates` tab containing columns `Date` (`YYYY-MM-DD`) and `Status` (`BOOKED`).
2. Publish the tab as CSV (**File → Share → Publish to web → CSV**) and paste the URL into the section's **Google Sheet CSV URL** setting.
3. Add comma-separated fallback blocked dates in **Manual Blocked Dates** so your calendar never fails open if offline.

### 3. Customize Brand Details
Replace `Atelier Catering Demo`, `hello@example.com`, and `555-0100` in `sections/bookings-calendar.liquid` and `lib/catering.ts` with your business name, email, and phone number.

### 4. Run Unit Tests Locally
```bash
node tests/cc-bookings.test.js
node lib/catering.test.ts
```
