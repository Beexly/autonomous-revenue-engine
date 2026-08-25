/**
 * Split conformal prediction for a 1-d residual/score.
 * Interval [score - q, score + q] where q is the split-conformal
 * residual quantile. Finite-sample coverage 1-α only if exchangeability holds.
 */
export function splitConformal(residuals, score, { coverage = 0.9 } = {}) {
  if (!Array.isArray(residuals) || residuals.length === 0) {
    return { error: "empty_calibration", coverage };
  }
  if (!(coverage > 0 && coverage < 1)) {
    return { error: "coverage_out_of_range", coverage };
  }
  const s = Number(score);
  if (!Number.isFinite(s)) {
    return { error: "bad_score", coverage };
  }
  const r = residuals
    .map(Number)
    .filter((x) => Number.isFinite(x))
    .map((x) => Math.abs(x));
  const n = r.length;
  if (n === 0) return { error: "empty_calibration", coverage };
  r.sort((a, b) => a - b);
  const k = Math.ceil((n + 1) * coverage);
  if (k > n) {
    return {
      n,
      coverage,
      k,
      q: Infinity,
      score: s,
      lo: -Infinity,
      hi: Infinity,
      infinite: true,
      note: "Need more calibration points for a finite interval at this coverage. Finite-sample coverage holds only under exchangeability.",
    };
  }
  const q = r[k - 1];
  return {
    n,
    coverage,
    k,
    q,
    score: s,
    lo: s - q,
    hi: s + q,
    infinite: false,
    note: "Finite-sample coverage holds only under exchangeability.",
  };
}
