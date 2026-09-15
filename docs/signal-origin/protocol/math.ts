/**
 * Honest money. Stolen from mikenevermiss 2086683923354972493:
 * work backward from what the number requires, then look at tools.
 * RohOnChain's Sharpe theater is the opposite. Pedro: agents don't print PnL.
 */

export type Stream = "kit" | "gold" | "hold" | "face" | "workbook";

export type Kill = { id: string; trigger: string; do: string };

export const KILLS: Kill[] = [
  {
    id: "kit-eight-no",
    trigger: "Eight shops. Zero yes.",
    do: "Rewrite the line before a ninth door. Don't blame the plaza.",
  },
  {
    id: "kit-deposit",
    trigger: "Asking for money before they see it live on their phone.",
    do: "Stop. Hate it, they don't pay.",
  },
  {
    id: "gold-no-stripe",
    trigger: "Pitching $250 while Stripe is still on the sports face.",
    do: "Send the outside view free. Diagnostic waits.",
  },
  {
    id: "hold-this-u",
    trigger: "Someone asks 'this u?' on the sports face.",
    do: "Sit 48 hours. Doctrine stays off Galaxy Sports Edge.",
  },
  {
    id: "face-ad-sheen",
    trigger: "Three clips in a row that look like an ad.",
    do: "Put the phone in the plaza. Stop generating.",
  },
  {
    id: "face-dollar",
    trigger: "Putting Bond's $2,040 or Atlas's $26,400 on our board.",
    do: "Erase it. Ours is $0 until a dollar hits an account we can see.",
  },
  {
    id: "workbook-ssn",
    trigger: "Telling people the $19 pays out.",
    do: "Gumroad still wants an SSN. Don't lie.",
  },
];

export function kitYes(n: number) {
  const cash = n * 350;
  return {
    cash,
    domain: cash >= 350 ? "First yes covers getframefit.com at $11.25. Architect does not buy it." : "No domain until a yes.",
    note: n === 0 ? "Zero yes is not a funnel. It's a walk you haven't done." : n + " yes. " + cash + " if they didn't hate it.",
  };
}

export function holdMath(views: number) {
  return {
    views,
    revenue: 0,
    note:
      views +
      " views is not a dollar. Mike's $45k needs on the order of 1.2 million a month and 18–36 months. We do not have that. Don't put a number on Night.",
  };
}

export function faceMath(posted: number, dollarsSeen: number) {
  return {
    posted,
    dollarsSeen,
    note:
      dollarsSeen > 0
        ? "A dollar hit an account we can see. That's the only number that counts."
        : posted + " clips on a board is not revenue. Atlas and Frost's monthly figures stay theirs.",
  };
}
