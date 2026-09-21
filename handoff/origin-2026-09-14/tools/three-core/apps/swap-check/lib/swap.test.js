import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreSwap, DEFAULT_BRANDS } from "./swap.js";

test("specific decision scores low and is non-substitutable", () => {
  const r = scoreSwap("We killed three Pass posts.");
  assert.ok(r.score <= 3, "expected low interchangeability, got " + r.score);
  assert.equal(r.recommendation, "specific");
  assert.ok(Array.isArray(r.hits));
  assert.ok(Array.isArray(r.notes));
});

test("generic growth pitch is interchangeable", () => {
  const r = scoreSwap("Unlock 10x growth with our agentic playbook.");
  assert.ok(r.score >= 7, "expected high interchangeability, got " + r.score);
  assert.equal(r.recommendation, "interchangeable");
  assert.ok(r.hits.includes("generic operator jargon"));
  assert.ok(r.hits.includes("missing lived constraint"));
});

test("pronoun-free slogan is a hit", () => {
  const r = scoreSwap("Scale your personal brand.");
  assert.ok(r.hits.includes("pronoun-free slogan"));
  assert.ok(r.score >= 4);
});

test("empty draft is fully interchangeable", () => {
  const r = scoreSwap("");
  assert.equal(r.score, 10);
  assert.equal(r.recommendation, "interchangeable");
  assert.ok(r.hits.includes("empty"));
});

test("score stays in 0-10", () => {
  const r = scoreSwap("leverage unlock 10x agentic playbook scale growth");
  assert.ok(r.score >= 0 && r.score <= 10);
});

test("does not rewrite", () => {
  const r = scoreSwap("We killed three Pass posts.");
  assert.equal(r.rewrite, undefined);
  assert.equal(Object.prototype.hasOwnProperty.call(r, "rewrite"), false);
});

test("custom brands are accepted", () => {
  const r = scoreSwap("We shipped Beexly last night after cutting the queue.", {
    brands: ["AcmeGrowth"],
  });
  assert.ok(r.score <= 3);
  assert.equal(r.recommendation, "specific");
});

test("default brands are the generic AI-growth stand-ins", () => {
  assert.deepEqual(DEFAULT_BRANDS, ["GrowthOS", "PromptForge", "OperatorKit"]);
});

test("swap-risk sits between specific and interchangeable", () => {
  const r = scoreSwap("We leverage growth.");
  assert.ok(typeof r.recommendation === "string");
  assert.ok(
    ["specific", "swap-risk", "interchangeable"].includes(r.recommendation)
  );
  assert.ok(r.score >= 0 && r.score <= 10);
});
