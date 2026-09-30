# Show HN draft — do not post

**Title:** Show HN: qi-check – a local gate that scores first-screen drafts and will not write them

**Repo:** https://github.com/Beexly/autonomous-revenue-engine (`apps/qi-check`)
**Hosted URL:** https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/qi-check.html (static, $0, scoring in-page). Repo remains the source.

---

## Body

qi-check is a small Next app in that repo. You paste a draft. It returns Hold, Soft rewrite, or Hard rewrite, plus a fix list. The Hold floor is 9.2, locked in apps/qi-check/lib/score.js. It does not rewrite the post, does not publish, and does not claim AI-detection bypass.

Working page (no install): https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/qi-check.html — scoring runs in the browser. Source is apps/qi-check. From the tree: install deps, run the score tests, then start the Next dev server.

The scorer is deterministic (no model): first-screen density in the first ~160 characters, fold structure, bait-pattern avoidance, length fitness, sentence-length burstiness. Composite under 9.2 cannot Hold. Empty input is Hard rewrite.

What it will not do is write a better post for you. We found that gap the hard way: three drafts cleared our Pass queue, scored 8.3 on qi-check (not Hold), and still would have sat on a hundred other operator accounts without the swap showing. That kill is a human log, not a score. qi-check is the part that refuses to author.

No account, no Stripe in the scoring path, no telemetry required to get a number.

---

**Swap-test (not part of the post):** Holds only as a scoring gate that will not write. Swap the name onto a writer, humanizer, or detector and the does-not-write plus Hold 9.2 plus in-page static scorer facts fall out.
