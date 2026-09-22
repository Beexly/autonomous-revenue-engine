# SAMPLES — current (2026-09-16)

> **Superseded 2026-09-17 on one point:** Garrett presents all three samples and Tricia picks. Do not read the "sample 3 only" lines below as current. The current handoff is `STATE.md`, then `PROMPT-BUILDERS.md`, then `PLAN-CONTENT-STRATEGY.md`. The owner verdicts, design bans and photography ceiling below still apply.

Owner verdict: sample 3 is the direction. Samples 1 and 2 are experiments,
not the pitch. **No proposal section on any live URL.**

## Live (canonical)

- **The site:** https://charcuterie-chick-sample-3.vercel.app
- **Showcase (same build, no proposal):** https://charcuterie-chick-showcase.vercel.app

Ignore sample-1 and sample-2 unless the owner reopens them.

## What sample 3 is

Numbered 01–05 spreads (each layout different), then a live quote whose
headline is the dollar total. Noma ink `#29382b` / paper `#f9f9f3`. Photos
`object-fit: contain` (EMP token). Engine math from `FACTS.md`.

## Logo

- Heritage: `img/logo.png` (The Chick Goodies, as supplied).
- Dark-bg knockout: `img/logo-paper.png` (white mark, transparent).
- Ink mark: `img/logo-ink.png`.
- Site lockup (new, not AI): plate mark + CHARCUTERIE / *Chick*. Owner asked
  to keep the original and revise it for the site. Do not invent a cartoon chick.

## Shared JS

- `engine.js` — prices, SMS/mailto
- `quiet.js` — slideshow (unused on 3) + form hook
- Do not put a Beexly proposal on the page.

## Facts

`FACTS.md` is the only source of prices, phone, email, reviews. Do not invent.

## Deploy

```bash
cd clients/chick-goodies/samples/sample-3-studio
vercel deploy --prod --yes
# also deploy clients/chick-goodies/site to charcuterie-chick-showcase
```
