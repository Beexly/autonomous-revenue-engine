import { verify } from "./verify.ts";

export type Candidate = {
  name: string;
  where: string;
  hasSite: boolean;
  trade: string;
  phone?: string;
};

export type SeatRun = {
  id: string;
  job: string;
  verdict: "pass" | "kill" | "skip" | "owner";
  note: string;
};

const LOCAL = /kingwood|woodlands|spring|humble|porter|houston|conroe|tomball/i;
const TRADES = /lawn|pool|hvac|fence|detail|roof|iron|landscape|mechanical/i;

export function runDesk(c: Candidate): { seats: SeatRun[]; next: string } {
  const seats: SeatRun[] = [];

  const local = LOCAL.test(c.where);
  seats.push({
    id: "screener",
    job: "Houston walk radius",
    verdict: local ? "pass" : "kill",
    note: local ? "Inside the Saturday loop." : "Not a walk-in this week.",
  });

  const trade = TRADES.test(c.trade) || TRADES.test(c.name);
  seats.push({
    id: "analyst",
    job: "Phone-first trade",
    verdict: trade ? "pass" : "kill",
    note: trade ? "Kit trade." : "Not lawn/pool/HVAC/fence/detail/roof.",
  });

  seats.push({
    id: "news",
    job: "Already has a site?",
    verdict: c.hasSite ? "skip" : "pass",
    note: c.hasSite
      ? "Skip Kit. Do not walk in with a page they already have."
      : "No site this pass. Still confirm on the plaza. Do not invent a phone.",
  });

  seats.push({
    id: "insider",
    job: "Phone invented?",
    verdict: c.phone ? "pass" : "pass",
    note: c.phone
      ? `Use ${c.phone}.`
      : "No phone on file. Walk first. Do not mint a 555.",
  });

  seats.push({
    id: "pulse",
    job: "Sports isolation",
    verdict: "pass",
    note: "Not a pick. Not a GSE post.",
  });

  const gate = verify({ kind: "walk-in" });
  seats.push({
    id: "checker",
    job: "VERIFY",
    verdict: "owner",
    note: gate.reason,
  });

  const killed = seats.some((s) => s.verdict === "kill");
  const skipped = seats.some((s) => s.verdict === "skip");
  seats.push({
    id: "exit",
    job: "Owner walk-in",
    verdict: killed ? "kill" : skipped ? "skip" : "owner",
    note: killed
      ? "Do not walk."
      : skipped
        ? "Skip. Next shop."
        : "Owner walks with one-screen. $350. Live Friday. Hate it, don't pay.",
  });

  const next = killed
    ? "Kill. Next shop."
    : skipped
      ? "Skip. Next shop."
      : "Print one-screen. Plaza walk. Do not mention AI.";
  return { seats, next };
}
