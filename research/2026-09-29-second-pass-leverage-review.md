# Second-Pass Leverage Review — 2026-09-29
**What the first pass missed, what's under-leveraged, and what the data actually says.**
Integrates: patent-mining report (5 ARE + 5 GSE ideas, 30 kills) + awesome-llm-apps leverage map (45 items) + 5 empirical gap-fills with sources. Raw synthesis: `~/workspace/second-pass/raw-synthesis-2026-09-29.md`. Gap-fills: `~/workspace/second-pass/gap-fills-2026-09-29.md`.

---

## I. THE META-FINDING: nobody connected the two reports

The two first-pass reports were written in isolation. The highest-leverage items live in the synthesis between them.

### S1. The automated film pipeline (top GSE item, upgraded by evidence)
Apps #25 (video moment finder: frame embeddings + cosine search) + Patents G1 (field-anchored telestration) + G2 (play segmentation prefilter) + G3 (replay discriminator) + G4 (vanishing-point calibration) assemble into one pipeline:
**ingest broadcast → G2 segments plays → G3 kills replays → G4 calibrates camera → G1 anchors telestration → #25 semantic moment search.**
Feeds both the content op (2–4s telestrated clips per the standing video rule) and the engine (automated charting → proprietary features). Neither report assembled it. **Gap-fill Q2 returned STRONG:** soccer charting is commoditized open-source running real-time on a consumer RTX 4060; the one serious open NFL project (nflgsplat, active Sept 2026) independently converged on the expired patents' architecture — classical geometric front end (field-paint calibration) → deep refinement (SMPL-X pose in field coordinates) on a local RTX 4080. The expired patents' value is as a *design spec*, not IP. Prototype-able on consumer hardware today.

### S2. Automated charting = proprietary data generation (the reframe)
GSE's founding inspiration was FantasyPoints hand-grading every play. The film pipeline automates a version of that: formations, routes, personnel, play boundaries from broadcast → proprietary play-level labels → variance-model inputs, signals-table rows, rankings features. The patents were framed as content tooling; their bigger value is DATA generation. Per Q2: full formation/route classification remains research-grade without labeled data — **and that labeled dataset, built as a byproduct of the content pipeline, is the actual long-term moat.** Every telestrated clip the content op produces can carry labels. Content and data moat compound together.

### S3. Turn each method into infrastructure (scout pattern)
Apps #13 (scout/scheduler/delivery split) applies to the research methods themselves:
- **Patent scout:** the one-shot patent report decays. A scheduled scout watching newly-expired patents in his niches compounds. (This is also the correct answer to "comment REINVENT" funnels — run the workflow continuously, free, forever.)
- **Repo watcher:** star awesome-llm-apps and scout it — the empty `self-improving-agent-skills` folder will fill; new skills land there first.
- X sweeps upgrade (already noted in first pass).

### S4. Kill-list discipline as a standing loop
Apps #18 (critique → revise loop) + #21 (human feedback) applied to idea triage: propose → research → critique → kill/advance, continuously. The 30-kill list was one-shot; make it a loop. The kill list is a compounding "what NOT to build" database — and the active-patent controls mapped inside it (Trackman, Disney, SAP, Nike) are an **IP wall map**: where not to compete, where to design around, where big players invest. Revisit yearly.

---

## II. THE SERVICE-LAYER THESIS (the big cross-cutting insight)

Gap-fills Q1, Q3, Q4 all returned the same shape: **incumbents sell software or objects; the unserved buyer wants someone to just do it.** Funeral homes buy relationship-driven service, not templates. QR-sign buyers don't want another dashboard. SMBs priced out of Yext/Birdeye don't want listings software — they want their hours updated everywhere without logging in anywhere.

**Garrett's agent fleet is precisely the machine that makes human-grade service cheap.** The strategic conclusion: the ARE sells SERVICE, not software. Software is the internal tooling; the product the customer buys is "we handle it." This reframes every lane below — and it inverts the usual indie-hacker instinct (which is to build dashboards). Build the dashboard last, if ever; sell the done-for-you outcome first.

---

## III. Patent deep cuts — with verdicts

### P1. "Edit once, update everywhere" → THE Kit platform play (Q4: STRONG — biggest ARE finding)
Was framed as a restaurant menu add-on. The gap-fill says it's bigger: Yext ($199–$999/yr/location), Birdeye ($299–$449/mo), Podium ($249–$599/mo) sync *directory listings* — none update the business's website content, print, or socials from one action, and all are priced for multi-location or review-driven verticals. **A $350 site + $49–99/mo human-done care plan ("text us the new hours; site, Google profile, socials, print all update") undercuts every tier selling the one thing software can't: the owner never logs into anything.** The moat is service labor (fleet-cheap), not software. **Action: sell the care plan on the next 3 Kit sites BEFORE building any dashboard** — revenue before code, per his rule.

### P2. The memorial lane, said plainly (Q1: MEDIUM, positioning-dependent)
Etsy memorial printables are saturated at $7–$20 (DIY, budget-conscious buyers). The wedge is NOT another Canva template — it's (a) premium done-for-you bundles ($50–$150, design service as the product, per The Funeral Program Site's pricing) or (b) B2B2C through independent funeral homes (served by $45/mo vertical SaaS, relationship-driven, proven willingness to pay via UK/US funeral-marketing specialists). The patent was literally for memorial items; the mechanism transfers cleanly. **Wedding/event transfer first (cleaner test), memorial as the second test.** Never lead with grief-adjacent marketing; never "AI wedding signs."

