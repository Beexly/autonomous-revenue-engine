# Grok Bot Galaxy — complete extraction package

Everything recoverable about **Grok Bot Galaxy** (x.ai, Sept 15–17 2026): the event, all ten
livestream workshops with full transcripts, the three full-day broadcasts, and the product surface
the talks reference. Built to be picked up cold by another agent.

**Source of record:** <https://x.ai/galaxy> (the page the follow-up email points at;
`utm_campaign=20260921_Grok-Bot-Galaxy-Livestream-Follow-Up`).
**Collected:** 2026-09-23.

---

## Read these first

| If you want to… | Open |
| --- | --- |
| Understand the whole package and its caveats | [`AGENT-BRIEF.md`](AGENT-BRIEF.md) |
| See what the first pass missed and what it's worth | [`analysis/under-leveraged.md`](analysis/under-leveraged.md) |
| Get the event facts (dates, venue, agenda, links) | [`data/event.json`](data/event.json) |
| Work per session | [`sessions/`](sessions) — one file per workshop |
| Read or quote a session | [`transcripts/`](transcripts) — prose, timestamped, and verbatim |
| See what repeats across all ten talks | [`analysis/cross-session.md`](analysis/cross-session.md) |
| Understand the six-week launch campaign | [`analysis/launch-timeline.md`](analysis/launch-timeline.md) |
| Understand packaging, pricing and distribution | [`analysis/revenue-mechanics.md`](analysis/revenue-mechanics.md) |
| Mine the 77 production agent prompts | [`analysis/agent-prompt-corpus.md`](analysis/agent-prompt-corpus.md) |
| Look up any term, category or system | [`analysis/glossary.md`](analysis/glossary.md) |
| Fix garbled caption names before quoting | [`data/caption-corrections.json`](data/caption-corrections.json) |
| Find a verbatim quote fast | [`analysis/quotes.md`](analysis/quotes.md) |
| Check any number's source | [`data/metrics-ledger.json`](data/metrics-ledger.json) |
| Browse bots / use cases / install links | [`data/marketplace-agents.json`](data/marketplace-agents.json), [`data/use_cases.json`](data/use_cases.json), [`data/install-links.json`](data/install-links.json) |
| Every link on every page | [`data/links.json`](data/links.json) |

## The event in one paragraph

Grok Bot Galaxy was a three-day event (Sept 15–17, 2026, 8:45am–6:00pm PT) at The Howard,
661 Howard Street, San Francisco, livestreamed for remote viewers, run by SpaceXAI LLC (x.ai) to
launch and teach **Grok Bot** — a product where each "bot" is an AI teammate with its own cloud
computer, its own memory and its own job, messaged like a colleague. Ten role-specific workshops
were published individually on YouTube (published Sept 21, 2026, four to six days after the event);
the full days live on as three X broadcasts.

## …but the event is one node in a six-week campaign

The first pass studied the event. The second pass found the campaign around it, which is the more
useful artefact: **launch in beta (Aug 11) → widen access to every paid plan (Aug 26) → X integration
(Aug 29) → enterprise launch with governance and named logos (Sep 3) → hard-numbers proof posts
(Sep 4 procurement, Sep 22 support) → the three-day teaching event (Sep 15–17) → follow-up email
(Sep 21)**, with ten role guides published throughout. Full chronology in
[`analysis/launch-timeline.md`](analysis/launch-timeline.md); the monetisation and distribution
mechanics in [`analysis/revenue-mechanics.md`](analysis/revenue-mechanics.md).

**The scale of the wider corpus:** 91 news posts (66,010 words), 10 guides (13,717 words),
**81 marketplace templates whose full agent definitions — including 77 production system prompts,
138,766 characters — are recoverable**, 56 use cases, 45 named template creators, and 137 one-click
install links.

## The ten sessions

| Day | Session | Speaker(s) | Length | Words | Transcript |
| --- | --- | --- | --- | --- | --- |
| 1 | Grok Bot for Engineers | Lingxi Li | 45:10 | 7,331 | [`zCqmTSF2ctg`](sessions/zCqmTSF2ctg.md) |
| 1 | Grok Bot for Product Managers | Kevin Niparko, Roshan Sadanani | 35:12 | 7,182 | [`gNysgEu-lew`](sessions/gNysgEu-lew.md) |
| 1 | Grok Bot for Founders | Shub Gaur | 37:14 | 7,721 | [`hPE3A4Smkxc`](sessions/hPE3A4Smkxc.md) |
| 2 | Grok Bot for Sales Engineers | Amrita Venkatraman | 45:58 | 9,573 | [`tpDfoh5qPF8`](sessions/tpDfoh5qPF8.md) |
| 2 | Grok Bot for Sales | Krista Letz, Mark Wright | 21:07 | 4,004 | [`SVZe46xaVTg`](sessions/SVZe46xaVTg.md) |
| 2 | Grok Bot for SDRs | Simon Lackowski | 34:04 | 7,174 | [`Iia8EF7niiA`](sessions/Iia8EF7niiA.md) |
| 2 | Grok Bot for Customer Support | David Gan | ~30:47 | 4,190 | [`BSB--jUnx9U`](sessions/BSB--jUnx9U.md) |
| 3 | Grok Bot for Marketing Operations | Matthew Silberman, Teresa Hsu | ~21:24 | 3,544 | [`EA-sxwWK0Vs`](sessions/EA-sxwWK0Vs.md) |
| 3 | Grok Bot for Post Sales | Blake Schuller | ~29:59 | 5,607 | [`EGt8FfTmTMY`](sessions/EGt8FfTmTMY.md) |
| 3 | Grok Bot for Marketing | Josh Kim | ~29:34 | 5,180 | [`db38-FgdaGQ`](sessions/db38-FgdaGQ.md) |

