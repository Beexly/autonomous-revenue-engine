import { episodes } from "./desk-data.ts";

export type Flag = { id: string; kind: "contradiction" | "stale" | "missing"; note: string };

export function nightPass(): Flag[] {
  const flags: Flag[] = [
    {
      id: "sent-150",
      kind: "contradiction",
      note: "OUTREACH_LOG says SENT. This Gmail has two sent mails. Don't follow up the 150.",
    },
    {
      id: "stripe",
      kind: "stale",
      note: "$250 diagnostic is copy. Stripe is still on the sports face. Don't take a card.",
    },
    {
      id: "gumroad",
      kind: "stale",
      note: "$19 workbook cannot pay until the SSN form is done.",
    },
    {
      id: "x-chat",
      kind: "missing",
      note: "Readable SO Chat is one GSE self-thread. Two forwards. No inbound. Count is 3 bubbles, not a census.",
    },
    {
      id: "face-dollars",
      kind: "contradiction",
      note: "Bond/Atlas/Frost monthly figures are their screenshots. Ours is $0 on Face until a dollar hits.",
    },
  ];

  const facts = episodes.map((e) => e.fact.toLowerCase()).join(" ");
  if (!facts.includes("woodway")) {
    flags.push({
      id: "dad",
      kind: "missing",
      note: "Paint takeoff to Dad went out. Family lane. Don't mix it into Kit.",
    });
  }
  return flags;
}
