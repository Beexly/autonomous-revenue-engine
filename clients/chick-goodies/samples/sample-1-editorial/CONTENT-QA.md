# Content strategy handoff: samples 1 and 2

Implemented sections 2.1/2.2 and visible S1-S7 from the linked raw content strategy. Writes limited to sample-1-editorial and sample-2-after-dark. No deploy, commit or push.

## Verified execution
- `python test_content.py`: failed before implementation (old navigation, missing proof); passed after.
- `python test_content_browser.py`: initially failed for missing prefills, hidden no-JS menu, name/venue absent from draft, and sample-1 mobile navigation overflow; passed after fixes.
- Additional draft-wording regression failed on `a a wedding`, then passed after repair.
- Final `python -m unittest -v test_content test_content_browser`: 6 tests passed.
- Browser tests cover both concepts at 390/1440, all five pages, menu/table/occasion query prefills, static menu visibility, optional-name draft generation, seven calculator totals including selected extra time, invalid counts and custom-quote state.
- `python qa_garden_pw.py`: all 20 page/viewport captures generated, zero recorded JS console errors; menu panel grid, lightbox open/close, form draft, email URI and navigation checks successful.
- Sample-2 `python quality-gate.py`: passed true, 10 page/viewport checks, failures []. Includes axe WCAG AA, overflow, images and local links.
- `git diff --check` on the two sample directories passed after removing an extra trailing blank line (only Git LF/CRLF warnings).
- Compared against HEAD: all ten HTML heads unchanged; all existing image alt/captions retained. Five SVG act-number watermarks retained with viewBox spelling preserved.

## Deliberate honesty deviations / remaining owner decisions
- Street address omitted pending approval. Footer uses Tomball, TX.
- Spanish appears as business-level footer capability, not a personal claim.
- Unsupported continuous-serving language replaced with the verified 90-minute duration.
- FAQ explicitly requires the customer to send the draft; nothing auto-sends.
- Sample 1 has no calculator and makes no numeric-estimate claim.
- Sample 2 reassurance includes selected extra time and estimated tax on food + setup + extra time, and asks Tricia to confirm the tax basis.
- Rating lines use FACTS; parent verifies counts. Quoted testimonials link to Shopify, not third-party listing attribution. The Shopify URL has a testimonials fragment; verify the live section anchor before publishing.
- SEO/JSON-LD/sitemap and existing image alt/caption refresh deliberately left to parent. Existing theatre/mood words inside captions therefore remain for that pass.
- Existing build_garden.py/build_midnight.py are legacy generators and were not run or synchronized; rerunning them would overwrite direct HTML content changes.
- Existing QA writes generated screenshots/JSON inside each sample's test-output directory. No shared files were edited by this subtask.
