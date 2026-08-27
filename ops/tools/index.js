// Directory entry shim so `node --test ops/tools/` works on Node builds
// (e.g. v22.22.2 here) that treat a directory argument as a single test
// entry module instead of searching it for *.test.* files. The runner
// resolves the directory to this index.js, which loads the real test file;
// test failures still propagate to a nonzero exit code.
import("./tools.test.mjs");
