#!/usr/bin/env node
import { splitConformal } from "./lib/conformal.js";

function usage() {
  console.error(
    "usage: conformal-lite --residuals 0.1,0.4,0.2 --score 1.5 [--coverage 0.9]"
  );
  process.exit(1);
}

function parseArgs(argv) {
  const out = { residuals: null, score: null, coverage: 0.9 };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--residuals") out.residuals = argv[++i];
    else if (a === "--score") out.score = argv[++i];
    else if (a === "--coverage") out.coverage = Number(argv[++i]);
    else usage();
  }
  return out;
}

const args = parseArgs(process.argv);
if (!args.residuals || args.score == null) usage();
const residuals = String(args.residuals)
  .split(/[,\s]+/)
  .filter(Boolean)
  .map(Number);
const result = splitConformal(residuals, Number(args.score), {
  coverage: args.coverage,
});
console.log(JSON.stringify(result, null, 2));
