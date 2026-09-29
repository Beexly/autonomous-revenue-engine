# Patent Mining: Autonomous Revenue Engine + Galaxy Sports Edge
**Research date:** September 29, 2026 · **Lane owner:** Motif (patent-mining subagent) · **Scope:** expired/abandoned patents only

> **Doctrine check (Garrett, standing).** The premise that abandoned patents are "literal gold" is rejected. Most lapsed patents died for legitimate reasons — hardware capital requirements, commoditization, acquisition absorption, or supersession by better methods. This report filters ruthlessly and marks what was actually tested. Per **WE INGEST, WE LEARN**: nothing below is declared "dead" without citation; untested items are marked **UNTESTED — QUEUED FOR EVALUATION**.
>
> **Legal-status caveat.** Google Patents states its legal statuses are assumptions, not legal conclusions. Every status below is the *displayed* status as observed on 2026-09-29, cited with its link. **Expiration or abandonment of one old patent does NOT establish present freedom to operate** — families, continuations, newer patents, trademarks, and regulations all still need review before any build.
>
> **Reinterpretation rule.** The usable leg in nearly every case is software/service, not the original hardware. Where the modern version is a different product than the patented claims, the report says so plainly.

---

## PART 1 — AUTONOMOUS REVENUE ENGINE (ranked)

