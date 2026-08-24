# Extensive Tiered Fork Registry — SignalOrigin Platform

Reviewed against current systems, future platform scope, and all guardrails (authorship primary, originality + adversarial gates, Original Content Rewards survival, no raw automation, revenue priority, near-zero owner load).

Last updated: 2026-08-24

---

## TIER 1 — Originality, Authenticity & Gating (Highest Strategic Priority)

These repositories directly strengthen the non-negotiable gates. They are evaluated first because failure here kills eligibility and signal quality.

### OriginLytics (GixGosu/originlytics)
- Real ML stack (RoBERTa classifier + DistilGPT-2 perplexity ensemble), 10 tools, 17+ metrics including AI detection, GEO, toxicity, emotional analysis, readability.
- **Alignment**: Direct foundation for the originality scoring gate. Can be specialized to our six-dimension rubric and mapped to X Original Content Rewards language.
- **Current work**: Scoring dimensions and pass thresholds already defined; this supplies the actual detection models.
- **Future work**: Core of the automated originality gate that runs before adversarial review.
- **Guardrail fit**: Strong. We keep the detection and metric engines; we discard or heavily constrain any paraphraser/rewriter paths that could encourage low-authorship output.
- **Action**: Primary fork candidate. Specialize scoring, strip volume-oriented features, lock to our pass/fail logic.

### DocInsight (VedantKothari01/DocInsight)
- Semantic similarity (SBERT) + stylometric analysis + citation masking + explainable multi-layered originality scoring with risk spans.
- **Alignment**: Excellent for deeper “meaningful transformation” analysis when external material is referenced.
- **Current work**: Supports the transformation-quality dimension of the originality gate.
- **Future work**: Explainable risk spans for adversarial review evidence.
- **Guardrail fit**: High. Focused on originality risk rather than generation.
- **Action**: Secondary fork for the transformation and stylometry modules.

### contentos-agent-lite (humanswith-ai)
- Process-gated content agent with 8 explicit scored gates (context → sources → brief → draft → checks → uplift → publish). 0–100 scoring, hard stops before drafting.
- **Alignment**: Philosophically identical to “no draft before the work is done.” Reinforces authorship and research-first discipline.
- **Current work**: Can sit upstream of our originality and adversarial gates as the drafting engine.
- **Future work**: Internal candidate generator that only emits material already structured for our gates.
- **Guardrail fit**: Excellent. Process discipline prevents raw automated output.
- **Action**: Strong fork candidate for the research-to-brief-to-candidate pipeline.

### Crocking / CHAOSS disclosure-style tools
- Statistical and trailer-based authorship signal detection (originally for code, transferable concepts).
- **Alignment**: Provenance and automation-signal detection ideas.
- **Current work**: Conceptual input to automation-risk dimension of originality scoring.
- **Future work**: Logging and audit trails for content provenance.
- **Guardrail fit**: Supportive of transparency and detection of automated patterns.
- **Action**: Concept extraction and selective adaptation rather than full product fork.

### Additional authenticity / detection repositories reviewed
- Various GPTZero / Originality.ai evaluation harnesses and academic detector benchmarks → useful for calibration and adversarial testing of our own gate, not for production generation.
- Stylometric and perplexity-based open detectors → components that can be composed into the ensemble.
- Watermark / provenance research tools → awareness layer only; we do not optimize for evasion of legitimate detection.

**Tier 1 principle**: Every fork here must strengthen the ability to prove human-primary authorship and to reject low-signal or policy-risk material. Nothing that encourages volume over originality survives.

---

## TIER 2 — Multi-Agent Orchestration & Content Pipelines

These supply the structured production machinery. All are evaluated for how cleanly our originality + adversarial gates can be inserted as non-bypassable stages.

### Agentic-Social-Media-Content-Manager (LangGraph multi-agent)
- Strategist → Planner → Creator → Reviewer → Executor with stateful orchestration, research tools, and conditional routing.
- **Alignment**: Closest architectural match to a gated multi-agent pipeline.
- **Current work**: Reviewer node is the natural insertion point for our originality + adversarial suite.
- **Future work**: Full internal drafting and planning engine.
- **Guardrail fit**: Good after the generic Reviewer is replaced with our hard gates. Research and planning agents stay; generation agents become candidate-only.
- **Action**: High-priority structural fork. Replace review logic, keep orchestration.

### SocialFlow
- 6-agent autonomous CMO (Scout → Planner → Creator → Reviewer → Publisher → Analyst) with brand kit, claim validation, and self-hosted design.
- **Alignment**: Strong end-to-end autonomous social pattern with approval gates already present.
- **Current work**: Brand kit and claim-validation ideas align with voice and policy discipline.
- **Future work**: Self-hosted backbone for multi-platform once accounts exist.
- **Guardrail fit**: Requires hardening of Creator and Publisher stages so nothing ships without our gates.
- **Action**: Strong fork candidate; treat as platform skeleton.

### agent-content-kit
- Full multi-agent pipeline from URL/document → script → voiceover → video → Telegram approval → multi-platform upload.
- **Alignment**: Direct support for the YouTube / Instagram / TikTok leg.
- **Current work**: Secondary surface preparation.
- **Future work**: Short-form production once the X primary path is stable.
- **Guardrail fit**: Approval step is useful; must still run our originality/adversarial gates on scripts and final assets before publish.
- **Action**: Fork for short-form vertical once primary X systems are live.

