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

## Grok-Imagine-Cinematic-Studio — https://github.com/FineComputer14451/Grok-Imagine-Cinematic-Studio

**Banned on this client.** Multi-agent Grok Imagine / Video pipeline (Image 2.0,
Video 1.0/1.5). We already quarantined four byte-identical Imagine outputs in
`ASSETS.md`. The brief is "NO AI FEEL, NO AI JUNK". Running this studio to
"cinematic-ize" her menu is the defect that started the rebuild.

Useful elsewhere: Kit / SignPreview demo video, not Charcuterie Chick's public
site.

## pi-supergrok — https://github.com/dvcrn/pi-supergrok

**Not this job.** Pi coding-agent extension: SuperGrok/xAI OAuth for grok-4.6 /
4.5 / composer. Hermes already talks to Grok. Installing it does not build a
catering page, does not read `IMG_7724.jpeg`, and does not add email to a form.

If the owner wants Pi as a second agent runtime, that is a Hermes config task
— separate from `clients/chick-goodies/`.
