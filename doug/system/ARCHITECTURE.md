# Architecture — BD Support System for Bid-Driven Subcontracting

Design notes for an AI-assisted business-development support system serving a
subcontractor that sells into a bid-driven construction market. This document is
deliberately generic: it describes the structure and the reasoning, not any particular
operator, employer, or client.

---

## The problem shape

Business development in bid-driven subcontracting has an awkward property: the work that
produces revenue this quarter (responding to invitations to bid) and the work that
produces revenue in two years (building relationships with general contractors) look
nothing alike, run on completely different clocks, and compete for the same person's
attention. Under deadline pressure the short clock always wins, so the long clock never
gets serviced and the pipeline never compounds.

A second property: the human doing this job is usually in the field, not at a desk. Any
system requiring structured data entry will not be used. The capture mechanism has to
tolerate a voice memo recorded in a truck.

The architecture below is a response to those two constraints.

---

## Operator and divisions

A single **operator** agent is the only thing the human talks to. Behind it sit eight
specialized divisions. The human never addresses a division directly and does not need to
know they exist — routing is the operator's job. This keeps the interface at one
conversational surface while letting the internals stay specialized.

| Division | Responsibility |
| --- | --- |
| **SCOUT** | Opportunity discovery. Finds projects, funding programs, and permits; qualifies whether an opportunity is real and whether it is addressable. |
| **LEDGER** | Account intelligence. Maintains what is known about each general contractor and each person: roles, history, preferences, prior interactions. |
| **ORACLE** | Competitive intelligence. Who else bids this work, where the operator wins and loses, how the field is positioned. Public sources only. |
| **QUILL** | Communications. Drafts outbound messages, follow-ups, and prequalification narrative. Drafts only — never sends. |
| **ABACUS** | Bid desk. Tracks active bids, required documents, addenda, and submission deadlines. Handles no pricing. |
| **STEWARD** | Deadlines and commitments. Every "I'll get you that by Thursday" becomes a tracked obligation. |
| **MIRROR** | Coaching and post-mortems. Reviews what happened after wins, losses, and meetings; feeds patterns back. |
| **FORGE** | Engineering. Builds and maintains the system itself. |

The split exists because these functions have genuinely different failure modes.
Opportunity discovery fails by being credulous; competitive intelligence fails by
overreaching ethically; communications fails by overclaiming capability; the bid desk
fails by missing a date. Separating them lets each carry its own checks rather than
diluting one general-purpose prompt with eight sets of caveats.

---

## The three pipelines

The core structural idea. Three pipelines run concurrently on different time horizons, and
they are tracked separately so the fast one cannot cannibalize the slow one.

### Relationship pipeline — 3 to 24 months — *the compounding asset*

Building standing with general contractors: estimators, preconstruction managers, project
executives. No specific project attached. Progress is measured in whether calls get
returned and whether the operator makes the short list by default.

This is the pipeline that actually determines long-run revenue, and it is the one that
gets dropped first under pressure because it has no deadline. Tracking it separately, with
its own review cadence, is the entire point. It compounds — a relationship built this year
pays out repeatedly for years, which is not true of anything in the bid pipeline.

### Bid pipeline — 2 to 8 weeks — *the harvest*

Active invitations to bid. Concrete deliverables, hard deadlines, binary outcomes.

Important framing: this pipeline **harvests** standing that the relationship pipeline
built. A bid arriving is largely a lagging indicator of relationship work done months
earlier. Treating bid volume as the primary health metric is a mistake — it measures last
year's effort.

### Signal pipeline — 6 to 24 months — *the seed corn*

Early indicators well upstream of any bid: funding measures passing, land acquisition,
design contracts awarded, program announcements. Nothing here is actionable as a sale yet.

Its value is timing. Knowing a program is funded 18 months before bids drop is what makes
it possible to build the relationship *before* the competitive moment rather than during
it. This pipeline is what feeds the relationship pipeline its targets.

**The dependency runs Signal → Relationship → Bid.** Health in the bid pipeline is a
lagging indicator; health in the signal and relationship pipelines is a leading one.
Reporting reflects that, so a strong bid quarter does not disguise an empty top of funnel.

---

## Trust-tier governance

Every action the system can take carries a tier. This is the mechanism that makes an
autonomous system safe to point at real relationships.

### GREEN — act freely

Research, monitoring, filing, internal summarization, updating records, drafting for
internal eyes. Reversible, internal, no external party sees it. No approval needed.

### YELLOW — prepare and queue for one-tap approval

Anything that would touch an outside party: an email, a follow-up, a document to send. The
system does the full preparation and stops. The human sees a finished artifact and
approves or rejects with one tap.

The design intent is that approval friction should be near zero while *actual* human
judgment stays mandatory. A human who must compose from scratch will skip the task; a
human handed a finished draft will read it and decide. The goal is to make reviewing
cheap, not to make approval automatic.

### RED — never autonomous, no exceptions

Four categories, and the boundary is not negotiable:

1. **Price** — any number attached to scope
2. **Schedule** — any date the operator commits to performing by
3. **Contract terms** — anything binding
4. **Capability claims that are not verified** — asserting the operator self-performs a
   scope without confirmation

The first three are RED because the individual doing business development typically has no
authority to commit them, and an AI system has less. The fourth is RED because it is the
most damaging error available in this market: a general contractor who discovers a
subcontractor overstated its self-performed scope does not issue a correction, they stop
calling. It is a permanent, silent loss, and it is entirely avoidable by saying "let me
confirm."

Unverified facts are carried with an explicit marker through every layer and are never
silently promoted to verified. Absence of a fact is represented as absence, never as a
plausible default.

---

## The debrief protocol

The capture mechanism, and the reason the system gets used at all.

**One unstructured voice memo updates the entire system.**

After any meeting, call, or site visit, the human describes what happened in whatever form
is natural — rambling, out of order, self-correcting, incomplete. No forms, no fields, no
required structure. The operator parses it and fans the content out to every division that
has a stake:

- A company or person mentioned → **LEDGER**
- A project or timing signal → **SCOUT** or **SIGNAL**
- A competitor mentioned → **ORACLE**
- Something promised → **STEWARD**
- Something needing a written follow-up → **QUILL** drafts it and queues it YELLOW
- Something that went well or badly → **MIRROR**

The design principle: **structure is the system's job, not the human's.** Every structured-
entry CRM fails the field salesperson for the same reason — it charges an upfront cost at
exactly the moment when energy is lowest. Accepting messy input and doing the
normalization internally is what makes the difference between a system that is used and
one that is abandoned in week three.

Ambiguity is preserved rather than resolved by guessing. If a name is unclear, it is
recorded as unclear and surfaced as a question later, not filled in with the most likely
match.

---

## Operating notes

- **Local-first.** The operating knowledge base — accounts, contacts, interaction history
  — lives on the operator's own machine. It is personal and commercial information and is
  never committed to a repository. See [`GUARDRAILS.md`](GUARDRAILS.md).
- **Human-in-the-loop for gated sources.** Several industry platforms sit behind logins and
  prohibit automated access. Those are worked manually by the human through their own
  credentials; the system never touches them.
- **Blocking on human answers is a feature.** Where the system lacks a fact that only a
  person can supply, it stops and says so rather than proceeding on an assumption.
  Research built on a guessed premise is worse than no research, because it looks
  finished.
