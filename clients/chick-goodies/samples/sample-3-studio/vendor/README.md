# vendor/

## `three.module.js`

three.js r170, ES module build, **as published upstream** — see "Why it is not
minified yet" below. MIT, licence in `THREE-LICENSE.txt`.

Only `table.html` loads it, and only on the path where the scene will actually
run (see `table-boot.js`). Nothing else in this sample depends on it.

### Why it is not minified yet

| | raw | over the wire (gzip) |
|---|---|---|
| **as vendored now** | **1,283.9 KB** | **258.8 KB** |
| minified (measured, reverted) | 672.4 KB | 171.6 KB |

Minifying takes 34% off a file fetched on every desktop visit to `table.html`,
and it was done, verified and then **reverted**.

SonarCloud failed the pull request with "C Security Rating on New Code". The
cause is mechanical: minifying rewrites all 58,190 lines, so an upstream
library counts *in full* as new code and its findings land against the change.
The companion PR, which touched none of this, passed.

`.sonarcloud.properties` at the repository root excludes `**/vendor/**`, which
is the right fix — a third-party library is not ours to fix, and analysing it
as if it were buries real findings. But this project has no
`.github/workflows`, so SonarCloud is running **Automatic Analysis**, and that
reads its configuration from the **default branch**. The exclusion therefore
cannot take effect from a feature branch.

**Re-apply the minification once `.sonarcloud.properties` has landed on
`main`.** The command is below and the result was verified: the scene lights,
draws and throws no page errors.

Bundling `table-cinematic.js` with tree-shaking measured better still — 123.6 KB
gzip, 52% off — and was **not** taken. It couples the vendored artifact to the
application code, so every edit to `table-cinematic.js` would require re-running
a bundler before the page worked. That is a build step, and this project does
not have one. Minifying a library in place keeps the artifact independent.

### Reproducing it

This is a one-time asset preparation, not a build step: the committed file is
already the artifact the browser loads. To regenerate from upstream:

```sh
# fetch three.js r170's build/three.module.js, then:
npx esbuild three.module.js \
  --minify --format=esm --target=es2020 \
  --banner:js='/*! three.js r170 (MIT) — minified with esbuild --minify --format=esm --target=es2020. Source: https://github.com/mrdoob/three.js. Licence: vendor/THREE-LICENSE.txt */' \
  --outfile=three.module.js
```

Verified after minification: the scene lights, draws, and throws no page errors.

### Measured on a throttled connection

Chrome DevTools "Slow 4G" (1.6 Mbit down, 150 ms RTT), gzip on:

| | headline on screen | scene lit | three.js transferred |
|---|---|---|---|
| 390, phone | **724 ms** | never — the still is the hero | **0 KB** |
| 1440, desktop | **835 ms** | 6,532 ms | 172.2 KB |

The headline is on screen roughly eight seconds before the scene on desktop,
and the phone never pays for the renderer at all.
