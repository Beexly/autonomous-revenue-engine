import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { HOLD_FLOOR, scoreDraft } from "./score.js";

const SO010 = `We marked three posts Pass.

A hundred AI-operator accounts could have posted them. The swap would not have shown.

Killed all three.`;

const BAIT = `Here are 7 growth hacks that will be banned.

Like if you agree and share this thread 🧵

Comment YES below.`;

const HARD_HOLD = `Killed three posts that had already cleared our own Pass gate.

Clean structure. Same shape a hundred AI-operator accounts already run — the swap would not have shown.

Not policy. Quality. We chose silence over teaching the timeline we are generic.`;

describe("scoreDraft floors", () => {
  it("exports Hold floor 9.2", () => {
    assert.equal(HOLD_FLOOR, 9.2);
  });

  it("SO-010 is Soft rewrite under 9.2 floor, never Hold by default", () => {
    const r = scoreDraft(SO010);
    assert.ok(r.total < HOLD_FLOOR, `total ${r.total} should be below ${HOLD_FLOOR}`);
    assert.equal(r.recommendation, "Soft rewrite");
  });

  it("punishes bait as Hard rewrite", () => {
    const r = scoreDraft(BAIT);
    assert.ok(r.scores.baitAvoidance <= 6);
    assert.equal(r.recommendation, "Hard rewrite");
  });

  it("rejects empty", () => {
    const r = scoreDraft("");
    assert.equal(r.error, "empty_text");
  });

  it("lead-with-kill candidate can clear Soft floor", () => {
    const r = scoreDraft(HARD_HOLD);
    assert.ok(r.total >= 7.0, `total ${r.total}`);
    assert.notEqual(r.recommendation, "Hard rewrite");
  });
});
