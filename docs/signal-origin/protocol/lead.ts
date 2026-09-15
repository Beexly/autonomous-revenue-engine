/**
 * Supabase instead, until keys exist.
 * A row in memory. Mailto is still how it leaves the building.
 */

export type Lead = {
  who: string;
  kind: "kit" | "gold";
  yes: boolean;
  when: string;
};

export function record(leads: Lead[], row: Lead): Lead[] {
  return [...leads, row];
}

export function mailto(row: Lead): string {
  const subj = encodeURIComponent(row.kind === "kit" ? "Kit yes/no" : "Gold ping");
  const body = encodeURIComponent(row.who + " · " + (row.yes ? "yes" : "no") + " · " + row.when);
  return "mailto:signal.origin.hq@gmail.com?subject=" + subj + "&body=" + body;
}
