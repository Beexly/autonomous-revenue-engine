#!/usr/bin/env node
/**
 * check-fifty-loops.mjs — flags rows in ops/FIFTY_LOOPS.md whose Status
 * column disagrees with what's actually on disk.
 *
 * The board's own table cites concrete repo paths in backticks for most
 * rows (Motion and $0-path columns). This pulls every backtick span that
 * looks like a real repo-relative path (contains "/" or ends in a known
 * extension — filters out bare commands like `node cli.js` with no path
 * component, and prose like `Vercel later is owner-only`), and checks each
 * one against the filesystem.
 *
 * A row is flagged SHOULD-BE-SHIPPED when it's marked NEXT (file-only,
 * not yet written) but at least one of its cited paths already exists.
 * A row marked SHIPPED with NONE of its cited paths present is flagged
 * SHOULD-NOT-BE-SHIPPED. BLOCKED-OWNER / BLOCKED-APPROVE rows are about an
 * owner action, not file existence, and are left alone either way.
 *
 * Usage: node ops/tools/check-fifty-loops.mjs [path-to-FIFTY_LOOPS.md]
 * Exit 0 when the board matches disk, 1 when there's a mismatch.
 */
import { readFileSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const PATH_LIKE = /`([^`]+)`/g;
const REPO_ROOT = new URL("../../", import.meta.url).pathname;

// Rows whose Motion/$0-path columns cite an existing DEPENDENCY file (what
// the new artifact wraps or lints), not the artifact itself — the artifact
// genuinely doesn't exist yet. Path-citation alone can't tell "this row's
// own deliverable" apart from "a file this row's deliverable will read",
// so these two are hand-verified exceptions, checked at each board edit:
// row 26 cites apps/qi-check/lib/score.js (what the CLI wraps, not the CLI
// itself — no apps/qi-check/lib/cli.js exists); row 28 cites
// ops/PASS_QUEUE.md (what the linter checks, not the linter — no
// ops/tools/lint-pass-queue.mjs exists).
const KNOWN_DEPENDENCY_CITATIONS = new Set([26, 28]);

function looksLikeRepoPath(span) {
  // Strip a trailing "; comment" some cells append after the path.
  const candidate = span.split(";")[0].trim();
  if (!candidate) return null;
  const hasSlash = candidate.includes("/");
  const hasKnownExt = /\.(html|js|mjs|py|md|csv|svg|xml|json)$/i.test(candidate);
  if (!hasSlash && !hasKnownExt) return null;
  // Exclude bare shell invocations like `node cli.js` (no path separator
  // before the filename) only when there's a leading command word.
  const bareCommand = /^(node|npm|python|pip|cd)\s+\S+$/i.test(candidate);
  if (bareCommand && !hasSlash) return null;
  return candidate.replace(/\s+.*/g, ""); // drop trailing prose in the same span
}

export function checkFiftyLoops(markdown) {
  const lines = markdown.split(/\r?\n/);
  const results = [];
  for (const line of lines) {
    const m = line.match(/^\|\s*(\d+)\s*\|/);
    if (!m) continue;
    const row = Number(m[1]);
    const cells = line.split("|").map((c) => c.trim());
    // cells[0] is empty (leading |), [1]=#, [2]=Name, [3]=Motion, [4]=$0 path, [5]=Status
    const status = cells[5] || "";
    const textForPaths = cells.slice(3, 5).join(" | ");
    const spans = [...textForPaths.matchAll(PATH_LIKE)].map((mm) => mm[1]);
    const paths = spans.map(looksLikeRepoPath).filter(Boolean);
    const existing = paths.filter((p) => existsSync(REPO_ROOT + p.replace(/\/$/, "")));
    results.push({ row, status, paths, existing, anyExists: existing.length > 0 });
  }
  return results;
}

function main(argv) {
  const target = argv[0] || "ops/FIFTY_LOOPS.md";
  const markdown = readFileSync(target, "utf8");
  const results = checkFiftyLoops(markdown);

  const mismatches = results.filter((r) => {
    if (r.paths.length === 0) return false; // nothing citeable to check
    if (KNOWN_DEPENDENCY_CITATIONS.has(r.row)) return false;
    if (r.status === "SHIPPED") return !r.anyExists;
    if (r.status === "NEXT") return r.anyExists;
    return false; // BLOCKED-* rows are owner-gated, not file-existence-gated
  });

  const shippedCount = results.filter((r) => r.status === "SHIPPED").length;
  const actualShippedCount = results.filter((r) => r.anyExists).length;

  console.log(
    `check-fifty-loops: ${results.length} rows, board says ${shippedCount} SHIPPED, ` +
      `${actualShippedCount} rows have at least one cited path on disk.`
  );

  if (mismatches.length === 0) {
    console.log("check-fifty-loops: board matches disk.");
    return 0;
  }
  console.error(`check-fifty-loops: ${mismatches.length} row(s) disagree with disk\n`);
  for (const r of mismatches) {
    const dir = r.status === "SHIPPED" ? "marked SHIPPED but no cited path exists" : "marked NEXT but a cited path already exists";
    console.error(`  row ${r.row}: ${dir} — ${r.paths.join(", ")}`);
  }
  return 1;
}

if (process.argv[1] && fileURLToPath(import.meta.url) === process.argv[1]) {
  process.exit(main(process.argv.slice(2)));
}
