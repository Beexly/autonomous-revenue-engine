/**
 * Locked-set 9-second card.
 * Helper_Prime 2099608235099717813: keep the bed, keep the suits, pull wide.
 * We keep the truck. One motion. Inspectable hands.
 * Bond: one person, one action, enough doubt that they rewind.
 * Kling / Filmera cost money. This card is the thing you film on a phone
 * in a Kingwood parking lot, or feed later. Owner generates. We don't.
 */

export type Shot = {
  set: string;
  wardrobe: string;
  motion: string;
  inspect: string;
  seconds: number;
  phone: string;
};

const CINEMA = /\b(drone|orbit|god rays?|cinematic|slow.?mo(?:tion)?|crane|helicopter|unreal)\b/i;
const MULTI = /\b(then (he|she|they|we)|cut to|montage|smash cut)\b/i;

export function qcShot(s: Shot): { ok: boolean; reasons: string[] } {
  const reasons: string[] = [];
  const blob = [s.set, s.wardrobe, s.motion, s.inspect, s.phone].join(" ");
  if (s.seconds > 12) reasons.push("Keep it under 12 seconds. Bond's fruit clip is 5.");
  if (CINEMA.test(blob)) reasons.push("Cinema. Stranger would know. Kill.");
  if (MULTI.test(s.motion)) reasons.push("One motion. 'Then' is a second shot.");
  if (!s.inspect.trim()) reasons.push("Need one inspectable thing: hands, dent, oak, wrench.");
  if (!s.set.trim()) reasons.push("Lock the set. New location is a new shoot.");
  return { ok: reasons.length === 0, reasons };
}

export function kitReel(shop: string): Shot {
  return {
    set: "White F-150 nose-in at a Kingwood plaza. Live oak on 1488 in the left of frame. Morning, not golden hour.",
    wardrobe: "Faded navy work shirt, same dent on the rear passenger door.",
    motion: "He sets a trimmer in the bed and looks at the camera once.",
    inspect: "Hands on the trimmer. Dent. Oak. If a stranger starts counting fingers, it worked.",
    seconds: 9,
    phone: shop + " on a paper square, $350, taped inside the window. Not a caption.",
  };
}

export function promptForOwner(s: Shot): string {
  return [
    s.set,
    s.wardrobe,
    s.motion,
    "Hold " + s.seconds + " seconds. Phone vertical. No music.",
    "The inspectable detail is: " + s.inspect,
    "If it looks like an ad, throw it away and film it again from farther back.",
  ].join(" ");
}
