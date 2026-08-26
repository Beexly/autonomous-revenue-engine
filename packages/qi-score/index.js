/**
 * qi-check — deterministic gate.
 * Hold floor is 9.2. 8.x is Soft rewrite. Never publish below Hold.
 * Does NOT rewrite, does NOT claim AI-detection bypass.
 */

export const HOLD_FLOOR = 9.2;
export const SOFT_FLOOR = 7.0;

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
  if (head.includes("?") && head.length < 80) s -= 1;
  // Concrete decision in the open line
  if (/\b(killed|refused|paid|shipped|deferred)\b/i.test(head.split(/[.!?]/)[0] || "")) s += 1.5;
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
  if (lines.length >= 3) s += 0.5;
  return clamp(s);
}

function scoreBait(text) {
  let hits = 0;
  for (const re of BAIT_PATTERNS) if (re.test(text)) hits++;
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
  if (cv < 0.2) return 4;
  if (cv < 0.35) return 6;
  if (cv < 0.55) return 8;
  return 9;
}

function ocrFlags(text) {
  const head = firstScreen(text, 200);
  return {
    originalAnglePresent:
      /\b(we|i)\b/i.test(text) &&
      /\b(killed|paid|refused|built|failed|shipped)\b/i.test(text),
    replyPrimaryOnly: false,
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
  if (scores.firstScreenDensity < 8)
    fixes.push("Put the concrete decision in the first line — not the third.");
  if (scores.foldStructure < 7)
    fixes.push("Open short; mechanism in line 2–3; no buried lede.");
  if (scores.baitAvoidance < 9)
    fixes.push("Strip engagement-farm CTAs and listicle bait phrasing.");
  if (scores.lengthFitness < 7)
    fixes.push("Tighten length; one complete thought over sprawl.");
  if (scores.burstiness < 7)
    fixes.push("Vary sentence length; avoid flat model cadence.");
  if (!flags.originalAnglePresent)
    fixes.push("Add a specific decision, cost, or failure — not a category lecture.");
  if (total < HOLD_FLOOR)
    fixes.push(`Composite ${total} is below Hold floor ${HOLD_FLOOR}. Rewrite or kill.`);

  let recommendation = "Hold";
  if (total < SOFT_FLOOR || scores.baitAvoidance < 6) recommendation = "Hard rewrite";
  else if (
    total < HOLD_FLOOR ||
    scores.firstScreenDensity < 8 ||
    scores.baitAvoidance < 9 ||
    fixes.length >= 3
  )
    recommendation = "Soft rewrite";

  return {
    platform,
    scores,
    total,
    floors: { hold: HOLD_FLOOR, soft: SOFT_FLOOR },
    flags,
    fixes,
    recommendation,
    firstScreenPreview: firstScreen(t),
    version: "0.2.0",
  };
}
