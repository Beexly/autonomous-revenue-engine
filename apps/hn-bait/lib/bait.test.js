import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreHnBait } from "./bait.js";

test("Show HN named project is specific substance", () => {
  const r = scoreHnBait("Show HN: swap-check – interchangeability gate");
  assert.ok(r.score <= 3, "expected low bait, got " + r.score);
  assert.equal(r.recommendation, "ok");
});

test("listicle title is bait-risk or bait", () => {
  const r = scoreHnBait("7 Ways to 10x Your Startup");
  assert.ok(r.hits.includes("listicle"));
  assert.ok(r.score >= 4);
  assert.ok(["bait-risk", "bait"].includes(r.recommendation));
});

test("Ask HN ragebait scores as bait", () => {
  const r = scoreHnBait("Ask HN: Why is everything so broken??");
  assert.ok(r.hits.includes("Ask HN ragebait"));
  assert.ok(r.score >= 7);
  assert.equal(r.recommendation, "bait");
});

test("emoji plus empty superlatives raise bait", () => {
  const r = scoreHnBait("🚀 ULTIMATE game-changing AI");
  assert.ok(r.hits.includes("emoji"));
  assert.ok(r.hits.includes("empty superlative"));
  assert.ok(r.score >= 6);
});

test("all-caps sensational title is bait-risk or bait", () => {
  const r = scoreHnBait("THIS SECRET WILL DESTROY YOUR WORKFLOW");
  assert.ok(r.hits.includes("all-caps") || r.hits.includes("sensational"));
  assert.ok(r.score >= 4);
});

test("empty title is bait", () => {
  const r = scoreHnBait("");
  assert.equal(r.score, 10);
  assert.equal(r.recommendation, "bait");
});

test("does not rewrite the title", () => {
  const r = scoreHnBait("Show HN: swap-check – interchangeability gate");
  assert.equal(r.rewrite, undefined);
  assert.ok(Array.isArray(r.hits));
});

test("score stays in 0-10", () => {
  const r = scoreHnBait("Show HN: fold — email subject gate");
  assert.ok(r.score >= 0 && r.score <= 10);
});
