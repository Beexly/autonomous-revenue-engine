import { dualRisk, modelUpdate, RETENTION } from "./companion.ts";

const fails: string[] = [];
if (dualRisk("face").length !== 2) fails.push("dual");
if (modelUpdate("ray", "new-girl", true).ok) fails.push("open week");
if (!modelUpdate("ray", "ray", true).ok) fails.push("same face");
if (!modelUpdate("ray", "other", false).ok) fails.push("week closed");
if (RETENTION.matingVisitsPerMonth !== 3) fails.push("retention");
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok companion fence");
