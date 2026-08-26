/**
 * tools.test.mjs — fixture-based tests for lint-pass-queue.mjs and
 * lint-candidate.mjs. Run with: node --test ops/tools/
 * Zero dependencies (node:test).
 */

import { test } from "node:test";
import assert from "node:assert/strict";
import { lintPassQueue } from "./lint-pass-queue.mjs";
import { lintCandidate } from "./lint-candidate.mjs";

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
