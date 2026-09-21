import { lazy, Suspense, useEffect, useRef, useState } from "react";
import { ArrowDown } from "lucide-react";
import { IG_DM, trades } from "@/lib/kit-offer";
import { Nav } from "./nav";
import { Phone } from "./phone";
import { SampleScreen } from "./sample-screen";

const DustField = lazy(() =>
  import("./dust-field").then((m) => ({ default: m.DustField })),
);

function Word({ children, delay }: { children: string; delay: number }) {
  return (
    <span className="reveal-word">
      <span style={{ animationDelay: `${delay}ms` }}>{children}</span>
    </span>
  );
}

export function Hero() {
  const stage = useRef<HTMLElement>(null);
  const [tilt, setTilt] = useState({ x: 10, y: -18 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const el = stage.current;
    if (!el) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onMove = (e: PointerEvent) => {
      if (reduce) return;
      const r = el.getBoundingClientRect();
      const nx = (e.clientX - r.left) / r.width - 0.5;
      const ny = (e.clientY - r.top) / r.height - 0.5;
      setTilt({ x: 8 + ny * -10, y: -16 + nx * 14 });
    };

    const onScroll = () => {
      if (reduce) return;
      const p = Math.min(window.scrollY / Math.max(window.innerHeight, 1), 1);
      setTilt((t) => ({ x: 10 - p * 10, y: t.y * (1 - p * 0.35) }));
    };

    el.addEventListener("pointermove", onMove);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      el.removeEventListener("pointermove", onMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <section
      ref={stage}
      id="top"
      className="relative isolate min-h-[100svh] overflow-hidden"
    >
      <img
        src="/kit/workshop.jpg"
        alt=""
        className="absolute inset-0 h-full w-full object-cover"
        crossOrigin="anonymous"
      />
      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(10,9,8,0.35)_0%,rgba(10,9,8,0.55)_42%,rgba(10,9,8,0.92)_100%)]" />
      {mounted ? (
        <Suspense fallback={null}>
          <DustField />
        </Suspense>
      ) : null}

      <Nav />

      <div className="relative z-10 mx-auto flex min-h-[100svh] max-w-[1240px] flex-col justify-end gap-10 px-5 pb-10 pt-28 md:flex-row md:items-end md:justify-between md:px-8 md:pb-16">
        <div className="max-w-3xl">
          <p className="kicker mb-6">
            <Word delay={40}>Kit</Word>
            <span className="mx-3 opacity-40">·</span>
            <Word delay={120}>a digital creative space</Word>
          </p>
          <h1 className="display text-3xl">
            <span className="block">
              <Word delay={180}>Websites</Word> <Word delay={250}>that</Word>
            </span>
            <span className="block">
              <Word delay={330}>make</Word> <Word delay={400}>the</Word>{" "}
              <em>
                <Word delay={480}>phone</Word> <Word delay={540}>ring.</Word>
              </em>
            </span>
          </h1>
          <p
            className="mt-6 max-w-md text-base leading-[1.55] text-muted"
            style={{ animationDelay: "700ms" }}
          >
            I'm Garrett. I hand-build websites for local businesses — starting at{" "}
            <span className="text-paper">$350 flat</span>. You see a free preview
            with YOUR business on it before you pay a cent.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <a href={IG_DM} className="btn-primary">
              Start with a free preview
            </a>
            <a href="#work" className="btn-ghost">
              See the samples
            </a>
          </div>
        </div>

        <div className="flex flex-col items-center gap-4 md:items-end">
          <div
            className="[transform-style:preserve-3d]"
            style={{
              transform: `perspective(1200px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
              transition: "transform 220ms cubic-bezier(0.22,1,0.36,1)",
            }}
          >
            <Phone>
              <SampleScreen trade={trades[0]} />
            </Phone>
          </div>
          <p className="kicker">Sample · Midnight Service</p>
        </div>
      </div>

      <a
        href="#work"
        className="absolute bottom-6 left-5 z-10 flex items-center gap-2 text-muted no-underline md:left-8"
      >
        <ArrowDown className="size-4" />
        <span className="kicker">Scroll</span>
      </a>
    </section>
  );
}
