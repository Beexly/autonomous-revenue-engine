# ACTION_LOG

Operator cycle log. Counts that matter stay internal until publish path is enabled.

## 2026-09-15 (cycle 18)
- **Local cash rail opened: `clients/chick-goodies/`.** Full client file landed — `BRIEF.md` (client's requirements + acceptance criteria), `FACTS.md` (verified prices/facts, the only permitted source), `AUDIT.md` (12 findings against their live Shopify with evidence lines), `QUOTE.md` ($150 one-pager / $600 full site, quoted 2026-09-15), `SEO.md`, `WORKFLOWS.md`, `ASSETS.md`, and the working build in `site/`. Live demo: charcuterie-chick-showcase.vercel.app. Client is Tricia Holfelder, Charcuterie Chick, Tomball TX.
- **Defect found and quarantined:** four images in the Grok workspace (`public/chick/{board,cart,cups,graze}.jpg`) are byte-identical to `artifacts/imagine_images/*` — Grok Imagine output, not photographs of her food. The client's brief is "no AI feel, no AI junk". Hashes recorded in `clients/chick-goodies/ASSETS.md`; the build now uses her own photos only. Any of those hashes in a client-facing build is a defect.
- **Asset ceiling recorded:** her public photos max out at 480x640, so "higher-res pictures" is a photography deliverable, not an export setting. Camera-roll originals or one shoot required.
- **Growth stack recorded** in `ops/GROWTH_STACK.md` from the owner's pasted plan (40-repo OSS list, the 10 distribution/authority/retention repos, A–F architecture, self-host vs SaaS, deployment topology, target repo structure, 90-day flywheel + KPIs, event spec). Reality check appended: parts of it conflict with the $0-spend rule and must not be applied to client builds.
- Factory/local cash rail remains the priority; SO remains gated. Published SO posts: 0.

## 2026-09-12 (cycle 17)
- Confirmed SO-002 (47/60, proxy template present) and SO-005 (48/60, Burrows Delta before/after table present) remain Pass after prior required rewrites + full adversarial. No redo from scratch. Internal queue only. SO-001/004/007 remain Pass.
- Free-core niche remains locked: Viewport Hold / qi-check (`ops/EXPERIMENT_NICHE.md`). Experiment spec in place (no purchase, no payment flow). SO-008 stays Hold — not public copy until named public face ships.
- Profile asset specs remain locked (CRT phosphor avatar + radio-room banner) — candidate-only (`ops/PROFILE_SPECS.md`).
- Domain shortlist research continued: HTTP probes on viewporthold.com, qicheck.dev, firstscreen.dev, so-hq.com, signalorigin.com, getframefit.com, signal-origin.com returned 000/fail (inconclusive). holdscore.com returned 200 (parked lander redirect to /lander) — collision risk, deprioritize. signalorigin.com / .net collisions stand. No purchase. Owner verifies at registrar when ready.
- Measurement template for Premium/verified impression proxies remains locked (`ops/MEASUREMENT_TEMPLATE.md`). Daily revenue-score job still deferred (schema + intake + Learning loop not yet ≥7 consecutive days + synthesis).
- Published SO posts: 0. Publish path: disabled. Approved (qi-check Hold ≥ 9.2): none.
- Factory parallel continues as cash path; SO remains gated.

## 2026-09-09 (cycle 16)
- Confirmed SO-002 (47/60, proxy template present) and SO-005 (48/60, Burrows Delta before/after table present) remain Pass after prior required rewrites + full adversarial. No redo from scratch. Internal queue only. SO-001/004/007 remain Pass.
- Free-core niche remains locked: Viewport Hold / qi-check (`ops/EXPERIMENT_NICHE.md`). Experiment spec in place (no purchase, no payment flow). SO-008 stays Hold — not public copy until named public face ships.
- Profile asset specs remain locked (CRT phosphor avatar + radio-room banner) — candidate-only (`ops/PROFILE_SPECS.md`).
- Domain shortlist research continued: HTTP probes on viewporthold.com, qicheck.dev, firstscreen.dev, so-hq.com, signalorigin.com, getframefit.com, signal-origin.com returned 000/fail (inconclusive). holdscore.com returned 200 (parked lander redirect to /lander) — collision risk, deprioritize. signalorigin.com / .net collisions stand. No purchase. Owner verifies at registrar when ready.
- Measurement template for Premium/verified impression proxies remains locked (`ops/MEASUREMENT_TEMPLATE.md`). Daily revenue-score job still deferred (schema + intake + Learning loop not yet ≥7 consecutive days + synthesis).
- Published SO posts: 0. Publish path: disabled. Approved (qi-check Hold ≥ 9.2): none.
- Factory parallel continues as cash path; SO remains gated.

## 2026-09-08 (cycle 15)
- Confirmed SO-002 (47/60, proxy template present) and SO-005 (48/60, Burrows Delta before/after table present) remain Pass after prior required rewrites + full adversarial. No redo from scratch. Internal queue only. SO-001/004/007 remain Pass.
- Free-core niche remains locked: Viewport Hold / qi-check (`ops/EXPERIMENT_NICHE.md`). Experiment spec in place (no purchase, no payment flow). SO-008 stays Hold — not public copy until named public face ships.
- Profile asset specs remain locked (CRT phosphor avatar + radio-room banner) — candidate-only (`ops/PROFILE_SPECS.md`).
- Domain shortlist research continued: HTTP probes on viewporthold.com, qicheck.dev, firstscreen.dev, so-hq.com, signalorigin.com, getframefit.com, signal-origin.com returned 000/fail (inconclusive). holdscore.com returned 200 (parked lander redirect to /lander) — collision risk, deprioritize. signalorigin.com / .net collisions stand. No purchase. Owner verifies at registrar when ready.
- Measurement template for Premium/verified impression proxies remains locked (`ops/MEASUREMENT_TEMPLATE.md`). Daily revenue-score job still deferred (schema + intake + Learning loop not yet ≥7 consecutive days + synthesis).
- Published SO posts: 0. Publish path: disabled. Approved (qi-check Hold ≥ 9.2): none.
- Factory parallel continues as cash path; SO remains gated.
