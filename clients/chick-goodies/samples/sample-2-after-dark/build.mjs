import { spawnSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.dirname(fileURLToPath(import.meta.url));
const dist = path.join(root, "dist");
const fail = (msg) => {
  console.error("FAIL " + msg);
  process.exit(1);
};

const sources = ["quote.js", "clock.js", "scene.js", "audit.mjs", "build.mjs"];
for (const file of sources) {
  const check = spawnSync(process.execPath, ["--check", path.join(root, file)], { encoding: "utf8" });
  if (check.status !== 0) fail(file + " syntax\n" + check.stderr);
}

const quoteCode = fs.readFileSync(path.join(root, "quote.js"), "utf8");
const sandbox = { window: {}, console };
vm.createContext(sandbox);
vm.runInContext(quoteCode, sandbox);
const graze = sandbox.window.quote("graze", 50, 0);
const holy = sandbox.window.quote("holy", 75, 0);
const refused = sandbox.window.quote("holy", 150, 0);
if (graze.totalCents !== 168622 || sandbox.window.formatMoney(graze.totalCents) !== "$1,686.22") {
  fail("graze 50 " + JSON.stringify(graze));
}
if (holy.totalCents !== 263022 || sandbox.window.formatMoney(holy.totalCents) !== "$2,630.22") {
  fail("holy 75 " + JSON.stringify(holy));
}
if (refused.ok !== false) fail("holy 150 was accepted");
if (graze.taxCents % 100 === 0 || holy.taxCents % 100 === 0) fail("taxCents is whole dollars");
if (graze.setupCents !== 22900) fail("setup");
if (sandbox.window.quote("graze", 50, 1).extraCents !== 15000) fail("extra half hour");

const page = fs.readFileSync(path.join(root, "table.html"), "utf8");
const clock = fs.readFileSync(path.join(root, "clock.js"), "utf8");
const scene = fs.readFileSync(path.join(root, "scene.js"), "utf8");
const loaded = page + "\n" + clock + "\n" + scene + "\n" + quoteCode;
const bans = [
  ["em dash", /\u2014/],
  ["Midnight Cart", /Midnight Cart/],
  ["Beexly", /Beexly/i],
  ["WeddingWire", /WeddingWire/i],
  ["instagram handle", /instagram\.com\/charcuterie_chick/],
  ["3500", /3500/],
  ["cart 350", /\$350\b/],
  ["smooth scroll css", /scroll-behavior:\s*smooth/],
  ["animation loop", /setAnimationLoop/],
  ["app raf", /requestAnimationFrame/],
  ["framer", /framer-motion/i],
];
for (const [name, pattern] of bans) {
  if (pattern.test(loaded)) fail("banned " + name);
}
if (!clock.includes("lenis.raf(time * 1000)")) fail("raf unit");
if (!clock.includes("renderScene(time * 1000)")) fail("render unit");
if (!/autoRaf:\s*false/.test(clock)) fail("autoRaf");
if (!scene.includes('tension') && !scene.includes("0.25")) fail("curve tension");

fs.rmSync(dist, { recursive: true, force: true });
fs.mkdirSync(path.join(dist, "img"), { recursive: true });
for (const file of ["table.html", "index.html", "quote.js", "clock.js", "scene.js", "sitemap.xml", "robots.txt"]) {
  fs.copyFileSync(path.join(root, file), path.join(dist, file));
}
for (const name of fs.readdirSync(path.join(root, "img"))) {
  fs.copyFileSync(path.join(root, "img", name), path.join(dist, "img", name));
}
console.log("PASS static production build " + dist);
