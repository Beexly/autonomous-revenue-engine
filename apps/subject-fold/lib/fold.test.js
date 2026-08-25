import { test } from "node:test";
import assert from "node:assert/strict";
import { scoreSubject } from "./fold.js";

test("specific decision in the subject holds", () => {
  const r = scoreSubject("Killed the Pass queue rather than ship generic");
  assert.ok(r.score >= 7, "expected hold-range score, got " + r.score);
  assert.equal(r.recommendation, "hold");
  assert.ok(r.hits.includes("specific decision/cost"));
});

test("don't miss update is bait", () => {
  const r = scoreSubject("Don't miss this week's update");
  assert.ok(r.score < 4, "expected bait-range score, got " + r.score);
  assert.equal(r.recommendation, "bait");
  assert.ok(r.hits.includes("CTA bait") || r.hits.includes("newsletter bait"));
});

test("newsletter issue numbering is bait", () => {
  const r = scoreSubject("Newsletter #12");
  assert.ok(r.hits.includes("newsletter bait"));
  assert.ok(r.score <= 4);
  assert.ok(["bait", "soft"].includes(r.recommendation));
});

test("Re: noise lowers the score", () => {
  const r = scoreSubject("Re: update");
  assert.ok(r.hits.includes("Re:/Fwd: noise"));
  assert.ok(r.score < 7);
});

test("too short empty subject is bait or soft", () => {
  const r = scoreSubject("Hi");
  assert.ok(r.hits.includes("too short"));
  assert.ok(r.score < 7);
});

test("ALL CAPS CTA is bait", () => {
  const r = scoreSubject("YOU WON'T BELIEVE THIS UPDATE");
  assert.ok(r.hits.includes("ALL CAPS") || r.hits.includes("CTA bait"));
  assert.ok(r.score < 7);
});

test("empty subject is bait", () => {
  const r = scoreSubject("");
  assert.equal(r.score, 0);
  assert.equal(r.recommendation, "bait");
});

test("does not rewrite", () => {
  const r = scoreSubject("Killed the Pass queue rather than ship generic");
  assert.equal(r.rewrite, undefined);
  assert.ok(Array.isArray(r.hits));
});

test("does not treat this Hold as a 9.2 floor", () => {
  const r = scoreSubject("Killed the Pass queue rather than ship generic");
  assert.ok(!JSON.stringify(r).includes("9.2"));
});

test("score stays in 0-10 and polarity is hold-high", () => {
  const hold = scoreSubject("Killed the Pass queue rather than ship generic");
  const bait = scoreSubject("Don't miss this week's update");
  assert.ok(hold.score > bait.score);
  assert.ok(hold.score >= 0 && hold.score <= 10);
});
