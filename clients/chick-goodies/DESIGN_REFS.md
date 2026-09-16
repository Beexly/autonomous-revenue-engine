# DESIGN REFS — four repos the owner pasted 2026-09-16

These are not a shopping list. Each one is either a craft rule for the three
samples, a later tool, or a trap.

## monkeytype — https://github.com/monkeytypegame/monkeytype

**Use this.** Minimal typing site. One background, one text colour, one
accent (the caret yellow). No cards, no shadows, no gradients, no hero
collage. The thing you came for (the words) is huge and centred; everything
else recedes.

Steal for Charcuterie Chick:
- One accent. If a second colour appears, it is a bug.
- Sub-copy sits at ~40% opacity, never a second paint.
- No box-shadow. Elevation comes from empty space.
- The look name is the product, the way the word list is the product.
- Chrome (nav, filters, buttons) is small and quiet.

Do **not** copy the Roboto Mono / #323437 / yellow-caret skin onto a
catering site. That would be a theme, which is the opposite of the lesson.

## Screenshot-to-code — https://github.com/emilwallner/Screenshot-to-code

**Do not run this on the job.** 2018 pix2code research: a neural net that
emits 16 Bootstrap tokens from a screenshot. 97% on its own toy dataset.
It cannot rebuild Tricia's site from a mock, it cannot invent 3D food, and
training it is GPU theatre.

The useful idea, without the model: **start from a picture of a real table,
not from a component library.** We already do that (her event photos). If
someone later wants screenshot→HTML, use a current vision model against a
**photo of a site we like**, not this repo.

## Flat-UI — https://github.com/designmodo/Flat-UI

**Do not import.** 2013 Bootstrap skin: candy buttons, rounded wells, glyph
icons. That *is* the cheap look the client already has on Shopify. Using it
would be a regression.

Steal one idea only: colour as a flat field, not a gradient. We already do
that. Leave the rest in 2013.

## Webstudio — https://github.com/webstudio-is/webstudio

**Later, not this quote.** Open-source visual builder, Webflow-shaped, CSS
complete, host anywhere. Useful if Tricia wants to edit copy without us.
Wrong for a $150 / $600 static one-pager: it adds an editor, a runtime, and
a CMS decision we have not been paid to make.

If the $600 full site needs a CMS, shortlist Webstudio against the existing
$0 stack (static HTML on Vercel). Do not start that until she picks a
sample.

## Applied to the three samples

After this file landed: Ken Burns and the fake 3D plinth came off the
runway (they were the remaining "AI motion" tell). Look names got bigger;
chrome got smaller. Monkeytype rule, not Monkeytype theme.

## Grok-Imagine-Cinematic-Studio — agent runtime, not client pixels

**For Hermes, not Tricia's homepage.** Steal the pipeline: Production Bible →
Identity/DNA lock → specialist sequence → QA gates → quota awareness. Do **not**
run Imagine Image/Video on her food, people, or logo (that was the defect in
`ASSETS.md`).

Hermes skill: `cinematic-production-discipline`. Full 64-skill Grok Build plugin
pack stays out of this profile — wrong format, NSFW attest paths, Imagine
renderer.

## pi-supergrok — Pi CLI only

`pi install npm:pi-supergrok` then `/login supergrok`. Requires Pi ≥ 0.74.
Hermes already has SuperGrok OAuth (`hermes auth` / xai provider). Installing
this here does nothing. Use it if a **Pi** session needs grok-4.6.

## 2026-09-16 paste — SSG / motion / study lists

| Repo | Class | Call |
|---|---|---|
| [hugo](https://github.com/gohugoio/hugo) | (b) $600 stack candidate | Fastest SSG. Go binary. Overkill for the $150 one-pager. Shortlist vs Astro if she picks full site + blog. |
| [astro](https://github.com/withastro/astro) | (b) **preferred $600 stack** | Zero-JS-by-default, content collections, sitemap/RSS, Vercel. Maps to her "SEO, high traffic, found by search". Do not rebuild the three samples in it until she picks one art direction. |
| [docusaurus](https://github.com/facebook/docusaurus) | (c) trap here | Docs sites. Not a catering lookbook. |
| [react-bits](https://github.com/DavidHDev/react-bits) | (a) motion vocabulary | Steal scroll-snap / split-text ideas. Do **not** drop Magnet, BlobCursor, particles, or a React runtime onto a static $150 page — that is the AI-junk look. CSS only, motion last. |
| [Best-websites-a-programmer-should-visit](https://github.com/sdmg15/Best-websites-a-programmer-should-visit) | (a) study list | Archived Nov 2025. Bookmark, do not vendor into `clients/`. |
| [30-Days-Of-JavaScript](https://github.com/Asabeneh/30-Days-Of-JavaScript) | (a) study list | Beginner curriculum. Not a site generator. |

Rule: $150 ships the HTML samples. $600, if she wants location pages + blog, is **Astro** (Hugo if Garrett prefers no Node). Docusaurus never.
