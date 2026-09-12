#!/usr/bin/env python3
"""
Signage Lead Finder — OSINT sweep for sign shops, wedding venues, and retail storefronts
in the Humble/Atascocita/Kingwood, TX area using Overpass API (OpenStreetMap).

Output: leads.csv with columns: name, category, address, lat, lon, phone, has_website,
site_quality_flag, score, notes

Zero API keys required — uses free Overpass API.
"""

import csv
import json
import time
import urllib.request
import urllib.parse
import urllib.error
import sys
from dataclasses import dataclass
from typing import Optional, List
from concurrent.futures import ThreadPoolExecutor, as_completed

# ─── Configuration ──────────────────────────────────────────────────
# Target bbox: Humble / Atascocita / Kingwood, TX (approx)
# 30.0–30.15 N, -95.35–-95.10 W
BBOX = (30.0, -95.35, 30.15, -95.10)
OVERPASS_URL = "https://overpass-api.de/api/interpreter"

# Query for sign shops, wedding venues/planners, retail storefronts
OVERPASS_QUERY = f"""
[out:json][timeout:60];
(
  node["shop"="sign_maker"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["shop"="wedding"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["amenity"="wedding_venue"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["amenity"="events_venue"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["shop"="retail"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["shop"="beauty"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["shop"="hairdresser"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["shop"="florist"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["amenity"="restaurant"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["shop"="bakery"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["office"="real_estate"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["shop"="coffee"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["shop"="auto_parts"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["shop"="car_repair"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["amenity"="fuel"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["shop"="convenience"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
  node["shop"="grocery"]({BBOX[0]},{BBOX[1]},{BBOX[2]},{BBOX[3]});
);
out center;
"""

# Categories we care about
CATEGORIES = {
    'sign_maker': 'Sign Shop',
    'wedding': 'Wedding Vendor',
    'wedding_venue': 'Wedding Venue',
    'events_venue': 'Events Venue',
    'retail': 'Retail Storefront',
    'beauty': 'Beauty/Salon',
    'hairdresser': 'Hairdresser/Salon',
    'florist': 'Florist',
    'restaurant': 'Restaurant',
    'bakery': 'Bakery',
    'real_estate': 'Real Estate',
    'coffee': 'Coffee Shop',
    'auto_parts': 'Auto Parts',
    'car_repair': 'Auto Repair',
    'fuel': 'Gas Station',
    'convenience': 'Convenience Store',
    'grocery': 'Grocery Store',
}

# ─── Data Classes ───────────────────────────────────────────────────
@dataclass
class Lead:
    name: str
    category: str
    address: str
    lat: float
    lon: float
    phone: str
    has_website: bool
    site_quality_flag: str  # 'none', 'placeholder', 'social_only', 'full'
    score: int
    notes: str

# ─── Overpass API ──────────────────────────────────────────────────
def fetch_overpass():
    """Fetch POIs from Overpass API."""
    print("Fetching POIs from Overpass API...")
    data = urllib.parse.urlencode({'data': OVERPASS_QUERY}).encode()
    req = urllib.request.Request(OVERPASS_URL, data=data, headers={'User-Agent': 'SignageLeadFinder/1.0'})
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            result = json.loads(resp.read().decode())
        print(f"  Found {len(result.get('elements', []))} elements")
        return result.get('elements', [])
    except Exception as e:
        print(f"Error fetching Overpass: {e}")
        return []

# ─── Website Presence Check ────────────────────────────────────────
def check_website(url: str, timeout: int = 5) -> tuple:
    """
    Check if a website is accessible and classify its quality.
    Returns (has_website, quality_flag, notes)
    """
    if not url:
        return False, 'none', 'No website in OSM tags'

    # Normalize URL
    if not url.startswith(('http://', 'https://')):
        url = 'https://' + url

    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'SignageLeadFinder/1.0'})
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            content = resp.read().decode('utf-8', errors='ignore').lower()
            status = resp.status

        if status != 200:
            return False, 'placeholder', f'HTTP {status}'

        # Check for placeholder/template indicators
        placeholder_indicators = [
            'under construction', 'coming soon', 'this domain is for sale',
            'default page', 'placeholder', 'godaddy', 'wixsite', 'squarespace',
            'wordpress.com', 'blogspot.com', 'weebly.com', 'site123.com',
        ]
        for ind in placeholder_indicators:
            if ind in content:
                return True, 'placeholder', f'Placeholder detected: {ind}'

        # Check for social-only (Facebook page, Instagram link, etc.)
        social_indicators = [
            'facebook.com/', 'instagram.com/', 'twitter.com/', 'linkedin.com/',
            'yelp.com/', 'maps.google.com/', 'goo.gl/maps'
        ]
        social_count = sum(1 for s in social_indicators if s in content)
        if social_count >= 2 and 'contact' not in content:
            return True, 'social_only', 'Primarily social media presence'

        # Has actual website
        return True, 'full', 'Functional website'

    except urllib.error.HTTPError as e:
        return False, 'none', f'HTTP {e.code}'
    except urllib.error.URLError as e:
        return False, 'none', f'URL Error: {e.reason}'
    except Exception as e:
        return False, 'none', f'Error: {type(e).__name__}'

