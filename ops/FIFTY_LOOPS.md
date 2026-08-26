# Fifty free $1+/day loops

**Board date:** 2026-08-26 (truth pass — 24/50 SHIPPED verified against disk by `ops/tools/check-fifty-loops.mjs`, not just marked)  
**Repo:** `Beexly/autonomous-revenue-engine`  
**Rule:** Candidates and files only. No fake revenue. No invented live URLs. No sports. No paid ads. No X API spend. No domains. No newsletters. No prompt packs. No Stripe secrets. Do not npm publish, do not post HN/IH/dev.to, do not marketplace-publish, do not merge this board’s PR without owner.

**Known live URLs (raw.githack, `main`):**
- [hub](https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/index.html)
- [qi-check](https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/qi-check.html)
- [fold-ruler](https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/fold-ruler.html)
- [burstiness](https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/burstiness.html) (this PR, live after merge)

**Infra on main (not $1/day loops):** `apps/conformal-lite` (aci/saocp/cqr/evalue), Lago client + CAPI helpers (no keys, no spend). `ops/META_KEY.local` deleted from HEAD; rotate the leaked token.

**Status key**
- `SHIPPED` — files exist in the repo (or the already-shipped UI/CLI).
- `NEXT` — file-only; operator can write it without owner.
- `BLOCKED-OWNER` — needs an owner click (Pages, HF write, Vercel).
- `BLOCKED-APPROVE` — draft may exist; posting/uploading/publishing is forbidden until owner says so.

**Later $ (every row):** free-core attention → waitlist / sponsorship / paid history-or-batch wedge. None of these are earning today. Do not claim they are.

