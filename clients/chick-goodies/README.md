# Charcuterie Chick — client file

**Client:** Tricia Holfelder · Charcuterie Chick (also "The Chick Goodies")
**Where:** 11931 Brantley Haven Drive, Tomball, TX 77375 · 832-458-8180
**Live site:** https://www.charcuteriechick.ai (Shopify)
**Our demo:** https://charcuterie-chick-showcase.vercel.app
**Owner of the relationship:** Garrett · **Status:** quoted, awaiting yes (as of 2026-09-15)

---

## What this folder is

Everything an agent needs to work this client without re-scraping, re-guessing, or
re-inventing. Read in this order:

| File | What it holds |
|---|---|
| `BRIEF.md` | What the client asked for, in their words, plus the acceptance criteria |
| `FACTS.md` | **Single source of truth** for every number, price and claim. If a value is not here, do not print it |
| `AUDIT.md` | Findings against their live Shopify site, with evidence lines |
| `QUOTE.md` | What was quoted and what each number includes |
| `SAMPLES.md` | The three art directions, live URLs, and the rules that keep them distinct |
| `SEO.md` | The discovery plan: local SEO, schema, Google Business Profile, social |
| `WORKFLOWS.md` | The enquiry → quote → booking workflow the site is supposed to feed |
| `ASSETS.md` | Every image we hold: provenance, real resolution, what is banned |
| `site/` | The working build (plain HTML + real photos), deployable as-is |
| `samples/` | Three complete builds of the same site in three art directions |
| `tools/prep_assets.py` | Rebuilds `site/img/` from source photos and swaps the phone token |

## Three samples, one content set

The client was promised three samples and said only "elegant". All three are
live, built from the same `FACTS.md` and the same photos, with no shared CSS:

1. **Warm editorial (cream)** — https://charcuterie-chick-sample-1.vercel.app
2. **After dark (near-black + brass)** — https://charcuterie-chick-sample-2.vercel.app
3. **Studio (white, numbered, tabular)** — https://charcuterie-chick-sample-3.vercel.app

Stable demo, same build as sample 1: https://charcuterie-chick-showcase.vercel.app
Details and the do-not-blend rules: `SAMPLES.md`.

## The deal on the table

- **$150** — the one-pager (what is built now), live in 2 days.
- **$600** — the full site on their domain, search-optimised, in 7 days.
- Scope and terms: `QUOTE.md`.

## Deploy / preview

```bash
cd clients/chick-goodies/site
vercel deploy --prod --yes          # project: charcuterie-chick-showcase
```

Canonical currently points at the vercel demo URL. On the paid build, switch
`<link rel="canonical">`, `og:url`, the JSON-LD `@id`/`url`/`image` values and
`robots.txt`/`sitemap.xml` to `https://www.charcuteriechick.ai/`.

## Hard rules (do not break these)

1. **No AI-generated imagery, no stock photos.** The client's complaint is "no AI
   feel, no AI junk". Four Grok Imagine files exist in the Beexly Grok workspace
   (`public/chick/{board,cart,cups,graze}.jpg`) and are byte-identical to
   `artifacts/imagine_images/*` — they are quarantined in `ASSETS.md` and must
   never appear in a client-facing build.
2. **No AI-looking type.** Display = Fraunces, body = Source Sans 3. Do not
   introduce Inter / Poppins / Montserrat / Space Grotesk, gradients, glass
   cards, or emoji.
3. **Real facts only.** Prices, minimums and copy come from `FACTS.md`.
4. **Phone number is public** (it is on their site) — it is written into files by
   `tools/prep_assets.py` from the `832-458-8180` / `18324588180` tokens.

## Open owner inputs

- Real metrics for the stat block (events catered, repeat clients, guests served) —
  only Tricia has these. Template numbers are currently replaced with verified
  facts (35 years / 90 minutes / 50-guest minimum / 150-guest capacity).
- Her email address for the quote form (form currently composes an SMS).
- Confirmation that 832-458-8180 is the right line.
- Whether `IMG_7724.jpeg` is the logo she means (see `ASSETS.md`).
