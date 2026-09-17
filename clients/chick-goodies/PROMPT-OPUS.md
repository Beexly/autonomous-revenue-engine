# PROMPT — Opus: make the three Charcuterie Chick samples presentable, without asking

You are Opus, design lead on `clients/chick-goodies` in `Beexly/autonomous-revenue-engine`, running on Garrett's machine. Garrett is away. Nobody will answer questions. Decide, log the decision, move on. Your finish line: three live URLs Tricia can pick from, each passing the six gates below, plus one report.

## 0. Land the plan (two minutes)

```
git fetch origin && git checkout main && git pull
git merge --no-edit origin/claude/nice-franklin-kpjbpf && git push -u origin main
```

That lands STATE.md, PROMPT-BUILDERS.md, PROMPT-OPUS.md and PLAN-CONTENT-STRATEGY.md sections 8 and 9. PR #51 closes itself as merged. If the merge conflicts, keep the branch's version of those files.

## 1. Read, in this order, then start. Do not re-audit.

1. `clients/chick-goodies/STATE.md`
2. `clients/chick-goodies/PROMPT-BUILDERS.md`
3. `clients/chick-goodies/PLAN-CONTENT-STRATEGY.md`: section 8 (design bar), section 9 (verified defects and gates), section 2.0 (shared copy blocks S1 to S8)
4. `clients/chick-goodies/FACTS.md`
5. `clients/chick-goodies/docs/research/emp-noma/PLAN.md` (measured tokens)

Ignore "sample 3 only" in HANDOFF.md and SAMPLES.md. All three ship. Their design bans still apply.

## 2. Rules that end the job if broken

- FACTS.md or nothing. Print 35 years. Never $0.00, never "Gallery Title", never "25+". No booking, availability or response-time claims. No street address until Tricia confirms.
- Her photos only. Restoring, cleaning or upscaling her own files is allowed. Never generate food. Never use the quarantined hashes in ASSETS.md.
- Static HTML, CSS and JS. No Tailwind, React, build step, new dependency, WebGL or video.
- No Beexly, no proposal, no pitch, no prices for our work on her pages.
- Never fix a defect by hiding the element. Never mark a gate green you did not run.

## 3. Method (this is the part that has been missing)

Design quality on this job is subtraction and measurement, not invention.

a) Tokens first. Per concept, write a 15-line token sheet at the top of its CSS: two typefaces, one accent, one paper, one ink, a six-step type scale, a three-step section scale, hairline 0.67 to 1px, one radius value or zero, no shadow. Every rule on the page must resolve to those tokens. Delete rules that do not.

b) Subtract. Remove every decoration that touches text or a photo at 360, 390, 768, 1024, 1440 and 1920 (section 8, rule 5). When in doubt, remove. Air is the design.

c) Photographs are objects. `object-fit: contain` on a void, at or under native pixels, in a frame that belongs to the grid, never absolutely positioned over copy.

d) One hero per concept, composed to section 8.3. Sample 2's hero stays.

e) Loop per defect, in the section 9 order: screenshot at the named width, fix, screenshot again, run the concept's gate, commit as `chick-goodies <sample>: <defect id> <what changed>`. One commit per defect so any one can be reverted alone.

f) After a sample passes all six gates: deploy it (`vercel deploy --prod --yes` from the sample directory), re-crawl the live host, commit the screenshots, push. Garrett can send that link while you work on the next sample.

Where the bar leaves room, the creative move is composition: how the photograph and the headline share the screen, the rhythm of the numbered sections, the total as the biggest thing on the quote page. Spend creativity there, never on effects.

## 4. Order

1. Mechanical, all three samples (30 to 45 minutes): C1 metas, C2 and C3 copy sweep, S8 captions and alt text, extend `tools/e2e-live-sample3.py` to take a base URL.
2. Sample 2 (fastest to presentable): S2-1 to S2-3, gates, deploy.
3. Sample 3: S3-1 to S3-6, then the 8.3 hero, gates, deploy.
4. Sample 1: S1-1, S1-9, S1-2, S1-5, S1-6, S1-4, S1-3, S1-7, S1-8, then the 8.3 hero, gates, deploy.
5. Report.

## 5. Gates (all six, per sample, on the live host)

- G1. No horizontal scroll, no element overlapping another element's text box, nothing clipped, no decoration touching text or a photo, at 390, 768, 1440 and 1920, on all five pages. Extend `tools/inspect-overflow.py` or `tools/layout-check.py` to assert this.
- G2. Zero strings from section 9.1 C2. "gather" at most once per site. "enquire" and "enquiry" absent from visible text.
- G3. 15 unique titles and 15 unique metas matching section 4.1.
- G4. Existing suites green: `tools/quality-gate.py --sample` for samples 2 and 3, `samples/sample-1-editorial/qa_garden_pw.py`, and `python -m unittest test_content test_content_browser` in each sample directory.
- G5. Quote flow: the ?menu, ?table and ?occasion prefills work, the draft carries table, guests and date, the six totals in STATE.md reproduce, and tel, sms and mailto links open.
- G6. Deployed, re-crawled live, 390 and 1440 screenshots of all 15 pages committed under each sample's `test-output/`.

## 6. Decisions you make without asking (pick the one closest to section 8, log it)

- Sample 1 menu, tabs or stacked panels: tabs only if they work before JS runs; otherwise stacked, with the tab row removed.
- Ring, thread, botanical glyph, 3D scene: keep at most one per concept, only in empty space; otherwise delete it.
- Copy inside the plan's example lines: use as written. If a line does not fit the layout, shorten it. Never add a claim.
- Captions: name what is in the photo. If you cannot tell the dish, name what you can see ("cheese cubes, salami, blackberries"). Never guess.
- Photo restoration: her files only, only when a hero photo is the visible weak point, and commit the original first.

Log every decision in the report in one line: what, why, where.

## 7. Stop conditions (write it in the report, skip the item, continue)

- The fix needs the concept redesigned rather than corrected.
- The fix needs a fact that is not in FACTS.md.
- A gate cannot run.

Never stop the whole job for one item.

## 8. Report and finish

Write `clients/chick-goodies/docs/PRESENTATION-REPORT.md`: one table per sample (gate, command, result, evidence path), the decision log, anything left open with the reason, and the three live URLs. No adjectives. Commit and push. Then stop.

Definition of done: six gates green on three live hosts, screenshots committed, report pushed. Garrett runs the five-minute presentation gate (section 9.6) and sends the links.
