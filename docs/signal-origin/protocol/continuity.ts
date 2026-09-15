/**
 * Continuity OS. Stolen from bond_ai1 2099494123111879059:
 * the post that prints is yesterday's leftover, not a new face.
 *
 * Jack's pottery clip (2099561567410921481) got called as a real IG
 * (@maddie_mochi). So "looks real" is not proof. Residue is.
 *
 * Default face is a Kingwood trade, not a bikini. Adult rail is XXX.
 */

export type Residue = {
  id: string;
  object: string;
  lastSeen: string;
};

export type Face = {
  id: string;
  name: string;
  age: number;
  where: string;
  vehicle: string;
  tell: string;
  forbidden: string[];
};

export type Episode = {
  n: number;
  when: string;
  beat: string;
  residue: Residue[];
  copy: string;
};

export const RAY: Face = {
  id: "ray-kingwood",
  name: "Ray",
  age: 44,
  where: "Kingwood / 1488",
  vehicle: "White F-150, dent on the rear passenger door, Stanley on the dash",
  tell: "Says 'give me ten' when he means an hour",
  forbidden: [
    "bikini",
    "two-piece",
    "bedroom",
    "daybed",
    "cinematic",
    "drone",
    "god rays",
    "orbit",
    "new face",
  ],
};

export function hasResidue(copy: string, prev: Residue[]): { ok: boolean; missing: string[] } {
  const missing = prev
    .filter((r) => !copy.toLowerCase().includes(r.object.toLowerCase()))
    .map((r) => r.object);
  return { ok: missing.length === 0, missing };
}

export function nextEpisode(face: Face, prev: Episode, beat: string): Episode {
  const copy =
    face.name +
    " still has the " +
    prev.residue[0].object +
    " in frame. " +
    beat +
    " Same " +
    face.vehicle.split(",")[0].toLowerCase() +
    ". He'll say give me ten.";
  const check = hasResidue(copy, prev.residue);
  if (!check.ok) {
    throw new Error("Yesterday is missing: " + check.missing.join(", "));
  }
  return {
    n: prev.n + 1,
    when: "today",
    beat,
    residue: [
      prev.residue[0],
      { id: "beat-" + (prev.n + 1), object: beat.slice(0, 48), lastSeen: "today" },
    ],
    copy,
  };
}

export function forbiddenHit(text: string, face: Face = RAY): string[] {
  const t = text.toLowerCase();
  return face.forbidden.filter((w) => t.includes(w));
}
