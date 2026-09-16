# AUDIT — charcuteriechick.ai

Checked by hand 2026-09-15. Every finding below has a line of evidence; re-run
the check before repeating a claim. Platform: Shopify. Outcome for the client:
prices read as broken, the gallery is placeholder text, and the highest-ticket
product has no way to enquire.

| # | Finding | Evidence (checked 2026-09-15) | Why it costs money |
|---|---|---|---|
| 01 | Four products publish at **$0.00** — Easy order boards, Apple Pie, Charcuterie Chick board, Catering Menu | product tiles on `/` and `/pages/menu`, all four pricing at $0.00 | A price of free reads as a broken shop; nobody trusts checkout |
| 02 | **Fifteen** "Gallery Title / Category" placeholders live | `Gallery Title` ×6 on `/`, ×9 on `/pages/gallery` | Bride sees unfinished template, not a caterer |
| 03 | Stat block belongs to another business | "532+ Popular **Testy** Foods Menu", "6534+ Satisfied Our Global Customers", "432+ Foods Items Online Orders", "25+ Years Of Experience" on `/` and `/pages/about-us` | Contradicts her own 35 years and reads as a template |
| 04 | Homepage repeats the same 12 products ×3 (36 tiles) | `/`, three identical product blocks | Dilutes page relevance for search and for humans |
| 05 | Every product labelled "(1 Reviews)" | `/` and `/pages/menu` product tiles | Fake-looking social proof |
| 06 | Her real photos are unused on the homepage gallery | image files `Shrimp_Food_Prawns`, `Link_5` … `Link_10` served on `/`; nine real event photos on `/pages/gallery` | Free credibility, thrown away |
| 07 | Footer "Faqs" link → **404** | `GET /pages/faqs` → HTTP 404 | Broken link in every page footer |
| 08 | Blog pager renders a template error | `/blogs/news` → `NaN` / `of-Infinity`; 3 posts, all dated Aug 30 2025, each listed twice | Visible bug to any visitor who scrolls |
| 09 | The **$2,000–$3,500** grazing table has no enquiry form | `/pages/grazing-table` — only "Call for order" | Biggest ticket, zero lead capture |
| 10 | Phone number renders with no space: `Call For Order832-458-8180` | homepage header | Small, but it reads as unpolished |
| 11 | Page titles carry stray whitespace/line breaks | `<title>` on `/` | Weakens the search snippet |
| 12 | Footer links to a "Menu Fastfood" collection | homepage footer | Off-brand for a caterer |

## What was fixed in the build already

- Real prices for the eight priced items; the four $0.00 items now read "ask"
  instead of free (see `FACTS.md`).
- Her real photos only — 12 of them, no stock, no AI imagery.
- Stat block replaced with four verified facts (35 / 90 / 50 / 150).
- Enquiry form on the page, wired to SMS, so the grazing-table lead lands on
  Tricia's phone instead of nowhere.
- Real FAQ section with schema (the 404'd page, done properly).

## What is still open on the paid build ($600)

- Fix the live Shopify: prices, gallery captions, stat block, 404, blog pager,
  duplicate product blocks, footer collection.
- New high-resolution photography (her files cap at 480×640 — see `ASSETS.md`).
- Google Business Profile claim/update and the social funnel (`SEO.md`).
- Real metrics from Tricia to replace the four placeholder facts.
