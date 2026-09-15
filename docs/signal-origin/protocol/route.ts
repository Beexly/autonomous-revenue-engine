/**
 * $0 router stolen from the Astra/Flash diagram parked in GSE X Chat
 * (RoundtableSpace 2099464427678621839). We do not call DeepSeek or Astra.
 *
 * Seats:
 *   think  = Motif/Grok plan + dual-gate  (Astra medium)
 *   flash  = bounded code, scrape, HTML   (Flash workers)
 *   high   = Motif QC / owner fence       (Astra high, only if needed)
 */

export type Seat = "think" | "flash" | "high";
export type Lane = "researcher" | "worker" | "writer" | "architect";

export type RouteInput = {
  title: string;
  body?: string;
  spends?: boolean;
  publishes?: boolean;
  sends?: boolean;
  sports?: boolean;
};

export type Route = {
  seat: Seat;
  lane: Lane;
  actor: "motif" | "opencode" | "grok" | "owner";
  reason: string;
  fence: "none" | "owner";
};

const HIGH_RE = /\b(merge|deploy|post|send|purchase|subscribe|ad spend|walk[- ]?in)\b/i;
const THINK_RE = /\b(plan|architect|review|qc|kill|thesis|pressure|dual-gate)\b/i;
const WRITE_RE = /\b(reply|draft|copy|gold email|writeup|summary)\b/i;
const RESEARCH_RE = /\b(research|scrape|census|inbox|dm|hunt|paper)\b/i;

export function routeTask(input: RouteInput): Route {
  const text = `${input.title} ${input.body ?? ""}`;
  const destructive = !!(input.spends || input.publishes || input.sends);

  if (input.sports) {
    return {
      seat: "high",
      lane: "architect",
      actor: "owner",
      reason: "Sports isolated. This bus does not touch GSE posts.",
      fence: "owner",
    };
  }

  if (destructive || HIGH_RE.test(text)) {
    return {
      seat: "high",
      lane: "architect",
      actor: "owner",
      reason: "Frontier seat: send/post/merge/spend. Diagram's 'only if needed' branch.",
      fence: "owner",
    };
  }

  if (THINK_RE.test(text) && !/\b(implement|html|css|patch|fix)\b/i.test(text)) {
    return {
      seat: "think",
      lane: RESEARCH_RE.test(text) ? "researcher" : "architect",
      actor: "grok",
      reason: "Plan/review. Do not pay Flash or Astra. Git is the worker.",
      fence: "none",
    };
  }

  if (WRITE_RE.test(text)) {
    return {
      seat: "flash",
      lane: "writer",
      actor: "grok",
      reason: "Bounded writing. Dual-gate before it leaves the desk. Do not post.",
      fence: "none",
    };
  }

  if (RESEARCH_RE.test(text)) {
    return {
      seat: "flash",
      lane: "researcher",
      actor: "grok",
      reason: "Focused research. $0 tools only.",
      fence: "none",
    };
  }

  return {
    seat: "flash",
    lane: "worker",
    actor: "opencode",
    reason: "Bounded code. Motif QC is the integrate+verify step.",
    fence: "none",
  };
}
