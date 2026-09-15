/**
 * Temporal killed as a cluster. Adjacent: dbos-inc/dbos-transact-ts
 * (durable steps on Postgres, no Temporal server).
 * We don't add Postgres this week. Git is the store.
 * Steal: workflowId, attempt, lastStep, timeout, dead letter.
 */

export type Run = {
  id: string;
  workflow: string;
  attempt: number;
  lastStep: string;
  timeoutMin: number;
  started: string;
  status: "open" | "done" | "dead";
  deadLetter?: string;
};

export function retry(run: Run, step: string): Run {
  if (run.status === "done") return run;
  const attempt = run.attempt + 1;
  if (attempt > 3) {
    return {
      ...run,
      attempt,
      lastStep: step,
      status: "dead",
      deadLetter: "Three tries. Write the blocker. Don't loop.",
    };
  }
  return { ...run, attempt, lastStep: step, status: "open" };
}

export function expire(run: Run, now: Date): Run {
  const start = new Date(run.started).getTime();
  const age = (now.getTime() - start) / 60000;
  if (run.status === "open" && age > run.timeoutMin) {
    return { ...run, status: "dead", deadLetter: "Timed out. Owner, not another agent." };
  }
  return run;
}
