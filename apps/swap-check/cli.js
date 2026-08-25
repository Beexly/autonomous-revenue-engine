#!/usr/bin/env node
import { scoreSwap, DEFAULT_BRANDS } from "./lib/swap.js";

function usage() {
  console.error(
    'usage: swap-check --text "..." [--brands GrowthOS,PromptForge,OperatorKit]'
  );
  process.exit(1);
}

function parseArgs(argv) {
  const out = { text: null, brands: [...DEFAULT_BRANDS] };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--text") out.text = argv[++i];
    else if (a === "--brands") {
      out.brands = String(argv[++i] || "")
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
    } else usage();
  }
  return out;
}

const args = parseArgs(process.argv);
if (args.text == null) usage();

console.log(
  JSON.stringify(scoreSwap(args.text, { brands: args.brands }), null, 2)
);
