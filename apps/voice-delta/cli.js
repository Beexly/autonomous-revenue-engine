#!/usr/bin/env node
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, resolve } from "node:path";
import { burrowsDelta, burstiness } from "./lib/delta.js";

function usage() {
  console.error(
    "usage: voice-delta --candidate <file> --reference <dir-or-file> [--reference ...]"
  );
  process.exit(1);
}

function parseArgs(argv) {
  const out = { candidate: null, references: [], nFeatures: 50 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--candidate") out.candidate = argv[++i];
    else if (a === "--reference") out.references.push(argv[++i]);
    else if (a === "--n" || a === "--features") out.nFeatures = Number(argv[++i]);
    else usage();
  }
  return out;
}

function collectFiles(path) {
  const abs = resolve(path);
  const st = statSync(abs);
  if (st.isDirectory()) {
    return readdirSync(abs)
      .filter((f) => f.endsWith(".txt"))
      .sort()
      .map((f) => join(abs, f));
  }
  return [abs];
}

const args = parseArgs(process.argv);
if (!args.candidate || args.references.length === 0) usage();

const candidatePath = resolve(args.candidate);
const candidate = readFileSync(candidatePath, "utf8");
const refFiles = args.references.flatMap(collectFiles);
if (!refFiles.length) {
  console.error("no reference .txt files found");
  process.exit(1);
}
const references = refFiles.map((f) => readFileSync(f, "utf8"));

const delta = burrowsDelta(candidate, references, { nFeatures: args.nFeatures });
const burst = burstiness(candidate);

console.log(
  JSON.stringify(
    {
      candidate: candidatePath,
      references: refFiles,
      delta,
      burstiness: burst,
      note: "Lower delta means closer stylistic match. Does not prove human authorship. Does not rewrite. Does not publish.",
    },
    null,
    2
  )
);
