/**
 * Classic Burrows' Delta (original JS).
 * Lower Δ ⇒ closer stylistic match.
 * Does not prove authorship. Does not rewrite. Does not publish.
 */

const WORD_RE = /[a-z]+(?:'[a-z]+)?/g;
const MIN_TOKENS = 8;

export function tokenize(text) {
  const m = String(text || "")
    .toLowerCase()
    .match(WORD_RE);
  return m ? m : [];
}

export function featureFreqs(tokens, features) {
  const counts = Object.create(null);
  for (const t of tokens) counts[t] = (counts[t] || 0) + 1;
  const n = tokens.length || 1;
  const freqs = Object.create(null);
  for (const f of features) freqs[f] = (counts[f] || 0) / n;
  return freqs;
}

export function topFeatures(documents, n = 50) {
  const counts = Object.create(null);
  for (const doc of documents) {
    for (const t of tokenize(doc)) counts[t] = (counts[t] || 0) + 1;
  }
  return Object.entries(counts)
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, n)
    .map(([w]) => w);
}

function mean(vals) {
  if (!vals.length) return 0;
  return vals.reduce((a, b) => a + b, 0) / vals.length;
}

function sampleStd(vals) {
  if (vals.length < 2) return 0;
  const mu = mean(vals);
  let ss = 0;
  for (const v of vals) ss += (v - mu) ** 2;
  return Math.sqrt(ss / (vals.length - 1));
}

function sentences(text) {
  return String(text || "")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Sentence-length coefficient of variation (σ/μ). Helper, not the product. */
export function burstiness(text) {
  const ss = sentences(text);
  if (ss.length < 2) {
    return { sentenceCount: ss.length, meanLength: null, cv: null };
  }
  const lens = ss.map((s) => s.split(/\s+/).filter(Boolean).length);
  const mu = mean(lens);
  const sigma = sampleStd(lens);
  const cv = mu === 0 ? 0 : sigma / mu;
  return { sentenceCount: ss.length, meanLength: mu, cv };
}

function zScores(freqs, features, mu, sigma) {
  const z = Object.create(null);
  for (const f of features) {
    z[f] = sigma[f] === 0 ? 0 : (freqs[f] - mu[f]) / sigma[f];
  }
  return z;
}

function meanAbsDiff(zA, zB, features, sigma) {
  let sum = 0;
  let n = 0;
  for (const f of features) {
    if (sigma[f] === 0) continue;
    sum += Math.abs(zA[f] - zB[f]);
    n += 1;
  }
  return n === 0 ? null : sum / n;
}

/**
 * Δ(T,A) = (1/n) Σ |z_i(T) - z_i(A)|
 * Features: top n relative frequencies from the combined corpus.
 * μ, σ: across reference documents only.
 */
export function burrowsDelta(candidate, references, { nFeatures = 50 } = {}) {
  const refs = Array.isArray(references) ? references.map((r) => String(r ?? "")) : [];
  const cand = String(candidate ?? "");
  const candTokens = tokenize(cand);
  const refTokenCounts = refs.map((r) => tokenize(r).length);

  if (
    candTokens.length < MIN_TOKENS ||
    refs.length === 0 ||
    refTokenCounts.every((n) => n < MIN_TOKENS)
  ) {
    return {
      error: "insufficient_text",
      centroidDelta: null,
      meanRefDelta: null,
      perReference: [],
      nFeatures: 0,
      candidateTokens: candTokens.length,
      lowerIsCloser: true,
    };
  }

  const usableRefs = refs.filter((_, i) => refTokenCounts[i] >= MIN_TOKENS);
  if (usableRefs.length === 0) {
    return {
      error: "insufficient_text",
      centroidDelta: null,
      meanRefDelta: null,
      perReference: [],
      nFeatures: 0,
      candidateTokens: candTokens.length,
      lowerIsCloser: true,
    };
  }

  const features = topFeatures([...usableRefs, cand], nFeatures);
  const refFreqs = usableRefs.map((r) => featureFreqs(tokenize(r), features));
  const candFreqs = featureFreqs(candTokens, features);

  const mu = Object.create(null);
  const sigma = Object.create(null);
  for (const f of features) {
    const vals = refFreqs.map((rf) => rf[f]);
    mu[f] = mean(vals);
    sigma[f] = sampleStd(vals);
  }

  const zCand = zScores(candFreqs, features, mu, sigma);
  const zRefs = refFreqs.map((rf) => zScores(rf, features, mu, sigma));

  const zCentroid = Object.create(null);
  for (const f of features) {
    zCentroid[f] = mean(zRefs.map((zr) => zr[f]));
  }

  const perReference = zRefs.map((zr, i) => ({
    index: i,
    delta: meanAbsDiff(zCand, zr, features, sigma),
  }));
  const finite = perReference.map((p) => p.delta).filter((d) => d != null);
  const centroidDelta = meanAbsDiff(zCand, zCentroid, features, sigma);
  const used = features.filter((f) => sigma[f] !== 0).length;

  return {
    centroidDelta,
    meanRefDelta: finite.length ? mean(finite) : null,
    perReference,
    nFeatures: used,
    featureCountRequested: nFeatures,
    candidateTokens: candTokens.length,
    referenceCount: usableRefs.length,
    lowerIsCloser: true,
  };
}
