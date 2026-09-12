# record-tour — autonomous demo-video recorder

Scripted browser tours recorded to `.webm` with Playwright. No human hands, no paid services.

## Install

```bash
cd tools/record-tour
npm install playwright
npx playwright install chromium
```

If your box has no display, wrap the run in `xvfb-run`:

```bash
xvfb-run -a node record-tour.js signpreview
```

## Run a tour

```bash
node record-tour.js signpreview
node record-tour.js kit
```

Outputs go to `out/` as `signpreview.webm` and `kit.webm`.

## Add a tour (config only)

Edit `tour.config.json` and append a new object:

```json
{
  "name": "my-tour",
  "url": "https://example.com",
  "viewport": { "width": 1280, "height": 720 },
  "durationSec": 15,
  "steps": [
    { "type": "fill", "selector": "input[name='business']", "text": "My Biz" },
    { "type": "click", "selector": "button", "text": "Generate" }
  ]
}
```

Supported step types: `fill`, `click`, `scrollTo`, `wait`.

## Output

- `.webm` files in `out/`
- Optional polish: feed to Recordly for cinematic b-roll and captions
- Optional captions: `whisper` on the `.webm` (open-source, free)

## Sources

- Playwright: https://playwright.dev/
- B-roll sources: see `broll/SOURCES.md`
- Recordly: https://github.com/autonomous-revenue-engine/Recordly
