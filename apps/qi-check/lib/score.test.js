import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { scoreDraft } from "./score.js";

const SO010 = `We marked three posts Pass.

Clean. Structured. Could have lived on a hundred AI-operator accounts and nobody would notice the swap.

Killed all three. Not for policy — for quality.

Silence beats a first impression that teaches people you are generic.`;

const BAIT = `Here are 7 growth hacks that will be banned.

Like if you agree and share this thread 🧵

Comment YES below.`;

describe("scoreDraft", () => {
  it("scores SO-010 as Hold or Soft rewrite, not Hard", () => {
    const r = scoreDraft(SO010);
    assert.ok(r.total >= 6, `total ${r.total}`);
    assert.notEqual(r.recommendation, "Hard rewrite");
    assert.ok(r.scores.baitAvoidance >= 8);
  });

  it("punishes bait", () => {
    const r = scoreDraft(BAIT);
    assert.ok(r.scores.baitAvoidance <= 6);
    assert.equal(r.recommendation, "Hard rewrite");
  });

  it("rejects empty", () => {
    const r = scoreDraft("");
    assert.equal(r.error, "empty_text");
  });
});
