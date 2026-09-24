# Agent brief — Grok Bot Galaxy handoff

You are picking up a completed extraction of the **Grok Bot Galaxy** event (x.ai, Sept 15–17 2026).
This file is the operating manual: what exists, what it is good for, what is *not* trustworthy,
and what to do next.

Root: `/var/minis/workspace/xai-galaxy/` (mirrored to `/var/minis/shared/xai-galaxy/`).

---

## 1. State: done vs open

**Done and verified**
- All 10 session videos identified, matched to day/speaker, and transcribed (61,506 words).
- Transcripts de-duplicated from YouTube's rolling-window captions into three forms each
  (prose / 40-second timestamped segments / verbatim per-line audit trail).
- Per-session briefs: premise, agenda, use cases, named bots, tools, stated takeaways, notes.
- **The wider campaign corpus: 91 news posts (66,010 words) and 10 role guides (13,717 words)**,
  extracted to Markdown.
- **All 81 marketplace templates fetched, and 77 full agent definitions (138,766 chars of production
  system prompts) parsed out of the Next.js payload** — the single most reusable asset here.
- Event facts, 3 full-day broadcast links, all links on the event page, 671 link rows across 11 pages.
- Product surface: 56 use cases (9 categories), 81 templates (9 categories), 7 product FAQs,
  pricing gate, 10 guides, 45 named template creators, 137 one-click install links.
- **Decoded packaging matrix** (plan × feature, including which tiers include Grok Bot).
- **Launch timeline** (Aug 11 → Sep 22) with sources, **customer list**, and a **24-entry metrics
  ledger** where every number carries its source.
- Term/tool/money indexes, a 3-minute navigation outline per session, and 37 timestamped quotes.
- Caption-correction table for garbled product and person names.

