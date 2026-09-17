# HANDOFF — Charcuterie Chick (read this first)

> **Superseded 2026-09-17 on one point:** Garrett presents all three samples and Tricia picks. Do not read the "sample 3 only" lines below as current. The current handoff is `STATE.md`, then `PROMPT-BUILDERS.md`, then `PLAN-CONTENT-STRATEGY.md`. The owner verdicts, design bans and photography ceiling below still apply.

You are taking over from grok-4.6 on Garrett’s machine. He is switching to
OpenRouter `stealth/union-alpha`. Do not recap this file back to him. Open
the live URL, then work.

## Who / what

- Client: Tricia Holfelder, Charcuterie Chick / The Chick Goodies.
- Tomball TX. Phone 832-458-8180. Email charcuteriechick@outlook.com.
- Live Shopify (broken, do not clone as the deliverable): https://www.charcuteriechick.ai
- Repo: `github.com/Beexly/autonomous-revenue-engine` — `clients/chick-goodies/`
- Quote: **$150** one-pager / **$600** full site on her domain. `QUOTE.md`.
- Facts only: `FACTS.md`. No invented prices, ratings, or reviews.
- No AI images. Quarantined Grok Imagine hashes in `ASSETS.md`.
- Static HTML, Vercel hobby, no React, no WebGL on 480px photos.

## Live (this is the job)

- **The site:** https://charcuterie-chick-sample-3.vercel.app
- **Showcase (same build):** https://charcuterie-chick-showcase.vercel.app
- **Proposal is forbidden.** He told you to remove it. It is gone. Do not put it back.

Samples 1 and 2 exist on Vercel. He called them not decent. Do not pitch them.

## Owner verdicts (do not re-litigate)

1. Three skins of one layout = failure. He said it more than once.
2. Kit lawn/HVAC/roofing clones = failure. Density without restaurant craft.
3. Thin Unseen “click and hold” = failure.
4. EMP/Noma token pass: **only the numbered sample (3) was decent**, and even
   that is “basic, boring, lame, not creative, not unique, not beautiful.”
5. Keep her original logo AND revise it for the site. Current: heritage
   `logo.png` / knockout `logo-paper.png` on the cover; new plate +
   CHARCUTERIE / *Chick* lockup. Not a cartoon chick. Not AI.
6. Direction: **to the moon.** Restaurant-grade. Not a template. Not a SaaS
   form. Not a catering WordPress theme.

## What “to the moon” means here

He pasted the bar. Use it. Clone-website skill: **getComputedStyle**, not vibes.

Restaurant / editorial (restraint + photography):
- elevenmadisonpark.com — photo IS the site. EB Garamond 21.04px, Nobel 17.68px
  uppercase, `object-fit: contain`, 0.67px rules. Tokens in
  `docs/research/emp-noma/PLAN.md` (extracted live 2026-09-16).
- noma.dk — a letter, Reckless 18/32.4, `#f9f9f3` / `#29382b`, Book a table
  30px / 19.5×42×19.5×30 padding, 0.67px solid.
- le-bernardin.com — classic, reservation-first.
- floema.com/en — numbered 01–05, spaced type, scroll to explore.
- heirloomla.com — event photography as the product.

Catering that converts:
- The Platter (Framer) — live quote calculator (we have this; the **number**
  should be the design, not a stacked form).
- Verde Studio — dark cinematic, full-bleed table.
- cleverchefs.co.uk, vacherin.co.uk, cateringbyprovisions.com, cacao.

Do **not** drop WebGL (oryzo, basement.studio, hubtown) on her 480–945px
photos. Soft upscales look worse.

## Photography ceiling (do not fight it)

Public files max **480×640** except Knot shots ~945×720. Show as objects.
`object-fit: contain` on a void. Do not cover-stretch 480px into 100vh.

## Skills that apply

- `clone-website` — extract px, then build. Do not guess Tailwind.
- `cinematic-production-discipline` — bible (`FACTS.md` + `ASSETS.md`) first.
- `prospect-site-rebuild-pitch` — validate HTML, curl every asset, 200 + bytes.
- `claude-design` — Decide/Learn. No 3 equal cards. No monument stats.

## How to work

```bash
cd clients/chick-goodies
# read FACTS.md BRIEF.md SAMPLES.md ASSETS.md
# edit samples/sample-3-studio/  then copy to site/
vercel deploy --prod --yes   # from sample-3-studio AND from site/
git add … && git commit && git push -u origin HEAD
```

After every cycle: push. Commits that do not reach origin do not exist.

## Do not

- Rebuild sample 1 or 2 unless he asks.
- Put a Beexly proposal, pricing, or “what’s wrong with Shopify” on her page.
- Use Inter candy buttons, Kit dual-cursor, marquee, grain, Anton stroke type.
- Invent a third quote price. $150 / $600 only.
- Print 25+ years (her copy is 35). Print $0.00. Print Gallery Title.
- Call the work done because the HTML validator passed.

## Next move

Open sample 3. Make **that one URL** a masterpiece: unique compositions,
revised lockup that still feels like her, photography treated like EMP/Noma,
quote that feels like booking a table not submitting a form. He will say if
it is still basic. Believe him and go again.
