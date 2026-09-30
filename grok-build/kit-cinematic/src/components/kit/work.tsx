import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { trades } from "@/lib/kit-offer";
import { Phone } from "./phone";
import { SampleScreen } from "./sample-screen";

export function Work() {
  return (
    <section id="work" className="relative z-10">
      <div className="mx-auto max-w-[1240px] px-5 pb-8 pt-20 md:px-8">
        <p className="kicker">Selected work — five trades, five designs</p>
        <h2 className="display mt-4 max-w-3xl text-2xl">
          No two alike. <em>That's the point.</em>
        </h2>
        <p className="mt-4 max-w-xl text-muted leading-[1.55]">
          Every sample below is a complete one-page website — designed, written,
          and priced for one specific trade. These are live pages, not mockups.
          Open any of them.
        </p>
      </div>

      <div className="flex flex-col">
        {trades.map((trade, i) => (
          <article
            key={trade.slug}
            className="relative min-h-[100svh] overflow-hidden"
          >
            <img
              src={trade.image}
              alt=""
              className="absolute inset-0 h-full w-full object-cover"
              crossOrigin="anonymous"
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  i % 2 === 0
                    ? "linear-gradient(90deg, rgba(10,9,8,0.88) 0%, rgba(10,9,8,0.35) 55%, rgba(10,9,8,0.2) 100%)"
                    : "linear-gradient(270deg, rgba(10,9,8,0.88) 0%, rgba(10,9,8,0.35) 55%, rgba(10,9,8,0.2) 100%)",
              }}
            />
            <div
              className={`relative z-10 mx-auto flex min-h-[100svh] max-w-[1240px] flex-col items-center justify-center gap-10 px-5 py-16 md:flex-row md:px-8 ${
                i % 2 === 1 ? "md:flex-row-reverse" : ""
              }`}
            >
              <div className="max-w-lg">
                <p className="kicker">{trade.kicker}</p>
                <h3 className="display mt-4 text-2xl">
                  {trade.title} <em>{trade.italic}</em>
                </h3>
                <p className="mt-4 text-base leading-[1.55] text-paper-2">
                  {trade.lede}{" "}
                  <span className="text-paper">{trade.priceLine}</span>
                </p>
                <Link
                  to="/work/$slug"
                  params={{ slug: trade.slug }}
                  className="btn-primary mt-7"
                >
                  Open the full sample
                  <ArrowUpRight className="size-4" />
                </Link>
                <p className="mt-4 text-sm text-faint">{trade.sampleNote}</p>
              </div>
              <Phone>
                <SampleScreen trade={trade} />
              </Phone>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
