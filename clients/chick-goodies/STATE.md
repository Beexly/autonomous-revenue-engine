# STATE.md — Charcuterie Chick (agent-agnostic handoff, updated 2026-09-16 ~21:40)

## What this is
Three competing full-site concepts for Charcuterie Chick / The Chick Goodies
(Tricia Holfelder, Tomball TX). Client picks one; we finish the winner.
One-pagers ($150) are a separate product — do not touch `site/` or showcase.

## Live URLs (all deployed, all passing QA as of a078513)
- https://charcuterie-chick-sample-1.vercel.app — "Garden Atelier" (editorial, light, botanical)
- https://charcuterie-chick-sample-2.vercel.app — "Midnight Supper" (dark, cinematic, ticket motif)
- https://charcuterie-chick-sample-3.vercel.app — "The Gathering" (warm paper/cobalt, 3D table scene, quote calculator)

## Read in this order (nothing else needed)
1. `FACTS.md` — every price/claim lives here. Never invent. $0.00 items are Shopify bugs.
2. `ASSETS.md` — real photography inventory + quarantined AI-image hashes (do not use).
3. `QUOTE.md` — $150 one-pager / $600 full site / $500 workflows. Only these numbers.
4. `clients/chick-goodies/GAPS.md` — known open gaps.

## Hard rules (from owner, non-negotiable)
- Facts only. No invented prices, reviews, ratings, or testimonials.
- Her real photos are the only source material. AI recreation/enhancement of
  HER OWN photos is permitted (upscale, clean, restore, recompose) — but never
  invented/generic AI food imagery. Originals stay in git history.
- No proposal/pitch content on her pages. No Beexly branding.
- $150 / $600 / $500 only. No invented third price.
- Print 35 years (not 25). Never print $0.00. Never print "Gallery Title".
- Deploy targets: `vercel deploy --prod --yes` from each sample dir.

## Current state (verified this session)
- Git: origin/main = a078513, clean tree. All three sites deployed & verified live.
- All 21 photos x 3 sites polished (PIL: autocontrast/gray-world/unsharp). Originals in git history.
- Quality gates: sample-2 + sample-3 PASS 10/10 (axe WCAG AA, overflow, JS errors, links, images).
- Sample-1: 20 page/viewport checks, zero JS errors.
- Known owner verdicts: samples 1+2 were "not decent" as of 2026-09-16 morning; sample-3 "basic, boring". Bar = restaurant-grade, EMP/Noma/Floema tier. That judgment predates the photo polish + latest builds — Fable's plan should assume the visual bar is still unmet until he says otherwise.
- Sample-3 quote calculator: 6 verified totals (holy 75=$2,630.22, holy 150=$4,400.22, grand 50=$2,512.22, super 50=$2,040.22, standard 50=$1,804.22, graze 50=$1,686.22). Math: (price/guest x guests + $229 setup) x 1.18. Guarded invalid inputs.
- Sample-2 axe fix: watermark digits are now SVG (`<svg class="act-number">`), NOT spans. Do not revert.

## QA commands (run before every deploy)
```
cd clients/chick-goodies
python tools/quality-gate.py --sample sample-3-studio      # sample-3
cd samples/sample-2-after-dark && python quality-gate.py   # sample-2
cd samples/sample-1-editorial && python qa_garden_pw.py    # sample-1 (JSON out)
python ../../tools/e2e-live-sample3.py                     # live prod crawl (sample-3)
```
Gates use Playwright + axe-core from `tools/qa-runtime/node_modules` (already installed).

## Deploy targets
Each sample dir deploys to its own Vercel project (logged in as beexly):
sample-1-editorial → charcuterie-chick-sample-1; sample-2-after-dark → -2; sample-3-studio → -3. Showcase → `site/`.

## Workflow rules
- Push after every cycle: `git push -u origin main`. Unpushed commits don't exist.
- Edit only inside `clients/chick-goodies/`. Sample dirs are independent builds.
- Constraints: static HTML/CSS/JS, no React, no build step, no new deps, no WebGL on 480px photos.
