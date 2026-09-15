import { sheetReady, RAY_SHEET } from "./sheet.ts";

const fails: string[] = [];
const ok = sheetReady(RAY_SHEET);
if (!ok.ok) fails.push("ray incomplete: " + ok.missing.join());
const broken = { ...RAY_SHEET, costume: { ...RAY_SHEET.costume, leftover: "" } };
if (sheetReady(broken).ok) fails.push("empty leftover should fail");
if (RAY_SHEET.rail !== "kit") fails.push("ray is kit");
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok sheet");
