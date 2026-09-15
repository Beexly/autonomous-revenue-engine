/**
 * Instagram DdRPEoHmw6J — MatAnyone 2 (NTU S-Lab, CVPR 2026 Highlight).
 * Repo: pq-yang/MatAnyone2. $0. First-frame mask in, alpha + foreground out.
 * Second model (MQE) scores cleanup before the clip is finished.
 *
 * Steal: assign the subject on frame one. Score the matte before you ship.
 * Do not pip install it this week. Do not matte the oak off Ray.
 * Do not "comment AI for the list." That's bait.
 */

export function matteOk(clip: {
  firstFrameMask: boolean;
  leftoverOnSet: boolean;
  hairOrHands: boolean;
  commentForLink?: boolean;
}): { ok: boolean; reason: string } {
  if (clip.commentForLink) {
    return { ok: false, reason: "Comment-for-link is bait. The paper is on the square." };
  }
  if (!clip.firstFrameMask) {
    return { ok: false, reason: "No first-frame assignment. That's their whole method. Sheet before the clip." };
  }
  if (clip.leftoverOnSet) {
    return { ok: false, reason: "The leftover is the set (oak, plaza, 2019 photo). Don't punch it out." };
  }
  if (!clip.hairOrHands) {
    return { ok: false, reason: "MQE would fail this. Hair, folds, or hands have to survive." };
  }
  return { ok: true, reason: "Assigned on frame one. Inspectable edge. Owner films. We don't run the weights here." };
}
