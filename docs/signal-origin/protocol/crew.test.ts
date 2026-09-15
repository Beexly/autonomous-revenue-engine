import { nextJob, deadLetter, BOARD } from "./crew.ts";

const fails: string[] = [];
const m = nextJob("motif");
if (m?.id !== "TASK-022") fails.push("motif next " + m?.id);
if (nextJob("opencode")) fails.push("opencode should be clear (dead/parked)");
const d = deadLetter({ id: "x", title: "x", for: "opencode", status: "claimed", ageDays: 4 });
if (d.status !== "dead") fails.push("dead letter");
if (!BOARD.find((j) => j.id === "TASK-001" && j.status === "dead")) fails.push("001");
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok crew", m?.id);
