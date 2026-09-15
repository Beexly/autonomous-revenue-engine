/**
 * datasette / duckdb steal: query the measurement rows we already have.
 * No warehouse. No Metabase.
 */

export type Row = {
  id: string;
  asset: string;
  disposition: "pass" | "rewrite" | "kill";
  published: boolean;
  usd: number | null;
};

export const TONIGHT: Row[] = [
  { id: "RB-02", asset: "reply", disposition: "pass", published: false, usd: null },
  { id: "RB-05", asset: "reply", disposition: "pass", published: false, usd: null },
  { id: "RB-03", asset: "reply", disposition: "pass", published: false, usd: null },
  { id: "SO-013", asset: "original", disposition: "kill", published: false, usd: null },
  { id: "kit-walk-in", asset: "page", disposition: "pass", published: false, usd: 0 },
];

export function query(
  rows: Row[],
  where: { disposition?: Row["disposition"]; published?: boolean },
): Row[] {
  return rows.filter((r) => {
    if (where.disposition && r.disposition !== where.disposition) return false;
    if (where.published != null && r.published !== where.published) return false;
    return true;
  });
}
