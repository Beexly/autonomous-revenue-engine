import { offer } from "@/lib/kit-offer";

const cards = [offer.onePager, offer.fullSite, offer.workflows];

export function Pricing() {
  return (
    <section id="offer" className="relative z-10 px-5 py-24 md:px-8">
      <div className="mx-auto max-w-[1240px]">
        <p className="kicker">Three ways in</p>
        <h2 className="display mt-4 max-w-2xl text-2xl">
          Honest prices, <em>flat.</em>
        </h2>
        <p className="mt-4 max-w-xl text-muted leading-[1.55]">
          No hourly meters. No surprise invoices. Pick the shape your business
          needs.
        </p>

        <div className="mt-12 grid gap-4 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.name}
              className={`panel flex flex-col p-7 ${
                card.loved ? "border-copper/50 bg-ink-2" : ""
              }`}
            >
              <div className="flex items-start justify-between">
                <p className="kicker">{card.name}</p>
                {card.loved ? (
                  <span className="rounded-full border border-copper/40 px-2.5 py-1 text-[11px] tracking-wide text-copper">
                    Most loved
                  </span>
                ) : null}
              </div>
              <p className="mt-6 font-display text-5xl leading-none tracking-tight">
                {card.cadence === "from" ? (
                  <span className="mr-2 text-lg text-muted">from</span>
                ) : null}
                {card.price}
                <span className="ml-2 text-lg text-muted">{card.cadence === "flat" ? "flat" : ""}</span>
              </p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{card.blurb}</p>
              <ul className="mt-6 flex-1 space-y-3 text-sm leading-relaxed">
                {card.includes.map((item) => (
                  <li key={item} className="flex gap-3">
                    <span className="mt-2 block size-1 shrink-0 rounded-full bg-copper" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href={card.href} className="btn-primary mt-8 w-full">
                DM “{card.dm}”
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
