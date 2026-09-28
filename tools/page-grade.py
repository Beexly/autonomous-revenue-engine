#!/usr/bin/env python3
"""Grade a live local-business homepage against a $350 Friday page.

The old kit pitch hunted shops with no website. Most of those tags were
wrong. This grades the page they already have: can a phone tap the number
in the first screen of HTML, or is the call buried.

Writes nothing. Prints a JSON grade. No paid APIs.
"""

from __future__ import annotations

import json
import re
import sys
import urllib.request

PHONE = re.compile(r"(?:\+1[\s.-]?)?\(?\d{3}\)?[\s.-]\d{3}[\s.-]\d{4}")
TITLE = re.compile(r"<title[^>]*>(.*?)</title>", re.I | re.S)


def fetch(url: str, timeout: int = 8):
    req = urllib.request.Request(
        url,
        headers={"User-Agent": "KitPageGrade/1.0 (local research)"},
    )
    with urllib.request.urlopen(req, timeout=timeout) as resp:
        raw = resp.read(80_000)
        final = resp.geturl()
    text = raw.decode("utf-8", errors="replace")
    return final, text


def grade(url: str) -> dict:
    final, html = fetch(url)
    head = html[:12_000].lower()
    title_match = TITLE.search(html)
    title = re.sub(r"\s+", " ", title_match.group(1)).strip() if title_match else ""
    phones = PHONE.findall(html)
    tel = "tel:" in html.lower()
    viewport = 'name="viewport"' in head or "name='viewport'" in head
    # A Friday page wins when the number is a tel link in the first screen.
    if tel and phones:
        pitch = "KEEP"
        why = "tap-to-call is already in the HTML"
    elif phones and not tel:
        pitch = "REPLACE"
        why = "a phone number is on the page and it is not a tap link"
    elif not phones:
        pitch = "REPLACE"
        why = "no phone number in the fetched HTML"
    else:
        pitch = "REPLACE"
        why = "call path is weak"
    return {
        "url": final,
        "title": title[:140],
        "viewport": viewport,
        "tel_link": tel,
        "phones_seen": phones[:3],
        "pitch": pitch,
        "why": why,
    }


def main(argv: list[str]) -> int:
    urls = argv[1:] or [
        "https://drrescue.com/",
        "https://www.scoginaire.com/",
        "https://theissengineering.com/",
    ]
    rows = []
    for url in urls:
        try:
            rows.append(grade(url))
        except Exception as exc:  # noqa: BLE001 — one dead site must not hide the others
            rows.append({"url": url, "pitch": "DEAD", "why": type(exc).__name__})
    print(json.dumps(rows, indent=2))
    return 0


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
