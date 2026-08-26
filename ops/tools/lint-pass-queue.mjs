#!/usr/bin/env node
/**
 * lint-pass-queue.mjs — lints ops/PASS_QUEUE.md (FIFTY_LOOPS row 28).
 *
 * For every markdown heading section whose heading contains an SO id
 * (### SO-NNN ...), checks that the section has:
 *   1. a well-formed id (SO- followed by exactly three digits),
 *   2. either a numeric score or an explicit gate instruction
 *      (a "Gate:" line or a qi-check reference),
 *   3. a recognizable disposition (Hold / Soft rewrite / Hard rewrite /
 *      Draft / failed / approved / active candidate / superseded / killed).
 *
 * Zero dependencies. Usage:
 *   node ops/tools/lint-pass-queue.mjs [path-to-queue.md]
 * Exit 0 when clean, 1 when findings.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

const ID_LOOSE = /SO-\d+/;
const ID_STRICT = /^SO-\d{3}$/;
// Numeric score: parenthesized number in the heading, or a score-context line
// in the body ("composite 9.2", "Density 7", "score: 8.3", "7.9/10", ...).
const HEADING_SCORE = /\(\s*\d+(?:\.\d+)?\s*\)/;
const BODY_SCORE =
  /\b(?:composite|density|voice ?fit|first ?screen|bait|burstiness|score[ds]?)\b\D{0,12}\d+(?:\.\d+)?/i;
// Explicit gate instruction: a Gate: label or a qi-check re-score reference.
const GATE = /(?:\bgate\b\s*:|\*\*gate:?\*\*|\bqi-check\b|\bre-?score\b)/i;
const DISPOSITION =
  /\b(hold|soft rewrite|hard rewrite|soft|hard|draft|failed|approved|active candidate|superseded|kill(?:ed)?)\b/i;

export function lintPassQueue(text) {
  const lines = String(text).split(/\r?\n/);
  const findings = [];
  const sections = [];

  // Collect heading sections whose heading mentions an SO id.
  for (let i = 0; i < lines.length; i++) {
    const m = lines[i].match(/^(#{1,6})\s+(.*)$/);
    if (!m) continue;
    const level = m[1].length;
    if (!ID_LOOSE.test(m[2])) continue;
    // Section body runs until the next heading of same-or-higher level,
    // a thematic break, or EOF.
    let end = lines.length;
    for (let j = i + 1; j < lines.length; j++) {
      const h = lines[j].match(/^(#{1,6})\s+/);
      if ((h && h[1].length <= level) || /^---+\s*$/.test(lines[j])) {
        end = j;
        break;
      }
    }
    sections.push({ line: i + 1, heading: m[2], body: lines.slice(i + 1, end).join("\n") });
  }

  if (sections.length === 0) {
    findings.push({ line: 1, message: "no SO-NNN heading sections found in queue file" });
    return findings;
  }

  for (const s of sections) {
    const idRaw = s.heading.match(ID_LOOSE)[0];
    const all = s.heading + "\n" + s.body;
    if (!ID_STRICT.test(idRaw)) {
      findings.push({ line: s.line, message: `${idRaw}: malformed id (expected SO- + exactly three digits)` });
    }
    const hasScore = HEADING_SCORE.test(s.heading) || BODY_SCORE.test(s.body);
    const hasGate = GATE.test(all);
    if (!hasScore && !hasGate) {
      findings.push({
        line: s.line,
        message: `${idRaw}: no numeric score and no explicit gate instruction in section`,
      });
    }
    if (!DISPOSITION.test(all)) {
      findings.push({ line: s.line, message: `${idRaw}: no recognizable disposition in section` });
    }
  }
  return findings;
}

function main() {
  const path = process.argv[2] || "ops/PASS_QUEUE.md";
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch (e) {
    console.error(`lint-pass-queue: cannot read ${path}: ${e.message}`);
    process.exit(1);
  }
  const findings = lintPassQueue(text);
  if (findings.length === 0) {
    console.log(`lint-pass-queue: ${path}: clean (0 findings)`);
    process.exit(0);
  }
  for (const f of findings) console.log(`${path}:${f.line}: ${f.message}`);
  console.log(`lint-pass-queue: ${findings.length} finding(s)`);
  process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
