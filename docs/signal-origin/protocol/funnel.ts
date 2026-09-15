/**
 * PostHog / Plausible / Matomo killed — no traffic to observe.
 * Adjacent: a local Kit funnel. Walked → shown → yes.
 * Conversion is Venmo, not a JS snippet.
 */

export type KitFunnel = {
  walked: number;
  shown: number;
  yes: number;
};

export function kitFunnel(f: KitFunnel): { rate: string; note: string } {
  if (f.walked === 0) return { rate: "—", note: "Nobody walked. Saturday is the ingest." };
  if (f.shown === 0) return { rate: "0", note: "Walked, didn't show the page. That's on us." };
  if (f.yes === 0) {
    return {
      rate: `0 / ${f.shown}`,
      note: "Shown, no yes. Eight nos and Kit is a sample, not a product.",
    };
  }
  return {
    rate: `${f.yes} / ${f.shown}`,
    note: `$${f.yes * 350} if they paid.`,
  };
}
