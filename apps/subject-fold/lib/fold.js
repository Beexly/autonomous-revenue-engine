/**
 * subject-fold — email SUBJECT fold/hold for operators writing launch/update emails.
 * Different medium from X posts and HN titles. Hold here is not the qi-check floor.
 * Higher score = holds / specific. Lower = bait / empty.
 * Does not rewrite.
 */

function clamp(n) {
  return Math.max(0, Math.min(10, Math.round(n * 10) / 10));
}

function isMostlyAllCaps(subject) {
  const letters = String(subject).match(/[A-Za-z]/g) || [];
  if (letters.length < 8) return false;
  const upper = letters.filter((c) => c === c.toUpperCase()).length;
  return upper / letters.length >= 0.8;
}

function hasNewsletterIssue(subject) {
  return /\bnewsletter\s*#?\s*\d+\b/i.test(String(subject));
}

function hasCtaBait(subject) {
  return /\b(don't miss|do not miss|you won't believe|act now|limited time|last chance|click here|open now)\b/i.test(
    String(subject)
  );
}

function hasSpecificNounOrNumber(subject) {
  const t = String(subject);
  if (hasNewsletterIssue(t)) return false;
  const strippedIssue = t.replace(/#\s*\d+\b/g, "");
  const hasDigit = /\d/.test(strippedIssue);
  const hasNumberWord =
    /\b(one|two|three|four|five|six|seven|eight|nine|ten)\b/i.test(t);
  const words = t.split(/\s+/);
  const proper = words.some((w, i) => {
    if (i === 0) return false;
    const raw = w.replace(/[^A-Za-z]/g, "");
    return raw.length >= 2 && /^[A-Z][a-zA-Z]+$/.test(raw);
  });
  const decision =
    /\b(killed|paid|refused|shipped|deferred|cut|kill|refuse|ship|defer)\b/i.test(
      t
    );
  return hasDigit || hasNumberWord || proper || decision;
}

function hasEmptyUpdate(subject) {
  const t = String(subject).trim();
  if (/^update$/i.test(t)) return true;
  if (/\bupdate\b/i.test(t) && !hasSpecificNounOrNumber(t)) return true;
  return false;
}

export function scoreSubject(subject) {
  const t = subject == null ? "" : String(subject);
  const trimmed = t.trim();
  const hits = [];

  if (!trimmed) {
    return {
      score: 0,
      hits: ["empty"],
      recommendation: "bait",
    };
  }

  let score = 6;

  const len = trimmed.length;
  if (len < 12) {
    score -= 3;
    hits.push("too short");
  } else if (len <= 70) {
    score += 1;
    hits.push("length ok");
  } else if (len <= 90) {
    hits.push("long");
  } else {
    score -= 2;
    hits.push("too long buried");
  }

  if (hasCtaBait(trimmed)) {
    score -= 3;
    hits.push("CTA bait");
  }

  if (hasNewsletterIssue(trimmed) || hasEmptyUpdate(trimmed)) {
    score -= 3;
    hits.push("newsletter bait");
  }

  if (isMostlyAllCaps(trimmed)) {
    score -= 2;
    hits.push("ALL CAPS");
  }

  if (hasSpecificNounOrNumber(trimmed)) {
    score += 2;
    hits.push("specific decision/cost");
  } else {
    score -= 2;
    hits.push("missing specific noun or number");
  }

  if (/^(re|fwd|fw)\s*:/i.test(trimmed)) {
    score -= 2;
    hits.push("Re:/Fwd: noise");
  }

  score = clamp(score);

  let recommendation = "hold";
  if (score < 4) recommendation = "bait";
  else if (score < 7) recommendation = "soft";

  return { score, hits, recommendation };
}
