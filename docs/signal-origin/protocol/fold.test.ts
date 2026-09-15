import { scoreSubject, goldSubject } from "./fold.ts";
import { query, TONIGHT } from "./query.ts";
import { NIGHT } from "./timeline.ts";

const fails: string[] = [];
const bait = scoreSubject("DON'T MISS THIS");
if (bait.recommendation === "hold") fails.push("bait held");
const gold = scoreSubject(goldSubject("North Belt Supply"));
if (gold.recommendation === "bait") fails.push("gold subject bait: " + gold.hits.join());
if (query(TONIGHT, { disposition: "kill" }).length !== 1) fails.push("one kill");
if (query(TONIGHT, { published: true }).length !== 0) fails.push("nothing published");
if (NIGHT.length < 4) fails.push("timeline thin");
if (fails.length) {
  console.error(fails, gold);
  process.exit(1);
}
console.log("ok fold+query+timeline", gold.score);
