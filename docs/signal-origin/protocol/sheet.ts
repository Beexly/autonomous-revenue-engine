/**
 * 1banana2546 2099256817020817804 — GPT Image 2.5 character lock.
 * Don't tweak the prompt first. Make the blueprint.
 * Layout stolen. Face is Ray and a truck, not a bikini sheet.
 * BeatAPI/BeatDesign is a local Higgsfield. Don't install it this week.
 * The factory/ folder is the project.
 */

export const VIEWS = ["front", "side", "back", "three-quarter", "three-quarter-back"] as const;
export const FACE = ["front", "profile", "forty-five"] as const;
export const EXPRESSIONS = ["rest", "look", "squint", "tired", "talking", "load"] as const;

export type Sheet = {
  id: string;
  rail: string;
  views: Record<(typeof VIEWS)[number], string>;
  face: Record<(typeof FACE)[number], string>;
  expressions: Record<(typeof EXPRESSIONS)[number], string>;
  parts: { eyes: string; brow: string; nose: string; mouth: string; hands: string };
  costume: { body: string; leftover: string; prop: string };
  palette: string[];
  age: string;
};

export function sheetReady(s: Sheet): { ok: boolean; missing: string[] } {
  const missing: string[] = [];
  for (const k of VIEWS) if (!s.views[k]?.trim()) missing.push("view:" + k);
  for (const k of FACE) if (!s.face[k]?.trim()) missing.push("face:" + k);
  for (const k of EXPRESSIONS) if (!s.expressions[k]?.trim()) missing.push("expr:" + k);
  if (!s.costume.leftover.trim()) missing.push("leftover");
  if (!s.parts.hands.trim()) missing.push("hands");
  if (s.palette.length < 3) missing.push("palette");
  return { ok: missing.length === 0, missing };
}

export const RAY_SHEET: Sheet = {
  id: "ray-kingwood",
  rail: "kit",
  views: {
    front: "White F-150 nose-in. He stands at the bed. Oak on 1488 left of frame.",
    side: "Passenger side. Dent on the rear door. That's the leftover.",
    back: "Tailgate down. Trimmer in the bed. Stanley still on the dash if you look through.",
    "three-quarter": "Driver front. Work shirt. One hand on the bed rail.",
    "three-quarter-back": "Dent still visible. Oak still in frame.",
  },
  face: {
    front: "44. Sun. Not a model. Grey at the temples.",
    profile: "Same nose. Same ear. Don't grow a jaw.",
    "forty-five": "Squint optional. No smile for the camera.",
  },
  expressions: {
    rest: "Looking at the trimmer.",
    look: "One look at the phone. That's the clip.",
    squint: "Morning on 1488.",
    tired: "Day 5, rain, in the cab.",
    talking: "If a shop owner is in frame, he talks to them, not the lens.",
    load: "Sets the trimmer. One motion.",
  },
  parts: {
    eyes: "Narrow. Crow's feet. Not glass.",
    brow: "Unkept. Don't draw them.",
    nose: "Same bump every day.",
    mouth: "Closed unless talking.",
    hands: "Inspectable. Dirt under a nail is a leftover, not a flaw.",
  },
  costume: {
    body: "Faded navy work shirt. Same one.",
    leftover: "Dent on the rear passenger door. Oak. Stanley.",
    prop: "Trimmer. Paper square $350 in the window if it's a shop page.",
  },
  palette: ["#111111", "#f4f1ea", "#9a9588", "#3d4a38"],
  age: "44. Don't de-age him.",
};
