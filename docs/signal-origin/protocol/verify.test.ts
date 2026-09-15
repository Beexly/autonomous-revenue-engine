import { verify, override } from "./verify.ts";

const cases: Array<{ name: string; action: Parameters<typeof verify>[0]; code: string }> = [
  { name: "read", action: { kind: "read" }, code: "pass" },
  { name: "write", action: { kind: "write" }, code: "pass" },
  { name: "post", action: { kind: "post" }, code: "reject" },
  { name: "send", action: { kind: "send" }, code: "reject" },
  { name: "spend", action: { kind: "spend" }, code: "reject" },
  { name: "sports", action: { kind: "write", sports: true }, code: "reject" },
  { name: "adult", action: { kind: "write", adult: true }, code: "reject" },
  { name: "owner post", action: { kind: "post", ownerAttested: true }, code: "owner-only" },
];

let failed = 0;
for (const c of cases) {
  const v = verify(c.action);
  if (v.code !== c.code) {
    failed++;
    console.error("FAIL", c.name, "got", v.code, v.reason);
  } else {
    console.log("ok", c.name, v.code);
  }
}

const punch = override({ kind: "post" }, "the chart looked good");
if (punch.ok) {
  failed++;
  console.error("FAIL override punched through");
} else {
  console.log("ok fly cannot override");
}

if (failed) process.exit(1);
console.log(cases.length + 1 + "/" + (cases.length + 1), "verify holds");
