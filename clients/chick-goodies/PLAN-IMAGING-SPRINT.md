# PLAN: Imaging sprint: seven days of unlimited Nano Banana 2 (Sep 17 to Sep 24, 2026)

Written 2026-09-17 (night). Owner: Garrett (Galaxy Sports Network LLC). Builder:
Union Alpha, run through Hermes, briefed by `PROMPT-HERMES-IMAGING.md`.

Purpose: turn one month of Higgsfield Plus into the image bank that gets The
Table (`samples/sample-3-studio/table.html`) to the oryzo.ai bar, restores every
photo Tricia has, and gives the proposal's creative add-ons real proof. Generation
is free for seven days on one model and for a year on six more. Selection is the
only scarce thing, so every stage ends in an automatic gate and a contact sheet.

## 1. What is actually on the account (screenshots, 2026-09-17)

| Fact | Consequence |
|---|---|
| Plus plan, renews Oct 17, 2026. 1,000 credits a month, 1,000 left. 8 parallel image jobs, 6 parallel video jobs. | Eight jobs in flight at all times is the pace. Credits are the scarce resource, see §6. |
| **Nano Banana 2 Unlimited**, 7-day, 2K, Sep 17 to Sep 24. | This is the volume model for every edit of her photos. Not Nano Banana Pro. The window closes Sep 24. |
| 365-day unlimited, auto-renewing: **Seedream 4.5** (2K/4K), **GPT Image**, **FLUX.2 Pro** (1K), **Kling O1 Image**, **Nano Banana** (v1), **Seedream 5.0 Lite** (2K/3K). | Free all year. Seedream 4.5 makes the 4K masters. GPT Image makes anything with type on it. Flux makes textures and plates. These do not stop on Sep 24. |
| Nano Banana Pro is not unlimited on Plus. 2 credits an image, 4 at 4K. The marketplace lists "unlimited access to top models from $5" (Seedance 2.0, Nano Banana Pro, Kling 3.0). | Pro is reserved for the hero shots where Nano Banana 2 fails, paid in credits. If day 1 shows Pro is clearly better on the cart and the boards, check the marketplace price for a Pro unlimited add-on before spending credits on volume. |
| Higgsfield's own note: unlimited models and free generations work only on higgsfield.ai, not on MCP, CLI, Canvas or Supercomputer. | The burn runs in a logged-in browser on the website. Credits (3D, Pro, upscales) can go through the MCP or the site. |
| Video is credits only on Plus (Seedance 2.0 720p is about 22 credits a 5-second clip). | Video is optional in this sprint, capped at three clips, unless Garrett buys the Kling 3.0 add-on. |

Throughput: eight in flight at roughly 15 to 30 seconds a Nano Banana 2 job is
1,000 to 1,900 images an hour. Practical target 3,000 to 5,000 a day, 25,000 and
more for the week. Disk: 2K webp at about 500 KB each, so 60 GB free on the
Hermes machine before day 1.

## 2. The line we do not cross (provenance)

- Every image that shows her food, her cart, Tricia or her logo is an **edit of one of her files**: the source photo is attached as a reference and the prompt says keep every item as photographed. No text-to-image food, ever. Same rule as `PROMPT-BUILDERS.md`: restoring her own files is allowed, invented food is not.
- Set dressing (tables, linen, rooms, candle glow, backdrops, textures) may be generated from text. It makes no claim about her product.
- Seasonal and lifestyle sets change the **surroundings**, never the board. A fall table is her board on a fall table, not a new board.
- Printed pieces carry only strings that exist in `FACTS.md`: names, prices, the Knot line, review quotes as published. Nothing else in type.
- The four quarantined hashes in `ASSETS.md` §2 are never a source. `brand-reference-1364.jpg` is unidentified and is not a source. Her Shopify stock files are not a source.
- Every output carries its source file, model and prompt id in the manifest. The manifest is what lets us tell Tricia "this is your board, re-shot" and prove it.
- Client-facing copy never says AI. Internal files can.

## 3. What the images are for, in priority order

