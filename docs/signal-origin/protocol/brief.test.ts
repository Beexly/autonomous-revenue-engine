import { briefOk, PRODUCT_CARD } from "./brief.ts";

const fails: string[] = [];
if (briefOk({ sku: "ASTORIE SPORTS DRINK", seconds: 9, sports: true }).ok) fails.push("sports");
if (briefOk({ sku: "can", seconds: 60 }).ok) fails.push("60s");
if (briefOk({ sku: "can", seconds: 9, newFaces: 2 }).ok) fails.push("faces");
if (briefOk({ sku: "can", seconds: 9, credits: true }).ok) fails.push("credits");
if (!briefOk({ sku: PRODUCT_CARD.sku, seconds: 9 }).ok) fails.push("card");
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok brief");
