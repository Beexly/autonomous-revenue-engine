# PRESENTATION-REPORT

Written 2026-09-17. Gates run from `clients/chick-goodies` unless stated.

Two gates could not be run in this environment. They are recorded as red, not
skipped, and the reason is stated. Nothing below is marked green that was not
run.

## Status in one line

All three samples are deployed and live with the corrected build. G1 to G5 pass;
G6 is deployed and verified, with one limitation stated below.

## How the deploy actually happened

The three sample projects are git-connected to this repository, each with its
own root directory. Earlier in this session I recorded them as manual uploads,
which was wrong, and wrote deploy instructions on that basis. They auto-deploy
from the branch.

On 800fb6f all three builds failed. The repository root vercel.json sets
outputDirectory to "docs". That directory exists at the repository root and not
inside a sample directory, so a project rooted at a sample had nothing to
publish. Under manual upload the config never applied; git-connected it did.

8cb4375 gives each sample its own vercel.json declaring a static passthrough,
and a .vercelignore keeping *.py, *.md, test-output, qa-evidence, qa-runtime and
__pycache__ off the host. All three builds went green on that commit.

The .vercelignore also closed a leak found earlier in this session. Before it,
GARDEN-BIBLE.md, MIDNIGHT-BIBLE.md, AUDIT-IMPLEMENTED.md, build_garden.py and
build_midnight.py all returned 200 from the live hosts. They now return 404.

## Sample 1 — Garden Atelier (`sample-1-editorial`)

| Gate | Command | Result | Evidence |
|---|---|---|---|
| G1 layout | `python3 tools/presentation-gate.py --sample sample-1-editorial` | GREEN, 0 problems | `samples/sample-1-editorial/test-output/presentation/` |
| G2 copy | same run | GREEN — 0 kill-list, gather 0, enquir 0 | same |
| G3 titles/metas | same run | GREEN — 5 titles, 5 metas, all match plan 4.1 | `tools/plan-4-1-metas.json` |
| G4 suites | `cd samples/sample-1-editorial && python3 -m unittest test_content test_content_browser` | GREEN — 6 tests OK | terminal |
| G4 suites | `cd samples/sample-1-editorial && python3 qa_garden_pw.py` | GREEN — JSON, `enquire-email-link-valid: true`, `navigation-history: true` | stdout JSON |
| G5 quote flow | presentation-gate run | GREEN — tel, sms, mailto present; `?menu`, `?table`, `?occasion` prefill | terminal |
| G6 deploy + live | git-connected auto-deploy on 8cb4375 | GREEN — live, byte-identical to the gated state | live byte comparison, 24 files |

Defects fixed, one commit each:

| ID | Was | Now |
|---|---|---|
| S1-1, S1-9 | `.page-intro{padding-top:110px}`, H1 at x=0 at 1440 and 1920 | centred 1000px container, 28px sides; text at 28 / 248 / 488px |
| S1-2 | `.specimen.oval` had no `grid-column`; both ovals 39px; wall capped at 680px by `.chapter` | spans tile 12 exactly (8+4, 6+6); wall 1200px; oval 372px at 1440 |
| S1-5 | hero copy column 334px, H1 in 7 lines | own 1200px container, 600px copy column, H1 in 3 lines at 1024/1440/1920 |
| S1-6 | purple ring, two ceramic blobs, diagonal thread over the hero photo | removed from markup and CSS (not hidden) |
| S1-7 | `.specimen figcaption` absolute over every photo; oval's `overflow:hidden` clipped its own caption | captions in flow under the frame; oval shape moved to the `img` |
| S1-4 | `.scroll-note{position:fixed}` printed over the hero photo at 390 and 768 | grid item in the hero copy column |
| S1-3 | five nav links wrapped 4+1 at ≤420, orphaning "Get a quote" | 3 columns under 480 → 3+2, measured at 360/390/420/480 |
| S1-8 | `PUBLISHED PRICE$24 per person`; five panels stacked under tab chrome | label `display:block` on its own line; tab row restyled as an index |

Not in the plan's list, same cause as S1-1, fixed: `.enquire-intro` also set
`padding-top` only and put its H1 at x=0 at 390.

