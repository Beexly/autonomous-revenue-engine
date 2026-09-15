import { evolve, evidence, safeStop } from "./evolve.ts";
import { search } from "./search.ts";
import { replies } from "./desk-data.ts";

const fails: string[] = [];
const e = evolve("James Howard isn't dead. He's quiet.", "Howard");
if (!e.fit || !e.child.includes("Howard")) fails.push("gene");
const h = evidence(replies.filter((r) => r.rank === "post").map((r) => r.draft));
if (h.length < 4) fails.push("hash");
if (!safeStop(1, 0).stop) fails.push("yes stop");
if (safeStop(0, 2).stop) fails.push("still hunt");
const hits = search("howard", [
  { id: "old", body: "Howard OOO", when: "2026-08-25" },
  { id: "new", body: "Howard bump", when: "2026-09-14" },
]);
if (hits[0]?.id !== "new") fails.push("recency " + hits[0]?.id);
if (fails.length) {
  console.error(fails, e.child, h);
  process.exit(1);
}
console.log("ok evolve", h);
