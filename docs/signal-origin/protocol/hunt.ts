/**
 * 1501.00637 — secretary problem with a personal utility, not a dating app.
 * Saturday: look at the first n/e shops. Then take the first that's
 * better than that sample. Eight nos is still the hard stop.
 * This is a stopping rule, not a kill.
 */

export const SAMPLE = 3;
export const HARD_STOP = 8;

export type Shop = { name: string; score: number };

export function hunt(seen: Shop[], next: Shop): { do: "sample" | "take" | "skip" | "stop"; reason: string } {
  if (seen.length >= HARD_STOP) {
    return { do: "stop", reason: "Eight. Kit is a sample, not a product. Next Saturday." };
  }
  if (seen.length < SAMPLE) {
    return { do: "sample", reason: "First " + SAMPLE + " are the bar. Don't take yet." };
  }
  const bar = Math.max(...seen.slice(0, SAMPLE).map((s) => s.score));
  if (next.score > bar) {
    return { do: "take", reason: "Better than the first " + SAMPLE + ". Walk in." };
  }
  return { do: "skip", reason: "Worse than the bar. Next door." };
}

export function scoreShop(s: { hasSite: boolean; local: boolean; phone?: string }): number {
  let n = 0;
  if (s.local) n += 2;
  if (!s.hasSite) n += 2;
  if (s.phone) n += 1;
  return n;
}
