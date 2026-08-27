/**
 * tools.test.mjs — fixture-based tests for lint-pass-queue.mjs and
 * lint-candidate.mjs. Run with: node --test ops/tools/
 * Zero dependencies (node:test).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { lintPassQueue } from "./lint-pass-queue.mjs";
import { lintCandidate } from "./lint-candidate.mjs";
import { scanSecrets, shannonEntropy, mask } from "./scan-secrets.mjs";
import { checkSelfContained } from "./check-selfcontained.mjs";

// ---------- lint-pass-queue fixtures ----------

const VALID_QUEUE = `# Pass queue

## Soft rewrite / internal

### SO-013 — active candidate

Body of the draft.

**Gate:** Paste into qi-check. Require composite >= 9.2 + recommendation Hold.

### SO-012 — failed (7.9)
Density 7, voiceFit 6. Soft rewrite.
`;

const QUEUE_NO_SCORE_NO_GATE = `# Pass queue

### SO-020 — active candidate

Just a body with no numbers and no instruction of any kind.
`;

const QUEUE_NO_DISPOSITION = `# Pass queue

### SO-021 — (8.1)

Composite 8.1. Nothing else said about what happens next.
`;

const QUEUE_BAD_ID = `# Pass queue

### SO-13 — failed (7.9)
Soft rewrite.
`;

test("lint-pass-queue: valid queue passes clean", () => {
  assert.deepEqual(lintPassQueue(VALID_QUEUE), []);
});

test("lint-pass-queue: section without score or gate instruction fails", () => {
  const findings = lintPassQueue(QUEUE_NO_SCORE_NO_GATE);
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /no numeric score and no explicit gate instruction/);
  assert.equal(findings[0].line, 3); // heading line of SO-020
});

test("lint-pass-queue: section without recognizable disposition fails", () => {
  const findings = lintPassQueue(QUEUE_NO_DISPOSITION);
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /no recognizable disposition/);
});

test("lint-pass-queue: malformed SO id (two digits) fails", () => {
  const findings = lintPassQueue(QUEUE_BAD_ID);
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /malformed id/);
});

test("lint-pass-queue: file with no SO sections fails", () => {
  const findings = lintPassQueue("# Empty queue\n\nNothing here.\n");
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /no SO-NNN heading sections/);
});

// ---------- lint-candidate fixtures ----------

function candidate({ omit = [], override = {} } = {}) {
  const fields = {
    id: "id: SO-014",
    date: "date: 2026-08-26",
    floors: "floors:\n  hold: 9.2\n  soft: 7.0",
    human_primary: "human_primary: true",
    scores:
      "scores:\n  composite: 9.3\n  firstScreenDensity: 8.5\n  foldStructure: 8.0\n  baitAvoidance: 10\n  lengthFitness: 9\n  burstiness: 8",
    disposition: "disposition: Hold",
  };
  for (const k of Object.keys(override)) fields[k] = override[k];
  const body = Object.entries(fields)
    .filter(([k]) => !omit.includes(k))
    .map(([, v]) => v)
    .join("\n");
  return `---\n${body}\n---\n\n# SO-014 — draft\n\nBody text.\n`;
}

test("lint-candidate: fully valid candidate passes clean", () => {
  assert.deepEqual(lintCandidate(candidate()), []);
});

test("lint-candidate: missing required field (human_primary) fails", () => {
  const findings = lintCandidate(candidate({ omit: ["human_primary"] }));
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /missing field: human_primary/);
});

test("lint-candidate: bad disposition fails", () => {
  const findings = lintCandidate(candidate({ override: { disposition: "disposition: Publish" } }));
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /disposition "Publish" not one of Hold \/ Soft \/ Hard \/ Draft/);
});

test("lint-candidate: wrong floors fail", () => {
  const findings = lintCandidate(
    candidate({ override: { floors: "floors:\n  hold: 8.0\n  soft: 7.0" } })
  );
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /floors\.hold is 8, must be 9\.2/);
});

test("lint-candidate: malformed id fails", () => {
  const findings = lintCandidate(candidate({ override: { id: "id: SO-14" } }));
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /does not match SO-NNN/);
});

test("lint-candidate: missing score dimension fails", () => {
  const findings = lintCandidate(
    candidate({ override: { scores: "scores:\n  composite: 9.3" } })
  );
  const missing = findings.filter((f) => /missing score: scores\./.test(f.message));
  assert.equal(missing.length, 5); // firstScreenDensity, foldStructure, baitAvoidance, lengthFitness, burstiness
});

test("lint-candidate: human_primary false fails", () => {
  const findings = lintCandidate(candidate({ override: { human_primary: "human_primary: false" } }));
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /human_primary must be true/);
});

test("lint-candidate: out-of-range score fails", () => {
  const findings = lintCandidate(
    candidate({
      override: {
        scores:
          "scores:\n  composite: 11\n  firstScreenDensity: 8.5\n  foldStructure: 8.0\n  baitAvoidance: 10\n  lengthFitness: 9\n  burstiness: 8",
      },
    })
  );
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /scores\.composite is 11, must be a number 0-10/);
});

test("lint-candidate: no frontmatter fails", () => {
  const findings = lintCandidate("# Just a heading\n\nNo frontmatter here.\n");
  assert.equal(findings.length, 1);
  assert.match(findings[0].message, /no YAML frontmatter block/);
});

// ---------- scan-secrets fixtures ----------
//
// The regression these guard: on 2026-08-25 a live 48-character token was
// committed to this public repo on a bare line with no vendor prefix and no
// NAME= to anchor on. Every structural rule missed it; only length + character
// classes + entropy caught it. The fixture below reproduces that SHAPE using an
// obviously synthetic value.

const BARE_TOKEN_SHAPE = "LLM" + "_" + "Kq7Rv2Nz9Xt4Bw1Ym6Pc3Fd8Hj5Gs0La" + "Zn4Qe7";  // scan-secrets: allow

test("scan-secrets: catches a bare high-entropy token with no prefix or assignment", () => {
  const findings = scanSecrets(`# a comment\n\n${BARE_TOKEN_SHAPE}\n`);
  assert.equal(findings.length, 1);
  assert.equal(findings[0].rule, "high-entropy-token");
  assert.equal(findings[0].line, 3);
});

test("scan-secrets: masks the value instead of echoing it", () => {
  const [finding] = scanSecrets(BARE_TOKEN_SHAPE);
  assert.ok(!finding.masked.includes(BARE_TOKEN_SHAPE), "must not echo the secret");
  assert.match(finding.masked, new RegExp(`\\[${BARE_TOKEN_SHAPE.length} chars\\]$`));
  assert.equal(mask("short"), "*****");
});

test("scan-secrets: catches vendor-prefixed keys", () => {
  const cases = [
    ["AKIAIOSFODNN7EXAMPLE", "aws-access-key-id"],  // scan-secrets: allow
    ["AIzaSyD-9tSrke72PouQMnMX-a7eZSW0jkFMBWY", "google-api-key"],  // scan-secrets: allow
    ["xoxb-1234567890-abcdefghijkl", "slack-token"],  // scan-secrets: allow
    ["-----BEGIN RSA PRIVATE KEY-----", "private-key-block"],  // scan-secrets: allow
  ];
  for (const [value, rule] of cases) {
    const rules = scanSecrets(value).map((f) => f.rule);
    assert.ok(rules.includes(rule), `${rule} not detected in ${value.slice(0, 8)}...`);
  }
});

test("scan-secrets: does not flag git SHAs, placeholders, or prose about tokens", () => {
  const safe = [
    "commit e825efa98154e65a60ce88dc383f716f6a2c0d5c landed",
    "run `npx gumroad-mcp@latest init` which sets GUMROAD_ACCESS_TOKEN",
    "API_KEY=YOUR_API_KEY_HERE",
    "token: <redacted>",
    "password = changeme",
    "Rotate the leaked Meta token (app 1099624436068516) and confirm here.",
  ];
  for (const line of safe) {
    assert.deepEqual(scanSecrets(line), [], `false positive on: ${line}`);
  }
});

test("scan-secrets: does not flag EIP-55 checksummed addresses but does flag 0x private keys", () => {
  const addr = "0x03fF1f2C8e6dA4b7A9c0E5B3d81aF46C2b9E7D0a"; // 0x + 40 hex
  assert.deepEqual(scanSecrets(addr), []);
  const privkey = addr + "3fF1f2C8e6dA4b7A9c0E5B3d8"; // 0x + 64 hex
  assert.equal(scanSecrets(privkey).length, 1);
});

test("scan-secrets: honours an explicit allow pragma", () => {
  assert.deepEqual(scanSecrets(`${BARE_TOKEN_SHAPE}  // scan-secrets: allow`), []);
});

test("scan-secrets: ignores inline base64 assets", () => {
  const dataUri = 'src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAmJLR0QA9AB0Cw"';
  assert.deepEqual(scanSecrets(dataUri), []);
});

test("shannonEntropy: rises with disorder", () => {
  assert.equal(shannonEntropy(""), 0);
  assert.equal(shannonEntropy("aaaaaaaa"), 0);
  assert.ok(shannonEntropy(BARE_TOKEN_SHAPE) > 3.5);
});

// ---------- check-selfcontained fixtures ----------

test("check-selfcontained: allows plain <a href> hyperlinks", () => {
  const html = '<a href="https://x.com/SignaL_OriginHQ">follow</a>';
  assert.deepEqual(checkSelfContained(html), []);
});

test("check-selfcontained: flags every external resource load", () => {
  const cases = [
    ['<script src="https://cdn.example.com/x.js"></script>', "external-resource"],
    ['<img src="//tracker.example.com/p.gif">', "external-resource"],
    ['<link rel="stylesheet" href="https://cdn.example.com/a.css">', "external-stylesheet-or-preload"],
    ['<style>@import "https://fonts.googleapis.com/css2?family=X";</style>', "external-css-import"],
    ["<style>body{background:url(https://img.example.com/bg.png)}</style>", "external-css-url"],
    ['<script>fetch("https://api.example.com/c")</script>', "runtime-network-call"],
    ["<script>new WebSocket(\"wss://x\")</script>", "runtime-network-call"],
  ];
  for (const [html, kind] of cases) {
    const kinds = checkSelfContained(html).map((f) => f.kind);
    assert.ok(kinds.includes(kind), `${kind} not detected in: ${html}`);
  }
});

test("check-selfcontained: relative and inline assets are fine", () => {
  const html = [
    '<script src="./score.js"></script>',
    '<link rel="stylesheet" href="style.css">',
    '<img src="data:image/png;base64,iVBORw0KGgo=">',
    "<style>body{background:url(bg.png)}</style>",
  ].join("\n");
  assert.deepEqual(checkSelfContained(html), []);
});

test("check-selfcontained: reports the correct line number", () => {
  const html = 'ok\nok\n<script src="https://cdn.example.com/x.js"></script>';
  const [finding] = checkSelfContained(html, "p.html");
  assert.equal(finding.line, 3);
  assert.equal(finding.file, "p.html");
});
