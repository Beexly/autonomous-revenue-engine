# Indie Hackers product-launch draft — do not post, do not submit

**Title:** Three drafts cleared Pass. qi-check scored the lead 8.3. I put the scorer on a free static page.

**Where it would be posted (verified, not submitted):**
- Group: https://www.indiehackers.com/group/product-launch — Product Launch; live page title "Product Launch"; lede "Announcements and discussions about launching product & services."; "New Post" control present; ~2,943 members.
- Compose URL: https://www.indiehackers.com/new-post — retrieved a sign-in wall ("Sign in to Indie Hackers" / "Join the community!"). Did not log in. Did not create an account. Did not submit.
- Not this draft's destination: https://www.indiehackers.com/submit is editorial "Submit a Story" / series pitch, not a product launch. https://www.indiehackers.com/products is the Products DB with "Add Your Product" (directory listing, separate from this post).

**Offer (one, in-thread):** the free githack page. No Stripe. No PDF. No second tool.

---

## Body (paste into the Product Launch composer)

Three drafts cleared our internal Pass queue. qi-check scored the lead one — SO-010 — 8.3, which is Soft rewrite, not Hold. Hold is 9.2, locked in `apps/qi-check/lib/score.js`. Approved to publish: none. The kill was interchangeability: swap those lines onto a hundred other operator accounts and the join would not show. A Pass queue that lets that through is not a gate. I needed a number that would say so without writing a better post for me.

I put the scorer on a static HTML page. You paste a draft. It returns Hold, Soft rewrite, or Hard rewrite, plus a fix list. Scoring runs in the page — no server, no account, no Stripe in the scoring path. It does not write the post. It does not publish.

Use it here (free, no install):

https://raw.githack.com/Beexly/autonomous-revenue-engine/main/docs/qi-check.html

Source is `apps/qi-check` in https://github.com/Beexly/autonomous-revenue-engine. The page inlines `lib/score.js` (version 0.2.0). Five axes, all deterministic, no model: firstScreenDensity, foldStructure, baitAvoidance, lengthFitness, burstiness. Composite under 9.2 cannot Hold. Empty input is Hard rewrite. Soft floor is 7.0. A draft can still miss Hold even above 9.2 if first-screen density is weak, bait patterns fire, or the fix list hits three items. That is the point of a floor: it refuses to round a near-miss into a ship.

What it will not do is author the rewrite. We already watched three Pass-cleared drafts die on the swap test. The scorer is the part that will not paper over that. If you paste something you were about to ship, I want the number more than the compliment.

---

**Swap-test (not part of the post):** Holds only as a free in-page scorer that will not write, with the lived 8.3 / three-Pass-queue / interchangeability kill and Hold 9.2 intact. Swap the name onto a writer, humanizer, detector, or generic "I launched a writing tool" and those facts fall out. A second offer (PDF, paid API, another CLI) would also fail the one-offer rule.

**Verification (not part of the post; 2026-08-25):**
- https://www.indiehackers.com/ — WebFetch returned the live homepage (build-in-public posts, Featured interviews, "Submit a Post to Indie Hackers"). Box curl: Cloudflare HTTP 429.
- https://www.indiehackers.com/group/product-launch — WebFetch returned the Product Launch group as described above.
- https://www.indiehackers.com/new-post — WebFetch returned the unauthenticated compose/sign-in wall. Not logged in. Not submitted.
- https://www.indiehackers.com/products — WebFetch returned Products DB / Build Board / "Add Your Product".
- https://www.indiehackers.com/submit — WebFetch returned "Make Our Audience Your Audience" editorial submit (story/series), not used as this draft's destination.
- githack qi-check — WebFetch returned "qi-check — Viewport Hold" with paste/score, "It does not write the post. It does not publish. Scoring runs in this page — no server required." GitHub raw of the same HTML confirmed inlined score.js v0.2.0, HOLD_FLOOR 9.2, SOFT_FLOOR 7.0. Box curl to githack: Cloudflare HTTP 403; content confirmed via WebFetch + GitHub raw, not via this box's curl.
