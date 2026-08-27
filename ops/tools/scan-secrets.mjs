#!/usr/bin/env node
/**
 * scan-secrets.mjs — fails the build when a credential is committed.
 *
 * This exists because a live Meta access token was committed to this public
 * repository on 2026-08-25 (commit 0a38eed, ops/META_KEY.local). Deleting the
 * file in a later commit did not remove it: the blob is still reachable in the
 * history of `main`, so the token stayed public and had to be rotated. The only
 * durable fix is to never let the first commit land.
 *
 * Zero dependencies. Usage:
 *   node ops/tools/scan-secrets.mjs [path ...]     # defaults to git-tracked files
 * Exit 0 when clean, 1 when findings. Findings are printed with the secret
 * itself masked — this output goes to CI logs, which are also public.
 */

import { readFileSync, statSync } from "node:fs";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";

/**
 * High-confidence credential shapes. Each needs a vendor-specific prefix or a
 * structural marker, so ordinary prose about tokens does not trip the gate.
 */
export const RULES = [
  { name: "meta-access-token", re: /\bEAA[A-Za-z0-9]{20,}\b/g },
  { name: "aws-access-key-id", re: /\bAKIA[0-9A-Z]{16}\b/g },
  { name: "github-token", re: /\bgh[pousr]_[A-Za-z0-9]{36,}\b/g },
  { name: "stripe-live-key", re: /\b(?:sk|rk)_live_[A-Za-z0-9]{20,}\b/g },
  { name: "google-api-key", re: /\bAIza[0-9A-Za-z_-]{35}\b/g },
  { name: "slack-token", re: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/g },
  { name: "openai-key", re: /\bsk-(?:proj-)?[A-Za-z0-9]{32,}\b/g },
  { name: "private-key-block", re: /-----BEGIN (?:[A-Z ]+ )?PRIVATE KEY-----/g },
  { name: "json-web-token", re: /\beyJ[A-Za-z0-9_-]{10,}\.eyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]+/g },
  {
    // Generic "NAME = <long opaque value>". Requires an actual value, so an
    // env-var name mentioned in prose (GUMROAD_ACCESS_TOKEN) does not match.
    name: "assigned-credential",
    re: /\b(?:api[_-]?key|secret|token|passwd|password|access[_-]?key|client[_-]?secret)\b\s*[:=]\s*["']?([A-Za-z0-9_\-.]{24,})["']?/gi,
  },
  {
    // The catch-all the vendor rules cannot cover. The 2026-08-25 leak was a
    // bare 48-char token on its own line: no vendor prefix, no NAME= to anchor
    // on, so every structural rule above missed it. Length + all three
    // character classes + Shannon entropy is what actually finds that shape.
    // Lowercase-hex git SHAs are excluded by the uppercase requirement.
    name: "high-entropy-token",
    re: /\b[A-Za-z0-9_-]{32,}\b/g,
    validate: (v) =>
      // An EIP-55 checksummed Ethereum address is 0x + 40 hex and mixed-case
      // by design, so it satisfies every entropy test while being a public
      // identifier. A 0x + 64 hex value is NOT excluded: that is the shape of
      // a private key, and a false alarm there is the cheap direction to err.
      !/^0x[0-9a-fA-F]{40}$/.test(v) &&
      /[a-z]/.test(v) &&
      /[A-Z]/.test(v) &&
      /[0-9]/.test(v) &&
      shannonEntropy(v) >= 3.5,
  },
];

/** Shannon entropy in bits per character. */
export function shannonEntropy(value) {
  const s = String(value);
  if (!s) return 0;
  const counts = new Map();
  for (const ch of s) counts.set(ch, (counts.get(ch) ?? 0) + 1);
  let h = 0;
  for (const n of counts.values()) {
    const p = n / s.length;
    h -= p * Math.log2(p);
  }
  return h;
}

/**
 * Line shapes that legitimately carry long high-entropy strings. Checked per
 * line so one inline asset cannot mask a real credential elsewhere in the file.
 */
