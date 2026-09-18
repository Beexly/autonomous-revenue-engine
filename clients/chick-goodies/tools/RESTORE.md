# Restoring the photographs

Her originals top out at 480×640 (`ASSETS.md` §1). The owner has approved
restoration (§5). This is the generative half of that; run it *after* a
classical pass, not instead of one.

## Setup

```bash
cp tools/.env.example tools/.env      # then fill in the provider you want
```

`tools/.env` is gitignored. Keep credentials off the command line and out of
logs and screenshots, and rotate on any exposure.

No dependencies — Python 3.9+, standard library only.

## Two providers, same pipeline

| | OpenRouter (default) | Higgsfield |
|---|---|---|
| Endpoint | `POST /api/v1/images/generations` | per-model, e.g. `/xai/grok-imagine-image-2.0` |
| Shape | synchronous — one POST, image back | async — upload, submit, poll |
| Key | `OPENROUTER_API_KEY` | `HF_API_KEY_ID` + `HF_API_KEY_SECRET` |

`x-ai/grok-imagine-image-2.0` is on both, so the same model can be run through
either biller and compared directly.

### Which model

Restoration wants *fidelity to the reference*, not invention — the failure that
matters here is a model redrawing her branded cone wraps or swapping her cheese
for generic cheese. Verified against `/api/v1/images/models` on 2026-09-17:

| `--model` | Model | Max res | For |
|---|---|---|---|
| `gemini-pro` | `google/gemini-3-pro-image` | 4K | **default** — strongest reference adherence |
| `gemini-flash` | `google/gemini-3.1-flash-image` | 4K | cheap iteration while tuning the prompt |
| `seedream` | `bytedance-seed/seedream-5-0-lite` | 4K | second opinion on texture |
| `grok` | `x-ai/grok-imagine-image-2.0` | 2K | the Higgsfield comparison |
| `qwen` | `qwen/qwen-image-3-pro` | 2K | another opinion |
| `gpt-image` | `openai/gpt-image-2` | — | restyles more; least suited to restore |

Start on `gemini-flash` to settle the prompt, then re-run the keepers on
`gemini-pro`. Do not put the portrait through any of them without reading the
warning below.

## Running it

```bash
python3 tools/restore-photos.py                       # dry run, costs nothing
python3 tools/restore-photos.py --apply               # openrouter + gemini-pro
python3 tools/restore-photos.py --apply --model gemini-flash
python3 tools/restore-photos.py --apply --src ~/v3    # from a classical pass
python3 tools/restore-photos.py --apply --only graze-02.jpg
python3 tools/restore-photos.py --apply --provider higgsfield --model grok
```

Dry run is the default because every `--apply` photo is billed. It prints
exactly what would be sent and what a rerun would skip.

| Flag | Does |
|---|---|
| `--apply` | actually submit; without it nothing is sent |
| `--src DIR` | read from here instead of `site/img` |
| `--only NAME` | one file; repeatable |
| `--limit N` | stop after N |
| `--provider` | `openrouter` (default) or `higgsfield` |
| `--model` | see the table above |
| `--timeout S` | per-photo ceiling, default 600s |

## What it does per photo

**OpenRouter** — base64 the file into `input_references`, one POST, decode
`data[0].b64_json`, write it out. Prints the run cost when the API reports one.

**Higgsfield** — `POST /files/generate-upload-url`, PUT to the presigned URL
(API credentials never go to the storage host, and it expires in 1h), POST the
model endpoint for a `request_id`, then poll `status_url` at 2s backing off ×1.5
to a 10s cap with jitter until `completed`, `failed`, `nsfw` or `canceled`.

Either way the image lands in `restored/` and a line goes to
`restored/manifest.jsonl` with provider, model, endpoint, prompt, request id,
md5 and sha256.

Reruns skip any (file, provider, model, prompt) already recorded `completed`, so the same
work is never billed twice. Submissions accept no idempotency key, so a POST is
never retried automatically after an ambiguous timeout — that would double-bill.
`401`/`403`/`423`/`503` stop the run; a single photo's failure does not. Every
URL opened is checked to be `https` first, so a malformed or hostile API
response cannot turn an image fetch into a local file read.

## Before anything ships

`restored/` is not on any page. Look at every output. `ASSETS.md` §2 makes an
unreviewed generated image in a client build a defect, which is what the
manifest md5s exist to make checkable.

## Adding a third provider

A provider is a class with `restore(path, prompt) -> (request_id, correlation,
blob)`. `Higgsfield` polls, `OpenRouter` doesn't; the pipeline neither knows nor
cares. `OR_MODELS` and `MODELS` are tables, so a new model is one entry.
