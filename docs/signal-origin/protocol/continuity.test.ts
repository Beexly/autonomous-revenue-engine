import { RAY, hasResidue, nextEpisode, forbiddenHit } from "./continuity.ts";
import { kitReel, qcShot, promptForOwner } from "./shot.ts";

const prev = {
  n: 1,
  when: "yesterday",
  beat: "oak on 1488",
  residue: [{ id: "oak", object: "oak", lastSeen: "yesterday" }],
  copy: "Ray parked under the oak on 1488.",
};

const fails: string[] = [];

const miss = hasResidue("brand new face, new truck, cinematic drone", prev.residue);
if (miss.ok) fails.push("should miss the oak");

const ep = nextEpisode(RAY, prev, "He left the Stanley in the cupholder");
if (!ep.copy.toLowerCase().includes("oak")) fails.push("next episode dropped the oak");

if (forbiddenHit("bikini on a daybed, cinematic drone").length < 3) {
  fails.push("forbidden list should catch bikini/daybed/cinematic");
}

const shot = kitReel("North Belt");
const qc = qcShot(shot);
if (!qc.ok) fails.push("kit reel should pass: " + qc.reasons.join(";"));

const bad = qcShot({
  set: "villa",
  wardrobe: "bikini",
  motion: "orbit then cut to a montage",
  inspect: "",
  seconds: 40,
  phone: "",
});
if (bad.ok) fails.push("cinema bikini should fail");

const p = promptForOwner(shot);
if (/kling|filmera|flux/i.test(p)) fails.push("owner prompt should not name a paid model");

if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok continuity+shot");