| # | Purpose | Sources | Output | Lands in |
|---|---|---|---|---|
| A | The Table hero objects at the oryzo bar | cart-640, knot-hero, knot-2/3/4, board-01/02, boards-01, graze-01/02/03, sips-01/02, sweets-01, candy-01, table-01/02/03, wide-640 (19 objects) | 2K studio isolates of all 19; 9-angle turnarounds of the cart, one board, one grazing table, the cups; 4-view orthographic sets of the same four for Tripo; 4 GLB meshes | `sample-3-studio/img/cut/`, `img/turn/`, `models/` |
| B | Every photo she has, restored | the 19 above plus tricia-662 and catering-1000 (21 photos) | 2K restorations under the same filenames; 4K masters | `samples/sample-{1,2,3}-*/img/`, Drive |
| C | Proof for the creative add-ons | chick-original.jpg (logo), the picks from A and B, copy from FACTS.md | logo restore and 12 redesign directions; 10 before/after pairs; marketing kit (menu card, price sheet, Knot one-sheet, event flyer, six Instagram templates, cart signage) | proposal page 4 strip, `docs/lookbook/` |
| D | Seasonal and lifestyle sets | picks from A | 6 seasons × 11 boards; 6 settings × 5 boards | Drive, sample galleries later, Instagram bank |
| E | Set dressing for The Table | text only | 4K table surface, linen, backdrop plates, candle plates, room plate | `sample-3-studio/img/set/` |
| F | Instagram bank | picks from A to D plus review quotes | 90 posts (three months) | Drive, `docs/social/` |
| G | Video, optional | picks from A | three 5-second clips, credits | proposal add-ons, The Table loading frame |

A is first because it is the thing Garrett said we are not in the same ballpark on.

## 4. Pipeline (built on day 0, tonight, before the seven days are spent)

Location: `clients/chick-goodies/tools/imaging/`. Python 3.11, Playwright,
Pillow, imagehash, rembg (u2net), opencv-python-headless, open_clip or a
CLIP ONNX model, pytesseract optional.

```
tools/imaging/
  manifest.csv        one row per job (schema below)
  prompts.yaml        the prompt library from §5, ids P1 to P11
  objects.yaml        per-source nouns, verified against the photo (see PROMPT-HERMES-IMAGING.md)
  refs/               prepared references (crops, 2K enlargements, masks); never committed
  out/<day>/<purpose>/  raw downloads as webp q92; never committed
  picks/<purpose>/    Garrett's picks after post.py; committed as webp ≤ 400 KB
  sheets/             contact sheets; committed as jpg ≤ 300 KB
  driver.py           Playwright driver for higgsfield.ai (persistent profile, 8 in flight, per-model pages)
  qa.py               automatic gate; writes qa_score and reject_reason
  sheets.py           contact sheets per cell: top 8 by qa_score
  post.py             rembg to webp, sprite sheets, resize sets, 4K pass list
  README.md           how to run, selector config, known UI quirks, Drive link
  REPORTS.md          one block a day
```

Manifest columns: `job_id, day, purpose, prompt_id, source_file, refs, model,
resolution, aspect, variant, submitted_at, status, output_path, qa_score,
reject_reason, pick, notes`. Status is one of queued, running, done, failed,
rejected, pick. Job id pattern: `d1-A-P1-cart-nb2-v03`.

Driver rules: one browser, Garrett's own login in a persistent Chromium profile
that he signs into by hand once; no credential in the repo, the manifest, a log
or a screenshot. Never more than 8 in flight. When the site throttles, back off
and wait; never a second account or a second session. Selectors live in one
config block recorded with `playwright codegen` on day 0 and get fixed when the
UI changes. Every download is written and logged before the next submit. A
crash resumes from the manifest. `out/`, `refs/` and the profile are in
`.gitignore`.

Storage: raw output stays on the Hermes machine and mirrors nightly to Google
Drive `Chick Goodies / imaging-sprint / <day>`. The repo takes picks only, webp,
≤ 400 KB each, ≤ 15 MB per sample folder.

