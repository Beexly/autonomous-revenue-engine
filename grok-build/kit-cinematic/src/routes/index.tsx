import { createFileRoute } from "@tanstack/react-router";
import { IG_DM, IG_HANDLE } from "@/lib/kit-offer";
import { Hero } from "@/components/kit/hero";
import { Work } from "@/components/kit/work";
import { Pricing } from "@/components/kit/pricing";
import { Craft, Faq, Reversal } from "@/components/kit/craft-faq";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  return (
    <div className="kit-shell relative">
      <div className="grain" />
      <Hero />
      <Work />
      <section className="relative z-10 px-5 py-20 md:px-8">
        <div className="mx-auto max-w-[1240px] overflow-hidden rounded-[28px] border border-line">
          <div className="grid md:grid-cols-2">
            <div className="bg-ink-2 p-8 md:p-14">
              <p className="kicker">Your business</p>
              <h2 className="display mt-4 text-2xl">
                Free preview. Usually back the <em>same day.</em>
              </h2>
              <p className="mt-4 max-w-md text-muted leading-[1.55]">
                Send the business name. I send the page. If you hate it, you pay
                nothing. Sample businesses on this page are fictional — yours
                gets your name.
              </p>
            </div>
            <div className="flex items-center bg-paper px-8 py-10 text-ink md:px-14">
              <div>
                <p className="text-sm tracking-[0.16em] uppercase text-faint">
                  Instagram
                </p>
                <p className="mt-2 font-display text-4xl italic">{IG_HANDLE}</p>
                <a href={IG_DM} className="btn-on-paper mt-6">
                  DM “KIT”
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      <Craft />
      <Pricing />
      <Reversal />
      <Faq />
      <footer className="relative z-10 border-t border-line px-5 py-10 md:px-8">
        <div className="mx-auto flex max-w-[1240px] flex-col gap-4 text-sm text-muted md:flex-row md:items-center md:justify-between">
          <p className="font-display text-xl italic text-paper">Kit</p>
          <p>Garrett · The Woodlands / Spring / Conroe</p>
          <p>Samples are fictional. Nothing on this page is a live customer.</p>
        </div>
      </footer>
      <div className="sticky-cta sm:hidden">
        <a href={IG_DM} className="btn-primary">
          DM “KIT”
        </a>
      </div>
    </div>
  );
}
