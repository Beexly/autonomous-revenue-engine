#!/usr/bin/env node
/**
 * qi-check CLI — thin wrapper around lib/score.js.
 * Reads a draft from a file argument or stdin, prints the gate report.
 * No scoring logic lives here; floors and weights stay in lib/score.js.
 *
 * Exit codes:
 *   0 — recommendation clears the Hold floor ("Hold")
 *   1 — below Hold (Soft rewrite / Hard rewrite / empty draft)
 *   2 — usage error (bad flag, unreadable file, no input)
 */
import { readFileSync } from "node:fs";
import { scoreDraft } from "./lib/score.js";

function usage() {
  console.error(
    [
      "usage: qi-check [draft-file] [--json] [--platform <name>]",
      "",
      "Reads the draft from draft-file, or from stdin when no file is given.",
      "  --json            machine-readable output (raw scorer object)",
      "  --platform <name> platform hint passed to the scorer (default: x)",
    ].join("\n"),
  );
  process.exit(2);
}

function parseArgs(argv) {
  const out = { file: null, json: false, platform: undefined };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--json") out.json = true;
    else if (a === "--platform") {
      out.platform = argv[++i];
      if (out.platform == null) usage();
    } else if (a === "--help" || a === "-h") usage();
    else if (a.startsWith("-")) usage();
    else if (out.file == null) out.file = a;
    else usage();
  }
  return out;
}

function readInput(file) {
  try {
    // fd 0 is stdin; readFileSync on it drains the pipe synchronously.
    return readFileSync(file ?? 0, "utf8");
  } catch (err) {
    console.error(`qi-check: cannot read ${file ?? "stdin"}: ${err.message}`);
    process.exit(2);
  }
}

function renderHuman(r) {
  const lines = [];
  if (r.error) {
    lines.push(`qi-check: ${r.error}`);
    lines.push(`Recommendation: ${r.recommendation}`);
    return lines.join("\n");
  }
  lines.push(`qi-check v${r.version} — platform: ${r.platform}`);
  lines.push("");
  lines.push(`Composite: ${r.total}  (Hold floor ${r.floors.hold}, Soft floor ${r.floors.soft})`);
  lines.push("");
  lines.push("Dimensions:");
  for (const [k, v] of Object.entries(r.scores)) {
    lines.push(`  ${k.padEnd(18)} ${v}`);
  }
  lines.push("");
  lines.push("Flags:");
  for (const [k, v] of Object.entries(r.flags)) {
    lines.push(`  ${k.padEnd(24)} ${v ? "yes" : "no"}`);
  }
  if (r.fixes.length > 0) {
    lines.push("");
    lines.push("Fixes:");
    for (const f of r.fixes) lines.push(`  - ${f}`);
  }
  lines.push("");
  lines.push(`Recommendation: ${r.recommendation}`);
  return lines.join("\n");
}

const args = parseArgs(process.argv);
const text = readInput(args.file);
const result = scoreDraft(
  text,
  args.platform === undefined ? {} : { platform: args.platform },
);

if (args.json) console.log(JSON.stringify(result, null, 2));
else console.log(renderHuman(result));

process.exit(result.recommendation === "Hold" ? 0 : 1);
