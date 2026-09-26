import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PageTransition } from "@/components/layout/page-transition";
import { CtaBooking } from "@/components/sections/cta-booking";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { absoluteUrl } from "@/content/site";
import { solutions } from "@/content/solutions";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Automation Solutions & Playbooks for Growing Businesses",
  description:
    "Proven automation playbooks: instant lead follow-up, client onboarding, invoicing, AI support, automated reporting and AI document processing. See how each workflow runs.",
  path: "/solutions",
});

export default function SolutionsPage() {
  return (
    <PageTransition>
      <PageHero
        crumbs={[{ name: "Solutions", path: "/solutions" }]}
        eyebrow="Automation playbooks"
        title="Proven workflows that *pay for themselves.*"
        lead="Each playbook is a battle-tested automation pattern we tailor to your tools, data and team. Explore how they work, step by step, then let's build yours."
      >
        <ButtonLink href="/book" icon magnetic>
          Find your best first automation
        </ButtonLink>
      </PageHero>

      <section className="pb-24 md:pb-32" aria-label="Solutions">
        <div className="container-x grid gap-5 md:grid-cols-2">
          {solutions.map((s, i) => (
            <Link
              key={s.slug}
              href={`/solutions/${s.slug}`}
              className="group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-ink-900 p-7 transition-colors duration-500 hover:border-accent/40 sm:p-10"
              data-reveal
              style={{ "--reveal-delay": `${(i % 2) * 100}ms` } as CSSProperties}
              data-cursor="Explore"
            >
              <div
                aria-hidden="true"
                className="absolute -top-24 -right-24 size-72 rounded-full bg-accent/0 blur-3xl transition-colors duration-700 group-hover:bg-accent/15"
              />
              <div className="relative flex items-start justify-between">
                <span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-ink-950">
                  <Icon name={s.icon} className="size-6" />
                </span>
                <span className="font-mono text-sm text-fog-500">{String(i + 1).padStart(2, "0")}</span>
              </div>
              <p className="relative mt-10 font-mono text-[0.68rem] tracking-[0.14em] text-fog-500 uppercase">
                Trigger: {s.trigger}
              </p>
              <h2 className="relative mt-3 text-h3 font-medium">{s.name}</h2>
              <p className="relative mt-3 max-w-md text-fog-400">{s.short}</p>
              <ol className="relative mt-8 flex flex-wrap items-center gap-y-3" aria-label="Workflow steps">
                {s.steps.map((step, k) => (
                  <li key={step.title} className="flex items-center">
                    {k > 0 && <span className="h-px w-4 bg-white/15" aria-hidden="true" />}
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 px-3 py-1.5 text-xs text-fog-300">
                      <Icon name={step.icon} className="size-3.5" />
                      {step.title}
                    </span>
                  </li>
                ))}
              </ol>
              <span className="relative mt-9 inline-flex items-center gap-2 text-sm font-medium text-fog-100">
                See the playbook
                <ArrowUpRight
                  className="size-4 transition-transform duration-500 group-hover:rotate-45"
                  aria-hidden="true"
                />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <CtaBooking title="Don't see your workflow? *We'll design it.*" />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Automation solutions",
          itemListElement: solutions.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.name,
            url: absoluteUrl(`/solutions/${s.slug}`),
          })),
        }}
      />
    </PageTransition>
  );
}
