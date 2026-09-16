# SEO + DISCOVERY — Charcuterie Chick

Goal: when a bride, an office manager or a party planner in northwest Houston
searches, Charcuterie Chick is findable — and when someone sees the link on
Instagram, it looks like a business, not a template.

## 1. Search targets (use these phrases in copy, titles and alt text)

Primary:
- charcuterie catering Tomball TX
- grazing table Tomball / The Woodlands
- charcuterie boards Tomball
- catering near me Tomball (Google Business Profile does the heavy lifting here)

Secondary:
- grazing table wedding The Woodlands
- corporate catering Spring TX
- bridal shower catering Conroe
- charcuterie cart hire Houston northwest
- baby shower grazing table Magnolia / Cypress / Klein

Long-tail (each becomes a FAQ answer or a blog post):
- how many people does a grazing table feed
- grazing table cost per person
- charcuterie table minimum guests
- what to serve at a shower that is not a full meal

## 2. On-page — done in the current build

- Unique title + meta description with city, phone and price floor
- One `h1`, section `h2`s, item `h3`s — no skipped levels
- Canonical, `robots`, `max-image-preview:large`
- Open Graph + Twitter cards with a real event photo
- JSON-LD `@graph`: CateringService/FoodEstablishment (NAP, geo, areaServed,
  priceRange, hasMenu) + FAQPage
- Descriptive alt text on all 20 images, `width`/`height` on every image so the
  layout does not shift, `loading="lazy"` below the fold, hero preloaded
- Visible NAP in the footer, matching the address and phone on Google
- Service-area section naming six cities
- `robots.txt` + `sitemap.xml`

## 3. Still to do on the $600 build

- Point canonical/OG/JSON-LD/sitemap at `https://www.charcuteriechick.ai/`
- Add a per-item menu page later (Shopify products are currently the only menu
  surface, and they carry the $0.00 bug)
- Submit the sitemap in Google Search Console and Bing Webmaster Tools
- Google Business Profile: claim, correct hours, add the 20 real photos, list
  services with prices (grazing tables, carts, boards), enable messaging, and
  post weekly. This is the single highest-return item for local search
- Review workflow: ask every event host for a Google review (see `WORKFLOWS.md`)
- Blog: revive the three existing posts with real dates and internal links; the
  pager bug has to be fixed first
- Image work: real photos only; vertical crops for Pinterest, square for
  Instagram, 1200×630 for link previews
- Page speed: keep it static, no JS frameworks, no web-font bloat (two families,
  `display=swap`)

## 4. Social → site funnel

| Surface | Job | What to post | Link strategy |
|---|---|---|---|
| Google Business Profile | Capture "near me" intent | Real event photos weekly, hours, services with prices | Link to site + call button |
| Instagram | Show the work, build want | Reels of table builds, before/after styling, tagged venues | Link in bio to the site; DM CTA "quote" |
| Facebook | Local groups + events | Event albums, community group posts, party-planning tags | Site link per post |
| Pinterest | Long-tail search (weddings, showers) | Vertical crops, titles like "Grazing table for 75, Tomball TX" | Every pin to the site |
| TikTok | Reach | 20–40s cart/table setup clips | Bio link |

Rule: one real photo set per event, reused across all five surfaces with the
right crop and honest caption. No stock, no AI imagery — the whole point is that
the food is hers.

## 5. Measuring it

- Google Business Profile: calls, direction requests, site clicks (weekly)
- Search Console: impressions/queries for the primary terms (monthly)
- Site: quote-form submissions and `tel:`/`sms:` taps (add a lightweight counter
  once she is on the paid build — currently no analytics is installed, by choice)
- Report to Tricia monthly in one screen: calls, quotes, bookings, top photo
