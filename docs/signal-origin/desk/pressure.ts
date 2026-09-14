/**
 * Pressure — pulse, not a detector.
 *
 * 2025–2026 finding: burstiness/perplexity detectors fail on diffusion LLMs
 * (Tarım & Onan, arXiv:2507.10475). Sentence-length CV is an AR-era tell.
 * Interpretable features that still move: AI-phrase density, grammatical
 * standardization, uniform paragraph pressure, missing revision scars,
 * low segment-to-segment drift (Beyond Checkmate, arXiv:2501.19301v3;
 * stylometric hybrid XGBoost: sentence-level CV + AI-phrase density).
 *
 * This does not claim "written by AI." It answers: does the surface have a pulse.
 */

export const HOLD_FLOOR = 9.2;
export const SOFT_FLOOR = 7.0;

const BAIT = [
  /\bhot take\b/i,
  /\bwill be banned\b/i,
  /\blike if you agree\b/i,
  /\bcomment (yes|below|if)\b/i,
  /\b(share|retweet) this\b/i,
  /\bthread\s*🧵/iu,
  /\b\d+\s+(ways|tips|habits|mistakes)\b/i,
  /\bgrowth hack\b/i,
];

const AI_PHRASES = [
  /\bdelve\b/i,
  /\bit'?s important to note\b/i,
  /\bin today'?s (world|landscape|digital)\b/i,
  /\bunlock(?:ing)? (the )?(full )?potential\b/i,
  /\bgame[- ]changer\b/i,
  /\bcutting[- ]edge\b/i,
  /\bnestled\b/i,
  /\btapestry\b/i,
  /\bplethora\b/i,
  /\bembark\b/i,
  /\bfoster\b/i,
  /\bholistic\b/i,
  /\bseamless\b/i,
  /\bempower(?:ing)?\b/i,
  /\bat the end of the day\b/i,
  /\bin conclusion\b/i,
  /\bfurthermore\b/i,
  /\bmoreover\b/i,
  /\bleverage\b/i,
  /\brobust\b/i,
  /\bunderscore(?:s|d)?\b/i,
  /\bas an ai\b/i,
  /\bin the realm of\b/i,
  /\ba testament to\b/i,
  /\bplay a (vital|crucial) role\b/i,
];

const SCARS = [
  /\bor rather\b/i,
  /\bi mean\b/i,
  /\bwait[,—-]/i,
  /\bscratch that\b/i,
  /\bno—/i,
  /\bcorrection:/i,
  /\bactually[, ]/i,
  /\blet me rephrase\b/i,
];

const SLOGAN = /Clean structure\.|Not policy\.|Quality\./i;

export type PressureScores = {
  firstScreen: number;
  bait: number;
  phraseDensity: number;
  paragraphPressure: number;
  lengthCv: number;
  scars: number;
  segmentDrift: number;
  sloganStack: number;
};

export type PressureMode = "original" | "reply";

export type PressureResult = {
  total: number;
  recommendation: "Hold" | "Soft rewrite" | "Hard rewrite";
  scores: PressureScores;
  flags: string[];
  fixes: string[];
  firstScreenPreview: string;
  honesty: string;
  version: string;
  mode: PressureMode;
};

function clamp(n: number) {
  return Math.max(0, Math.min(10, Math.round(n * 10) / 10));
}

function sentences(text: string) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export function paragraphWidths(text: string): number[] {
  return String(text ?? "")
    .split(/\n{2,}/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => p.length);
}

/** Visualization only. Sentences when the draft is a single block. */
export function fieldWidths(text: string): number[] {
  const paras = paragraphWidths(text);
  if (paras.length >= 2) return paras;
  return String(text ?? "")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => s.length);
}

function words(s: string) {
  return s.split(/\s+/).filter(Boolean);
}

function cv(nums: number[]) {
  if (nums.length < 2) return 0;
  const mean = nums.reduce((a, b) => a + b, 0) / nums.length;
  if (mean === 0) return 0;
  const v = nums.reduce((a, b) => a + (b - mean) ** 2, 0) / nums.length;
  return Math.sqrt(v) / mean;
}

function firstScreen(text: string, limit = 160) {
  return text.replace(/\s+/g, " ").trim().slice(0, limit);
}

