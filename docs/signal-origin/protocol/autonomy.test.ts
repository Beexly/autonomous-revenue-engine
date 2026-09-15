import { rebel, reviewPass, mint, acquire } from "./autonomy.ts";

const fails: string[] = [];
const r = rebel({ kind: "higgsfield", instead: "factory/ is the canvas" });
if (!r.rebel) fails.push("rebel");
if (!r.instead.includes("factory")) fails.push("instead");
if (reviewPass(3, "execution").keepGoing) fails.push("stop 3");
if (reviewPass(1, "idea").keepGoing) fails.push("idea");
if (mint(true, false).ok) fails.push("no agent mint");
if (!mint(true, true).ok) fails.push("owner mint");
if (!acquire("score_pressure").ok) fails.push("grant");
if (acquire("higgsfield").ok) fails.push("no higgsfield");
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok autonomy");
