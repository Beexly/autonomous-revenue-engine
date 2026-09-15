import { hunt, scoreShop } from "./hunt.ts";
import { prag } from "./prag.ts";
import { splitGate, hasLeftover } from "./split.ts";

const fails: string[] = [];
const s0 = scoreShop({ hasSite: false, local: true, phone: "1" });
const first = hunt([], { name: "A", score: s0 });
if (first.do !== "sample") fails.push("sample");
const after = hunt(
  [
    { name: "A", score: 2 },
    { name: "B", score: 2 },
    { name: "C", score: 3 },
  ],
  { name: "D", score: 5 },
);
if (after.do !== "take") fails.push("take");

const p = prag("He already said 17,000, so I'm watching the widths.", "17,000 tokens on a die");
if (!p.ok) fails.push("prag " + p.reason);
if (!hasLeftover("I'd keep the scratch-out.")) fails.push("leftover");
if (!splitGate({ leftover: true, evenWidths: true, phraseHeavy: false }).keep) {
  fails.push("split should keep leftover");
}
if (splitGate({ leftover: false, evenWidths: true, phraseHeavy: false }).keep) {
  fails.push("split should drop empty");
}
if (fails.length) {
  console.error(fails, p);
  process.exit(1);
}
console.log("ok solutions", p.act);
