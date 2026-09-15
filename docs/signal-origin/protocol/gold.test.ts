import { goldEmail } from "./gold.ts";
import { scoreSwap } from "./swap.ts";

const g = goldEmail("Storefront", "Shopify's Facebook pixel and a Google tag");
const r = scoreSwap(g);
if (r.verdict === "generic") {
  console.error("gold email went generic", r);
  process.exit(1);
}
if (!g.includes("$250")) {
  console.error("missing price");
  process.exit(1);
}
console.log("ok gold", r.verdict, r.pass);
