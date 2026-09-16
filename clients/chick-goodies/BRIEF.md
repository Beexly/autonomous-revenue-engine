# BRIEF — Charcuterie Chick

Captured 2026-09-15 from the client. Their words are quoted; the criteria under
each are what "done" means for us.

## What they asked for, in their words

> "same logo, same about me, real metrics, real call to actions, real workflows,
> cleaner and more high res pictures, elegant feel overall — NO AI FEEL, NO AI
> FONTS, NO AI JUNK — THIS NEEDS TO BE SEO OPTIMIZED, MADE FOR HIGH TRAFFIC,
> MADE TO BE SEEN, MADE TO BE FOUND BY SEARCH ENGINES AND SOCIAL MEDIAS"

## Acceptance criteria

| # | Requirement | Done when |
|---|---|---|
| 1 | Same logo | `site/img/logo.png` (cropped from the owner-supplied wordmark) is in the header, undistorted, legible at 44px tall |
| 2 | Same about | Her existing about copy is the base; nothing invented about Tricia; the 35-years claim is the anchor |
| 3 | Real metrics | No template stats. Stat block shows only facts from `FACTS.md`; real business metrics added once Tricia supplies them |
| 4 | Real CTAs | Every button does something now: `tel:` call, SMS composer, gallery anchors. No dead buttons, no "coming soon" |
| 5 | Real workflows | Site side matches `WORKFLOWS.md`: enquiry in → acknowledgment → quote → booking. Nothing promised that does not exist behind it |
| 6 | Cleaner, higher-res pictures | Real photos only, used at or under native size, no upscaling, consistent 2:3 crops. **Blocker:** her real photos max out at 480×640 — new photography is a required deliverable (see `ASSETS.md`) |
| 7 | Elegant feel | Editorial type, cream/olive/gold palette, generous whitespace, no gradients or glass |
| 8 | No AI feel / fonts / junk | No AI images (see quarantine list), no AI-flavoured typefaces, no emoji, no lorem, no template placeholders anywhere |
| 9 | SEO optimised | Unique title + meta description, one `h1`, heading hierarchy, canonical, OG/Twitter cards, LocalBusiness + Menu + FAQPage JSON-LD, sitemap, robots, descriptive alt text, NAP consistent with Google Business Profile |
| 10 | Made to be seen / high traffic | Google Business Profile live and posting, Instagram/Facebook/Pinterest funnel to the site, review requests wired into the event workflow, page speed budget met |
| 11 | Found by social | OG/Twitter previews correct, shareable per-platform images, Pinterest-friendly vertical crops of the gallery |

## Rules for anyone building this

- The client is in Tomball, Texas. Copy is American English, plain, warm, short
  sentences. No agency voice, no jargon, no exclamation marks.
- Never invent a price, a rating, a guest count or a review. `FACTS.md` or nothing.
- Never "AI" anything in front of this client — not in copy, not in image
  credits, not in file names that could ship.
- Keep the build a static page. No framework, no build step: it must stay
  editable by hand and load fast on a phone in a parking lot.
