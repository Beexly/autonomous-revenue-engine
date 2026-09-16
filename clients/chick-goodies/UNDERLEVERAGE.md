# UNDERLEVERAGE — 2026-09-16 full pass

Not another recap of files we wrote. This is what was sitting in public
that we never used, plus engine rails we never touched.

## Client research we skipped (Shopify-only scrape)

We treated charcuteriechick.ai as the whole business. It is the worst
surface she has.

| Surface | What is there | What we shipped |
|---|---|---|
| The Knot | 5.0 / 13 reviews, Best of Weddings 2026, 136 photos, $500 start, $2,350 typical, 100-mile travel, dietary list, breakfast + sundae bar reviews | Nothing until this pass |
| WeddingWire | 5.0 / 11 reviews, 100% recommend, **960px event photos** (Holy Grail, cart, cups, waffle/breakfast boards, halal graze, cheesecakes) | Nothing. WW CDN 403 from our IP; Knot 945×720 images now in `img/knot-*.jpg` |
| Instagram | @charcuteriechickhtx | Missing from all three samples until this pass |
| Knot second IG | ssminnow1970 | Unconfirmed personal — not on the site |
| Her own bio | "Houston's largest charcuterie cart"; one party at a time; scratch jams | Never quoted |
| Real reviews | Nicole M. funeral board; Jake S. breakfast buffet + ice cream sundae wedding | We used three Shopify "1 Reviews" names |

Do **not** reprint Knot's "532 foods" or "11–20 team" — those may be marketplace template fields (Shopify already garbled 532 into "Testy Foods").

## Engine rails sitting idle while we HTML-fiddled

| Asset | Why it matters | Status |
|---|---|---|
| `apps/kit` + kit.html | The $350 Woodlands walk-in machine this whole repo is for | Unused on this client; we hand-built instead of Kit-swapping name/phone |
| `ops/LOCAL_PITCH.md` still $350 | Conflicts with quoted $150/$600 | Client file wins for Chick; pitch file still wrong for the next walk-in |
| PR #45 Kit cinematic | Motion/art direction for Kit | Draft, not stolen, not shipped |
| PR #48 growth-ops SQL/n8n | Right *after* she is live and paying | Correctly unmerged; do not pretend it is the site |
| PR #39 $19 Gumroad CTA | SO-001 $0 sales | Unrelated to Chick; still the actual cash bottleneck in memory |
| ImgBot PR #44 | Compress her photos | Open, unused |
| SignPreview / Vow | Wedding vendor cross-sell | She *is* a wedding caterer on The Knot. Never offered Kit to her as a vendor site; we rebuilt her catering page instead (correct job) but never noted the Vow/SignPreview overlap |
| 13 other open PRs | CI, SO publish gate, Doug, fifty loops | Stale since August. Not this client's problem; they are the engine rotting |

## Hermes

Skills now: `clone-website`, `open-lovable`, `cinematic-production-discipline`, `modlens-vision`.
This session cannot load new skills until a new chat.
Gemini credits depleted — `IMG_7724.jpeg` still unread.
Voice-clone repos classified, not installed.

## Do next (order)

1. She picks sample 1 / 2 / 3.
2. Pull Knot/WW photo zip from her vendor dashboards (945px is still not camera-roll).
3. Confirm Outlook email + which Instagram is public.
4. Next Kit walk-in: use Kit, not a custom repo. LOCAL_PITCH $350 stays for lawn/HVAC; Chick is a one-off quote.
