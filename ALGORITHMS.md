# Algorithms & Protocols — Implementation Notes

## 1. Burrows’ Delta (Implemented)

**Purpose in platform**: Quantitative stylometric distance measure for the originality / voice-consistency dimensions of the scoring gate and for adversarial calibration.

### Exact Procedure (Classic Burrows’ Delta)
1. Build a corpus of known-author texts (or prior SignalOrigin approved posts as the “author” reference).
2. Compute relative frequencies of the most frequent words (MFWs), typically top 50–150 function words / high-frequency tokens.
3. For each word, calculate the mean frequency and standard deviation across the reference corpus.
4. Convert frequencies to z-scores:
   ```
   z_i(D) = (f_i(D) - μ_i) / σ_i
   ```
5. For a candidate text T and each reference author/subcorpus A:
   ```
   Δ(T, A) = (1/n) * Σ |z_i(T) - z_i(A)|
   ```
   (Manhattan distance of the z-score vectors, averaged).
6. Lowest Δ indicates closest stylistic match.

**Implementation notes for us**:
- Use relative frequencies to normalize length.
- Prefer function words and high-frequency tokens (less topic-sensitive).
- Reference set can be previous Pass assets from SignalOrigin to enforce brand voice consistency.
- Variants (Quadratic Delta, Cosine Delta) can be added later for robustness.
- Libraries already aligned: faststylometry, pystylometry, open-stylometry.

This is now an active component of the Originality Scoring Gate.

---

## 2. C2PA Content Credentials & Watermarking (Explored)

**What it is**: Open standard (Coalition for Content Provenance and Authenticity) for cryptographically signed provenance metadata (“Content Credentials”). Records origin, tools used, edits, and AI involvement in a tamper-evident manifest.

**Key mechanics**:
- **Hard binding**: Cryptographic hash of the exact asset bytes. Any change invalidates the signature.
- **Soft binding**: Invisible watermark or perceptual fingerprint that can rediscover the manifest after metadata is stripped (e.g., platform re-encoding).
- Assertions can declare digitalSourceType, AI disclosure, regions of interest, generation recipes, and action history.
- Current spec around 2.3+ (2026); supported by major vendors (Adobe, Google, Microsoft, OpenAI, etc.).

**Relation to watermarks**:
- C2PA itself is primarily signed metadata.
- Soft-binding often uses steganographic watermarks (SynthID-class, TrustMark, PawPrint, etc.) so the credential survives metadata stripping.
- Statistical text watermarks / green-list methods are separate from C2PA.

**Platform stance**:
- Awareness and monitoring layer only.
- We do not currently embed C2PA credentials as a core requirement (text-first X surface has limited support).
- When producing images/video or publishing to surfaces that respect Content Credentials, we will evaluate attaching accurate provenance (human-primary authorship + AI production role) rather than stripping or spoofing.
- Never used to evade detection; used only for transparent, accurate disclosure when beneficial.

---

## 3. Nostr Relay Delays & Performance (Detailed)

**Nature of delays**:
Nostr has no global clock or single leader. Latency is the product of:
- Client → multiple relays (parallel WebSocket connections)
- Relay processing + storage backend (LMDB, SQLite, etc.)
- Relay → other clients / outbox model
- Network path and geographic distance
- Relay load, rate limits, and policy (write vs read)

**Observed characteristics (2026 data)**:
- High-performance relays (strfry, rnostr, well-tuned implementations) routinely achieve sub-2 ms to low tens of ms internal query latency under good conditions; end-to-end user-perceived latency is higher.
- Real-world multi-relay queries: first events often arrive in 500–700 ms; with a short grace window (≈2 s) after first EOSE, completeness of 86–99% is commonly reported.
- Slow or dead relays dominate tail latency if the client waits for all of them. Best practice is parallel queries + early cutoff / progressive rendering.
- Throughput on strong relays can reach thousands to tens of thousands of events/sec in benchmarks; public free relays vary widely and some experience significant downtime.
- Outbox model + NIP-65 relay lists + liveness filtering + learned scoring materially improve both recall and latency versus hard-coded popular relays.

**Engineering implications for SignalOrigin**:
- If/when Nostr is used as a secondary surface, treat it as eventually-consistent and multi-relay.
- Prefer a small set of high-quality, low-latency relays plus author outbox relays rather than flooding every public relay.
- Implement progressive display and strict timeouts so one slow relay cannot block the experience.
- All content still passes originality + adversarial gates before any publish attempt; relay performance never influences the quality gate.

---

These three areas are now documented and engineered into the platform reference. Burrows’ Delta is an active scoring component. C2PA is an awareness/monitoring + optional future disclosure layer. Nostr relay behavior informs any future decentralized distribution design.