### A1. Peel-and-stick overlay print personalization → Vow & Post "stock + overlay" kits
- **Patent:** US6800167B1 — *"Printing system for generating personalized memorial items, and method for generating such items"*
- **Displayed status (2026-09-29):** Expired – Lifetime, adjusted expiration 2022-12-30 ([Google Patents](https://patents.google.com/patent/US6800167/en))
- **What it actually teaches:** Mass-produced stock-printed blanks (memorial cards) + a software template where the user types personalization fields + the home/office printer prints them onto peel-and-stick labels whose colors/backgrounds are coordinated to visually *blend into* the preprinted stock, so the result looks professionally printed.
- **Honest failure read:** This is a **lifetime-expiration case, not necessarily a failure**. The 2002-era method aged out through normal 20-year term completion. The original product was also tied to a niche funeral-supply company with limited distribution and desktop-era software. The *method* outlives the business model.
- **ARE implementation (no inventory version):** A Vow & Post digital product line — "stock blank + overlay template" kits for weddings/events: the shop (or couple) buys professionally printed blank stock once (or via a print partner), and the kit provides color-matched printable overlay templates (names, dates, table numbers, favor tags) designed in-browser with print-ready output. Sell the *template pack* ($29–79 digital download) and/or the design service ($150 package, already priced in the ARE offer). Tech stays invisible; sell the craft, never "AI wedding signs." (Funeral applications possible but require restrained, service-first positioning — do not exploit grief; the wedding/event transfer is the clean angle.)
- **Agent-fleet build effort:** 2–3 weeks — template engine on the existing SignPreview design tooling + color-matched print-PDF export + a small storefront page.
- **Revenue shape (no invented economics):** one-time digital template-pack sales; design-package upsells at existing $150 price point; optional recurring "new seasonal template drop" buyers. Near-zero marginal cost after build.

### A2. Modular sign planner + panel asset tracker for sign shops → SignPreview B2B
- **Patents:**
  - US6150996A — *"Changeable message sign system with reconfigurable sign screen"* — displayed **Expired – Lifetime**, anticipated expiration 2018-08-26 ([Google Patents](https://patents.google.com/patent/US6150996A/en))
  - US7495576B2 — *"Modular electronic sign and method of assigning a unique identifier to common modules of said sign"* — displayed **Expired – Fee Related** ([Google Patents](https://patents.google.com/patent/US7495576B2/en)); teaches per-panel unique IDs, on-board module memory, "virtual screen" rendering, and point-and-click panel identification for repair/replacement
- **What they actually teach:** Big signs built as assemblies of standardized, individually addressable modules; each module carries a unique identifier so the system knows which panel is where and a failed panel can be swapped and re-identified without reprogramming the whole sign.
- **Honest failure read:** Lifetime expiry (US6150996A) is normal term completion; US7495576B2 lapsed early on fees — two *individual* inventors, so the business behind it likely died or pivoted, not the concept. The physical LED-module business was capital-heavy (hardware, weatherproofing, install, service).
- **ARE implementation (software only — never manufacture panels):** A SignPreview B2B feature for local sign shops: **modular sign planner** — input wall/opening dimensions, viewing distance, sign type, and standard panel/module sizes; the tool generates valid panel layouts, material quantities, installation diagrams, and customer quotes. Pair it with the unique-ID concept as **panel asset tracking** — every installed panel gets a QR asset tag; the shop tracks installs, warranties, and replacement history per panel. This is the $150 design-package and B2B shop-embed upsell, not a hardware product.
- **Agent-fleet build effort:** 3–4 weeks — layout solver + quote engine + QR asset registry.
- **Revenue shape:** per-design fees at existing price points; recurring SaaS shape for shops ($49/mo-style asset-tracking tier) only after a shop validates the free planner.

### A3. Single-source menu/price board sync for restaurants → Kit add-on
- **Patent:** US20040177004A1 — *"Digital advertisement board in communication with point-of-sale terminals"* (Walker Digital) — displayed **Abandoned** ([Google Patents](https://patents.google.com/patent/US20040177004A1/en)). Teaches a back-office/POS server that manages and disseminates price, menu, inventory, and advertising information across displays, POS terminals, and web pages, so a price change propagates everywhere instead of requiring third-party graphics rework.
- **Honest failure read:** Never granted (abandoned application), so this is *prior art that never became a right* — the problem statement is the valuable part. Walker Digital was a patent-licensing shop, not a product company; it monetized the idea through litigation portfolios, not by serving restaurants.
- **ARE implementation:** A Kit upsell for restaurants: **one spreadsheet/source of truth** for menu items and prices that updates the website menu page, the QR table-tent menu, and the printable in-store board simultaneously. No hardware, no POS integration — the owner edits one form, everything re-renders. Note the family hazard: the timeline shows continuations including **US7841514B2 (granted)** — any implementation must steer clear of POS-server claim language and stay a pure small-business web-menu sync tool.
- **Agent-fleet build effort:** 2 weeks — menu CMS module on Kit sites + QR menu page + print stylesheet.
- **Revenue shape:** one-time setup add-on on the $350 Kit website (e.g., +$100–150 menu-sync build) or small recurring care-plan tier for seasonal menu updates.

### A4. "Kit LiveBoard" — QR/NFC-triggered updatable signage layer for local businesses
- **Patent:** US20080198098A1 — *"Electronic sign"* (Metrologic Instruments) — displayed **Abandoned** ([Google Patents](https://patents.google.com/patent/US20080198098A1/en)). Teaches bi-stable (e-ink-style) display cards/labels with unique identifiers, wireless mesh updating, RFID integration, and location/proximity sensing so a sign's content changes when it is moved or approached.
- **Honest failure read:** Abandoned in 2008 — the same year Honeywell acquired Metrologic. This is an *acquisition-absorption* lapse, not a technical verdict. The concept itself (remotely updatable price cards) became the commodity electronic-shelf-label industry; the hardware play is now owned by incumbents.
- **ARE implementation (software only):** Take only the *problem framing* — uniquely identified signs whose content can be updated remotely and triggered by proximity — and implement it with zero hardware: a printed QR/NFC table tent or window sign whose linked page updates daily (specials, hours, prices). The customer taps or scans; the business edits one dashboard. This is a Kit upsell ("your static sign now behaves like a live one") with no e-ink, no mesh networking, no inventory.
- **Agent-fleet build effort:** 1–2 weeks — Kit module for QR-linked live pages + NFC tag template + edit dashboard.
- **Revenue shape:** setup add-on on Kit sites; small monthly care-plan shape for businesses that change specials frequently.

### A5. Multi-location sign campaign version control → "sign fleet manager"
- **Patents:** US7495576B2 (unique module IDs, above) + US20080198098A1 (remote update mesh, above).
- **What it teaches (combined):** Give every sign/asset a unique ID, push content to all of them from one source, and know exactly which version each location is showing.
- **Honest failure read:** Same as A2/A4 — the hardware parents are dead; the *coordination problem* they were solving is real and unaddressed for small chains.
- **ARE implementation:** A lightweight service for multi-location local businesses (3–10 locations): one campaign source generates the synchronized website banner, printable counter sign, window sign, QR landing page, and TV-menu asset per location; the dashboard tracks which location has which version and **flags stale promotions** (expired prices, ended campaigns). The moat is the version-control discipline, not IP.
- **Agent-fleet build effort:** 3 weeks — campaign template engine + per-location version registry + staleness alerts.
- **Revenue shape:** recurring small-business SaaS shape ($29–79/mo per chain) — validate with one real multi-location client before building.

---

## PART 2 — GALAXY SPORTS EDGE (ranked)

GSE's rule (2026-09-28): the public site shows **only projections and rankings**; all signals, methods, metrics, and model internals stay private. Everything below is **internal capability**, not a public product. GSE also does not manufacture hardware — the sensor/wearable concepts below were mined and mostly killed for that reason (findings recorded, hardware rejected).

### G1. Automated field-anchored telestration for the X video pipeline
- **Patent family (all displayed Expired – Lifetime as of 2026-09-29):**
  - US7075556B1 — *"Telestrator system"* ([Google Patents](https://patents.google.com/patent/US7075556B1/en))
  - US5953077A — *"System for enhancing video presentation of an event"* (anticipated expiration ~2017)
  - US6133946A — *"Method for determining the position of an object"*; US6292130B1 — *"Method and apparatus for determining the speed and/or timing of an object"*; US6229550B1 — *"System for blending a graphic"*; US6466275B1 — *"System for enhancing a video presentation of an event with event information"*
  - (The classic Sportvision/FOX virtual-first-down-line lineage — confirmed by the field-line/camera-sensor descriptions in the abstracts.)
- **What it teaches:** Smooth drawn paths; transforming annotations into *field coordinates* and reprojecting them into later frames/cameras so graphics stay pinned to the field during pans and zooms; blending graphics without obscuring players.
- **Honest failure read:** **Not a failure — normal term completion of foundational broadcast infrastructure.** This became the virtual first-down line every viewer sees. The expired claims covered the 1990s implementation (camera sensors + keyed graphics hardware); the *geometric core* (field-coordinate anchoring) is free to re-implement with modern commodity CV.
- **GSE implementation:** Detect field geometry (yard lines, hash marks) from broadcast frames → homography to field coordinates → anchor arrows/routes/zones to the field during camera moves → segment players so annotations pass behind/around them → output 2–4 second transformative clips with analyst narration. This directly serves Garrett's standing video rule (real footage, short, telestrated, commentary-led — never an AI-slideshow substitute). **UNTESTED — QUEUED FOR EVALUATION** until a prototype runs on real broadcast footage.
- **Agent-fleet build effort:** 3–6 weeks — field-line detector + homography + player segmentation + render pipeline (OpenCV/Python; no new hardware).
- **Revenue shape:** indirect — higher-quality X content → follower growth → the monetization lanes (affiliate, betting-content) that depend on audience; also internal film-study tooling. No public product claims.

### G2. Classical football play segmentation + play-type classification (automated clip harvesting)
- **Patent family (all displayed Expired – Fee Related as of 2026-09-29):**
  - US7499077B2 and US7312812B2 — *"Summarization of football video content"*
  - US7639275B2, US7474331B2, US8018491B2 — continuations, same title ([family view](https://patents.google.com/patent/US7312812))
  - Abandoned siblings US20050117021A1, US20050128361A1, US20050138673A1, US20080109848A1 — place-kick vs. regular-play classification, camera-type cues
- **What it teaches:** Detect football play segments automatically — infer snap/start and dead-ball/end boundaries using field-color calibration, low-level visual features, motion, and scene changes; classify place kicks vs. regular plays by which camera (end vs. side) is framing the shot.
- **Honest failure read:** Early fee lapse — Sharp Labs America's video-research program wound down; the handcrafted feature pipeline was superseded by deep learning. The methods didn't fail commercially so much as the lab stopped paying to maintain them.
- **GSE implementation:** Use the classical pipeline as a **cheap first-stage prefilter** — cut full games into candidate play clips and discard commercials/replays/dead time before running expensive modern detectors. Modern models (OCR on scoreboard/clock, audio whistle detection, pose) then refine snap/whistle boundaries and down/distance. Output: play-indexed internal film clips linked to game, quarter, clock, down/distance, personnel — feeding both the content pipeline and model feature labeling. Play-type classification (kick vs. regular) is a free weak label from camera behavior. **UNTESTED — QUEUED FOR EVALUATION.**
- **Agent-fleet build effort:** 1–2 weeks for the classical prefilter; the modern refinement layers ride existing CV work.
- **Revenue shape:** indirect — analyst labor saved on film processing; faster content turnaround; structured play clips as internal model features. No public product.

### G3. Replay-segment identification (live vs. replay discriminator)
- **Patents:** US7474698B2 / US7653131B2 — *"Identification of replay segments"* (US20060083304A1); sibling to the Sharp summarization family. Granted 2009-01-06 — expected **Expired – Lifetime** by the 20-year term from the ~2006 filing (verify displayed status on Google Patents before use).
- **What it teaches:** Distinguish replay segments from live play in broadcast sports video — essential because replays double-count plays and corrupt automated highlight/event pipelines.
- **GSE implementation:** A dedicated replay discriminator in the clip-harvesting pipeline: never let a replay be indexed as a new play; conversely, route replay angles to the telestration pipeline (G1) where alternate angles are most valuable. **UNTESTED — QUEUED FOR EVALUATION.**
- **Agent-fleet build effort:** ~1 week as a module inside G2's pipeline.
- **Revenue shape:** indirect — data hygiene for everything downstream (content + models).

### G4. Vanishing-point broadcast-camera calibration (the geometric brick under G1/G2)
- **Patent:** US20060132487A1 — *"Method of analyzing moving objects using a vanishing point algorithm"* — application, never granted (abandoned).
- **What it teaches:** Use field-line vanishing points to recover camera geometry from broadcast video without instrumenting the camera — the calibration step everything else depends on.
- **GSE implementation:** Not a standalone product — the calibration front-end for G1 (field homography) and G2 (field-color masking). Abandoned-application status means it is pure prior art; the method is implemented from scratch with modern line detectors. **UNTESTED — QUEUED FOR EVALUATION.**
- **Agent-fleet build effort:** ~1 week prototype inside G1.
- **Revenue shape:** indirect — accuracy foundation for G1/G2.

### G5. Other-sport summarization siblings — parked, on file
- **Patents:** US7143354B2 (*"Summarization of baseball video content"*), US7657836B2 (*"Summarization of soccer video content"*), US7120873B2 (*"Summarization of sumo video content"*) — same Sharp Labs lineage; baseball/soccer siblings presumed fee-lapsed like the football members (verify displayed status if ever activated).
- **Honest read:** Same cheap-prefilter technology, different sports. GSE's focus is NFL/NCAA; MLB/soccer lanes are back-burnered by Garrett's directive. Kept on file, not built.
- **Revenue shape:** none while parked.

### GSE sensor/wearable mining — findings (no builds)
- **US6148262A** — *"Sports computer with GPS receiver and performance tracking capabilities"* — displayed **Expired – Lifetime** ([Google Patents](https://patents.google.com/patent/US6148262A/en)). The original GPS sports watch (1996/2000). **Killed as hardware** — Garmin/Apple/Whoop commoditized it a decade ago. The residue is strategic, not a product: GPS performance traces are now commodity data available via APIs — GSE should *ingest* traces, never build wearables.
- **US8520946B2** — Intel *"Human pose estimation in visual computing"* — displayed **Expired – Fee Related** (lapsed early). Handcrafted tree-structured pose estimation. **Killed** — deep learning (OpenPose/MediaPipe, free and open) superseded it completely; no modern leg remains. Noted as prior art only.
- **US7650256B2** — *"Method and apparatus for locating the trajectory of an object in motion"* — displayed **Expired – Fee Related**. Sensor arrays measuring object trajectory/speed (pitcher's mound → strike zone). **Killed for GSE** — hardware arrays, baseball-oriented, no lane fit; GSE works from video, not sensor installations.

---

## PART 3 — KILL LIST (30 killed, with reasons)

**ARE / signage / product territory:**
1. **US10026313B2** (DSRC-equipped portable changeable sign) — **Active** (~2035). Hardware + road-safety regulatory context. Kill.
2. **US7337569B2 / US7886467B2** (portable sign-frame assembly) — expired-lifetime parent, but continuation possibly active through ~2026-06-01, commodity A-frame hardware, and active competitors hold related sign-frame IP (e.g., US10,672,305). Kill.
3. **US8287404B2** (programmable ball-throwing apparatus) — expired-lifetime, but motors/launch safety/inventory/tooling; wrong lane entirely. Kill.
4. **US7881970B2** (removable keepsake photo frame on delivered orders) — expired fee-related; cumbersome physical gimmick, heavily commoditized; only salvageable as zero-inventory printable/QR keepsake, and even that isn't patent-derived. Kill.
5. **Baseball swing/batting devices** (US6142889A, US9144726B2, US7775914B2, US7674194B2, US5709619A, US3578801A) — expired, but crowded commodity hardware with safety testing, tooling, and inventory. Kill collectively.
6. **Trading-card holders/displays** (US5046616, US5186566, USD346829, USD392467, USD393875, USD575147) — expired design patents in a commodity category with trivial price points and patent-pending 3D-printed competitors. Kill.
7. **US7650256B2** (trajectory sensor arrays) — expired fee-related; hardware sensor installations, no software leg for a zero-capital operation. Kill.
8. **US6148262A** (GPS sports watch) — expired-lifetime; commoditized by Garmin/Apple; ingest traces, don't build. Kill.
9. **US8520946B2** (handcrafted pose estimation) — expired fee-related; deep pose is free and better. Kill.
10. **Loyalty-program patents** (US20250094880A1 and family — active/pending; older abandoned loyalty applications) — nothing expired worth building on; loyalty mechanics carry abstract-idea risk. Kill.
11. **Wedding-sign hardware** (Etsy saturation observed; patent-pending LED/acrylic competitors) — Vow & Post stays digital/printable/craft-first, never manufactured hardware, never marketed as "AI wedding signs." Kill the hardware entry.
12. **Electronic shelf-label hardware** (the Metrologic concept as hardware) — commodity ESL industry owned by incumbents. Kill as product; only the software reinterpretation (A4) survives.

**GSE / sports-analytics territory (active or pending — used as controls):**
13. **US11135495B2** (Trackman projectile-flight illustration) — **Active** (~2030). Specialist radar/imaging hardware. Kill.
14. **US10417500B2** (Disney automatic sports highlights) — **Active** (~2037). Kill.
15. **US10019630B1** (SAP dynamic classification for sports analysis) — **Active** (~2037). Kill.
16. **US10445930B1** (event detection, ML) — **Active** (~2034). Kill.
17. **US11710317B2** (event-based sports data) — **Active** (~2041). Kill.
18. **US11436834B2** (image analysis for sports) — **Active** (~2041). Kill.
19. **Nike team-sports monitoring family** (US10123583B2, US9403060B2, US9427624B2, US9192815B2) — **Active**; proprietary sensor inputs GSE doesn't have. Kill.
20. **US11348255B2** (tags + optical tracking fusion, gait properties) — granted 2022, active. Kill.
21. **US10521526B2** (athletic performance assessment/prediction) — granted 2020, active. Kill.
22. **US20230397891A1** (ear-wearable head-injury devices) — **Pending**; medical/safety risk. Kill.
23. **US20150223542A1** (brain-damage prevention device) — abandoned but safety-critical helmet hardware with likely active Guardian IP around it. Kill.
24. **US20200121986A1** (athlete vital-sign monitoring) — abandoned; generic Bluetooth physiology, crowded; private health data, validation, sensor access. Kill.
25. **WO2021186415A1** (injury-risk prediction) — PCT ceased but US publication and national filings exist; ceased-PCT ≠ worldwide clearance. Kill unless the full national family is verified.
26. **US20230123369A1** (baseball hitting trainer) — pending. Kill.
27. **WO2007035878** (ball trajectory from video) — WIPO ceased, no US grant found; thin substance. Kill.
28. **US20080192116A1** (multi-camera real-time sports object tracking) — application with claims 1–61 canceled; hardware-heavy, superseded by commercial tracking vendors. Kill.
29. **US20240161318A1** (tennis swing analysis) — abandoned; niche hardware. Kill.
30. **US20250094880A1** (loyalty, pending) — pending, abstract-idea territory. Kill.

**Total killed: 30.**

---

## PART 4 — CROSS-CUTTING HONESTIES

1. **Lifetime expiration ≠ failure.** US6150996A, US7075556B1, US5953077A, US6800167B1, US6148262A, US8287404B2 all expired through normal 20-year term completion. Several (telestration, GPS watch, ESL concept) *won* commercially and aged out. The opportunity is in what the expiry frees, not in a failure narrative.
2. **Early fee lapse = maintenance stopped, not concept disproven.** US7495576B2, US7499077B2, US8520946B2, US7650256B2 — the owners stopped paying; the labs shut down or pivoted. Treat the teachings as available, the business read as "unknown."
3. **Abandonment is not freedom to operate.** US20040177004A1's family includes a granted continuation (US7841514B2); US7337569B2's continuation was live through ~2026-06-01. Every shortlist item needs a family/continuation review before a build decision.
4. **Hardware is out of scope for both lanes.** ARE is a near-zero-capital software/service operation; GSE builds no devices. Every surviving idea is a software or service reinterpretation.
5. **GSE's value here is internal leverage, not new public products.** The public site shows projections/rankings only. These patents buy cheaper film processing, better content, and cleaner training data — the revenue shape is audience growth and analyst-hours saved, never invented forecasts.
6. **No hype.** Revenue shapes above are shapes (add-on fees, template packs, micro-SaaS tiers, labor saved), not projections. Nothing in this report claims a patent guarantees an outcome.

---

## PART 5 — RECOMMENDED NEXT STEPS

1. **Family/continuation review** on all shortlist items (A1–A5, G1–G5) before any build — especially US20040177004A1 (US7841514B2) and the US7337569B2 continuation.
2. **Prototype G2's classical prefilter** first (1–2 weeks, cheapest test) — if play-boundary detection works on real broadcast footage, it unlocks G1, G3, and G4.
3. **Prototype G1's field-line homography** on real NFL broadcast frames — the telestration pipeline is the highest-value GSE item and the direct enabler of the real-footage content rule. Mark **UNTESTED — QUEUED FOR EVALUATION** until then.
4. **Vow & Post template-pack MVP** (A1) — the cheapest ARE test: one color-matched overlay kit for wedding table numbers, sold as a $29–79 digital download.
5. **Validate A3/A5 with one real restaurant / one real multi-location business** before building — the Kit lane's rule is revenue before code.
