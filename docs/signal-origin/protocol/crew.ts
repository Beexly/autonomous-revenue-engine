/**
 * Crew without CrewAI. Git is the shift board.
 * One worker per task. Claimed > 2 days with zero artifacts is dead.
 * Motif QCs. Grok/OpenCode flash. Owner mints.
 */

export type Actor = "motif" | "opencode" | "grok" | "owner";
export type JobStatus = "open" | "claimed" | "qc" | "parked" | "dead" | "done";

export type Job = {
  id: string;
  title: string;
  for: Actor;
  status: JobStatus;
  ageDays: number;
  instead?: string;
};

export const BOARD: Job[] = [
  { id: "TASK-022", title: "QC field pack + two-job header", for: "motif", status: "qc", ageDays: 0 },
  { id: "TASK-021", title: "Studio rails QC", for: "motif", status: "qc", ageDays: 0 },
  { id: "TASK-016", title: "Overnight pack QC", for: "motif", status: "qc", ageDays: 0 },
  { id: "TASK-001", title: "Kit lead-list Python", for: "opencode", status: "dead", ageDays: 4, instead: "hunt.ts + field-pack.html + CleanKiss sheet" },
  { id: "TASK-007", title: "225-row OSINT CSV", for: "opencode", status: "dead", ageDays: 3, instead: "Saturday hunt. Sample 3." },
  { id: "TASK-011", title: "n8n product-intel", for: "opencode", status: "dead", ageDays: 3, instead: "STACK.md. Git is the node." },
  { id: "TASK-014", title: "Spark splat gallery", for: "opencode", status: "parked", ageDays: 2, instead: "After one paid Kit." },
  { id: "TASK-015", title: "Activity log", for: "opencode", status: "parked", ageDays: 2, instead: "After one paid Kit." },
];

export function nextJob(actor: Actor, jobs: Job[] = BOARD): Job | null {
  const actionable = jobs.filter((j) => {
    if (j.status === "done" || j.status === "dead" || j.status === "parked") return false;
    if (actor === "motif") return j.status === "qc" || j.for === "motif";
    return j.for === actor && (j.status === "open" || j.status === "claimed");
  });
  return actionable.sort((a, b) => a.ageDays - b.ageDays)[0] ?? null;
}

export function deadLetter(j: Job): Job {
  if (j.status === "claimed" && j.ageDays >= 2) {
    return { ...j, status: "dead", instead: j.instead ?? "Unclaim. Neighbor in REPLACE.md." };
  }
  return j;
}
