import { routeTask } from "./route.ts";

const cases: Array<{ name: string; input: Parameters<typeof routeTask>[0]; seat: string; fence: string }> = [
  { name: "kit html patch", input: { title: "fix kit sheen css" }, seat: "flash", fence: "none" },
  { name: "inbox census", input: { title: "DM census from X Chat" }, seat: "flash", fence: "none" },
  { name: "gold email", input: { title: "draft gold email for James" }, seat: "flash", fence: "none" },
  { name: "thesis", input: { title: "thesis: dual-gate pressure" }, seat: "think", fence: "none" },
  { name: "post", input: { title: "post the reply", publishes: true }, seat: "high", fence: "owner" },
  { name: "sports", input: { title: "Diamondbacks pick", sports: true }, seat: "high", fence: "owner" },
  { name: "walk-in", input: { title: "walk in with one-screen" }, seat: "high", fence: "owner" },
];

let failed = 0;
for (const c of cases) {
  const r = routeTask(c.input);
  const ok = r.seat === c.seat && r.fence === c.fence;
  if (!ok) {
    failed++;
    console.error("FAIL", c.name, "got", r.seat, r.fence, r.reason);
  } else {
    console.log("ok", c.name, "→", r.seat, r.actor);
  }
}
if (failed) {
  console.error(failed, "failed");
  process.exit(1);
}
console.log(cases.length + "/" + cases.length, "route seats hold");
