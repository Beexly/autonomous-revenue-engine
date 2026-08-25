import { test } from "node:test";
import assert from "node:assert/strict";
import { tokenize, featureFreqs, burrowsDelta, burstiness } from "./delta.js";

const passA = `Kill the generic post. First screen is the decision, not the throat-clear. We refused the listicle because density died in line one. Hold sits at 9.2 and we do not bargain it down. The reader never owes you a second sentence. Put the cost in the open. Then stop writing until the fold can carry the mechanism. If the open line lectures a category, the draft is already dead. Human-primary means you wrote the claim. We cut bait. We keep the refusal.`;

const passB = `We killed another bait hook before it left the desk. First-screen density is the whole job on a phone. If the concrete refusal is buried, nobody holds that draft. Soft rewrite is not a participation trophy. Measure the open, then cut until a stranger can repeat the decision. Generic posts survive on cadence and starve on substance. We ship the check, not the post. You paste your own words. The first line is the kill.`;

const passC = `Put the refusal in sentence one. We do not bury the cost. First-screen density is how a stranger decides to stay. Kill the generic cadence. Hold is a floor, not a mood. We cut the listicle, we cut the hook, we keep the mechanism in the fold. The reader does not owe us a second look. Human-primary: you wrote it. We only score the distance.`;

const mismatch = `Furthermore, it is important to leverage synergistic stakeholder alignment across the enterprise value stream. Additionally, our organization remains committed to optimizing scalable paradigms and holistic deliverables. In conclusion, the committee shall continue to facilitate robust operational excellence through comprehensive strategic initiatives and cross-functional collaboration going forward. Moreover, best practices indicate that proactive ideation workshops yield actionable insights for transformation roadmaps.`;

test("tokenize lowercases word tokens", () => {
  assert.deepEqual(tokenize("We Killed It."), ["we", "killed", "it"]);
});

test("featureFreqs are relative and missing features are zero", () => {
  const toks = tokenize("we we kill");
  const f = featureFreqs(toks, ["we", "kill", "missing"]);
  assert.equal(f.we, 2 / 3);
  assert.equal(f.kill, 1 / 3);
  assert.equal(f.missing, 0);
});

test("same-author Pass texts get lower delta than a mismatched register", () => {
  const same = burrowsDelta(passA, [passB, passC], { nFeatures: 40 });
  const other = burrowsDelta(mismatch, [passB, passC], { nFeatures: 40 });
  assert.equal(same.error, undefined);
  assert.equal(other.error, undefined);
  assert.ok(typeof same.centroidDelta === "number");
  assert.ok(typeof other.centroidDelta === "number");
  assert.ok(
    same.centroidDelta < other.centroidDelta,
    `expected same-author ${same.centroidDelta} < mismatch ${other.centroidDelta}`
  );
});

test("empty text is handled", () => {
  const r = burrowsDelta("", [passA, passB]);
  assert.equal(r.error, "insufficient_text");
  assert.equal(r.centroidDelta, null);
});

test("short text is handled", () => {
  const r = burrowsDelta("Hi.", [passA, passB]);
  assert.equal(r.error, "insufficient_text");
  assert.equal(r.centroidDelta, null);
});

test("burstiness returns cv for multi-sentence text", () => {
  const b = burstiness(
    "Kill it. We refused the long generic cadence that never earns the second sentence."
  );
  assert.equal(b.sentenceCount, 2);
  assert.ok(b.cv > 0);
});

test("burstiness handles a single sentence", () => {
  const b = burstiness("Only one.");
  assert.equal(b.cv, null);
  assert.equal(b.sentenceCount, 1);
});