## Sample 2 — Midnight Supper (`sample-2-after-dark`)

| Gate | Command | Result | Evidence |
|---|---|---|---|
| G1 layout | `python3 tools/presentation-gate.py --sample sample-2-after-dark` | GREEN, 0 problems | `samples/sample-2-after-dark/test-output/presentation/` |
| G2 copy | same run | GREEN | same |
| G3 titles/metas | same run | GREEN — 5 and 5, match 4.1 | same |
| G4 quality gate | `cd samples/sample-2-after-dark && python3 quality-gate.py` | GREEN — `passed: true`, 10 pages, `failures: []` | stdout JSON |
| G4 unittests | `python3 -m unittest test_content test_content_browser` | **RED — could not run** | neither module exists in this directory |
| G5 quote flow | presentation-gate run | GREEN | terminal |
| G6 deploy + live | git-connected auto-deploy on 8cb4375 | GREEN — live, byte-identical to the gated state | live byte comparison, 17 files |

S2-1 hero caption and S2-3 nav were already correct. S2-2 is the plan's
`THE CART. HOUSTON'S LARGEST.`; the S8 sweep overwrote it and it was restored.
One layout defect found and fixed that the plan did not list: the filmstrip's
instruction line had no gutter and started at x=0 at all four widths.
One content gap fixed: the quote page had no `sms:` link, which G5 requires and
the other two samples carry.

## Sample 3 — The Gathering (`sample-3-studio`)

| Gate | Command | Result | Evidence |
|---|---|---|---|
| G1 layout | `python3 tools/presentation-gate.py --sample sample-3-studio` | GREEN, 0 problems | `samples/sample-3-studio/test-output/presentation/` |
| G2 copy | same run | GREEN | same |
| G3 titles/metas | same run | GREEN — 5 and 5, match 4.1 | same |
| G4 quality gate | `python3 tools/quality-gate.py --sample sample-3-studio` | GREEN — `passed: true`, `failures: []` | `docs/research/gathering/qa-sample-3-studio/report.json` |
| G4 unittests | `cd samples/sample-3-studio && python3 -m unittest test_content` | GREEN — 4 tests OK | terminal |
| G4 unittests | `python3 -m unittest test_content_browser` | **RED — could not run** | module does not exist in this directory |
| G5 quote flow | presentation-gate run + direct measurement | GREEN — 6/6 totals reproduce | table below |
| G6 deploy + live | git-connected auto-deploy on 8cb4375 | GREEN — live, byte-identical to the gated state | live byte comparison, 17 files |

Six totals, measured on `#total` after setting `#table` and `#guests`:

| Table | Guests | Expected | Measured |
|---|---|---|---|
| holy | 75 | $2,630.22 | $2,630.22 |
| holy | 150 | $4,400.22 | $4,400.22 |
| grand | 50 | $2,512.22 | $2,512.22 |
| super | 50 | $2,040.22 | $2,040.22 |
| standard | 50 | $1,804.22 | $1,804.22 |
| graze | 50 | $1,686.22 | $1,686.22 |

S3-1, S3-2, S3-3 and S3-5 did not reproduce: the hero is already a two-column
grid with the photo in flow, and no "See it larger" pill exists in the markup.
S3-4 captions were applied by the S8 sweep. S3-6 was not changed.

## The three URLs

Live with the corrected build. Measured over HTTPS after the 8cb4375 deploy:
five pages up, five unique metas, zero kill-list strings on each.

- https://charcuterie-chick-sample-1.vercel.app — Garden Atelier
- https://charcuterie-chick-sample-2.vercel.app — Midnight Supper
- https://charcuterie-chick-sample-3.vercel.app — The Gathering

G2 and G3 were run against these hosts directly and are green on all three.

**The limitation on G6.** The browser re-crawl of the live hosts did not run.
Chromium in this container does not trust the agent proxy's CA and fails every
https navigation with ERR_CERT_AUTHORITY_INVALID; the README forbids disabling
TLS verification, so it was not disabled. Instead every file each host serves
was fetched over verified https and compared byte for byte against the
repository state that G1 and G5 were run on: 24, 22 and 17 files, all
identical, none unreachable. The rendering result therefore transfers, but it
is an argument from identical bytes rather than a browser run against the live
host, and that distinction is the reason this paragraph exists.

