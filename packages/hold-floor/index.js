/**
 * hold-floor — the publish-gate constants as a tiny named module.
 * Hold floor is 9.2. 7.0–9.1 is Soft rewrite. Below 7.0 is Hard rewrite.
 * Values mirror apps/qi-check/lib/score.js (HOLD_FLOOR / SOFT_FLOOR).
 */

export const HOLD_FLOOR = 9.2;
export const SOFT_FLOOR = 7.0;

/**
 * classify(score) -> "Hold" | "Soft" | "Hard"
 * "Hold": score >= HOLD_FLOOR (publishable as-is)
 * "Soft": SOFT_FLOOR <= score < HOLD_FLOOR (soft rewrite)
 * "Hard": score < SOFT_FLOOR (hard rewrite or kill)
 */
export function classify(score) {
  const n = Number(score);
  if (!Number.isFinite(n)) {
    throw new TypeError("classify(score) requires a finite number, got: " + String(score));
  }
  if (n >= HOLD_FLOOR) return "Hold";
  if (n >= SOFT_FLOOR) return "Soft";
  return "Hard";
}
