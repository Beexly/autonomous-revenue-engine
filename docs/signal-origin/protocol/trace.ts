/**
 * Langfuse / Phoenix / Helicone killed as a paid collector.
 * Adjacent: promptfoo/promptfoo — fixtures and a row per run, local.
 * One span. Git is the trace.
 */

import { estimateTokens } from "./cost.ts";
import type { Disposition } from "./policy.ts";

export type Span = {
  name: string;
  disposition: Disposition;
  pressure?: number;
  tokensEst: number;
};

export function span(name: string, draft: string, disposition: Disposition, pressure?: number): Span {
  return {
    name,
    disposition,
    pressure,
    tokensEst: estimateTokens(draft),
  };
}
