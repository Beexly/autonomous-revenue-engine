#!/usr/bin/env python3
"""Pull local trade homepages that publish a website, then grade them.

Uses the same KEEP / REPLACE / DEAD rule as page-grade.py.
Timeouts stay short so one dead host cannot stall the list.
"""

from __future__ import annotations

import json
import urllib.parse
import urllib.request

import importlib.util
from pathlib import Path

_spec = importlib.util.spec_from_file_location(
    "page_grade", Path(__file__).with_name("page-grade.py")
)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
grade = _mod.grade

QUERY = """
[out:json][timeout:25];
(
  nwr["craft"~"^(hvac|plumber|roofer|electrician|gardener)$"]["website"](30.00,-95.55,30.25,-95.10);
);
out tags;
"""


def websites() -> list[str]:
    data = urllib.parse.urlencode({"data": QUERY}).encode()
    req = urllib.request.Request(
        "https://overpass-api.de/api/interpreter",
        data=data,
        headers={"User-Agent": "KitPageGrade/1.0 (local research)"},
    )
    with urllib.request.urlopen(req, timeout=40) as resp:
        payload = json.loads(resp.read().decode())
    found = []
    for el in payload.get("elements", []):
        tags = el.get("tags") or {}
        site = tags.get("website") or tags.get("contact:website") or ""
        name = tags.get("name") or ""
        if site and name:
            if not site.startswith("http"):
                site = "https://" + site
            found.append({"name": name, "url": site})
    return found


def main() -> int:
    rows = websites()
    print(f"with_website {len(rows)}")
    graded = []
    for row in rows[:8]:
        try:
            result = grade(row["url"])
        except Exception as exc:  # noqa: BLE001
            result = {"url": row["url"], "pitch": "DEAD", "why": type(exc).__name__}
        result["name"] = row["name"]
        graded.append(result)
        print(f"{result.get('pitch')}\t{row['name']}\t{result.get('why','')}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
