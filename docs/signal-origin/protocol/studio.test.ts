import { assign, mix, RAILS, rail } from "./studio.ts";

const fails: string[] = [];
if (RAILS.length !== 7) fails.push("need 7 rails");
if (RAILS.filter((r) => r.cashThisWeek).map((r) => r.id).join() !== "kit") {
  fails.push("only Kit is cash this week");
}
if (rail("adult").repo !== "xxx") fails.push("adult lives in XXX");
if (assign({ rail: "kit", premise: "walk-in" }).ok !== true) fails.push("kit should pass");
if (assign({ rail: "kit", premise: "x", sports: true }).ok) fails.push("sports in studio");
if (assign({ rail: "hold", premise: "reply", publish: true }).ok) fails.push("publish should fail");
if (assign({ rail: "adult", premise: "x", generate: true }).ok) fails.push("adult generate here");
if (mix("kit", "adult").ok) fails.push("kit/adult mix");
if (!mix("kit", "cooking").ok) fails.push("kit/cooking may share OS");
if (fails.length) {
  console.error(fails);
  process.exit(1);
}
console.log("ok studio 7 rails");
