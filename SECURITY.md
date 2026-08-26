# Security Policy

This is a small, actively-developed, single-owner project. There is no dedicated security team and no SLA — reports get a best-effort response, not a guaranteed timeline.

## Reporting a vulnerability

1. **Prefer GitHub's private reporting.** Open this repository's **Security** tab → **"Report a vulnerability"** to file a private Security Advisory. This reaches the owner without exposing the report, or any exploit detail, publicly.
2. If private advisories are not enabled on this repository, open a regular issue that says only "security issue — requesting a private channel to report" and nothing else. Do not put exploit details, credentials, or reproduction steps for an active vulnerability in a public issue.

## Reporting a leaked credential specifically

If you find a live credential in this repository or its git history: report it the same way (private advisory, or the placeholder-issue method above). **Do not paste the credential value, or the exact git command to retrieve it, into a public issue, PR, or comment** — reference the commit hash and file path instead, and let the owner retrieve and rotate it privately. See `SECURITY_INCIDENT.md` at the repo root for how this has gone wrong here before.

## Scope

Covers this repository's own code, the static site under `docs/`, and its CI configuration. Does not cover the owner's other accounts, third-party services this project integrates with, or unrelated repositories.

## Known incidents

See `SECURITY_INCIDENT.md` at the repository root for the currently disclosed incident (a leaked Meta platform credential) and its status.
