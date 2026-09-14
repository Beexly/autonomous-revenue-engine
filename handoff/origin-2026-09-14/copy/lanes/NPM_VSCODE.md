# qi-check listing copy

**STATUS: HYPOTHETICAL DRAFT ONLY. DO NOT PUBLISH.**

This file is listing copy for review. It is **not** live. Do not paste it as if a registry page exists.

## Not a live listing

- **qi-check is NOT on npm.** Confirmed 2026-08-25: GET `https://registry.npmjs.org/qi-check` returned `error: Not found`.
- **qi-check is NOT on the Visual Studio Marketplace.** Search of `https://marketplace.visualstudio.com/` for qi-check did not return this product.
- Unrelated Marketplace hits (cpp-check-lint, SQLCheck, iccheck, qiuer-station) are other extensions.
- Do not create a registry account, a Marketplace publisher, or a package from this copy.
- Do not invent download counts, stars, ratings, or trending claims. None exist for this listing.

Working product (not a registry listing):

- Live static scorer: https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/qi-check.html
- Repo: https://github.com/Beexly/autonomous-revenue-engine (`apps/qi-check` -- Next app + `lib/score.js`; also a static in-page HTML scorer)

## DO NOT PUBLISH

This draft is not a ship runbook. Do not run registry or Marketplace ship commands. Do not log in to a publisher. Do not create an account. Do not upload a VSIX or tarball.

Official npm docs note that `"private": true` makes the CLI refuse to ship. That is a local safety latch, not permission to ship later.

## Verified marketplace / docs URLs (what was fetched)

Recorded 2026-08-25, morning CT. Public docs and homepages only. No login. No ship.

### npm registry and docs

| URL | What was seen |
| --- | --- |
| `https://www.npmjs.com/` | WebFetch timed out. curl: HTTP 200, title `npm Home`. Public registry homepage. |
| `https://docs.npmjs.com/cli/v11/configuring-npm/package-json` | Official package.json spec. **description**: string, listed in search. **keywords**: array of strings, listed in search. **repository**: object with type and url (full object preferred; monorepo may set directory). README always included in the tarball. Name <=214 chars, no uppercase for new packages. |
| `https://docs.npmjs.com/creating-a-package-json-file` | Packages on the registry must contain package.json. Required **name** + **version**. Recommends a custom **description** for the website listing. |
| `https://docs.npmjs.com/about-package-readme-files` | README.md in the package root is rendered on the package page as GitHub Flavored Markdown. Updates only when a new version is shipped -- not a reason to ship this draft. |
| `https://docs.npmjs.com/creating-and-publishing-unscoped-public-packages` | Unscoped names are package-name. Public page would be `https://www.npmjs.com/package/<name>`. Not followed. No account. No ship. |
| `https://registry.npmjs.org/qi-check` | Returned `error: Not found` -- name is unpublished. Not a reservation. |

### Visual Studio Marketplace / VS Code

| URL | What was seen |
| --- | --- |
| `https://marketplace.visualstudio.com/` | Title: Extensions for Visual Studio family of products / Visual Studio Marketplace. Sign-in present. No qi-check listing on this homepage. |
| `https://marketplace.visualstudio.com/search?term=qi-check&target=VSCode&category=All%20categories&sortBy=Relevance` | Title: Search results - qi-check. No listing for this product. |
| `https://code.visualstudio.com/api/references/extension-manifest` | Official extension package.json fields. **displayName** (string, unique on Marketplace). **description** (short what-it-does). **categories** (string array; allowed: Programming Languages, Snippets, Linters, Themes, Debuggers, Formatters, Keymaps, SCM Providers, Other, Extension Packs, Language Packs, Data Science, Machine Learning, Visualization, Notebooks, Education, Testing). **repository** type/url shown under Marketplace Resources. **keywords** capped at 30. README.md becomes the Marketplace details body. |
| `https://code.visualstudio.com/api/working-with-extensions/publishing-extension` | Packaging/ship docs. Read for listing-field context only. Do not run ship tooling. |

## Product facts used in this copy (do not inflate)

- Deterministic first-screen scorer (no model in the scoring path).
- Hold floor **9.2** (locked in `apps/qi-check/lib/score.js`; in-page HTML inlines the same scorer, version 0.2.0).
- Soft floor 7.0. Empty input -> Hard rewrite. Composite under 9.2 cannot Hold.
- Scores first-screen density (~160 chars), fold structure, bait-pattern avoidance, length fitness, sentence-length burstiness.
- **Does not write the post.**
- **Does not publish.**
- **No Stripe in scoring.**
- **No AI-detection bypass claim.**
- Surfaces: Next app + `lib/score.js`; static in-page HTML scorer (no server required).
- Live page lede (fetched): Paste your draft. This scores first-screen density, bait, and Hold fitness. It does not write the post. It does not publish. Scoring runs in this page -- no server required.

