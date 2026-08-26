import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { scoreSwap, DEFAULT_BRANDS } from "./index.js";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

test("index.js is a byte-identical copy of apps/swap-check/lib/swap.js", () => {
  const pkg = readFileSync(here("./index.js"), "utf8");
  const src = readFileSync(here("../../apps/swap-check/lib/swap.js"), "utf8");
  assert.equal(pkg, src, "packages/swap-test/index.js drifted from apps/swap-check/lib/swap.js");
});

test("generic jargon copy scores as interchangeable", () => {
  const result = scoreSwap(
    "unlock exponential growth with the ultimate operator playbook and scale your personal brand today"
  );
  assert.ok(result.score >= 7, "expected score >= 7, got " + result.score);
  assert.equal(result.recommendation, "interchangeable");
  assert.ok(result.hits.includes("missing lived constraint"));
});

test("copy with a lived constraint scores as specific", () => {
  const result = scoreSwap(
    "We killed the newsletter after 3 issues. It cost 6 hours a week and moved nothing."
  );
  assert.ok(result.score <= 2, "expected score <= 2, got " + result.score);
  assert.equal(result.recommendation, "specific");
});

test("empty draft is fully interchangeable", () => {
  const result = scoreSwap("");
  assert.equal(result.score, 10);
  assert.equal(result.recommendation, "interchangeable");
});

test("exports the default brand list", () => {
  assert.deepEqual(DEFAULT_BRANDS, ["GrowthOS", "PromptForge", "OperatorKit"]);
});
