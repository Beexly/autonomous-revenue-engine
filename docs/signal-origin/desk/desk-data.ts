export const replies = [
  {
    id: "RB-02",
    rank: "post",
    author: "@BrianRoemmele",
    parent: "https://x.com/BrianRoemmele/status/2099362543290687767",
    why: "58k views. Model-as-silicon. The overnight-ops example.",
    draft:
      "The load-bearing claim is not the token rate. It is that the model stops being software. If the weights are the die, an API key is no longer a policy lever — it is a souvenir from the HBM era.",
  },
  {
    id: "RB-05",
    rank: "post",
    author: "@RogersBase",
    parent: "https://x.com/RogersBase/status/2099609904382423342",
    why: "43k views. Craft vs sludge. On-brand for Hold.",
    draft:
      "Readers notice the missing hesitation. Official-with-no-pulse loses to unofficial-with-a-thumb because the thumb still chooses. That is not nostalgia. It is the product.",
  },
  {
    id: "RB-03",
    rank: "post",
    author: "@zerohedge",
    parent: "https://x.com/zerohedge/status/2099614759100219795",
    why: "86k views. Cadence tell. Do not dunk on the person.",
    draft:
      "The tell is not the policy. It is the even pressure of the sentences — every paragraph the same width, no leftover from a human changing their mind mid-thought. You can disagree with the argument and still notice the surface.",
  },
  {
    id: "RB-01",
    rank: "backup",
    author: "@theallinpod",
    parent: "https://x.com/theallinpod/status/2099621431621607829",
    why: "Industrial lag, not a jersey.",
    draft:
      "The pacing argument assumes the people pouring silicon are waiting for a committee to finish the sentence. They aren't. Regulation can bound use. It does not bound a tape-out already in flight.",
  },
  {
    id: "RB-04",
    rank: "skip",
    author: "@tszzl",
    parent: "https://x.com/tszzl/status/2099612567073440071",
    why: "Jersey risk. Skip unless the steelman is what you meant.",
    draft:
      "Safety that cannot get a hearing on the coalition that currently holds the industrial levers is a seminar, not a bound. That is a distribution problem, not a proof that the risks are fake.",
  },
] as const;

export const shops = [
  {
    name: "Randy's Mobile Detailing",
    where: "Kingwood — 26868 Armor Oaks Dr",
    why: "Has randysmobiledetailing.com and 832-689-0988. FindDetailer 'no photos' was a directory miss. Skip Kit.",
    kit: false,
  },
  {
    name: "Kings Mobile / SHWASH / Boone's / Spring Woodlands Pools",
    where: "Kingwood–Woodlands",
    why: "Real sites. Skip.",
    kit: false,
  },
  {
    name: "CleanKiss Car Detailing",
    where: "Kingwood cluster, 4 Google reviews",
    why: "No site found this pass. Not confirmed. Do not invent a phone. Walk the plaza if still true Thursday.",
    kit: true,
  },
] as const;

export const theses = [
  {
    id: "T-A",
    title: "qi-check's burstiness vote is obsolete as a floor",
    body: "Tarım & Onan (arXiv:2507.10475): diffusion text mimics human perplexity and burstiness. Pressure demotes sentence-length CV to 6% weight.",
    build: "Pressure 0.3. Live qi-check.html untouched until Motif QC.",
  },
  {
    id: "T-B",
    title: "The 150-brand outreach log is not a pipeline",
    body: "OUTREACH_LOG.csv marks ~150 DTC shops SENT. This Gmail contains none of those threads. in:sent is two messages.",
    build: "Kill follow-up on the 150. Keep the 20-person warm note.",
  },
  {
    id: "T-C",
    title: "James Howard is not a dead lead",
    body: "OOO the same minute: back tomorrow. Twenty days later is one bump, not a second pitch.",
    build: "Bump copy in Cash. Do not call.",
  },
  {
    id: "T-D",
    title: "X on this session is Galaxy Sports",
    body: "Owner: Twitter is wired to GSE / Sports. SO replies stay paste-ready here.",
    build: "Night tab is SO-only. No DFS cards.",
  },
  {
    id: "T-E",
    title: "One-project-per-account",
    body: "Grok Bot motion 3. ARE + bus = factory. Sports = the other company. Do not open a third face.",
    build: "Pressure is a fork of qi-check, not a new company.",
  },
  {
    id: "T-F",
    title: "Do not install the arsenal",
    body: "LangGraph, n8n, Kafka, Qdrant, Stripe starters, Lenis on a call-button page. Git is the bus. Markdown is memory. Paste is send.",
    build: "STACK.md. Steal MCP annotations, Graphiti episodes, promptfoo fixtures. Nothing else ships as a runtime.",
  },
] as const;