# ─── Scoring ────────────────────────────────────────────────────────
def score_lead(lead: Lead) -> int:
    """
    Score each prospect:
    - no website = high (70)
    - placeholder = medium-high (55)
    - social_only = medium (40)
    - full website = low (20)
    - wedding venue/category = +15
    - sign shop = +10
    """
    score = 0

    # Base score by website quality
    if lead.site_quality_flag == 'none':
        score = 70
    elif lead.site_quality_flag == 'placeholder':
        score = 55
    elif lead.site_quality_flag == 'social_only':
        score = 40
    else:  # full
        score = 20

    # Category boosts
    if lead.category in ('Wedding Venue', 'Wedding Vendor', 'Events Venue'):
        score += 15
    elif lead.category == 'Sign Shop':
        score += 10

    # Cap at 100
    return min(100, score)

# ─── Main Pipeline ──────────────────────────────────────────────────
def main():
    print("=" * 60)
    print("Signage Lead Finder — OSINT Sweep")
    print(f"Target BBOX: {BBOX}")
    print("=" * 60)

    # 1. Fetch POIs
    elements = fetch_overpass()
    if not elements:
        print("No elements found. Exiting.")
        return

    # 2. Parse elements into leads
    leads: List[Lead] = []
    for el in elements:
        tags = el.get('tags', {})
        name = tags.get('name', 'Unknown')
        if not name or name == 'Unknown':
            continue

        # Get coordinates
        lat = el.get('lat') or el.get('center', {}).get('lat')
        lon = el.get('lon') or el.get('center', {}).get('lon')
        if not lat or not lon:
            continue

        # Determine category
        category = 'Other'
        for key, cat in CATEGORIES.items():
            if tags.get(key.split('=')[0]) == key.split('=')[1] if '=' in key else tags.get(key):
                category = cat
                break

        # Get address
        address_parts = []
        for k in ['addr:housenumber', 'addr:street', 'addr:city', 'addr:state', 'addr:postcode']:
            if tags.get(k):
                address_parts.append(tags[k])
        address = ', '.join(address_parts) if address_parts else f"{lat:.4f}, {lon:.4f}"

        # Get phone
        phone = tags.get('phone', '') or tags.get('contact:phone', '')

        # Get website
        website = tags.get('website', '') or tags.get('contact:website', '')

        lead = Lead(
            name=name,
            category=category,
            address=address,
            lat=lat,
            lon=lon,
            phone=phone,
            has_website=False,  # Will be set after check
            site_quality_flag='none',
            score=0,
            notes=''
        )
        leads.append((lead, website))

    print(f"Parsed {len(leads)} potential leads")

    # 3. Check website presence (parallel, limited concurrency)
    print("Checking website presence...")
    checked_leads: List[Lead] = []

    with ThreadPoolExecutor(max_workers=5) as executor:
        future_to_lead = {}
        for lead, website in leads:
            future = executor.submit(check_website, website)
            future_to_lead[future] = lead

        for future in as_completed(future_to_lead):
            lead = future_to_lead[future]
            try:
                has_website, quality, notes = future.result()
                lead.has_website = has_website
                lead.site_quality_flag = quality
                lead.notes = notes
                lead.score = score_lead(lead)
                checked_leads.append(lead)
            except Exception as e:
                lead.site_quality_flag = 'error'
                lead.notes = f'Check failed: {e}'
                lead.score = 0
                checked_leads.append(lead)

    # 4. Sort by score descending
    checked_leads.sort(key=lambda x: x.score, reverse=True)

    # 5. Write CSV
    output_file = 'leads.csv'
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([
            'name', 'category', 'address', 'lat', 'lon', 'phone',
            'has_website', 'site_quality_flag', 'score', 'notes'
        ])
        for lead in checked_leads:
            writer.writerow([
                lead.name,
                lead.category,
                lead.address,
                lead.lat,
                lead.lon,
                lead.phone,
                lead.has_website,
                lead.site_quality_flag,
                lead.score,
                lead.notes
            ])

    print(f"\n✅ Written {len(checked_leads)} leads to {output_file}")

    # 6. Summary stats
    by_quality = {}
    by_category = {}
    for lead in checked_leads:
        by_quality[lead.site_quality_flag] = by_quality.get(lead.site_quality_flag, 0) + 1
        by_category[lead.category] = by_category.get(lead.category, 0) + 1

    print("\n── Quality Distribution ──")
    for q, c in sorted(by_quality.items()):
        print(f"  {q}: {c}")

    print("\n── Category Distribution ──")
    for cat, c in sorted(by_category.items(), key=lambda x: -x[1]):
        print(f"  {cat}: {c}")

    print(f"\nTop 10 by score:")
    for i, lead in enumerate(checked_leads[:10]):
        print(f"  {i+1}. {lead.name} ({lead.category}) — Score: {lead.score} — {lead.site_quality_flag}")

    if len(checked_leads) >= 50:
        print(f"\n✅ Acceptance criteria met: {len(checked_leads)} prospects (≥50)")
    else:
        print(f"\n⚠️  Only {len(checked_leads)} prospects (<50) — may need larger bbox")

if __name__ == '__main__':
    main()