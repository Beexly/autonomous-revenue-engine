/**
 * MiniSearch (lucaong/minisearch) steal: TF-IDF, in-process, no host.
 * Do not npm install. Twenty episodes do not need BM25.
 */

export type Doc = { id: string; body: string };

export function search(q: string, docs: Doc[]): { id: string; score: number; body: string }[] {
  const terms = q.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  if (!terms.length || !docs.length) return [];
  const N = docs.length;
  const df: Record<string, number> = {};
  for (const t of terms) {
    df[t] = docs.filter((d) => d.body.toLowerCase().includes(t)).length;
  }
  return docs
    .map((d) => {
      const hay = d.body.toLowerCase();
      const score = terms.reduce((n, t) => {
        const tf = hay.split(t).length - 1;
        if (!tf) return n;
        const idf = Math.log((N + 1) / ((df[t] || 0) + 1));
        return n + tf * idf;
      }, 0);
      return { id: d.id, score, body: d.body };
    })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score);
}
