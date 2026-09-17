# PROMPT — Opus, round two: warm up concept 1, finish the immersive, get four links send-ready

You are Opus, design lead on `clients/chick-goodies`. Garrett is away and wants no questions. Round one made the three samples presentable. Round two has two workstreams and one checklist. Same rules as `PROMPT-OPUS.md` sections 2, 3, 5, 6 and 7. Read `PLAN-CONTENT-STRATEGY.md` sections 10 and 11 first; they are the brief.

## Workstream A: concept 1 as a small-town boutique (plan section 10)

Sample 1 is live and passes the gates, so this work happens on a branch and deploys only when the gates pass again. Order:

1. Tokens (10.2 rule 1). Pick the accent by holding oxblood and olive against `img/knot-hero.jpg` and the cart photo. Freeze the token sheet at the top of `garden.css`.
2. Type scale (rule 2). Every size on the page resolves to the scale.
3. Photographs and frames (rule 3). Kill the oval. One full-bleed band per page. Middle dot between caption numeral and words.
4. Menu card block on home and menu (rule 5). Name, dotted leader, price, contents.
5. Pantry block on home and story (rule 6), copy as written in 10.2 and 10.3.
6. Story page as a feature (rule 7): portrait restored under the owner's rule (grid removed, 4:5, monochrome), three movements with the copy as written, then pantry, full-bleed table, guest book (rule 8).
7. Chrome and footer (rule 10). One button style. Espresso footer band.
8. Gates G1 to G6 (plan 9.5), then deploy, then re-crawl live.

Test for done: put the home page next to the Midnight Supper home page. If concept 1 still looks like the pale one rather than the warm one, it is not done. Do not add ornament to fix that. Add photographs, size and color.

## Workstream B: the immersive page (plan section 11)

Work in `sample-3-studio`. It deploys with the branch. Order, by plan 11.3 item number:

1. Item 6: fix the 390 nav overflow (the row must wrap or collapse) and the 24px overflow at 1440. Run the overlap and gutter gates on `table.html`.
2. Item 7: H1 to "Elegance without the cost."
3. Item 2: capture the scene at 1440 as a still (a real render of this scene, exported as an image), use it as the hero on phones and under reduced motion, with the same copy. Feature-detect WebGL; never sniff user agents.
4. Item 3: a photograph band with her real photos as `img`, literal captions, alt text.
5. Item 4: the calculator from `enquire.html`, restyled dark, the total in the serif at display size, under "The number".
6. Item 1: restyle `enquire.html` to the immersive tokens first, then `menu.html`, then `story.html`, so no link leaves the scene for a blue page.
7. Item 5: measure the compressed transfer of `vendor/three.module.js` and time to visible hero on a throttled 4G profile at 390; minify or trim; the headline renders before the module loads.
8. Item 8: restore the card photos under the owner's rule; commit originals first.
9. Gates G1 to G6 on `table.html` and the restyled pages, at 390, 768, 1440, 1920.

No modeled food on the table, abstract or otherwise: Garrett rejected the sphere-and-board dressing as cartoonish on 2026-09-17. The food is her photographs: eleven cut-outs (`img/cut/*.webp`, her boards, cones, drinks, the skillet and the cart, backgrounds removed locally, nothing generated). Eight stand upright and turn to face the camera, one under every station; three boards lie flat on the runner; seven prints sit between them. The reference Garrett set for the feel is oryzo.ai by Lusion: one real object large in the frame, dark warm air around it, big type. `table-cinematic.js` and the two stills in `img/` carry this already. Never photoreal models, never generated food, never bring the props back.

## Workstream C: send-ready checklist

- Four links: sample 1, sample 2, sample 3, and `sample-3/table.html`.
- The client note lives in plan 11.4. Garrett sends it himself. Do not send anything to the client.
- `docs/PRESENTATION-REPORT.md` gains a round-two section: gates per site with evidence paths, the decision log, anything left open, and the stale line about `table.html` not being deployed corrected.
- Stop conditions and the report format are unchanged from `PROMPT-OPUS.md`.

## Time-boxing

Workstream A first, because its result changes the pitch. Then B. If B cannot be completed, items 1 to 4 of B make the preview honest enough to show, and the report says exactly which items remain. Nothing is marked green that was not run.
