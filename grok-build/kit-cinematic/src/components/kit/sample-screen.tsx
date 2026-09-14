import type { Trade } from "@/lib/kit-offer";

export function SampleScreen({ trade, compact = true }: { trade: Trade; compact?: boolean }) {
  return (
    <div
      className="flex h-full flex-col"
      style={{
        background: trade.paper,
        color: trade.ink,
        fontFamily: "Outfit, system-ui, sans-serif",
      }}
    >
      <div
        className="relative overflow-hidden"
        style={{ height: compact ? "42%" : "48%" }}
      >
        <img
          src={trade.image}
          alt=""
          className="h-full w-full object-cover"
          crossOrigin="anonymous"
        />
        <div
          className="absolute inset-0"
          style={{
            background: `linear-gradient(to top, ${trade.paper} 0%, transparent 55%)`,
          }}
        />
        <div className="absolute bottom-3 left-4 right-4">
          <p
            className="text-[9px] font-medium tracking-[0.18em] uppercase"
            style={{ color: trade.accent }}
          >
            {trade.kicker}
          </p>
          <p
            className="mt-1 font-display text-[1.55rem] leading-[0.95]"
            style={{ fontFamily: "Instrument Serif, serif" }}
          >
            {trade.title}{" "}
            <em style={{ fontStyle: "italic", color: trade.accent }}>{trade.italic}</em>
          </p>
        </div>
      </div>
      <div className="flex flex-1 flex-col px-4 pb-4 pt-2">
        <p className="text-[11px] leading-snug" style={{ color: trade.muted }}>
          {trade.priceLine}
        </p>
        <ul className="mt-3 space-y-1.5">
          {trade.services.map((s) => (
            <li
              key={s.name}
              className="flex items-baseline justify-between border-b pb-1 text-[11px]"
              style={{ borderColor: `${trade.ink}22` }}
            >
              <span>{s.name}</span>
              <span style={{ color: trade.accent }}>{s.price}</span>
            </li>
          ))}
        </ul>
        <div
          className="mt-auto flex items-center justify-center rounded-full py-2.5 text-[12px] font-medium"
          style={{ background: trade.accent, color: trade.paper }}
        >
          Call {trade.phone}
        </div>
        <p className="mt-2 text-center text-[9px]" style={{ color: trade.muted }}>
          {trade.hours}
        </p>
      </div>
    </div>
  );
}
