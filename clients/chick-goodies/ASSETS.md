# ASSETS — Charcuterie Chick

Provenance matters more than resolution on this job: the client's complaint is
"NO AI FEEL, NO AI JUNK", so every image has to be traceable to a real event.

## 1. In the build (`site/img/`)

All copied from her own site, `https://www.charcuteriechick.ai/cdn/shop/files/<NAME>_2048x.jpg`
— Shopify serves them at their native size, which is what is listed here. **These
are the maximum resolutions that exist publicly.**

| File in build | Source name | Native size |
|---|---|---|
| `logo.png` | owner-supplied `The Chick Goodies.jpg` (2384×1792), whitespace trimmed | 1209×388 |
| `wide-640.jpg` | IMG_0224 | 640×452 |
| `cart-640.jpg` | IMG_5924 | 640×480 |
| `catering-1000.jpg` | 72155 | 1000×560 |
| `tricia-662.jpg` | Group_49_1_7ab96cd7-… | 662×823 |
| `graze-01/02/03.jpg` | IMG_4945 / IMG_4560 / IMG_4793 | 480×640 each |
| `board-01/02.jpg` | IMG_4792 / IMG_4958 | 480×640 each |
| `table-01/02/03.jpg` | IMG_5463 / IMG_5568_8cf901f4-… / IMG_5577 | 480×640 each |
| `sips-01/02.jpg` | IMG_5575 / IMG_5566_961d4b84-… | 480×640 each |
| `candy-01.jpg` | IMG_5638 | 480×640 |
| `sweets-01.jpg` | Image20251106193205 | 480×640 |
| `boards-01.jpg` | IMG_5029 | 480×640 |
| `brand-reference-1364.jpg` | owner-supplied `IMG_7724.jpeg` (1320×947) — **unidentified**, see §4 | 1320×947 |

**Resolution ceiling:** her real photos top out at **480×640**. That is fine for
a phone screen and not fine for a hero image or print. Requirement 6 in
`BRIEF.md` cannot be fully met without new photography:

- Get the camera-roll originals from Tricia (the site copies are downscaled).
- Or shoot one event: table before guests arrive (wide), three detail shots
  (cheese, fruit, sliders), the cart, Tricia at work, a happy host. Vertical and
  horizontal of each. Deliver as JPEG, long edge ≥ 2000px.
- Do not upscale the 480px files. If an image must be shown larger, show it
  smaller or crop tighter — softness is the thing we are fixing.

## 2. Quarantined — AI-generated, never ship

These four files live in the Beexly Grok workspace
(`grok-workspace/public/chick/`). They are **byte-identical to files in
`grok-workspace/artifacts/imagine_images/`** — i.e. Grok Imagine output, not
photographs of Tricia's food. They were briefly used on the first draft of the
demo page and were removed on 2026-09-15.

| File | md5 | Bytes |
|---|---|---|
| `board.jpg` | `4dd5bda8eecfba8ef856bccb9559a4c3` | 711743 |
| `cart.jpg` | `e95fd205c3a8300e548870b0105be525` | 356133 |
| `cups.jpg` | `272df1ebf5e6c8f3ce2478b1ee776f17` | 566965 |
| `graze.jpg` | `3a2e9add87dac67354888f25746c283e` | 681963 |

If any of these hashes turns up in a client-facing build, that is a defect.
They are easy to spot: they are the only files with a 1728×1152 / 1792×1008
aspect that do not exist on her CDN.

## 3. Stock images on her live site — do not reuse

Her Shopify homepage gallery currently serves stock files: `Shrimp_Food_Prawns`,
`Link_5` … `Link_10`, plus stock product shots (`turkeyandsmokedgouddaaliser1`,
`healthy-simple-mexican-tacos-meat-600nw-…`, `cafe-drink-cake-…`). Part of the
$600 job is deleting these from the storefront.

## 4. Open question for the owner

`IMG_7724.jpeg` was supplied with "THIS IS THE CORRECT INFO". It is a 1320×947
image on a dark background and does not resemble the wordmark in
`The Chick Goodies.jpg` (2384×1792, dark wordmark on white). It is held as
`brand-reference-1364.jpg` and is **not** used on the page. Ask Tricia/Garrett
which asset is the logo, and whether the dark file is a logo variant, a menu
board, or a metrics screenshot. Do not guess — requirement 1 is "same logo".

## 5. Restoration — approved by the owner, 2026-09-17

Section 1 says "do not upscale the 480px files". **The owner has overridden
that**: Tricia has confirmed she does not want a professional photographer and
has approved restoration and reimaging of her existing files. Section 1 stands
as the record of what the source material is; this section is the standing
instruction.

Two passes, and they do different jobs:

| Pass | What it can do | What it cannot do |
|---|---|---|
| **Classical** — denoise, luma-only sharpening, highlight roll-off, linear-light RobidouxSharp/Mitchell resize | Recover everything actually present in the file. Invents nothing, so it is safe unreviewed | Add detail that was never captured. No kernel invents a 12MP sensor |
| **Generative** — `tools/restore-photos.py` | Add plausible detail past the 480×640 ceiling, which is the only way `graze-02` and `wide-640` ever carry a hero | Be trusted unreviewed. It *invents*, which is the point and the risk |

Run the classical pass first; feed its output to the generative pass with
`--src`. A cleaned, correctly-resized file gives the model real structure to
hold onto.

**`tricia-662.jpg` is a real person's face.** It carries a deliberately
conservative prompt in `PROMPTS`, keyed by filename. If the file has been
renamed by an earlier pass, that override silently stops matching — the script
warns about this, and the warning is worth obeying. Classical-only is a
defensible final answer for the portrait.

Generative output lands in `restored/`, never in `site/img/`, and every run
appends provenance (source, model, endpoint, prompt, `request_id`,
`X-Correlation-ID`, md5, bytes) to `restored/manifest.jsonl`. Nothing moves into
`site/img/` without a person looking at it first. Section 2 is why: an
unreviewed generated image reaching a client build is a defect, and the manifest
md5s are what makes that auditable rather than a matter of memory.
