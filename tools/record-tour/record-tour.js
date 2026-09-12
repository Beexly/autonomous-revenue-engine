#!/usr/bin/env node
// record-tour.js — autonomous video recorder
// Usage: node record-tour.js <tour-name>
// Reads tour config from tour.config.json, outputs .webm to out/

const fs = require('fs');
const path = require('path');

const TOUR_CONFIG = 'tour.config.json';
const OUT_DIR = 'out';

// Load tour configuration
function loadConfig() {
  const raw = fs.readFileSync(path.join(__dirname, TOUR_CONFIG), 'utf8');
  return JSON.parse(raw);
}

// Find tour by name
function findTour(config, name) {
  return config.tours.find(t => t.name === name);
}

// Generate Playwright script from tour config
function buildScript(tour) {
  const lines = [];
  lines.push('const { chromium } = require(\"playwright\");');
  lines.push('const fs = require(\"fs\");');
  lines.push('const path = require(\"path\");');
  lines.push('const tour = ' + JSON.stringify(tour, null, 2));
  lines.push('const outDir = path.join(__dirname, \"' + OUT_DIR + '\");');
  lines.push('if (!fs.existsSync(outDir)) fs.mkdirSync(outDir, { recursive: true });');
  lines.push('(async () => {');
  lines.push('  const browser = await chromium.launch({ headless: true });');
  lines.push('  const context = await browser.newContext({ viewport: { width: ' + (tour.viewport?.width || 1280) + ', height: ' + (tour.viewport?.height || 720) + '}, recordVideo: { dir: outDir, name: tour.name + \".webm\" } });');
  lines.push('  const page = await context.newPage();');

  // Add navigation and steps
  if (tour.steps) {
    tour.steps.forEach(step => {
      if (step.scrollTo) {
        lines.push('  await page.evaluate((y) => window.scrollTo(0, y), ' + JSON.stringify(step.scrollTo) + ');');
      }
      if (step.waitMs) {
        lines.push('  await page.waitForTimeout(' + step.waitMs + ');');
      }
      if (step.click) {
        lines.push('  await page.click(\"' + step.click + '\");');
      }
      if (step.type) {
        lines.push('  await page.fill(\'' + step.type.selector + '\', \'' + step.type.text + '\');');
      }
    });
  }

  // Add final delay
  const holdMs = tour.durationSec * 1000 || 3000;
  lines.push('  await page.waitForTimeout(' + holdMs + ');');
  lines.push('  await browser.close();');
  lines.push('  console.log(\"Tour complete: \" + tour.name + \".webm\");');
  lines.push('})();');

  return lines.join('\n');
}

// Execute
function main() {
  const config = loadConfig();
  const tourName = process.argv[2];
  if (!tourName) {
    console.error('Usage: node record-tour.js <tour-name>');
    console.error('Available tours:', config.tours.map(t => t.name).join(', '));
    process.exit(1);
  }

  const tour = findTour(config, tourName);
  if (!tour) {
    console.error('Tour not found:', tourName);
    console.error('Available tours:', config.tours.map(t => t.name).join(', '));
    process.exit(1);
  }

  console.log('Recording tour: ' + tour.name);
  console.log('URL: ' + tour.url);
  console.log('Viewport: ' + JSON.stringify(tour.viewport));
  console.log('Steps: ' + (tour.steps ? tour.steps.length : 0));

  const script = buildScript(tour);
  const scriptPath = path.join(__dirname, 'record-' + tour.name + '.js');
  fs.writeFileSync(scriptPath, script);

  console.log('Script written to: ' + scriptPath);

  // Execute the script
  const { execSync } = require('child_process');
  try {
    execSync('node "' + scriptPath + '"', { stdio: 'inherit', timeout: (tour.durationSec || 30) * 1000 + 30000 });
    console.log('Done! Output in: ' + OUT_DIR + '/' + tour.name + '.webm');
  } catch (err) {
    console.error('Tour recording failed:', err.message);
    process.exit(1);
  }
}

main();