## Decision log

| Decision | Why | Where |
|---|---|---|
| Restored three gallery metas to plan 4.1 text | They had been rewritten in first person; section 6 says use the plan's lines as written and G3 tests against 4.1 | `samples/*/gallery.html` |
| `sips-01.jpg` caption says two glasses, not three | S8's draft says three; the photograph shows two, and the line is tagged `[VERIFY PHOTO]`. Section 6 says name what you can see | caption map, all samples |
| Kept each concept's numeral style (`01`, `FRAME 01`, `01 /`) | Rule 9 keeps numbering where a concept already uses it; removing it would be an unrequested design change | all three galleries |
| Kept sample 1's `TOMBALL, TEXAS` label | Rule 8.1.5 allows decoration that touches nothing; it sits at `top:-26px`, above the photo, unrotated | `sample-1/index.html` |
| Kept sample 1's menu index row rather than deleting it | Section 6 allows tabs that work before JS; they are anchor links to `#graze` and the rest, so they do. Only the tab chrome was removed | `garden.css` |
| Gallery captions short, `alt` full sentence | S8 requires literal captions; the full sentences overflow the tiles, and section 6 says shorten a line that does not fit | caption map |
| Photographs contained on a cream void in the wall | Rule 8.1.3 — objects on a void, not cropped to fill | `garden.css` |
| Scoped sample 3's `test_content` chrome assertion to the five pages | It globbed `*.html` and swept in `table.html`, a separate exploration with its own chrome | `sample-3-studio/test_content.py` |
| Worked on `claude/new-session-sxswl3`, not `main` | The push to `main` was refused (below); the branch is the designated one | branch |

## Open, with reasons

1. **The live browser re-crawl did not run**, for the CA reason above. Byte
   identity was verified instead. Anyone with a normal network can close this
   by running, per sample:
   `python3 tools/presentation-gate.py --sample <dir> --base <url>`

2. **The `main` merge is landed locally but not pushed.** Step 0's
   `git push -u origin main` was refused by the auto-mode classifier with
   `[Merge Without Review]`. The merge of `origin/claude/nice-franklin-kpjbpf`
   is a fast-forward and is present on the working branch, so the plan
   documents are in hand. PR #51 is still open and can be merged from GitHub.

3. **Sample 2 has no `test_content.py` or `test_content_browser.py`.** Sample 3
   has no `test_content_browser.py`. G4's unittest portion cannot run for
   those. Writing them was not in scope for this pass.

4. **`tricia-662.jpg` provenance is unresolved.** The file has the marks of a
   design-file export (`Group_49_1_…`), studio backdrop, a drawn grid overlay.
   `sample-2/story.html` captions it with her name. It is left in place; it
   needs a yes or no from Tricia. Recorded in `ASSETS.md`.

5. **S3-6 not changed.** The menu note and the contents still restate each
   other. The plan marks it low priority and it fails no gate.

6. ~~**`table.html` is not deployed anywhere**~~ — **this was wrong when it was
   written.** `table.html` has been live under sample 3 and returning 200 the
   whole time. Corrected in round two below, where it becomes the fourth link.

## What Garrett needs to do

1. Run the presentation gate in plan 9.6 on a phone and a laptop, then send the
   three links.
2. Merge PR #51, or push the landed `main` merge.
3. Ask Tricia whether `tricia-662.jpg` is her, before sample 2's About page
   goes in front of anyone.
4. Optional: run the gate against each live host from a normal network to close
   the browser re-crawl noted above.

---

# Round two — the boutique warm-up and the immersive

Written 2026-09-17, later the same day. Brief: `PROMPT-OPUS-2.md`, against plan
sections 10 and 11. Same standing rule: nothing below is marked green that was
not run, and where an instrument could not judge something, that is said rather
than glossed.

## The four links

