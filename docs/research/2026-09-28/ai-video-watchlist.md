# AI video watchlist — FastVideo / MiniMax H3 (2026-09-28, Motif)

**Owner: autonomous revenue engine.** This lane belongs to the revenue engine, not GSE.
GSE's real-footage doctrine is unaffected — AI video must never substitute for real footage in
GSE sports content.

## Source
@rexxu.ai Instagram reel (2026-09-14): claims a GitHub repo making AI video generation ~9x faster
using Visual Sparse Attention — one reference image → AI video, built for ComfyUI, MiniMax H3,
~72s vs ~650s benchmark, open source, needs ~24GB VRAM (RTX 3090/4090 class).

## What verified
The tech class is real: FastVideo's Video Sparse Attention (VSA) applied to MiniMax H3, plus
distillation LoRAs, exists as ComfyUI custom nodes (e.g. barelymining/ComfyUI-MiniMax-H3-FastVideo —
EXPERIMENTAL; OpenVDN's vdn-minimax-h3 hybrid attention). The "faster than playback" framing and
9x-class speedups match published project READMEs.

## What did NOT verify
- The reel never names the repo — the link is gated behind "comment VIDEO". Which exact project
  the creator used is unknown.
- The "72s vs 650s" figure is the creator's own benchmark, unverified independently.

## Verdict (Garrett's standing position, 2026-09-28)
WATCHLIST only, not a build lane. Reasons:
1. Hardware: needs a 24GB VRAM NVIDIA card — no such box on hand.
2. GSE doctrine: AI-generated video must NEVER substitute for real footage in GSE sports content.
   Any revenue-engine use (client work, signage) would have to be tech-invisible per the branding
   rule (never "AI" in the product name or pitch).
3. The most relevant project is still experimental status.

## Revisit triggers
- Repo leaves experimental / lands official ComfyUI integration
- GPU access (cloud credits or local 3090/4090)
- A revenue-engine client asks for generative video and approves it
