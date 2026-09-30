# BD Support System — Design Notes

Generic design notes for an AI-assisted business-development support system serving a
subcontractor in a bid-driven construction market. This directory holds the system
architecture, its operating guardrails, and a plain-English trade glossary — nothing else.

---

## What is here

| File | What it is |
| --- | --- |
| [`system/ARCHITECTURE.md`](system/ARCHITECTURE.md) | The design: a single operator agent over eight specialized divisions, three concurrent pipelines on different time horizons, a trust-tier governance model, and the unstructured-debrief capture protocol. |
| [`system/GUARDRAILS.md`](system/GUARDRAILS.md) | The ethical and legal operating limits, each paired with the reasoning behind it. |
| [`GLOSSARY.md`](GLOSSARY.md) | Plain-English definitions of common commercial construction and subcontracting terms. Public industry vocabulary. |
| [`.gitignore`](.gitignore) | Mechanical enforcement of the data boundary described below. |

---

## What is deliberately not here

**This repository is public. All operator-specific and client-specific material is
intentionally excluded from it and kept local.**

Specifically, none of the following appears in this directory, and none of it should ever
be added:

- Any individual's name, contact details, or role
- Any employer, client, or customer identity
- Internal company facts — bonding capacity, safety ratings, insurance limits,
  certifications, financials, backlog, or capacity
- Competitive or capability analysis of any specific firm
- Any interpersonal, political, or personnel guidance concerning named people
- Named projects, general contractors, developers, or funding programs tied to the above
- Account records, interaction histories, or any operating knowledge base content

The operating knowledge base that the system actually runs on — accounts, contacts,
interaction history, market research — lives in local storage on the operator's own
machine and is never committed anywhere.

This split is intentional, and it is the same boundary that
[`system/GUARDRAILS.md`](system/GUARDRAILS.md) rule 4 describes: repositories get cloned,
forked, and indexed, and a repository's visibility can be changed by someone who has not
read the rules. Anything committed should be assumed permanent and public. Design and
process documentation is therefore kept structurally separate from operating data, rather
than relying on anyone's discipline in the moment.

**If you are extending this work: keep it generic.** If a change would make it possible to
identify a person, an employer, or a client from what is committed here, it belongs in
local storage instead.

---

## Why the design is shaped this way

Two constraints drive the architecture, both covered in
[`system/ARCHITECTURE.md`](system/ARCHITECTURE.md):

1. **Two clocks compete for one person's attention.** Responding to invitations to bid
   pays this quarter; building relationships with general contractors pays in two years.
   Under deadline pressure the short clock always wins, so the long-horizon work never gets
   serviced and the pipeline stops compounding. Tracking the pipelines separately is the
   structural response.

2. **The user is in the field, not at a desk.** Any system requiring structured data entry
   will be abandoned. The capture mechanism has to accept a rambling voice memo and do the
   normalization internally — structure is the system's job, not the user's.

The governance model exists for a third reason: in a market where the same few hundred
people work together for decades, reputation is the actual asset. Every guardrail trades a
small immediate convenience for a large deferred risk, and the human-approval backstop is
what makes the rest survivable.

---

## Scope of this directory

This directory is self-contained. Nothing outside it relates to this project, and this
project does not modify anything outside it.