export function scorePressure(raw: string, mode: PressureMode = "original"): PressureResult {
  const text = String(raw ?? "").trim();
  if (!text) {
    return {
      total: 0,
      recommendation: "Hard rewrite",
      scores: {
        firstScreen: 0,
        bait: 0,
        phraseDensity: 0,
        paragraphPressure: 0,
        lengthCv: 0,
        scars: 0,
        segmentDrift: 0,
        sloganStack: 0,
      },
      flags: ["empty"],
      fixes: ["Paste a draft."],
      firstScreenPreview: "",
      honesty: "No text.",
      version: "0.3.0-pressure",
      mode,
    };
  }

  const ss = sentences(text);
  const pLens = paragraphWidths(text);
  const head = firstScreen(text);
  const flags: string[] = [];
  const fixes: string[] = [];

  const hasClaim =
    /\b(killed|paid|refused|built|measured|failed|shipped|cut|deferred|tape-out|weights|die)\b/i.test(
      head,
    ) ||
    /\d/.test(head) ||
    head.length > 40;
  const buried = /^(so|well|today|in this|let me|i('ve| have) been)\b/i.test(head.trim());
  let first = hasClaim ? 7 : 4;
  if (buried) first -= 2;
  if (head.includes("?") && head.length < 80) first -= 1;
  first = clamp(first);

  let baitHits = 0;
  for (const re of BAIT) if (re.test(text)) baitHits++;
  const bait = clamp(10 - baitHits * 2);
  if (baitHits) flags.push("engagement bait");

  let phraseHits = 0;
  for (const re of AI_PHRASES) if (re.test(text)) phraseHits++;
  const phraseDensity = clamp(10 - phraseHits * 1.6);
  if (phraseHits) {
    flags.push(`${phraseHits} stock phrase${phraseHits === 1 ? "" : "s"}`);
    fixes.push("Cut the brochure verbs. Name the object.");
  }

  const pCv = cv(pLens);
  // Uniform paragraph widths = even pressure (the zerohedge tell).
  let paragraphPressure = 8;
  if (pLens.length >= 3 && pCv < 0.12) paragraphPressure = 3.5;
  else if (pLens.length >= 2 && pCv < 0.2) paragraphPressure = 5.5;
  else if (pCv > 0.45) paragraphPressure = 9;
  paragraphPressure = clamp(paragraphPressure);
  if (paragraphPressure < 6) {
    flags.push("even paragraph pressure");
    fixes.push("Leave a scar. One paragraph should be the wrong length.");
  }

  const lens = ss.map((s) => words(s).length);
  const lcv = cv(lens);
  // High CV used to mean "human." Diffusion models fake this (arXiv:2507.10475).
  // We still score it, but it is a weak vote, not the floor.
  let lengthCvScore = 6;
  if (ss.length >= 2) {
    if (lcv < 0.18) lengthCvScore = 3.5;
    else if (lcv < 0.32) lengthCvScore = 6;
    else lengthCvScore = 8;
  }
  lengthCvScore = clamp(lengthCvScore);

  let scarCount = 0;
  for (const re of SCARS) if (re.test(text)) scarCount++;
  const scars = clamp(scarCount === 0 ? (text.length > 400 ? 5 : 7) : Math.min(10, 7 + scarCount));
  if (scarCount === 0 && text.length > 400) {
    flags.push("no revision scar");
    fixes.push("A human changes their mind mid-thought. This didn't.");
  }

  // Segment drift: first third vs last third sentence length.
  let segmentDrift = 6;
  if (ss.length >= 6) {
    const n = Math.floor(ss.length / 3);
    const a = cv(ss.slice(0, n).map((s) => words(s).length));
    const b = cv(ss.slice(-n).map((s) => words(s).length));
    const drift = Math.abs(a - b);
    segmentDrift = clamp(drift < 0.05 ? 4 : drift > 0.2 ? 9 : 6.5);
    if (segmentDrift < 5.5) {
      flags.push("flat across the piece");
      fixes.push("Humans vary more from opening to close than this does.");
    }
  }

  const shortRun = lens.filter((n) => n > 0 && n <= 6).length;
  const sloganStack = clamp(
    SLOGAN.test(text) || (ss.length >= 3 && shortRun / ss.length > 0.7) ? 2 : 9,
  );
  if (sloganStack < 5) {
    flags.push("slogan stack");
    fixes.push("Stop the staccato. One sentence may be short. Three in a row is a poster.");
  }

  const scores: PressureScores = {
    firstScreen: first,
    bait,
    phraseDensity,
    paragraphPressure,
    lengthCv: lengthCvScore,
    scars,
    segmentDrift,
    sloganStack,
  };

  const weights: Record<keyof PressureScores, number> = {
    firstScreen: 0.22,
    bait: 0.14,
    phraseDensity: 0.16,
    paragraphPressure: 0.16,
    lengthCv: 0.06, // demoted — diffusion fools it
    scars: 0.1,
    segmentDrift: 0.08,
    sloganStack: 0.08,
  };

  let total = 0;
  (Object.keys(weights) as (keyof PressureScores)[]).forEach((k) => {
    total += scores[k] * weights[k];
  });
  total = Math.round(total * 10) / 10;

  if (first < 8) fixes.push("Put the concrete claim in the first line.");
  if (bait < 9) fixes.push("Strip the farm.");

  let recommendation: PressureResult["recommendation"] = "Hold";
  if (mode === "reply") {
    // Dual-gate: replies are not first-impression originals.
    const replyFail =
      bait < 8 || sloganStack < 5 || phraseDensity < 6 || total < 6.5;
    const replySoft = total < 7.5 || first < 6;
    if (replyFail) recommendation = "Hard rewrite";
    else if (replySoft) recommendation = "Soft rewrite";
    else recommendation = "Hold";
  } else {
    if (total < SOFT_FLOOR || bait < 6 || sloganStack < 4) recommendation = "Hard rewrite";
    else if (total < HOLD_FLOOR || first < 8 || bait < 9 || flags.length >= 3)
      recommendation = "Soft rewrite";
  }

  return {
    total,
    recommendation,
    scores,
    flags,
    fixes: [...new Set(fixes)],
    firstScreenPreview: head,
    honesty:
      mode === "reply"
        ? "Reply gate. Not Hold 9.2. Fail on bait, slogan stack, or stock phrases. Burstiness is a weak vote."
        : "Original gate. Hold 9.2. Not an AI detector. Burstiness is a weak vote (diffusion models fake it). Phrase density, even paragraph pressure, and missing revision scars are the load-bearing tells.",
    version: "0.3.0-pressure",
    mode,
  };
}