### P3. A1's general form: print arbitrage (no gap-fill needed — mechanism logic)
"Stock blank + color-matched overlay" = professional look without professional print runs. Product LINE, not one kit: real estate flyers, restaurant specials, retail tags, church bulletins, events. Each vertical gets the same engine with different template packs.

### P4. QR/NFC signage: the product is the service (Q3: MEDIUM-STRONG)
Hardware fully commoditized (5,000+ Etsy listings $4–$48, ZappyCards $20–$40, Tagglu's editable NFC+QR platform launched Sept 2026). Nobody sells the managed wrapper. **Survives only as: Kit module (QR-linked live page) + small monthly care plan where the *updating* is the product.** Two hidden layers the first pass missed: (a) every scan is foot-traffic analytics SMBs can't get elsewhere — the analytics dashboard is the real upsell, the sign is the trojan horse; (b) validate willingness to pay monthly BEFORE building — hardware proves demand for the trigger, nothing proves demand for the content layer yet.

### P5. A2's viral loop (first-pass miss, no gap-fill needed)
QR asset tags on installed sign panels are customer-facing: "scan to see who made this sign / leave them a review" — every install becomes lead-gen for the sign shop. A viral loop inside a B2B tool. Cheap to add to the asset-tracking build.

### P6. IP wall map (from the kill list)
The 30 kills aren't waste — they're a map. Active controls (Trackman ~2030, Disney ~2037, SAP ~2037, Nike family) show where the well-funded players' walls stand. Design around, don't compete. Revisit yearly; feed to the patent scout (S3).

---

## IV. Apps deep cuts — with verdicts

### A1. Hash-chained pick provenance: build it, market it differently (Q5: MEDIUM)
Betstamp already ships immutable bet records ("can't be edited or deleted") with verified capper profiles — so hash-chaining is not a market-first. **But the trust problem is real and documented** (VSiN's tout guide: double-siding, doctored records; monitoring sites taking bribes). Bettors buy *verified*, not *cryptographic*. **Build the append-only trail as brand infrastructure** (hash-chained daily digests are cheap; the brand promise "every pick public, every result posted" demands it); **market it as "independently verifiable record," never "blockchain."** The word that converts is *verified*.

### A2. Advisor-orchestrator as fleet law (first-pass underweight)
"Verify by exercising the deliverable, never grepping a README" = Garrett's file-verifiable completion standard, codified as protocol. Should govern the coding agent's all-day autonomous mode and every Hermes handoff — not sit as a thread pattern. The three-tier protocol (cheap workers, strong advisor at commitment boundaries, budget accounting) is also the cost-control answer for scaling the fleet.

### A3. The analyst desk vision (#28 + #16 — first-pass under-sold)
Garrett interrogating his engine in natural language — "why is our QB ceiling biased high in domes?" → agent queries Neon, runs dispersion analysis, builds the calibration dashboard live. This changes his relationship with the engine from builder to interrogator. The pieces were listed; the vision wasn't.

### A4. #17 deep-research agent: closest to directly reusable (first-pass buried in Tier 2)
Next.js + CopilotKit = his stack, "front end nearly template-level." This is the internal analyst desk for off-field intake and deserves Tier-1 attention, not Tier-2.

### A5. #34 ripple: unglamorous, needed (first-pass underweight)
Doc-coherence checker over a multi-agent corpus that's actively rotting ("this rule changed — these 6 docs contradict it"). Nobody wants to build it; it needs building. Candidate for the coding agent's autonomous queue.

### A6. #36 TL;DR infographics serve a stated requirement (first-pass underweight)
Garrett's required packet format: "full write-up WITH GRAPHICS." Auto-generated packet graphics aren't nice-to-have — they serve an explicit format requirement.

### A7. Dogfood the reports
TOON (#2, ~64% token cut on tabular data): the 30-item kill list and 45-item leverage map are exactly the tabular data it compresses. The fleet should process these reports with the techniques the reports recommend.

---

## V. Revised build/validate order

**Validate before code (revenue rule):**
1. Sell the $49–99/mo "we update everything" care plan on the next 3 Kit sites (P1/Q4 — strongest ARE signal).
2. Validate monthly willingness for QR-content management with one restaurant (P4/Q3).

**Cheapest prototypes (unlock bigger things):**
3. G2 classical play prefilter on real broadcast footage, 1–2 weeks (S1/S2 — unlocks telestration, replay discrimination, calibration; labels become the data moat).
4. G1 field-anchored telestration on real NFL frames (S1 — direct enabler of the real-footage content rule). Both UNTESTED — QUEUED FOR EVALUATION until then.

**Cheap builds (brand + fleet infrastructure):**
5. Append-only pick trail with hash-chained daily digests (A1/Q5 — brand infrastructure; market "verified").
6. Tier-0 fleet items: thinking-out-loud skill, TOON in prompts, P01–P12 taxonomy (first-pass Tier 0, unchanged).

**Product MVP:**
7. Vow & Post overlay template-pack MVP — wedding table numbers, $29–79 (P2/P3 — weddings first, memorial second).

**Standing infrastructure:**
8. Patent scout + repo watcher on a schedule (S3). Kill-list loop as process (S4). Ripple doc-coherence checker to the coding agent's queue (A5).

## VI. Still unverified / queued
- Memorial-printable TAM and Etsy sell-through rates (Q1 — could not verify; do not claim).
- Tagglu pricing (Q3).
- Whether ANY SMB pays monthly for QR-content management (Q3 — the key A4 assumption; validation step 2 above).
- G1/G2 on real broadcast footage (Q2 validates architecture; prototype validates execution).
- `first-reader` skill license field is blank — verify before reuse (from first pass, still open).
