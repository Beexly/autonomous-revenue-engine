# PROMPT — Builders: presentation pass on the three samples

Written 2026-09-17 (evening) after a live audit of all 15 pages. Garrett needs to
put the three sample URLs in front of Tricia as soon as they are presentable.
This prompt tells each builder exactly what to do, in what order, and what
"done" means. Nothing here changes the concepts. It corrects them.

## Who does what

- **Opus (design lead).** Owns the layout and design-bar work: section 8 and
  the S1 and S3 items in section 9 of `PLAN-CONTENT-STRATEGY.md`. Takes
  sample 1 first (most work), then reviews sample 3.
- **GLM-5.2 (UI).** Takes sample 3 layout items S3-1 to S3-5 in parallel with
  Opus, under the same section 8 rules. Then sample 2 items S2-1 to S2-3.
- **Hermes / DeepSeek Flash (mechanical).** Runs first, before any layout work:
  C1 metas, C2 and C3 copy sweeps, S8 captions on all three samples, the live
  crawl extension, the screenshot sets, and the gate runs.

One builder per sample directory at a time. Do not edit a sample another
builder has open. Commit and push after every cycle.

## Read, in this order

1. `STATE.md` (rules, URLs, QA commands, current state)
2. `PLAN-CONTENT-STRATEGY.md` sections 8 and 9 (the bar and the defect list), then 2.0 (shared blocks S1 to S8)
3. `FACTS.md` (every number; never invent)
4. `docs/research/emp-noma/PLAN.md` (the extracted tokens)

`HANDOFF.md` and `SAMPLES.md` say to pitch sample 3 only. That is superseded.
All three samples are presented and Tricia picks. Their owner verdicts and
design bans still apply.

## Hard rules (unchanged)

- Facts only, from FACTS.md. Print 35 years. Never $0.00, never "Gallery Title", never "25+".
- Her photos only. AI restoration of her own files is allowed; invented food imagery is not.
- Static HTML, CSS and JS. No Tailwind, no React, no build step, no new dependencies, no WebGL.
- No Beexly, no proposal, no pitch, no $150 or $600 on her pages.
- No booking, no availability, no response-time promise. Quote requests only.
- Keep `[NEEDS TRICIA]` items out of the copy. The street address stays out until she confirms.
- Do not fix a defect by hiding the element. A clipped proof line is fixed by placing it, not by `display: none`.
- Do not claim a gate is green without running it. Paste the command and the result in the report.

## Order of work

### Step 1, mechanical (Hermes / DeepSeek), all three samples

1. C1: replace the `description` meta on all 15 pages from plan 4.1. Match the tag by attribute name; sample 3's attribute order differs.
2. C2: apply the S8 captions to every `figcaption`, `data-caption` and `aria-label` that carries a mood caption. Then sweep every visible string in kill-list item 15 ("gather" as noun or verb) and C3 ("enquire", "enquiry").
3. Alt text: literal, food named, per S8. Keep `[VERIFY PHOTO]` drafts as written unless the photo shows otherwise.
4. Extend `tools/e2e-live-sample3.py` to take a base URL and run it against all three hosts.
5. Run `test_content.py` and `test_content_browser.py` per sample. Fix any string the tests expect that the sweep changed.
6. Commit: `chick-goodies: metas, captions, copy sweep (plan 9.1)`.

### Step 2, layout (Opus on sample 1, GLM-5.2 on sample 3)

Work the section 9 items in the order listed. For each item:

1. Reproduce it at the width named (390, 1440 or 1920) with a screenshot before.
2. Fix it in the concept's own CSS and markup, under the section 8 rules.
3. Screenshot after, same width. Check the fix at all six widths in rule 5.
4. Run the concept's gate (STATE.md QA commands).

Sample 1 order: S1-1, S1-9, S1-2, S1-5, S1-6, S1-4, S1-3, S1-7, S1-8.
Sample 3 order: S3-1, S3-2, S3-3, S3-5, S3-4, S3-6.
Sample 2 (GLM-5.2 after sample 3): S2-1, S2-2, S2-3.

Then the hero pass from 8.3 on samples 1 and 3. Sample 2's hero stays.

### Step 3, gates (mechanical), then deploy, then re-crawl

1. G1 to G5 per sample. `tools/inspect-overflow.py` and `tools/layout-check.py` exist; extend one to assert no element overlaps another element's text box at 390, 768, 1440 and 1920 on all five pages, and to fail on any horizontal scroll.
2. Deploy each sample from its directory with `vercel deploy --prod --yes`.
3. Re-crawl the live hosts. Capture 390 and 1440 screenshots of all 15 pages into each sample's `test-output/`.
4. Commit and push.

### Step 4, report

Write `docs/PRESENTATION-REPORT.md` with one table per sample: gate, command run, result, evidence path. Then a list of anything left open, each with the reason. No adjectives. If a gate is red, say so and say why. Garrett runs the presentation gate (plan 9.6) himself before sending links.

## Stop conditions

- A fix needs the concept redesigned rather than corrected. Stop, write it in the report, move to the next item.
- A fix needs a claim that is not in FACTS.md. Tag it `[NEEDS TRICIA]` and leave the copy out.
- A gate cannot run (missing tool, missing browser). Report it. Do not mark it green.

## Definition of done

All six gates green on all three live hosts, screenshots committed, report written, everything pushed to origin. Then stop. Garrett presents. Tricia picks. The winner gets the next pass (photo restoration, structured data validation, the remaining `[NEEDS TRICIA]` copy).
