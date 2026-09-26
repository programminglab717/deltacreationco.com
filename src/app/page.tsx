import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { CapabilitiesMarquee } from "@/components/sections/capabilities-marquee";
import { CtaBooking } from "@/components/sections/cta-booking";
import { Faq } from "@/components/sections/faq";
import { Hero } from "@/components/sections/hero";
import { Insights } from "@/components/sections/insights";
import { Pillars } from "@/components/sections/pillars";
import { Principles } from "@/components/sections/principles";
import { Process } from "@/components/sections/process";
import { RoiCalculator } from "@/components/sections/roi-calculator";
import { SolutionsScroller } from "@/components/sections/solutions-scroller";
import { Statement } from "@/components/sections/statement";
import { WorkflowPlayground } from "@/components/sections/workflow-playground";
import { SectionHeading } from "@/components/ui/section-heading";
import { ButtonLink } from "@/components/ui/button";
import { homeFaqs } from "@/content/company";
import { site } from "@/content/site";
import { solutions } from "@/content/solutions";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: `${site.name} | Web Development & Automation Agency`,
  absoluteTitle: true,
  description:
    "We build high-converting websites, custom web apps and AI-powered business automations that save your team hours every week. Book a free strategy call.",
  path: "/",
});

const playgroundScenarios = solutions.slice(0, 4).map(({ slug, name, icon, trigger, manualMinutes, steps }) => ({
  slug,
  name,
  icon,
  trigger,
  manualMinutes,
  steps,
}));

const scrollerItems = solutions.map(({ slug, name, short, icon, trigger, steps }) => ({
  slug,
  name,
  short,
  icon,
  trigger,
  steps: steps.map(({ icon: stepIcon, title }) => ({ icon: stepIcon, title })),
}));

export default function Home() {
  return (
    <PageTransition>
      <Hero />
      <CapabilitiesMarquee />
      <Statement />
      <Pillars />

      <section
        className="relative z-10 -mt-10 rounded-t-[2.5rem] bg-ink-950 section-y md:-mt-16 md:rounded-t-[4rem]"
        aria-labelledby="demo-heading"
      >
        <div className="container-x">
          <div className="grid gap-8 lg:grid-cols-[1fr_auto] lg:items-end">
            <SectionHeading
              id="demo-heading"
              eyebrow="See it run"
              title="Watch an automation *do the work.*"
              lead="Pick a workflow and hit run. This is the kind of system we design and build for clients, replacing hours of manual steps with seconds of reliable automation."
              titleClassName="max-w-[15ch]"
            />
          </div>
          <div className="mt-14">
            <WorkflowPlayground scenarios={playgroundScenarios} />
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden section-y" aria-labelledby="roi-heading">
        <div
          aria-hidden="true"
          className="absolute top-1/3 right-0 -z-10 h-[30rem] w-[40rem] rounded-full bg-accent/[0.08] blur-3xl"
        />
        <div className="container-x">
          <SectionHeading
            id="roi-heading"
            eyebrow="ROI calculator"
            title="What is manual work *really costing you?*"
            lead="Move the sliders to estimate how much time and money repetitive work costs your business each year, and what automation could win back."
            titleClassName="max-w-[16ch]"
          />
          <div className="mt-14" data-reveal>
            <RoiCalculator />
          </div>
        </div>
      </section>

      <Process />
      <Principles />

      <SolutionsScroller
        items={scrollerItems}
        heading={
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <SectionHeading
              id="solutions-heading"
              eyebrow="Automation playbooks"
              title="Proven workflows, *tailored to you.*"
              titleClassName="max-w-[15ch]"
            />
            <div className="flex flex-col items-start gap-5 md:items-end" data-reveal>
              <p className="max-w-sm text-fog-400 md:text-right">
                Battle-tested automation patterns we adapt to your tools, your data and the way your team works.
              </p>
              <ButtonLink href="/solutions" variant="ghost" size="sm">
                All solutions
              </ButtonLink>
            </div>
          </div>
        }
      />

      <Insights />
      <Faq faqs={homeFaqs} />
      <CtaBooking />
    </PageTransition>
  );
}
