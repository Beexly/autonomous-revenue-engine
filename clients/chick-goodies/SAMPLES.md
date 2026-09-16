# SAMPLES — three art directions (revised 2026-09-16)

Three complete builds of the same facts (`FACTS.md`) and the same photos. No
fourth sample. The first pass was a template with a coat of paint — three-up
quotes, monument 35/90/50/150, price-list menus, 480px photos stretched into
stamp grids. This pass treats **every published menu item as a look** (49 of
them) and walks them on a 3D snap-scroll runway.

## Live

1. **Warm editorial (cream, Fraunces)** — https://charcuterie-chick-sample-1.vercel.app
   Split-screen hero, collection as a horizontal lookbook, reviews as a
   vertical reading list (not three cards).
2. **After dark (near-black, Cormorant Garamond)** — https://charcuterie-chick-sample-2.vercel.app
   Full-viewport film still, then the show. Brass accent only on the italic
   word and the look numbers.
3. **Studio (white, Archivo, sticky rail)** — https://charcuterie-chick-sample-3.vercel.app
   Folio: left rail, one giant catering photo, then the same 49 looks with
   pointer-tilt.

Shared engine: `samples/shared/looks.js` (49 looks) + `runway.js` (CSS 3D
pointer-tilt, snap-scroll, house filters). Copied into each sample so each
Vercel project stays self-contained.

## What changed vs the first pass

- Menu is no longer a price list. It is a collection of 49 looks: 5 tables, 6
  carts, 4 sweets, 2 sips, 11 sliders, 11 dips, 6 salads, 4 meats.
- Each look sits on a 3D stage. Pointer moves the figure. Horizontal snap
  scroll. House filters (Tables / Carts / Sweets / Sips / Sliders / Dips /
  Salads / Meats).
- Photos stay native; they are not stretched into 400px-tall stamps. Ken Burns
  is a slow scale, not a zoom punch.
- Monument stats, three equal quote cards, and the gold "luxury" palette are
  gone.
- Real photos only. The four Grok Imagine hashes in `ASSETS.md` remain banned.

## Do not blend

If the client picks one, keep that sample's type, palette, and layout. Do not
average the three. You may steal a mechanic (the runway) — not a colour.

## Photography ceiling

Public photos still max out at 480×640 (see `ASSETS.md`). The runway hides
that better than a grid, but it does not replace a shoot.
