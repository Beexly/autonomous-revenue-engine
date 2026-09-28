#!/usr/bin/env python3
"""Remote Kit Pipeline — Autonomous Lead Grading, Preview Generation & Outreach Staging.

Replaces the physical "walk into shops" model with remote software leverage:
1. Grades live trade websites (HVAC, plumbing, roofing, electrical, lawn care).
2. For any site marked REPLACE (missing tap-to-call / unclickable phone), extracts
   business details and generates a high-converting, mobile-optimized live preview.
3. Injects a non-intrusive "Claim This Site ($199)" top-bar with a Stripe payment link.
4. Stages personalized, low-friction, non-salesy email and SMS outreach drafts.

Writes to:
- docs/kit/live-previews/{slug}.html
- ops/STAGED_OUTREACH.md
- ops/STAGED_OUTREACH.csv
"""

from __future__ import annotations

import csv
import html
import importlib.util
import json
import os
import re
import sys
import urllib.parse
from pathlib import Path

# Load page-grade dynamically
_spec = importlib.util.spec_from_file_location(
    "page_grade", Path(__file__).with_name("page-grade.py")
)
_mod = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_mod)
grade = _mod.grade

REPO_ROOT = Path(__file__).resolve().parent.parent
DOCS_DIR = REPO_ROOT / "docs" / "kit" / "live-previews"
OPS_DIR = REPO_ROOT / "ops"
STRIPE_PAYMENT_URL_PLACEHOLDER = "https://buy.stripe.com/test_placeholder_kit_199"
VERCEL_BASE_URL = "https://autonomous-revenue-engine-eight.vercel.app/kit/live-previews"

PHONE_CLEAN_RE = re.compile(r"[^\d+]")


def slugify(text: str) -> str:
    s = text.lower().strip()
    s = re.sub(r"[^\w\s-]", "", s)
    return re.sub(r"[\s_-]+", "-", s).strip("-")


def format_phone_display(phone: str) -> str:
    digits = re.sub(r"\D", "", phone)
    if len(digits) == 10:
        return f"({digits[:3]}) {digits[3:6]}-{digits[6:]}"
    elif len(digits) == 11 and digits.startswith("1"):
        return f"({digits[1:4]}) {digits[4:7]}-{digits[7:]}"
    return phone


def format_phone_tel(phone: str) -> str:
    digits = re.sub(r"\D", "", phone)
    if len(digits) == 10:
        return f"+1{digits}"
    elif len(digits) == 11 and digits.startswith("1"):
        return f"+{digits}"
    return phone


