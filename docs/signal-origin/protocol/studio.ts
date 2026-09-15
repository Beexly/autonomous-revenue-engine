/**
 * Media studio. XXX is one rail. Not the building.
 *
 * Stolen from MEDIA_STUDIO_VISION (Beexly/XXX) + Inspector three files
 * + Bond leftover + Helper locked set + ehuanglu four nodes.
 *
 * SFW rails run here. Adult rail is a pointer at XXX, local-only.
 * Kids original-IP is parked. Sports never enters.
 */

export type RailId =
  | "kit"
  | "hold"
  | "product"
  | "craft"
  | "cooking"
  | "fitness"
  | "adult";

export type Rail = {
  id: RailId;
  name: string;
  job: string;
  cashThisWeek: boolean;
  face: string;
  set: string;
  motion: string;
  residue: string;
  revenue: string;
  fence: string;
  repo: "are" | "xxx";
};

export const RAILS: Rail[] = [
  {
    id: "kit",
    name: "Kit",
    job: "One-screen for a Kingwood shop. $350. Live Friday.",
    cashThisWeek: true,
    face: "The shop. Not a model. Name, three prices, their number.",
    set: "Their plaza or their truck. Oak on 1488 if it's Ray.",
    motion: "Call button. Or he sets a trimmer and looks once.",
    residue: "Same truck, same dent, same oak.",
    revenue: "$350 if they don't hate it. Venmo after it's on their phone.",
    fence: "Don't say AI on the floor. No 555. No deposit before live.",
    repo: "are",
  },
  {
    id: "hold",
    name: "Hold",
    job: "Paste-ready replies from @SignaL_OriginHQ. Cap 3.",
    cashThisWeek: false,
    face: "The writer. Dry. A leftover in the sentence.",
    set: "Someone else's post. Not a stage.",
    motion: "No follow ask. No hashtag.",
    residue: "If you said you measured the widths yesterday, don't forget.",
    revenue: "Views are not a dollar. Don't put 58k on the board.",
    fence: "Never from Galaxy Sports Edge. Sit 48h on 'this u?'.",
    repo: "are",
  },
  {
    id: "product",
    name: "Product still",
    job: "One photo of a thing. Four nodes: character, product, env, motion.",
    cashThisWeek: false,
    face: "The product. Hands optional. No new girl.",
    set: "Locked. Same table, same window, same phone crop.",
    motion: "One turn or one set-down. Nine seconds.",
    residue: "Same label scuff from yesterday.",
    revenue: "Affiliate / shop-pay later. $0 until a dollar hits.",
    fence: "Filmera/Kling is a bill. This desk writes the card. Owner generates.",
    repo: "are",
  },
  {
    id: "craft",
    name: "Craft",
    job: "Pottery, iron, wood. Unremarkable hands.",
    cashThisWeek: false,
    face: "The hands and the work. Not a lifestyle girl.",
    set: "Same bench. Same window light. Imperfect frame.",
    motion: "Wheel once. Or a file across iron.",
    residue: "Same clay on the rim. Same scar on the bench.",
    revenue: "Shop / affiliate after a real page exists.",
    fence: "Jack's pottery clip got called as a real IG. Don't claim AI unless it is.",
    repo: "are",
  },
  {
    id: "cooking",
    name: "Cooking",
    job: "One pan. One motion. Same kitchen.",
    cashThisWeek: false,
    face: "The pan. Hands if they survive inspection.",
    set: "Same stove, same chipped Dutch oven.",
    motion: "Flip or stir. That's the clip.",
    residue: "Chip on the rim stays in frame.",
    revenue: "Affiliate spices / a $19 PDF later. Not this week.",
    fence: "No cinematic steam. No new kitchen.",
    repo: "are",
  },
  {
    id: "fitness",
    name: "Fitness",
    job: "Locked court or garage. One move.",
    cashThisWeek: false,
    face: "A rec-league body. Not a tennis 'champion' screenshot.",
    set: "Same garage wall. Same crack in the concrete.",
    motion: "One serve, or one hang from the bar.",
    residue: "Crack in the concrete. Same tape on the bar.",
    revenue: "$0 until a dollar hits. Frost's $58k stays his.",
    fence: "No bikini-as-sport. Adult goes to the adult rail.",
    repo: "are",
  },
  {
    id: "adult",
    name: "Adult (XXX)",
    job: "21+ personal-brand vertical. Local only.",
    cashThisWeek: false,
    face: "Lives in Beexly/XXX. Same three files. Not this desk.",
    set: "media-ops, local. Never cloud. Never logged here.",
    motion: "Owner attests. Agents do not generate.",
    residue: "Same character bible as every other rail.",
    revenue: "firstCashService in XXX. Screenshots from a timeline are not cash.",
    fence: "Never mix Stripe, logs, or Chat with ARE / bus / Sports.",
    repo: "xxx",
  },
];

export function rail(id: RailId): Rail {
  const r = RAILS.find((x) => x.id === id);
  if (!r) throw new Error("no rail " + id);
  return r;
}

export type Atom = {
  rail: RailId;
  premise: string;
  sports?: boolean;
  generate?: boolean;
  publish?: boolean;
};

export type StudioVerdict = {
  ok: boolean;
  rail: Rail;
  reason: string;
};

export function assign(atom: Atom): StudioVerdict {
  const r = rail(atom.rail);
  if (atom.sports) {
    return { ok: false, rail: r, reason: "Sports never enters the studio." };
  }
  if (atom.publish) {
    return { ok: false, rail: r, reason: "Draft only. Owner posts." };
  }
  if (atom.rail === "adult" && atom.generate) {
    return { ok: false, rail: r, reason: "Adult generate is XXX, local, owner. Not this process." };
  }
  if (r.repo === "xxx" && atom.rail !== "adult") {
    return { ok: false, rail: r, reason: "Wrong repo." };
  }
  return { ok: true, rail: r, reason: r.fence };
}

export function mix(a: RailId, b: RailId): { ok: boolean; reason: string } {
  if (a === b) return { ok: true, reason: "same rail" };
  if (a === "adult" || b === "adult") {
    return { ok: false, reason: "Adult does not share logs, Stripe, or Chat with the other rails." };
  }
  return { ok: true, reason: "SFW rails may share the three-file OS. Faces stay separate." };
}