| # | Name | Motion (what ships) | $0 path | Status | Why it can make money later |
|---|------|---------------------|---------|--------|------------------------------|
| 1 | qi-check UI | Next.js paste → Hold/Soft/Hard + fix list (`apps/qi-check`) | GitHub app; `npm run dev` locally; Vercel later is owner-only | SHIPPED | Free OCR-fitness checker is the named public face; paid wedge is history/batch/API later |
| 2 | qi-check static page | Self-contained `docs/qi-check.html` (inlined score.js) | GitHub file; live on raw.githack for `main` | SHIPPED | Same tool without a host bill; inbound from operators who will not clone |
| 3 | voice-delta CLI | Original JS Burrows’ Delta vs Pass-style corpus (`apps/voice-delta`) | `node cli.js` in the repo; no keys | SHIPPED | Voice-check is the paid-adjacent gate; CLI users become API/history customers later |
| 4 | bait-hook detector | First-line-only bait score (CLEAN / SOFT BAIT / HARD BAIT) | `docs/bait-hook.html`; open the file | SHIPPED | Narrower than qi-check; shareable hook for people who only want line one |
| 5 | swap-test checklist | Interchangeability score for a paste (ANCHORED / SWAPPABLE / GENERIC) | `docs/swap-test.html`; open the file | SHIPPED | QUALITY_BAR as a public checklist; later a batch “would this survive a brand swap?” report |
| 6 | Static tools hub | Index of the HTML tools | `docs/index.html` | SHIPPED | One entry point when Pages is on; no extra domain |
| 7 | Fold-length ruler | Paste → char/word count vs 160-char first-screen band | `docs/fold-ruler.html` live on githack | SHIPPED | Teaches the 50%-visible unit that OCR actually pays |
| 8 | Burstiness sparkline | Sentence-length CV drawn as a tiny bar chart | `docs/burstiness.html` | SHIPPED | Makes “flat model cadence” visible; upsell to voice-delta |
| 9 | Staccato-fragment killer | Flags one-word / two-word period lines | New `docs/staccato.html` | SHIPPED | Directly implements the SO-012 fail; operators will bookmark it |
| 10 | Specificity counter | Counts numbers, $, proper-noun-ish tokens, decision verbs | New `docs/specificity.html` | SHIPPED | Free “is this a lecture or a log?” meter; paid: corpus baselines |
| 11 | Jargon densitometer | Hits on leverage / 10x / unlock / viral / build-in-public | New `docs/jargon.html` | SHIPPED | Same audience as swap-test; affiliate later on editing tools, not ads |
| 12 | Contrast-triple detector | Flags empty “It’s not X. It’s Y.” cadence | New `docs/contrast.html` | SHIPPED | Distinct fail vs bait-hook; feeds the originality gate story |
| 13 | 50% viewport mock | Overlay showing what a Premium Home Timeline actually sees | New `docs/viewport-mock.html` | SHIPPED | Visual twin of qi-check; screenshot-friendly for later Show HN |
| 14 | Kill-pattern highlighter | Regex overlay of QUALITY_BAR instant-kill patterns | New `docs/kill-highlight.html` | SHIPPED | Doctrine as a highlighter; later a lint rule people pay to run in CI |
| 15 | Function-word histogram | Static bars of I/we/you/the/and rates | New `docs/function-words.html` | SHIPPED | On-ramp to voice-delta without Node |
| 16 | CTA / hashtag strip preview | Shows the draft with CTAs and tags removed | New `docs/cta-strip.html` | SHIPPED | “Before you post, see the residue”; later a browser extension |
| 17 | Thread-beat planner | Local 1/n beat sheet; does not post | New `docs/thread-beats.html` | SHIPPED | Structure tool, not a publisher; paid: saved beat libraries |
| 18 | OCR eligibility self-check | Static checklist of public OCR rules (Premium, 500 verified, etc.) | New `docs/ocr-eligible.html` | SHIPPED | Honest eligibility, no API; later a logged tracker |
| 19 | Before/after Hold compare | Two pastes, local only, side-by-side scores | New `docs/hold-compare.html` | SHIPPED | Makes rewrite work visible; paid history of pairs |
| 20 | Pronoun-ratio viewer | I / we / you mix for a paste | New `docs/pronouns.html` | SHIPPED | Cheap voice tell; pairs with Delta |
| 21 | Claim-verb first-line scorer | Scores whether line one has killed/paid/refused/shipped | New `docs/claim-verb.html` | SHIPPED | Complements bait-hook (presence of stake, not bait) |
| 22 | Emoji / yarn stripper | Strips 🧵🔥👇 and reports what remains | New `docs/emoji-strip.html` | SHIPPED | Tiny utility; bookmark + later extension |
| 23 | Duplicate-opener checker | Paste candidate + 3 refs; flags shared first lines | New `docs/dup-opener.html` | SHIPPED | Stops us repeating ourselves; later corpus-wide |
| 24 | Impression-proxy log template | CSV + static form for Premium/verified impression proxies | New `docs/impression-log.html` + `ops/IMPRESSION_LOG.csv` | NEXT | Unlocks the deferred daily revenue-score job in HANDOFF |
| 25 | Reading-time vs visible estimator | Words → seconds vs “≥50% visible” heuristic | New `docs/read-time.html` | NEXT | Translates OCR’s visibility rule into a number people share |
| 26 | qi-check CLI | `node` stdin/file wrapper around `apps/qi-check/lib/score.js` | File in `apps/qi-check`; no publish | NEXT | CI and editor users; npm draft later (do not publish until owner) |
| 27 | Hold-floor CI gate | Exit 1 if a candidate file scores &lt; 9.2 | GitHub Action YAML in-repo, no paid runners required | NEXT | Other repos may copy the gate; paid: hosted check |
| 28 | Pass-queue linter | Checks `ops/PASS_QUEUE.md` has id, score, disposition | Small `node` script | NEXT | Internal quality; public “queue lint” as a gist later |
| 29 | Candidate frontmatter lint | Requires SO-id, floors, human-primary note | Script + markdown template | NEXT | Makes the pipeline teachable; later a VS Code command |
| 30 | ACTION_LOG append helper | Stamps `LOG-NNN` with CDT time | Tiny CLI writing markdown | NEXT | Operator speed; not a product, but keeps the board honest |
| 31 | Bookmarklet: selected-text bait | One-click first-line bait-hook on selected text | `docs/bookmarklets.html` javascript: URL | NEXT | Zero-install distribution of loop 4 |
| 32 | Bookmarklet: first-160 copy | Copies the first 160 chars of selection | Same bookmarklet page | NEXT | Viewport unit in the browser chrome |
| 33 | Bookmarklet: CTA strip | Strips CTAs from selection in-page | Same bookmarklet page | NEXT | Meets writers where the draft already is |
| 34 | npm draft `@signalorigin/qi-score` | Extract `lib/score.js` + README + package.json | `packages/qi-score/` in repo; **do not npm publish** | NEXT | Package ready for owner publish; until then it is a file |
| 35 | npm draft `@signalorigin/voice-delta` | Extract Delta lib as a draft package | `packages/voice-delta/`; **do not npm publish** | NEXT | Same motion as 34 for the CLI |
| 36 | npm draft `@signalorigin/hold-floor` | Constants 9.2 / 7.0 as a one-file module | `packages/hold-floor/`; **do not npm publish** | NEXT | Tiny named artifact other gates can depend on later |
| 37 | npm draft `@signalorigin/swap-test` | Checklist scorer extracted from the HTML | `packages/swap-test/`; **do not npm publish** | NEXT | Lets the swap-test run in CI without a browser |
| 38 | VS Code extension draft | Hold-floor diagnostic on `.md` drafts | `extensions/hold-floor/` package.json + stub; **do not marketplace publish** | NEXT | Sits in the editor; paid: team license after owner publish |
| 39 | Show HN draft: qi-check | Candidate Show HN text, not posted | `ops/drafts/SHOW_HN_QI_CHECK.md` | BLOCKED-APPROVE | HN is a $0 attention path; posting is owner-gated |
| 40 | Show HN draft: bait-hook + swap-test | Candidate Show HN for the two new pages | `ops/drafts/SHOW_HN_BAIT_SWAP.md` | BLOCKED-APPROVE | Second Show HN after merge; still not posted here |
| 41 | Indie Hackers draft | Build-in-public note on free-core (not a newsletter) | `ops/drafts/IH_FREE_CORE.md` | BLOCKED-APPROVE | IH traffic to the static tools; owner posts or it stays a file |
| 42 | dev.to draft: Delta as a voice check | Technical article candidate | `ops/drafts/DEVTO_VOICE_DELTA.md` | BLOCKED-APPROVE | Developer inbound to the CLI; do not post |
| 43 | GitHub Pages on `/docs` | Serve the hub + HTML tools from Pages | Owner enables Pages on `docs/` | BLOCKED-OWNER | Stable `*.github.io` URL without buying a domain |
| 44 | Hugging Face Space (static) | Static clone of qi-check / bait-hook / swap-test | Owner creates Space if write is blocked for the operator | BLOCKED-OWNER | Second free host; HF audience ≠ GitHub audience |
| 45 | HF dataset card (Pass-style samples) | Card + tiny public sample set, no private drafts | Files in `ops/drafts/hf-dataset/`; upload is owner | BLOCKED-APPROVE | Dataset SEO; do not upload secret Pass queue |
| 46 | Hold-floor SVG badge | Static `docs/hold-floor.svg` reading “Hold ≥ 9.2” | Commit an SVG | SHIPPED | README bait that is doctrine, not vanity metrics |
| 47 | Tools changelog RSS | `docs/changelog.xml` listing tool ships | Static XML in docs/ | NEXT | Subscribe-able without a newsletter product |
| 48 | SO-candidate markdown template | Frontmatter + Hold fields for new drafts | `ops/templates/SO_CANDIDATE.md` | NEXT | Speeds gated drafting; later a form |
| 49 | Reply-vs-main heuristic page | Scores whether a paste is reply-primary (OCR: replies don’t pay) | New `docs/reply-vs-main.html` | NEXT | Stops wasting Hold work on the wrong unit |
| 50 | Delta corpus-size advisor | Token-count vs “σ defined / short-post unstable” warning | New `docs/corpus-size.html` | NEXT | Makes voice-delta usable; later a hosted corpus |

