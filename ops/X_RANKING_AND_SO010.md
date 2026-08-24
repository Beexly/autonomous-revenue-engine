# X ranking factors (2026) + SO-010 engagement analysis

**Sources:** public `xai-org/x-algorithm` home-mixer defaults (param.rs, ~Aug 2026 sync) + Official OCR help language. Weights scale **P(action)**, not raw counts.

---

## 1. Ranking formula (shape)

`Final Score ≈ Σ (weight_i × P(action_i | viewer, post))`

Candidates from in-network (Thunder) and out-of-network (Phoenix). Out-of-network and replies/reposts get discounts vs strong originals in many paths. New-author boost can lift low-impression authors toward a target position.

### Positive coefficients (published defaults)
| Action | Weight |
|--------|--------|
| Share via copy link | **20.0** |
| Reply on original from mutual follow | **20.0** (5 + 15 boost) |
| Reply | 5.0 |
| Quote | 5.0 |
| Share via DM | 5.0 |
| Follow author | 4.0 |
| Share | 2.0 |
| Repost | 1.0 |
| Like | 0.5 |
| Post click | 0.4 |
| Open link | 0.2 |
| Media expand / VQV | ~0.05 |
| Continuous dwell | 0.004 (small) |
| Profile click | **0.0** |
| Binary dwell | **0.0** |

### Negative coefficients
| Action | Weight |
|--------|--------|
| Report | **−234** |
| Mute author | −58.8 |
| Not interested | −43.2 |
| Block author | −31.2 |

**Implications for us:** Optimize for *worth sending / worth answering*, not likes. Avoid anything that predicts mute/not interested (sludge, bait, spam cadence).

---

## 2. OCR (payout) vs ranking (reach)

| System | What counts |
|--------|-------------|
| **For You ranking** | Predicted positive actions for each viewer |
| **OCR eligibility** | Premium + 500 verified followers + 500k verified HT impressions / 90d (replies out) |
| **OCR payout unit** | Qualified impression: Premium user, Home Timeline, ≥50% visible, unique |

Reach and pay are related but not the same objective. Reply-primary growth can rank and still **fail** OCR impression definitions (replies excluded from the 500k gate).

---

## 3. SO-010 engagement metrics analysis

**Text (approved):** killed three Pass posts for quality / generic AI-operator sameness; silence beats bad first impression.

### Predicted signal fit
| Metric / head | SO-010 fit | Notes |
|---------------|------------|--------|
| Copy-link share | Medium | Builders may send to group chats; not universal viral |
| Reply | **Medium–High** | Invites “show the drafts,” agreement, pushback — without asking for replies |
| Quote | **Medium–High** | Natural quote fuel (“this,” disagreement, “we do this too”) |
| Follow author | Medium | Only if voice feels rare; one meta post won’t convert mass follows |
| Repost | Low–Medium | Identity more than utility |
| Like | Irrelevant as objective | Low weight anyway |
| Open link | N/A | No link |
| Mute / not interested | **Low risk if quality holds** | High risk if it reads as performative humility or AI-brand cosplay |
| Report | Low | No policy bait |

### Structural ranking fit
- **Original post** (not reply) → eligible for broader index / non-follower paths better than reply-primary.
- **Short, complete in first screen** → supports ≥50% visible for any future qualified-impression logic; no “expand to get the point.”
- **Zero CTA / hashtags** → avoids engagement-solicitation patterns OCR and classifiers dislike.
- **New account** → possible new-author lift; still starved of mutual-reply boost until a real graph exists.

### What SO-010 is *not*
- Not a like farm.
- Not optimized for dwell-max longform (and dwell weight is small in the published blend).
- Not a growth-hack thread.

### Success metrics for this single post (realistic)
Track after 24–48h (candidate window is short for text):
1. Replies + quotes (quality > count)  
2. Whether any Premium-looking accounts engage  
3. Profile visits / follows as soft secondary  
4. **Do not** judge success by likes alone  

If engagement is zero: still correct decision if the alternative was shipping the killed batch — brand prior > one dead post.

### Follow-up rule
If people ask for the killed drafts: do **not** paste the sludge. Point to standard (“didn’t clear quality”) or ship the *next* non-meta Pass later.

---

## 4. Operator rules derived
1. Prefer originals over reply-as-distribution for OCR path.  
2. Write for copy/quote/reply *worthiness*, never “comment yes.”  
3. First screen = whole point (50% visible).  
4. One strong post > cadence of average posts (negative feedback compounds).  
5. Meta (SO-010) at most rare; next public asset should demonstrate craft, not discuss process.
