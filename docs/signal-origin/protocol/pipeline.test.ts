import { runDesk } from "./pipeline.ts";

const skip = runDesk({
  name: "Randy's Mobile Detailing",
  where: "Kingwood",
  hasSite: true,
  trade: "detail",
  phone: "8326890988",
});
const kit = runDesk({
  name: "CleanKiss Car Detailing",
  where: "Kingwood",
  hasSite: false,
  trade: "detail",
});
const far = runDesk({
  name: "Some Shop",
  where: "Austin",
  hasSite: false,
  trade: "detail",
});

const fails: string[] = [];
if (!skip.seats.some((s) => s.verdict === "skip")) fails.push("Randy should skip");
if (kit.seats.find((s) => s.id === "exit")?.verdict !== "owner") fails.push("CleanKiss should be owner walk");
if (far.seats.find((s) => s.id === "screener")?.verdict !== "kill") fails.push("Austin should kill");
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok pipeline 3/3");
