export type Actor = "motif" | "opencode" | "grok" | "distro" | "owner";

export type Envelope = {
  id: string;
  kind: "tool" | "resource" | "prompt" | "episode";
  from: Actor;
  to: Actor | "bus";
  created: string;
  name: string;
  title: string;
  input: Record<string, unknown>;
  annotations: {
    readOnlyHint: boolean;
    destructiveHint: boolean;
    idempotentHint: boolean;
    openWorldHint: boolean;
    approvalRequired: boolean;
  };
  rail: {
    neverSpend: true;
    neverPublish: boolean;
    neverSend: boolean;
    sportsIsolated: boolean;
  };
};

export function envelope(partial: {
  id: string;
  from: Actor;
  to: Actor | "bus";
  name: string;
  title: string;
  input?: Record<string, unknown>;
  destructive?: boolean;
  openWorld?: boolean;
}): Envelope {
  const destructiveHint = !!partial.destructive;
  const openWorldHint = !!partial.openWorld;
  const approvalRequired = destructiveHint || openWorldHint;
  return {
    id: partial.id,
    kind: "tool",
    from: partial.from,
    to: partial.to,
    created: new Date().toISOString(),
    name: partial.name,
    title: partial.title,
    input: partial.input ?? {},
    annotations: {
      readOnlyHint: !destructiveHint && !openWorldHint,
      destructiveHint,
      idempotentHint: !destructiveHint,
      openWorldHint,
      approvalRequired,
    },
    rail: {
      neverSpend: true,
      neverPublish: true,
      neverSend: true,
      sportsIsolated: true,
    },
  };
}

export function checkEnvelope(e: Envelope): string[] {
  const err: string[] = [];
  if (!/^TASK-\d{3,}-[a-z0-9-]+$/.test(e.id) && !/^EP-\d{4}-\d{2}-\d{2}-/.test(e.id)) {
    err.push("bad id");
  }
  if ((e.annotations.destructiveHint || e.annotations.openWorldHint) && !e.annotations.approvalRequired) {
    err.push("approvalRequired must be true");
  }
  if (e.rail.neverSpend !== true) err.push("neverSpend");
  return err;
}
