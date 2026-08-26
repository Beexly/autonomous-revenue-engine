import test from "node:test";
import assert from "node:assert/strict";
import { HOLD_FLOOR, SOFT_FLOOR, classify } from "./index.js";
import * as scoreLib from "../../apps/qi-check/lib/score.js";

test("constants match apps/qi-check/lib/score.js exports", () => {
  assert.equal(HOLD_FLOOR, scoreLib.HOLD_FLOOR);
  assert.equal(SOFT_FLOOR, scoreLib.SOFT_FLOOR);
});

test("constants are 9.2 and 7.0", () => {
  assert.equal(HOLD_FLOOR, 9.2);
  assert.equal(SOFT_FLOOR, 7.0);
});

test("classify returns Hold / Soft / Hard", () => {
  assert.equal(classify(9.5), "Hold");
  assert.equal(classify(8.0), "Soft");
  assert.equal(classify(6.0), "Hard");
});

test("classify boundary values", () => {
  assert.equal(classify(9.2), "Hold");
  assert.equal(classify(9.1), "Soft");
  assert.equal(classify(7.0), "Soft");
  assert.equal(classify(6.9), "Hard");
});

test("classify rejects non-numeric input", () => {
  assert.throws(() => classify("not a number"), TypeError);
  assert.throws(() => classify(NaN), TypeError);
});