## 5. Prompt library

Rules for every prompt: name the source, say keep every item, say no text no
hands no added food, name the camera, name the light, name the background, name
the size and aspect. Variants come from the same prompt with a new variant
number, not from prompt edits. Model per prompt is a default; day 1 runs a
bake-off (§7) and `objects.yaml` records the winner per purpose.

P1 Studio isolate (A). Model: Nano Banana 2; Nano Banana Pro on credits for the cart and board-01 if NB2 fails. Refs: source photo.
> Using the attached photo as the only source, re-photograph this exact {object} as a studio product shot. Keep every item, its position, colour and quantity exactly as in the photo. Camera: three-quarter view from front left, 30 degrees above the table, 85 mm lens, everything in focus. Light: one large warm softbox upper left, soft fill from the right, a soft shadow under the {object}. Background: seamless matte dark brown fading to black, nothing else in frame. No text, no hands, no added food, no props. 2K, 4:3.

P2 Turnaround (A). Model: Nano Banana 2, Kling O1 Image as second opinion. Refs: source photo plus the P1 pick. One job per angle: front, front-left 45, left 90, back-left 135, back 180, back-right 225, right 270, front-right 315, top-down.
> Same {object} as the attached studio shot, same light, same background, same distance. Rotate the camera to the {angle} view at 20 degrees above the table. Every item stays exactly where it is on the {object}; only the camera moves. 2K, 4:3.

P3 Orthographic set for 3D (A). Model: Nano Banana Pro on credits (identity holds better); NB2 first as a free draft. Refs: source photo plus the P1 pick. Four jobs: front, left, back, right.
> Same {object} as the attached studio shot. {view} view, camera level with the table, orthographic, centred, the whole object in frame with a 10 percent margin. Flat even light, no shadow on the ground, plain mid-grey background. 2K, 1:1.

P4 Restoration (B). Model: Nano Banana 2 at 2K; Seedream 4.5 at 4K for the master of each pick. Refs: source photo.
> Restore and enlarge this photograph. Keep the composition, the crop, the colours, every object and every person identical. Remove sensor noise and JPEG blocking, recover fine texture in cheese, fruit, crackers, bread, wood and linen. Do not add, remove or move anything. No text.

P5 Relight for a sample palette (B). Model: Nano Banana 2. Refs: P4 pick.
> Relight this photograph for {look}. Keep every item, position and colour. No text.
Looks: sample 1 = warm late-afternoon window light, ivory and terracotta room; sample 2 = bright soft daylight, clean white room; sample 3 = low warm candle and tungsten light, dark walnut room.

P6 Set dressing (E). Models: Seedream 4.5 at 4K for plates, FLUX.2 Pro for tileable textures. No refs.
> A long empty banquet table draped in ivory linen in a dark walnut room, two brass candlesticks, low warm light, nothing on the table, photoreal, 4K, 16:9.
> Seamless tileable texture of an aged walnut tabletop, warm, matte, 1:1.
> Backdrop plate: dark warm brown to black gradient with faint bokeh candle glow lower left, 4K, 16:9.

P7 Logo (C). Model: GPT Image for the directions, Nano Banana 2 for the restore. Refs: chick-original.jpg.
> Restore this logo as a crisp flat vector-style mark on a white background, the same letterforms, spacing and colours, nothing added. 2K, 1:1.
> Redesign this brand mark in the direction "{direction}" for a Tomball, Texas charcuterie caterer. The words must read exactly "Charcuterie Chick" and, smaller, "The Chick Goodies". Flat, print-ready, on white. 2K, 1:1.
Directions (12): serif wordmark, script wordmark, monogram CC, badge with a chick, board-and-knife mark, hand-drawn chick, art-deco frame, Texas star accent, olive-branch wreath, minimal sans, stamp or seal, woman-owned crest.

