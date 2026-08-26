import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { writeFileSync, mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const CLI = join(dirname(fileURLToPath(import.meta.url)), "..", "cli.js");

const WEAK = `So today I want to talk about 7 growth hacks that will be banned.

Like if you agree and share this thread 🧵

Comment YES below.`;

function run(args, input) {
  // Returns { stdout, code } without throwing on non-zero exit.
  try {
    const stdout = execFileSync(process.execPath, [CLI, ...args], {
      input,
      encoding: "utf8",
    });
    return { stdout, code: 0 };
  } catch (err) {
    if (typeof err.status !== "number") throw err;
    return { stdout: err.stdout ?? "", code: err.status };
  }
}

describe("qi-check CLI", () => {
  it("scores a known-weak draft below Hold with exit 1 (stdin input)", () => {
    const { stdout, code } = run([], WEAK);
    assert.equal(code, 1);
    assert.match(stdout, /Recommendation: Hard rewrite/);
    assert.match(stdout, /Composite: /);
    assert.match(stdout, /baitAvoidance/);
  });

  it("--json output parses as JSON and matches the scorer shape", () => {
    const { stdout, code } = run(["--json"], WEAK);
    assert.equal(code, 1);
    const r = JSON.parse(stdout);
    assert.equal(r.floors.hold, 9.2);
    assert.equal(r.recommendation, "Hard rewrite");
    assert.equal(typeof r.total, "number");
    assert.ok(r.total < r.floors.hold, `total ${r.total} should be below Hold`);
  });

  it("reads a draft from a file argument", () => {
    const dir = mkdtempSync(join(tmpdir(), "qi-check-cli-"));
    const file = join(dir, "draft.txt");
    writeFileSync(file, WEAK);
    const { stdout, code } = run([file]);
    assert.equal(code, 1);
    assert.match(stdout, /Recommendation: Hard rewrite/);
  });

  it("empty stdin exits 1 with the scorer's empty_text error", () => {
    const { stdout, code } = run([], "");
    assert.equal(code, 1);
    assert.match(stdout, /empty_text/);
  });

  it("unknown flag exits 2", () => {
    const { code } = run(["--nope"], WEAK);
    assert.equal(code, 2);
  });

  it("unreadable file exits 2", () => {
    const { code } = run(["/nonexistent/qi-check-draft.txt"]);
    assert.equal(code, 2);
  });
});
