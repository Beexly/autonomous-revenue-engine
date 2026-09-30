# Kit cinematic sales page — queued, not live

**Branch:** `grok/kit-cinematic-2026-09-14`  
**Do not merge to `main` until Garrett says "ship this."**  
`docs/kit/` on this branch is untouched. Production is unchanged.

## What this is

Cinematic rebuild of the $350 Kit sales page (Unseen-bar: workshop lighting,
3D dust, scroll-tall sample films, live phone mockups). Offer is the live
one: $350 one-pager / $900 site / workflows from $500. CTA is DM “KIT” to
[@gbeexly](https://ig.me/m/gbeexly). Sample businesses are fictional.

## What's here

React/TanStack source as built in the Grok App Builder preview — not a drop-in
for this repo's static `docs/` Vercel output. To go live Motif must either:

1. Port the design into `docs/kit/index.html` (static, matches current deploy), or
2. Deploy this as its own app and point bios/flyers at that URL.

## Approval to ship

Garrett: **"ship this"** — then Motif lands it over the live Kit page.
Until then this branch is a queue only.
