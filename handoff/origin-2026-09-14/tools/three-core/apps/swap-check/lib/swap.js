/**
 * swap-check — interchangeability / swap-test (QUALITY_BAR fail pattern + SO-010).
 * Higher score = more interchangeable (worse). Lower interchangeability is the goal.
 * Does not rewrite. Keep in sync with docs/swap-check.html.
 */

export const DEFAULT_BRANDS = ["GrowthOS", "PromptForge", "OperatorKit"];

const JARGON = [
  "leverage",
  "unlock",
  "10x",
  "agentic",
  "playbook",
  "scale",
  "growth",
  "personal brand",
];

const FAILURE_VERBS = [
  "killed",
  "paid",
  "refused",
  "shipped",
  "deferred",
  "cut",
  "kill",
  "pay",
  "refuse",
  "ship",
  "defer",
];

const FIRST_PERSON_RE =
  /\b(i|we|me|us|my|our|mine|ours|i'm|we're|i've|we've|i'd|we'd)\b/gi;

const FAILURE_RE = new RegExp("\\b(" + FAILURE_VERBS.join("|") + ")\\b", "i");

const NUMBER_WORDS_RE =
  /\b(one|two|three|four|five|six|seven|eight|nine|ten|dozen|hundred|thousand)\b/i;

function clamp(n) {
  return Math.max(0, Math.min(10, Math.round(n * 10) / 10));
}

function sentences(text) {
  return String(text)
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Lived digits exclude 10x-style jargon. */
function hasLivedDigit(text) {
  const stripped = String(text).replace(/\b\d+x\b/gi, "");
  return /\d/.test(stripped) || NUMBER_WORDS_RE.test(stripped);
}

function hasFailureVerb(text) {
  return FAILURE_RE.test(String(text));
}

function ignoreSet(brands) {
  const s = new Set(["brandx"]);
  for (const b of brands || []) s.add(String(b).toLowerCase());
  return s;
}

function hasProperNoun(text, brands) {
  const ignore = ignoreSet(brands);
  const words = String(text).split(/\s+/);
  for (let i = 0; i < words.length; i++) {
    const raw = words[i].replace(/[^A-Za-z]/g, "");
    if (!raw || raw.length < 2) continue;
    if (i === 0) continue;
    if (ignore.has(raw.toLowerCase())) continue;
    if (/^[A-Z][a-zA-Z]+$/.test(raw)) return true;
  }
  return false;
}

function jargonHits(text) {
  const lower = String(text).toLowerCase();
  return JARGON.filter((j) => lower.includes(j));
}

function hasLivedConstraint(text, brands) {
  return (
    hasLivedDigit(text) ||
    hasFailureVerb(text) ||
    hasProperNoun(text, brands)
  );
}

/** Pronoun-free brandable slogan: short, no I/we, no lived failure. */
function isPronounFreeSlogan(sentence) {
  const words = sentence.trim().split(/\s+/).filter(Boolean);
  if (words.length < 2 || words.length > 10) return false;
  FIRST_PERSON_RE.lastIndex = 0;
  if (FIRST_PERSON_RE.test(sentence)) return false;
  if (hasFailureVerb(sentence)) return false;
  if (hasLivedDigit(sentence) && jargonHits(sentence).length === 0) return false;
  return true;
}

function swapFirstPerson(text) {
  return String(text).replace(FIRST_PERSON_RE, "BrandX");
}

/** True when the draft still works as a generic brand pitch after BrandX swap. */
function survivesBrandXSwap(text, brands) {
  const swapped = swapFirstPerson(text);
  return !hasLivedConstraint(swapped, brands);
}

export function scoreSwap(text, { brands = DEFAULT_BRANDS } = {}) {
  const t = text == null ? "" : String(text);
  const trimmed = t.trim();
  if (!trimmed) {
    return {
      score: 10,
      hits: ["empty"],
      recommendation: "interchangeable",
      notes: ["empty draft is fully interchangeable"],
    };
  }

  const brandList =
    Array.isArray(brands) && brands.length ? brands : DEFAULT_BRANDS;
  const hits = [];
  const notes = [];
  let score = 0;

  const ss = sentences(trimmed);
  const slogans = ss.filter(isPronounFreeSlogan);
  if (slogans.length) {
    score += Math.min(3, slogans.length * 1.5);
    hits.push("pronoun-free slogan");
    notes.push(slogans.length + " pronoun-free brandable slogan(s)");
  }

  const jargon = jargonHits(trimmed);
  const lived = hasLivedConstraint(trimmed, brandList);
  if (jargon.length && !lived) {
    score += Math.min(3, jargon.length);
    hits.push("generic operator jargon");
    notes.push("jargon without lived constraint: " + jargon.join(", "));
  } else if (jargon.length) {
    notes.push("jargon present but anchored by a lived constraint");
  }

  if (survivesBrandXSwap(trimmed, brandList)) {
    score += 2;
    hits.push("survives BrandX swap");
    notes.push(
      "sentences still parse after swapping first-person specifics for BrandX"
    );
  } else {
    notes.push(
      "the swap would not have shown — draft depends on a specific constraint"
    );
  }

  if (!lived) {
    score += 3;
    hits.push("missing lived constraint");
    notes.push("no digits, proper nouns, or kill/refuse/pay verbs");
  } else {
    notes.push(
      "lived constraint present (digit, proper noun, or decision verb)"
    );
    score = Math.max(0, score - 3);
  }

  if (
    lived &&
    hasFailureVerb(trimmed) &&
    (hasLivedDigit(trimmed) || hasProperNoun(trimmed, brandList))
  ) {
    score = Math.min(score, 2);
  }

  score = clamp(score);

  let recommendation = "specific";
  if (score >= 7) recommendation = "interchangeable";
  else if (score >= 4) recommendation = "swap-risk";

  notes.push("brands tested: " + brandList.join(", "));

  return { score, hits, recommendation, notes };
}
