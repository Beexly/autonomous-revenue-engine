import { scoreSwap } from "./swap.ts";

/**
 * Zain's prompt 7 without the $10k YouTube farm.
 * One Hold draft becomes a thread beat and an email. Owner pastes.
 * Mike: views are not a dollar. Don't schedule seven platforms.
 */

export function reuse(draft: string): {
  thread: string;
  email: string;
  swap: ReturnType<typeof scoreSwap>;
} {
  const t = draft.trim();
  const first = t.split(/(?<=[.!?])\s+/)[0] || t;
  return {
    thread: first,
    email: t + "\n\nGarrett",
    swap: scoreSwap(t),
  };
}
