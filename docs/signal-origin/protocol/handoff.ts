/**
 * OpenAI Agents SDK handoff, without the SDK.
 * transfer_to_refund_agent becomes a file in inbox/.
 * Guardrail is VERIFY. Suspend is owner.
 */

import { routeTask, type Route, type RouteInput } from "./route.ts";
import { verify, type Action } from "./verify.ts";

export type Handoff = {
  to: Route["actor"];
  folder: string;
  fence: "none" | "owner";
  reason: string;
};

export function transferTo(input: RouteInput): Handoff {
  const r = routeTask(input);
  const action: Action = {
    kind: input.publishes ? "post" : input.sends ? "send" : input.spends ? "spend" : "write",
    sports: input.sports,
  };
  const gate = verify(action);
  if (!gate.ok) {
    return {
      to: "owner",
      folder: "outbox/from-grok/",
      fence: "owner",
      reason: gate.reason,
    };
  }
  const folder =
    r.actor === "motif"
      ? "inbox/from-grok/"
      : r.actor === "opencode"
        ? "inbox/from-grok/"
        : r.actor === "owner"
          ? "outbox/from-grok/"
          : "inbox/from-grok/";
  return { to: r.actor, folder, fence: r.fence, reason: r.reason };
}
