import type { CSSProperties } from "react";
import { Check } from "lucide-react";
import { HeroCanvas } from "@/components/sections/hero-canvas";
import { LiveConsole } from "@/components/sections/live-console";
import { ButtonLink } from "@/components/ui/button";

const trust = ["Free 30-minute strategy call", "Fixed-price proposals", "Reply within one business day"];

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-20 md:pb-28 lg:pt-[calc(var(--header-h)+5rem)]">
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_78%_22%,rgba(255,90,31,0.22),transparent_70%),radial-gradient(ellipse_45%_40%_at_95%_60%,rgba(120,40,140,0.18),transparent_70%)]" />
        <HeroCanvas className="absolute inset-0" />
        <div className="absolute inset-0 bg-grid mask-radial opacity-40" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-ink-950" />
      </div>

      <div className="container-x">
        <p
          className="hero-fade glass inline-flex items-center gap-2.5 rounded-full px-4 py-2 text-[0.8rem] text-fog-200"
          style={{ "--i": 0 } as CSSProperties}
        >
          <span className="live-dot" aria-hidden="true" />
          Development &amp; Automation Studio
        </p>

        <h1 className="mt-8 max-w-[16ch] text-display font-medium sm:max-w-none">
          <span className="hero-line">
            <span style={{ "--i": 0 } as CSSProperties}>Websites that convert.</span>
          </span>
          <span className="hero-line">
            <span style={{ "--i": 1 } as CSSProperties}>
              Systems that <span className="pr-[0.05em] font-accent text-accent">run themselves.</span>
            </span>
          </span>
        </h1>

        <div className="mt-12 grid items-start gap-14 lg:mt-16 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16 xl:grid-cols-[0.85fr_1.15fr]">
          <div className="flex flex-col gap-9 lg:pt-4">
            <p className="hero-fade max-w-[34rem] text-lead text-fog-300" style={{ "--i": 2 } as CSSProperties}>
              Delta Creation Co. designs and builds fast, high-converting websites, custom web apps and AI-powered
              automations, so you win more customers and your team gets hours back every week.
            </p>
            <div className="hero-fade flex flex-wrap items-center gap-3" style={{ "--i": 3 } as CSSProperties}>
              <ButtonLink href="/book" size="lg" icon magnetic>
                Book a free strategy call
              </ButtonLink>
              <ButtonLink href="/services" variant="ghost" size="lg">
                Explore services
              </ButtonLink>
            </div>
            <ul className="hero-fade flex flex-col gap-2.5 text-sm text-fog-300" style={{ "--i": 4 } as CSSProperties}>
              {trust.map((t) => (
                <li key={t} className="flex items-center gap-2.5">
                  <span className="grid size-5 place-items-center rounded-full bg-mint/10 text-mint">
                    <Check className="size-3" strokeWidth={2.5} aria-hidden="true" />
                  </span>
                  {t}
                </li>
              ))}
            </ul>
          </div>

          <div className="hero-fade relative" style={{ "--i": 3 } as CSSProperties}>
            <div aria-hidden="true" className="absolute -inset-10 -z-10 rounded-full bg-accent/10 blur-3xl" />
            <LiveConsole />
            <p className="mt-4 text-center font-mono text-[0.68rem] tracking-[0.14em] text-fog-500 uppercase">
              Illustrative workflow · simulated live in your browser
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
