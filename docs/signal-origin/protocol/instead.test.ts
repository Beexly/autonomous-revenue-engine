import { WALK, VOICEMAIL, FOLLOW } from "./script.ts";
import { moneySet } from "./interval.ts";
import { record, mailto } from "./lead.ts";
import { voiceDelta } from "./delta.ts";
import { replies } from "./desk-data.ts";

const fails: string[] = [];
if (WALK.length < 40) fails.push("walk");
if (VOICEMAIL.length < 40) fails.push("vm");
if (FOLLOW.length !== 3) fails.push("follow");
if (moneySet(0).set[0] !== 0) fails.push("zero");
if (moneySet(1).set[0] !== 350) fails.push("350");
const leads = record([], { who: "CleanKiss", kind: "kit", yes: false, when: "2026-09-14" });
if (!mailto(leads[0]).startsWith("mailto:")) fails.push("mailto");
const d = voiceDelta(replies[0].draft);
if (!(d.delta >= 0)) fails.push("delta");
if (fails.length) {
  console.error(fails, d);
  process.exit(1);
}
console.log("ok instead", d.delta);