P8 Marketing kit (C). Model: GPT Image. Refs: logo pick plus two board picks. Copy passed verbatim from FACTS.md.
> Design a printed {piece} for Charcuterie Chick. Use the attached logo and photos. Print exactly this text and nothing else: "{copy}". Ivory paper, wine and gold accents, one serif and one sans. Photoreal mock-up on a wooden table. 2K, {aspect}.
Pieces: menu card (the four grazing tables and prices), price sheet (menu prices as published), Knot one-sheet (5.0, 13 reviews, Best of Weddings 2026, starting $500), event flyer, six Instagram templates (1:1 and 4:5), cart signage.

P9 Seasonal (D). Model: Nano Banana 2. Refs: P1 or P4 pick.
> Place this exact {object}, unchanged, on a {season} table. The food is not changed, added to or moved. Photoreal, 2K, 4:5.
Seasons: fall = oak leaves, small pumpkins, amber candles; Thanksgiving = linen runner, wheat, brass; Christmas = fir sprigs, red ribbon, warm string lights; Valentine's = blush linen, roses, gold; graduation = school-colour ribbon, confetti; wedding = white linen, eucalyptus, tapered candles.

P10 Lifestyle (D). Model: Nano Banana 2. Refs: P1 or P4 pick.
> This exact {object}, unchanged, at {setting}. Guests only as soft blur in the background, no faces, no hands on the food. Photoreal, 2K, 3:2.
Settings: wedding reception, backyard party at dusk, office lunch, bridal shower, tailgate, holiday party.

P11 Video, optional (G). Model: Seedance 2.0 720p, 5 s, image-to-video from a pick, credits.
> Slow push-in on the {object}, candle light flickering, nothing on the table moves, no people, no text.

## 6. Credits budget (1,000 on Plus, all of it available)

| Use | Each | Count | Credits |
|---|---|---|---|
| Tripo H3.1 image-to-3D, multiview, PBR, detailed | 18 | cart, board-01, knot-hero, sips-01, two attempts each | 144 |
| Nano Banana Pro P3 orthographic sets | 2 | 4 objects × 4 views × 6 variants | 192 |
| Nano Banana Pro P1 and P2 rescue for the cart and board-01 | 2 | 120 | 240 |
| Seedance 2.0 clips, optional | 22 | 3 | 66 |
| Reserve: reruns, a Hunyuan3D v3 fallback (15) | | | 358 |

Everything else runs on the unlimited models. 4K masters come from Seedream 4.5,
not from Nano Banana Pro 4K.

## 7. Day plan (day 1 is Sep 18, day 7 is Sep 24)

| Day | Day queue | Night queue | Gate before the next day |
|---|---|---|---|
| 0, Sep 17 | Build §4; prepare refs (crop to subject, 2K Lanczos copy for the reference, rembg mask); write objects.yaml from the photos; record selectors; dry-run 8 jobs on Nano Banana 2 | Load the whole day-1 queue | driver submits, waits, downloads and logs 8 of 8; qa.py scores them |
| 1 | Bake-off: P1 for all 19 objects × 4 models (NB2, Seedream 4.5, Kling O1, GPT Image) × 8 variants (608). Garrett picks the model per object family by noon. Then P1 winners × 24 variants (456); P2 for the four hero objects × 9 angles × 16 variants (576) | P4 for the 21 photos × 16 variants (336) on NB2; P3 drafts on NB2 (4 × 4 × 8) | sheets A-P1, A-P2, B-P4 pushed by 09:00; objects.yaml has a model per family |
| 2 | P3 on Nano Banana Pro for the four hero objects (credits); Tripo on the best set of each; first GLB opened in table.html; rerun the drifting P2 angles with the P1 pick as an extra reference | C: P7 restore × 8, P7 directions 12 × 8 (96) on GPT Image; P4 before/after pairs | GLB ≤ 6 MB, loads in table.html at 60 fps on a 2019 laptop; turnarounds side by side with no drift on the food |
| 3 | E: P6 plates on Seedream 4.5 4K (60) and textures on FLUX.2 Pro (40); B: P5 × 3 looks × 21 photos × 8 (504) | C: P8 pieces × 12 variants (144) on GPT Image | plates tile; relights keep every item; type on the kit is letter-exact |
| 4 | D: P9 6 seasons × 11 boards × 12 (792) | D: P10 6 settings × 5 boards × 12 (360) | truth check: no food added or moved |
| 5 | Rerun everything rejected on days 1 to 4 with what was learned; second P2 pass for any hero object still short of nine clean angles | F: 90 Instagram posts from picks plus review quotes | clean nine-angle set for all four hero objects |
| 6 | 4K masters of every pick on Seedream 4.5 | G if approved: three Seedance clips | masters sharp at 100 percent, nothing changed against the 2K pick |
| 7 | Package: Drive mirror, picks to the repo as webp, sheets, manifest, README, REPORTS; PR ready | Second full A pass at 2K with the final prompt set, for the archive | qa.py summary green; repo delta ≤ 30 MB |

