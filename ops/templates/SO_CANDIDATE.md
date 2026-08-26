---
# SO candidate frontmatter.
# Field reference (sources: ops/QUALITY_BAR.md, apps/qi-check/lib/score.js):
#   id            — candidate id, format SO-NNN (exactly three digits, e.g. SO-014).
#   date          — date the draft was written/scored, YYYY-MM-DD.
#   floors        — numeric gate floors from qi-check. Do not edit:
#                   hold 9.2 (HOLD_FLOOR), soft 7.0 (SOFT_FLOOR).
#   human_primary — must be true. Idea and angle come from operator doctrine
#                   + owner context (QUALITY_BAR pass requirement 6).
#   scores        — paste from qi-check output. composite is the weighted
#                   `total`; the dimensions match score.js exactly:
#                   firstScreenDensity, foldStructure, baitAvoidance,
#                   lengthFitness, burstiness (each 0–10).
#   disposition   — one of: Hold / Soft / Hard / Draft.
#                   Draft = not yet scored. Hold requires composite >= 9.2
#                   AND firstScreenDensity >= 8 AND baitAvoidance >= 9.
id: SO-NNN
date: YYYY-MM-DD
floors:
  hold: 9.2
  soft: 7.0
human_primary: true
scores:
  composite: 0.0
  firstScreenDensity: 0.0
  foldStructure: 0.0
  baitAvoidance: 0.0
  lengthFitness: 0.0
  burstiness: 0.0
disposition: Draft
---

# SO-NNN — working title

<!-- Draft body goes here. One complete thought; full sentences; the concrete
     decision, number, or cost in the first line. See QUALITY_BAR fail
     patterns before writing. Replace this comment with the draft text. -->
