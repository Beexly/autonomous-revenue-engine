# Grok Bot Review Checklist — Signal Origin / conformal-lite

Use this every time you touch the free core, master prompt, or public surfaces.

## 1. Adaptive CP code (`apps/conformal-lite/`)

- [ ] Four modes present and selectable: `aci`, `saocp`, `cqr`, `evalue`
- [ ] Numpy-only free core (no MAPIE / Puncc / TorchCP hard dependency)
- [ ] ACI: online `alpha_t` update (Gibbs & Candès style)
- [ ] SAOCP: sleeping-experts / multiplicative-weights mix of ACI gammas (not a vendor port)
- [ ] CQR: quantile residual conformal preferred for heteroscedastic targets
- [ ] E-value: soft-rank e-variable + post-hoc α support
- [ ] Coverage honesty statement present in README (exchangeability / adaptive assumption)
- [ ] Sports/DFS stays out of this package
- [ ] No rewrite of public copy, no auto-publish, no paid metering unless `ORIGIN_METER=1` (local JSONL stub only)
- [ ] Unit tests pass (`cd apps/conformal-lite && pip install -q . && python -m unittest discover -s tests`)

## 2. Signal Origin Master Prompt (`ops/SIGNAL_ORIGIN_MASTER_PROMPT.md`)

- [ ] Human-primary + anti-AI-slop gates still listed
- [ ] Free-path law (ABSENT-only free cores)
- [ ] Phoenix weights (copy-link ~20×, reply 5–20×)
- [ ] Voice lock + GSE math separation + honesty surfaces
- [ ] Conformal stack order matches shipped code: ACI → SAOCP → CQR → e-value
- [ ] Lago is the intended paid path; current meter is local stub only
- [ ] Fleets remain conceptual (no swarm of extra agents on the free core PR)

## 3. Operating picture (from Origin Factory / current board)

- [ ] fold-ruler on main
- [ ] conformal-lite on main with the four modes
- [ ] Fastest public attention still requires human `APPROVE SHOW HN`
- [ ] Stripe / real Lago billing stays off the first touch
- [ ] Sports/DFS remains out of Origin Factory scope for this free core

## 4. Before any public surface or paid wedge

- [ ] Hold ≥ 9.2 + swap test + voice-delta
- [ ] Free-path law still holds
- [ ] Coverage / efficiency numbers measured on a non-stationary stream if claiming adaptive
- [ ] No API keys or secrets committed
- [ ] ACTION_LOG updated with the delta

## 5. Immediate next (do not expand scope)

1. Keep conformal-lite tight and correct
2. Finish fold-ruler PR if still open
3. Only after human APPROVE SHOW HN for public attention
4. Lago real metering is a later paid wedge, not this free core

Pass the checklist before claiming the free core is ready for the next loop.
