import type { Shot } from "./shot.ts";

/**
 * Zasti 2099604739155517604: identical hair strands across two takes
 * is the LoRA tell. Residue should persist. Micro-variation must exist.
 *
 * Inspector via denigolovin 2099397976309342553: she vanishes behind
 * strangers and comes back unchanged. Name what survives the block.
 *
 * jasonugc: single-take, no music, no cuts, unpolished.
 */

export function resetTell(a: Shot, b: Shot): { ok: boolean; reason: string } {
  const same =
    a.motion.trim() === b.motion.trim() &&
    a.inspect.trim() === b.inspect.trim() &&
    a.set.trim() === b.set.trim();
  if (same) {
    return {
      ok: false,
      reason: "Two takes, identical down to the strand. That's the tell. Change one hand.",
    };
  }
  return { ok: true, reason: "Leftover stayed. Something small moved." };
}

export function occlusion(s: Shot): { ok: boolean; reason: string } {
  const has =
    /\b(dent|oak|stanley|hands?|crack|chip|scar|tape|housing)\b/i.test(s.inspect);
  if (!has) {
    return {
      ok: false,
      reason: "When a stranger walks in front, what is still there? Name it.",
    };
  }
  return { ok: true, reason: "Occlusion has a leftover." };
}

export function unpolished(s: Shot): { ok: boolean; reasons: string[] } {
  const blob = [s.set, s.motion, s.phone, s.inspect].join(" ");
  const reasons: string[] = [];
  if (/\b(music|soundtrack|beat drop)\b/i.test(blob)) reasons.push("No music.");
  if (/\b(cut to|smash cut|jump cut)\b/i.test(blob)) reasons.push("No cuts.");
  if (/\bcinematic\b/i.test(blob)) reasons.push("Unpolished. Not an ad.");
  return { ok: reasons.length === 0, reasons };
}
