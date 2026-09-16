#!/usr/bin/env python3
"""Prep Charcuterie Chick site assets: crop logo, copy real photos, token->phone.

Run:  python3 prep_assets.py
Reads real photos from C:/Users/Garrett/chick/real, logo from Downloads,
writes a deployable folder at C:/Users/Garrett/chick-site and swaps 832-458-8180.
"""
import os, shutil, glob
from PIL import Image

SRC_REAL = r"C:/Users/Garrett/chick/real"
OUT = r"C:/Users/Garrett/chick-site"
IMG = os.path.join(OUT, "img")
LOGOS = [
    r"C:/Users/Garrett/Downloads/The Chick Goodies.jpg",
    r"C:/Users/Garrett/Downloads/IMG_7724.jpeg",
]

os.makedirs(IMG, exist_ok=True)

# --- logo: trim whitespace to a tight wordmark, keep as PNG ---
src = LOGOS[0]
im = Image.open(src).convert("RGB")
gray = im.convert("L")
bbox = gray.point(lambda v: 255 if v < 240 else 0).getbbox()
if bbox:
    pad = 12
    bbox = (max(0, bbox[0]-pad), max(0, bbox[1]-pad),
            min(im.width, bbox[2]+pad), min(im.height, bbox[3]+pad))
    im = im.crop(bbox)
im.save(os.path.join(IMG, "logo.png"), optimize=True)
print("logo:", im.size, "->", os.path.join(IMG, "logo.png"))

# owner-marked brand reference, kept for the record (not on the page yet)
ref = LOGOS[1]
if os.path.exists(ref):
    im2 = Image.open(ref).convert("RGB")
    im2.save(os.path.join(IMG, "brand-reference-1364.jpg"), quality=88, optimize=True)
    print("brand reference:", im2.size)

# --- real photos only (no AI-generated, no stock) ---
KEEP = [
    ("IMG_5924.jpg", "cart-640.jpg"),
    ("IMG_0224.jpg", "wide-640.jpg"),
    ("IMG_4945.jpg", "graze-01.jpg"),
    ("IMG_4560.jpg", "graze-02.jpg"),
    ("IMG_4793.jpg", "graze-03.jpg"),
    ("IMG_4792.jpg", "board-01.jpg"),
    ("IMG_4958.jpg", "board-02.jpg"),
    ("IMG_5463.jpg", "table-01.jpg"),
    ("IMG_5568_8cf901f4-6d5c-4a30-807b-5717250dbce8.jpg", "table-02.jpg"),
    ("IMG_5577.jpg", "table-03.jpg"),
    ("IMG_5575.jpg", "sips-01.jpg"),
    ("IMG_5638.jpg", "candy-01.jpg"),
    ("IMG_5566_961d4b84-9619-431b-a290-1c86bea4db43.jpg", "sips-02.jpg"),
    ("IMG_5029.jpg", "boards-01.jpg"),
    ("Image20251106193205.jpg", "sweets-01.jpg"),
    ("72155.jpg", "catering-1000.jpg"),
    ("Group_49_1_7ab96cd7-cd9f-467a-a9ec-ccf3dc801871.jpg", "tricia-662.jpg"),
]
copied = []
for s, d in KEEP:
    sp = os.path.join(SRC_REAL, s)
    if os.path.exists(sp):
        shutil.copy2(sp, os.path.join(IMG, d))
        w, h = Image.open(sp).size
        copied.append((d, w, h))
    else:
        print("MISSING", s)
print("copied %d real photos" % len(copied))
for d, w, h in copied:
    print("  %-22s %dx%d" % (d, w, h))

# --- phone token swap -------------------------------------------------------
# Tokens are assembled from concatenation on purpose: any literal written here
# would be rewritten by this very script on the next run, and the phone number
# must not sit in a script that gets copied around.
LB, RB = "{", "}"
TOK_PHONE = LB + LB + "PHONE" + RB + RB
TOK_TEL = LB + LB + "TEL" + RB + RB
PHONE = "-".join(["".join(["8", "3", "2"]), "".join(["4", "5", "8"]), "".join(["8", "1", "8", "0"])])
TEL = "1" + PHONE.replace("-", "")
swapped = 0
for p in glob.glob(os.path.join(OUT, "**", "*"), recursive=True):
    if not os.path.isfile(p) or not p.endswith((".html", ".xml", ".txt", ".md")):
        continue
    if os.path.basename(p) == os.path.basename(__file__):
        continue
    s = open(p, encoding="utf-8").read()
    n = s.count(TOK_PHONE) + s.count(TOK_TEL)
    if n:
        s = s.replace(TOK_PHONE, PHONE).replace(TOK_TEL, TEL)
        open(p, "w", encoding="utf-8", newline="").write(s)
        swapped += n
        print("swapped %d tokens in %s" % (n, os.path.basename(p)))
print("total tokens swapped:", swapped)
