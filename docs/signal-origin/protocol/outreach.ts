/**
 * Referral, close, three-touch. Owner still sends.
 * X DMs to strangers is the 150-row log in a different skin.
 * Channel: paper at the desk, then SMS to that shop, then stop.
 */

export const CLOSE = "Friday work? If you hate it you don't pay.";

export const ASK_NO =
  "Who else on this strip still has a photo from 2019? I'll leave them a square.";

export const ASK_YES =
  "When it's live on your phone Friday, who else here should get one? Two names.";

export const OBJECTIONS: Record<string, string> = {
  "already have a guy": "Keep him. This is one screen, your number, Friday. If you hate it you don't pay.",
  "send me something": "That's the square. Your number is on it. I'll be back Friday if you want it live.",
  "too much": "Three-fifty after you see it on your phone. Not today.",
  "what is this": "Your listing photo is old. I already built the page. Here's the paper.",
};

export type Touch = {
  n: 1 | 2 | 3;
  wait: string;
  text: string;
  stop: boolean;
  channel: "paper" | "sms" | "mail";
};

export const KIT_SEQ: Touch[] = [
  {
    n: 1,
    wait: "at the desk",
    channel: "paper",
    text: "Paper in their hand. Ask Friday work. Ask two names even on a no.",
    stop: false,
  },
  {
    n: 2,
    wait: "+2 days",
    channel: "sms",
    text: "Still have the square? I can have it live Friday. If you hate it you don't pay. Three-fifty after you see it.",
    stop: false,
  },
  {
    n: 3,
    wait: "+7 days",
    channel: "sms",
    text: "Last note. Square still stands. I won't ping again.",
    stop: true,
  },
];

export const GOLD_SEQ: Touch[] = [
  {
    n: 1,
    wait: "same day",
    channel: "mail",
    text: "Outside view of the two pixels, free.",
    stop: false,
  },
  {
    n: 2,
    wait: "+2 days",
    channel: "mail",
    text: "If you want the written diagnostic: $250, 48 hours.",
    stop: false,
  },
  {
    n: 3,
    wait: "+7 days",
    channel: "mail",
    text: "One bump. Then I stop.",
    stop: true,
  },
];

export function nextTouch(seq: Touch[], sent: number): Touch | { stop: true; reason: string } {
  if (sent >= 3) return { stop: true, reason: "Three. Stop. A fourth is the 150-row log." };
  return seq[sent] ?? { stop: true, reason: "Sequence empty." };
}

export function kitSmsHref(shop: string, body: string): string {
  return "sms:?&body=" + encodeURIComponent(shop ? shop + " — " + body : body);
}

export function referOk(names: string[]): { ok: boolean; reason: string } {
  const n = names.map((s) => s.trim()).filter(Boolean);
  if (n.length >= 2) return { ok: true, reason: "Two doors. That's the route." };
  if (n.length === 1) return { ok: false, reason: "One name is a maybe. Ask for the bay next to them." };
  return { ok: false, reason: "Ask on the no. Ask on the yes. Don't wait for Friday to start the route." };
}
