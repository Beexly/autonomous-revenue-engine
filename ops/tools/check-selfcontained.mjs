#!/usr/bin/env node
/**
 * check-selfcontained.mjs — fails when a static page loads anything off-origin.
 *
 * The docs/ tools are served straight out of the repository and are promised to
 * run with no network at all ("Scoring runs in this page — no server required").
 * An external <script>, stylesheet, font, or image quietly breaks that promise
 * and leaks every visitor's IP and referer to a third party.
 *
 * A plain <a href="https://..."> hyperlink is NOT a violation: navigating away
 * when the reader clicks is different from loading a resource on page render.
 * That distinction is the whole reason this is a parser and not a grep.
 *
 * Zero dependencies. Usage:
 *   node ops/tools/check-selfcontained.mjs [file-or-dir ...]   # defaults to docs/
 * Exit 0 when clean, 1 when findings.
 */

import { readFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const EXTERNAL = /^(?:https?:)?\/\//i;

/** Attributes that cause the browser to FETCH something as the page renders. */
const RESOURCE_ATTR = /\b(src|srcset|poster|data|formaction)\s*=\s*["']([^"']+)["']/gi;

/** <link href> is a resource load; <a href> is navigation. */
const LINK_TAG = /<link\b[^>]*>/gi;
const HREF_IN_TAG = /\bhref\s*=\s*["']([^"']+)["']/i;

/** CSS url(...) and @import, including inside <style> blocks. */
const CSS_URL = /url\(\s*["']?((?:https?:)?\/\/[^"')]+)["']?\s*\)/gi;
const CSS_IMPORT = /@import\s+(?:url\()?\s*["']((?:https?:)?\/\/[^"')]+)["']/gi;

/** Runtime network calls. */
const RUNTIME_NET =
  /\b(?:fetch\s*\(|XMLHttpRequest\b|new\s+WebSocket\s*\(|navigator\s*\.\s*sendBeacon\s*\(|importScripts\s*\(|new\s+EventSource\s*\()/g;

/**
 * Scan one HTML document. Returns [{ line, kind, detail }]. Pure.
 */
export function checkSelfContained(html, filename = "<input>") {
  const findings = [];
  const lines = String(html).split(/\r?\n/);

  // matchAll clones each regex internally instead of mutating its shared
  // lastIndex, so the module-scope RESOURCE_ATTR/LINK_TAG/etc. constants stay
  // safe to reuse across lines and across calls without a manual reset.
  lines.forEach((line, i) => {
    const at = (kind, detail) => findings.push({ file: filename, line: i + 1, kind, detail });

    for (const m of line.matchAll(RESOURCE_ATTR)) {
      if (EXTERNAL.test(m[2])) at("external-resource", `${m[1]}="${m[2]}"`);
    }

    for (const m of line.matchAll(LINK_TAG)) {
      const href = m[0].match(HREF_IN_TAG)?.[1];
      if (href && EXTERNAL.test(href)) at("external-stylesheet-or-preload", `<link href="${href}">`);
    }

    for (const m of line.matchAll(CSS_URL)) at("external-css-url", m[1]);

    for (const m of line.matchAll(CSS_IMPORT)) at("external-css-import", m[1]);

    for (const m of line.matchAll(RUNTIME_NET)) at("runtime-network-call", m[0].trim());
  });

  return findings;
}

function htmlFilesUnder(target) {
  const st = statSync(target);
  if (st.isFile()) return target.endsWith(".html") ? [target] : [];
  return readdirSync(target, { withFileTypes: true }).flatMap((e) =>
    htmlFilesUnder(join(target, e.name))
  );
}

function main(argv) {
  const targets = argv.length ? argv : ["docs"];
  const files = targets.flatMap(htmlFilesUnder);
  const findings = files.flatMap((f) => checkSelfContained(readFileSync(f, "utf8"), f));

  if (findings.length === 0) {
    console.log(`check-selfcontained: clean (${files.length} pages)`);
    return 0;
  }
  console.error(`check-selfcontained: ${findings.length} finding(s)\n`);
  for (const f of findings) console.error(`  ${f.file}:${f.line}  [${f.kind}]  ${f.detail}`);
  console.error(
    "\nThese pages are promised to work offline, straight from the repo. Inline the" +
      "\nasset (or drop it). A plain <a href> hyperlink is fine and is not reported."
  );
  return 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exit(main(process.argv.slice(2)));
}
