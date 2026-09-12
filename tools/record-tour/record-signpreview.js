const { chromium } = require("playwright");
const fs = require("fs");
const path = require("path");
const tour = {
  "name": "signpreview",
  "url": "https://beexly.github.io/autonomous-revenue-engine/docs/signpreview.html",
  "viewport": {
    "width": 1280,
    "height": 720
  },
  "durationSec": 20,
  "steps": [
    {
      "type": "navigate",
      "url": "https://beexly.github.io/autonomous-revenue-engine/docs/signpreview.html"
    },
    {
      "type": "fill",
      "selector": "input[name='business']",
      "text": "Garrett Baxley"
    },
    {
      "type": "click",
      "selector": "button:has-text('Generate')",
      "text": "Generate"
    },
    {
      "type": "wait",
      "waitMs": 3000
    }
  ]
}
const outDir = path.join(__dirname, "out");
if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });
(async () => {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 720}, recordVideo: { dir: outDir, name: tour.name + ".webm" } });
  const page = await context.newPage();
  await page.fill('undefined', 'undefined');
  await page.fill('undefined', 'undefined');
  await page.fill('undefined', 'undefined');
  await page.waitForTimeout(3000);
  await page.fill('undefined', 'undefined');
  await page.waitForTimeout(20000);
  await browser.close();
  console.log("Tour complete: " + tour.name + ".webm");
})();