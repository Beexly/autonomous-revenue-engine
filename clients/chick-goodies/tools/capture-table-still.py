#!/usr/bin/env python3
"""Capture the table.html WebGL scene at 1440 as a still image (plan 11.3 item 2).

The still is what phones and reduced-motion visitors see instead of the live
scene, with the same copy over it. It is a real render of this scene, not an
illustration, so it stays honest when the renderer cannot run.

Run from clients/chick-goodies with a local server on the sample directory:
    python3 -m http.server 8772 --directory samples/sample-3-studio &
    python3 tools/capture-table-still.py --base http://127.0.0.1:8772
"""
import argparse
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'samples' / 'sample-3-studio' / 'img' / 'table-still.jpg'
OUT_TALL = ROOT / 'samples' / 'sample-3-studio' / 'img' / 'table-still-tall.jpg'

# A phone is not a cropped desktop. Cropping the 1440 frame to 390 lands on the
# dark half of the room, so the portrait still is composed at phone proportions
# from the same scene rather than cut out of the landscape one.
SHOTS = [(1440, 900, 'OUT'), (900, 1600, 'OUT_TALL')]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--base', default='http://127.0.0.1:8772')

    ap.add_argument('--settle', type=int, default=6000, help='ms to let the scene light and settle')
    args = ap.parse_args()

    base = args.base
    if not base.startswith(('https://', 'http://localhost', 'http://127.0.0.1')):
        sys.exit(f'--base must be https or loopback, got: {base}')

    from PIL import Image
    from playwright.sync_api import sync_playwright
    targets = {'OUT': OUT, 'OUT_TALL': OUT_TALL}
    with sync_playwright() as pw:
        browser = pw.chromium.launch(
            args=['--use-gl=swiftshader', '--enable-unsafe-swiftshader'])
        for w, h, key in SHOTS:
            dest = targets[key]
            png = dest.with_suffix('.png')
            # the still must be the live scene, so it is captured at a width where
            # table-boot.js actually starts the renderer
            pg = browser.new_page(viewport={'width': w, 'height': h},
                                  device_scale_factor=2)
            pg.goto(f'{base}/table.html')
            pg.wait_for_function(
                "document.querySelector('#stage')?.classList.contains('lit')",
                timeout=30000)
            pg.wait_for_timeout(args.settle)
            # the copy and chrome painted over the scene come off first
            pg.add_style_tag(
                content='#chrome,main,#vignette,.skip{visibility:hidden !important}')
            pg.wait_for_timeout(400)
            pg.locator('#table-canvas').screenshot(path=str(png))
            pg.close()

            im = Image.open(png).convert('RGB')
            im.thumbnail((2160, 2160), Image.LANCZOS)
            im.save(dest, quality=84, optimize=True, progressive=True)
            png.unlink()
            print(f'{dest.relative_to(ROOT)}  {im.size[0]}x{im.size[1]}  '
                  f'{dest.stat().st_size / 1024:.0f} KB')
        browser.close()


if __name__ == '__main__':
    main()
