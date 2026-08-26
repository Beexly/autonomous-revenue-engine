import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { mkdtempSync, writeFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { checkSelfContained } from "./check-selfcontained.mjs";
import { checkLinks } from "./check-links.mjs";
import { checkFiftyLoops } from "./check-fifty-loops.mjs";

describe("check-selfcontained", () => {
  it("flags an external script src", () => {
    const findings = checkSelfContained(
      `<script src="https://cdn.example.com/x.js"></script>`,
      "test.html"
    );
    assert.equal(findings.length, 1);
    assert.equal(findings[0].kind, "external-resource");
  });

  it("flags a runtime fetch call", () => {
    const findings = checkSelfContained(`<script>fetch("/api");</script>`, "test.html");
    assert.equal(findings.length, 1);
    assert.equal(findings[0].kind, "runtime-network-call");
  });

  it("does not flag a plain external hyperlink", () => {
    const findings = checkSelfContained(`<a href="https://x.com/foo">link</a>`, "test.html");
    assert.equal(findings.length, 0);
  });

  it("does not flag inline script/style with no external references", () => {
    const findings = checkSelfContained(
      `<style>body{color:#111}</style><script>const x=1;</script>`,
      "test.html"
    );
    assert.equal(findings.length, 0);
  });
});

describe("check-links", () => {
  let dir;

  it("flags a broken relative link", () => {
    dir = mkdtempSync(join(tmpdir(), "check-links-"));
    const file = join(dir, "a.html");
    writeFileSync(file, `<a href="missing.html">gone</a>`);
    const findings = checkLinks(`<a href="missing.html">gone</a>`, file);
    assert.equal(findings.length, 1);
    assert.equal(findings[0].href, "missing.html");
    rmSync(dir, { recursive: true, force: true });
  });

  it("does not flag a relative link that resolves", () => {
    dir = mkdtempSync(join(tmpdir(), "check-links-"));
    const a = join(dir, "a.html");
    const b = join(dir, "b.html");
    writeFileSync(b, "<p>b</p>");
    writeFileSync(a, `<a href="b.html">b</a>`);
    const findings = checkLinks(`<a href="b.html">b</a>`, a);
    assert.equal(findings.length, 0);
    rmSync(dir, { recursive: true, force: true });
  });

  it("ignores external links, mailto, and bare anchors", () => {
    const html = `
      <a href="https://example.com">ext</a>
      <a href="mailto:a@example.com">mail</a>
      <a href="#section">anchor</a>
    `;
    const findings = checkLinks(html, "/nonexistent/dir/a.html");
    assert.equal(findings.length, 0);
  });

  it("resolves a link with a #fragment against the file, not the fragment", () => {
    dir = mkdtempSync(join(tmpdir(), "check-links-"));
    const a = join(dir, "a.html");
    const b = join(dir, "b.html");
    writeFileSync(b, `<h2 id="s">s</h2>`);
    const findings = checkLinks(`<a href="b.html#s">b</a>`, a);
    assert.equal(findings.length, 0);
    rmSync(dir, { recursive: true, force: true });
  });
});

describe("check-fifty-loops", () => {
  const TABLE_HEADER = "| # | Name | Motion | $0 path | Status | Why |\n|---|---|---|---|---|---|\n";

  it("parses a row's status and cited paths", () => {
    const md =
      TABLE_HEADER +
      "| 1 | thing | does `README.md` stuff | New `README.md` | SHIPPED | money |\n";
    const [row] = checkFiftyLoops(md);
    assert.equal(row.row, 1);
    assert.equal(row.status, "SHIPPED");
    assert.ok(row.paths.includes("README.md"));
    assert.equal(row.anyExists, true); // README.md exists at repo root
  });

  it("reports a path that doesn't exist as not existing", () => {
    const md = TABLE_HEADER + "| 2 | thing | New `docs/definitely-not-a-real-file.html` | x | NEXT | y |\n";
    const [row] = checkFiftyLoops(md);
    assert.equal(row.anyExists, false);
  });

  it("ignores bare shell commands with no path component", () => {
    const md = TABLE_HEADER + "| 3 | thing | `node cli.js` in the repo | x | SHIPPED | y |\n";
    const [row] = checkFiftyLoops(md);
    assert.deepEqual(row.paths, []);
  });
});
