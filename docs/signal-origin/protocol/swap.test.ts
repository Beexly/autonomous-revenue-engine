import { scoreSwap } from "./swap.ts";

const stencil = `We killed three posts built exactly like that. The structure was clean, the claims sounded deep, and every line was interchangeable.`;

const gold = `[Store]'s product pages are firing Shopify's Facebook pixel and a Google tag on the same view. That is two origins. I cannot see checkout from outside. I can send the outside view, free. If you want the written diagnostic after that, it is $250 and 48 hours.`;

const r1 = scoreSwap(stencil);
const r2 = scoreSwap(gold);

const fails: string[] = [];
if (r1.checks.find((c) => c.id === "template-opener")?.pass) {
  fails.push("stencil should fail template-opener");
}
if (r1.verdict === "anchored") fails.push("stencil must not be anchored");
if (r2.verdict === "generic") fails.push("gold must not be generic");
if (!r2.checks.find((c) => c.id === "residue")?.pass) fails.push("gold should keep residue");

if (fails.length) {
  console.error(fails.join("\n"));
  console.error("stencil", r1);
  console.error("gold", r2);
  process.exit(1);
}
console.log("ok stencil", r1.verdict, "fail", r1.fail);
console.log("ok gold", r2.verdict, "pass", r2.pass);
console.log("2/2 swap holds");
