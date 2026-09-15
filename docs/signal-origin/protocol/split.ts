/**
 * 2007.08740 — GSplit: lesion vs procedural bias vs null.
 * Don't optimize selection and prediction as one score.
 * Leftover = lesion (select on this).
 * Even widths / phrase density = procedural (use to predict, don't let them eat a leftover).
 */

export function splitGate(opts: {
  leftover: boolean;
  evenWidths: boolean;
  phraseHeavy: boolean;
}): { keep: boolean; reason: string } {
  if (opts.leftover && (opts.evenWidths || opts.phraseHeavy)) {
    return {
      keep: true,
      reason: "Leftover is the lesion. Even widths are procedural. Keep the draft. Don't sand the scar.",
    };
  }
  if (!opts.leftover && opts.evenWidths) {
    return { keep: false, reason: "No leftover. Even widths is the whole thing. Rewrite." };
  }
  if (opts.leftover) return { keep: true, reason: "Leftover present. Selection holds." };
  return { keep: false, reason: "Null. Nothing to select." };
}

export function hasLeftover(text: string): boolean {
  return (
    /\b(17,?000|widths?|scratch-out|dent|oak|stanley|48h|already said)\b/i.test(text) ||
    /\d/.test(text)
  );
}
