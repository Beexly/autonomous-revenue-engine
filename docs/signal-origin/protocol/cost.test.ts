import { wouldSpend, estimateTokens } from "./cost.ts";

const fails: string[] = [];
if (!wouldSpend({ cluster: true }).spend) fails.push("temporal should spend");
if (!wouldSpend({ broker: true }).spend) fails.push("redis should spend");
if (!wouldSpend({ tokens: 12 }).spend) fails.push("tokens should spend");
if (wouldSpend({}).spend) fails.push("empty should be free");
if (estimateTokens("abcd") !== 1) fails.push("4 chars = 1 token");
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok cost");
