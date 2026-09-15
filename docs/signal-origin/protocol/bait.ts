/** Port of ARE apps/hn-bait. Titles, not X first-screen. Higher = worse. */

export function scoreHnBait(title: string): {
  score: number;
  hits: string[];
  recommendation: "ok" | "bait-risk" | "bait";
} {
  const trimmed = (title ?? "").trim();
  const hits: string[] = [];
  if (!trimmed) return { score: 10, hits: ["empty"], recommendation: "bait" };
  let score = 0;
  if (/\b\d+\s+(ways|tips|tricks|habits|mistakes|reasons|hacks)\b/i.test(trimmed)) {
    score += 3;
    hits.push("listicle");
  }
  if (/\b(ultimate|insane|game-changing|mind-blowing|epic)\b/i.test(trimmed)) {
    score += 2;
    hits.push("empty superlative");
  }
  if (/\b(destroyed|secret|shocking|you won't believe)\b/i.test(trimmed)) {
    score += 2;
    hits.push("sensational");
  }
  if (!/\b(show|ship|build|built|launch|release)\b/i.test(trimmed) && !/^show hn:/i.test(trimmed)) {
    score += 2;
    hits.push("missing artifact");
  }
  const letters = trimmed.match(/[A-Za-z]/g) || [];
  if (letters.length >= 8 && letters.filter((c) => c === c.toUpperCase()).length / letters.length >= 0.8) {
    score += 2;
    hits.push("all-caps");
  }
  score = Math.max(0, Math.min(10, score));
  const recommendation = score >= 7 ? "bait" : score >= 4 ? "bait-risk" : "ok";
  return { score, hits, recommendation };
}
