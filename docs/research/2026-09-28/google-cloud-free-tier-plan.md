# Google Cloud free tier — max-value plan (2026-09-28, Motif)

**Owner: autonomous revenue engine** (compute infra). Garrett is on Google Pro and using
Google more; claimed/considering the $300 GCP trial.

## The two free programs (they stack)
1. **$300 credit / 90 days** — any service, new customers only, card on file for identity
   verification (not charged). Anti-surprise feature: when credit or time runs out, the account
   is PAUSED — no auto-billing unless he explicitly upgrades.
2. **Always-free tier** (forever, even after trial): 1 e2-micro VM, 5 GB Cloud Storage,
   2M Cloud Run requests/mo, 2M Cloud Functions invocations/mo, 1 TB BigQuery queries/mo,
   120 min/day Cloud Build, 50 GB Artifact Registry, Firestore daily limits, 50 GB/mo logging.
   Free-tier usage does NOT burn trial credit.

## THE GPU TRAP (critical)
Free Trial accounts get **zero GPU quota** — you cannot add GPUs to VMs while on trial.
Unlocking GPUs requires: Console → Billing → **Activate/Upgrade** (keeps the $300 credit,
moves to paid profile, still no charge until credit is exhausted). Then request GPU quota
in IAM & Admin → Quotas. Caveats: brand-new paid accounts can still be denied GPU quota as
anti-fraud — build a little ordinary usage first or contact Sales. Also: quota ≠ capacity —
check the exact zone has the GPU type in stock before committing.

## Max-value spend order (our recommendation)
1. **Claim trial** (Garrett's tap, card for verification only). Set a billing budget alert at
   $50/$150/$250 — alerts don't stop spend, the pause-on-empty does.
2. **Live on always-free first** — never spend credit on what free tier covers:
   - Cloud Run (2M req/mo free): host a public Reclip endpoint (container + ffmpeg + yt-dlp)
     so the fleet pulls media without touching the VM
   - e2-micro: always-on lightweight backend (cron, watchers)
   - BigQuery 1TB/mo: analytics over research corpora
3. **Upgrade billing (no charge yet) → request GPU quota → L4 spot VMs** — this is what
   unlocks the AI-video watchlist (FastVideo/MiniMax H3 needs 24 GB VRAM). L4 (G2) spot is
   roughly ~$0.20/hr; $300 ≈ ~1,500 GPU-hours. Install ComfyUI + the FastVideo VSA node and
   the "no GPU box" blocker disappears. us-central1/us-east4 are the usual L4 zones — verify
   zone-level availability before spinning up.
4. **Vertex AI (Gemini) on the credit** — optional: managed model API as a cheap agent-model
   lane. Spend credit here only if the fleet needs it; otherwise GPUs eat first.
5. **Free GPUs that cost nothing**: Colab/Kaggle notebooks (T4-class, time-limited) for
   smoke tests before burning trial credit.

## What NOT to do
- Don't burn credit on storage/compute free tier covers.
- Don't try to get GPUs without upgrading the billing profile — it's blocked by design.
- Don't leave GPU VMs idling: spot + teardown scripts, or the $300 evaporates.

## Garrett's taps (hard blocks)
1. Sign up at cloud.google.com/free with his Google account + card (verification only).
2. Billing → Activate/Upgrade once ready for the GPU lane.
3. Report back on GPU quota approval — if denied, build usage history then retry.

## Status (2026-09-28)
Plan only. Trial NOT yet claimed. No spend.
