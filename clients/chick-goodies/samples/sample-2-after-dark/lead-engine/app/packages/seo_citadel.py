"""
Package 3 — Local SEO Citadel.

Four published service areas, one NAP record that must stay identical everywhere,
and structured data generated from that single record.

The value here is consistency, not volume. Citation sites reward a business whose
name, address and phone are byte-identical across every listing. So the citation
sweep does not generate new copy — it diffs what is already out there against the
one true record and reports drift.
"""

from __future__ import annotations

import json
import re
from dataclasses import dataclass, field
from typing import Any, Iterable

from ..config import (
    BUSINESS_NAME,
    CITY,
    EMAIL,
    INSTAGRAM,
    LEGAL_TRADING_NAME,
    LISTING_URLS,
    OWNER,
    PHONE_E164,
    SERVICE_AREAS,
    SERVICE_AREA_PAGES,
    SITE_URL,
    STATE,
)

#: Byte-identical on every citation. Do not "improve" these.
NAP = {
    "name": BUSINESS_NAME,
    "phone": PHONE_E164,
    "city": CITY,
    "state": STATE,
    "url": SITE_URL,
}


@dataclass(frozen=True)
class Citation:
    directory: str
    name: str
    phone: str | None
    url: str | None
    address_line: str | None = None


@dataclass
class CitationAudit:
    directory: str
    matches_nap: bool
    issues: list[str] = field(default_factory=list)

    @property
    def severity(self) -> str:
        if self.matches_nap:
            return "ok"
        if any("phone" in i for i in self.issues):
            return "high"
        return "medium"


def normalise_phone(raw: str | None) -> str | None:
    """
    Reduce any phone formatting to a comparable form.

    Listings write the same number as (832) 458-8180, 832-458-8180 and
    8324588180. They are the same number and must not read as drift.
    """
    if not raw:
        return None
    digits = re.sub(r"\D", "", raw)
    if len(digits) == 11 and digits.startswith("1"):
        digits = digits[1:]
    return f"+{digits}" if digits else None


def normalise_name(raw: str | None) -> str | None:
    """
    Compare business names case-insensitively, tolerating the two published
    trading names and legal-suffix noise.
    """
    if not raw:
        return None
    cleaned = re.sub(r"\b(inc|llc|ltd|co)\b\.?", "", raw, flags=re.IGNORECASE)
    cleaned = re.sub(r"[^a-z ]", "", cleaned.lower()).strip()
    return cleaned or None


_ACCEPTED_NAMES = {
    normalise_name(BUSINESS_NAME),
    normalise_name(LEGAL_TRADING_NAME),
}


def audit_citation(citation: Citation) -> CitationAudit:
    issues: list[str] = []

    name = normalise_name(citation.name)
    if name not in _ACCEPTED_NAMES:
        issues.append(f"name differs: {citation.name!r}")

    phone = normalise_phone(citation.phone)
    if phone is None:
        issues.append("phone missing")
    elif phone != NAP["phone"]:
        issues.append(f"phone differs: {citation.phone!r} (expected {NAP['phone']})")

    if not citation.url:
        issues.append("url missing")

    return CitationAudit(
        directory=citation.directory,
        matches_nap=not issues,
        issues=issues,
    )


def audit_all(citations: Iterable[Citation]) -> dict[str, Any]:
    audits = [audit_citation(c) for c in citations]
    drifting = [a for a in audits if not a.matches_nap]
    return {
        "checked": len(audits),
        "clean": len(audits) - len(drifting),
        "drifting": len(drifting),
        "nap": NAP,
        "audit": [
            {
                "directory": a.directory,
                "matches_nap": a.matches_nap,
                "severity": a.severity,
                "issues": a.issues,
            }
            for a in audits
        ],
    }


def local_business_schema() -> dict[str, Any]:
    """
    LocalBusiness JSON-LD built from the one true NAP record.

    `areaServed` is the four published areas. No aggregate rating is emitted:
    publishing a rating in schema without a matching on-page review widget is a
    structured-data violation, and we will not do it.
    """
    return {
        "@context": "https://schema.org",
        "@type": "Caterer",
        "name": BUSINESS_NAME,
        "alternateName": LEGAL_TRADING_NAME,
        "description": (
            "Grazing tables, boards and Houston's largest charcuterie cart. "
            "More than 35 years in restaurants, on the floor and on the line."
        ),
        "telephone": PHONE_E164,
        "email": EMAIL,
        "url": SITE_URL,
        "sameAs": [
            LISTING_URLS["the_knot"],
            LISTING_URLS["weddingwire"],
            f"https://instagram.com/{INSTAGRAM.lstrip('@')}",
        ],
        "address": {
            "@type": "PostalAddress",
            "addressLocality": CITY,
            "addressRegion": STATE,
            "addressCountry": "US",
        },
        "areaServed": [
            {"@type": "City", "name": area} for area in SERVICE_AREAS
        ],
        "founder": {"@type": "Person", "name": OWNER},
        "knowsLanguage": ["en", "es"],
    }


def service_area_page(area: str) -> dict[str, str] | None:
    for page in SERVICE_AREA_PAGES:
        if page.area.lower() == area.strip().lower():
            return {"area": page.area, "headline": page.headline, "body": page.body}
    return None


def service_area_pages() -> list[dict[str, str]]:
    return [
        {"area": p.area, "headline": p.headline, "body": p.body}
        for p in SERVICE_AREA_PAGES
    ]


def schema_jsonld() -> str:
    """Serialised for a <script type="application/ld+json"> block."""
    return json.dumps(local_business_schema(), indent=2, ensure_ascii=False)
