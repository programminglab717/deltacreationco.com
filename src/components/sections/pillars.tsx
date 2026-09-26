import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ArrowUpRight } from "lucide-react";
import { AutomateDemo, BuildDemo } from "@/components/sections/pillar-demos";
import { SectionHeading } from "@/components/ui/section-heading";
import { serviceCategories, servicesByCategory, type ServiceCategory } from "@/content/services";

const bullets: Record<ServiceCategory, string[]> = {
  development: [
    "Marketing websites & landing pages",
    "Web apps, portals & SaaS MVPs",
    "Headless CMS & e-commerce",
    "Technical SEO & Core Web Vitals",
  ],
  automation: [
    "Lead, sales & CRM automation",
    "Onboarding, billing & operations",
    "AI agents & document processing",
    "Integrations, APIs & dashboards",
  ],
};

export function Pillars() {
  return (
    <section
      id="services"
      className="on-paper relative z-10 -mt-10 rounded-t-[2.5rem] bg-paper section-y md:rounded-t-[4rem]"
      aria-labelledby="pillars-heading"
    >
      <div className="container-x">
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeading
            id="pillars-heading"
            eyebrow="What we do"
            title="Development & automation, *under one roof.*"
            titleClassName="max-w-[16ch]"
          />
          <p className="max-w-md text-lead text-paper-muted" data-reveal>
            Most agencies build the website and stop. We build the site, the software and the systems behind them, so
            leads, data and work flow on their own.
          </p>
        </div>

        <div className="mt-16 grid gap-5 lg:mt-20 lg:grid-cols-2">
          <PillarCard category="development" demo={<BuildDemo />} index={0} />
          <PillarCard category="automation" demo={<AutomateDemo />} index={1} />
        </div>
      </div>
    </section>
  );
}

function PillarCard({ category, demo, index }: { category: ServiceCategory; demo: ReactNode; index: number }) {
  const meta = serviceCategories[category];
  const items = servicesByCategory(category);

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-[2rem] bg-ink-900 text-fog-100"
      data-reveal
      style={{ "--reveal-delay": `${index * 120}ms` } as CSSProperties}
    >
      <div className="relative border-b border-white/[0.07] bg-[radial-gradient(ellipse_at_top,rgba(255,90,31,0.14),transparent_65%)]">
        <div
          className="absolute inset-0 bg-grid [mask-image:linear-gradient(to_bottom,black,transparent)] opacity-50"
          aria-hidden="true"
        />
        <div className="relative">{demo}</div>
      </div>
      <div className="flex flex-1 flex-col p-7 sm:p-10">
        <p className="eyebrow">
          0{index + 1} · {meta.label}
        </p>
        <h3 className="mt-4 text-h2 font-medium">{meta.title}</h3>
        <p className="mt-4 max-w-[46ch] text-fog-300">{meta.description}</p>
        <ul className="mt-6 grid gap-x-6 gap-y-2 text-sm text-fog-300 sm:grid-cols-2">
          {bullets[category].map((b) => (
            <li key={b} className="flex items-center gap-2">
              <span className="size-1 rounded-full bg-accent" aria-hidden="true" />
              {b}
            </li>
          ))}
        </ul>
        <ul className="mt-8 border-t border-white/[0.07]">
          {items.map((s) => (
            <li key={s.slug} className="border-b border-white/[0.07]">
              <Link
                href={`/services/${s.slug}`}
                className="group/row flex items-center justify-between gap-4 py-4 transition-colors hover:text-accent"
              >
                <span className="text-lg font-medium tracking-tight">{s.name}</span>
                <ArrowUpRight
                  className="size-5 shrink-0 text-fog-400 transition-all duration-500 group-hover/row:rotate-45 group-hover/row:text-accent"
                  aria-hidden="true"
                />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
