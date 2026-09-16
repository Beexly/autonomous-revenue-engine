# WORKFLOWS — Charcuterie Chick

The client asked for "real workflows". This is the one that exists, what the site
does inside it, and what still needs building. Nothing on the site should promise
a step that does not happen.

## 1. Enquiry → booking (the money path)

```
SITE (works today)
  quote form  ->  "Text this to Tricia" (sms: with the whole enquiry pre-filled)
                  "Copy the message" (desktop fallback)
  call button ->  tel: → her phone
        │
        ▼
TRICIA (her side, unchanged)
  reads the text  ->  replies with price + date availability
  books it        ->  deposit / invoice
  event day       ->  table styled on site, 90 minutes of service
        │
        ▼
FOLLOW-UP (not built — the gap)
  day +2  thank-you text with one photo from the event
  day +3  ask for the Google review (link, one tap)
  day +30 seasonal offer to the same host
```

**The gap:** nothing currently asks for a review, and nothing tracks whether an
enquiry was answered. That is the first thing the $600 build fixes, because it is
the cheapest source of both new bookings and local search rank.

## 2. What the site must do (acceptance)

- Enquiry lands on Tricia's phone in under 10 seconds, with name, phone, date,
  guest count and event type in a fixed order she can read at a glance.
- The quote form never claims to have sent anything it did not send: it opens
  her messaging app (SMS) or copies the text. No fake "message sent" state.
- Every page has a call button; on mobile the number is tappable in the header,
  the hero, the contact block and the footer.
- The grazing table — the $2,000–$3,500 product — is the first CTA, because it
  is the highest-value order and currently has no enquiry route at all.

## 3. Content workflow (so the site stays alive)

| Cadence | Who | Action |
|---|---|---|
| Per event | Tricia / Garrett | 5 phone photos: table wide, 3 details, host or guests (with permission). Add to `site/img/` and to Google Business Profile |
| Weekly | Garrett | One Google Business Profile post (photo + one line + price floor) |
| Weekly | Garrett | One Instagram post or Reel from the same photo set; repin to Pinterest in a vertical crop |
| Monthly | Garrett | Check Search Console queries, add one FAQ answer for the top new query |
| Monthly | Garrett | One-screen report to Tricia: calls, quotes, bookings, best photo |

## 4. Tools and accounts

- Hosting: Vercel (project `charcuterie-chick-showcase`), deploy command in `README.md`
- Domain: `charcuteriechick.ai` — already hers, on Shopify today
- Messaging: SMS from her phone (no paid SMS service, deliberately)
- Google Business Profile: needs claiming/updating on the $600 build
- Analytics: **none installed on purpose** (speed + privacy). If she wants
  numbers, add a lightweight counter and log it here first
- Payments: hers, untouched by us

## 5. Do not build without checking

- No online payment, no deposit-taking, no booking calendar — she prices by hand
  and takes payment her own way. Adding those would break her process.
- No chatbot, no "AI assistant", no automated replies. The brand is Tricia, and
  the client's explicit instruction is no AI anything in front of customers.
