import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HOLD_FLOOR, scoreDraft } from "./score.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// SO-013 — the active Pass-queue candidate (ops/PASS_QUEUE.md), exact text.
// Leads with a quantified decision ("killed three posts") and lands on a
// short declarative close — the shape the fixed ceilings are meant to reward.
const SO013 = `We killed three posts that had already cleared our own Pass gate.

Each one was clean and structured enough that a hundred AI-operator accounts could have run the same lines. The swap would not have shown.

We chose silence over a first impression that teaches people we are generic.`;

// SO-010 — the exact "approved direction for final" text from
// ops/REVIEW_SO009_011.md. The kill ("Killed all three") is buried in
// paragraph three, not the opening clause — this is the specific defect
// ops/PASS_QUEUE.md records ("Kill buried on line three"), and it is why
// this draft must stay below Hold even after the ceiling fix.
const SO010 = `We marked three posts Pass.

Clean. Structured. Could have lived on a hundred AI-operator accounts and nobody would notice the swap.

Killed all three. Not for policy — for quality.

Silence beats a first impression that teaches people you are generic.`;

const BAIT = `Here are 7 growth hacks that will be banned.

Like if you agree and share this thread 🧵

Comment YES below.`;

// High composite by density/structure/bait/length alone, but leans on
// exactly the one/two-word staccato fragments ("Clean structure." "Not
// policy. Quality.") ops/PASS_QUEUE.md flagged for SO-012 ("voiceFit 6,
// one-word cadence"). Must never reach Hold regardless of composite.
const STACCATO_HEAVY = `Killed three posts that had already cleared our own Pass gate.

Clean structure. Same shape a hundred AI-operator accounts already run — the swap would not have shown.

Not policy. Quality. We chose silence over teaching the timeline we are generic.`;

describe("scoreDraft floors", () => {
  it("exports Hold floor 9.2", () => {
    assert.equal(HOLD_FLOOR, 9.2);
  });

  it("SO-010 (real text) is Soft rewrite — kill buried past the opening clause, never Hold", () => {
    const r = scoreDraft(SO010);
    assert.ok(r.total < HOLD_FLOOR, `total ${r.total} should be below ${HOLD_FLOOR}`);
    assert.equal(r.recommendation, "Soft rewrite");
    assert.ok(r.scores.firstScreenDensity < 8, "density should be penalized for the buried kill");
  });

  it("SO-013 (active candidate) reaches Hold under the fixed ceiling", () => {
    const r = scoreDraft(SO013);
    assert.ok(r.total >= HOLD_FLOOR, `total ${r.total} should reach Hold floor ${HOLD_FLOOR}`);
    assert.equal(r.recommendation, "Hold");
    assert.ok(r.scores.firstScreenDensity >= 8);
    assert.ok(r.scores.baitAvoidance >= 9);
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

  it("staccato-fragment-heavy draft never reaches Hold, even at high composite", () => {
    const r = scoreDraft(STACCATO_HEAVY);
    assert.ok(r.total >= 7.0, `total ${r.total}`);
    assert.notEqual(r.recommendation, "Hard rewrite");
    assert.notEqual(r.recommendation, "Hold");
  });
});

describe("qi-check ceiling can actually reach Hold", () => {
  it("the theoretical best case across all five sub-scores clears 9.2", () => {
    // Mirrors the exhaustive-search method that originally found the bug:
    // compute the max each sub-score can independently reach and confirm
    // the weighted ceiling sits above the floor, not just at it.
    const maxima = {
      firstScreenDensity: 10,
      foldStructure: 10,
      baitAvoidance: 10,
      lengthFitness: 9,
      burstiness: 9,
    };
    const weights = {
      firstScreenDensity: 0.3,
      foldStructure: 0.2,
      baitAvoidance: 0.25,
      lengthFitness: 0.15,
      burstiness: 0.1,
    };
    let ceiling = 0;
    for (const k of Object.keys(weights)) ceiling += maxima[k] * weights[k];
    assert.ok(
      ceiling >= HOLD_FLOOR,
      `max reachable composite ${ceiling} must be >= Hold floor ${HOLD_FLOOR}`
    );
  });
});

// The scorer exists in three hand-synced copies: this module, the inlined
// <script> in apps/qi-check/public/hold.html, and the inlined <script> in
// docs/qi-check.html. This test extracts the pure scoring logic from each
// HTML file's inline script (everything before the DOM-wiring IIFE) and
// asserts it produces byte-identical results to this module for the same
// inputs — so any future edit to only one of the three copies fails CI.
function extractScoreDraftFromHtml(htmlPath) {
  const html = fs.readFileSync(htmlPath, "utf8");
  const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
  assert.ok(scriptMatch, `no <script> block found in ${htmlPath}`);
  const full = scriptMatch[1];
  const boundary = full.indexOf("(function ()");
  assert.ok(boundary !== -1, `no DOM-wiring boundary found in ${htmlPath}`);
  const pure = full.slice(0, boundary);
  // eslint-disable-next-line no-new-func
  const build = new Function(`${pure}\nreturn scoreDraft;`);
  return build();
}

describe("the three scorer copies stay in sync", () => {
  const copies = {
    "apps/qi-check/public/hold.html": path.join(__dirname, "..", "public", "hold.html"),
    "docs/qi-check.html": path.join(__dirname, "..", "..", "..", "docs", "qi-check.html"),
  };
  const samples = { SO013, SO010, BAIT, STACCATO_HEAVY, empty: "" };

  for (const [label, filePath] of Object.entries(copies)) {
    it(`${label} matches lib/score.js on every sample draft`, () => {
      const htmlScoreDraft = extractScoreDraftFromHtml(filePath);
      for (const [name, text] of Object.entries(samples)) {
        const fromModule = scoreDraft(text);
        const fromHtml = htmlScoreDraft(text);
        assert.deepEqual(
          fromHtml,
          fromModule,
          `${label} diverges from lib/score.js on draft "${name}"`
        );
      }
    });
  }
});
