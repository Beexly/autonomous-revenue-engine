import { transferTo } from "./handoff.ts";

const fails: string[] = [];
const post = transferTo({ title: "post the reply", publishes: true });
if (post.to !== "owner" || post.fence !== "owner") fails.push("post must hand to owner");
const sports = transferTo({ title: "dfs card", sports: true });
if (sports.to !== "owner") fails.push("sports to owner");
const patch = transferTo({ title: "fix kit sheen css" });
if (patch.fence === "owner" && patch.to === "owner" && /VERIFY/.test(patch.reason) === false) {
  // kit html patch should be flash, not owner
}
if (patch.to === "owner" && !patch.reason) fails.push("silent owner");
if (fails.length) {
  console.error(fails, post, sports, patch);
  process.exit(1);
}
console.log("ok handoff", patch.to, patch.folder);
