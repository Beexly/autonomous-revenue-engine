# Shopify admin bookings + manual date blocking — research (2026-11-08, Ask 4)

## Client ask (Oct 28 meeting notes)
"Research how best to utilize Shopify admin for bookings and manually block out dates... 7th and 28th of next month should be marked/booked in the calendar."

## What exists today (verified)
- The Table immersive site Availability section fetches `GET /api/availability` (artifacts/immersive-company-site/vercel-api/availability.js), which reads a public Google Calendar iCal URL (CC_CALENDAR_ICS env var) and returns busy YYYY-MM-DD days. Any all-day event = booked day (one party at a time). Live: `configured:true, busy:[]` — mechanism works, no dates blocked yet.
- The Bookings calendar "Charcuterie Chick Bookings" was created 2026-10-24 (public free/busy, end-to-end verified with a test booking then deleted). Tricia was to accept a writer share invite at [EMAIL], then add all-day events herself.
- Today: Google OAuth token expired 2026-10-24 (invalid_grant, Gmail 401). Service account galaxysportsedge has ZERO calendars shared with it (checked 2026-11-08), so I cannot add the 7th/28th blocks for her from here.

## Why not a Shopify-native calendar
- Shopify core has no built-in bookings calendar for catering (checked 2026-11-08 search). Date/manual blocking at Tricia's scale would require a paid booking app (appointment/event booking apps on Shopify App Store require store admin install; no free keyless option verified). That also contradicts QUOTE.md: nothing on her live Shopify changes until she says go, and add-on cost was never quoted.
- The Google Calendar path is already built, privacy-safe (free/busy only, no titles/notes), and cost-zero. Keep it.

## Unlock (one action, no code)
Re-auth Google OAuth or share the Bookings calendar with the service account, then add two all-day events for next month's 7th and 28th. Tricia can also accept her existing share invite and add them herself — the site picks them up within ~5 min (availability.js Cache-Control: s-maxage=300).

## Confirmed pattern after unlock
- Add event "Booked" 2026-12-07 and 2026-12-28 (Dec 7/28 = next month from Nov 8). Verify GET /api/availability busy[] contains both, then screenshot the Availability section.

## If she had wanted Shopify-native (not recommended for her)
Shopify Functions + custom app could expose a Products/Line Item Property date picker with blackout dates via a Metafields-backed blocklist. Heavier, paid or custom-app install, and the $600 quote never included store-admin changes. Note only.