Publisher / npm user / Marketplace publisher IDs below are **placeholders**. None were created.

## Draft: npm package.json listing fields

Hypothetical only. Not a published package. Do not ship.

```json
{
  "name": "qi-check",
  "version": "0.2.0",
  "private": true,
  "description": "Deterministic first-screen scorer. Hold floor 9.2. Does not write the post. Does not publish.",
  "keywords": [
    "qi-check",
    "first-screen",
    "draft-scorer",
    "hold-floor",
    "deterministic",
    "viewport-hold"
  ],
  "repository": {
    "type": "git",
    "url": "git+https://github.com/Beexly/autonomous-revenue-engine.git",
    "directory": "apps/qi-check"
  },
  "homepage": "https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/qi-check.html",
  "bugs": { "url": "https://github.com/Beexly/autonomous-revenue-engine/issues" }
}
```

`"private": true` is intentional in this draft so the CLI would refuse a mistaken ship. A public listing would omit it -- that omission is not authorized here.

### npm search / listing one-liner

> Deterministic first-screen scorer. Hold floor 9.2. Does not write the post. Does not publish.

### README blurb (would render on the package page; not live)

**qi-check is not published to npm.** This paragraph is draft README copy only.

qi-check scores a pasted draft for first-screen density, bait, and Hold fitness. The Hold floor is 9.2 in `lib/score.js`. It does not rewrite the post, does not publish, and does not put Stripe on the scoring path. Scoring is deterministic. No AI-detection bypass is claimed.

Try the static in-page scorer (no install): https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/qi-check.html

Source: https://github.com/Beexly/autonomous-revenue-engine (`apps/qi-check`).

## Draft: VS Code package.json listing / contribution fields

Hypothetical only. Not an extension on the Marketplace. Do not log in or ship. `publisher` is a placeholder, not a created publisher.

```json
{
  "name": "qi-check",
  "displayName": "qi-check",
  "description": "Deterministic first-screen scorer. Hold floor 9.2. Does not write the post. Does not publish.",
  "version": "0.2.0",
  "publisher": "DO-NOT-PUBLISH",
  "categories": ["Other"],
  "keywords": ["qi-check", "first-screen", "draft-scorer", "hold-floor", "deterministic"],
  "repository": {
    "type": "git",
    "url": "https://github.com/Beexly/autonomous-revenue-engine.git"
  },
  "homepage": "https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/qi-check.html",
  "bugs": { "url": "https://github.com/Beexly/autonomous-revenue-engine/issues" },
  "pricing": "Free",
  "qna": false,
  "contributes": {
    "commands": [
      { "command": "qi-check.scoreSelection", "title": "qi-check: Score selection" },
      { "command": "qi-check.scoreOpenEditor", "title": "qi-check: Score open editor" }
    ]
  }
}
```

`categories: ["Other"]` matches the official allow-list. This is not a language linter, theme, or formatter. Commands are a sketch of what a future extension might contribute; they are not shipped and must not be advertised as installable.

### Short Marketplace description (listing-page text)

> Deterministic first-screen scorer. Paste a draft; get Hold / Soft rewrite / Hard rewrite against a 9.2 Hold floor. Does not write the post. Does not publish. No Stripe in scoring. No AI-detection bypass claim.

### Marketplace details body (would come from README.md; not live)

**This extension is not on the Visual Studio Marketplace.** Do not treat the text below as a live listing.

qi-check scores first-screen density, bait, and Hold fitness. The scorer lives in `apps/qi-check/lib/score.js` (Next app) and is also inlined in a static HTML page so scoring can run with no server.

- Hold floor: 9.2. Under that, Hold is not available.
- Does not write the post.
- Does not publish.
- No Stripe in the scoring path.
- Deterministic: no model in scoring. No AI-detection bypass claim.

Static page: https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/qi-check.html
Repo: https://github.com/Beexly/autonomous-revenue-engine

## Swap-test (not part of any listing)

Holds only as a **scoring gate that will not write**. Swap this copy onto a writer, humanizer, undetectable detector, growth tool, or generic linter and it dies: Hold floor 9.2, does-not-write, does-not-publish, no Stripe in scoring, deterministic first-screen, and the static in-page HTML scorer are the facts that would fail to transfer. Interchangeability is the kill.

## Recheck before anyone even considers a real listing

1. This file still says **DO NOT PUBLISH**.
2. The npm registry still has no qi-check package (or the name is taken by someone else -- then stop).
3. Marketplace still has no qi-check extension.
4. Copy still does not claim downloads, stars, or bypass.
5. Copy still does not say the scorer writes or publishes.

Until those stay true, this remains a draft in `origin-drafts/lanes/`. Nothing is posted. Nothing is published.

Named commands that must not be run from this draft: `npm publish`, `npm stage publish`, Marketplace login, Marketplace ship CLI, `npx` ship wrappers. Do not create an npm account.