| | Concept | Link |
|---|---|---|
| 1 | **Garden Atelier** — the elegant one, now warm | https://charcuterie-chick-sample-1.vercel.app |
| 2 | **Midnight Supper** — the evening one | https://charcuterie-chick-sample-2.vercel.app |
| 3 | **The Gathering** — prices up front | https://charcuterie-chick-sample-3.vercel.app |
| 4 | **The Table** — the immersive, a preview | https://charcuterie-chick-sample-3.vercel.app/table.html |

Link 4 is a preview and should be described as one. Plan 11.4 has the note in
Garrett's voice. Garrett sends it; nothing was sent to the client from here.

## Workstream A — concept 1 as a small-town boutique (plan 10)

### The accent was chosen by measurement, not preference

Rule 1 asks for oxblood or olive, held against `knot-hero.jpg` and the cart
photo. Measured instead of eyeballed:

| | hue offset from the food's mean | ΔE to that mean | on the linen |
|---|---|---|---|
| olive `#5b5f3b` | +43° | **15.0** | 5.94:1 |
| oxblood `#6e2230` | −53° | 33.2 | **9.66:1** |

`knot-hero.jpg` carries 68% of its saturated mass in hue 10–59°, i.e. amber.
Olive measures *closer*, and that is the argument against it: an accent 15 ΔE
from the photograph's own hue blends into the food and stops being an accent.
Olive is also the same green family as the `#d5e0c4` pistachio that made the
page read cold. Oxblood is warm, 62% higher contrast, and it is the brick and
wine-bar note the brief describes. **Chosen: oxblood `#6e2230`.**

**Gold had to split in two.** The brief calls gold an "eyebrow colour", but
eyebrows are text and `#b8963e` is 2.50:1 on linen. So `--garden-gold` stays
`#b8963e` for 1px hairlines only, and `--garden-gold-ink: #765c1c` carries
eyebrow text at 4.98:1 on sand, the worst of the three grounds.

Every text `opacity` is gone, replaced by `--garden-muted`. The six old
`.68`/`.7`/`.8` rules all happened to pass AA; none of them had been computed.

### Gates — sample 1

| Gate | Result | Evidence |
|---|---|---|
| G1 layout | **GREEN**, 0 problems at 390/768/1440/1920, five pages | `tools/presentation-gate.py --sample sample-1-editorial` |
| G2 copy | **GREEN** — kill list 0, "gather" 0, "enquir" 0 | same run |
| G3 titles/metas | **GREEN** — 5 unique titles, 5 unique metas, all matching plan 4.1 | same run |
| G4 suites | **GREEN** — 6 unit tests OK; `qa_garden_pw.py` green (tabs, lightbox, draft, prefills, reduced motion) | `python3 -m unittest test_content test_content_browser` |
| G5 quote flow | **GREEN** — tel, sms, mailto, all three prefills | same gate run |
| G6 evidence | **GREEN** — 10 screenshots | `samples/sample-1-editorial/test-output/round2/` |
| Contrast | **PASS** on every rendered text node at 390 and 1440 | `tools/contrast-audit.py` |

## Workstream B — the immersive (plan 11)

Items are the plan's own 11.3 numbering.

| Item | State | Note |
|---|---|---|
| 6 — overflow at 390 and 1440 | **done** | root cause was not the nav |
| 7 — H1 back to her tagline | **done** | "Elegance without the cost." |
| 2 — a designed phone version | **done** | real render of the scene, WebGL feature-detected |
| 3 — photographs as photographs | **done** | five real `img` + her portrait |
| 4 — the calculator under "The number" | **done** | same arithmetic as the quote page |
| 5 — performance budget | **done** | measured, then minified |
| 1 — inner pages in the immersive's tokens | **partly, and deliberately** | see below |
| 8 — restore the card photos | **measured, not needed** | see below |
| 9 — gates on `table.html` | **GREEN** | see below |

### Item 6 — the plan's diagnosis was wrong, and that mattered

Plan 11.2 says the station nav "pushes the page 90px wider than the screen".
It does not. Measured at all four widths, the single cause at every one of them
is `.plate::before`, a glow with `inset: -70px -110px`:

| viewport | document `scrollWidth` | plate right edge + 110px |
|---|---|---|
| 390 | 480 | 370 + 110 = **480** |
| 1440 | 1464 | 1354 + 110 = **1464** |
| 1920 | 1940 | 1830 + 110 = **1940** |

