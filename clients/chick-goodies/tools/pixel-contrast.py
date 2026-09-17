#!/usr/bin/env python3
"""Contrast against the pixels actually painted behind the text.

tools/contrast-audit.py walks CSS backgrounds, the way axe does. That cannot
score text sitting on a photograph or a WebGL scene: it reports "no measurable
background" and stops. This tool answers the question instead. It renders the
page twice -- once as shipped, once with the text hidden -- and measures the
real background luminance under each text box, then computes the contrast the
reader actually gets.

    python3 tools/pixel-contrast.py http://127.0.0.1:8772 table 390,1440
"""
import sys

BOXES = """() => [...document.querySelectorAll('h1,h2,h3,p,a,button,li,figcaption,output,span,b,em,i,dt,dd,label')]
  .filter(e => e.offsetParent !== null || getComputedStyle(e).position === 'fixed')
  .filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))
  .map(e => { const rg = document.createRange(); rg.selectNodeContents(e);
              const r = rg.getBoundingClientRect(); const s = getComputedStyle(e);
              return {x:r.x, y:r.y, w:r.width, h:r.height, color:s.color,
                      px:parseFloat(s.fontSize), weight:s.fontWeight,
                      text:e.textContent.trim().slice(0,40)}; })
  .filter(b => b.w > 3 && b.h > 3 && b.y >= 0 && b.y + b.h <= innerHeight && b.x >= 0)"""


def lin(c):
    c /= 255.0
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def lum(rgb):
    r, g, b = rgb
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def parse_rgb(css):
    nums = [float(x) for x in css[css.index('(') + 1:css.index(')')].split(',')]
    return nums[:3], (nums[3] if len(nums) > 3 else 1.0)


def main():
    base, page, widths = sys.argv[1], sys.argv[2], [int(x) for x in sys.argv[3].split(',')]
    if not base.startswith(('https://', 'http://localhost', 'http://127.0.0.1')):
        sys.exit(f'base must be https or loopback, got: {base}')
    import io

    from PIL import Image
    from playwright.sync_api import sync_playwright
    worst, failures = [], 0
    with sync_playwright() as pw:
        br = pw.chromium.launch(args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        for w in widths:
            pg = br.new_page(viewport={'width': w, 'height': 900})
            pg.goto(f'{base}/{page}.html')
            pg.add_style_tag(content='html,body{scroll-behavior:auto !important}')
            pg.wait_for_timeout(5000)
            boxes = pg.evaluate(BOXES)
            # hide the text only; every background layer keeps painting
            pg.add_style_tag(content='h1,h2,h3,p,a,button,li,figcaption,output,span,b,em,i,dt,dd,label{color:transparent !important}')
            pg.wait_for_timeout(500)
            # kept in memory: the background frame is an intermediate, and writing
            # it to a world-writable temp directory buys nothing
            im = Image.open(io.BytesIO(pg.screenshot())).convert('RGB')
            sx = im.size[0] / w
            for b in boxes:
                x0, y0 = int(b['x'] * sx), int(b['y'] * sx)
                x1, y1 = int((b['x'] + b['w']) * sx), int((b['y'] + b['h']) * sx)
                if x1 <= x0 or y1 <= y0:
                    continue
                crop = im.crop((x0, y0, min(x1, im.size[0]), min(y1, im.size[1])))
                px = list(crop.getdata())
                if not px:
                    continue
                bg = [sum(c) / len(px) for c in zip(*px)]
                fg, alpha = parse_rgb(b['color'])
                eff = [alpha * f + (1 - alpha) * g for f, g in zip(fg, bg)]
                l1, l2 = lum(eff), lum(bg)
                ratio = (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)
                bold = int(b['weight']) >= 700 if b['weight'].isdigit() else False
                need = 3.0 if (b['px'] >= 24 or (bold and b['px'] >= 18.66)) else 4.5
                worst.append((ratio, need, w, b['text'], b['px']))
                if ratio < need:
                    failures += 1
                    print(f'  {page}@{w} {ratio:5.2f}:1 need {need} | {b["px"]:.0f}px | "{b["text"]}"')
            pg.close()
        br.close()
    worst.sort()
    print('\n  five tightest measured pairs:')
    for r, need, w, t, px in worst[:5]:
        print(f'    {r:5.2f}:1 (need {need}) @{w} {px:.0f}px  "{t}"')
    verdict = (f'FAIL {failures}' if failures
               else 'PASS - every text box clears AA against the pixels behind it')
    print(f'\n  {verdict}')


if __name__ == '__main__':
    main()
