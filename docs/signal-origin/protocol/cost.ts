/**
 * Anthropic-sdk steal: count before the call.
 * OpenTelemetry steal: a line in the night log, not a collector.
 * Redis/Temporal/Argo/Airbyte: wouldSpend is true. Don't.
 */

export type Bill = {
  gpu?: boolean;
  cluster?: boolean;
  broker?: boolean;
  tokens?: number;
  paidApi?: boolean;
};

export function wouldSpend(b: Bill): { spend: boolean; reason: string } {
  if (b.gpu) return { spend: true, reason: "GPU is a bill. Phone or don't." };
  if (b.cluster) return { spend: true, reason: "K8s/Temporal/Argo is a company. Git is the queue." };
  if (b.broker) return { spend: true, reason: "Redis is a bill. Saturday is the bottleneck." };
  if (b.paidApi) return { spend: true, reason: "Paid API. Fence." };
  if ((b.tokens ?? 0) > 0) {
    return { spend: true, reason: "Tokens > 0 is a call. This desk drafts. Owner pastes." };
  }
  return { spend: false, reason: "Markdown, tests, a static page." };
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4);
}