## This cycle (file-only, started)

Shipped on `main`:
- `docs/qi-check.html`, `docs/bait-hook.html`, `docs/swap-test.html`, `docs/swap-check.html`, `docs/fold-ruler.html`, `docs/burstiness.html`, `docs/index.html`
- `apps/qi-check`, `apps/voice-delta`, `apps/swap-check`, `apps/hn-bait`, `apps/subject-fold`, `apps/conformal-lite`
- Lago stub + CAPI helpers (env-gated, no spend)
- Rows 9–23 and 46 (15 tool pages + the SVG badge) — written and merged over several commits that named their own loop numbers in the commit message, but never flipped the Status column here. Caught and corrected 2026-08-26 by `ops/tools/check-fifty-loops.mjs`, which checks this table against the filesystem directly; run it after editing this board.

Not started as files yet: 24, 25, 26, 27, 28, 29–38, 47–50 (NEXT).  
Not started because owner must click: 43, 44.  
Not posted/uploaded: 39–42, 45.

## Shipped pages this board doesn't track

These exist on `main` and are real (self-contained, in `check-selfcontained.mjs`'s clean set) but aren't any of the 50 numbered loops above — they belong to the Meta-tracking/Lane-1 initiative, not the qi-check/Viewport-Hold plan this board is scoped to:
- `docs/ads-signal.html`, `docs/meta-tracking-audit.html`
- All 12 pages under `docs/tools/`: `consent-capi.html`, `content-id.html`, `count-gap.html`, `emq-cover.html`, `fbp-fbc.html`, `framer-capi.html`, `ghl-form.html`, `id-pair.html`, `pixel-source.html`, `shop-pay.html`, `stape-capi.html`, `test-events.html`

That's 14 pages, recounted directly against `docs/tools/` on 2026-08-26 (a prior audit cited 13 — one more file exists now than that count).

## Forbidden on this board
Sports/NFL/GSE, adult/XXX, prompt packs, Stripe invention, X API billing, domain buys, paid ads, npm/X/HN/marketplace publish, merging without owner.
