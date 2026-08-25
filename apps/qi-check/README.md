# qi-check

**Viewport Hold / Qualified Impression Checker**

Paste YOUR draft → scores first-screen density, bait, Hold fitness. Does not write the post. Does not publish.

Free-core, human-primary: you paste your own draft. No account, no Stripe, no API keys required for the free core.

## Run it (3 commands)

```
git clone https://github.com/Beexly/autonomous-revenue-engine.git
cd autonomous-revenue-engine/apps/qi-check
npm install && npm run dev
```

Then open http://localhost:3000 , paste a draft, hit **Score**.

Requires Node 18+.

## What it does

Next.js 15 app (`dev`, `build`, `start`, `test`). The UI in `app/page.js` POSTs your text to `/api/score`. Scoring lives in `lib/score.js`:

- **Hold floor = 9.2**
- **Soft floor = 7.0**
- Recommendation: **Hold** / **Soft rewrite** / **Hard rewrite** plus a fix list

Never publish below Hold. 9.2 is the floor.

## Tests

```
npm test
```

Runs `node --test lib/score.test.js`.
