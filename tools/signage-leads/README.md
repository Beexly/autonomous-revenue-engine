# Signage Lead Finder — OSINT Sweep

Free, zero-API-key prospect finder for signage lanes (sign shops, wedding venues,
retail storefronts) in the Humble / Atascocita / Kingwood, TX area.

## Bounding Box

Target area: **30.0–30.15°N, 95.35–95.10°W** (Humble, Atascocita, Kingwood, TX)

## How It Works

1. Fetches POIs from the Overpass API (OpenStreetMap) — free, no key required.
2. Checks each prospect's website for quality (full / placeholder / social-only / none).
3. Scores each prospect: no website = high score; full website = low score.
4. Writes `leads.csv` sorted by score.

## How to Run

```bash
python3 tools/signage-leads/find-leads.py
```

Output: `tools/signage-leads/leads.csv`

## Re-run for New Areas

Edit the `BBOX` variable in `find-leads.py`:

```python
BBOX = (30.0, -95.35, 30.15, -95.10)  # minLat, minLon, maxLat, maxLon
```

Or change the `OVERPASS_QUERY` to search different categories.

## Output Columns

| Column | Description |
|---|---|
| `name` | Business name |
| `category` | Category (Sign Shop, Wedding Venue, etc.) |
| `address` | Street address or coordinates |
| `lat` / `lon` | Geographic coordinates |
| `phone` | Phone number from OSM |
| `has_website` | Whether a homepage was found |
| `site_quality_flag` | `none`, `placeholder`, `social_only`, or `full` |
| `score` | Priority score (higher = better prospect) |
| `notes` | Quality check notes |

## How Scores Work

| Website Quality | Score | Reasoning |
|---|---|---|
| `none` (no website) | 70 | No online presence → highest outreach value |
| `placeholder` (template) | 55 | Basic site exists but no content → good target |
| `social_only` | 40 | Social presence only → medium value |
| `full` (working website) | 20 | Already online → lower priority |

Category bonuses:
- Wedding venues/vendors: +15
- Sign shops: +10

## Zero API Keys Required

This script uses:
- Overpass API (free, public) — standard OSM data
- urllib (Python stdlib) — no additional dependencies

`pip install` is not needed. Python 3.6+ works out of the box.
