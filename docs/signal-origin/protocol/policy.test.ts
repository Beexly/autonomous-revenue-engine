import { gate } from "./policy.ts";

const fails: string[] = [];
if (gate({ kind: "original", pressure: 9.4, swapFails: 0 }).decision !== "pass") fails.push("9.4 original");
if (gate({ kind: "original", pressure: 5.6, swapFails: 0 }).decision !== "rewrite") fails.push("5.6 original");
if (gate({ kind: "reply", pressure: 8.2, swapFails: 0 }).decision !== "pass") fails.push("8.2 reply");
if (gate({ kind: "reply", pressure: 6, swapFails: 0 }).decision !== "rewrite") fails.push("6 reply");
if (gate({ kind: "original", pressure: 9.5, swapFails: 1 }).decision !== "rewrite") fails.push("swap");
if (gate({ kind: "original", pressure: 9.5, swapFails: 0, sports: true }).decision !== "kill") fails.push("sports");
if (gate({ kind: "original", pressure: 9.5, swapFails: 0, stencil: true }).decision !== "kill") fails.push("stencil");
if (gate({ kind: "original", pressure: 9.5, swapFails: 0, bill: { cluster: true } }).decision !== "kill") {
  fails.push("temporal");
}
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok policy");
