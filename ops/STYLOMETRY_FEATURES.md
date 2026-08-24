# Stylometry Feature Engineering

**Purpose:** Feature inventory for the originality / voice gate. Human-primary rule unchanged — features score production; they do not launder AI.

---

## 1. Feature families (engineer these)

### Lexical
- Type–token ratio (TTR), MATTR, MTLD, HD-D, VocD-D, MSTTR
- Hapax legomena rate, Yule’s K / I
- Average word length, long-word ratio
- Function-word frequencies (core of Burrows’ Delta)
- Content-word rates vs function-word rates
- Character n-grams (esp. 2–6) and word n-grams (1–2) as sparse vectors

### Syntactic
- POS ratios (pronouns, conjunctions, prepositions, modals)
- Sentence length mean + variance (feeds burstiness)
- Dependency depth / distance, passive rate, clausal density
- T-unit / clause length
- Mixed syntactic n-grams (word + POS + dependency labels) where parse cost is acceptable

### Character / orthographic
- Letter frequencies, digit/uppercase ratios
- Punctuation rates (comma, semicolon, dash, quote, ellipsis)
- Whitespace / newline patterns (esp. short-form social text)

### Discourse / stylistic markers
- Hedge / intensifier / modal density
- Transition-phrase density (AI-cadence lists are *negative* signals for us)
- “Not X but Y” / negative parallelism rate (common LLM tell)
- First-person start rate, list/markdown structure rates on social posts

### Distributional / model-relative
- Per-span perplexity mean + burstiness (σ/μ or successive |Δ|)
- Cross-entropy under author- or voice-specific LMs (advanced)
- Embedding distance to Pass-corpus centroid (SBERT / style embedders)

### Authorship distances
- Burrows’ Delta, Cosine Delta, other Delta variants
- Zeta, MinMax, NCD where useful as secondary checks

---

## 2. Engineering principles for SignalOrigin

1. **Short-text stability:** Single X posts are short — prefer windowed MATTR, cumulative thread text, or require minimum tokens before hard thresholds.
2. **Topic vs style:** Prefer function words, POS, punctuation, and character n-grams over content words when scoring *voice*; use novelty/specificity separately for substance.
3. **Pass-only reference:** Fit voice centroids and Delta reference only on Pass assets + explicit human seeds.
4. **Multi-signal, not single score:** Combine Delta + burstiness + lexical diversity + discourse tells + adversarial checklist.
5. **No laundering objective:** Do not optimize features to minimize detector scores on raw model output.

---

## 3. Repos that advance this to the next level

| Repo | Link | Why it levels up |
|------|------|------------------|
| **pystylometry** | https://github.com/craigtrim/pystylometry | 50+ metrics across lexical, syntactic, authorship, n-grams, consistency — best single toolkit to wire |
| **faststylometry** | https://github.com/fastdatascience/faststylometry | Production Burrows’ Delta + probability calibration |
| **SuperStyl** | https://github.com/SupervisedStylometry/SuperStyl | Supervised pipelines on char/word n-grams + SVM; rolling stylometry viz |
| **Text Authorship Detection (MALTO 2026)** | https://github.com/Sajjad-Shahali/Text_Authorship_Detection | 43 hand-crafted stylometric dims + TF-IDF + stacking — strong feature list for human vs multi-LLM |
| **llm-stylometry (ContextLab)** | https://github.com/ContextLab/llm-stylometry | LLM-as-stylometric-model: author-specific GPT-2 cross-entropy as similarity |
| **open-stylometry** | https://github.com/sleeplesshan/open-stylometry | Framework + AI-detector showcase (use features, not as product claim) |
| **jamesosullivan/stylometry** | https://github.com/jamesosullivan/stylometry | Transparent Delta + MDS/dendrogram scripts |
| **Style Scalpel** (research system) | https://github.com/m0333ism-dev/Style-Scalpel | Large interpretable feature maps for human vs AI exploration |

**Optional embedding path (later):** style-tuned sentence embedders (e.g. gte-tiny LLM-family stylometry on HF) for distance-to-Pass-centroid — secondary to classical features.

**Reject as product:** humanizer / bypass repos. Feature ideas from detector literature are fine; rewrite-to-fool is not.

---

## 4. Suggested gate feature vector (v1)

Minimum viable set to implement next:
1. Burrows’ Delta vs Pass corpus (faststylometry)
2. Sentence-length burstiness (CV)
3. MATTR or MTLD
4. Function-word profile distance
5. Punctuation-rate vector
6. AI-cadence phrase hits (count, not binary doom)
7. Mean perplexity under one open reference LM (if cheap) else defer

Map into existing 0–10 dimensions; keep 42/60 + floor 5 rules.
