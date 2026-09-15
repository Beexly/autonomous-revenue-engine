/**
 * arXiv Autonomous search (2026-09-14 night). Not 42k papers. Four that run.
 *
 * 2609.14716 Moral Rebel — when the assigned task fights a norm, rebel
 *   and keep the commitment by shipping a neighbor. Kill-with-no-instead is amoral.
 * 2609.14738 AppliedScientist — reviewer-guided revision beats self-revision.
 *   Execution fixes land. Idea fixes rarely. Stop at 3.
 * 2609.15548 Botto — agents propose. Owner mints. Models don't ship.
 * 2609.14744 AcquireBound — runtime grant. If it isn't a tool, it isn't acquired.
 */

export function rebel(assigned: {
  kind: "post" | "spend" | "kids" | "higgsfield" | "build";
  instead: string;
}): { rebel: boolean; reason: string; instead: string } {
  if (assigned.kind === "build") {
    return { rebel: false, reason: "Build is the job.", instead: assigned.instead };
  }
  return {
    rebel: true,
    reason: "Assigned task fights a norm. Dutiful rebel: keep the commitment, change the means.",
    instead: assigned.instead,
  };
}

export function reviewPass(
  round: number,
  kind: "execution" | "idea",
): { keepGoing: boolean; reason: string } {
  if (round >= 3) return { keepGoing: false, reason: "Three rounds. Rebuild. That's overshoot." };
  if (kind === "idea") {
    return { keepGoing: false, reason: "Idea weakness. Reviewer-guided still only moves this ~11%. New leftover, not another pass." };
  }
  return { keepGoing: true, reason: "Execution. One more reviewer pass." };
}

export function mint(cleared: boolean, owner: boolean): { ok: boolean; reason: string } {
  if (!cleared) return { ok: false, reason: "Not in the gallery. Gates first." };
  if (!owner) return { ok: false, reason: "Agents propose. Owner mints. Botto's loop, our paste." };
  return { ok: true, reason: "Owner paste. That's the mint." };
}

const TOOLS = new Set([
  "score_pressure",
  "list_episodes",
  "route_task",
  "draft_reply",
  "gate_policy",
  "search_memory",
  "score_subject",
  "qc_shot",
  "transfer_to",
  "would_spend",
]);

export function acquire(name: string): { ok: boolean; reason: string } {
  if (TOOLS.has(name)) return { ok: true, reason: "Already a tool. Grant." };
  return { ok: false, reason: "Not a tool. Don't acquire Higgsfield/Astorie/Claude-as-Motif at runtime." };
}