A pseudo-element never appears in a `querySelectorAll('body *')` scan, which is
why an element-level probe reported "no offenders" while the document was 24px
too wide. `overflow-x: clip` on `.station` clips the bleed without creating a
scroll container, so anchor scrolling and the vertical bleed both survive.

The nav still needed the change the brief asked for, for the brief's reason: it
was a rail with `scrollbar-width: none`, so two of five stations were
unreachable without a drag nobody can see. It now wraps to two rows at 390.

### Item 2 — the phone is not a cropped desktop

`table-boot.js` decides whether the room is rendered or photographed, by WebGL
feature detection and viewport width, **never a user-agent string**. It is a
classic script, not a module, because a static `import` would download the
1.3 MB renderer before any check could run.

Measured, Chrome DevTools "Slow 4G" (1.6 Mbit down, 150 ms RTT), gzip on:

| | headline on screen | scene lit | `three.module.js` transferred |
|---|---|---|---|
| 390, phone | **724 ms** | never — the still is the hero | **0 KB** |
| 1440, desktop | **835 ms** | 6,532 ms | 172.2 KB |

The station nav is wired inside `table-cinematic.js`, so skipping that module
would have left the nav dead. `table-boot.js` wires it on the path where the
scene module does not load, and that was verified by clicking through at 390.

`tools/capture-table-still.py` exports two real renders of the scene. Cropping
the 1440 frame down to 390 lands on the dark half of the room, so the portrait
still is composed at phone proportions instead.

### Item 5 — the payload, measured before it was touched

The plan's "1.3 MB unminified" is the raw file size. What crossed the wire was
258.8 KB gzip.

| | raw | gzip |
|---|---|---|
| upstream ES module build | 1,283.9 KB | 258.8 KB |
| **minified, as vendored now** | **672.4 KB** | **171.6 KB** |
| bundled + tree-shaken (**not taken**) | 485.4 KB | 123.6 KB |

Bundling measured best and was deliberately refused: it couples the vendored
artifact to application code, so every edit to `table-cinematic.js` would need
a bundler run before the page worked. That is a build step, and rule 2 forbids
one. Minifying a library in place keeps the artifact independent. Reproduction
command and licence in `samples/sample-3-studio/vendor/README.md`.

### Item 4 — one home for the arithmetic

The dark estimator uses the **same element ids** as `enquire.html`, so
`gathering.js` drives both and the two cannot drift. Verified by driving the
dark form directly: all six totals from `STATE.md` reproduce exactly —
2,630.22 / 4,400.22 / 2,512.22 / 2,040.22 / 1,804.22 / 1,686.22.

### Item 1 — partly done, and the reason is architectural

`menu.html`, `story.html`, `gallery.html` and `enquire.html` are **shared with
concept 3**. Restyling them dark would destroy The Gathering's blue-and-butter
identity, and separate dark copies would duplicate four pages of content and
double the QA surface. This is the stop condition in `PROMPT-OPUS.md` §7: the
fix needs the concept redesigned rather than corrected.

What was done instead removes most of the need to leave the scene at all:

- the calculator now lives on `table.html`, so the money path never exits;
- the hero's "Price your party" goes to `#s5`, not to `enquire.html`;
- the carts, sweets and sips prices are in station 3, so that link is gone too.

Remaining exits are "All the photographs" and "More about me" — genuinely
"there is more" links rather than the main path. **For the paid build, the
honest scope is separate dark inner pages**, which is what plan 11.4 already
prices into Option C.

### Item 8 — measured, and it does not need doing

The four card photos were measured rather than restored on principle:

| file | size | mean L | contrast | clipped | rendered on the table |
|---|---|---|---|---|---|
| `knot-3.jpg` | 945×720 | 138.9 | 61.7 | 0.37% | ~230px |
| `graze-02.jpg` | 480×640 | 148.4 | 60.1 | 0.71% | ~155px |
| `knot-2.jpg` | 945×720 | 137.5 | 61.5 | 0.29% | ~225px |
| `board-02.jpg` | 480×640 | 104.9 | 66.7 | 1.02% | ~155px |

