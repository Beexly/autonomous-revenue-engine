/**
 * 2510.21575 — SloPragEval: Quality, Quantity, Relation, Manner.
 * Polyester girlfriends was an idiom in the title, not a product.
 * Port: a reply that flouts a maxim on purpose can still Hold.
 * A slogan that obeys none of them cannot.
 */

const ACTS = [
  { re: /\b(measured|measure|counted|widths?)\b/i, act: "measure" },
  { re: /\b(kept|keep|scratch-out|refused|won't)\b/i, act: "refuse" },
  { re: /\b(already said|he said|she said|they said)\b/i, act: "notice" },
  { re: /\b(sit|wait|48)\b/i, act: "wait" },
];

export function prag(text: string, parent = ""): { act: string; maxims: string[]; ok: boolean; reason: string } {
  const t = text.trim();
  const act = ACTS.find((a) => a.re.test(t))?.act ?? "none";
  const maxims: string[] = [];
  if (/\d/.test(t) || act !== "none") maxims.push("quality");
  const bits = t.split(/[.!?]/).filter((s) => s.trim().length > 2);
  if (bits.length >= 2 && bits.length <= 5) maxims.push("quantity");
  if (parent) {
    const hit = parent
      .toLowerCase()
      .split(/\W+/)
      .filter((w) => w.length > 4)
      .some((w) => t.toLowerCase().includes(w));
    if (hit) maxims.push("relation");
  } else if (act !== "none") {
    maxims.push("relation");
  }
  if (!/\b(unlock|delve|holistic|tapestry|game-changer)\b/i.test(t)) maxims.push("manner");
  const ok = act !== "none" && maxims.length >= 3;
  return {
    act,
    maxims,
    ok,
    reason: ok
      ? act + " · " + maxims.join(" · ")
      : "No speech act, or it flunks the maxims. Say a leftover.",
  };
}
