# vendor/

## `three.module.js`

three.js r170, ES module build, **minified**. MIT — see `THREE-LICENSE.txt`.

Only `table.html` loads it, and only on the path where the scene will actually
run (see `table-boot.js`). Nothing else in this sample depends on it.

### Why it is minified here

| | raw | over the wire (gzip) |
|---|---|---|
| upstream ES module build | 1,283.9 KB | 258.8 KB |
| **as vendored now** | **672.4 KB** | **171.6 KB** |

That is 34% off the transfer for a file that is fetched on every desktop visit
to `table.html`. Vercel serves brotli, so the real figure is lower again.

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
