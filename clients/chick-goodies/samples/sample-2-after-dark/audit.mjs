import { chromium } from "playwright";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const shots = path.join(dir, "audit-shots");
const url = process.argv[2] || "http://127.0.0.1:4173/table.html";
const log = [];
const fail = (msg) => log.push("FAIL " + msg);
const pass = (msg) => log.push("PASS " + msg);

await mkdir(shots, { recursive: true });
const browser = await chromium.launch({ headless: true });

async function open(pageInit) {
  const page = await browser.newPage();
  const errors = [];
  page.on("pageerror", (err) => errors.push(String(err)));
  page.on("console", (msg) => {
    if (msg.type() === "error") errors.push(msg.text());
  });
  if (pageInit) await pageInit(page);
  await page.goto(url, { waitUntil: "networkidle", timeout: 60000 });
  await page.waitForTimeout(800);
  return { page, errors };
}

function visibleProblems(text) {
  const problems = [];
  if (text.includes("\u2014")) problems.push("em dash");
  if (/Midnight Cart/i.test(text)) problems.push("Midnight Cart");
  if (/\$3,?500\b/.test(text) || /\b3500\b/.test(text)) problems.push("3500");
  if (/\$350\b/.test(text) || /\b350\b/.test(text)) problems.push("350 as a price");
  if (/\bAct\b/.test(text) || /\bMovement\b/.test(text)) problems.push("Act or Movement");
  if (/Beexly/i.test(text)) problems.push("Beexly");
  if (/\bKnot\b/.test(text)) problems.push("Knot");
  if (/WeddingWire/i.test(text)) problems.push("WeddingWire");
  return problems;
}

const desktop = await open(async (page) => {
  await page.setViewportSize({ width: 1280, height: 800 });
});
const dText = await desktop.page.locator("body").innerText();
if (desktop.errors.length) fail("desktop console/page errors: " + desktop.errors.join(" | "));
else pass("desktop console clean");
const overflow = await desktop.page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
if (overflow) fail("horizontal overflow");
else pass("no horizontal overflow");
const phone = await desktop.page.locator('a[href="tel:+18324588180"]').count();
if (!phone) fail("missing phone link");
else pass("phone link");
const canonical = await desktop.page.locator('link[rel="canonical"]').getAttribute("href");
if (!canonical || !canonical.endsWith("/table.html")) fail("canonical " + canonical);
else pass("canonical " + canonical);
const schema = await desktop.page.locator('script[type="application/ld+json"]').count();
if (!schema) fail("missing schema");
else pass("schema present");
const words = visibleProblems(dText);
if (words.length) fail("visible copy: " + words.join(", "));
else pass("visible copy clean");
const zoom = await desktop.page.locator('meta[name="viewport"]').getAttribute("content");
if (/user-scalable\s*=\s*no|maximum-scale\s*=\s*1\b/.test(zoom || "")) fail("pinch zoom blocked: " + zoom);
else pass("pinch zoom not blocked");

const graze = await desktop.page.evaluate(() => window.quote("graze", 50, 0));
const holy = await desktop.page.evaluate(() => window.quote("holy", 75, 0));
const holyOther = await desktop.page.evaluate(() => window.quote("holy", 150, 0));
if (!graze || graze.totalCents !== 168622) fail("graze 50 total " + JSON.stringify(graze));
else pass("graze 50 is $1,686.22");
if (!holy || holy.totalCents !== 263022) fail("holy 75 total " + JSON.stringify(holy));
else pass("holy 75 is $2,630.22");
if (holyOther.ok) fail("holy 150 was priced");
else pass("holy 150 refused");
if (graze.taxCents % 100 === 0) fail("whole-dollar tax");
else pass("tax keeps cents");

async function shotAt(page, progress, name) {
  await page.evaluate((p) => {
    const max = window.__flight.lenis.limit || document.documentElement.scrollHeight - innerHeight;
    window.__flight.lenis.scrollTo(max * p, { immediate: true, force: true });
  }, progress);
  await page.waitForTimeout(400);
  const pose = await page.evaluate(() => ({ ...window.__flight.pose }));
  await page.screenshot({ path: path.join(shots, name) });
  return pose;
}

const poses = {};
for (const p of [0, 0.28, 0.55, 0.95]) {
  poses[p] = await shotAt(desktop.page, p, "desktop-" + String(p).replace(".", "_") + ".png");
  log.push("POSE " + p + " " + JSON.stringify(poses[p]));
}
const zs = [0, 0.28, 0.55, 0.95].map((p) => poses[p].z);
if (new Set(zs.map((z) => z.toFixed(2))).size < 4) fail("camera did not move between the four progress marks: " + zs.join(", "));
else pass("camera moved at four progress marks");

