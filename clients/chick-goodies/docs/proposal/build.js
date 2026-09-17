// Builds the proposal.
//
//   node build.js            render Charcuterie-Chick-Proposal.html -> .pdf
//   node build.js --shots    first refresh img/*.jpg from the live sample sites, then render
//
// Needs playwright with Chromium (`npx playwright install chromium`), or
// NODE_PATH=$(npm root -g) when playwright is installed globally. PW_CHROMIUM
// can point at a Chromium binary. If HTTPS_PROXY is set, requests are fetched on
// the Node side (which trusts the proxy CA via NODE_EXTRA_CA_CERTS) and handed
// to Chromium, so Google Fonts and the sample sites load through the proxy.
// Re-run with --shots whenever a sample site changes: the PDF must show what
// the links show. The script fails if any page's content overflows its sheet.
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const dir = __dirname;
const html = path.join(dir, 'Charcuterie-Chick-Proposal.html');
const pdf = path.join(dir, 'Charcuterie-Chick-Proposal.pdf');
const shots = {
  'sample-1': 'https://charcuterie-chick-sample-1.vercel.app/',
  'sample-2': 'https://charcuterie-chick-sample-2.vercel.app/',
  'sample-3': 'https://charcuterie-chick-sample-3.vercel.app/',
};
// img/table.jpg is not a screenshot: it is the scene still from
// samples/sample-3-studio/img/table-still.jpg, resized to 1600x1000, so the
// proposal shows the room without the page chrome. Copy it again when that
// still is re-rendered.

async function proxied(page) {
  if (!process.env.HTTPS_PROXY) return;
  await page.route(/^https?:\/\//, async route => {
    try { const r = await route.fetch(); await route.fulfill({ response: r }); }
    catch (e) { await route.abort(); }
  });
}

(async () => {
  const launch = { args: ['--no-sandbox'] };
  if (process.env.PW_CHROMIUM) launch.executablePath = process.env.PW_CHROMIUM;
  if (process.env.HTTPS_PROXY) launch.proxy = { server: process.env.HTTPS_PROXY };
  const browser = await chromium.launch(launch);

  if (process.argv.includes('--shots')) {
    fs.mkdirSync(path.join(dir, 'img'), { recursive: true });
    for (const [name, url] of Object.entries(shots)) {
      const page = await browser.newPage({ viewport: { width: 1280, height: 800 }, deviceScaleFactor: 1 });
      await proxied(page);
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.evaluate(() => document.fonts.ready);
      await page.waitForTimeout(name === 'table' ? 4000 : 1500);
      const out = path.join(dir, 'img', `${name}.jpg`);
      await page.screenshot({ path: out, type: 'jpeg', quality: 82 });
      console.log('shot', name, url, `${Math.round(fs.statSync(out).size / 1024)} KB`);
      await page.close();
    }
  }

  const page = await browser.newPage();
  await proxied(page);
  await page.goto('file://' + html, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  await page.emulateMedia({ media: 'print' });

  const report = await page.evaluate(() => {
    const fonts = [...document.fonts].filter(f => f.status === 'loaded').map(f => f.family);
    const images = [...document.images].map(i => ({ src: i.getAttribute('src'), ok: i.complete && i.naturalWidth > 0 }));
    const pages = [...document.querySelectorAll('.page')].map((p, i) => ({
      page: i + 1, height: p.clientHeight, content: p.scrollHeight, overflow: p.scrollHeight > p.clientHeight
    }));
    return { fonts: [...new Set(fonts)], images, pages };
  });
  console.log('fonts loaded:', report.fonts.join(', ') || '(none, fallbacks in use)');
  for (const i of report.images) console.log(`image ${i.src}: ${i.ok ? 'ok' : 'MISSING'}`);
  for (const p of report.pages) console.log(`page ${p.page}: content ${p.content}px of ${p.height}px${p.overflow ? '  OVERFLOW' : ''}`);

  await page.pdf({ path: pdf, format: 'Letter', printBackground: true, preferCSSPageSize: true,
    margin: { top: 0, right: 0, bottom: 0, left: 0 } });
  await browser.close();
  const bad = report.pages.filter(p => p.overflow);
  const missing = report.images.filter(i => !i.ok);
  if (bad.length) console.error('overflow on page(s):', bad.map(p => p.page).join(', '));
  if (missing.length) console.error('missing image(s):', missing.map(i => i.src).join(', '));
  if (bad.length || missing.length) process.exit(1);
  console.log('pdf written:', pdf);
})();
