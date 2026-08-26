import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { scoreDraft, HOLD_FLOOR, SOFT_FLOOR } from "./index.js";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

test("index.js is a byte-identical copy of apps/qi-check/lib/score.js", () => {
  const pkg = readFileSync(here("./index.js"), "utf8");
  const src = readFileSync(here("../../apps/qi-check/lib/score.js"), "utf8");
  assert.equal(pkg, src, "packages/qi-score/index.js drifted from apps/qi-check/lib/score.js");
});

test("exports the gate floors", () => {
  assert.equal(HOLD_FLOOR, 9.2);
  assert.equal(SOFT_FLOOR, 7.0);
});

test("scores a concrete draft and returns a recommendation", () => {
  const result = scoreDraft(
    "We killed the newsletter after 3 issues. It cost 6 hours a week and moved nothing. The blog post that replaced it took 40 minutes.",
    { platform: "x" }
  );
  assert.equal(typeof result.total, "number");
  assert.ok(result.total >= 0 && result.total <= 10);
  assert.ok(["Hold", "Soft rewrite", "Hard rewrite"].includes(result.recommendation));
  assert.deepEqual(result.floors, { hold: HOLD_FLOOR, soft: SOFT_FLOOR });
});

test("empty input is rejected as Hard rewrite", () => {
  const result = scoreDraft("   ");
  assert.equal(result.error, "empty_text");
  assert.equal(result.recommendation, "Hard rewrite");
});
