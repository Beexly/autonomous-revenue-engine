import { IG_DM, IG_HANDLE } from "@/lib/kit-offer";

export function Nav() {
  return (
    <header className="absolute inset-x-0 top-0 z-20 flex items-center justify-between px-5 py-5 md:px-8">
      <a href="#top" className="flex items-center gap-3 text-paper no-underline">
        <span className="grid size-8 place-items-center rounded-[8px] border border-line">
          <svg width="16" height="16" viewBox="0 0 32 32" aria-hidden="true">
            <circle cx="16" cy="16" r="10.25" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path
              d="M12.2 22 V10.2 h4.1 c2.55 0 4.05 1.45 4.05 3.7 0 2.3-1.55 3.75-4.15 3.75 H12.2 m4.05 0 L20.9 22"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
        <span className="font-display text-xl italic">Kit</span>
      </a>
      <div className="flex items-center gap-3">
        <span className="kicker hidden sm:inline">The Woodlands, TX</span>
        <a href={IG_DM} className="btn-primary text-sm">
          DM “KIT”
        </a>
      </div>
      <span className="sr-only">{IG_HANDLE}</span>
    </header>
  );
}
