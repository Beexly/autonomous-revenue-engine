#!/usr/bin/env node
import { scoreHnBait } from "./lib/bait.js";

function usage() {
  console.error('usage: hn-bait --title "Show HN: title"');
  process.exit(1);
}

function parseArgs(argv) {
  const out = { title: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--title") out.title = argv[++i];
    else usage();
  }
  return out;
}

const args = parseArgs(process.argv);
if (args.title == null) usage();

console.log(JSON.stringify(scoreHnBait(args.title), null, 2));
