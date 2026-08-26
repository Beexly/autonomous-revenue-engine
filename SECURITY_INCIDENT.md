# Security Incident — Leaked Meta Platform Credential

**Status:** UNRESOLVED — owner action required at Meta, not fixable from inside this repository.
**Severity:** High. This is a public repository; the credential is retrievable by anyone who clones it.

## What happened

A Meta platform credential was committed to this public repository as `ops/META_KEY.local` in commit `0a38eed` ("Add Meta MCP/Ads/Dev platform exploration + temporary key placeholder for rotation"). It was removed from the working tree in a later commit, `07a00e0` ("Lago + CAPI helpers; drop leaked Meta key"), and `ops/META_KEY.local` / the `*.local` glob were added to `.gitignore`.

The affected variable name, as documented elsewhere in this repo (`ops/META_INTEGRATIONS.md`), is `META_LLM_KEY` — a different credential from `META_ACCESS_TOKEN`, which is what `apps/conformal-lite/capi.py` reads at runtime. Do not assume rotating one covers the other; confirm both if both were ever populated.

## Why deleting the file did not fix anything

Removing a file from HEAD and adding it to `.gitignore` stops *new* commits from re-adding it. It does nothing to the commit that already contains it. `0a38eed` is still reachable in this repository's history, and its blob is still fetchable by anyone who clones the repo — this is how git works, not a bug in this repo specifically. **The credential must be treated as compromised right now, today, not as "leaked then fixed."**

## What this document deliberately omits

This file contains no extraction command, no token value or fragment, and no Meta App ID. A prior attempt at writing this exact incident note (PR #21, branch `sonnet/garrett-pending-security-note`) made precisely the mistake this paragraph exists to avoid: it published the `git show` retrieval command *and* the Meta App ID in the same public document that asked for rotation, handing a finder the retrieval instructions in the same breath as the warning. That version must not be merged as-is; see `ops/GARRETT_PENDING.md` for the corrected, non-leaking version of the owner instruction.

## The only real fix

Two separate actions, not one:

- **History rewrite or repo re-creation** is the only way to remove the blob itself from git history. This is optional cleanup — it does not undo any clone or fork made before the rewrite, and it is easy to execute incorrectly (force-pushed history rewrites break every other clone and open PR branch).
- **Rotation at the Meta App Dashboard** is the only way to make the leaked credential harmless regardless of how many copies of the history exist. This is mandatory, it is an owner action, and it cannot be performed from inside this repository or by an agent working in it — no code change here fixes this.

Rotation is the action that matters. History rewrite without rotation leaves a compromised credential live; rotation without history rewrite leaves an old, harmless credential visible in history, which is an acceptable end state.

## History audit performed

All 37 branches / 603 unique non-binary blobs in this repository's git history were scanned for other credential-shaped strings (AWS access-key format, GitHub token format, Slack token format, Stripe/OpenAI key format, PEM private-key blocks, and generic `key=` / `token=` / `secret=` / `password=` assignments), without reproducing any matched value in full.

Results:
- **No other real credential was found.**
- The only AWS-key-, Slack-token-, and private-key-shaped strings anywhere in history are intentional test fixtures inside a secret-scanner's own test suite (`ops/tools/tools.test.mjs`, present only on the unmerged branches `claude/multi-pr-batch-verify-aac069` and `sonnet/queue-lint-pack`) — publicly documented example values (e.g. AWS's own official `AKIAIOSFODNN7EXAMPLE`), not live credentials, and not present on `main`.
- The Meta App ID appears in several documents on unmerged branches (the PR #21 branch, and PR #17-derived operator-prompt docs) but **does not appear in any file on `main`** as of this audit (`main` at `9805377`). Whoever merges those branches should strip the App ID from them per the fix already demonstrated in PR #33's description, rather than reintroducing the exposure.

## Current state

- `ops/META_KEY.local` is untracked and gitignored on `main`.
- No file in this repository confirms rotation has happened.
- Until an owner confirms rotation, assume the credential is live and usable by anyone who bothers to clone this repo and inspect its history.
