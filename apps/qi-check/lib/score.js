/**
 * qi-check v0.1 — deterministic, no model calls.
 * Scores draft text for first-screen hold / OCR-aligned structure.
 * Does NOT rewrite, does NOT claim AI-detection bypass.
 */

const BAIT_PATTERNS = [
  /\bhot take\b/i,
  /\bwill be banned\b/i,
  /\blike if you agree\b/i,
  /\bcomment (yes|below|if)\b/i,
  /\b(share|retweet) this\b/i,
  /\bthread\s*🧵/i,
  /\b\d+\s+(ways|tips|habits|mistakes)\b/i,
  /\bnot financial advice\b/i,
  /\bgrowth hack\b/i,
];

function sentences(text) {
  return text
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function firstScreen(text, limit = 160) {
  const t = text.replace(/\s+/g, " ").trim();
  return t.slice(0, limit);
}

function scoreFirstScreenDensity(text) {
  const head = firstScreen(text);
  const hasClaim =
    /\b(killed|paid|refused|built|measured|failed|shipped|cut|deferred)\b/i.test(head) ||
    /\d/.test(head) ||
    head.length > 40;
  const buried = /^(so|well|today|in this|let me|i('ve| have) been)\b/i.test(head.trim());
  let s = hasClaim ? 7 : 4;
  if (buried) s -= 2;
  if (head.includes("?") && head.length < 80) s -= 1; // pure hook question
  return clamp(s);
}

function scoreFoldStructure(text) {
  const lines = text.split(/\n+/).map((l) => l.trim()).filter(Boolean);
  if (lines.length === 0) return 0;
  const shortOpen = lines[0].length <= 90;
  const hasBody = lines.length >= 2 || text.length > 120;
  let s = shortOpen ? 7 : 4;
  if (hasBody) s += 1;
  if (lines[0] === lines[0].toUpperCase() && lines[0].length > 20) s -= 2;
  return clamp(s);
}

function scoreBait(text) {
  let hits = 0;
  for (const re of BAIT_PATTERNS) if (re.test(text)) hits++;
  // 0 hits = 10, each hit -2
  return clamp(10 - hits * 2);
}

function scoreLengthFitness(text) {
  const n = text.trim().length;
  if (n < 40) return 3;
  if (n <= 400) return 9;
  if (n <= 900) return 7;
  if (n <= 2000) return 5;
  return 3;
}

function scoreBurstiness(text) {
  const ss = sentences(text);
  if (ss.length < 2) return 6;
  const lens = ss.map((s) => s.split(/\s+/).length);
  const mean = lens.reduce((a, b) => a + b, 0) / lens.length;
  const variance =
    lens.reduce((a, b) => a + (b - mean) ** 2, 0) / lens.length;
  const cv = mean === 0 ? 0 : Math.sqrt(variance) / mean;
  // very flat cadence (cv < 0.25) soft penalty
  if (cv < 0.2) return 4;
  if (cv < 0.35) return 6;
  return 8;
}

function ocrFlags(text) {
  const head = firstScreen(text, 200);
  return {
    originalAnglePresent:
      /\b(we|i)\b/i.test(text) &&
      /\b(killed|paid|refused|built|failed|shipped)\b/i.test(text),
    replyPrimaryOnly: false, // caller may override if posting as reply
    substancePastFirstScreen: text.trim().length > head.trim().length + 20,
  };
}

function clamp(n) {
  return Math.max(0, Math.min(10, Math.round(n * 10) / 10));
}

export function scoreDraft(text, { platform = "x" } = {}) {
  if (!text || !String(text).trim()) {
    return {
      error: "empty_text",
      recommendation: "Hard rewrite",
    };
  }
  const t = String(text);
  const scores = {
    firstScreenDensity: scoreFirstScreenDensity(t),
    foldStructure: scoreFoldStructure(t),
    baitAvoidance: scoreBait(t),
    lengthFitness: scoreLengthFitness(t),
    burstiness: scoreBurstiness(t),
  };
  const weights = {
    firstScreenDensity: 0.3,
    foldStructure: 0.2,
    baitAvoidance: 0.25,
    lengthFitness: 0.15,
    burstiness: 0.1,
  };
  let total = 0;
  for (const k of Object.keys(weights)) total += scores[k] * weights[k];
  total = Math.round(total * 10) / 10;

  const flags = ocrFlags(t);
  const fixes = [];
  if (scores.firstScreenDensity < 6)
    fixes.push("Put the concrete claim in the first 160 characters.");
  if (scores.foldStructure < 6)
    fixes.push("Open with a short line; add mechanism in line 2–3.");
  if (scores.baitAvoidance < 8)
    fixes.push("Strip engagement-farm CTAs and listicle bait phrasing.");
  if (scores.lengthFitness < 6)
    fixes.push("Tighten length; prefer one complete thought over sprawl.");
  if (scores.burstiness < 6)
    fixes.push("Vary sentence length; avoid flat model cadence.");
  if (!flags.originalAnglePresent)
    fixes.push("Add a specific decision, cost, or failure — not a category lecture.");

  let recommendation = "Hold";
  if (total < 5.5 || scores.baitAvoidance < 6) recommendation = "Hard rewrite";
  else if (total < 7.5 || fixes.length >= 2) recommendation = "Soft rewrite";

  return {
    platform,
    scores,
    total,
    flags,
    fixes,
    recommendation,
    firstScreenPreview: firstScreen(t),
    version: "0.1.0",
  };
}
