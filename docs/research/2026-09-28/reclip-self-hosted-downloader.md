# Reclip — self-hosted media downloader (2026-09-28, Motif)

## What it is
Reclip (averygan/reclip, MIT, ~9.7k stars) is a self-hosted video/audio downloader with a clean web UI.
Paste a link, download as MP4 or MP3 with a quality picker. yt-dlp under the hood (1,000+ sites),
ffmpeg for merge/convert. Single Python/Flask backend (~150 lines), vanilla JS frontend, no build step.

Spotted via @marc.kaz Instagram reel (2026-09-28); the reel's claims verified against the repo.

## Where it lives
- GitHub source: https://github.com/averygan/reclip
- This VM: `~/workspace/tools/reclip` (cloned 2026-09-28)
- Run: `cd ~/workspace/tools/reclip && python3 app.py` → http://localhost:8899
- Deps: python3, flask, yt-dlp, ffmpeg (installed on this VM 2026-09-28; reinstall if VM rebuilds)

## API (for agents)
- POST /api/info → {title, thumbnail, duration, uploader, formats[]}
- POST /api/download → {job_id}
- GET /api/status/<job_id> → {status, filename, error}
- GET /api/file/<job_id> → the file

## Verification (2026-09-28)
End-to-end test passed: pasted URL → job → real 10s MP4 on disk (ffprobe-clean, 991,017 bytes).
UI and API both functional.

## Caveats
- YouTube from datacenter IPs hits a "sign in, you're not a bot" check. Pass cookies or run from a
  residential IP/browser for YouTube pulls. Direct file URLs and TikTok/Instagram/X are the easy lane.
- Local-only on this VM: relaunch after any VM restart. Not production-hardened (Flask dev server).
- Intended use: internal media ingestion. Respect copyright and platform ToS per download.

## Where it fits (revenue engine)
- Recordly video production: reference footage without adware-laden downloaders
- Kit client work: pulling a client's own social videos for embedding on their site
- General internal clip/media pipeline for any content lane