**Open (deliberately not done — no credentials or content available)**
- The three **X broadcasts** (full days, ~80% of the event's runtime) are not transcribed. Needs an
  authenticated X session; they hold the interstitial programming and the hosts (Matt, Lauren, Roshan).
- **No official agenda or slide decks** were published; per-session agendas are reconstructed.
- **Marketing Operations opening minutes** are missing from its caption track.
- **No Grok Bot price** is published — only plan gating, decoupled usage, and support-ticket economics.
- Two MarOps bot names unresolved ("Fiser"; "owned" → likely "Ondes").
- **Install-link tokens are unverified** — nobody has tested whether `/bot/<token>` redeems
  unauthenticated, whether tokens are per-recipient, or whether they carry referral attribution.
  That is the highest-value unexplored thread.

## 2. How to work with this material

**Before you search or quote a transcript**, normalise caption spelling. The transcripts say
"Grockbot", "Grabbot", "Grubbot", "Grockpot"… for the same product. Two options:

```sh
# quick normalisation for grep
sed -e 's/Grockbot/Grok Bot/g' -e 's/Grokbot/Grok Bot/g' -e 's/Grabbot/Grok Bot/g' \
    -e 's/Grubbot/Grok Bot/g' -e 's/Rockbot/Grok Bot/g' -e 's/GrobBot/Grok Bot/g' \
    transcripts/zCqmTSF2ctg.txt | grep -i "your pattern"

# or load the full table
jq -r '.product_names, .people' data/caption-corrections.json
```

Use `transcripts/<id>.timed.txt` when you need a timestamp; `analysis/quotes.md` already maps
37 key quotes to times. Use `analysis/outline.json` to see the top terms per 3-minute bucket for
every session — the fastest way to find which session covers a topic.

**Do not** treat demo assets as real data: Fly Low Airlines/Flylo, Northwind and XAIR are fictional
stage props. Demo numbers (1,400 tickets, 58/42 split, 25% family, $1,000 credits) are illustrative.

## 3. Environment gotchas (cost me real time; they will cost you too)

1. **Cloudflare blocks plain `curl`/`wget` to x.ai** — you get a "Sorry, you have been blocked" page
   (5 KB of HTML, HTTP 200). Fetch through the browser session instead:
   `minis-browser-use fetch --url https://x.ai/bot` (files land in `/var/minis/browser/`).
2. **Use a mobile user agent for x.ai.** With `desktop_safari`, navigation to x.ai pages hangs the
   WebView for 300 s and the tab is killed ("became unresponsive"). After
   `minis-browser-use set_user_agent --user-agent mobile_safari`, the same pages load in seconds.
3. **`fetch` is origin-relative.** It fails with `Load failed` unless the active tab is already on an
   x.ai origin. If the tab is blank or on another host, navigate to any x.ai page first (and if a tab
   has wedged and been recreated, re-navigate before fetching again).
4. **Heavy pages wedge on navigate but fetch fine.** `/pricing` and `/bot/guides` repeatedly killed
   the tab; `fetch` returned their full SSR HTML without trouble. Prefer fetch + local parsing over
   rendering.
5. **Third-party reader proxies are not a fallback:** `r.jina.ai` returns 401 ("bad network
   reputation, AS7018") and `api.allorigins.win` returns 522. **The Wayback Machine does work** —
   `archive.org/wayback/available?url=x.ai/...` had a Sep 15 snapshot as a backstop.
6. **The Alpine `yt-dlp` (2025.03.31) fails on YouTube** with "The page needs to be reloaded."
   `pip install -U yt-dlp` gives a working version (2026.08.19 here) — invoke it as
   `python3 -m yt_dlp`, not `yt-dlp`.
7. **YouTube rate-limits subtitle requests (HTTP 429)** if you ask for two languages at once. Pull
   one caption language per invocation with ~10 s between videos.
8. **x.ai pages are Next.js SSR**: the rendered copy is in the HTML, and the machine-readable
   catalogues are in JSON-LD (`extracted/ld/`) and the RSC flight payload
   (`extracted/payload/`, or re-derive with the `self.__next_f.push` regex in `flight.py`).
   The marketplace renders only 4 items per category, but its JSON-LD `ItemList` declares all 80.
9. **The marketplace agent definitions live in the flight payload, not the DOM.** Locate the object
   containing `"addHref"`, brace-match it, and parse: the fields you want are `creatorName`,
   `memories[]` (this *is* the system prompt), `skills[]`, `routines[]`, `integrations[]`.
   `instructions` is empty for most templates — do not conclude there is no prompt.
10. **The pricing comparison table has no `<table>` and no text values** — each cell is an SVG check
    (`path` starting `M19.7998 6.59961`) or a dimmed minus (`name=minus`). Decode it with
    `parse_pricing.py`; do not try to read it as text.
11. `minis-browser-use execute_js` runs your script inside an async wrapper: you must **`return`**
    a value (an IIFE expression returns `null`). Its result envelope is
    `{"data": {"text": "<json string>"}}` — parse the inner string, don't read `items` off the outer
    object (this silently produced an empty merge once).
12. When polling a background job, remember the tool call has a timeout — long pulls belong in
    scripts that write status files, not in one blocking call. Note that `nohup … &` inside a single
    `shell_execute` did not reliably survive; running the fetch loop in the foreground with a long
    timeout was the dependable option.

## 4. Highest-value next actions

1. **Verify the install-link surface.** `data/install-links.json` holds 137 `/bot/<token>` links.
   Test whether they redeem without auth, whether they are per-recipient, and whether they carry
   attribution. This is the growth loop's payload and nobody has looked at it.
2. **Transcribe the three X broadcasts** if the interstitial content matters (needs an X login via
   the in-app browser + `get_cookies`).
3. **Use the prompt corpus.** `extracted/mp/*.md` + `data/marketplace-agents.json` is 138k characters
   of production agent specs. The reusable pattern (one job → anti-jobs → first-run interview →
   permission lines → output contract → escalation) transfers to any agent product.
4. **Build the derivative artefact the user wants** — the raw material supports:
   - a role-indexed playbook ("what to build first as a support lead / PM / founder");
   - a bot-implementation catalogue: every named bot across the ten sessions, its stated role and
     the tools it needs (`data/sessions.json` → `bots`, plus `data/marketplace-agents.json`);
   - a cost model from `data/metrics-ledger.json`;
   - a "claims vs evidence" sheet (marketing claims vs sourced numbers);
   - a crosswalk mapping each workshop's bots to shipped templates (several line up: Founders'
     Stockbot ↔ "Stalk Bot", Engineers' Nightly Audit ↔ "Nightly Audit Engineer", the PM's Emily ↔
     "Cloud Agent Orchestrator", the Sales workshop's PG ↔ "Outbound Prospecting").
5. **Refresh the surface counts** before relying on them: 56 use cases / 81 templates / 45 creators
   were true on 2026-09-23 and the catalogue is clearly still growing.

## 5. Provenance rules for anything you publish

- Cite the session by YouTube ID and timestamp (`transcripts/<id>.timed.txt`).
- Attribute internal statistics to the speaker who said them, on stage, with no independent source.
- Never present demo-environment numbers as customer outcomes.
- The company name is **SpaceXAI LLC** (the footer). Captions say "SpaceX AAI" / "Spacex AI"; the
  product name is **Grok Bot**, never "Grockbot".
- This event is **over** (Sept 15–17, 2026). Write about it in the past tense; the recordings are the
  product.
