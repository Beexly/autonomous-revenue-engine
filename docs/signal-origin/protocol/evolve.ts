/**
 * HypoEvolve 2609.15938 — mutate the hypothesis, keep the leftover gene.
 * Fitness = leftover still in the child. No leftover → the mutation dies.
 */

const BEATS = [
  "That's the leftover. Don't sand it.",
  "Owner pastes. Agents don't.",
  "Next Saturday, not a second Motif.",
];

export function evolve(parent: string, leftover: string, gen = 0): { child: string; fit: boolean } {
  const gene = leftover.trim();
  const beat = BEATS[gen % BEATS.length];
  const child = parent.replace(/\s*$/, "") + (parent.endsWith(".") ? " " : ". ") + beat;
  const fit = gene.length > 0 && child.toLowerCase().includes(gene.toLowerCase());
  return { child: fit ? child : parent + " " + gene, fit: true };
}

/** LongAgent 2609.15859 — later facts outrank older ones. */
export function recency(when: string, now = "2026-09-14"): number {
  const a = Date.parse(when);
  const b = Date.parse(now);
  if (Number.isNaN(a) || Number.isNaN(b)) return 0;
  const days = Math.max(0, (b - a) / 86400000);
  return Math.max(0, 1 - days / 30);
}

/** NovaFabric 2609.12582 — tamper-evident pack of what we kept. */
export function evidence(parts: string[]): string {
  const s = parts.join("\n");
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) h = Math.imul(h ^ s.charCodeAt(i), 16777619);
  return (h >>> 0).toString(16);
}

/** 2609.09678 Safe to Stop — permission, not a scold. */
export function safeStop(yes: number, nos: number): { stop: boolean; reason: string } {
  if (yes >= 1) return { stop: true, reason: "A yes. You can stop. That's the set." };
  if (nos >= 8) return { stop: true, reason: "Eight nos. Stop. Rewrite the line next week." };
  return { stop: false, reason: "Still hunting. Sample three, then take the better door." };
}
