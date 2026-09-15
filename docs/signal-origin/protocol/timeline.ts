/**
 * Theatre.js steal: a directed timeline of pastes, not a tween.
 * Night log as beats. Do not npm install Theatre.
 */

export type Beat = {
  t: string;
  seat: "think" | "flash" | "high";
  what: string;
};

export const NIGHT: Beat[] = [
  { t: "21:00", seat: "flash", what: "Three replies at 8.2. Cap 3." },
  { t: "21:30", seat: "think", what: "Studio is seven rails. Adult is one room." },
  { t: "22:00", seat: "think", what: "Reset-tell, occlusion, notes." },
  { t: "22:10", seat: "think", what: "Copilot holes: TIERED_FORKS, SECURITY, SO-013." },
  { t: "22:20", seat: "flash", what: "Every kill got a neighbor. Dead letter on try 3." },
];
