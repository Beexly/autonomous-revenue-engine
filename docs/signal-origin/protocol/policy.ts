/**
 * OPA/Cedar steal: gates as code, not a policy server.
 * Copilot's pass/rewrite/kill, machine-checkable.
 * Publish is never a pass. Pass means the owner may paste.
 */

import { HOLD_FLOOR, REPLY_FLOOR, type PressureMode } from "./pressure.ts";
import { wouldSpend, type Bill } from "./cost.ts";

export type Disposition = "pass" | "rewrite" | "kill";

export type Asset = {
  kind: PressureMode | "page" | "email";
  pressure: number;
  swapFails: number;
  sports?: boolean;
  bill?: Bill;
  stencil?: boolean;
};

export function gate(a: Asset): { decision: Disposition; reason: string } {
  if (a.sports) return { decision: "kill", reason: "Sports isolated." };
  const spend = wouldSpend(a.bill ?? {});
  if (spend.spend) return { decision: "kill", reason: spend.reason };
  if (a.stencil) return { decision: "kill", reason: "Banned stencil. SO-013 is the example." };
  if (a.kind === "original") {
    if (a.swapFails > 0) return { decision: "rewrite", reason: "Swap-test failed. Originals don't get a pass with a fail." };
    if (a.pressure < HOLD_FLOOR) {
      return { decision: "rewrite", reason: `Original floor ${HOLD_FLOOR}. Got ${a.pressure}.` };
    }
    return { decision: "pass", reason: "Owner may paste. Agents do not." };
  }
  if (a.kind === "reply") {
    if (a.pressure < REPLY_FLOOR) {
      return { decision: "rewrite", reason: `Reply floor ${REPLY_FLOOR}. Got ${a.pressure}.` };
    }
    return { decision: "pass", reason: "Overnight paste. Cap 3. Owner posts." };
  }
  if (a.kind === "email") {
    if (a.swapFails > 0) return { decision: "rewrite", reason: "Gold email failed swap." };
    return { decision: "pass", reason: "Owner sends. Agents do not." };
  }
  return { decision: "pass", reason: "Page. Walk it in. Don't say AI." };
}
