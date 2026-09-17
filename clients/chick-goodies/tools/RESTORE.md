# Restoring the photographs

Her originals top out at 480×640 (`ASSETS.md` §1). The owner has approved
restoration (§5). This is the generative half of that; run it *after* a
classical pass, not instead of one.

## Setup

```bash
cp tools/.env.example tools/.env      # then fill in both values
```

Credentials come from [console.higgsfield.ai](https://console.higgsfield.ai) as
an ID + secret pair, sent as `Authorization: Key ID:SECRET`. `tools/.env` is
gitignored. Keep them server-side; never put them in a command line, a log or a
screenshot, and rotate on any exposure.

No dependencies — Python 3.8+, standard library only.

## Running it

```bash
python3 tools/restore-photos.py                      # dry run, costs nothing
python3 tools/restore-photos.py --apply              # spends credits
python3 tools/restore-photos.py --apply --src ~/v3   # from a classical pass
python3 tools/restore-photos.py --apply --only tricia-662.jpg
python3 tools/restore-photos.py --apply --model reve
```

Dry run is the default because every `--apply` photo is billed. It prints
exactly what would be sent and what a rerun would skip.

| Flag | Does |
|---|---|
| `--apply` | actually submit; without it nothing is sent |
| `--src DIR` | read from here instead of `site/img` |
| `--only NAME` | one file; repeatable |
| `--limit N` | stop after N |
| `--model grok\|reve` | `xai/grok-imagine-image-2.0` or `/reve/edit` |
| `--timeout S` | per-photo ceiling, default 600s |

## What it does per photo

1. `POST /files/generate-upload-url`, then PUT the file to the presigned URL.
   API credentials are never sent to the storage host. The URL expires in 1h.
2. `POST` the model endpoint → `{request_id, status_url, cancel_url}`.
3. Poll `status_url` at 2s, backing off ×1.5 to a 10s cap with jitter, until
   `completed`, `failed`, `nsfw` or `canceled`.
4. Download the image to `restored/` and append provenance to
   `restored/manifest.jsonl`.

Reruns skip any (file, model, prompt) already recorded `completed`, so the same
work is never billed twice. Submissions accept no idempotency key, so a POST is
never retried automatically after an ambiguous timeout — that would double-bill.
`401`/`403`/`423`/`503` stop the run; a single photo's failure does not.

## Before anything ships

`restored/` is not on any page. Look at every output. `ASSETS.md` §2 makes an
unreviewed generated image in a client build a defect, which is what the
manifest md5s exist to make checkable.

## Another provider

The pipeline and the provider are separate. `Higgsfield` implements
submit-and-poll; anything reachable over HTTPS that takes an image plus a prompt
and returns image bytes can sit in the same seam — OpenRouter and OmniRouter
included. `MODELS` is a table, so adding an endpoint is one entry, not a
refactor.
