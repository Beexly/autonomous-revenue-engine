import { shiftLane, script, winner, type Trial } from "./ab.ts";

const fails: string[] = [];
if (shiftLane("2026-09-14") !== shiftLane("2026-09-14")) fails.push("stable");
if (!script("too much", "A").includes("Three-fifty")) fails.push("A");
if (!script("too much", "B").includes("hate")) fails.push("B");
const thin: Trial[] = [
  { when: "a", objection: "too much", lane: "A", out: "yes" },
  { when: "b", objection: "too much", lane: "B", out: "no" },
];
if (winner(thin, "too much").pick !== "keep-running") fails.push("thin");
const fat: Trial[] = [
  ...Array.from({ length: 3 }, (_, i) => ({ when: "a" + i, objection: "too much" as const, lane: "A" as const, out: "yes" as const })),
  ...Array.from({ length: 3 }, (_, i) => ({ when: "b" + i, objection: "too much" as const, lane: "B" as const, out: "no" as const })),
];
if (winner(fat, "too much").pick !== "A") fails.push("A wins");
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok ab", shiftLane());
