# Operator contract — Claude Code sessions

This file auto-loads into every Claude Code session on this repo. It is the
minimum contract. The full standing orders are `ops/SONNET_OPERATOR_PROMPT.md`
— read that next when running a work session.

## Bootstrap (every session, in order)

1. `git fetch origin && git status && git log --oneline -5`
2. Read `ops/GARRETT_PENDING.md` (what is blocked on the owner),
   `ops/PASS_QUEUE.md` (publish-gate state), `ops/FIFTY_LOOPS.md`
   (the file-only backlog board).
3. List open PRs before starting anything — another session may already
   carry the fix you are about to write. Never duplicate an open PR's work.
4. Gates green before new work (below). If a gate is red, fixing it is
   task #1.

## Gates

```
for a in hn-bait qi-check subject-fold swap-check voice-delta; do (cd apps/$a && npm test --silent) || echo "RED: $a"; done
cd apps/conformal-lite && pip install -q . && python -m unittest discover -s tests
```

If `apps/conformal-lite` has no `pyproject.toml` on your checkout, the
installable-package fix is already open as a `sonnet/*` PR — do not redo it;
base your work on `origin/main` and note the dependency.

## Branch discipline

- One task = one branch `sonnet/<slug>` cut from `origin/main` = one draft PR.
- Never push to `main`. Never self-merge. Stage files by name, never `git add -A`.
- Never touch `claude/*` branches (another session's) or rewrite anyone's
  history. A merge commit from main is fine on your own branch; rebase is not
  on anyone else's.

## Laws (breaking one discards the run)

1. **Never fabricate.** Every reported claim traces to a command you ran and
   output you saw. Not run → write `NOT RUN`. Failed → paste the error.
2. **Never publish, post, spend, create accounts, or touch payment rails.**
   Stage + queue for the owner. Unsure whether a surface is public → it is.
3. **Never weaken a guard to go green** — no deleted assertions, loosened
   thresholds, skipped tests, or `--no-verify`.
4. **No secrets in the repo**, ever. `.env` / `*.local` stay ignored. A secret
   deleted from HEAD is still live in history — flag it for rotation instead.
5. **Sports wall:** `Beexly/Sports` math, models, and claims never enter this
   repo's public surfaces.
6. **Honesty surfaces:** a public statistical claim carries a verifiable
   guarantee or it does not ship.

## Known CI quirks (do not chase these as if your diff caused them)

`label` (Labeler), `Deno`, and `Webpack` checks are unedited template stubs
that have failed on every push since repo creation; Vercel previews fail from
project-side config. Removal/fix PRs are open. Before treating any red check
as yours, look at its history on other branches first.

## Handoff

End every work session with the SESSION HANDOFF block (prompt §7) in chat and
in PR bodies. `ops/ACTION_LOG.md` and the root `HANDOFF.md` stay cryptic stubs
by owner decision ("Project Flower" — no operator scoreboard on the public
gate); do not rebuild them.
