import { useState } from "react";
import { Plus } from "lucide-react";
import { craft, faqs, reversal, IG_DM } from "@/lib/kit-offer";
import { cn } from "@/lib/utils";

export function Craft() {
  return (
    <section className="relative z-10 px-5 py-24 md:px-8">
      <div className="mx-auto max-w-[1240px]">
        <p className="kicker">The craft</p>
        <h2 className="display mt-4 text-2xl">
          What every Kit site <em>does.</em>
        </h2>
        <p className="mt-4 max-w-xl text-muted">
          Pretty is table stakes. These are the parts that ring the phone.
        </p>
        <div className="mt-12 grid gap-px overflow-hidden rounded-[28px] border border-line bg-line md:grid-cols-2 lg:grid-cols-5">
          {craft.map((item) => (
            <article key={item.n} className="bg-ink p-6 md:p-7">
              <p className="font-mono text-xs tracking-widest text-copper">{item.n}.</p>
              <h3 className="mt-4 text-lg font-medium">{item.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Reversal() {
  return (
    <section className="relative z-10 px-5 pb-8 md:px-8">
      <div className="mx-auto max-w-[1240px] rounded-[28px] border border-line bg-ink-2 px-6 py-14 md:px-14">
        <h2 className="display max-w-3xl text-2xl">
          You don't buy a promise. You buy <em>the preview.</em>
        </h2>
        <p className="mt-5 max-w-2xl text-muted leading-[1.55]">
          Most web designers sell you a mockup and a prayer. My deal: I build
          your actual page first — your name, your number, your services, on
          your phone. You look at it. Then you decide. If the page doesn't sell
          itself, I haven't earned the $350.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {reversal.map((item) => (
            <article key={item.n}>
              <p className="font-mono text-xs tracking-widest text-copper">{item.n}.</p>
              <h3 className="mt-3 text-lg font-medium">{item.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted">{item.body}</p>
            </article>
          ))}
        </div>
        <a href={IG_DM} className="btn-primary mt-10">
          DM “KIT” for a free preview
        </a>
      </div>
    </section>
  );
}

export function Faq() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="relative z-10 px-5 py-24 md:px-8">
      <div className="mx-auto grid max-w-[1240px] gap-10 md:grid-cols-[0.8fr_1.2fr]">
        <div>
          <p className="kicker">Straight answers</p>
          <h2 className="display mt-4 text-2xl">
            Questions, <em>answered.</em>
          </h2>
          <p className="mt-4 text-muted">No fine print beyond this.</p>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={item.q}>
                <button
                  type="button"
                  className="flex w-full items-center justify-between gap-4 py-5 text-left"
                  aria-expanded={isOpen}
                  onClick={() => setOpen(isOpen ? null : i)}
                >
                  <span className="text-base font-medium">{item.q}</span>
                  <Plus
                    className={cn(
                      "size-5 shrink-0 text-muted transition-transform duration-200 ease-[cubic-bezier(0.22,1,0.36,1)]",
                      isOpen && "rotate-45",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)]",
                    isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]",
                  )}
                >
                  <p className="overflow-hidden pb-0 text-sm leading-relaxed text-muted">
                    <span className={cn("block", isOpen ? "pb-5" : "pb-0")}>{item.a}</span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
