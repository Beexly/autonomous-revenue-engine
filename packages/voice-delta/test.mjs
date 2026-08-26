import test from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { burrowsDelta, tokenize, burstiness } from "./index.js";

const here = (p) => fileURLToPath(new URL(p, import.meta.url));

test("index.js is a byte-identical copy of apps/voice-delta/lib/delta.js", () => {
  const pkg = readFileSync(here("./index.js"), "utf8");
  const src = readFileSync(here("../../apps/voice-delta/lib/delta.js"), "utf8");
  assert.equal(pkg, src, "packages/voice-delta/index.js drifted from apps/voice-delta/lib/delta.js");
});

test("computes a delta on tiny fixture corpora", () => {
  const references = [
    "We killed the newsletter after three issues. It cost six hours a week and moved nothing at all.",
    "I refused the retainer last month. The scope had no floor and the deadline had no date on it.",
    "We shipped the smaller tool first. It paid for the month within a week of going out the door.",
  ];
  const candidate =
    "We deferred the redesign again. The old page still converts and the new one had no numbers behind it.";
  const result = burrowsDelta(candidate, references, { nFeatures: 30 });
  assert.equal(result.error, undefined);
  assert.equal(typeof result.centroidDelta, "number");
  assert.ok(result.centroidDelta >= 0);
  assert.equal(result.lowerIsCloser, true);
  assert.equal(result.referenceCount, 3);
  assert.equal(result.perReference.length, 3);
});

test("insufficient text returns a structured error, not a throw", () => {
  const result = burrowsDelta("too short", ["also short"]);
  assert.equal(result.error, "insufficient_text");
  assert.equal(result.centroidDelta, null);
});

test("tokenize and burstiness helpers work", () => {
  assert.deepEqual(tokenize("Don't stop. Ship it!"), ["don't", "stop", "ship", "it"]);
  const b = burstiness("Short one. This sentence is quite a bit longer than the first one was.");
  assert.equal(b.sentenceCount, 2);
  assert.equal(typeof b.cv, "number");
});
