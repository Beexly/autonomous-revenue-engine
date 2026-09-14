/**
 * hn-bait — Show HN / HN / launch TITLE bait vs specific substance.
 * Not an X post first-screen scorer. Does not rewrite.
 * Higher score = heavier bait.
 */

function clamp(n) {
  return Math.max(0, Math.min(10, Math.round(n * 10) / 10));
}

function isMostlyAllCaps(title) {
  const letters = String(title).match(/[A-Za-z]/g) || [];
  if (letters.length < 8) return false;
  const upper = letters.filter((c) => c === c.toUpperCase()).length;
  return upper / letters.length >= 0.8;
}

function hasEmoji(title) {
  return /\p{Extended_Pictographic}/u.test(String(title));
}

function namedShowHnProject(title) {
  return /^\s*show hn:\s*[A-Za-z][\w.-]*/i.test(String(title));
}

function hasArtifactVerb(title) {
  return /\b(show|showing|ship|shipped|shipping|build|built|building|launch|launched|release|released|introduc(?:e|es|ed|ing))\b/i.test(
    String(title)
  );
}

export function scoreHnBait(title) {
  const t = title == null ? "" : String(title);
  const trimmed = t.trim();
  const hits = [];

  if (!trimmed) {
    return {
      score: 10,
      hits: ["empty"],
      recommendation: "bait",
    };
  }

  let score = 0;

  if (/\b\d+\s+(ways|tips|tricks|habits|mistakes|reasons|hacks|lessons)\b/i.test(trimmed)) {
    score += 3;
    hits.push("listicle");
  }

  const sensational =
    /\b(destroyed|secret|shocking|you won't believe)\b/i.test(trimmed) ||
    (/\b(killed|destroyed)\b/i.test(trimmed) && !namedShowHnProject(trimmed));
  if (sensational) {
    score += 2;
    hits.push("sensational");
  }

  const superlativeRe = /\b(ultimate|insane|game-changing|game changing|mind-blowing|epic|unbelievable)\b/gi;
  const superlatives = trimmed.match(superlativeRe) || [];
  if (superlatives.length) {
    score += Math.min(3, 2 + (superlatives.length - 1));
    hits.push("empty superlative");
  }

  const named = namedShowHnProject(trimmed);
  if (!hasArtifactVerb(trimmed) && !named) {
    score += 2;
    hits.push("missing artifact");
  }

  if (isMostlyAllCaps(trimmed)) {
    score += 2;
    hits.push("all-caps");
  }

  if (hasEmoji(trimmed)) {
    score += 2;
    hits.push("emoji");
  }

  if (/^\s*ask hn:/i.test(trimmed)) {
    const rage =
      /\b(why (is|are|does|do) (everything|nobody|no one)|worst|hate|terrible|broken|dying|ruined)\b/i.test(
        trimmed
      ) ||
      trimmed.includes("??") ||
      /!/.test(trimmed);
    if (rage && !named) {
      score += 5;
      hits.push("Ask HN ragebait");
    }
  }

  if (named) {
    score = Math.max(0, score - 1);
  }

  score = clamp(score);

  let recommendation = "ok";
  if (score >= 7) recommendation = "bait";
  else if (score >= 4) recommendation = "bait-risk";

  return { score, hits, recommendation };
}