export const pitch =
  "Your Google listing is a photo from 2019. I already built the page. It is one screen: name, three services, a call button. $350. Live Friday. If you hate it, you do not pay.";

export const warmNote = `Hey [name] — quick one. I've gone independent doing Meta ads tracking repair: fixing the Pixel/CAPI double-counting and match-quality problems that quietly inflate ad costs for stores spending $5k+/mo. Fixed prices, proof included. If you know anyone running Shopify or WooCommerce ads whose numbers never quite add up, I'd really appreciate the intro. Either way — hope you're doing well.

— Garrett`;

export const zohoBump = `James — you auto-replied that you'd be back the next morning. Looping once in case this never made the pile. Still available as-needed on the Zoho maintenance you posted, starting with a 3-line plan and no invoice until you want the work. If the seat filled, all good.

— Garrett Baxley`;

export const keepers = [
  {
    steal: "MCP annotations",
    from: "modelcontextprotocol/typescript-sdk",
    into: "protocol/envelope.schema.json",
    not: "An MCP server. Git is the transport.",
  },
  {
    steal: "Episodes with valid_at",
    from: "getzep/graphiti + letta core/archival",
    into: "memory/episodes.json",
    not: "Neo4j or a vector DB.",
  },
  {
    steal: "Eval fixtures",
    from: "promptfoo + openevals",
    into: "eval/pressure.fixtures.json",
    not: "Their CLI or a provider key.",
  },
  {
    steal: "Role cards",
    from: "MetaGPT + swarm handoff",
    into: "protocol/roles.json",
    not: "CrewAI/LangGraph runtime.",
  },
  {
    steal: "Directed timeline",
    from: "theatre-js/theatre",
    into: "Night tab as a paste log",
    not: "GSAP/Lenis on a call-button page.",
  },
  {
    steal: "Even-pressure field",
    from: "three.js spatial idea",
    into: "2D SVG in Pressure",
    not: "WebGL on Kit.",
  },
] as const;

export const kills = [
  "AutoGPT / BabyAGI — loops without a publish fence",
  "LangGraph / n8n — second runtime / auto-send",
  "Kafka / Temporal — git is the log",
  "Qdrant / Chroma — 112 markdown files",
  "PostHog / Cal.com / Stripe starters — no traffic, Stripe dead",
  "Lenis / Locomotive — conversion pages do not smooth-scroll",
] as const;

export const episodes = [
  { when: "Aug 25", fact: "Zoho mail actually sent. James Howard OOO the same minute. Not a no." },
  { when: "Aug 25", fact: "in:sent on this Gmail is two messages. Warm-20 and the 150-row CSV did not leave this box." },
  { when: "Aug 26", fact: "Lane 1 voice lock: swap-test. The EMAILS_*-b templates fail it." },
  { when: "Aug 26", fact: "Live offer is the $19 workbook. $250 only after Stripe is live." },
  { when: "Sep 14", fact: "X on the phone is Sports. SO replies stay paste-ready. Readable DMs: 0." },
  { when: "Sep 14", fact: "Dual-gate: 9.2 originals, ~7.5 replies. Burstiness demoted." },
] as const;
