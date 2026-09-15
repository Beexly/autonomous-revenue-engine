# Kit sample autopsy — 2026-09-14

The $350 pitch is one screen: name, three services, a call button. The five cinematic samples were a different product: fake social proof, 555 numbers that look like Houston lines, invented neighbors.

## What was fake

| Sample | Invented |
|---|---|
| mobile-detailing (Obsidian) | 4.9 / 900+ reviews. Derek W. Katy. Alicia M. Sugar Land. (832) 555-0188. Cyan sheen + speed lines. |
| hvac (Bayou Breeze) | 4.9 / 600+ reviews. 2,300+ homes. 45-min response. 14 yrs. TACLA #000000. Marisol R. James T. (713) 555-0392. |
| pool-service | Rachel D. / Marcus L. quotes. "photos looked fake. They were not fake." (281) 555-0163. |
| lawn-care | The Hendersons / Priya S. (281) 555-0147. |
| roofing | Bill H. / Okafor Family. Storm-chaser $22k story. (936) 555-0121. |

555 is reserved fiction. Paired with 713/832/281/936 it still *looks* like a real Houston line on a shop floor. That's the tell.

Craft that stays: package structure, sticky call, reduced-motion, per-trade art direction. Craft that went: sheen, speed lines, invented counts, invented people.

## What changed on this branch

- Every `tel:`/`sms:` in `previews/` is `#sample-call` / `#sample-text`. Visible label: **Your number**.
- Quote blocks are labeled sample slots. No names.
- HVAC stats no longer invent volume. License is a blank, not TACLA #000000.
- Detailing sheen + speed-line JS removed.
- `scroll-behavior: auto` — conversion pages do not smooth-scroll.
- Walk-in page remains `docs/kit/one-screen.html`.


## Round 2 — cinematic leftover (same night)

Fake people were round 1. Round 2 is the machinery that still *felt* like a fake product:

| Thing | Why it was cinema | What we did |
|---|---|---|
| Google Fonts CDN on all five samples | Extra request, fails offline on a shop floor, Inter is the default AI face | System stacks. Impact/Georgia already on the device. |
| Cyan sheen + speed-line CSS (detailing) | Loader theater. HTML was already gone; CSS was still there. | Deleted. |
| "Your car called. It wants this." | Slogan stack. No leftover from a human. | "Text a photo. Get a price." |
| "Your roof is talking. Listen free." | Same. | "We'll look at it. No pitch until you want one." |
| "Most booked" flag | Unverified for a fictional shop. | Removed. |
| HVAC grain crawl | Animated noise over the fold. | Static. |
| Kit gallery starfield + custom cursor + 900ms dock | File header said no loader theater. The JS did it anyway. | Dock immediate. Cursor and stars off. Smooth-scroll off. |

Still a sample, still art-directed per trade. The live job is `one-screen.html` plus the shop's real number. Do not walk in with the cinematic gallery on the phone.

