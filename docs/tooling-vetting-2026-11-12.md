# Tooling vetting: craft-anything, astryx (2026-11-12)

Two repos pasted, vetted against fresh metadata, file trees and the live project.
Verdicts first, evidence under each.

## Verdicts

| Repo | Verdict | Why |
|---|---|---|
| storytold/craft-anything | reference only | Rust desktop/CLI reverse-engineering engine. No runtime boundary into the TS/React site. Early alpha (12 days old), and the CLI ships for macOS only. |
| meta/astryx | adopted as a tool, not into the Chick site | MIT React 19 design system, 174 components, CLI installed and verified. The Chick site is bespoke CSS; astryx fits new surfaces (dashboards, future client sites), not a retrofit. |

## storytold/craft-anything

Fresh metadata: 29,641 stars, 6,022 forks, created 2026-10-31, pushed 2026-11-12,
Rust, Apache-2.0 (README says MIT OR Apache-2.0), 1,195 files, status "early alpha".

What it is: a pure-Rust reverse-engineering engine (320 tools: native, .NET, Java,
Android, Apple, Electron/JS, websites, firmware, packet captures, databases, game
files) with its own decoders, disassembler and decompiler. It powers an egui desktop
app, a CLI and an MCP server; parts run as WebAssembly. `crates/engines/src/cdp.rs`
is the browser-inspection path.

Runtime boundary: Rust. It cannot ship into the Vite/React site or the serverless
availability endpoint. The only honest fits are dev-time oracle and MCP tool.

Why not adopted now:
- Windows release assets are GUI only (portable zip, msi). The CLI zip is
  `craft-anything-cli-0.6.1-macos-universal.zip`; there is no Windows CLI build, so
  the MCP path would need a cargo build from source.
- 12 days old, early alpha, 6k forks in under two weeks. Not a dependency to put on
  a client money path.

Revisit when: a Windows CLI ships, or a clone/rebuild job justifies building from
source. The integration point is `craft-anything-cli mcp` as a Hermes MCP server,
which would feed the clone-website and prospect-site-rebuild workflows.

Checked the cheap path so it is not a guess: the 2 MB web build
(`craft-anything-web-0.6.1.zip`, 8.7 MB unpacked, 6.1 MB wasm) is a file viewer
only. Its own HOSTING.md: "a dropped or picked file is read in the browser and never
uploaded. It uses the built-in, pure-Rust analyzers only (formats, disassembly,
JavaScript bundles); running programs, external engines and AI backends need the
desktop app." So it cannot study a live website, which is the whole point here.

The three real paths on this machine, with their costs:
- Windows portable GUI, 66 MB: can inspect websites, but GUI-only, so Hermes cannot
  drive it headlessly, and it holds RAM while open.
- CLI/MCP: `apps/craft-anything-cli`, workspace `rust-version = "1.97"`, edition
  2024. No cargo on this box, so it needs a rustup install plus a from-source build
  of a 320-tool engine. That is the only agent-driven path.
- Skip: the existing stack (clone-website skill, Firecrawl, browser harness) already
  covers site study and rebuild.

## meta/astryx

Fresh metadata: 26,264 stars, 2,035 forks, created 2026-01-09, pushed 2026-11-12,
TypeScript, MIT, 12,388 files, beta.

What it is: Meta's open-source design system, React 19 + StyleX, 150+ (174 listed)
accessible components, theming via CSS custom properties, dark mode, templates, and
a CLI built so people and agents read the same reference. No build plugin required;
consumers import pre-built CSS and typed components.

Runtime boundary: TypeScript/React, and the site runs React 19.1.0, so the peer
requirement is met. It could ship into the site.

Why not into the Chick site: the site's design is bespoke (oryzo/story CSS, custom
type scale, hand-built scenes). Swapping in a component library would fight that
design and re-open every audited surface. astryx is a fit for new surfaces, not a
retrofit.

Adopted for real: `npm i -g @astryxdesign/cli` (0.7.14), verified:
- `astryx --version` -> 0.7.14, Core 0.7.14
- `astryx component --list` -> 174 components
- `astryx component Button` -> full anatomy and best-practice doc

Note: npm blocked the package's postinstall script under the allowScripts policy.
The CLI still works; it installs its release into a per-user cache on first use.

## astryx vs OpenDesign: they are not substitutes

The RAM worry does not apply to astryx. Measured on this machine:

| | Disk | Idle RAM |
|---|---|---|
| astryx (global npm) | 85 MB | 0 (library + one-shot CLI, no daemon) |
| OpenDesign checkout | 138 MB | 0 while stopped; RAM only when its daemon/Electron app runs |

OpenDesign is a design app with a daemon on 127.0.0.1:7456 and 22 MCP tools; astryx
is a component library plus a docs CLI. Removing OpenDesign frees 138 MB of disk,
not RAM. If RAM is the constraint, the lever is not starting the daemon, not
uninstalling the checkout.

OpenDesign state today: daemon not running (nothing on 7456), MCP server configured
in Hermes but `enabled: false`. Starting to use it is one enable plus a daemon start,
and the bridge skill already documents the wiring.
