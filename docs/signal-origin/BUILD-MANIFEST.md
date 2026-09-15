# BUILD MANIFEST — 2026-09-14 gauntlet

**Rule:** section gate after each build. 9.2 bar. Three repair rounds max.

## Built this session

| ID | Artifact | Repo path | Rank | Gate |
|---|---|---|---|---|
| M1 | Fleet briefing | `docs/signal-origin/REPO-INTEL.md` | Phase 1 | pass |
| M2 | DM / substitute-corpus intel | `docs/signal-origin/DM-INTEL.md` | Phase 2–3 | pass |
| M3 | Ranked plan | `docs/signal-origin/DM-RND-PLAN.md` | Phase 4–5 | pass |
| M4 | Overnight SOP | `docs/signal-origin/OVERNIGHT-OPS.md` | R3 | pass |
| M5 | Tonight's reply bank (5 drafts) | `docs/signal-origin/REPLY-BANK.md` | R3 | pass |
| M6 | Local cash packet | `docs/signal-origin/LOCAL-CASH.md` | R1–R2 | pass |
| M7 | Overnight card UI | `docs/signal-origin/overnight-ops.html` | R3 | pass |
| M8 | Ferry / approvals | `docs/signal-origin/FERRY.md` | Phase 8 | pass |
| M9 | Folder index | `docs/signal-origin/README.md` | — | pass |
| M10 | Bus mirror + STATUS/INDEX + TASK-016 | `Beexly/agent-bus` same branch | R8 | pass |

## Not built (on purpose)

| Item | Why |
|---|---|
| New original SO post | Hold 9.2 still in force. Drafts already exist. |
| New factory app | Sprawl. Kit/FrameFit/qi-check already live. |
| Gumroad identity form | Owner-only. No SSN in git. |
| X poster / paid API | LIVE_SURFACES: $0 credits until Pass-only poster exists. |
| Supabase/Resend wiring | Owner keys. TASK-004/013. |
| Sports repo PR | Owner: ARE + agent-bus only. Isolation. |
| Merge of any PR | Charter. |

## Section gates

### M1 REPO-INTEL
- Benchmarks: (1) every accessible Beexly repo named, (2) ARE PRs triaged not listed as "11 open", (3) Sports isolated in writing.
- Round 1 defects: first draft under-weighted agent-bus INDEX rule and the already-landed origin handoff tarball. Fixed.
- Score: 9.3 after repair.

### M2 DM-INTEL
- Benchmarks: (1) honest zero, (2) no invented quotes, (3) Gmail human layer separated from notification sludge.
- Round 1 defects: risk of treating Gmail as "the DMs." Header now states X DMs are opaque.
- Score: 9.4.

### M3 PLAN
- Benchmarks: (1) money-first ranking, (2) OCR mechanics correct (replies excluded), (3) every item has approval.
- Round 1 defects: OCR was described as "later" without the 500/500k/replies-excluded numbers. Added.
- Score: 9.2.

### M5 REPLY-BANK
- Benchmarks: Roemmele-room person, Motif banned-pattern scan, mechanism not in the parent.
- Round 1 killed: 17k tok/s echo, politician dunk, slogan stack, "we."
- Round 2: RB-04 marked skip-default.
- Score: 9.2 on RB-02/03/05. RB-01 backup. RB-04 optional.

### M6 LOCAL-CASH
- Benchmarks: (1) no fake shop names, (2) locked pitch unmodified, (3) Meta offer not mixed into walk-in.
- Round 1 defect: temptation to invent five business names. Replaced with types + hunting grounds.
- Score: 9.3.

### M7 overnight-ops.html
- Benchmarks: (1) works offline, (2) copy actually copies the draft, (3) no network, no analytics, no fake counts.
- See HTML comment header for QA.

## Regressions

None in production (no deploys). Origin-box tarball on `grok/handoff-2026-09-14` left untouched — not this branch.
