# Skill security scanning — SkillSpector (2026-09-28, Motif)

**Owner: autonomous revenue engine.** Agent-ops tooling: vet every third-party skill before install.

## What it is
NVIDIA SkillSpector (github.com/NVIDIA/skillspector, Apache-2.0, ~18.5k stars, actively
maintained — pushed 2026-09-28). Security scanner for AI agent skills and MCP servers: detects
prompt injection, data exfiltration, malicious patterns, supply-chain risks, and excessive agency
before installation. This matches the @ariacodez reel (2026-09-17) claims: paste a GitHub URL,
get a report with exact lines flagged, free, open source, no account.

## Installed on this VM
- `pip install 'git+https://github.com/NVIDIA/skillspector.git'` (installed 2026-09-28)
- Binary: ~/.local/bin/skillspector (symlink it to /usr/local/bin if PATH issues)
- Static mode needs NO API keys: `skillspector scan <target> --no-llm`
- LLM mode (deeper semantic analysis) needs a model key via SKILLSPECTOR_* env vars

## Commands
- `skillspector scan <skill-dir|git-url|zip> --no-llm [--format json]`
- `skillspector scan <target> --format json` → read `risk_assessment.recommendation`
  (SAFE / CAUTION / DO_NOT_INSTALL) and `risk_assessment.score` (0-100)
- `skillspector mcp` → MCP server mode: exposes scan_skill as a tool agents can call
- `skillspector baseline` → suppress reviewed findings

## Live verification (2026-09-28)
Ran a static scan against ~/workspace/skills/github (our own first-party skill). It flagged:
- __pycache__/ bytecode shipped in bin/ (SC8/SC9, HIGH) — legit supply-chain hygiene flag;
  CLEANED UP from all workspace skills on 2026-09-28 as a result
- No declared tool scope despite network capability (LP3, MEDIUM)
- "Never ask the user" autonomy phrasing (EA2, MEDIUM)

Verdict came back DO_NOT_INSTALL / score 100 on a known-safe skill — static mode errs LOUD.
Conclusion: excellent Round-0 pre-screen, not a final verdict. A clean scan does not replace
human review of anything we didn't write ourselves; a dirty scan stops the install cold.

## Where it fits (revenue engine)
- Gate for every third-party skill/repo Garrett or the fleet wants to adopt (fleet installs
  untrusted code constantly — this is the intake guardrail)
- Wire into the coding agent's skill-creation flow: scan before landing new skills
- Optional: run `skillspector mcp` so agents can self-scan before installing anything
