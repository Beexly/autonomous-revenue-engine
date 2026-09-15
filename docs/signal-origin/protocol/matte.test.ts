import { matteOk } from "./matte.ts";

const fails: string[] = [];
if (matteOk({ firstFrameMask: false, leftoverOnSet: false, hairOrHands: true }).ok) fails.push("mask");
if (matteOk({ firstFrameMask: true, leftoverOnSet: true, hairOrHands: true }).ok) fails.push("oak");
if (matteOk({ firstFrameMask: true, leftoverOnSet: false, hairOrHands: false }).ok) fails.push("hands");
if (matteOk({ firstFrameMask: true, leftoverOnSet: false, hairOrHands: true, commentForLink: true }).ok)
  fails.push("bait");
if (!matteOk({ firstFrameMask: true, leftoverOnSet: false, hairOrHands: true }).ok) fails.push("pass");
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok matte");
