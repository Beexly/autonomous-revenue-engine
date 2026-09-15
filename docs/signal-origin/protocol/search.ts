/**
 * Chroma / Qdrant / Haystack / mem0 killed as hosted memory.
 * Adjacent: oramasearch/orama and krisk/Fuse.js — in-process search, no vector bill.
 * Token overlap on facts we already keep. Do not npm install Orama for 20 episodes.
 */

export type Doc = { id: string; body: string };

export function search(q: string, docs: Doc[]): { id: string; score: number; body: string }[] {
  const terms = q.toLowerCase().split(/\s+/).filter((t) => t.length > 2);
  if (!terms.length) return [];
  return docs
    .map((d) => {
      const hay = d.body.toLowerCase();
      const score = terms.reduce((n, t) => n + (hay.includes(t) ? 1 : 0), 0);
      return { id: d.id, score, body: d.body };
    })
    .filter((h) => h.score > 0)
    .sort((a, b) => b.score - a.score);
}
