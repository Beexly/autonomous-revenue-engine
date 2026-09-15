import { kitYes, holdMath, faceMath, KILLS } from "./math.ts";
import { weekQc } from "./calendar.ts";
import { nightPass } from "./maintain.ts";
import { packet, EMPTY } from "./packet.ts";

const fails: string[] = [];
if (kitYes(0).cash !== 0) fails.push("zero yes is zero cash");
if (kitYes(2).cash !== 700) fails.push("two yes is 700");
if (holdMath(58000).revenue !== 0) fails.push("views are not revenue");
if (faceMath(12, 0).dollarsSeen !== 0) fails.push("unposted dollars");
if (KILLS.length < 6) fails.push("need the kill list");
const w = weekQc();
if (w.length !== 7) fails.push("need 7 days");
if (w.some((d) => !d.qc.ok)) fails.push("a day failed shot QC: " + w.filter((d) => !d.qc.ok).map((d) => d.d).join(","));
if (!w[1].copy.toLowerCase().includes("oak")) fails.push("day 2 dropped the oak");
if (nightPass().length < 4) fails.push("night pass too thin");
const p = JSON.parse(packet(EMPTY));
if (!p.goal || !p.next) fails.push("packet empty");
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok math+week+night+packet");
