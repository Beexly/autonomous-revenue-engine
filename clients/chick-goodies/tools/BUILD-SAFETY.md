# Sample build safety

## Canonical sources: direct edits, no build step

The three independent static sites are maintained directly in:

- `samples/sample-1-editorial/` — Garden
- `samples/sample-2-after-dark/` — Midnight Supper
- `samples/sample-3-studio/` — Gathering / Studio

Their checked-in HTML, CSS and JavaScript are canonical, not disposable generated
output. Old templates and one-time migrations do not contain all subsequent copy,
accessibility, SEO, layout and interaction fixes. Replaying them can silently undo
those fixes. Do not regenerate a sample before testing or publishing it.

The separate showcase `site/` is not a fourth sample and is outside this workflow.
Do not mirror sample files into it. This safety change does not publish anything.

## Retired entrypoints

All paths below are relative to `clients/chick-goodies/`. Each script now raises
`SystemExit` unconditionally before ordinary imports or legacy code. CLI use exits
with status **1** and a `LEGACY BUILD DISABLED` diagnostic; importing the module
also raises `SystemExit`. There is no force flag or environment-variable bypass.
The original code remains below the guard for historical reference, not reuse.

| Script | Historical overwrite or preparation risk |
| --- | --- |
| `tools/build-gathering.py` | Recreates sample-3 pages from stale templates. |
| `tools/build-studio.py` | Replaces sample-3 index, plate SVG and data; also mirrors files into the separate showcase. |
| `samples/sample-1-editorial/build_garden.py` | Recreates Garden's five HTML pages. |
| `samples/sample-2-after-dark/build_midnight.py` | Recreates Midnight's five HTML pages. |
| `samples/sample-3-studio/apply_content.py` | Rewrites every sample-3 HTML file with a one-time BeautifulSoup migration. |
| `samples/sample-3-studio/content_blocks.py` | Replays stale copy/layout migration and appends duplicate content blocks. |
| `tools/prepare-gathering.py` | Replaces sample-3 logo assets and vendored JavaScript, including a network download. |
| `tools/prepare-three.py` | Replaces shared/sample brand assets and facts derived from old page selectors. |
| `tools/prep_assets.py` | Old absolute-path asset export and recursive HTML/token rewrite under `C:/Users/Garrett/chick-site`; not a sample build prerequisite. |
| `tools/enhance-hero.py` | One-off fixed-path image preparation replaces the sample-3 derived hero asset. |

Asset-only preparation is retired too: it is not required to preview the static
sites and must not silently replace reviewed assets or facts during a rebuild.
These guards do not change any assets, facts, HTML, CSS or JavaScript.

This is an explicit list of historical writers, **not a blanket ban on Python**.
Maintained content tests, browser QA, layout checks, image audits, research and
live-parity checks remain unchanged. Some QA scripts write reports/screenshots or
access the network; inspect their documented scope and prerequisites before use.
Report output alone does not make a QA script a legacy source generator.

## Safe edit and review workflow

1. Review the working-tree diff first, particularly when another editor is active.
   Choose the relevant sample explicitly; do not bulk-copy between the concepts.
2. Edit the intended sample HTML/CSS/JS directly. Keep shared page elements aligned
   within that sample, and preserve verified content, contact targets, metadata
   and accessibility behavior. Do not use old builders as sources of current facts.
3. Preview the sample as static files. For example, from the repository root:

   ```bash
   python -m http.server 8000 --bind 127.0.0.1 --directory clients/chick-goodies/samples
   ```

   Open the chosen sample directory on localhost. No asset preparation, migration,
   bundler or build command is required.
4. Run the fail-closed regression from the repository root:

   ```bash
   python -B clients/chick-goodies/tools/test_build_safety.py -v
   ```

   Run applicable existing content/browser checks separately, with their existing
   dependencies and local-server requirements. The safety regression itself needs
   only Python's standard library and does not run browser or deployment tooling.
5. Review all changed paths and diffs. QA output is evidence, not permission to
   replace canonical sources. Keep `FACTS.md`, `STATE.md`, `ASSETS.md`, assets and
   showcase files outside unrelated edits. Publishing requires a separate,
   explicitly authorized workflow; never publish as part of a build-safety test.

## Regression design and guard maintenance

`test_build_safety.py` first parses each writer without executing it. It requires
an exact unconditional `raise SystemExit(...)` before any ordinary import or other
executable statement. A module docstring and `from __future__` imports may precede
the guard; compilation checks that future imports remain legally placed. Preserve
shebangs and encoding declarations when editing a guard.

**If a guard is missing or moved, the test fails without running that writer.**
This is important because even an isolated working directory does not neutralize
legacy absolute paths or network calls. Never demonstrate RED by executing an
unguarded legacy script.

Only sources that pass that static preflight are copied into a temporary fixture.
The test executes and imports each guarded source in subprocesses from both the
client root and script directory. `-B` disables import bytecode writes; `-S` removes
site-package dependencies. Canary destinations cover the three samples, shared
assets and the former showcase mirror. Each invocation must return exactly status
1, emit the intended diagnostic with no stdout, and leave the fixture's complete
file/directory inventory, file contents and modification times unchanged.
The fixture contains synthetic canaries, never copies or edits of canonical sites.

Ordinary Python imports without `-B` can create interpreter-managed `__pycache__`
files; the protection concerns the legacy body and canonical content, not Python's
own cache policy. Use `-B` for no-cache regression runs.

When adding another historical writer, add it to the explicit regression inventory
and this table. Write/observe the safe static failure first, then add the early
unconditional guard and run the subprocess regression. Do not restore a builder
by deleting the guard. Any future generator needs a separately reviewed design,
explicit output isolation and preservation tests before it can replace direct edits.
