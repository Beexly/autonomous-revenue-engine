/**
 * Swap-test as a function. Stolen from docs/swap-test.html + the 25 Aug
 * GSE replies that leaked Signal Origin doctrine onto the sports face.
 *
 * Those eight replies all open "We killed three posts…". That opener is
 * the interchangeability they were attacking. This file fails it.
 */

export type SwapVerdict = "anchored" | "swappable" | "generic";

export type SwapResult = {
  verdict: SwapVerdict;
  pass: number;
  fail: number;
  checks: { id: string; pass: boolean; why: string }[];
  opener: string;
};

const JARGON =
  /\b(leverage|10x|unlock|game-?changer|ecosystem|build in public|personal brand|viral|growth hack|let that sink in)\b/i;
const STAKE =
  /\b(killed|paid|refused|built|measured|failed|shipped|cut|deferred|chose silence|cannot see|firing)\b/i;
const CONTRAST = /\bit'?s not\b[^.\n]{2,48}\.\s*it'?s\b/i;
const MANIFESTO =
  /\b(the future of|in a world where|at the end of the day|here'?s the thing)\b/i;
const LECTURE =
  /^(here is how|let me explain|operators should|most people don'?t)\b/im;
const TEMPLATE_OPENER =
  /^we killed three posts\b/i;

function sentences(t: string) {
  return t
    .split(/(?<=[.!?])\s+/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function staccato(t: string) {
  return t.split(/\n+/).some((l) => {
    const w = l.trim().replace(/[.!?]/g, "").split(/\s+/).filter(Boolean);
    return w.length > 0 && w.length <= 2 && /\.$/.test(l.trim());
  });
}

function residue(t: string) {
  const stripped = t.replace(
    /\b(signal origin|qi-check|voice-delta|hold floor|burrows|galaxy sports)\b/gi,
    "BRAND",
  );
  return STAKE.test(stripped) || /\d/.test(stripped) || /\$[0-9]/.test(stripped);
}

export function scoreSwap(raw: string): SwapResult {
  const t = String(raw || "").trim();
  const opener = sentences(t)[0] || "";
  const checks: SwapResult["checks"] = [];
  const row = (id: string, ok: boolean, why: string) =>
    checks.push({ id, pass: !!ok, why });

  if (!t) {
    return {
      verdict: "generic",
      pass: 0,
      fail: 1,
      checks: [{ id: "empty", pass: false, why: "No text." }],
      opener: "",
    };
  }

  row("template-opener", !TEMPLATE_OPENER.test(opener), "Does not open on the 25 Aug GSE stencil.");
  row("stake", STAKE.test(t), "A decision/cost verb is present.");
  row("number", /\d/.test(t), "A number survives a brand swap.");
  row("first-person", /\b(I|we)\b/i.test(t) && STAKE.test(t), "First person plus a decision.");
  row("jargon", !JARGON.test(t), "No operator clichés.");
  row("contrast", !CONTRAST.test(t), "No empty It's-not-X-it's-Y.");
  row("manifesto", !MANIFESTO.test(t), "No sermon opener.");
  row("staccato", !staccato(t), "No one-word fragment lines.");
  row("lecture", !LECTURE.test(t), "Does not open as a category lecture.");
  row("residue", residue(t), "After swapping the brand name, a stake remains.");

  const pass = checks.filter((c) => c.pass).length;
  const fail = checks.length - pass;
  const verdict: SwapVerdict =
    fail === 0 ? "anchored" : fail <= 2 ? "swappable" : "generic";
  return { verdict, pass, fail, checks, opener };
}
