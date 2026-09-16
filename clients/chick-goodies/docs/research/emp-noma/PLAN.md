# PLAN — reverse-engineer EMP / Noma into Charcuterie Chick

Not impersonation. Tokens only. Content from FACTS.md.

## URL → output

| Source | Extracted | Output |
|---|---|---|
| https://www.elevenmadisonpark.com/ | `tokens-emp.json` | `sample-1-editorial/index.html` |
| https://noma.dk/ | `tokens-noma.json` | `sample-2-after-dark/index.html` |
| EMP contain + Noma letter + live quote | — | `sample-3-studio/index.html` (numbered chapters, calculator) |

## Tokens (getComputedStyle, viewport 2560×1249)

### EMP
- body: `rgb(255,255,255)` / `rgb(0,0,0)` / 16px
- wordmark: `"EB Garamond"` 21.04px, letter-spacing 0.4208px
- nav: `nobel` 17.68px, uppercase, letter-spacing 0.3536px, padding 1.768px 0
- header: position absolute, background transparent
- hero img: object-fit **contain**, ~1298×937, position relative
- CTA copy: `RESERVATIONS` uppercase
- no border-radius on nav

### Noma
- body: `rgb(249,249,243)` / `rgb(41,56,43)` / Reckless 18px / line-height 32.4px
- p: 18px / 27px
- h1: Reckless-Neue 72px, weight 500, letter-spacing -1.44px, white on photo
- Book a table: Reckless 30px, padding 19.5px 42px 19.5px 30px, border 0.67px solid white, radius 0
- secondary: Roobert 16px, letter-spacing 0.18px
- photos: object-fit cover at ~994×746

## Substitutes (no commercial license)
- Nobel → Jost 17.68px
- Reckless → Fraunces 18px / 72px
- Roobert → Outfit 16px

## Efficiency
- One display + one nav face per sample
- engine.js + quiet.js only
- No cursor, grain, marquee, WebGL
- Photos local, width/height set
