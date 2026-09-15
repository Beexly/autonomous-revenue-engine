/**
 * astorie_ai 2098214948577173742 — fake sports drink, 8–60s, MiniMax credits.
 * Steal: a product brief, inspectable hands, leftover on the label.
 * Kill: sports, new faces in the circles, 60s, Astorie/H3 bill.
 */

export type Brief = {
  sku: string;
  seconds: number;
  sports?: boolean;
  newFaces?: number;
  credits?: boolean;
};

export function briefOk(b: Brief): { ok: boolean; reason: string } {
  if (b.sports || /sport/i.test(b.sku)) {
    return { ok: false, reason: "Sports stays off this bus. GSE is a different login." };
  }
  if (b.credits) return { ok: false, reason: "Astorie/MiniMax/H3 is a bill. Card here. Owner later." };
  if ((b.newFaces ?? 0) > 0) return { ok: false, reason: "No new faces in the circles. Hands and the thing." };
  if (b.seconds > 9) return { ok: false, reason: "Nine seconds. 60 is a commercial." };
  if (!b.sku.trim()) return { ok: false, reason: "Name the thing." };
  return { ok: true, reason: "Product still. Hands. Leftover on the label." };
}

export const PRODUCT_CARD = {
  sku: "The bottle on their counter. Not a drink we invented.",
  seconds: 9,
  leftover: "Same scuff on the label as yesterday.",
  hands: "Inspectable. Ring is fine. New girl in a circle is not.",
};
