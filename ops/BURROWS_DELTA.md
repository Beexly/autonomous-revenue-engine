# Burrows’ Delta — Implementation Plan for SignalOrigin Gates

**Goal:** Runnable voice-consistency metric inside the originality gate.  
**Authorship rule unchanged:** Human-primary; Delta polices production drift, does not launder AI.

---

## Upstream libraries (specific links)

| Library | Link | Role |
|---------|------|------|
| **faststylometry** | https://github.com/fastdatascience/faststylometry | Primary: `calculate_burrows_delta`, corpus helpers, optional `predict_proba` |
| Tutorial / maths | https://fastdatascience.com/fast-stylometry-python-library/ | Operator reference |
| Colab walkthrough | https://colab.research.google.com/github/fastdatascience/faststylometry/blob/main/Burrows%20Delta%20Walkthrough.ipynb | Calibration |
| **pystylometry** | https://github.com/craigtrim/pystylometry | Broader metric pack (TTR, MTLD, Delta variants) |
| **jamesosullivan/stylometry** | https://github.com/jamesosullivan/stylometry | Transparent Delta + dendrogram/MDS scripts |
| **pydelta** (historical) | https://github.com/fotisj/pydelta → https://github.com/cophi-wue/pydelta | Classic Argamon-style variants |
| **burrows02** (PAN reimplementation) | https://github.com/pan-webis-de/burrows02 | Research-grade reference |
| Programming Historian lesson | https://programminghistorian.org/en/lessons/introduction-to-stylometry-with-python | Conceptual grounding |

Install path for primary library:
```bash
pip install faststylometry
# If numpy conflicts on some Python builds, pin per upstream README notes
```

---

## Algorithm (classic form we implement)

1. Tokenize reference corpus (Pass assets / approved voice samples). Prefer function words / high-frequency tokens; optional pronoun stripping for English via library helpers.
2. Relative frequencies of top *n* features (typically 50–150).
3. Per-feature mean μ and std σ across reference.
4. Z-scores: `z_i(D) = (f_i(D) - μ_i) / σ_i`
5. Delta between candidate T and reference A:  
   `Δ(T,A) = (1/n) * Σ |z_i(T) - z_i(A)|`  
   (mean absolute difference of z-scores).
6. **Lower Δ ⇒ closer stylistic match** to the SignalOrigin voice corpus.

Optional: faststylometry `calibrate` + `predict_proba` for same-author style probability as a secondary signal.

---

## Gate integration

| Step | Behavior |
|------|----------|
| Reference corpus | Growing set of **Pass-only** texts (and explicit human seed angles). Never train voice on Kill/Rewrite failures as positives. |
| Score mapping | Map Δ into originality dimension “automation risk / voice consistency” (0–10). Very high Δ vs our corpus + other AI tells → pressure Rewrite/Kill. |
| Short posts | Unstable n; use cumulative thread text or require minimum token count before Delta is decisive. |
| Combined with | Burstiness (sentence-length CV), lexical diversity, adversarial checklist, OCR alignment dimension |

Pseudo-flow:
```text
candidate text
  → tokenize
  → burrows_delta(reference_pass_corpus, candidate)
  → burstiness_cv(sentences)
  → lexical_diversity
  → rubric 6 dimensions including OCR alignment
  → adversarial review
  → Pass | Rewrite | Kill + log
```

---

## Implementation phases

**Phase A (now):** Document + dependency pin; offline script that scores a candidate folder against a `data/voice_reference/` corpus using faststylometry.  
**Phase B:** Wire script into `gates/` CLI: `python -m gates.score path/to/candidate.txt` → JSON score line for ACTION_LOG.  
**Phase C:** After ≥N Pass assets exist, auto-refresh reference corpus from Pass queue only.

---

## Non-goals

- Using Delta to “prove” human authorship in a legal sense.  
- Optimizing solely to minimize Δ while emptying content of substance.  
- Replacing adversarial review or OCR policy compliance.
