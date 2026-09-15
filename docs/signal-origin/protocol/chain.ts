/**
 * He1s_Sammy 2099553266379919774 — research → creation → packaging → publishing
 * on one canvas. Auto-upload while you sleep is the kill.
 * Canvas is this file. Publish is owner. Same fence as n8n.
 */

export const NODES = ["research", "creation", "packaging", "publishing"] as const;
export type NodeId = (typeof NODES)[number];

export type Node = {
  id: NodeId;
  does: string;
  actor: "grok" | "owner";
  auto: boolean;
};

export const CANVAS: Node[] = [
  {
    id: "research",
    does: "What's leftover from yesterday. What's on the plaza. Not trending-for-its-own-sake.",
    actor: "grok",
    auto: false,
  },
  {
    id: "creation",
    does: "Sheet, then one 9-second card. Blueprint before the prompt.",
    actor: "grok",
    auto: false,
  },
  {
    id: "packaging",
    does: "Title, paper square, gold subject. Swap-test. Fold-test.",
    actor: "grok",
    auto: false,
  },
  {
    id: "publishing",
    does: "Paste or walk-in. Nothing schedules itself.",
    actor: "owner",
    auto: false,
  },
];

export function runCanvas(id: NodeId): { ok: boolean; reason: string } {
  const n = CANVAS.find((x) => x.id === id);
  if (!n) return { ok: false, reason: "no node" };
  if (n.id === "publishing" && n.actor !== "owner") {
    return { ok: false, reason: "Publish is owner." };
  }
  if (n.auto) return { ok: false, reason: "Nothing on this canvas auto-runs." };
  return { ok: true, reason: n.does };
}

export const COOKING_NICHE = [
  "one pan, chip on the rim",
  "same Dutch oven, Tuesday",
  "stir, not steam",
  "hands, then the pan",
  "leftover from yesterday's sauce",
  "window light, no new kitchen",
  "salt, then stop",
];
