# Sample 3 — the gathering menu

Surface: Decide / Learn, with an Explore menu and an estimate as the final action.
Art direction: a cream-paper invitation with a large serif lockup, real photographs at native size, an ink-green menu folio, and an oversized itemized restaurant bill.

## Evidence and scope
- Fresh Chromium navigation of the live sample, EMP and Noma succeeded. Computed values are in computed.json; screenshots are evidence, not proof of visual approval.
- Noma body: #f9f9f3 / #29382b; 18px / 32.4px. Retain these reference values; use freely available EB Garamond rather than an unlicensed commercial face.
- EMP principle: photographs as contained objects, not upscaled backgrounds. Fine 0.67px declared rules; browser rasterization may round these.
- Existing sample is a centered logo cover followed by five near-identical full-height panels. No food visible on opening. Its quote UI calls nonexistent methods/fields from engine.js and can throw before binding enquiry buttons.
- Output: samples/sample-3-studio/index.html, studio.css, studio.js; mirror into site/. Samples 1 and 2 untouched. No proposal. Deployment to both existing projects.

## Sections / implementation spec
1. Invitation: original logo in the header, revised typographic Charcuterie / Chick lockup with a double-rim plate, real knot-hero photograph, locality and menu/estimate anchors. Wide asymmetric grid; stacked below 800px. No photo exceeds intrinsic dimensions. One h1.
2. Five tables: green menu folio, native details/summary numbered 01–05. Open state contains verified inclusions and a choose-table anchor. A single adjacent photograph updates with the menu; generic event-photo captions avoid claiming these depict exact packages. No auto-rotation. Fully readable without JS.
3. Host letter: original logo, owner photo, plain biography grounded in FACTS.md, smaller real food still. Airy asymmetric composition, not a second split hero.
4. Estimate: prominent total and itemized food/setup/tax; table selector, guest stepper, 90-minute service note. Holy Grail supports only the two published counts, not invented intermediate tiers. Exact cents; integer guest validation. Explicitly disclose the assumption that tax applies to food plus setup. Tricia confirms tax, availability and final quote. Date/name/notes optional inside progressive enquiry disclosure. Text/email compose only; copy fallback with honest status.
5. Closing: locality, public business call/email/Instagram, original logo. No invented hours, credentials, social proof or promises of automatic replies.

## QA
Browser desktop 1440, mobile 390 and narrow 320; no overflow, images loaded, no console errors, one h1, metadata lengths, native image-size caps, keyboard interactions and open menu states. Verify quote boundary cases and message contents. Run HTML validation and local URL asset status checks. Deploy twice, verify public responses and byte parity of build files, push every commit.

## Photography constraint
Only existing client-provenance assets. Image-description tool returned unavailable; do not pretend a visual review succeeded. DOM layout and real browser screenshots remain available for geometry checks. No AI/stock assets or webGL.