Well exposed, healthy contrast, ~1% clipping at worst, and every one is
displayed 2–4× **below** its native resolution. Restoration would be cosmetic
work with no visible result, and every generative pass carries provenance risk.
Recorded as a finding, not skipped.

### Gates — sample 3, including `table.html`

| Gate | Result | Evidence |
|---|---|---|
| G1 layout | **GREEN**, 0 problems at 390/768/1440/1920 across five pages **plus `table.html`** | `tools/presentation-gate.py --sample sample-3-studio --also table.html` |
| G2 copy | **GREEN** | same run |
| G3 titles/metas | **GREEN** — 5 unique, matching plan 4.1 | same run |
| G4 suites | **GREEN** — 4 unit tests OK | `python3 -m unittest test_content` |
| G5 quote flow | **GREEN**, and the six totals also reproduce on `table.html` | same run + direct drive |
| G6 evidence | **GREEN** | `samples/sample-3-studio/test-output/round2/` |
| Contrast, CSS method | **declines to judge 23 boxes on `table.html`** | `tools/contrast-audit.py` |
| Contrast, measured pixels | **PASS**, tightest pair 5.49:1 (need 4.5) | `tools/pixel-contrast.py` |

## The instruments were wrong three times, and each was fixed before the pages

This matters more than any individual fix, because a gate that cannot fail is
not evidence.

**1. G1 could not see pseudo-element decoration.** The gates went green on the
first run. A negative control — painting the guest-book quotation mark over the
review quotes on purpose — left G1 **GREEN**. A `::before` is not an element,
so `document.elementFromPoint` returns the *originating* element for its pixels;
the hit-test reported `SECTION.proof`, an ancestor of the text, and the sweep
skipped it as an ancestor. `PSEUDO_JS` now measures the pseudo box from its
resolved geometry, skipping only what cannot obscure (`z-index` below zero,
effective alpha ≤ 0.25). The first version of that fix was *also* wrong —
it anchored only `absolute`/`fixed` hosts to their own box, so a
`position:relative` host fell through to `offsetParent` and the gate blamed the
nav instead of the guest book. Verified both directions: broken → **RED, 8
problems** naming the right text; restored → **GREEN, 0**.

**2. The contrast auditor reported three classes of phantom failure.** It
flagged dark blue on cream at 1.87:1, which is impossible. Causes: disabled
controls (WCAG 1.4.3 exempts them, and so does axe), off-screen skip links, and
CSS *gradients* counted as "background images" — so every scrim on `table.html`,
the very thing that makes the text legible, was read as a photograph. All three
fixed; text over a real photograph is now its own reported category rather than
a meaningless number.

**3. Neither auditor could score text on a photograph at all.** So
`tools/pixel-contrast.py` was written: it renders the page twice, once as
shipped and once with the text made transparent, and measures the **actual
pixels** behind each text box. On `table.html` every box clears AA, tightest
5.49:1. Negative-controlled too: removing `.plate::before` drops the lede to
4.41:1 and the tool fails it, which also proves the scrim is load-bearing.

## A live defect found while gating, and fixed

**Sample 3's gallery: "See it larger" was cream on cream, 1:1, eleven
instances.** Invisible on every photograph in the wall.

The cause is a cascade-order interaction, and getting to it took one wrong
answer first. `gathering-polish.css` carries the rule that would fix it —
`.gallery-wall a span{background:var(--ink);color:var(--paper)}` — and my first
reading was that no page loads that stylesheet, because none of the six HTML
files `<link>` it. **That was wrong.** `gathering.css` line 1 is
`@import url('gathering-polish.css')`, so it loads on every page. A
`document.styleSheets` walk does not list an `@import`ed sheet as a top-level
entry, and neither does a grep for `<link>`, which is how it was missed twice.

What actually happens: `@import` rules come *first* in the cascade, so
`gathering.css`'s own later `.gallery-wall a span{…background:var(--paper)}`
overrides the imported `background:var(--ink)` — while the imported
`color:var(--paper)` survives, because the later rule never set a colour.
Cream text, cream pill. Neither rule is wrong alone; the pair is.

