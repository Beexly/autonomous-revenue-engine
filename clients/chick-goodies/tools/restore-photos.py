#!/usr/bin/env python3
"""Restore Tricia's photographs through a generative image API.

An operator tool. One person runs it from a machine that holds the credentials.
Nothing here runs on a server, and nothing it produces reaches a client page on
its own: every output lands in `restored/` to be looked at first, because
ASSETS.md section 2 makes shipping an unreviewed generated image a defect.

The pipeline owns the work; the provider is a swappable adapter. Higgsfield is
implemented because that is what we have keys for. A second adapter (OpenRouter,
OmniRouter, anything reachable over HTTPS) only has to satisfy `Provider`:
submit a source image plus a prompt, return image bytes.

Docs followed, read 2026-09-17:
  authentication  /docs/authentication
  file uploads    /docs/concepts/file-uploads
  lifecycle       /docs/concepts/requests
  polling         /docs/concepts/polling
  errors          /docs/concepts/errors

Usage
  python3 tools/restore-photos.py                      # dry run; costs nothing
  python3 tools/restore-photos.py --apply              # spends credits
  python3 tools/restore-photos.py --apply --only knot-3.jpg
  python3 tools/restore-photos.py --apply --model reve

Credentials come from the environment or from tools/.env (gitignored).
Never pass them on a command line; they end up in shell history.
"""

from __future__ import annotations

import argparse
import base64
import hashlib
import json
import mimetypes
import os
import random
import sys
import time
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "site" / "img"          # default; --src overrides
OUT = ROOT / "restored"
MANIFEST = OUT / "manifest.jsonl"

API = "https://api.higgsfield.ai"
TERMINAL = {"completed", "failed", "nsfw", "canceled"}

# Priority order. Her originals top out at 480x640 (ASSETS.md section 1); the
# ones that carry the most page are worth the credits first.
QUEUE = [
    "knot-3.jpg", "knot-2.jpg", "graze-02.jpg", "board-02.jpg",
    "catering-1000.jpg", "tricia-662.jpg", "knot-4.jpg",
    "cart-640.jpg", "wide-640.jpg",
]

# Restoration, not reinterpretation. The brief is "make her real food look the
# way it looked in the room", so the prompt forbids invention explicitly.
BASE_PROMPT = (
    "Restore this photograph of real catering work. Recover fine detail and "
    "natural texture in the food, linen and wood. Correct softness, sensor "
    "noise and JPEG artefacts. Neutral white balance, natural daylight, "
    "true-to-life colour. Keep the exact composition, framing, aspect ratio "
    "and every object exactly where it is. Do not add, remove, move or "
    "substitute any food, prop or person. Do not stylise, do not smooth skin "
    "or surfaces into plastic, do not add bokeh, glow or vignette. "
    "Photographic result, not an illustration."
)

# One override where a generic prompt would do damage.
PROMPTS = {
    "tricia-662.jpg": BASE_PROMPT + (
        " This is a portrait of a real person. Be conservative: keep her face, "
        "expression, hair and body exactly as photographed. Reduce noise and "
        "recover detail only. Do not retouch, slim, smooth or alter features."
    ),
}

# Verified against the live docs on 2026-09-17. `resolution`/`quality` values
# are the ones the model's own documentation prints; the console is the place
# to confirm what this account is entitled to before changing them.
MODELS = {
    "grok": {
        "endpoint": "/xai/grok-imagine-image-2.0",
        "args": lambda url, prompt: {
            "prompt": prompt,
            "image_urls": [url],
            "resolution": "1k",
            "aspect_ratio": "auto",
            "quality": "high",
        },
    },
    "reve": {
        "endpoint": "/reve/edit",
        "args": lambda url, prompt: {
            "prompt": prompt,
            "image_url": url,
            "num_images": 1,
        },
    },
}


OR_API = "https://openrouter.ai/api/v1/images/generations"

# Verified against https://openrouter.ai/api/v1/images/models on 2026-09-17.
# `resolution` is sent only for models that advertise the parameter.
OR_MODELS = {
    "gemini-flash": {"model": "google/gemini-3.1-flash-image", "resolution": "4K"},
    "gemini-pro":   {"model": "google/gemini-3-pro-image",     "resolution": "4K"},
    "seedream":     {"model": "bytedance-seed/seedream-5-0-lite", "resolution": "4K"},
    "grok":         {"model": "x-ai/grok-imagine-image-2.0",   "resolution": "2K"},
    "qwen":         {"model": "qwen/qwen-image-3-pro",         "resolution": "2K"},
    "gpt-image":    {"model": "openai/gpt-image-2"},
}


# --------------------------------------------------------------------------- env

def load_env() -> None:
    """Read tools/.env into os.environ without overwriting a real export."""
    path = Path(__file__).resolve().parent / ".env"
    if not path.exists():
        return
    for line in path.read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip().strip("'\""))


