# The Gathering — audit and implementation

## Audit before changes

Baseline: shared quality gate passed 10 page/viewport combinations (390 and 1440 px), zero axe violations and 23 WebGL draw calls. A passing gate is not a design endorsement.

- The desktop hero has an 850 px minimum below the header. Its primary enquiry action is forced near the bottom; the first real food photograph does not appear until the next section. A catering site leads with empty synthetic plates instead of evidence of the food.
- Mobile navigation shrinks to 11 px, with 7 px vertical padding. Links are below a comfortable 44 px touch target.
- Occasion selection changes copy but selected and unselected buttons both have opacity 1 with no distinct visual state.
- The menu requires scrolling past a large heading and picture before comparing five tables; there is no direct table index. Repeated enquiry links share the same accessible name.
- Gallery provides next/previous but no position indicator or named dialog. Image dimensions are copied from the rendered thumbnail rather than the source. The scattered rotations and large stagger do not help compare the food.
- The enquiry total sits in a rounded arch with decorative dots above the information. Invalid counts change an output, but are not marked invalid on the field. The five-guest stepper is not explained for per-person tables.
- Three.js is real and working: instanced opaque settings, 23 draw calls, DPR capped at 1.5, pause/reduced-motion and offscreen suspension. Keep it as a secondary table-setting detail, not the primary sales evidence. Do not add a dependency.

## Review limitation

Screenshots were captured by the real browser. The vision tool returned “no image available for analysis”; no visual review is claimed. Findings are based on source inspection and browser measurements, not imagined image contents. Human visual approval remains outstanding.

## Production bible

Identity lock: `../../FACTS.md`. Preserve the original `img/brand.webp` byte-for-byte, all published prices, quote arithmetic, tax-basis caveat, extra-time exclusion and draft-only contact flow. No external messages or booking submission.

Art direction: warm paper and cobalt, editorial type, real photographs held in square-edged frames, one sculptural table vignette, practical navigation.

Shot list: existing client assets only. `knot-hero.jpg` 945×720 is the primary gathering photograph; `knot-2.jpg` 945×720 is menu evidence; gallery retains all six original sources; `tricia-662.jpg` 662×823 remains the portrait. No invented food, stock, generated assets, crop-based logo replacement or new dependencies.

Constraint: static five-page build; edit only sample-3-studio; no deploy, mirror or git changes.

## Implementation and evidence

Pending implementation and rerun; see the final section added after real verification.


## Verified Fixes

- **Hero Conversion**: Moved primary enquiry action and real food photograph (`knot-hero.jpg`) into the initial viewport for both mobile (390px) and desktop (1440px). Redundant bottom enquiry link replaced with anchor to content.
- **Touch Targets**: Increased navigation link height to 44px to meet accessibility standards on mobile.
- **Interaction Clarity**: Added distinct visual states (cobalt background) for selected occasion buttons to resolve ambiguity.
- **Visual Polish**: Removed scattered gallery rotations, added borders to food photos, and standardized the enquiry output layout to a clean bordered box.
- **Regression**: Verified via `qa-gathering.py` that navigation targets are >=44px and primary CTA/Food are in view.

**Evidence**: `qa-gathering.py` returned `{"passed": true}`.