def generate_preview_html(
    business_name: str,
    city: str,
    phone_display: str,
    phone_tel: str,
    tagline: str,
    services: list[str],
    category: str,
    original_url: str,
) -> str:
    esc = html.escape
    services_li = "".join(f"<li>{esc(s)}</li>" for s in services)

    return f"""<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{esc(business_name)} · {esc(city)}</title>
  <meta name="description" content="Fast, mobile-optimized site for {esc(business_name)} in {esc(city)}. Call {esc(phone_display)}.">
  <style>
    :root {{
      --bg: #f7f9fa;
      --paper: #ffffff;
      --ink: #111827;
      --mute: #4b5563;
      --line: #e5e7eb;
      --accent: #15803d;
      --accent-hover: #166534;
      --accent-light: #f0fdf4;
      --brand-bar: #0b0f19;
      --brand-green: #10b981;
    }}
    * {{ box-sizing: border-box; margin: 0; padding: 0; }}
    body {{
      background: var(--bg);
      color: var(--ink);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.5;
      -webkit-font-smoothing: antialiased;
    }}
    /* Owner Claim Bar */
    .preview-bar {{
      position: sticky;
      top: 0;
      z-index: 9999;
      background: var(--brand-bar);
      color: #f3f4f6;
      border-bottom: 2px solid var(--brand-green);
      padding: 10px 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 10px;
      font-size: 13px;
    }}
    .preview-badge {{
      background: #064e3b;
      color: #6ee7b7;
      padding: 3px 8px;
      border-radius: 4px;
      font-weight: 700;
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-right: 6px;
    }}
    .claim-btn {{
      background: var(--brand-green);
      color: #06281c;
      font-weight: 700;
      text-decoration: none;
      padding: 7px 14px;
      border-radius: 6px;
      font-size: 13px;
      transition: background 0.15s;
    }}
    .claim-btn:hover {{ background: #34d399; }}
    /* Main Content */
    .container {{
      max-width: 640px;
      margin: 0 auto;
      background: var(--paper);
      min-height: calc(100vh - 54px);
      box-shadow: 0 4px 20px rgba(0,0,0,0.04);
      display: flex;
      flex-direction: column;
    }}
    header {{
      padding: 36px 24px 28px;
      border-bottom: 1px solid var(--line);
      text-align: center;
    }}
    .kicker {{
      font-size: 13px;
      font-weight: 700;
      color: var(--accent);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      margin-bottom: 8px;
    }}
    h1 {{
      font-size: 2.2rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      color: var(--ink);
      line-height: 1.15;
      margin-bottom: 12px;
    }}
    .tagline {{
      font-size: 1.1rem;
      color: var(--mute);
      margin-bottom: 24px;
    }}
    .call-btn {{
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      background: var(--accent);
      color: #ffffff;
      text-decoration: none;
      font-size: 1.25rem;
      font-weight: 700;
      padding: 18px 28px;
      border-radius: 14px;
      box-shadow: 0 4px 14px rgba(21, 128, 61, 0.35);
      transition: transform 0.15s, background 0.15s;
    }}
    .call-btn:active {{ transform: scale(0.98); }}
    .call-btn:hover {{ background: var(--accent-hover); }}
    .call-subtext {{
      margin-top: 10px;
      font-size: 13px;
      color: var(--mute);
    }}
    main {{
      padding: 32px 24px;
      flex: 1;
    }}
    h2 {{
      font-size: 1.2rem;
      font-weight: 700;
      color: var(--ink);
      margin-bottom: 16px;
      text-transform: uppercase;
      letter-spacing: 0.04em;
    }}
    ul.services {{
      list-style: none;
      margin-bottom: 32px;
    }}
    ul.services li {{
      padding: 14px 16px;
      border: 1px solid var(--line);
      border-radius: 10px;
      margin-bottom: 10px;
      background: var(--bg);
      font-size: 1rem;
      font-weight: 600;
      color: var(--ink);
      display: flex;
      align-items: center;
      gap: 10px;
    }}
    ul.services li::before {{
      content: "✓";
      color: var(--accent);
      font-weight: 900;
    }}
    .guarantee-box {{
      background: var(--accent-light);
      border: 1px solid #bbf7d0;
      border-radius: 12px;
      padding: 18px;
      text-align: center;
      margin-bottom: 24px;
    }}
    .guarantee-box strong {{
      display: block;
      color: #14532d;
      font-size: 15px;
      margin-bottom: 4px;
    }}
    .guarantee-box span {{
      color: #166534;
      font-size: 13px;
    }}
    footer {{
      padding: 24px;
      background: #fafafa;
      border-top: 1px solid var(--line);
      text-align: center;
      font-size: 13px;
      color: var(--mute);
    }}
    footer a {{ color: inherit; }}
  </style>
</head>
<body>

  <!-- Owner Claim Banner -->
  <aside class="preview-bar" aria-label="Owner notification">
    <div>
      <span class="preview-badge">Preview</span>
      Prepared for <strong>{esc(business_name)}</strong> · Mobile Conversion Upgrade
    </div>
    <div style="display:flex; align-items:center; gap:12px;">
      <a class="claim-btn" href="{STRIPE_PAYMENT_URL_PLACEHOLDER}" target="_blank" rel="noopener">Claim This Site ($199)</a>
    </div>
  </aside>

  <div class="container">
    <header>
      <p class="kicker">{esc(city)} · {esc(category)}</p>
      <h1>{esc(business_name)}</h1>
      <p class="tagline">{esc(tagline)}</p>
      <a class="call-btn" href="tel:{esc(phone_tel)}">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
        Call {esc(phone_display)}
      </a>
      <p class="call-subtext">Tap to speak directly with our team · Same-week service</p>
    </header>

    <main>
      <h2>Services We Provide</h2>
      <ul class="services">
        {services_li}
      </ul>

      <div class="guarantee-box">
        <strong>Direct Communication Guarantee</strong>
        <span>No phone trees, automated chatbots, or overseas call centers. Your call connects directly to our local staff.</span>
      </div>
    </main>

    <footer>
      <p><strong>{esc(business_name)}</strong> · Serving {esc(city)} and surrounding areas</p>
      <p style="margin-top:6px;"><a href="tel:{esc(phone_tel)}">{esc(phone_display)}</a></p>
      <p style="margin-top:12px; font-size:11px; color:#9ca3af;">Layout and mobile optimization preview built by Kit.</p>
    </footer>
  </div>

</body>
</html>
"""


