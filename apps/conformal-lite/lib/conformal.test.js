import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { splitConformal } from "./conformal.js";

describe("splitConformal", () => {
  it("rejects empty calibration", () => {
    const r = splitConformal([], 1);
    assert.equal(r.error, "empty_calibration");
  });

  it("n=9 coverage 0.9 uses the 9th residual as q", () => {
    const r = splitConformal([1, 2, 3, 4, 5, 6, 7, 8, 9], 0, { coverage: 0.9 });
    assert.equal(r.k, 9);
    assert.equal(r.q, 9);
    assert.equal(r.lo, -9);
    assert.equal(r.hi, 9);
    assert.equal(r.infinite, false);
  });

  it("centers the interval on the new score", () => {
    const r = splitConformal([1, 1, 1, 2, 2, 2, 3, 3, 3], 10, { coverage: 0.9 });
    assert.equal(r.score, 10);
    assert.equal(r.lo, 10 - r.q);
    assert.equal(r.hi, 10 + r.q);
  });

  it("returns an infinite interval when k > n", () => {
    const r = splitConformal([0.4], 1, { coverage: 0.9 });
    assert.equal(r.k, 2);
    assert.equal(r.infinite, true);
  });

  it("uses absolute residuals", () => {
    const r = splitConformal([-5, -4, -3, -2, -1, 0, 1, 2, 3], 0, {
      coverage: 0.9,
    });
    assert.equal(r.q, 5);
  });
});