Total: **61,506 words** of transcript, roughly **5 hours 30 minutes** of talking. Durations marked `~`
are measured from the last caption timestamp (YouTube metadata was captured for the other six);
see `data/video-metadata.json`.

**Full-day broadcasts (X):** Day 1 `1AxRnZbVpjaxl` · Day 2 `1PKqrNyvmYwGb` · Day 3 `1YGNrbXEeazGw`
— see [`data/broadcasts.json`](data/broadcasts.json).

## What's in the box

```
sessions/        10 × per-session brief: premise, agenda, use cases, bots, tools, takeaways, notes
transcripts/     10 × 3 files: .txt (prose) · .timed.txt (40s segments) · .raw.txt (verbatim lines)
data/            event · broadcasts · sessions index · video metadata · launch timeline · customers ·
                 metrics ledger (24 sourced numbers) · packaging matrix · guides index · creators ·
                 81 marketplace agents with full prompts · install links · use cases · caption
                 corrections · every harvested link
analysis/        under-leveraged findings · launch timeline · revenue mechanics · agent prompt corpus ·
                 glossary · cross-session synthesis · quotes with timestamps · term/tool indexes ·
                 per-session term stats · 3-minute navigation outlines
extracted/       news/ (83 posts) · guides/ (10) · mp/ (81 agent definitions) · page Markdown ·
                 links.tsv · JSON-LD · Next.js flight payloads
raw/             original HTML: pages/ (11) · news/ (91) · guides/ (10) · mp/ (81) + caption VTTs in yt/
*.py / *.sh      the reproducible pipeline (see "How it was built")
```

649 files, ~46 MB (~8 MB excluding the raw HTML dumps and caption VTTs). Nothing here is hand-typed
from memory: the narrative documents were written from the sources, and every count, timestamp and
catalogue size is computed from the artefacts.

## Reproducing / extending

| Script | Does |
| --- | --- |
| `fetch_yt.sh`, `fetch_rest.sh` | pull captions + metadata for the 10 videos via `python3 -m yt_dlp` |
| `vtt2txt.py` | de-duplicate YouTube's rolling-window captions into prose/timed/verbatim transcripts |
| `analyze.py` | term, tool, domain, money indexes + 3-minute navigation outlines |
| `find_quote.py` | locate verbatim phrases in the timed transcripts and emit `analysis/quotes.md` |
| `html2md.py`, `flight.py`, `ld.py` | page extraction: Markdown, Next.js RSC payload, JSON-LD catalogues |
| `fetch_list.sh` | fetch a list of x.ai paths through the browser session (used for 83 news, 10 guides, 81 bots) |
| `extract2.py` | extract the news + guides corpus to Markdown and link tables |
| `parse_mp.py` | **parse the marketplace flight payload into full agent definitions (77 prompts)** |
| `parse_pricing.py` | decode the check/minus comparison matrix into `data/packaging-matrix.json` |
| `make_deep_data.py` | build launch timeline, customers, metrics ledger, guides index, creators, install links |
| `gen_sessions.py`, `make_data.py` | build `sessions/*.md` and `data/*.json` |
| `gen_dashboard.py` | build `index.html` |

**The fetch path matters.** x.ai sits behind Cloudflare: plain `curl` returns a 5 KB "blocked" page
with HTTP 200, and the browser only succeeds on a **mobile user agent** with the tab already sitting
on an x.ai origin (`fetch` is origin-relative). Heavy pages (`/pricing`, `/bot/guides`) wedge the
WebView on navigation but fetch fine as raw HTML. YouTube rejects the Alpine-packaged yt-dlp
(2025.03.31, "the page needs to be reloaded") — `pip install -U yt-dlp` (2026.08.19) and call it as
`python3 -m yt_dlp`, one caption language per call with ~10 s between videos or you get HTTP 429.
Full detail in `AGENT-BRIEF.md`.

## Known discrepancies worth knowing before you write anything

- **YouTube titles differ from the site's titles** for 3 of 10 sessions: site says
  "Grok Bot for Product Managers" / YouTube says "Grok for Product Managers"; site says
  "Grok Bot for Post Sales" / YouTube says "Grok bot for Post Sales" (lowercase b). The rest match.
- **The transcripts are auto-captions only.** "Grok Bot" alone appears as nine different spellings,
  and every personal name is mangled. Apply `data/caption-corrections.json` first.
- **The Marketing Operations caption track starts mid-sentence**, so its opening minutes are missing.
- **The three X broadcasts are not transcribed** — they need an authenticated X session, and they hold
  roughly 80% of the event's runtime (the workshops are ~5h30m of a ~27.75h programme).
- **The pricing page and the enterprise post disagree** about Grok Bot availability: the decoded
  matrix shows it only in the three SuperGrok columns, while the Sep 3 post says enterprises get it
  with governance controls. Quote both or neither.
- **`$42` appears as memory 1 in 32 marketplace templates** — a template-sanitisation placeholder,
  **not a price**. Ignore it.
- **`installCount` is 0 on all 81 templates** — there is no published popularity signal.
- **7 of 81 templates carry no prompt**; `instructions` is empty for most agents — the substance lives
  in `memories[]`, so a scraper reading only `instructions` gets nothing.
- **Marketing claims and hard numbers sit side by side.** "Millions of bots created" and "thousands of
  organisations" are marketing; the support and procurement figures are specific and sourced. Weight
  them differently, and check `data/metrics-ledger.json` for the source of every number.
