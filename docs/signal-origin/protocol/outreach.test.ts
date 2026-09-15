import { nextTouch, referOk, KIT_SEQ, CLOSE, ASK_NO } from "./outreach.ts";

const fails: string[] = [];
if (!CLOSE.includes("Friday")) fails.push("close");
if (!ASK_NO.includes("2019")) fails.push("no-refer");
const t2 = nextTouch(KIT_SEQ, 1);
if (!("n" in t2) || t2.n !== 2) fails.push("touch2");
const stop = nextTouch(KIT_SEQ, 3);
if (!("stop" in stop) || !stop.stop) fails.push("stop");
if (referOk(["Boone's"]).ok) fails.push("one name");
if (!referOk(["Boone's", "SHWASH"]).ok) fails.push("two");
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok outreach");
