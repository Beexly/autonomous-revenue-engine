#!/usr/bin/env node
/**
 * lint-candidate.mjs — validates an SO candidate file's YAML frontmatter
 * against ops/templates/SO_CANDIDATE.md (FIFTY_LOOPS row 29).
 *
 * Checks:
 *   - frontmatter block exists (--- ... ---)
 *   - id matches SO-NNN (exactly three digits)
 *   - date is YYYY-MM-DD
 *   - floors.hold === 9.2 and floors.soft === 7.0 (qi-check HOLD_FLOOR/SOFT_FLOOR)
 *   - human_primary is true
 *   - scores has numeric 0-10 values for: composite, firstScreenDensity,
 *     foldStructure, baitAvoidance, lengthFitness, burstiness
 *     (the real dimension names from apps/qi-check/lib/score.js)
 *   - disposition is one of Hold / Soft / Hard / Draft
 *
 * Zero dependencies; minimal two-level YAML subset parser (comments skipped).
 * Usage: node ops/tools/lint-candidate.mjs <candidate.md>
 * Exit 0 when clean, 1 when findings.
 */

import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

export const REQUIRED_SCORES = [
  "composite",
  "firstScreenDensity",
  "foldStructure",
  "baitAvoidance",
  "lengthFitness",
  "burstiness",
];
export const DISPOSITIONS = ["Hold", "Soft", "Hard", "Draft"];
const HOLD_FLOOR = 9.2;
const SOFT_FLOOR = 7.0;

/** Parse the frontmatter block into {data, findings, bodyPresent}. */
export function parseFrontmatter(text) {
  const lines = String(text).split(/\r?\n/);
  if (lines[0] !== "---") return { data: null, endLine: 0 };
  let end = -1;
  for (let i = 1; i < lines.length; i++) {
    if (/^---\s*$/.test(lines[i])) { end = i; break; }
  }
  if (end === -1) return { data: null, endLine: 0 };

  const data = {};
  const lineOf = {};
  let currentKey = null;
  for (let i = 1; i < end; i++) {
    const raw = lines[i];
    if (!raw.trim() || raw.trim().startsWith("#")) continue;
    const nested = raw.match(/^\s{2,}([A-Za-z_][\w]*)\s*:\s*(.*)$/);
    const top = raw.match(/^([A-Za-z_][\w]*)\s*:\s*(.*)$/);
    if (top) {
      currentKey = top[1];
      lineOf[currentKey] = i + 1;
      data[currentKey] = top[2] === "" ? {} : coerce(top[2]);
    } else if (nested && currentKey && typeof data[currentKey] === "object") {
      data[currentKey][nested[1]] = coerce(nested[2]);
      lineOf[`${currentKey}.${nested[1]}`] = i + 1;
    }
  }
  return { data, lineOf, endLine: end + 1 };
}

function coerce(v) {
  const t = v.trim().replace(/\s+#.*$/, "");
  if (t === "true") return true;
  if (t === "false") return false;
  if (/^-?\d+(?:\.\d+)?$/.test(t)) return Number(t);
  return t.replace(/^["']|["']$/g, "");
}

export function lintCandidate(text) {
  const findings = [];
  const { data, lineOf } = parseFrontmatter(text);
  if (!data) {
    findings.push({ line: 1, message: "no YAML frontmatter block (--- ... ---) found" });
    return findings;
  }
  const at = (k) => (lineOf && lineOf[k]) || 1;

  // id
  if (!("id" in data)) findings.push({ line: 1, message: "missing field: id" });
  else if (!/^SO-\d{3}$/.test(String(data.id)))
    findings.push({ line: at("id"), message: `id "${data.id}" does not match SO-NNN (three digits)` });

  // date
  if (!("date" in data)) findings.push({ line: 1, message: "missing field: date" });
  else if (!/^\d{4}-\d{2}-\d{2}$/.test(String(data.date)) || isNaN(Date.parse(String(data.date))))
    findings.push({ line: at("date"), message: `date "${data.date}" is not a valid YYYY-MM-DD date` });

  // floors
  if (!data.floors || typeof data.floors !== "object") {
    findings.push({ line: 1, message: "missing field: floors (hold/soft)" });
  } else {
    if (data.floors.hold !== HOLD_FLOOR)
      findings.push({ line: at("floors.hold"), message: `floors.hold is ${data.floors.hold}, must be ${HOLD_FLOOR}` });
    if (data.floors.soft !== SOFT_FLOOR)
      findings.push({ line: at("floors.soft"), message: `floors.soft is ${data.floors.soft}, must be ${SOFT_FLOOR}` });
  }

  // human_primary
  if (!("human_primary" in data)) findings.push({ line: 1, message: "missing field: human_primary" });
  else if (data.human_primary !== true)
    findings.push({ line: at("human_primary"), message: "human_primary must be true (QUALITY_BAR pass requirement 6)" });

  // scores
  if (!data.scores || typeof data.scores !== "object") {
    findings.push({ line: 1, message: "missing field: scores" });
  } else {
    for (const k of REQUIRED_SCORES) {
      const v = data.scores[k];
      if (v === undefined) findings.push({ line: at("scores"), message: `missing score: scores.${k}` });
      else if (typeof v !== "number" || v < 0 || v > 10)
        findings.push({ line: at(`scores.${k}`), message: `scores.${k} is ${JSON.stringify(v)}, must be a number 0-10` });
    }
  }

  // disposition
  if (!("disposition" in data)) findings.push({ line: 1, message: "missing field: disposition" });
  else if (!DISPOSITIONS.includes(data.disposition))
    findings.push({
      line: at("disposition"),
      message: `disposition "${data.disposition}" not one of ${DISPOSITIONS.join(" / ")}`,
    });

  return findings;
}

function main() {
  const path = process.argv[2];
  if (!path) {
    console.error("usage: node ops/tools/lint-candidate.mjs <candidate.md>");
    process.exit(1);
  }
  let text;
  try {
    text = readFileSync(path, "utf8");
  } catch (e) {
    console.error(`lint-candidate: cannot read ${path}: ${e.message}`);
    process.exit(1);
  }
  const findings = lintCandidate(text);
  if (findings.length === 0) {
    console.log(`lint-candidate: ${path}: clean (0 findings)`);
    process.exit(0);
  }
  for (const f of findings) console.log(`${path}:${f.line}: ${f.message}`);
  console.log(`lint-candidate: ${findings.length} finding(s)`);
  process.exit(1);
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) main();
