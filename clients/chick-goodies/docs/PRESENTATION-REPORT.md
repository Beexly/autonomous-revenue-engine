# PRESENTATION-REPORT

Written 2026-09-17. Gates run from `clients/chick-goodies` unless stated.

Two gates could not be run in this environment. They are recorded as red, not
skipped, and the reason is stated. Nothing below is marked green that was not
run.

## Status in one line

Samples 1, 2 and 3 pass G1, G2, G3, G4 and G5 against the repository. G6 did
not run: this container has no Vercel credentials, so nothing was deployed and
the three live hosts still serve the pre-correction build.

## Sample 1 — Garden Atelier (`sample-1-editorial`)

| Gate | Command | Result | Evidence |
|---|---|---|---|
| G1 layout | `python3 tools/presentation-gate.py --sample sample-1-editorial` | GREEN, 0 problems | `samples/sample-1-editorial/test-output/presentation/` |
| G2 copy | same run | GREEN — 0 kill-list, gather 0, enquir 0 | same |
| G3 titles/metas | same run | GREEN — 5 titles, 5 metas, all match plan 4.1 | `tools/plan-4-1-metas.json` |
| G4 suites | `cd samples/sample-1-editorial && python3 -m unittest test_content test_content_browser` | GREEN — 6 tests OK | terminal |
| G4 suites | `cd samples/sample-1-editorial && python3 qa_garden_pw.py` | GREEN — JSON, `enquire-email-link-valid: true`, `navigation-history: true` | stdout JSON |
| G5 quote flow | presentation-gate run | GREEN — tel, sms, mailto present; `?menu`, `?table`, `?occasion` prefill | terminal |
| G6 deploy + live crawl | `vercel deploy --prod --yes` | **RED — could not run** | `vercel whoami` → `loggedIn: false`, `reason: login_required`, `retryable: false` |

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
| G6 deploy + live crawl | `vercel deploy --prod --yes` | **RED — could not run** | no Vercel credentials |

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
| G6 deploy + live crawl | `vercel deploy --prod --yes` | **RED — could not run** | no Vercel credentials |

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

These are live now and serve the **pre-correction** build. They are not the
work in this report.

- https://charcuterie-chick-sample-1.vercel.app — 9 kill-list strings still served
- https://charcuterie-chick-sample-2.vercel.app — clean
- https://charcuterie-chick-sample-3.vercel.app — 1 unique meta across five pages, 7 kill-list strings still served

Measured over HTTP on 2026-09-17. The repository state passes G1 to G5 on all
three; the hosts do not carry it yet.

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

1. **G6 cannot run here. Nothing is deployed.** `vercel whoami` returns
   `loggedIn: false`, `reason: login_required`, `retryable: false`,
   `userActionRequired: true`. There is no `VERCEL_TOKEN` in the environment
   and no saved login. Deploying needs an interactive `vercel login` on a
   machine that has the account. Until that happens the three URLs above serve
   the old build, and the live re-crawl in G6 has nothing new to crawl.

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

6. **`table.html` is not deployed anywhere** and is not one of the three
   samples. It remains a fourth direction in `sample-3-studio`.

## What Garrett needs to do

1. Merge PR #51, or push the landed `main` merge.
2. From a machine with the Vercel account: `vercel login`, then
   `vercel deploy --prod --yes` from each of the three sample directories.
3. Re-run the gate against each live host:
   `python3 tools/presentation-gate.py --sample <dir> --base <url>`
4. Run the presentation gate in plan 9.6 on a phone and a laptop.
5. Ask Tricia about `tricia-662.jpg`.
