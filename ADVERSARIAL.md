# Adversarial Review Protocol — SignalOrigin

Version: 1.1  
Last updated: 2026-08-24  
Status: Active gate. Nothing public without surviving this protocol.

## Purpose
Protect revenue potential and platform eligibility by systematically attacking every content asset and major system decision before exposure. This is not optional quality control. It is a hard filter against the exact failure modes that kill Original Content Rewards eligibility, waste Premium impressions, or produce low-signal noise.

## Core Principle
Assume the content or decision will be examined by a hostile, high-signal audience and by platform systems optimized to detect low-effort, automated, or non-original work. If it cannot survive that examination, it does not ship.

---

## 1. Content-Level Attack Set

Every draft goes through these attacks in sequence.

### 1.1 Platform Classifier Simulation
Simulate X’s Original Content Rewards and related filters:
- Does this read as primarily original authorship or as aggregation / light transformation?
- Are there automation signals (repetitive structure, generic phrasing, lack of specific data or lived angle)?
- Is the primary value the creator’s contribution or someone else’s material with packaging?
- Engagement-bait risk: does the post primarily solicit likes/replies/reposts rather than deliver signal?

Fail condition: Any clear match to published disqualifiers (copied, re-uploaded, automated means, minor edits only, bait).

### 1.2 Synthetic Skeptical Premium User
Role: A high-signal, time-poor Premium subscriber who follows top operators and has low tolerance for noise.

Attacks:
- “Is this actually new or just well-packaged common knowledge?”
- “Would I stop scrolling for this?”
- “Does this give me a usable insight, data point, or framing I didn’t already have?”
- “Is the voice distinctive or interchangeable with a hundred other accounts?”

Fail condition: The persona would scroll past or feel the post diluted their feed quality.

### 1.3 Competitive Undercutting
Direct comparison against the current competitive set (high-signal operators, not name-based Signal accounts).

Questions:
- Why is this better or different from what @levelsio-style or research-heavy accounts already produce?
- Does it occupy a sharper niche or higher density of originality?
- Would a reader who already follows the top 20 high-signal accounts still find this additive?

Fail condition: The content is dominated by existing high-signal accounts on the same topic with no clear edge.

### 1.4 Policy & Compliance Scan
Explicit checklist against current X Original Content Rewards language and general rules:
- Originality / meaningful transformation
- No misleading claims
- No prohibited automation of posting itself
- Disclosure requirements if any AI-generated media is used in restricted categories
- No engagement solicitation as primary purpose

Fail condition: Any direct conflict with published rules.

---

## 2. System-Level Attack Set

Applied to strategy decisions, cadence plans, amplification choices, and monetization experiments.

### 2.1 Over-Optimization Trap
- Are we optimizing for a metric that the platform can (or already does) devalue?
- Is the system becoming brittle to rule changes?

### 2.2 Detection / Pattern Risk
- Does the posting pattern, volume, or format distribution create detectable automation or low-effort signatures?
- Is originality density being diluted by forced cadence?

### 2.3 Single-Point Dependency
- Is revenue or growth overly dependent on one platform, one format, or one revenue stream?

### 2.4 Usage / Bandwidth Efficiency
- Is the cognitive and tool cost of producing this asset justified by expected signal or revenue?
- Are we burning high-value capacity on low-expected-value work?

---

## 3. Process

1. Draft created under authorship rules (human primary idea/angle/data + AI production).
2. Originality scoring gate (see ORIGINALITY.md).
3. Full adversarial review using the attack sets above.
4. Pass / Rewrite / Kill decision.
5. If rewrite: changes must address the specific failure modes identified.
6. Log the review (attacks used, critical findings, final decision).
7. Only Pass assets enter the publish queue.

Major system decisions (new formats, amplification, new monetization experiments) receive the system-level attack set before resources are committed.

---

## 4. Pass / Fail Criteria

**Pass**  
Survives all content-level attacks without critical failure. No hard policy conflict. Competitive edge is defensible. Skeptical Premium persona would not dismiss it.

**Rewrite**  
Survivable with targeted changes that address specific attack findings. Must be re-reviewed after rewrite.

**Kill**  
Critical failure on originality, policy, or fundamental lack of signal. Asset is discarded. Pattern is noted for future avoidance.

---

## 5. Logging & Feedback

Every review produces a short structured log:
- Asset ID / description
- Attacks applied
- Critical findings
- Decision (Pass / Rewrite / Kill)
- Key changes required (if Rewrite)

Patterns of failure are periodically reviewed and used to tighten the originality scoring gate and content system prompts. This is a closed improvement loop.

---

## 6. Application Priority

- All public posts and threads
- Profile bios and pinned content
- Any paid amplification creative
- Major strategic shifts
- New monetization experiments before launch

Internal drafts and pure research notes are exempt until they approach public exposure.

---

## 7. Relationship to Revenue

This protocol exists to maximize the probability that every public asset:
1. Qualifies under Original Content Rewards rules
2. Earns qualified impressions from Premium users
3. Builds durable high-signal reputation instead of temporary noise
4. Survives competitive and platform scrutiny long enough to compound

Low-signal or policy-risk content is not “fast.” It is waste. This protocol removes that waste before it can burn attention or eligibility.
