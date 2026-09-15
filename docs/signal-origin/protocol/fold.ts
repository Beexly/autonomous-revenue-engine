/** Port of ARE apps/subject-fold. Email subjects, not X posts. */

function clamp(n: number) {
  return Math.max(0, Math.min(10, Math.round(n * 10) / 10));
}

export function scoreSubject(subject: string): {
  score: number;
  hits: string[];
  recommendation: "hold" | "soft" | "bait";
} {
  const trimmed = (subject ?? "").trim();
  const hits: string[] = [];
  if (!trimmed) return { score: 0, hits: ["empty"], recommendation: "bait" };

  let score = 6;
  if (trimmed.length < 12) {
    score -= 3;
    hits.push("too short");
  } else if (trimmed.length <= 70) {
    score += 1;
    hits.push("length ok");
  } else if (trimmed.length > 90) {
    score -= 2;
    hits.push("too long buried");
  }

  if (/\b(don't miss|you won't believe|act now|limited time|click here)\b/i.test(trimmed)) {
    score -= 3;
    hits.push("CTA bait");
  }
  if (/\bnewsletter\s*#?\s*\d+\b/i.test(trimmed) || /^update$/i.test(trimmed)) {
    score -= 3;
    hits.push("newsletter bait");
  }
  const letters = trimmed.match(/[A-Za-z]/g) || [];
  if (letters.length >= 8 && letters.filter((c) => c === c.toUpperCase()).length / letters.length >= 0.8) {
    score -= 2;
    hits.push("ALL CAPS");
  }
  const specific =
    /\d/.test(trimmed) ||
    /\b(killed|paid|refused|shipped|deferred|cut)\b/i.test(trimmed) ||
    trimmed.split(/\s+/).some((w, i) => i > 0 && /^[A-Z][a-zA-Z]{1,}$/.test(w.replace(/[^A-Za-z]/g, "")));
  if (specific) {
    score += 2;
    hits.push("specific");
  } else {
    score -= 2;
    hits.push("missing specific");
  }
  if (/^(re|fwd|fw)\s*:/i.test(trimmed)) {
    score -= 2;
    hits.push("Re:/Fwd:");
  }
  score = clamp(score);
  const recommendation = score < 4 ? "bait" : score < 7 ? "soft" : "hold";
  return { score, hits, recommendation };
}

export function goldSubject(store: string) {
  const name = store.trim() || "the store";
  return "Two pixels on the same view at " + name;
}
