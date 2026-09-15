export type Packet = {
  goal: string;
  evidence: string[];
  decisions: string[];
  failures: string[];
  next: string;
};

export function packet(p: Packet): string {
  return JSON.stringify(
    {
      goal: p.goal.trim(),
      evidence: p.evidence.map((s) => s.trim()).filter(Boolean),
      decisions: p.decisions.map((s) => s.trim()).filter(Boolean),
      failures: p.failures.map((s) => s.trim()).filter(Boolean),
      next: p.next.trim(),
    },
    null,
    2,
  );
}

export const EMPTY: Packet = {
  goal: "Walk Kingwood Saturday. One yes funds the domain.",
  evidence: ["CleanKiss still has no site this pass.", "Randy already has a site."],
  decisions: ["Skip Randy.", "Don't invent a phone."],
  failures: ["FindDetailer 'no photos' was a directory miss."],
  next: "Plaza walk. Paper square. Don't say AI.",
};
