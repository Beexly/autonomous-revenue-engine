import { envelope, checkEnvelope } from "./envelope.ts";

const ok = envelope({
  id: "TASK-021-studio",
  from: "grok",
  to: "motif",
  name: "studio-rails",
  title: "Media studio is seven rails",
});
const bad = envelope({
  id: "nope",
  from: "grok",
  to: "owner",
  name: "post",
  title: "post it",
  destructive: true,
  openWorld: true,
});
bad.id = "nope";

const fails: string[] = [];
if (checkEnvelope(ok).length) fails.push("ok envelope failed: " + checkEnvelope(ok));
if (!ok.annotations.readOnlyHint) fails.push("read only");
if (!bad.annotations.approvalRequired) fails.push("destructive needs approval");
if (!checkEnvelope(bad).includes("bad id")) fails.push("bad id should flag");
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok envelope");