### contentos-agent-lite (also listed in Tier 1)
- Dual role: process discipline (Tier 1) and candidate generation engine (Tier 2).

### x-use (browser-native X agents)
- Real browser automation for X, multi-account capable, MCP-ready, draft-approval by default, no paid X API required.
- **Alignment**: Extremely high leverage for the X surface under cost and API constraints.
- **Current work**: Future distribution and engagement tooling.
- **Future work**: Controlled posting and engagement once accounts and gates are live.
- **Guardrail fit**: Draft-approval default is compatible with our “nothing ships without gates” rule. Must never be used for raw automated spraying.
- **Action**: High-value specialized fork for the X leg.

### Additional multi-agent / social pipeline repositories reviewed
- CrewAI-based social media marketing crews (research → strategy → calendar → posts → SEO).
- Various LangGraph and AutoGen social automation examples.
- Agentfy-style modular multi-agent social systems.
- Open-source “AI CMO” and content-calendar agents.

**Tier 2 principle**: Orchestration and research are kept. Generation is always candidate-only. Our gates are the only path to publish. Any volume-first or engagement-bait logic is removed.

---

## TIER 3 — Distribution, Scheduling, Measurement & Revenue Plumbing

These become useful after the gates and primary content engine are solid. They are not allowed to drive strategy.

### Postiz (gitroomhq/postiz-app)
- Mature open-source agentic social scheduling and analytics tool supporting many platforms, self-hostable, API-friendly.
- **Alignment**: Strong candidate for controlled multi-platform scheduling and basic analytics once content has cleared gates.
- **Current work**: Future distribution backbone.
- **Future work**: Scheduling and cross-platform measurement layer.
- **Guardrail fit**: Acceptable only as a downstream publisher of already-approved assets. Must not become a source of unreviewed content.
- **Action**: Primary open-source scheduler evaluation target.

### Other open-source social schedulers reviewed
- Mixpost — self-hosted Buffer-style alternative.
- GrowChief and similar outreach/workflow node systems.
- Various n8n / Make-compatible open scheduling stacks.
- Browser-automation-based publishers that appear in agent-content-kit and SocialFlow ecosystems.

**Evaluation criteria for all schedulers**:
- Can it be restricted to only accept pre-approved assets?
- Does it support the platforms we care about (X primary, then YT/IG/TT)?
- Self-hostable or low ongoing cost?
- Analytics sufficient for Premium-impression and revenue attribution proxies?
- Risk of encouraging high-volume low-signal posting?

### Revenue and fulfillment patterns
- Autonomous revenue-engine repositories (content → product → Stripe/PayPal fulfillment).
- Affiliate static-storefront and hourly revenue rotation systems.
- MCP monetization toolkits and usage-based billing patterns.
- Web Monetization / publisher-tool experiments.

**Alignment**: Secondary. Useful once SignalOrigin has measurable attention and we need clean ways to convert it. Must never dictate content strategy.

### Monitoring & competitive awareness
- changedetection.io and similar page/change monitors.
- Competitive intelligence and signal-aggregation agents.

**Alignment**: Support for research intake and rule-change awareness.

**Tier 3 principle**: These layers serve the gated content engine. They never bypass or weaken the originality and adversarial requirements.

---

## Open-Source Social Schedulers — Focused Exploration

**Postiz** currently stands out for maturity, multi-platform support, self-hosting, and agentic features. It is the leading candidate for the controlled distribution layer once we have a steady flow of gate-cleared assets.

**Mixpost** and lighter Buffer-style alternatives are secondary options if Postiz proves heavier than needed.

**Browser-automation publishers** (embedded in SocialFlow, agent-content-kit, x-use) are valuable for platforms where official APIs are expensive or restricted, but they increase operational and detection risk and must remain behind approval gates.

**Decision rule**: No scheduler is connected to live accounts until the originality + adversarial pipeline is producing a reliable stream of Pass assets and basic measurement is in place. Scheduling is a multiplier of quality, never a substitute for it.

---

## Summary Mapping to Platform Layers

| Platform Layer              | Primary Fork Sources                          | Guardrail Enforcement                  |
|----------------------------|-----------------------------------------------|----------------------------------------|
| Research & Intake          | contentos, SocialFlow Scout, change monitors | Research-only, no publish path        |
| Multi-Agent Drafting       | LangGraph agentic systems, contentos, CrewAI | Candidate-only output                 |
| Originality Gate           | OriginLytics, DocInsight, stylometry tools   | Hard scored gate                      |
| Adversarial Gate           | Custom + detector calibration harnesses      | Hard pass/rewrite/kill                |
| Packaging & Distribution   | Postiz, x-use, agent-content-kit, SocialFlow | Only pre-approved assets              |
| Measurement & Revenue      | Postiz analytics, revenue-engine patterns    | Attribution after signal exists       |
| Feedback                   | Custom logging from all gates                | Continuous tightening                 |

---

This registry is extensive by design. Every listed direction has been reviewed against the current systems, the elevated platform ambition, and the full set of guardrails. Prioritization for actual forking will follow expected leverage on speed-to-qualified-impressions and speed-to-revenue while preserving the authorship and quality constraints.
