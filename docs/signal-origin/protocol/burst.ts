/** Port of ARE apps/voice-delta burstiness. Helper, not authorship. */

export function burstiness(text: string): { cv: number | null; sentences: number } {
  const ss = String(text || "")
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
  if (ss.length < 2) return { cv: null, sentences: ss.length };
  const lens = ss.map((s) => s.split(/\s+/).filter(Boolean).length);
  const mu = lens.reduce((a, b) => a + b, 0) / lens.length;
  const ss2 = lens.reduce((a, b) => a + (b - mu) ** 2, 0);
  const sigma = Math.sqrt(ss2 / (lens.length - 1));
  return { cv: mu === 0 ? 0 : sigma / mu, sentences: ss.length };
}
