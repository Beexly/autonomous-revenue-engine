#!/usr/bin/env node
/**
 * check-links.mjs — fails when a relative <a href> inside docs/ points at a
 * file that doesn't exist.
 *
 * Only checks internal (relative) links: this repo's static pages are meant
 * to be self-contained and reachable purely from what's on disk, so a
 * relative link is a promise this repo can actually keep — an external
 * https://... link is not something CI should be reaching out over the
 * network to verify. `mailto:`, `tel:`, bare `#anchor`, and external links
 * are all skipped.
 *
 * Zero dependencies. Usage:
 *   node ops/tools/check-links.mjs [file-or-dir ...]   # defaults to docs/
 * Exit 0 when clean, 1 when findings.
 */

import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { dirname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const HREF = /\bhref\s*=\s*["']([^"']+)["']/gi;
const EXTERNAL_OR_SPECIAL = /^(?:[a-z][a-z0-9+.-]*:|\/\/|#)/i;

/** Scan one HTML document for broken relative links. Returns [{line, href}]. Pure. */
export function checkLinks(html, filename) {
  const findings = [];
  const lines = String(html).split(/\r?\n/);
  const dir = dirname(filename);

  lines.forEach((line, i) => {
    HREF.lastIndex = 0;
    let m;
    while ((m = HREF.exec(line)) !== null) {
      const href = m[1];
      if (EXTERNAL_OR_SPECIAL.test(href)) continue;
      const [path] = href.split("#");
      if (!path) continue; // "file.html#frag" with empty path already handled; this is "#frag" alone
      const target = normalize(join(dir, path));
      if (!existsSync(target)) {
        findings.push({ file: filename, line: i + 1, href });
      }
    }
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
  const findings = files.flatMap((f) => checkLinks(readFileSync(f, "utf8"), f));

  if (findings.length === 0) {
    console.log(`check-links: clean (${files.length} pages)`);
    return 0;
  }
  console.error(`check-links: ${findings.length} broken link(s)\n`);
  for (const f of findings) console.error(`  ${f.file}:${f.line}  href="${f.href}"`);
  return 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exit(main(process.argv.slice(2)));
}
