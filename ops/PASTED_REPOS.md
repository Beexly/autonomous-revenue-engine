# PASTED REPOS — engine + Hermes + jobs

Owner pastes GitHub lists to make the **agent** better, not to dump
frameworks onto a $150 catering page. Each row is (a) Hermes craft,
(b) `autonomous-revenue-engine` asset, (c) trap / wrong job.

Apply the row to whichever surface is live: Kit, SignPreview, Vow,
Signal Origin, a client file, or Hermes itself.

## Clone / recreate (skills exist)

| Repo | Class | Where it lands |
|---|---|---|
| [JCodesMore/ai-website-cloner-template](https://github.com/JCodesMore/ai-website-cloner-template) | (a) | Hermes skill `clone-website` — pixel specs, parallel builders. Not phishing. |
| [firecrawl/open-lovable](https://github.com/firecrawl/open-lovable) | (a) | Hermes skill `open-lovable` — scrape then recreate as React. Firecrawl optional; Hermes `web_extract` is the default intake. Do not boot their E2B app for a one-pager. |

## SSG / motion / study (already in chick DESIGN_REFS, still engine-wide)

| Repo | Class | Call |
|---|---|---|
| [gohugoio/hugo](https://github.com/gohugoio/hugo) | (b) | Fast SSG. Candidate for Factory docs or a $600 content site. |
| [withastro/astro](https://github.com/withastro/astro) | (b) | Preferred $600 stack: location pages, blog, sitemap, Vercel. Kit samples stay static HTML until an art direction is picked. |
| [facebook/docusaurus](https://github.com/facebook/docusaurus) | (c) for products | Docs only. Fine for engine internal docs; never a lookbook. |
| [DavidHDev/react-bits](https://github.com/DavidHDev/react-bits) | (a) | Motion vocabulary. CSS-only on client sites. No Magnet/BlobCursor on catering. Useful on Kit cinematic PR #45. |
| sdmg15/Best-websites-a-programmer-should-visit | (a) | Archived study list. Bookmark. |
| Asabeneh/30-Days-Of-JavaScript | (a) | Beginner JS. Not a generator. |

## Fullstack / SaaS

| Repo | Class | Call |
|---|---|---|
| [realworld-apps/realworld](https://github.com/realworld-apps/realworld) | (a)(b) | Spec + E2E pattern for any app that needs auth/CRUD. Not a catering site. Useful if we ever ship a real backend (leads table in PR #48). |
| [GorvGoyl/Clone-Wars](https://github.com/GorvGoyl/Clone-Wars) | (a) | Catalog of learning clones. Steal architecture from a peer, don't ship a Netflix clone. |
| [vercel/nextjs-subscription-payments](https://github.com/vercel/nextjs-subscription-payments) | (b) stale | Archived 2025-01-23. Stripe + Supabase SaaS starter. Successor is Vercel's current Next.js SaaS template. Relevant to SO-001 $19 Stripe, not Tomball grazing tables. Do not clone the archive; use current Vercel/Supabase billing starter if we reopen that rail. |
| [myclabs/DeepCopy](https://github.com/myclabs/DeepCopy) | (c) | PHP object deep-copy. Wrong language, wrong problem. |

## Voice / avatar — do not install on client jobs

| Repo | Class | Call |
|---|---|---|
| RVC-Boss/GPT-SoVITS | (a) later | Voice conversion. Hermes TTS is a different stack (`text_to_speech`). Do not clone Tricia's voice. Consent required for any voice clone, ever. |
| CorentinJ/Real-Time-Voice-Cloning | (c) | Aged research. Same consent rule. Not for this machine's catering work. |
| xming521/WeClone | (c) | WeChat persona clone. Out of scope. |
| duixcom/Duix-Avatar | (c) for clients | Talking-head avatars. Kit demo video maybe; never as "Tricia" without her yes. |

## Other

| Repo | Class | Call |
|---|---|---|
| digoal/blog | (a) | PostgreSQL notes. Useful when PR #48 SQL actually gets applied. |
| FineComputer14451/Grok-Imagine-Cinematic-Studio | (a) | Pipeline only. Hermes skill `cinematic-production-discipline`. No Imagine food. |
| dvcrn/pi-supergrok | (a) Pi only | Hermes already has xAI OAuth. |

## Rules

1. A paste is (a)(b) or (c) in one line, in this file, same day.
2. Client folders (`clients/*`) get only the rows that change *that* job.
3. Voice/avatar/Imagine never run on a no-AI client brief.
4. $150 Kit/one-pager = static HTML. Frameworks wait for $600 or an engine product.

## Hermes hardware / voice / plugins (2026-09-16)

| Repo | Class | Call |
|---|---|---|
| [katipally/openlive](https://github.com/katipally/openlive) | (a) Hermes | On-device VAD/STT/TTS + ACP so you can *talk* to Hermes. Optional desktop. Has zero-shot voice clone — do not clone anyone but Garrett, and only if he asks. Not for Charcuterie Chick. |
| [kingardor/Hermes-Deepstream](https://github.com/kingardor/Hermes-Deepstream) | (c) name collision | 2020 wildfire drone + NVIDIA Deepstream 5.1. Unrelated to Nous Hermes Agent. Do not install. |
| [kaishi00/hermes-community-plugins](https://github.com/kaishi00/hermes-community-plugins) | (a) **highest Hermes leverage** | `native-vision` bypasses aux vision and sends images to a vision model — that is why IMG_7724 never got read. `async-delegate`, `heartbeat`, `kanban-context`. Zero core patches. Install only with Garrett's yes (monkey-patches). |
| [prasanthsasikumar/hermes-glasses](https://github.com/prasanthsasikumar/hermes-glasses) | (a) later | Ray-Ban / AiSee bridge to Hermes. Needs glasses + iPhone. Not this PC, not this client. |
