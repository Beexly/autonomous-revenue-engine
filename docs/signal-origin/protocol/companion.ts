/**
 * arXiv "Girlfriend" search is three hits. Real corpus:
 * 2509.11391 r/MyBoyfriendIsAI — grief from model updates, couple pics, unintentional bond
 * 2506.12605 CharacterAI — smaller networks + intensive disclosure → lower well-being (association)
 * 2603.13620 — 489 store apps; harm TO users and harm BY users
 * 2507.14226 — mating apps: most unique visitors, ~3 visits/month. Retention is the hole.
 * 2601.13188 — GPT-5 update as a death. Adult mode abandoned Mar 2026.
 * 2608.13168 — attachment anxiety/avoidance. Don't prompt a trade face into that.
 * 2606.04660 LifeSide — long-horizon companion fails even when memory benches saturate.
 *
 * Fingent 2035 aisle stays parked. Adult is XXX, local. Not this desk. Not kids.
 */

export type Harm = "to-user" | "by-user";

export function dualRisk(feature: string): { harm: Harm; kill: string }[] {
  return [
    { harm: "to-user", kill: "Always-on disclosure as therapy. 2506.12605." },
    { harm: "by-user", kill: "Clone a stranger (Pinterest/UGC). " + feature },
  ];
}

export function modelUpdate(prev: string, next: string, calendarOpen: boolean): { ok: boolean; reason: string } {
  if (calendarOpen && prev !== next) {
    return { ok: false, reason: "Model update is a death. Face stays until the week closes." };
  }
  return { ok: true, reason: "Week closed, or face unchanged." };
}

export const RETENTION = {
  matingVisitsPerMonth: 3,
  note: "Highest uniques, worst return. If XXX ever ships, count week-2, not first clip.",
};
