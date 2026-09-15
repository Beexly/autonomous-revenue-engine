import { kitReel } from "./shot.ts";
import { resetTell, occlusion, unpolished } from "./qc.ts";
import { draftNote } from "./note.ts";
import { reuse } from "./reuse.ts";

const fails: string[] = [];
const a = kitReel("North Belt");
const b = { ...a, motion: a.motion + " He blinks." };
if (resetTell(a, a).ok) fails.push("identical takes should fail");
if (!resetTell(a, b).ok) fails.push("blink should pass reset");
if (!occlusion(a).ok) fails.push("kit reel should survive occlusion");
if (!unpolished(a).ok) fails.push("kit reel should be unpolished: " + unpolished(a).reasons.join());

const n1 = draftNote("Bond's $2,040 is his screenshot, not a platform dashboard.", []);
if (n1.verdict !== "not-enough") fails.push("no URL means no note");
const n2 = draftNote(
  "This clip was called as a real Instagram.",
  ["https://www.instagram.com/maddie_mochi/"],
);
if (n2.verdict !== "note") fails.push("url note");
if (n2.text.length > 280) fails.push("over 280");

const r = reuse("He already said 17,000, so I'm watching where the weights live.");
if (!r.thread.includes("17,000")) fails.push("thread lost the number");

if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok qc+note+reuse");
