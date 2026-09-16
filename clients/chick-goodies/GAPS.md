# GAPS — what was missed (2026-09-16 audit)

A pass over the conversation, the live Shopify, GitHub `main`, and the three
sample URLs. Only items with evidence. Fix in this commit is marked **done**.

## Blocked, not guessed

- Gemini key the owner pasted is valid (`models` list returned 200) but
  **prepayment credits are depleted** (429 RESOURCE_EXHAUSTED). ModLens cannot
  read `IMG_7724.jpeg` or `The Chick Goodies.jpg`. Those files stay unread.
- Do not write that key to disk.

## Missed facts (the scrape lied)

- **Email is on the contact page:** `charcuteriechick@outlook.com`. We filed it
  as "redacted / unknown" and shipped SMS-only forms. **Done this commit:**
  FACTS.md + mailto on the three samples.
- About page still ships template stats: "532+ Popular Testy Foods",
  "6534+ Global Customers", **"25+ Years Of Experience"** against her own
  copy of 35 years. We caught this in AUDIT.md and then never put a
  "do not reprint 25+" rule in the samples. Samples already omit the fake
  stats — keep it that way.
- Product URLs we never recorded: `/products/pre-determined-charc-boards`,
  `/products/confection-chicks` (Apple Pie also listed as `/products/apple-pie`).
- Taco Cart, Cakes and Shakes, Zeppole images on her Shopify are stock
  (Shutterstock-style filenames). Do not reuse those. Our samples use her
  `IMG_*` event photos only.

## Repo rot

- `clients/chick-goodies/site/index.html` (45,718 bytes) is the **first cheap
  build**. The three samples (12–13k + looks.js) are the current ones.
  Showcase URL still serves the old file: https://charcuterie-chick-showcase.vercel.app
  **Done this commit:** point `site/` at sample-1, redeploy showcase from sample-1.
- GitHub `samples/sample-*/` had **no `img/`** (raw.githubusercontent 404).
  Live Vercel copies had images from the local deploy folder only. Agents
  cloning the repo would see broken pictures. **Done this commit:** copy
  `site/img/` into each sample.
- PR **#48** (Copilot, draft) is SQL + n8n markdown. It is not a site. Do not
  merge it as the rebuild.
- PR **#45** (Kit cinematic, draft) is a different product. Do not steal it
  onto this client.

## Under-leveraged (still true)

- Photography ceiling 480×640. Fashion-model brief cannot be fulfilled with
  CDN derivatives. Need camera-roll originals.
- Quote is $150 / $600. LOCAL_PITCH.md in ops still says $350. Two prices in
  one repo — client file wins for this job.
- Three.js / GSAP / Lenis were queued and not used (vanilla CSS 3D). Correct
  for $0 and speed; add WebGL only on the winner.
- Webstudio / Screenshot-to-code / Flat-UI: see DESIGN_REFS.md. Only
  Monkeytype craft was applied.

## Do next, in order

1. Client picks sample 1 (cream), 2 (after dark), or 3 (studio). Overnight pass
   made them three compositions, not colour swaps.
2. Confirm Outlook as the public address before the $600 goes live.
3. Replace 480px photos with originals.
4. Owner tops up Gemini → OCR `IMG_7724.jpeg` (still unread).
5. Leave PR #48 draft until she is live and paying.
