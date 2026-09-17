# STATE.md — Charcuterie Chick (agent-agnostic handoff, updated 2026-09-17 evening)

## What this is
Three competing full-site concepts for Charcuterie Chick / The Chick Goodies
(Tricia Holfelder, Tomball TX). Garrett presents all three. Client picks one; we
finish the winner. One-pagers ($150) are a separate product; do not touch `site/`
or the showcase. `HANDOFF.md` and `SAMPLES.md` still say "sample 3 only". That
is superseded by this file.

## Live URLs (all deployed; content pass applied, layout pass pending)
- https://charcuterie-chick-sample-1.vercel.app — "Garden Atelier" (editorial, light, botanical)
- https://charcuterie-chick-sample-2.vercel.app — "Midnight Supper" (dark, cinematic, ticket motif)
- https://charcuterie-chick-sample-3.vercel.app — "The Gathering" (warm paper/cobalt, 3D table scene, quote calculator)

## Read in this order (nothing else needed)
1. `PROMPT-BUILDERS.md` — who does what, in what order, and what done means.
2. `PLAN-CONTENT-STRATEGY.md` — sections 8 (design bar) and 9 (verified defects and gates) first, then 2.0 (shared copy blocks), then the rest.
3. `FACTS.md` — every price/claim lives here. Never invent. $0.00 items are Shopify bugs.
4. `ASSETS.md` — real photography inventory + quarantined AI-image hashes (do not use).
5. `QUOTE.md` — $150 one-pager / $600 full site / $500 workflows. Only these numbers.
6. `GAPS.md` — known open gaps.

## Hard rules (from owner, non-negotiable)
- Facts only. No invented prices, reviews, ratings, or testimonials.
- Her real photos are the only source material. AI recreation/enhancement of
  HER OWN photos is permitted (upscale, clean, restore, recompose); never
  invented or generic AI food imagery. Originals stay in git history.
- No proposal/pitch content on her pages. No Beexly branding.
- $150 / $600 / $500 only. No invented third price.
- Print 35 years (not 25). Never print $0.00. Never print "Gallery Title".
- No booking, no availability promise, no response-time promise. Quote requests only.
- Deploy targets: `vercel deploy --prod --yes` from each sample dir.

## Current state (verified 2026-09-17 evening, live render of all 15 pages at 390/1440/1920)
- Git: origin/main = cab0c4b plus this handoff commit. Content plan merged (PR #49).
- Applied on all three: nav relabel, first-person copy, proof blocks, FAQ, quote-flow
  field order, shared footer, title tags, canonical + OG, sitemaps.
- Not applied: the 15 meta descriptions (old text still live; sample 3 repeats one
  meta on five pages). Mood captions still live on every gallery and on the heroes.
  Full list: plan 9.1.
- Layout defects that block presentation: sample 1 has nine (intro padding, gallery
  wall collapse, nav wrap, fixed scroll note over the photo, narrow hero column,
  ring and thread over content, clipped oval caption, stacked menu panels, price
  label spacing). Sample 3 has five (hero photo over copy, 3D scene under the
  buttons on phones, detached proof line, mood captions, invisible "See it larger"
  pill). Sample 2 has caption leftovers only. Full list with causes: plan 9.2 to 9.4.
- Sample-3 quote calculator: 6 verified totals (holy 75=$2,630.22, holy 150=$4,400.22,
  grand 50=$2,512.22, super 50=$2,040.22, standard 50=$1,804.22, graze 50=$1,686.22).
  Math: (price/guest x guests + $229 setup) x 1.18. Guarded invalid inputs.
- Sample-2 axe fix: watermark digits are SVG (`<svg class="act-number">`), not spans. Do not revert.
- Owner verdicts on record: samples 1 and 2 "not decent" (2026-09-16 morning), sample 3
  "basic, boring". Bar = restaurant grade, EMP/Noma/Floema tier. The design bar that
  makes this testable is plan section 8.

## QA commands (run before every deploy)
```
cd clients/chick-goodies
python tools/quality-gate.py --sample sample-3-studio      # sample-3
cd samples/sample-2-after-dark && python quality-gate.py   # sample-2
cd samples/sample-1-editorial && python qa_garden_pw.py    # sample-1 (JSON out)
python -m unittest -v test_content test_content_browser    # in each sample dir
python ../../tools/e2e-live-sample3.py                     # live crawl (extend to all three hosts)
```
Gates use Playwright + axe-core from `tools/qa-runtime/node_modules` (already installed).
Presentation gates (G1 to G6) are defined in plan 9.5.

## Deploy targets
Each sample dir deploys to its own Vercel project (logged in as beexly):
sample-1-editorial → charcuterie-chick-sample-1; sample-2-after-dark → -2; sample-3-studio → -3. Showcase → `site/`.

## Do next, in order
1. Builders run `PROMPT-BUILDERS.md` steps 1 to 4 (mechanical, layout, gates, report).
2. Garrett runs the presentation gate (plan 9.6) on a phone and a laptop, then sends the three links.
3. Client picks. Winner gets: photo restoration under the owner's rule, structured data
   validation, the `[NEEDS TRICIA]` copy once she confirms, WebGL only if the owner asks.

## Workflow rules
- Push after every cycle. Unpushed commits don't exist.
- Edit only inside `clients/chick-goodies/`. Sample dirs are independent builds.
- Constraints: static HTML/CSS/JS, no React, no build step, no new deps, no WebGL on 480px photos.
