/**
 * arXiv:2609.15980 — Causal writability in video models.
 * Wrong motion on screen ≠ the leftover is gone.
 * Four coordinates hold almost the whole effect. Then a depth
 * where the same write stops landing. After that, more gain
 * overshoots: valid, off-family.
 *
 * We do not train a 1.3B video model. We keep the leftover
 * writable until the owner posts. Then it is closed.
 */

export const COORDINATES = ["dent", "oak", "stanley", "hands"] as const;

export type Write = {
  posted: boolean;
  gain: number;
  missing: (typeof COORDINATES)[number][];
};

export function writable(w: Write): { ok: boolean; reason: string } {
  if (w.missing.length) {
    return { ok: false, reason: "Leftover missing: " + w.missing.join(", ") + ". Still writable until posted." };
  }
  if (w.posted) {
    return { ok: false, reason: "Closed. Same small write will not unwrite yesterday. Next episode carries it." };
  }
  if (w.gain > 3) {
    return { ok: false, reason: "Overshoot. Valid, off-family. Rebuild, don't crank the prompt." };
  }
  return { ok: true, reason: "Four coordinates present. Write lands." };
}