await desktop.page.evaluate(() => window.__flight.lenis.scrollTo(0, { immediate: true, force: true }));
await desktop.page.click("#check-date");
const quoteText = await desktop.page.locator("#quote").innerText();
if (!quoteText.includes("$1,686.22") || !quoteText.includes("$2,630.22")) fail("quote sheet totals missing: " + quoteText);
else pass("quote sheet shows both fixtures");
await desktop.page.screenshot({ path: path.join(shots, "desktop-quote.png") });

const mobile = await open(async (page) => page.setViewportSize({ width: 390, height: 844 }));
if (mobile.errors.length) fail("mobile errors: " + mobile.errors.join(" | "));
else pass("mobile console clean");
const mOverflow = await mobile.page.evaluate(() => document.documentElement.scrollWidth > document.documentElement.clientWidth + 1);
if (mOverflow) fail("mobile horizontal overflow");
else pass("mobile no horizontal overflow");
await shotAt(mobile.page, 0, "mobile-0.png");
await mobile.page.click("#check-date");
await mobile.page.screenshot({ path: path.join(shots, "mobile-quote.png") });

const before = await desktop.page.evaluate(() => window.__flight.pose.z);
await desktop.page.evaluate(() => {
  const lenis = window.__flight.lenis;
  lenis.scrollTo(lenis.limit * 0.15, { immediate: true, force: true });
});
await desktop.page.waitForTimeout(50);
await desktop.page.evaluate(() => {
  const lenis = window.__flight.lenis;
  lenis.scrollTo(lenis.limit * 0.8, { immediate: true, force: true });
});
await desktop.page.waitForTimeout(120);
const jumped = await desktop.page.evaluate(() => {
  const lenis = window.__flight.lenis;
  const scrollP = lenis.animatedScroll / lenis.limit;
  return { scrollP, poseP: window.__flight.pose.progress, z: window.__flight.pose.z };
});
if (Math.abs(jumped.poseP - jumped.scrollP) > 0.04) fail("camera left Lenis on a fast scroll " + JSON.stringify(jumped));
else pass("fast scroll stays on Lenis " + JSON.stringify(jumped));
if (Math.abs(jumped.z - before) < 0.2) fail("fast scroll did not move the camera");
else pass("fast scroll moved the camera");

const reduced = await open(async (page) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.emulateMedia({ reducedMotion: "reduce" });
});
if (reduced.errors.length) fail("reduced-motion errors: " + reduced.errors.join(" | "));
const stillOn = await reduced.page.locator("#still").isVisible();
const quoteOn = await reduced.page.locator("#quote").isVisible();
const z1 = await reduced.page.evaluate(() => window.__flight.pose.z);
await reduced.page.waitForTimeout(400);
const z2 = await reduced.page.evaluate(() => window.__flight.pose.z);
if (!stillOn || !quoteOn) fail("reduced motion hid the still or the quote");
else pass("reduced motion keeps still and quote");
if (Math.abs(z1 - z2) > 0.02) fail("reduced motion moved the camera");
else pass("reduced motion camera frozen");
const reducedText = await reduced.page.locator("body").innerText();
if (!reducedText.includes("832-458-8180") || !reducedText.includes("from $24")) fail("reduced motion missing chrome");
else pass("reduced motion keeps phone and price");

const noweb = await open(async (page) => {
  await page.setViewportSize({ width: 1280, height: 800 });
  await page.addInitScript(() => {
    const orig = HTMLCanvasElement.prototype.getContext;
    HTMLCanvasElement.prototype.getContext = function (type) {
      if (String(type).toLowerCase().indexOf("webgl") !== -1) return null;
      return orig.apply(this, arguments);
    };
  });
});
const noStill = await noweb.page.locator("#still").isVisible();
const noText = await noweb.page.locator("body").innerText();
if (!noStill) fail("no WebGL hid the still");
else pass("no WebGL shows the still");
if (!noText.includes("North Houston") || !noText.includes("from $24") || !noText.includes("50 guest minimum") || !noText.includes("Check your date") || !noText.includes("832-458-8180")) {
  fail("no WebGL first screen missing required lines");
} else pass("no WebGL first screen has the service line, price, minimum, date, and phone");

await desktop.page.close();
await mobile.page.close();
await reduced.page.close();
await noweb.page.close();
await browser.close();

const out = log.join("\n") + "\n";
await writeFile(path.join(dir, "audit-2.log"), out);
console.log(out);
process.exit(log.some((line) => line.startsWith("FAIL")) ? 1 : 0);
