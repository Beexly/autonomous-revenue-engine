import { retry, expire, type Run } from "./durable.ts";
import { search } from "./search.ts";
import { span } from "./trace.ts";
import { kitFunnel } from "./funnel.ts";

const fails: string[] = [];
const run: Run = {
  id: "TASK-001",
  workflow: "kingwood-list",
  attempt: 0,
  lastStep: "open",
  timeoutMin: 60,
  started: "2026-09-10T00:00:00Z",
  status: "open",
};
const dead = retry(retry(retry(run, "claim"), "still empty"), "still empty");
if (dead.status !== "dead") fails.push("third retry is dead letter");
const timed = expire(run, new Date("2026-09-14T00:00:00Z"));
if (timed.status !== "dead") fails.push("timeout");

const hits = search("howard zoho", [
  { id: "a", body: "James Howard OOO. Zoho bump then kill." },
  { id: "b", body: "Kit walk-in Kingwood." },
]);
if (hits[0]?.id !== "a") fails.push("search miss");

const s = span("RB-02", "He already said 17,000.", "pass", 8.2);
if (s.tokensEst < 1) fails.push("tokens");

if (kitFunnel({ walked: 0, shown: 0, yes: 0 }).note.indexOf("Saturday") < 0) {
  fails.push("empty funnel");
}

if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok replace");
