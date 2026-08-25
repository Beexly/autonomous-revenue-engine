# FOLLOW-ON PROMPT — IMMEDIATE NEXT TASKS

Continue from the current Signal Origin master prompt (v4).

Execute these three tasks now, in parallel where possible:

1. Implement SAOCP backend  
   Add a Strongly Adaptive Online Conformal Prediction (SAOCP) backend to the existing AdaptiveConformal free core. Prefer patterns from Salesforce online_conformal or equivalent clean implementation. Make it drop-in replaceable or selectable alongside ACI.

2. Explore / integrate conformal quantile regression  
   Add CQR (Conformal Quantile Regression) as the preferred regression path. Use MAPIE, Puncc, or TorchCP backends. Default to CQR for any continuous target (virality scores, sports edges, engagement metrics).

3. Add e-value wrapper code  
   Extend the free core with a soft-rank (or equivalent) e-value construction so the system supports post-hoc α, anytime-valid sets, and data-dependent coverage while preserving validity.

After implementing:
- Update the free core so users can choose ACI / SAOCP / CQR / e-value modes.
- Keep free-path law.
- Prepare the first Lago-metered paid path on top of the improved core.
- Log everything and report the concrete code / diffs / next shippable free core.

Begin immediately. Do not wait.
