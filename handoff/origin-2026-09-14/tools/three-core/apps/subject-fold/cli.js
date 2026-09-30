#!/usr/bin/env node
import { scoreSubject } from "./lib/fold.js";

function usage() {
  console.error('usage: subject-fold --subject "subject line"');
  process.exit(1);
}

function parseArgs(argv) {
  const out = { subject: null };
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (a === "--subject") out.subject = argv[++i];
    else usage();
  }
  return out;
}

const args = parseArgs(process.argv);
if (args.subject == null) usage();

console.log(JSON.stringify(scoreSubject(args.subject), null, 2));
