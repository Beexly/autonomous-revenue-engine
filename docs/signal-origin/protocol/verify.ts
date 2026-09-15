/**
 * VERIFY — stolen from N01ennn 2099244763698303295.
 * Fly sent the buy back. Chart looked good. Balance was up.
 * Contribution was asking them to ignore a rejection.
 *
 * If this rejects, the human does not explain why VERIFY was wrong.
 * Owner attestation is the only override, and it is not an agent call.
 */

export type Action = {
  kind: "read" | "write" | "send" | "post" | "merge" | "deploy" | "spend" | "walk-in";
  sports?: boolean;
  adult?: boolean;
  ownerAttested?: boolean;
};

export type Verdict = {
  ok: boolean;
  code: "pass" | "reject" | "owner-only";
  reason: string;
};

export function verify(action: Action): Verdict {
  if (action.sports) {
    return {
      ok: false,
      code: "reject",
      reason: "Sports isolated. This bus does not touch GSE posts or picks.",
    };
  }
  if (action.adult) {
    return {
      ok: false,
      code: "reject",
      reason: "Adult rail is XXX, local-only. Not this repo.",
    };
  }
  if (action.kind === "spend") {
    return { ok: false, code: "reject", reason: "No spend. Not even $50 Flash." };
  }
  if (
    action.kind === "send" ||
    action.kind === "post" ||
    action.kind === "merge" ||
    action.kind === "deploy" ||
    action.kind === "walk-in"
  ) {
    if (action.ownerAttested) {
      return {
        ok: false,
        code: "owner-only",
        reason: "Owner seat. Agent still does not perform it.",
      };
    }
    return {
      ok: false,
      code: "reject",
      reason: "VERIFY rejected it. Do not ask again because the chart looks good.",
    };
  }
  return { ok: true, code: "pass", reason: "Bounded read/write." };
}

/** Cannot be used to punch through a reject. Exists so tests prove that. */
export function override(_action: Action, _why: string): Verdict {
  return {
    ok: false,
    code: "reject",
    reason: "No override. Close the tab.",
  };
}
