# Leverage from Existing Beexly Repositories

**Reviewed**: 2026-08-24  
**Architect decision**: Selective extraction of patterns only. No code or identity mixing. SignalOrigin remains a clean, independent high-signal surface under its own guardrails.

---

## Beexly/XXX (Adult Agents / Media Studio / Command Deck)

**Nature**: Private multi-vertical synthetic media + agent routing project that was set aside. Contains substantial design work on content systems, gating, revenue paths, and operational discipline.

### High-value patterns extracted for SignalOrigin

1. **Owner-attestation / external-action gate**  
   EXTERNAL_ACTIONS_PERFORMED stays empty until explicit human action. Draft-only by default. Directly reinforces our rule that nothing public ships without clearing originality + adversarial gates (and, where required, human account actions).

2. **Revenue-path scoring per asset**  
   Every content atom carries an explicit revenuePath and is scored on expected value / cash speed / risk. Aligns with our measurement and kill-criteria discipline. We adapt the concept: every candidate is evaluated for Original Content Rewards eligibility and downstream monetization potential before resources are spent.

3. **Strict rail isolation**  
   SFW / company rail vs restricted / local-only rail never share processors, logs, or identity. We maintain an analogous isolation: SignalOrigin is a clean high-signal public brand. No mixing with any other vertical or identity.

4. **Command-deck / agent routing mindset**  
   Single entry point, free/local-first where possible, clear model roster, quota awareness. Informs how we orchestrate multi-agent drafting and which models sit behind which seats.

5. **Cash-first operating doctrine**  
   Real Stripe (or platform) evidence only. No theater. Planning subordinated to measurable revenue progress. Directly supports our primary scoreboard.

6. **Narrative / series thinking**  
   Content atoms linked into series, with hooks, audience, and derivative logic. Useful for building coherent SignalOrigin threads and multi-post sequences rather than isolated one-offs.

### Explicitly not imported
- Any adult / 21+ / restricted content vertical or local-only pipelines.
- Higgsfield or other generative media burn plans as primary strategy.
- Cold outreach or invented prospect loops.
- Any Stripe or payment identity belonging to other projects.

---

## Beexly/Project-Tree (Sheaf Integrity / CRC)

**Nature**: Standalone classical multi-source consistency and integrity engine (sheaf / CRC / repair classes). More mathematical and systems-integrity oriented than social content.

### High-value concepts for SignalOrigin

1. **Multi-source consistency checking**  
   Useful conceptual input for the Security seat and for verifying that research inputs, drafts, and published claims remain coherent across sources.

2. **Repair classification**  
   Ideas around consistent vs statistical vs structural inconsistency can inform how the Learning seat categorizes gate failures and chooses repair strategies.

3. **Integrity-first posture**  
   Reinforces that the platform treats consistency and verifiable structure as first-class, not optional.

### Explicitly not imported
- The full mathematical sheaf machinery as a dependency for content production.
- Any assumption that Project-Tree becomes part of the public SignalOrigin stack without separate evaluation.

---

## Operating Rule

Both repositories are treated as **internal R&D libraries**. Patterns, doctrines, and algorithms may be adapted into SignalOrigin documentation and gates. No direct code merge, no shared identity, no shared payment rails, and no contamination of the high-signal public brand. All adaptations still pass through originality, adversarial, and security review before becoming active system behavior.

This leverage decision is now part of the platform architecture.