Fixed by setting both properties in the later rule. The affordance is now
**8.09:1**.

**`gathering-polish.css` must not be deleted.** It supplies live rules: 44px
nav tap targets, the pressed occasion-button state, the planner border. It does
still contain `.hero-photo{position:absolute;left:50%;transform:translateX(-50%)}`,
but that is already neutralised — `gathering.css` later sets
`.hero-photo{left:auto;right:4%;transform:none}`, which is round one's fix, and
G1 confirms no overlap. The real lesson is that this file is load-bearing and
invisible to the obvious checks, so **`@import` is the thing to grep for here**,
not `<link>`.

## Decision log — round two

| Decision | Why | Where |
|---|---|---|
| Oxblood over olive | Measured: olive is 15.0 ΔE from the food's own hue and would blend; oxblood is warm, 9.66:1 vs 5.94:1 | `garden.css` token sheet |
| Gold split into line and text tokens | The brief asks for gold eyebrows; eyebrows are text and `#b8963e` is 2.50:1 | `garden.css` |
| Portrait fixed by crop, not by generation | The grid is a border graphic, not an overlay: measured to columns 0–140, rows 722–822 | `img/tricia-portrait-471.jpg`, `ASSETS.md` |
| Full-bleed bands use the two slider photos | No grazing-table photograph in her library exceeds 945px; a table band at 1920 would be a 2× upscale | `index.html`, `story.html` |
| `.closing-note` section deleted | An almost-empty card; 10.3's "Come see what I put on a table." under the guest book does its job | `index.html` |
| Menu tab row kept, restyled | It works before JS as anchor links, so §6's condition is met; `qa_garden_pw.py` also drives it | `garden.css` |
| `overflow-x: clip`, not `hidden` | `clip` does not create a scroll container, so anchors and the vertical bleed survive | `table.css` |
| Minify the library, refuse the bundle | 34% vs 52%, but bundling couples the artifact to app code and that is a build step | `vendor/README.md` |
| Card photos left alone | Measured: well exposed, ≤1% clipping, displayed 2–4× below native | this report |
| Dark inner pages not built | The pages are shared with concept 3; dark copies would double the QA surface. §7 stop condition | this report |

## Open, with reasons — round two

1. **I have never seen these pages in their real typefaces.** The proxy blocks
   `fonts.googleapis.com`, so every screenshot here is in Times/Arial fallbacks
   rather than Cormorant Garamond, Jost, Fraunces and Inter. Sizes, contrast,
   overlap and overflow are computed from CSS and hold either way, and the
   measures are in `ch` so they self-correct — but line-breaking and the felt
   refinement of the real faces are **unverified by me**. Garrett's 9.6 pass on
   a real device is the check that closes this.

2. **The browser re-crawl of the live hosts still did not run**, for the same
   `ERR_CERT_AUTHORITY_INVALID` reason as round one. Live verification was done
   over verified https instead.

3. **`tricia-662.jpg` is still an open question.** Cropping the grid out of it
   does not establish that the woman is Tricia. Samples 2 and 3 still use the
   original gridded file; only concept 1 was in this brief.

4. **Item 1 is partly done** — see the reasoning above. The paid build needs
   separate dark inner pages, which Option C already prices.

5. **`gathering-polish.css` is loaded by `@import`, not by `<link>`.** It is
   load-bearing and must not be deleted. Anyone auditing this sample should
   grep for `@import` as well as `<link>`; two passes here missed it. Flattening
   the two stylesheets into one, so the cascade is readable in a single file,
   is worth doing at paid-build time.

6. **Two credentials pasted into chat still need rotating**: the Higgsfield key
   id and the Firecrawl key. Neither was used, stored or transmitted.

## What Garrett needs to do — round two

1. Open all four links on a phone and a laptop. That is plan 9.6, and it is the
   one check no tool here could run.
2. Send the note from plan 11.4, describing link 4 as a preview.
3. Ask Tricia whether the About portrait is her, and whether she has a colour
   version.
4. Before deleting any feature branch: **Vercel production tracks
   `claude/new-session-sxswl3`, not `main`.** Repoint the three projects first.
