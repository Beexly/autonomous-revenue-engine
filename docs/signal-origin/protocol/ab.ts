/**
 * A/B the objection, not the plaza mix.
 * One lane per shift. Mixing A and B on the same strip is noise.
 * Win = yes or two names. Don't call a winner before 3 of each lane.
 */

export const LANES = {
  "already have a guy": {
    A: "Keep him. This is one screen, your number, Friday. If you hate it you don't pay.",
    B: "Good. Don't fire him. I just need Friday and your listing photo.",
  },
  "send me something": {
    A: "That's the square. Your number is on it. I'll be back Friday if you want it live.",
    B: "I don't email PDFs. The page is already built. This is it.",
  },
  "too much": {
    A: "Three-fifty after you see it on your phone. Not today.",
    B: "You don't pay if you hate it. That's the whole pitch.",
  },
  "what is this": {
    A: "Your listing photo is old. I already built the page. Here's the paper.",
    B: "One screen. Your three prices. Live Friday. That's all this is.",
  },
} as const;

export type Objection = keyof typeof LANES;
export type Lane = "A" | "B";
export type Out = "yes" | "no" | "refer";

export type Trial = { when: string; objection: Objection; lane: Lane; out: Out };

export function shiftLane(when = "2026-09-14"): Lane {
  const day = Date.parse(when);
  if (Number.isNaN(day)) return "A";
  return Math.floor(day / 86400000) % 2 === 0 ? "A" : "B";
}

export function script(objection: Objection, lane: Lane): string {
  return LANES[objection][lane];
}

export function score(out: Out): number {
  if (out === "yes" || out === "refer") return 1;
  return 0;
}

export function winner(
  rows: Trial[],
  objection: Objection,
): { pick: Lane | "keep-running"; a: number; b: number; na: number; nb: number } {
  const a = rows.filter((r) => r.objection === objection && r.lane === "A");
  const b = rows.filter((r) => r.objection === objection && r.lane === "B");
  const as = a.reduce((n, r) => n + score(r.out), 0);
  const bs = b.reduce((n, r) => n + score(r.out), 0);
  if (a.length < 3 || b.length < 3) {
    return { pick: "keep-running", a: as, b: bs, na: a.length, nb: b.length };
  }
  if (as === bs) return { pick: "keep-running", a: as, b: bs, na: a.length, nb: b.length };
  return { pick: as > bs ? "A" : "B", a: as, b: bs, na: a.length, nb: b.length };
}

export const OBJECTIONS = Object.keys(LANES) as Objection[];
