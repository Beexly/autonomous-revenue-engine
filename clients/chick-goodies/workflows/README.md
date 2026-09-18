# Workflows — the leave-behind

`index.html` is the page Garrett presents when the conversation turns to the
$500 workflow package. It is **not** part of Tricia's website:

- `noindex,nofollow`, not in any sitemap, not linked from any sample.
- It carries pricing and pitch content, which `HANDOFF.md` forbids on her pages.
  That rule is why this lives in its own directory.

## What it argues

The gap named in `WORKFLOWS.md`: nothing asks for a Google review, and nothing
tracks whether an enquiry was ever answered. Three workflows close it —
enquiry tracking with one nudge, the thank-you and review ask, the day-thirty
return.

## Rules it follows

- The only hard-coded business figure is `$2,350`, her published average couple
  spend on The Knot (`FACTS.md`). It is the one number in `--fact` blue.
- Review counts (13 on The Knot, 11 on WeddingWire, both 5.0) come from
  `FACTS.md`.
- Everything else is a slider. No conversion rate, response rate or event
  volume is asserted as fact — the viewer sets them and the arithmetic follows,
  and the page says so in its own copy.
- Prices are $150 / $600 / $500 only, per `QUOTE.md`.

## Deploy

Static, no dependencies. Deploy from this directory, or open the file directly.
Keep `noindex` on it wherever it goes.
