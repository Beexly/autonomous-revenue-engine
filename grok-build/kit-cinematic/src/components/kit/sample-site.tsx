import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import type { Trade } from "@/lib/kit-offer";

export function SampleSite({ trade }: { trade: Trade }) {
  return (
    <main
      className="min-h-screen"
      style={{
        background: trade.paper,
        color: trade.ink,
        fontFamily: "Outfit, system-ui, sans-serif",
      }}
    >
      <div className="grain mix-blend-multiply opacity-[0.12]" />
      <header className="flex items-center justify-between px-5 py-5 md:px-10">
        <Link
          to="/"
          hash="work"
          className="inline-flex min-h-11 items-center gap-2 text-sm no-underline"
          style={{ color: trade.ink }}
        >
          <ArrowLeft className="size-4" />
          Back to Kit
        </Link>
        <p
          className="text-[11px] font-medium tracking-[0.18em] uppercase"
          style={{ color: trade.muted }}
        >
          Sample · fictional business
        </p>
      </header>

      <section className="relative min-h-[86svh] overflow-hidden">
        <img
          src={trade.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover"
          crossOrigin="anonymous"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(180deg, ${trade.paper}00 20%, ${trade.paper} 92%)`,
          }}
        />
        <div className="relative z-10 mx-auto flex min-h-[86svh] max-w-5xl flex-col justify-end px-5 pb-16 md:px-10">
          <p
            className="text-[11px] font-medium tracking-[0.2em] uppercase"
            style={{ color: trade.accent }}
          >
            {trade.kicker}
          </p>
          <h1
            className="mt-4 max-w-3xl text-[clamp(3rem,8vw,7rem)] leading-[0.92]"
            style={{ fontFamily: "Instrument Serif, serif", letterSpacing: "-0.03em" }}
          >
            {trade.title} <em style={{ color: trade.accent }}>{trade.italic}</em>
          </h1>
          <p className="mt-6 max-w-xl text-lg" style={{ color: trade.muted }}>
            {trade.lede}
          </p>
          <p className="mt-3 text-xl font-medium">{trade.priceLine}</p>
          <a
            href={`tel:+1${trade.phone.replace(/\D/g, "")}`}
            className="mt-8 inline-flex min-h-12 w-fit items-center rounded-full px-6 text-sm font-medium no-underline"
            style={{ background: trade.accent, color: trade.paper }}
          >
            Call {trade.phone}
          </a>
        </div>
      </section>

      <section className="mx-auto grid max-w-5xl gap-10 px-5 py-16 md:grid-cols-2 md:px-10">
        <div>
          <p
            className="text-[11px] tracking-[0.18em] uppercase"
            style={{ color: trade.muted }}
          >
            Serving {trade.town}
          </p>
          <h2
            className="mt-3 text-4xl leading-tight"
            style={{ fontFamily: "Instrument Serif, serif" }}
          >
            What we do, <em>priced.</em>
          </h2>
        </div>
        <ul>
          {trade.services.map((s) => (
            <li
              key={s.name}
              className="flex items-baseline justify-between border-b py-4 text-lg"
              style={{ borderColor: `${trade.ink}22` }}
            >
              <span>{s.name}</span>
              <span style={{ color: trade.accent }}>{s.price}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="px-5 pb-24 md:px-10">
        <div
          className="mx-auto flex max-w-5xl flex-col items-start justify-between gap-6 rounded-[28px] px-6 py-8 md:flex-row md:items-center md:px-10"
          style={{ background: `${trade.ink}10`, border: `1px solid ${trade.ink}18` }}
        >
          <div>
            <p className="text-sm" style={{ color: trade.muted }}>
              {trade.hours}
            </p>
            <p className="mt-1 text-2xl" style={{ fontFamily: "Instrument Serif, serif" }}>
              Ready when you are.
            </p>
          </div>
          <a
            href={`tel:+1${trade.phone.replace(/\D/g, "")}`}
            className="inline-flex min-h-12 items-center rounded-full px-6 text-sm font-medium no-underline"
            style={{ background: trade.accent, color: trade.paper }}
          >
            {trade.phone}
          </a>
        </div>
        <p className="mx-auto mt-8 max-w-5xl text-xs" style={{ color: trade.muted }}>
          {trade.sampleNote} This page is a Kit sample — not a live business.
        </p>
      </section>
    </main>
  );
}
