import { writable } from "./write.ts";

const fails: string[] = [];
if (!writable({ posted: false, gain: 1, missing: [] }).ok) fails.push("open");
if (writable({ posted: true, gain: 1, missing: [] }).ok) fails.push("closed");
if (writable({ posted: false, gain: 16, missing: [] }).ok) fails.push("overshoot");
if (writable({ posted: false, gain: 1, missing: ["dent"] }).ok) fails.push("dent");
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok write");