const NOISE_LINE = /(?:base64,|integrity=|sha(?:256|384|512)-|['"]sha\d+:)/i;

/** Values that look like credentials but are deliberate placeholders. */
const PLACEHOLDER =
  /^(?:x{4,}|y{4,}|0{4,}|1{4,}|\.{3,}|<.*>|\$\{.*\}|redacted|example|your[_-]?\w*|placeholder|changeme|dummy|sample|test[_-]?\w*|fake\w*|none|null|todo)$/i;

const SKIP_PATH =
  /(?:^|\/)(?:\.git\/|node_modules\/|\.venv\/|build\/|dist\/|__pycache__\/)|\.(?:png|jpg|jpeg|gif|webp|ico|svg|pdf|zip|xlsx|woff2?|ttf|eot|mp4|whl)$/i;

/** Mask a secret for safe printing: keep a short prefix, hide the rest. */
export function mask(value) {
  const s = String(value);
  if (s.length <= 8) return "*".repeat(s.length);
  return `${s.slice(0, 4)}${"*".repeat(Math.min(s.length - 4, 24))}[${s.length} chars]`;
}

/**
 * Scan one blob of text. Returns [{ rule, line, masked }].
 * Pure — no filesystem access, so it is trivially testable.
 */
export function scanSecrets(text, filename = "<input>") {
  const findings = [];
  const lines = String(text).split(/\r?\n/);

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    // An inline pragma lets a doc show a redacted example on purpose.
    if (/scan-secrets:\s*allow/i.test(line)) continue;

    for (const { name, re, validate } of RULES) {
      if (name === "high-entropy-token" && NOISE_LINE.test(line)) continue;
      // matchAll clones re internally rather than mutating its shared
      // lastIndex, so RULES stays safe to reuse across calls (including a
      // scanSecrets call re-entering while another is on the stack) without
      // relying on every call site remembering to reset state first.
      for (const m of line.matchAll(re)) {
        const value = m[1] ?? m[0];
        if (PLACEHOLDER.test(value)) continue;
        if (validate && !validate(value)) continue;
        // A value with no digit and no case mixing is almost certainly prose.
        if (name === "assigned-credential" && !/\d/.test(value) && !/[A-Z]/.test(value)) continue;
        findings.push({ file: filename, rule: name, line: i + 1, masked: mask(value) });
      }
    }
  }
  return findings;
}

function trackedFiles() {
  try {
    return execFileSync("git", ["ls-files", "-z"], { encoding: "utf8", maxBuffer: 64 * 1024 * 1024 })
      .split("\0")
      .filter(Boolean);
  } catch {
    return [];
  }
}

function main(argv) {
  const targets = (argv.length ? argv : trackedFiles()).filter((p) => !SKIP_PATH.test(p));
  const findings = [];

  for (const file of targets) {
    let st;
    try {
      st = statSync(file);
    } catch {
      continue;
    }
    if (!st.isFile() || st.size > 2 * 1024 * 1024) continue;
    let text;
    try {
      text = readFileSync(file, "utf8");
    } catch {
      continue; // unreadable or binary
    }
    if (text.includes("\u0000")) continue; // binary
    findings.push(...scanSecrets(text, file));
  }

  if (findings.length === 0) {
    console.log(`scan-secrets: clean (${targets.length} files)`);
    return 0;
  }

  console.error(`scan-secrets: ${findings.length} finding(s) — values masked\n`);
  for (const f of findings) {
    console.error(`  ${f.file}:${f.line}  [${f.rule}]  ${f.masked}`);
  }
  console.error(
    "\nA committed credential is public the moment it is pushed, and deleting the" +
      "\nfile in a later commit does NOT remove it from history. Rotate the" +
      "\ncredential, then keep it out of the tree (env var or an ignored *.local file)." +
      "\nIf a match is a deliberate placeholder, append a 'scan-secrets: allow' comment."
  );
  return 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exit(main(process.argv.slice(2)));
}
