import { useMemo, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import {
  replies,
  shops,
  theses,
  pitch,
  warmNote,
  zohoBump,
  keepers,
  kills,
  episodes,
} from "@/lib/desk-data";
import { scorePressure, HOLD_FLOOR, fieldWidths, type PressureMode, type PressureResult } from "@/lib/pressure";

export const Route = createFileRoute("/")({ component: Desk });

type Tab = "night" | "pressure" | "cash" | "intel" | "theses";

const TABS: { id: Tab; label: string }[] = [
  { id: "night", label: "Night" },
  { id: "pressure", label: "Pressure" },
  { id: "cash", label: "Cash" },
  { id: "intel", label: "Intel" },
  { id: "theses", label: "Theses" },
];

function Desk() {
  const [tab, setTab] = useState<Tab>("night");

  return (
    <div className="min-h-dvh bg-bg text-fg pb-24">
      <header className="px-5 pt-8 pb-5 border-b border-line">
        <p className="text-xs tracking-[0.14em] uppercase text-muted">Signal Origin</p>
        <h1 className="font-display text-3xl tracking-tight mt-1">Desk</h1>
        <p className="text-sm text-muted mt-2 max-w-prose">
          Replies, pulse, walk-ins. X on this phone is Sports until you say otherwise.
          Nothing here posts or sends.
        </p>
      </header>
      <main className="px-5 py-6">
        {tab === "night" && <Night />}
        {tab === "pressure" && <Pressure />}
        {tab === "cash" && <Cash />}
        {tab === "intel" && <Intel />}
        {tab === "theses" && <Theses />}
      </main>
      <nav
        className="fixed bottom-0 inset-x-0 border-t border-line bg-bg/95 backdrop-blur-sm"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="grid grid-cols-5">
          {TABS.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => setTab(t.id)}
                className={`w-full py-3 text-xs tracking-wide border-t-2 ${
                  tab === t.id
                    ? "text-fg border-fg"
                    : "text-muted border-transparent"
                }`}
              >
                {t.label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}

function Copy({ text }: { text: string }) {
  const [done, setDone] = useState(false);
  return (
    <button
      type="button"
      className="mt-3 h-11 px-4 border border-fg text-fg text-sm"
      onClick={async () => {
        try {
          await navigator.clipboard.writeText(text);
        } catch {
          window.prompt("Copy", text);
        }
        setDone(true);
        setTimeout(() => setDone(false), 1400);
      }}
    >
      {done ? "Copied" : "Copy"}
    </button>
  );
}

function Night() {
  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-muted">Cap 3. Recommend RB-02, RB-05, RB-03. Paste from @SignaL_OriginHQ.</p>
      {replies.map((r) => (
        <article key={r.id} className="bg-surface border border-line p-4 rounded-lg">
          <p className="text-[11px] tracking-[0.12em] uppercase text-muted">
            {r.id} · {r.rank}
          </p>
          <p className="text-sm text-muted mt-1">
            <a className="text-fg underline-offset-2 hover:underline" href={r.parent} target="_blank" rel="noreferrer">
              {r.author}
            </a>
            {" — "}
            {r.why}
          </p>
          <p className="font-display text-[17px] leading-snug mt-3">{r.draft}</p>
          <Copy text={r.draft} />
        </article>
      ))}
    </div>
  );
}

function Pressure() {
  const [draft, setDraft] = useState(replies[0].draft);
  const [mode, setMode] = useState<PressureMode>("reply");
  const result: PressureResult = useMemo(() => scorePressure(draft, mode), [draft, mode]);
  const entries = Object.entries(result.scores);

  return (
    <div className="flex flex-col gap-5">
      <p className="text-sm text-muted">{result.honesty}</p>
      <div className="flex gap-2">
        {(["reply", "original"] as PressureMode[]).map((m) => (
          <button
            key={m}
            type="button"
            onClick={() => setMode(m)}
            className={`h-11 px-4 text-sm border ${
              mode === m ? "bg-fg text-bg border-fg" : "border-line text-muted"
            }`}
          >
            {m === "reply" ? "Reply gate" : "Original · 9.2"}
          </button>
        ))}
      </div>
      <label className="block">
        <span className="text-xs uppercase tracking-[0.12em] text-muted">Draft</span>
        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={8}
          className="mt-2 w-full bg-surface border border-line text-fg p-3 text-[15px] leading-relaxed rounded-md min-h-40"
        />
      </label>
      <PressureField text={draft} />
      <div className="bg-surface border border-line p-4 rounded-lg">
        <p className="font-display text-2xl">
          {result.recommendation} · {result.total}
        </p>
        <p className="text-sm text-muted mt-1">
          Hold floor {HOLD_FLOOR}. Weak vote: sentence-length CV (diffusion fools it).
        </p>
        <table className="w-full mt-4 text-sm">
          <tbody>
            {entries.map(([k, v]) => (
              <tr key={k} className="border-t border-line">
                <td className="py-2 text-muted">{k}</td>
                <td className="py-2 text-right tabular-nums">{v}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {result.flags.length > 0 && (
          <p className="text-sm text-warn mt-3">{result.flags.join(" · ")}</p>
        )}
        {result.fixes.length > 0 && (
          <ol className="mt-3 list-decimal pl-5 text-sm space-y-1">
            {result.fixes.map((f) => (
              <li key={f}>{f}</li>
            ))}
          </ol>
        )}
      </div>
    </div>
  );
}

function PressureField({ text }: { text: string }) {
  const widths = fieldWidths(text);
  const max = Math.max(1, ...widths);
  if (widths.length === 0) return null;
  return (
    <div className="bg-surface border border-line p-4 rounded-lg">
      <p className="text-xs uppercase tracking-[0.12em] text-muted">Paragraph field</p>
      <p className="text-sm text-muted mt-1">Even bars = even pressure. The tell.</p>
      <svg viewBox={`0 0 100 ${widths.length * 14 + 4}`} className="mt-3 w-full" aria-hidden>
        {widths.map((w, i) => (
          <rect
            key={i}
            x="0"
            y={i * 14 + 2}
            width={(w / max) * 100}
            height="10"
            fill="currentColor"
            opacity={0.55 + (w / max) * 0.4}
          />
        ))}
      </svg>
    </div>
  );
}

function Cash() {
  return (
    <div className="flex flex-col gap-6">
      <section>
        <h2 className="font-display text-xl">Walk-in line</h2>
        <p className="font-display text-[17px] leading-snug mt-2">{pitch}</p>
        <Copy text={pitch} />
        <p className="text-sm text-muted mt-3">Do not mention AI, Grok, or Signal Origin on the shop floor.</p>
      </section>
      <section>
        <h2 className="font-display text-xl">Hunt names</h2>
        <p className="text-sm text-muted mt-1">Public directories. Not visited. Not a CRM.</p>
        <ul className="mt-3 flex flex-col gap-3">
          {shops.map((s) => (
            <li key={s.name} className="bg-surface border border-line p-4 rounded-lg">
              <p className="text-xs uppercase tracking-[0.12em] text-muted">
                {s.kit ? "Kit candidate" : "Skip — already has a site"}
              </p>
              <p className="mt-1 font-medium">{s.name}</p>
              <p className="text-sm text-muted">{s.where}</p>
              <p className="text-sm mt-2">{s.why}</p>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="font-display text-xl">Warm note</h2>
        <p className="text-sm text-muted mt-1">Drafted 2026-08-25. Still unsent. Personalize. No BCC.</p>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-sm bg-surface border border-line p-4 rounded-lg">
          {warmNote}
        </pre>
        <Copy text={warmNote} />
      </section>
      <section>
        <h2 className="font-display text-xl">Zoho bump</h2>
        <p className="text-sm text-muted mt-1">
          James Howard auto-replied OOO the same minute. He said he would be back the next morning.
          This is one loop, then kill.
        </p>
        <pre className="mt-3 whitespace-pre-wrap font-sans text-sm bg-surface border border-line p-4 rounded-lg">
          {zohoBump}
        </pre>
        <Copy text={zohoBump} />
      </section>
    </div>
  );
}

function Intel() {
  return (
    <div className="flex flex-col gap-4 text-sm leading-relaxed">
      <article className="bg-surface border border-line p-4 rounded-lg">
        <h2 className="font-display text-lg">Core memory</h2>
        <p className="text-muted mt-1">Letta split: this is core. Origin-box is archival.</p>
        <ul className="mt-3 flex flex-col gap-3">
          {episodes.map((e) => (
            <li key={e.fact}>
              <p className="text-[11px] tracking-[0.12em] uppercase text-muted">{e.when}</p>
              <p className="mt-1">{e.fact}</p>
            </li>
          ))}
        </ul>
      </article>
      <article className="bg-surface border border-line p-4 rounded-lg">
        <h2 className="font-display text-lg">X DMs</h2>
        <p className="mt-2">
          No X DM connector. Count remains 0. Owner says the Twitter login is Galaxy Sports.
          Treat SO DMs as unread until a dump exists.
        </p>
      </article>
      <article className="bg-surface border border-line p-4 rounded-lg">
        <h2 className="font-display text-lg">The 150-row log</h2>
        <p className="mt-2">
          Marked SENT. Not in this mailbox. EMAILS_2026-08-26-b.md fails the swap-test Garrett
          locked the same day. Do not follow up a list we cannot see leaving.
        </p>
      </article>
    </div>
  );
}

function Theses() {
  return (
    <div className="flex flex-col gap-4">
      {theses.map((t) => (
        <article key={t.id} className="bg-surface border border-line p-4 rounded-lg">
          <p className="text-[11px] tracking-[0.12em] uppercase text-muted">{t.id}</p>
          <h2 className="font-display text-lg mt-1">{t.title}</h2>
          <p className="text-sm mt-2 leading-relaxed">{t.body}</p>
          <p className="text-sm text-muted mt-3">{t.build}</p>
        </article>
      ))}
      <article className="bg-surface border border-line p-4 rounded-lg">
        <h2 className="font-display text-lg">Stolen, not installed</h2>
        <ul className="mt-3 flex flex-col gap-3 text-sm">
          {keepers.map((k) => (
            <li key={k.steal}>
              <p className="font-medium">{k.steal}</p>
              <p className="text-muted">{k.from} → {k.into}</p>
              <p className="text-muted">Not: {k.not}</p>
            </li>
          ))}
        </ul>
      </article>
      <article className="bg-surface border border-line p-4 rounded-lg">
        <h2 className="font-display text-lg">Killed</h2>
        <ul className="mt-3 list-disc pl-5 text-sm space-y-1">
          {kills.map((k) => (
            <li key={k}>{k}</li>
          ))}
        </ul>
      </article>
    </div>
  );
}