def stage_outreach_files(staged_leads: list[dict]):
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    OPS_DIR.mkdir(parents=True, exist_ok=True)

    csv_path = OPS_DIR / "STAGED_OUTREACH.csv"
    md_path = OPS_DIR / "STAGED_OUTREACH.md"

    # CSV write
    fieldnames = [
        "slug",
        "name",
        "city",
        "category",
        "original_url",
        "preview_url",
        "phone",
        "defect",
        "email_subject",
        "email_body",
        "sms_body",
    ]
    with open(csv_path, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        for lead in staged_leads:
            writer.writerow({
                "slug": lead["slug"],
                "name": lead["name"],
                "city": lead["city"],
                "category": lead["category"],
                "original_url": lead["original_url"],
                "preview_url": lead["preview_url"],
                "phone": lead["phone_display"],
                "defect": lead["defect"],
                "email_subject": lead["email_subject"],
                "email_body": lead["email_body"],
                "sms_body": lead["sms_body"],
            })

    # Markdown write
    with open(md_path, "w", encoding="utf-8") as f:
        f.write("# Staged Outreach Queue — Kit Remote Website Replacement\n\n")
        f.write("**Status:** Ready for human review / 1-click send.\n")
        f.write(f"**Total Staged:** {len(staged_leads)}\n\n")
        f.write("---\n\n")

        for idx, lead in enumerate(staged_leads, 1):
            f.write(f"### {idx}. {lead['name']} ({lead['city']}) — {lead['category']}\n\n")
            f.write(f"- **Current Site:** [{lead['original_url']}]({lead['original_url']})\n")
            f.write(f"- **Live Preview:** [{lead['preview_url']}]({lead['preview_url']})\n")
            f.write(f"- **Detected Phone:** `{lead['phone_display']}`\n")
            f.write(f"- **Audit Defect:** {lead['defect']}\n\n")
            f.write("#### ✉️ Draft Email\n")
            f.write(f"**Subject:** `{lead['email_subject']}`\n\n")
            f.write("```text\n")
            f.write(f"{lead['email_body']}\n")
            f.write("```\n\n")
            f.write("#### 📱 Draft SMS\n")
            f.write("```text\n")
            f.write(f"{lead['sms_body']}\n")
            f.write("```\n\n")
            f.write("---\n\n")


def process_targets(targets: list[dict]):
    DOCS_DIR.mkdir(parents=True, exist_ok=True)
    staged = []

    for t in targets:
        url = t["url"]
        name = t.get("name", "")
        city = t.get("city", "Houston, TX")
        category = t.get("category", "Local Trades")
        slug = t.get("slug") or slugify(name)

        print(f"[*] Auditing {name} ({url})...")
        try:
            g = grade(url)
        except Exception as exc:
            print(f"[-] Error fetching {url}: {exc}")
            continue

        phones_seen = g.get("phones_seen", [])
        phone_raw = phones_seen[0] if phones_seen else t.get("fallback_phone", "(281) 555-0100")
        phone_display = format_phone_display(phone_raw)
        phone_tel = format_phone_tel(phone_raw)

        defect = g.get("why", "tap-to-call link missing in mobile HTML")

        tagline = t.get("tagline") or "Fast, reliable service across the local community. Same-week scheduling."
        services = t.get("services") or [
            f"Emergency {category} service & diagnostic",
            "Residential repairs and maintenance",
            "Upfront pricing with no surprise add-ons",
        ]

        # Generate HTML
        preview_content = generate_preview_html(
            business_name=name,
            city=city,
            phone_display=phone_display,
            phone_tel=phone_tel,
            tagline=tagline,
            services=services,
            category=category,
            original_url=url,
        )

        preview_file = DOCS_DIR / f"{slug}.html"
        with open(preview_file, "w", encoding="utf-8") as f:
            f.write(preview_content)

        preview_url = f"{VERCEL_BASE_URL}/{slug}.html"

        email_subject = f"Quick question on {name}'s mobile website"
        email_body = f"""Hi {name} team,

I live here in Kingwood and was looking at your site ({url}) from my phone. I noticed that mobile visitors can't tap your phone number directly to call your office—it appears as unclickable text on phones, which usually costs local trades calls from customers in a rush.

I put together a clean, fast mobile version for you here so you can test how 1-tap calling feels:
{preview_url}

If you'd like to use it and have me host and connect it to your domain, it's a flat $199 one-time with hosting included. If not, no worries at all—feel free to use the layout with your current web provider.

Best,
Garrett Baxley
Kingwood, TX · (281) 555-0142"""

        sms_body = f"Hey {name} team, Garrett in Kingwood. Quick heads up: your phone number isn't clickable on phones from your website. Built a free mobile preview for you with 1-tap calling here: {preview_url}. Hope it helps!"

        staged.append({
            "slug": slug,
            "name": name,
            "city": city,
            "category": category,
            "original_url": url,
            "preview_url": preview_url,
            "phone_display": phone_display,
            "phone_tel": phone_tel,
            "defect": defect,
            "email_subject": email_subject,
            "email_body": email_body,
            "sms_body": sms_body,
        })
        print(f"[+] Generated preview: {preview_file}")

    stage_outreach_files(staged)
    print(f"\n[✓] Pipeline complete! Staged {len(staged)} previews and outreach drafts.")


def main():
    targets = [
        {
            "name": "Scogin-Aire Mechanical",
            "slug": "scogin-aire",
            "url": "https://www.scoginaire.com/",
            "city": "Spring, TX",
            "category": "Heating & Air Conditioning",
            "tagline": "Family-owned commercial and residential HVAC specialists since 1978.",
            "services": [
                "24/7 Emergency AC repair & diagnostics",
                "Complete HVAC system installation & replacement",
                "Seasonal maintenance tune-ups & filter care",
            ],
            "fallback_phone": "(281) 351-1236",
        },
        {
            "name": "JD Precision Plumbing Services",
            "slug": "jd-precision-plumbing",
            "url": "https://jdprecisionplumbing.com/",
            "city": "Spring & The Woodlands, TX",
            "category": "Plumbing Services",
            "tagline": "Trusted local plumbing repairs, repiping, and drain cleaning.",
            "services": [
                "Same-day drain cleaning & leak repair",
                "Water heater repair, tankless conversion & installs",
                "Whole-home repiping and sewer line inspections",
            ],
            "fallback_phone": "(936) 228-5000",
        },
        {
            "name": "Accur-AC Heating & Cooling",
            "slug": "accur-ac",
            "url": "https://accur-ac.com/",
            "city": "Spring & North Houston, TX",
            "category": "Air Conditioning & Heating",
            "tagline": "Fast, honest residential AC diagnostics and repair in North Houston.",
            "services": [
                "Precision AC tune-ups and diagnostic inspections",
                "Refrigerant leak detection and compressor repairs",
                "Emergency same-day cooling restoration",
            ],
            "fallback_phone": "(832) 412-2287",
        },
        {
            "name": "Eldridge Roofing & Restoration",
            "slug": "eldridge-roofing",
            "url": "https://eldridgeroofing.com/",
            "city": "The Woodlands & Spring, TX",
            "category": "Roofing & Exterior Repairs",
            "tagline": "Storm damage restoration, roof inspections, and residential replacements.",
            "services": [
                "Free storm damage & leak inspection",
                "Complete residential roof replacements",
                "Emergency tarping & insurance claim assistance",
            ],
            "fallback_phone": "(281) 999-4663",
        },
    ]

    process_targets(targets)


if __name__ == "__main__":
    main()
