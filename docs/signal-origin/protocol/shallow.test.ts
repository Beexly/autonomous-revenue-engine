import { scoreHnBait } from "./bait.ts";
import { burstiness } from "./burst.ts";
import { search } from "./search.ts";

const fails: string[] = [];
if (scoreHnBait("7 ways to 10x your agentic playbook").recommendation === "ok") {
  fails.push("listicle should bait");
}
if (scoreHnBait("Show HN: swap-check").recommendation === "bait") fails.push("show hn");
const b = burstiness("Short. Then a much longer sentence that actually spends some words.");
if (b.cv == null) fails.push("cv");
const hits = search("howard zoho", [
  { id: "a", body: "James Howard OOO. Zoho bump then kill." },
  { id: "b", body: "Kit walk-in Kingwood plaza Saturday." },
]);
if (hits[0]?.id !== "a") fails.push("tfidf miss " + JSON.stringify(hits));
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok bait+burst+tfidf");
