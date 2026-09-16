# SAMPLES — three art directions

Three complete builds of the same site, same facts (`FACTS.md`), same photos, no
shared CSS. The client asked for "elegant" and nothing else, so the three differ
in art direction, layout system and typography — not in content. Present all
three, let them pick, then merge the winner.

| # | Folder | Live | Direction | Type |
|---|---|---|---|---|
| 1 | `sample-1-editorial/` | https://charcuterie-chick-sample-1.vercel.app | Warm editorial on cream — magazine columns, cards, hints of olive and gold, full proposal page at the end | Fraunces + Source Sans 3 |
| 2 | `sample-2-after-dark/` | https://charcuterie-chick-sample-2.vercel.app | After dark — near-black room, brass hairlines, restaurant-menu dotted leaders, filmstrip gallery, drop cap | Cormorant Garamond + Karla |
| 3 | `sample-3-studio/` | https://charcuterie-chick-sample-3.vercel.app | Studio — white, numbered sections, sticky left rail, tabular price table, uneven photo grid | Archivo (single family) |

Old stable demo URL (sample 1, still live): https://charcuterie-chick-showcase.vercel.app

## What is shared by all three

- Content: `FACTS.md` only. Same prices, tiers, reviews, FAQ, NAP.
- Photos: her own, from `site/img/` — no AI imagery, no stock.
- SEO: unique title, meta description, canonical, OG/Twitter, JSON-LD
  (CateringService + Menu + FAQPage), descriptive alt text, image dimensions,
  `robots.txt`, `sitemap.xml`.
- CTAs: `tel:` call, an SMS quote composer (message built from the form fields,
  copy-to-clipboard fallback), anchors. No dead buttons.
- No AI-flavoured type (no Inter / Poppins / Montserrat / Space Grotesk), no
  gradients, no glass, no drop shadows, no emoji, no rounded "card" clutter.

## Building and deploying one

Images are not duplicated per sample in git. They live in `site/img/` and are
rebuilt from source photos by `tools/prep_assets.py`. To deploy a sample:

```bash
# from a scratch dir, assemble index.html + img/
mkdir -p /tmp/sample && cp clients/chick-goodies/samples/sample-2-after-dark/index.html /tmp/sample/
cp -r <path-to-built-img> /tmp/sample/img      # site/img/ as built by prep_assets.py
cd /tmp/sample && vercel deploy --prod --yes --name charcuterie-chick-sample-2
```

Local working copies with images already in place:
`C:/Users/Garrett/chick-samples/{sample-1-editorial,sample-2-after-dark,sample-3-studio}/`

## Rules when editing a sample

1. **Do not blend the directions.** If you are editing sample 3, it stays
   Archivo-only with hairlines and no serif. Each one has to look like a
   different studio made it, or the client sees three versions of the same page.
2. Sample 1 carries the proposal page (`#proposal`) — samples 2 and 3 are pure
   site samples, deliberately.
3. Keep the type families exactly as listed in the table above; the client's
   complaint was that the earlier build "looks like AI", and generic UI faces
   are the fastest way back there.
4. If you change a price, change `FACTS.md` first, then all three samples.
