# REPLACE — every kill gets a neighbor that actually runs

Kill is not a graveyard. If the runtime is a bill, the adjacent repo's *idea* still ships here.

| Killed | Adjacent repo | What runs here |
|---|---|---|
| temporalio/temporal, Argo, Prefect, Dagster, Kestra | [dbos-inc/dbos-transact-ts](https://github.com/dbos-inc/dbos-transact-ts) | `protocol/durable.ts` — attempt, lastStep, timeout, dead letter. Git is Postgres this week. TASK-001 is already dead-lettered. |
| redis, Rabbit, Kafka, NATS | [unjs/unstorage](https://github.com/unjs/unstorage) | No broker. The file is the cache. Don't install Unstorage. |
| qdrant, chroma, milvus, weaviate, mem0, Haystack | [oramasearch/orama](https://github.com/oramasearch/orama) / [krisk/Fuse.js](https://github.com/krisk/Fuse.js) | `protocol/search.ts` on Line → Memory. Token overlap. No embeddings. |
| langfuse, phoenix, helicone, openlit, langwatch, braintrust, OTel collector | [promptfoo/promptfoo](https://github.com/promptfoo/promptfoo) | `protocol/trace.ts` + `eval/pressure.fixtures.json`. One span per draft. |
| airbyte, dlt | Saturday walk + `ops/MEASUREMENT_2026-09-14.csv` | Ingest is a row. Not a warehouse. |
| posthog, plausible, matomo, metabase, growthbook | Local Kit funnel | `protocol/funnel.ts`. Walked → shown → yes. Venmo is the event. |
| n8n, activepieces, node-red | The bus TASK file | Paste is the node. Auto-send stays forbidden. |
| litestar, reflex, appsmith | This desk | Five tabs. Don't grow a second UI. |
| langchain, langgraph, AutoGPT, babyagi, agent-zero, OpenHands, aider | Motif + Grok + OpenCode on git | `handoff.ts`. We are the coding agent. |
| AstrBot, pipecat | `tel:` on Kit | Voice is a phone call in Kingwood. Not a realtime stack. |
| cal.com, chatwoot | Sticky call + gold email | Same. |
| framer/motion, lenis, locomotive, anime | CSS `--motion-fast` + pressure SVG | Motion is paragraph width, not a tween. |
| open-saas / stripe starters | Kit $350 Venmo | Stripe was `charges_enabled: false`. |
| poetry / pixi | [astral-sh/uv](https://github.com/astral-sh/uv) if conformal-lite grows | One numpy pin today. |
| sqlmodel | Supabase schema already in-repo | Keys are owner. Mailto until then. |
| OPA / cedar as a server | `protocol/policy.ts` | Already the replacement. |
| MCP server zoo | `protocol/tools.json` + envelope | Git is the transport. |

Re-open a KILL only when the neighbor cannot hold the load. First dollar, then a host.
