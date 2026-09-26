"use client";

import Link from "next/link";
import { useRef, type ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { Icon, type IconName } from "@/components/ui/icon";
import { gsap, onIdle, useGSAP } from "@/lib/gsap";

export type ScrollerItem = {
  slug: string;
  name: string;
  short: string;
  icon: IconName;
  trigger: string;
  steps: { icon: IconName; title: string }[];
};

/**
 * Pinned horizontal gallery on desktop (vertical scroll drives it sideways);
 * a native swipeable row on touch and small screens.
 */
export function SolutionsScroller({ items, heading }: { items: ScrollerItem[]; heading: ReactNode }) {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Pinning is set up once the page is idle; the section sits far below the fold.
      const cancelIdle = onIdle(
        () =>
          mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
            const track = trackRef.current;
            const section = sectionRef.current;
            if (!track || !section) return;
            const distance = () => Math.max(0, track.scrollWidth - track.clientWidth);
            gsap.to(track, {
              x: () => -distance(),
              ease: "none",
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: () => `+=${distance()}`,
                pin: true,
                scrub: 0.8,
                invalidateOnRefresh: true,
              },
            });
            const bar = section.querySelector<HTMLElement>("[data-progress]");
            if (bar) {
              gsap.fromTo(
                bar,
                { scaleX: 0 },
                {
                  scaleX: 1,
                  ease: "none",
                  scrollTrigger: { trigger: section, start: "top top", end: () => `+=${distance()}`, scrub: true },
                },
              );
            }
          }),
        2500,
      );
      return () => {
        cancelIdle();
        mm.revert();
      };
    },
    { scope: sectionRef },
  );

  return (
    <section
      ref={sectionRef}
      className="relative overflow-hidden py-24 lg:flex lg:h-screen lg:flex-col lg:justify-center lg:py-0"
      aria-labelledby="solutions-heading"
    >
      <div className="container-x">{heading}</div>
      <div
        ref={trackRef}
        className="mt-12 no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-[var(--gutter)] pb-4 lg:mt-14 lg:snap-none lg:overflow-visible lg:pb-0"
      >
        {items.map((item, i) => (
          <Link
            key={item.slug}
            href={`/solutions/${item.slug}`}
            data-cursor="Explore"
            className="group relative flex w-[82vw] shrink-0 snap-start flex-col justify-between overflow-hidden rounded-[2rem] border border-white/[0.08] bg-ink-900 p-7 transition-colors duration-500 hover:border-accent/50 sm:w-[24rem] sm:p-8 lg:h-[26rem] lg:w-[28rem]"
          >
            <div
              aria-hidden="true"
              className="absolute -top-16 -right-16 size-56 rounded-full bg-accent/0 blur-3xl transition-colors duration-700 group-hover:bg-accent/20"
            />
            <div className="relative flex items-start justify-between">
              <span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-fog-100 transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-ink-950">
                <Icon name={item.icon} className="size-6" />
              </span>
              <span className="font-mono text-sm text-fog-500">{String(i + 1).padStart(2, "0")}</span>
            </div>

            <div className="relative mt-10">
              <p className="font-mono text-[0.68rem] tracking-[0.14em] text-fog-500 uppercase">
                Trigger: {item.trigger}
              </p>
              <h3 className="mt-3 text-2xl font-medium tracking-tight">{item.name}</h3>
              <p className="mt-3 text-fog-400">{item.short}</p>
            </div>

            <div className="relative mt-8 flex items-center justify-between">
              <ol className="flex items-center" aria-label="Workflow steps">
                {item.steps.slice(0, 5).map((s, k) => (
                  <li key={k} className="flex items-center">
                    {k > 0 && <span className="h-px w-3 bg-white/15 sm:w-4" aria-hidden="true" />}
                    <span
                      title={s.title}
                      className="grid size-8 place-items-center rounded-full border border-white/10 text-fog-300 transition-colors duration-500 group-hover:border-accent/40 group-hover:text-accent-300"
                    >
                      <Icon name={s.icon} className="size-3.5" />
                      <span className="sr-only">{s.title}</span>
                    </span>
                  </li>
                ))}
              </ol>
              <ArrowUpRight
                className="size-6 text-fog-400 transition-all duration-500 group-hover:rotate-45 group-hover:text-accent"
                aria-hidden="true"
              />
            </div>
          </Link>
        ))}
        <div className="w-px shrink-0 lg:w-[max(0px,calc((100vw-88rem)/2))]" aria-hidden="true" />
      </div>
      <div className="container-x mt-10 hidden lg:block" aria-hidden="true">
        <div className="h-px bg-white/10">
          <div data-progress className="h-px origin-left bg-accent" />
        </div>
      </div>
    </section>
  );
}