def credentials(provider: str) -> str:
    if provider == "openrouter":
        key = os.environ.get("OPENROUTER_API_KEY", "")
        if not key:
            sys.exit(
                "Missing credentials. Set OPENROUTER_API_KEY in the environment\n"
                "or in tools/.env — see tools/.env.example.\n"
                "Create one at https://openrouter.ai/settings/keys"
            )
        return f"Bearer {key}"

    key_id = os.environ.get("HF_API_KEY_ID", "")
    secret = os.environ.get("HF_API_KEY_SECRET", "")
    if not key_id or not secret:
        sys.exit(
            "Missing credentials. Set HF_API_KEY_ID and HF_API_KEY_SECRET in the\n"
            "environment or in tools/.env — see tools/.env.example.\n"
            "Create them at https://console.higgsfield.ai"
        )
    return f"Key {key_id}:{secret}"


# ------------------------------------------------------------------------- http

def https_only(url: str) -> str:
    """Every URL here arrives in an API response. Refuse anything that is not
    https so a bad response cannot turn a fetch into a local file read."""
    if not isinstance(url, str) or not url.lower().startswith("https://"):
        raise Skip(f"refusing non-https URL: {str(url)[:60]}")
    return url


def request(url, *, method="GET", body=None, headers=None, timeout=60):
    """One HTTP call. Returns (status, headers, bytes). Never raises on 4xx/5xx."""
    url = https_only(url)
    data = None
    headers = dict(headers or {})
    if body is not None:
        data = json.dumps(body).encode("utf-8")
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(url, data=data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return response.status, dict(response.headers), response.read()
    except urllib.error.HTTPError as exc:
        return exc.code, dict(exc.headers or {}), exc.read()


def as_json(payload: bytes):
    try:
        return json.loads(payload.decode("utf-8"))
    except (json.JSONDecodeError, UnicodeDecodeError):
        return {"detail": payload[:400].decode("utf-8", "replace")}


class Fatal(Exception):
    """Do not retry, do not continue to the next photo."""


class Skip(Exception):
    """This photo failed; the others are still worth attempting."""


def check(status: int, payload) -> None:
    """Map the documented status codes onto retry vs stop."""
    if status < 400:
        return
    detail = payload.get("detail") if isinstance(payload, dict) else payload
    if status == 401:
        raise Fatal(f"401 invalid credentials — {detail}")
    if status == 403:
        raise Fatal(f"403 insufficient credits — {detail}")
    if status in (404, 422):
        raise Skip(f"{status} request rejected — {detail}")
    if status in (423, 503):
        raise Fatal(f"{status} model unavailable, try later — {detail}")
    raise Skip(f"{status} — {detail}")


# --------------------------------------------------------------------- provider

class Higgsfield:
    """Upload -> submit -> poll -> fetch bytes."""

    name = "higgsfield"

    def __init__(self, auth: str, model: str, timeout: int):
        self.auth = auth
        self.model = MODELS[model]
        self.model_name = model
        self.timeout = timeout

    def _auth_headers(self) -> dict:
        return {"Authorization": self.auth}

    def submit(self, image_url: str, prompt: str):
        status, headers, payload = request(
            API + self.model["endpoint"],
            method="POST",
            body=self.model["args"](image_url, prompt),
            headers=self._auth_headers(),
        )
        data = as_json(payload)
        check(status, data)
        # Submissions accept no idempotency key, so an ambiguous timeout must
        # never be retried automatically — it would bill twice.
        return data, headers.get("X-Correlation-ID", "")

    def restore(self, path: Path, prompt: str):
        """Upload, submit, poll, fetch. Raises Skip or Fatal."""
        content_type = mimetypes.guess_type(path.name)[0] or "image/jpeg"
        status, _, payload = request(
            f"{API}/files/generate-upload-url", method="POST",
            body={"content_type": content_type},
            headers=self._auth_headers(),
        )
        upload = as_json(payload)
        check(status, upload)

        headers = dict(upload.get("upload_headers") or {})
        headers.setdefault("Content-Type", content_type)
        code = put_file(upload["upload_url"], path, headers, self.timeout)
        if code >= 400:
            raise Skip(f"presigned upload returned {code}")

        accepted, correlation = self.submit(upload["public_url"], prompt)
        request_id = accepted.get("request_id", "")
        print(f"    request {request_id}")

        result = self.poll(accepted["status_url"])
        state = result.get("status")
        if state != "completed":
            raise Skip(f"{state}: {result.get('error', 'no detail')}")

        images = result.get("images") or []
        if not images:
            raise Skip("completed with no image")

        code, _, blob = request(images[0]["url"], timeout=self.timeout)
        if code >= 400 or not blob:
            raise Skip(f"could not download output ({code})")
        return request_id, correlation, blob

    def poll(self, status_url: str) -> dict:
        delay, deadline = 2.0, time.monotonic() + self.timeout
        while True:
            if time.monotonic() > deadline:
                raise Skip(f"timed out after {self.timeout}s")
            status, _, payload = request(status_url, headers=self._auth_headers())
            if status >= 500:
                time.sleep(delay + random.uniform(0, 0.5))
                delay = min(delay * 1.5, 10.0)
                continue
            data = as_json(payload)
            check(status, data)
            state = data.get("status")
            if state in TERMINAL:
                return data
            time.sleep(delay + random.uniform(0, 0.5))
            delay = min(delay * 1.5, 10.0)


class OpenRouter:
    """OpenRouter's dedicated Image API. Synchronous — one POST, image back,
    so there is no request_id to poll and nothing to cancel.

    Verified against the live docs and endpoint on 2026-09-17:
      POST /api/v1/images/generations
      {model, prompt, input_references:[{type:"image_url",image_url:{url}}]}
      -> {created, data:[{b64_json, media_type}], usage:{cost}}
    `input_references` takes an https URL or a base64 data URL; her files are
    local and the repo is private, so they go up as data URLs.
    """

    name = "openrouter"

    def __init__(self, auth: str, model: str, timeout: int):
        self.auth = auth
        self.entry = OR_MODELS[model]
        self.model_name = model
        self.timeout = timeout

    def restore(self, path: Path, prompt: str):
        content_type = mimetypes.guess_type(path.name)[0] or "image/jpeg"
        payload_b64 = base64.b64encode(path.read_bytes()).decode("ascii")

        body = {
            "model": self.entry["model"],
            "prompt": prompt,
            "input_references": [{
                "type": "image_url",
                "image_url": {"url": f"data:{content_type};base64,{payload_b64}"},
            }],
        }
        if "resolution" in self.entry:
            body["resolution"] = self.entry["resolution"]

        status, headers, raw = request(
            OR_API, method="POST", body=body,
            headers={"Authorization": self.auth}, timeout=self.timeout,
        )
        data = as_json(raw)
        check(status, data)

        items = data.get("data") or []
        if not items or not items[0].get("b64_json"):
            raise Skip(f"no image in response: {str(data)[:160]}")
        try:
            blob = base64.b64decode(items[0]["b64_json"])
        except (ValueError, TypeError) as exc:
            raise Skip(f"undecodable image payload: {exc}") from exc

        cost = (data.get("usage") or {}).get("cost")
        if cost is not None:
            print(f"    cost ${cost}")
        # No request id from this API; the correlation header is what there is.
        return "", headers.get("X-Request-Id", ""), blob


def put_file(url: str, path: Path, headers: dict, timeout: int) -> int:
    """A presigned PUT needs the file as the body; urlopen wants bytes."""
    req = urllib.request.Request(
        https_only(url), data=path.read_bytes(), headers=headers, method="PUT"
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as response:
            return response.status
    except urllib.error.HTTPError as exc:
        return exc.code


# ------------------------------------------------------------------------ record

def prompt_sha(prompt: str) -> str:
    return hashlib.sha256(prompt.encode()).hexdigest()[:12]


def read_manifest() -> dict:
    """Completed (file, model, prompt) triples, so a rerun does not rebill."""
    done = {}
    if not MANIFEST.exists():
        return done
    for line in MANIFEST.read_text(encoding="utf-8").splitlines():
        if not line.strip():
            continue
        try:
            row = json.loads(line)
        except json.JSONDecodeError:
            continue
        if row.get("status") == "completed":
            key = (row["source"], row.get("provider", "higgsfield"),
                   row["model"], row["prompt_sha"])
            done[key] = row
    return done


def record(row: dict) -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    with MANIFEST.open("a", encoding="utf-8") as handle:
        handle.write(json.dumps(row, sort_keys=True) + "\n")


# -------------------------------------------------------------------------- main

def build_queue(src: Path, only: list, limit: int) -> list:
    """Which files to send: `only` names them, else the priority queue,
    else everything in the directory."""
    if not src.is_dir():
        sys.exit(f"--src is not a directory: {src}")

    names = only or QUEUE
    queue = [src / n for n in names if (src / n).exists()]

    if only:
        for name in names:
            if not (src / name).exists():
                print(f"  ! {name}: not in {src}, skipped")
    elif not queue:
        # A classical pass usually renames its outputs.
        queue = sorted(f for f in src.iterdir()
                       if f.suffix.lower() in (".jpg", ".jpeg", ".png", ".webp"))
        if queue:
            print(f"  (no queue names in {src}; taking all {len(queue)} images)")
            # PROMPTS is keyed by filename. A renamed file silently loses its
            # override, and one of those overrides is the only thing stopping a
            # model from retouching a real person's face.
            print("  ! renamed files cannot match a per-file prompt override.")
            print("  ! " + ", ".join(sorted(PROMPTS)) + " must be passed via --only,")
            print("  ! or renamed back, or its restore will use the generic prompt.")

    return queue[:limit] if limit else queue


def report_dry_run(queue: list, provider: str, model: str, done: dict) -> None:
    for path in queue:
        sha = prompt_sha(PROMPTS.get(path.name, BASE_PROMPT))
        seen = (path.name, provider, model, sha) in done
        print(f"  {'skip' if seen else 'send'}  {path.name:<20} "
              f"{path.stat().st_size/1024:6.1f} KB  prompt {sha}")
    print("\nDry run. Nothing was sent and nothing was billed. "
          "Re-run with --apply.")


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__.splitlines()[0])
    parser.add_argument("--apply", action="store_true",
                        help="actually submit. Without it nothing is sent and nothing is billed.")
    parser.add_argument("--provider", choices=("higgsfield", "openrouter"),
                        default="openrouter",
                        help="who does the work. Both bill separately.")
    parser.add_argument("--model", default=None,
                        help="higgsfield: " + "|".join(sorted(MODELS)) +
                             " · openrouter: " + "|".join(sorted(OR_MODELS)))
    parser.add_argument("--src", type=Path, default=SRC,
                        help="directory to read from. Point this at a classical "
                             "restore pass (denoised, correctly resized) rather "
                             "than at site/img — a generative model holds onto "
                             "real structure and hallucinates into mush.")
    parser.add_argument("--only", action="append", default=[],
                        help="restrict to these filenames; repeatable")
    parser.add_argument("--limit", type=int, default=0, help="stop after N photos")
    parser.add_argument("--timeout", type=int, default=600,
                        help="per-photo ceiling in seconds")
    args = parser.parse_args()

    load_env()

    table = OR_MODELS if args.provider == "openrouter" else MODELS
    default = "gemini-pro" if args.provider == "openrouter" else "grok"
    args.model = args.model or default
    if args.model not in table:
        sys.exit(f"--model {args.model} is not a {args.provider} model. "
                 f"Choose from: {', '.join(sorted(table))}")

    src = args.src.resolve()
    queue = build_queue(src, args.only, args.limit)
    if not queue:
        print("Nothing to do.")
        return 1

    done = read_manifest()
    label = (OR_MODELS[args.model]["model"] if args.provider == "openrouter"
             else MODELS[args.model]["endpoint"])
    print(f"{len(queue)} photo(s) from {src}, {args.provider} {label}, "
          f"output {OUT.relative_to(ROOT)}/")

    if not args.apply:
        report_dry_run(queue, args.provider, args.model, done)
        return 0

    auth = credentials(args.provider)
    provider = (OpenRouter(auth, args.model, args.timeout)
                if args.provider == "openrouter"
                else Higgsfield(auth, args.model, args.timeout))
    OUT.mkdir(parents=True, exist_ok=True)
    ok = failed = skipped = 0

    for path in queue:
        prompt = PROMPTS.get(path.name, BASE_PROMPT)
        sha = prompt_sha(prompt)
        if (path.name, args.provider, args.model, sha) in done:
            print(f"  = {path.name}: already restored with this prompt")
            skipped += 1
            continue

        print(f"  > {path.name}", flush=True)
        try:
            request_id, correlation, blob = provider.restore(path, prompt)
            (OUT / path.name).write_bytes(blob)
            # md5 only so the manifest can be compared against the
            # quarantined hashes in ASSETS.md section 2. Not a security
            # function — sha256 below is the one that means anything.
            digest = hashlib.md5(blob, usedforsecurity=False).hexdigest()
            strong = hashlib.sha256(blob).hexdigest()
            record({
                "source": path.name, "provider": args.provider,
                "model": args.model, "endpoint": label,
                "prompt_sha": sha, "prompt": prompt,
                "request_id": request_id, "correlation_id": correlation,
                "status": "completed", "md5": digest, "sha256": strong,
                "bytes": len(blob),
                "at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            })
            print(f"    ok  {len(blob)/1024:.1f} KB  md5 {digest}")
            ok += 1

        except Skip as exc:
            print(f"    failed: {exc}")
            record({
                "source": path.name, "provider": args.provider,
                "model": args.model, "prompt_sha": sha,
                "status": "failed", "error": str(exc),
                "at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
            })
            failed += 1
        except Fatal as exc:
            print(f"    stopping: {exc}")
            return 2

    print(f"\n{ok} restored, {failed} failed, {skipped} already done.")
    print(f"Outputs are in {OUT.relative_to(ROOT)}/ and are NOT on any page.")
    print("Look at every one before copying it into site/img/.")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
