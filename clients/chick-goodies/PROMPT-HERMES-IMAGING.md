# PROMPT: Union Alpha (through Hermes): the imaging sprint

Written 2026-09-17 (night). Paste everything below the rule into Hermes as the
opening message. The spec it points at is `PLAN-IMAGING-SPRINT.md`.

---

You are the builder for a seven-day imaging sprint for the client Charcuterie
Chick (The Chick Goodies, Tomball, Texas) in the repo
`Beexly/autonomous-revenue-engine`, folder `clients/chick-goodies/`. Garrett
Baxley (Galaxy Sports Network LLC) owns the job. The Higgsfield account is on
Plus with Nano Banana 2 unlimited until Sep 24, 2026, six 365-day unlimited
models (Seedream 4.5, GPT Image, FLUX.2 Pro, Kling O1 Image, Nano Banana,
Seedream 5.0 Lite) and 1,000 credits. Unlimited models run only on the
higgsfield.ai website, so the volume runs in a logged-in browser that you drive.

Work on branch `claude/imaging-sprint`, cut from `main`. Commit and push after
every cycle. Open a draft PR to `main` on day 0 and keep it updated. Never push
to another branch.

## Read, in this order

1. `clients/chick-goodies/PLAN-IMAGING-SPRINT.md`, the whole file. It is the spec: purposes, pipeline, prompt library, credits, day plan, gates.
2. `clients/chick-goodies/ASSETS.md`: the sources and the quarantine list.
3. `clients/chick-goodies/FACTS.md`: the only text allowed on printed pieces.
4. `clients/chick-goodies/samples/sample-3-studio/table-cinematic.js`: how The Table places cut-outs today (the `cutouts` and `flats` arrays and `faceCamera()`).
5. `clients/chick-goodies/STATE.md`: repo rules and QA commands.

## Hard rules

- The provenance rule in plan §2, without exception. Her food, her cart, Tricia and her logo are only ever edits of her own files with the source attached. No text-to-image food. Seasonal and lifestyle sets change the surroundings, never the board.
- Sources are the files in `samples/sample-3-studio/img/` named in plan §3, plus `chick-original.jpg` for the logo. Never the four quarantined hashes in `ASSETS.md` §2, never `brand-reference-1364.jpg`, never her Shopify stock files.
- Printed pieces carry only strings copied from `FACTS.md`. Nothing else in type.
- No credential in the repo, the manifest, a log or a screenshot. Garrett signs into the browser profile by hand once. If a credit job needs a key, it lives in your environment only.
- One account, one browser session, at most eight jobs in flight, back off when the site throttles. Never a second account or session.
- You show nothing to Tricia or her customers. You deliver picks and contact sheets; Garrett decides.
- Do not edit the sample sites, the proposal or The Table in this sprint. Phase 3 integration is a separate task. You may add `.gitignore` entries and the new `tools/imaging/` folder, nothing else outside it.
- Do not commit `out/`, `refs/`, the browser profile, or any file over 400 KB. Sheets stay under 300 KB.
- No em-dashes in any file. Client-facing copy never says AI.
- Do not claim a gate is green without running it. Paste the command and the result in the daily report.

## Day 0 deliverables (tonight, Sep 17)

1. `tools/imaging/` per plan §4: `driver.py`, `qa.py`, `sheets.py`, `post.py`, `README.md`, `REPORTS.md`, `manifest.csv`, `prompts.yaml`, `objects.yaml`. The README is written for a stranger: install, sign-in, run, resume after a crash, where the selectors live, the Drive folder link.
2. `prompts.yaml`: plan §5 verbatim, with `{object}`, `{angle}`, `{view}`, `{look}`, `{season}`, `{setting}`, `{piece}`, `{copy}`, `{direction}` as template fields and a default model per prompt id.
3. `objects.yaml`: one entry per source file with the noun the prompt uses, written after you look at the photo. Examples of the shape: `cart-640: charcuterie cart with its full spread`, `knot-hero: long grazing table`, `sips-01: drink cups`. Mark anything you cannot identify from the photo as `VERIFY` and leave it out of the day-1 queue.
4. `refs/`: each source cropped to its subject, saved at native size and as a 2K Lanczos copy used only as the reference, plus a rembg mask for the eleven objects that already have cut-outs in `img/cut/`.
5. `manifest.csv` pre-filled with the whole day-1 queue from plan §7, job ids like `d1-A-P1-cart-nb2-v03`.
6. Dry run of eight jobs on Nano Banana 2: P1 for cart-640, board-01, knot-hero and sips-01; P4 for graze-01, table-01, tricia-662 and wide-640. Report the eight output paths and their qa.py scores, and set the per-purpose sharpness floors from them.
7. `.gitignore` entries for `out/`, `refs/`, the profile and anything over 400 KB.
8. Disk check: 60 GB free, or say so and stop.

## Days 1 to 7 (Sep 18 to Sep 24)

Run plan §7 exactly, day queue then night queue. When the queue empties, refill
it with more variants of the current day's cells, up to 48 a cell. Contact
sheets (top 8 per cell by qa_score) are pushed by 09:00 each day. Garrett's picks
come back as a list of job ids; mark `pick=1`, run `post.py`, commit the picks.
Credit jobs (Nano Banana Pro P3 sets, Tripo H3.1 multiview with PBR and detailed
mesh, optional Seedance clips) run only within the budget in plan §6; log credits
spent and remaining every day. Download and delete from the site gallery as you
go; Plus has 2 GB of storage there.

## Daily report (append to REPORTS.md, at most 40 lines)

- Day, jobs queued, done, rejected by reason, picks pending.
- Credits spent today and remaining.
- Sheets pushed, by path.
- What failed and what changed because of it.
- Tomorrow's queue as loaded.
- At most two decisions you need from Garrett, each answerable in one line.

## Done means

- The manifest is complete: every row has a status and a path or a reject reason.
- Picks are in `picks/<purpose>/` as webp, sheets in `sheets/`, masters on Drive with the folder link in the README.
- `qa.py --summary` prints totals, rejects by reason, picks, and it is pasted in the PR body.
- Four GLBs of at most 6 MB each in `picks/A/models/`, each with a screenshot loaded in a plain Three.js viewer.
- The draft PR body lists everything above with the numbers.

## Report to Garrett

One message a day: the numbers, the sheet paths, the two decisions. Nothing
else. If you are blocked (sign-in, throttling, disk, a selector that broke),
say what you tried and what you need, then keep the parts that still run
running.
