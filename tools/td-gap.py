#!/usr/bin/env python3
"""Map the six recovered anytime-touchdown checks onto the engine.

The prompts are usage questions. The engine's red-zone module answers
two of them with league conversion rates. It does not know this week's
sneak share, script, or which position a defense actually gives up.
No pick is produced here.
"""

from __future__ import annotations

CHECKS = (
    ("GOAL LINE", "partial", "inside-the-5 carries and targets, league conversion rates"),
    ("RED ZONE", "partial", "inside-the-20 volume, not this opponent's red-zone defense"),
    ("SCRIPT", "missing", "lead, trail, or close, and what that does to his chances"),
    ("LONG SCORE", "missing", "distance scores versus goal-line scores"),
    ("SOFT SPOT", "missing", "which position this defense gives up scores to"),
    ("QB VULTURE", "missing", "sneaks and designed quarterback runs inside the 5"),
)


def main() -> int:
    print("TD_GAP")
    for name, status, note in CHECKS:
        print(f"{status}\t{name}\t{note}")
    print("answered 2 of 6 as league rates. weekend slate not run. no pick.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
