/**
 * conformal-lite instead, without a series.
 * We don't forecast. We name the set.
 * This week the set is {0} until a yes, then {350}.
 */

export function moneySet(yes: number): { set: number[]; note: string } {
  if (yes <= 0) return { set: [0], note: "Set is {0} until someone pays. Don't put 58k on the board." };
  return { set: [yes * 350], note: "$" + yes * 350 + " if they paid. That's the set." };
}