The queue never sleeps: whenever it empties, it refills with more variants of
the current day's cells, up to 48 a cell, and the sheet shows only the top 8 by
qa_score. That is the "until it cries" rule, bounded by the eight-job limit,
not by us. After Sep 24 the 365-day models keep running; only Nano Banana 2
volume stops, so anything that needs NB2 comes first in the week.

## 8. Gates in qa.py

Automatic reject when: short edge under 1,500 px (1K outputs are never picks);
Laplacian variance below the per-purpose floor set from the day-0 dry run;
pHash within 6 bits of an already accepted sibling; for isolates, rembg alpha
coverage under 15 percent or over 85 percent; OCR finds text where none was
asked for; for edits (P1, P2, P4, P5, P9, P10) CLIP similarity to the source
below 0.80. Every reject has a `reject_reason`. Human: Garrett marks picks on
the contact sheets; `pick=1` in the manifest. Truth: any frame where the food
differs from the source (an added item, a moved slider) is rejected even if it
looks better.

## 9. Integration after picks (phase 3, whoever Garrett assigns; this session can do it)

- The Table: cut-outs replaced by 2K isolates (max 1,600 px tall, webp q80); turnaround sprites in `img/turn/<object>/<angle>.webp`, with `faceCamera()` swapping the texture to the nearest angle instead of rotating one plane; the cart as a GLB through `GLTFLoader` vendored from three r170 `examples/jsm` to match `vendor/three.module.js`; E plates replace the procedural table and backdrop; phones keep the still.
- Samples 1, 2, 3: restored 2K files replace `img/*.jpg` under the same filenames, so no markup changes. The "do not upscale the 480px files" line in `ASSETS.md` §1 is retired and points at the manifest instead.
- Proposal: page 4 (investment and add-ons in the six-page layout) gets one before/after strip and one logo-direction strip from C.
- `ASSETS.md` gets §5, "Imaging sprint": file, source, model, prompt id, day.

## 10. Risks and open decisions for Garrett

1. Web-only unlimited means browser automation. Higgsfield's terms page did not load from here (404 on the two obvious paths). Read the fair-use and automation clauses on the site before the driver runs at pace. The plan keeps to one account, one session, eight in flight, and backs off on throttling. Garrett decides whether the driver runs or the same manifest is worked by hand in the UI.
2. Nano Banana 2 is the fast model, not Pro. It will drift on turnarounds more than Pro. The day-1 bake-off decides per family; the 3D route (P3 on Pro, then Tripo) is the true fix for the four hero objects, and sprites are the fallback for the rest. If Pro wins everything, the marketplace add-on for Pro unlimited is the cheaper path than credits.
3. The NB2 window closes Sep 24. Day 0 is tonight.
4. Repo size: picks only, webp, masters on Drive.
5. The Higgsfield and Firecrawl keys pasted in chat earlier get rotated before Hermes touches anything. The web driver needs no key. A key is only needed for credit jobs through the MCP, and it lives in Hermes's environment, never in the repo.
6. Tricia has not been told her photos are being re-shot. The provenance rule in §2 is what makes that an easy conversation, and it happens before anything ships.
7. Higgsfield's storage is 2 GB on Plus; the driver downloads and deletes from the site gallery as it goes, or the gallery fills on day 1.
