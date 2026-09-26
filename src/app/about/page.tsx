import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { ScrollHighlight } from "@/components/motion/scroll-highlight";
import { CtaBooking } from "@/components/sections/cta-booking";
import { Principles } from "@/components/sections/principles";
import { Process } from "@/components/sections/process";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "About Us: A Development & Automation Studio",
  description:
    "Delta Creation Co. builds websites, software and automations that help growing businesses move faster. Learn how we work and what we believe.",
  path: "/about",
});

const beliefs = [
  {
    title: "Great software is invisible.",
    body: "It loads instantly, works reliably and gets out of the way, so your customers and team can focus on what matters.",
  },
  {
    title: "Automation should free people, not replace them.",
    body: "We automate the repetitive work so your team can spend more time on judgment, creativity and relationships.",
  },
  {
    title: "Speed compounds.",
    body: "Fast pages, fast replies, fast shipping. Small gains in speed turn into big gains in growth.",
  },
  {
    title: "Clarity beats complexity.",
    body: "The simplest system that solves the problem is the one that lasts. We say no to complexity for its own sake.",
  },
];

export default function AboutPage() {
  return (
    <PageTransition>
      <PageHero
        crumbs={[{ name: "About", path: "/about" }]}
        eyebrow="About Delta"
        title="We build the systems that let businesses *grow without the grind.*"
        lead="Delta Creation Co. is a development and automation studio. We help growing businesses win more customers online and run leaner behind the scenes, with websites, software and automations that simply work."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/book" icon magnetic>
            Book a free strategy call
          </ButtonLink>
          <ButtonLink href="/services" variant="ghost">
            Our services
          </ButtonLink>
        </div>
      </PageHero>

      <section className="border-t border-white/[0.06] section-y" aria-labelledby="delta-heading">
        <div className="container-x grid items-center gap-16 lg:grid-cols-[0.9fr_1.1fr]">
          <div className="relative mx-auto aspect-square w-full max-w-md" data-reveal="scale" aria-hidden="true">
            <div className="absolute inset-0 rounded-full bg-accent/15 blur-3xl" />
            <svg viewBox="0 0 32 32" className="relative size-full" fill="none">
              <path
                d="M16 3.5 29.5 27.5h-27L16 3.5Z"
                stroke="currentColor"
                strokeWidth="0.5"
                strokeLinejoin="round"
                className="text-fog-100"
              />
              <path d="M16 9.5 25.6 26H6.4L16 9.5Z" stroke="currentColor" strokeWidth="0.25" className="text-fog-500" />
              <path d="M16 15 21.2 24.2H10.8L16 15Z" fill="#ff5a1f" />
            </svg>
          </div>
          <div>
            <SectionHeading
              id="delta-heading"
              eyebrow="Why “Delta”?"
              title="Δ is the symbol *for change.*"
              titleClassName="max-w-[12ch]"
            />
            <div className="mt-8 space-y-5 text-lead text-fog-300" data-reveal>
              <p>
                In math and science, delta measures the difference between where something is and where it could be.
                That&apos;s exactly our job.
              </p>
              <p>
                We look at how your business runs today (the website, the tools, the manual work in between) and
                engineer the change that moves it forward: more leads, faster operations and hours back every week.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] section-y" aria-label="Mission">
        <div className="container-x">
          <p className="eyebrow mb-10" data-reveal="fade">
            Our mission
          </p>
          <ScrollHighlight
            className="max-w-[28ch] text-[clamp(1.9rem,4.2vw,4rem)] leading-[1.1] font-medium tracking-[-0.04em]"
            text="Give every growing business the kind of software and automation that used to require an in-house engineering team, *without the overhead.*"
          />
        </div>
      </section>

      <section
        className="on-paper rounded-t-[2.5rem] bg-paper section-y md:rounded-t-[4rem]"
        aria-labelledby="beliefs-heading"
      >
        <div className="container-x">
          <SectionHeading
            id="beliefs-heading"
            eyebrow="What we believe"
            title="Principles we *build by.*"
            titleClassName="max-w-[12ch]"
          />
          <div className="mt-14 grid gap-x-10 gap-y-12 md:grid-cols-2">
            {beliefs.map((b, i) => (
              <div
                key={b.title}
                className="border-t border-paper-ink/15 pt-8"
                data-reveal
                style={{ "--reveal-delay": `${(i % 2) * 90}ms` } as CSSProperties}
              >
                <p className="font-mono text-sm text-accent-700">0{i + 1}</p>
                <h3 className="mt-4 text-h3 font-medium">{b.title}</h3>
                <p className="mt-3 max-w-md text-paper-muted">{b.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Process />
      <Principles />
      <CtaBooking title="Let's see what we can *build together.*" />
    </PageTransition>
  );
}
