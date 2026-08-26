import { readdirSync, statSync } from "node:fs";
import { join } from "node:path";

/** Recursively list every .html file under a file-or-directory path. */
export function htmlFilesUnder(target) {
  const st = statSync(target);
  if (st.isFile()) return target.endsWith(".html") ? [target] : [];
  return readdirSync(target, { withFileTypes: true }).flatMap((e) =>
    htmlFilesUnder(join(target, e.name))
  );
}
