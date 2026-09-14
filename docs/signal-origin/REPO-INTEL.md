# REPO-INTEL — Beexly fleet briefing

**Date:** 2026-09-14 22:40 UTC  
**Architect:** Grok (Signal Origin DM R&D gauntlet v3)  
**Scope:** every repository this session can read. Plan PRs land in `Beexly/autonomous-revenue-engine` and `Beexly/agent-bus` only.

## Method

GitHub connector as `Beexly`. Listed user repos, open PRs, issues, CI, trees, recent commits, Motif bus files. Sports was enumerated because it is in the same org; it is **not** a Signal Origin surface and is not a plan-PR target in this run (owner override: ARE + agent-bus).

## Fleet map

| Repo | Purpose | Default | Visibility | Last push (approx) | Open PRs | Open issues | Role vs Signal Origin |
|---|---|---|---|---|---|---|---|
| [Beexly/autonomous-revenue-engine](https://github.com/Beexly/autonomous-revenue-engine) | Factory + SO brand + Kit + free-core tools | `main` @ `3616fc5` | public | 2026-09-13 | 11 | 0 | **Build machine.** This is the live product repo. |
| [Beexly/agent-bus](https://github.com/Beexly/agent-bus) | Motif ↔ builder message bus | `main` @ `de9609c` | private | 2026-09-14 | 0 | 0 | **Coordination machine.** Doctrine, tasks, QC. |
| [Beexly/Sports](https://github.com/Beexly/Sports) | Galaxy Sports Edge / DFS intelligence OS | `main` | private | 2026-09-14 | 50+ | 152 | Adjacent org asset. **Identity isolation.** Do not mix. |
| [Beexly/GSN.Cards](https://github.com/Beexly/GSN.Cards) | Sports card / GSN surface | — | private | older | — | — | Adjacent. Isolation. |
| [Beexly/Clouds-bruh](https://github.com/Beexly/Clouds-bruh) | Infra / cloud experiments | — | private | older | — | — | Not in SO loop. |
| [Beexly/XXX](https://github.com/Beexly/XXX) | Restricted / adult agents (set aside) | — | private | older | — | — | Pattern library only. Never mix identity or rails. |
| [Beexly/Project-Tree](https://github.com/Beexly/Project-Tree) | Sheaf / CRC integrity engine | — | private | older | — | — | Pattern library only. |

GitHub user: **Beexly** (`baxley.garrett@gmail.com`). Human owner: Garrett Baxley, Kingwood / Houston / Woodlands.

---

## 1. Beexly/autonomous-revenue-engine — the build machine

### What it is

Public factory. Description: "Fully autonomous AI-driven revenue project (2026). Vertical agent kits, multi-agent workflows, and non-mainstream digital products. Managed by Grok."

Canonical identities live in `ops/LIVE_SURFACES.md`:
- Brand: Signal Origin
- X: `@SignaL_OriginHQ` (Premium personal, not Business)
- Gmail: `signal.origin.hq@gmail.com` (also used by GalaxySportsHQ mail — **identity leak risk**)
- TikTok `signal.origin`, IG `signal.origin.hq`, YouTube `UCO-BzciycFv1SIISFb-Cg2Q`

Wrong handle: `@Signal_origin` is not us.

### Structure (main @ 3616fc5)

| Path | Job |
|---|---|
| `apps/` | 15 in-repo products (framefit, qi-check, kit, linknest, reviewwall, brain, crush, stamp, board, conformal-lite, adaptive-cp, hn-bait, subject-fold, swap-check, voice-delta) |
| `docs/` | GitHub Pages / Vercel HTML faces of those tools + embed.js |
| `ops/` | Operating doctrine, queues, logs, measurement, pitches |
| `OPERATING.md` | Cycle 17 (2026-09-12): rails F1–F4, Hold 9.2, no public SO post yet |
| `ORGANIZATION.md` | Virtual seats. Architect executes all of them. |
| `LEVERAGE.md` | Patterns from XXX and Project-Tree. No code merge. |
| `README.md` | "Project Flower" cover. Cultivar names not posted at the gate. |

### Live surfaces (from `ops/TARGET_QUEUE.md` + `ops/FACTORY.md`)

| ID | Product | Status | URL |
|---|---|---|---|
| T01 | FrameFit | live | https://framefit-eta.vercel.app |
| T02 | qi-check | live | https://autonomous-revenue-engine-eight.vercel.app/qi-check.html |
| T03 | LinkNest | live | …/linknest.html |
| T04 | Review Wall | live | …/reviewwall.html |
| T05 | Bookmark Brain | live | …/brain.html |
| T09 | Crush | live | …/crush.html |
| T10 | Stamp | live | …/stamp.html |
| T11 | Board | live | …/board.html |
| T12 | Kit (local one-pager, $350) | live | …/kit.html |
| T06 Chatbase analog | blocked | API cost |
| T07 Aragon analog | blocked | GPU/API, −$800 cash |

Vercel projects (team `beexlys-projects`, user `Beexly-2810`): `autonomous-revenue-engine`, `framefit`, `flowertest`, `flowertest2`. Production aliases live. Recent ARE production deploy `dpl_F5t9…` (SignPreview lead-capture honesty fix).

### Current state — honest

- **Factory is overbuilt relative to traffic.** Many live URLs. Zero proven visits in the operating logs. Scoreboard is revenue. Preview URLs with zero visits count as unshipped (`FACTORY.md`).
- **Signal Origin has never posted.** Hold floor 9.2. Approved queue empty. SO-002 / SO-005 remain Pass internally (gated 2026-08-25) and have not shipped. SO-008 Hold. SO-012 was 7.9 Soft rewrite. Drafts SO-009/010/011 sit in `ops/DRAFT_CANDIDATES.md`.
- **Human cash rails exist and are unused.** Kit walk-in pitch is written (`ops/LOCAL_PITCH.md`). $19 Gumroad workbook exists; Gumroad emailed 2026-08-26 that payouts need SSN / ITIN / EIN. Warm-network Meta-repair note sits in Gmail **Drafts**, never sent. One Zoho CRM outreach sent 2026-08-25; no reply in this inbox.
- **CI is theater on main.** Workflow `ci.yml` is a no-op (`exit 0`). PR #46 (`ci/restore-2026-09-14`) tries to restore real CI. Do not merge without reading it.
- **PR pile is a second factory.** 11 open PRs against main, most from late August, none landing. ImgBot #44 is noise. Draft PRs (#45 kit cinematic, #34 Doug workspace, #32 BD notes) should not mix with live rails.

### Open PRs (ARE) — triage seed

| # | Title | Age | Call |
|---|---|---|---|
| 46 | [ci] Restore real CI (audited 2026-09-14) | hours | **Review then merge if tests are real.** Highest-leverage repo fix. |
| 45 | QUEUE: Kit cinematic sales page — do not merge until ship this | hours | Draft. Keep draft. Kit is F4, not a cinematic launch. |
| 44 | [ImgBot] Optimize images | 2d | Close or let bot sit. Not revenue. |
| 43 | docs: impression-log (FIFTY_LOOPS #24) | 2w | Docs-only. Merge if it does not invent metrics. |
| 39 | Offer CTA: $19 Gumroad above the fold, park $250 | 2w | Aligns with cash. Review copy. Don't ship a $250 CTA. |
| 38 | docs: approve-desk | 2w | Useful factory page. Merge if already live elsewhere. |
| 36 | Unblock publish gate / PR #33 / CI / conformal-lite | 2w | Stale mega-PR. Read before anything; likely supersede. |
| 35 | docs: read-time estimator | 2w | Low. |
| 34 | Doug's offline sales workspace | 2w | Draft. Isolation risk. Don't mix Doug into SO. |
| 33 | Integrate PRs #20–#31 | 2w | Mega-integration. High conflict risk. Don't merge blind. |
| 32 | generic BD system design notes | 2w | Draft. Park. |

### Issues

Zero open issues. That is not health — it is missing a scoreboard. Work hides in `ops/` markdown and Motif's bus.

### Stale / broken

1. Publish path disabled by design (Hold 9.2 + empty Approved queue). Correct as a quality rule; fatal as a growth rule if replies are also blocked.
2. Gmail identity shared with GalaxySportsHQ notifications. SO mail is a sports-ops dump.
3. `signal.origin.hq@gmail.com` used "Auto X" as From name on outreach. Inconsistent with Signal Origin.
4. Domain shortlist: `signalorigin.com` taken (Dongguan connector manufacturer). `holdscore.com` parked. HTTP probes on tool-face domains returned 000/fail — inconclusive, not a buy signal. Architect does not purchase.
5. Measurement template locked; daily revenue-score job deferred until ≥7 days intake. There has been no intake.
6. OpenRouter key exists in Build sandbox (per LIVE_SURFACES). Never paste secrets into chat or this repo.
7. Origin-box tarball already landed today on `grok/handoff-2026-09-14` under `handoff/origin-2026-09-14/` (112 files). **Not merged.** Overlaps `ops/GARRETT_PENDING.md` and older `three-core/` copies. Promote file-by-file on owner approval.

### Top improvements (ARE)

1. Land or kill the PR pile. Eleven open PRs is a stall.
2. Restore real CI (#46) so factory HTML cannot ship a fake-success form again.
3. Treat **replies** as a separate gate from **original posts**. Originals stay 9.2. Replies get a shorter voice/risk checklist so the account can exist in public.
4. Kit is the cash product. Stop adding factory apps until Kit has one paid job or FrameFit has visits.
5. Move SO operating docs out of root-ops sprawl into `docs/signal-origin/` (this PR).
6. Separate Gmail: SO vs GalaxySportsHQ. Listed for owner; architect does not create accounts.

---

## 2. Beexly/agent-bus — the coordination machine

### What it is

Private Motif bus. Created 2026-09-10. Protocol: motif = strategist + QC (9.2 bar). opencode / Hermes / Grok = builders. No human courier.

Layout: `inbox/from-motif|from-opencode|from-builder|from-grok`, `outbox/`, `STATUS.md`, `INDEX.md`, `PROTOCOL.md`, `bootstrap/`.

### Current state (main @ de9609c, hours old)

Motif is the source of truth. `INDEX.md` is required reading. If it is not linked there, Motif's rule is it does not exist.

Active tasks (compressed):

| Task | Status ( Motif 2026-09-12/13 ) | Money relevance |
|---|---|---|
| TASK-001 Kit lead-list | Claimed by Hermes. **Zero artifacts.** | High. Unclaim or deliver. |
| TASK-003 Vow & Post | Partial. Flat mockup, seating-chart bug, no affiliate links. | Medium. Second skin. |
| TASK-004 SignPreview lead capture | Code honesty fix landed on ARE `3616fc5`. Still waiting on Garrett's Supabase config. | High. Silent lead loss was P0; fake-success is fixed; backend still unwired. |
| TASK-005 B2B embed widget | Done. Needs real lead endpoints. | Medium. |
| TASK-006 Playwright recorder | Scaffolding. Dead github.io URLs. node_modules committed. | Low until a product has a demo worth filming. |
| TASK-007 Signage lead finder | 225 rows of the wrong businesses (gas, tires, nails). | High if re-sourced to actual sign shops / wedding planners. Currently junk. |
| TASK-009 Kit sample sites | Claimed by Garrett. Samples rebuilt 2026-09-12 on ARE. Visual QA still contested (false "reviewed by eye"). | High. Kit is the walk-in. |
| TASK-010 Workflows | Done (workflows.html). | Medium. |
| TASK-011 n8n product-intel | Unclaimed. | Research. Not first dollar. |
| TASK-013 Resend lead email | Open. Garrett must add the Resend key. | High money-loop. **Owner click.** |
| TASK-014 Spark splat gallery | Open. Bible §26. | Experiment. Not first dollar. |
| TASK-015 Activity Log proposal | Open. Must not touch `docs/kit/**`. | Ops hygiene. |

Research pipeline: 30-site ground-truth scrape delivered; several dossiers still <8; Tracks A–O and P/Q/U/V queued. Do not block cash work on that scrape.

### Top improvements (bus)

1. File this gauntlet in `inbox/from-grok/` and link it from `INDEX.md` + `STATUS.md` or Motif will treat it as nonexistent.
2. Unclaim TASK-001. Hermes produced nothing. Reopen for a Woodlands/Kingwood **service-business** list, not a 225-row junk OSINT dump.
3. Do not start TASK-014/015 before a paid Kit job exists. They are craft, not cash.
4. TASK-004 remaining block is Garrett's Supabase values. List on the approval sheet. Architect does not invent credentials.
5. Keep GSE/Sports work off this bus. TASK-002 already removed (lives in GSE).

### CI / PRs / issues

No open PRs on agent-bus before this gauntlet. No issues. No CI. That is correct for a markdown bus — until someone starts committing generated research dumps without review.

---

## 3. Beexly/Sports — adjacent, isolated

Private. 152 open issues, a very large open-PR set (50+ visible, many draft/stale from 2026-08-25 through 2026-09-14). This is a launch-readiness graveyard: calibration, settlement evidence, NFL kickoff, dependabot, hermes edge-lab.

**Rule:** Signal Origin does not discuss GalaxySportsAI DFS, does not share payment rails, does not share the X handle, does not share the From-name on mail.

Useful steal (patterns only): Sports already learned that confidence can have AUC ~0.5, that fake-success UI is a kill, that "path to 70%" without measurement is fiction. Same honesty doctrine applies to SO Hold scores and to Kit lead capture.

Not a plan-PR target this run.

---

## 4. Other Beexly repos

- **XXX** — restricted vertical, set aside. `LEVERAGE.md` already extracted: owner-attestation gate, revenue-path scoring, rail isolation, cash-first. Do not import content, processors, or Stripe identity.
- **Project-Tree** — sheaf/CRC. Conceptual only (multi-source consistency). Not a dependency.
- **GSN.Cards / Clouds-bruh** — out of SO loop this cycle.

---

## 5. Cross-cutting findings

1. **The org has too many unfinished launch surfaces and not enough public sentences.** ARE factory, Kit, SignPreview, Vow & Post, GSE, SO Hold queue — all waiting on a first external yes.
2. **Money is blocked on owner-only clicks, not on missing strategy.** Gumroad SSN. Supabase config. Resend key. Walking into five shops. Sending the warm-network note. Completing Gumroad identity. Architect prepares; architect does not nag mid-run.
3. **OCR is not week-one money.** Original Content Rewards (enrollment wave from 2026-09-08) pays qualified Premium Home Timeline impressions on **original** posts. Gate: 500 verified followers + 500k verified HT impressions in 90 days, **replies excluded**. An account with zero original posts cannot enroll on merit. Replies still matter for discovery. They do not mint the OCR gate.
4. **Voice and quality rules are real assets.** Hold 9.2, no hashtags, no AI cadence, human-primary authorship. Keep them. Add a reply-specific checklist so they stop being a veto on existing in public.
5. **Gmail is the wrong inbox for SO DMs.** Confirmed: DMs live on X. This session has **no X DM connector**. Honest DM count is in `DM-INTEL.md`.

## 6. What this session will not do

- Merge to main, deploy, publish, send, spend.
- Invent DMs.
- Mix Sports/GSE identity into SO posts or Kit walk-ins.
- Buy domains, Apple $99, ads, API credits.
- Open T06/T07.
- Treat OCR as a 48-hour plan.

Next document: `DM-INTEL.md`.
