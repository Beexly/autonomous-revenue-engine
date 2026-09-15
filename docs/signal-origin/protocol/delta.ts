/**
 * ARE apps/voice-delta, finally used.
 * Three overnight replies are the reference. Lower Δ = closer to that voice.
 * Not authorship. A distance.
 */

import { replies } from "./desk-data.ts";

const WORD = /[a-z]+(?:'[a-z]+)?/g;

function tokens(text: string): string[] {
  return text.toLowerCase().match(WORD) ?? [];
}

function freqs(text: string, features: string[]): number[] {
  const t = tokens(text);
  const n = t.length || 1;
  const counts = new Map<string, number>();
  for (const w of t) counts.set(w, (counts.get(w) ?? 0) + 1);
  return features.map((f) => (counts.get(f) ?? 0) / n);
}

function top(docs: string[], n = 20): string[] {
  const counts = new Map<string, number>();
  for (const d of docs) for (const w of tokens(d)) counts.set(w, (counts.get(w) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, n)
    .map(([w]) => w);
}

export function voiceDelta(candidate: string): { delta: number; note: string } {
  const refs = replies.filter((r) => r.rank === "post").map((r) => r.draft);
  if (refs.length < 2) return { delta: 99, note: "Need two refs." };
  const features = top(refs);
  const refFreq = refs.map((r) => freqs(r, features));
  const mu = features.map((_, i) => refFreq.reduce((s, row) => s + row[i], 0) / refFreq.length);
  const cand = freqs(candidate, features);
  let sum = 0;
  for (let i = 0; i < features.length; i++) sum += Math.abs(cand[i] - mu[i]);
  const delta = Math.round((sum / features.length) * 1000) / 1000;
  return {
    delta,
    note: delta < 0.04 ? "Close to the overnight voice." : "Farther from the three we kept. Read them again.",
  };
}
