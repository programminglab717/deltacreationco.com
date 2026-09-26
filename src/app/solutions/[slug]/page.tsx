import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Check } from "lucide-react";
import { PageTransition } from "@/components/layout/page-transition";
import { CtaBooking } from "@/components/sections/cta-booking";
import { Faq } from "@/components/sections/faq";
import { WorkflowPlayground } from "@/components/sections/workflow-playground";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { getService } from "@/content/services";
import { getSolution, solutions } from "@/content/solutions";
import { pageMetadata, serviceSchema } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/solutions/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) return {};
  return pageMetadata({
    title: solution.seo.title,
    description: solution.seo.description,
    path: `/solutions/${solution.slug}`,
  });
}

export default async function SolutionPage({ params }: PageProps<"/solutions/[slug]">) {
  const { slug } = await params;
  const solution = getSolution(slug);
  if (!solution) notFound();

  const relatedServices = solution.services.map(getService).filter((s) => s !== undefined);
  const others = solutions.filter((s) => s.slug !== solution.slug).slice(0, 3);

  return (
    <PageTransition>
      <PageHero
        crumbs={[
          { name: "Solutions", path: "/solutions" },
          { name: solution.name, path: `/solutions/${solution.slug}` },
        ]}
        eyebrow={`Automation playbook · ${solution.name}`}
        title={solution.headline}
        lead={solution.problem}
        aside={
          <dl className="surface grid grid-cols-2 overflow-hidden rounded-[2rem] bg-ink-900">
            {[
              { label: "Trigger", value: solution.trigger },
              { label: "Automated steps", value: String(solution.steps.length) },
              {
                label: "Typical run time",
                value: `~${Math.max(1, Math.round(solution.steps.reduce((a, s) => a + s.ms, 0) / 1000))}s`,
              },
              { label: "Replaces", value: `~${solution.manualMinutes} min by hand` },
            ].map((item, i) => (
              <div
                key={item.label}
                className={`flex flex-col gap-2 p-6 sm:p-7 ${i % 2 === 0 ? "border-r border-white/[0.07]" : ""} ${i < 2 ? "border-b border-white/[0.07]" : ""}`}
              >
                <dt className="font-mono text-[0.65rem] tracking-[0.14em] text-fog-500 uppercase">{item.label}</dt>
                <dd className="text-xl font-medium tracking-tight text-fog-100">{item.value}</dd>
              </div>
            ))}
          </dl>
        }
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/book" icon magnetic>
            Get this built for you
          </ButtonLink>
          <ButtonLink href="#workflow" variant="ghost">
            Watch it run
          </ButtonLink>
        </div>
      </PageHero>

      <section id="workflow" className="scroll-mt-20 pb-24 md:pb-32" aria-labelledby="workflow-heading">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
            <SectionHeading
              id="workflow-heading"
              eyebrow="The workflow"
              title="How it works, *step by step.*"
              lead={`Triggered by: ${solution.trigger.toLowerCase()}. Every step runs automatically, with logging, error handling and alerts built in.`}
              titleClassName="max-w-[12ch]"
            />
          </div>
          <WorkflowPlayground
            showTabs={false}
            showLink={false}
            scenarios={[
              {
                slug: solution.slug,
                name: solution.name,
                icon: solution.icon,
                trigger: solution.trigger,
                manualMinutes: solution.manualMinutes,
                steps: solution.steps,
              },
            ]}
          />
        </div>
      </section>

      <section
        className="on-paper rounded-t-[2.5rem] bg-paper section-y md:rounded-t-[4rem]"
        aria-labelledby="outcomes-heading"
      >
        <div className="container-x grid gap-14 lg:grid-cols-2 lg:gap-20">
          <div>
            <SectionHeading
              id="outcomes-heading"
              eyebrow="Outcomes"
              title="What you *get back.*"
              titleClassName="max-w-[10ch]"
            />
            <ul className="mt-10 divide-y divide-paper-ink/10 border-y border-paper-ink/10">
              {solution.outcomes.map((o, i) => (
                <li
                  key={o}
                  className="flex items-start gap-4 py-5 text-lg"
                  data-reveal
                  style={{ "--reveal-delay": `${i * 70}ms` } as CSSProperties}
                >
                  <span className="mt-0.5 grid size-6 shrink-0 place-items-center rounded-full bg-accent text-ink-950">
                    <Check className="size-3.5" strokeWidth={3} aria-hidden="true" />
                  </span>
                  {o}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow" data-reveal="fade">
              What&apos;s included in the build
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {solution.included.map((item, i) => (
                <li
                  key={item}
                  className="rounded-2xl border border-paper-300 bg-paper-200 p-5 text-[0.95rem]"
                  data-reveal
                  style={{ "--reveal-delay": `${(i % 2) * 80}ms` } as CSSProperties}
                >
                  {item}
                </li>
              ))}
            </ul>
            <p className="eyebrow mt-12" data-reveal="fade">
              Works with
            </p>
            <ul className="mt-5 flex flex-wrap gap-2" data-reveal>
              {solution.tools.map((t) => (
                <li key={t} className="rounded-full border border-paper-ink/15 px-3.5 py-1.5 text-sm">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section-y" aria-labelledby="services-heading">
        <div className="container-x">
          <SectionHeading
            id="services-heading"
            eyebrow="Built with"
            title="The services *behind it.*"
            titleClassName="max-w-[12ch]"
          />
          <div className="mt-12 grid gap-5 md:grid-cols-2">
            {relatedServices.map((s) => (
              <Link
                key={s.slug}
                href={`/services/${s.slug}`}
                className="group flex items-start gap-5 rounded-[1.75rem] border border-white/[0.08] bg-ink-900 p-7 transition-colors duration-500 hover:border-accent/40"
                data-reveal
              >
                <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/10 transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-ink-950">
                  <Icon name={s.icon} className="size-5" />
                </span>
                <span className="flex-1">
                  <span className="block text-lg font-medium">{s.name}</span>
                  <span className="mt-1 block text-fog-400">{s.short}</span>
                </span>
                <ArrowUpRight
                  className="size-5 text-fog-500 transition-all duration-500 group-hover:rotate-45 group-hover:text-accent"
                  aria-hidden="true"
                />
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Faq faqs={solution.faqs} title="Good *questions.*" lead="The things teams usually ask about this workflow." />

      <section className="border-t border-white/[0.06] py-16" aria-label="More playbooks">
        <div className="container-x">
          <p className="eyebrow mb-6">More playbooks</p>
          <ul className="grid gap-3 md:grid-cols-3">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/solutions/${s.slug}`}
                  className="group flex items-center justify-between gap-3 rounded-2xl border border-white/10 px-5 py-4 transition-colors hover:border-accent"
                >
                  <span className="flex items-center gap-3">
                    <Icon name={s.icon} className="size-4 text-accent" />
                    {s.name}
                  </span>
                  <ArrowUpRight
                    className="size-4 text-fog-500 transition-transform duration-500 group-hover:rotate-45"
                    aria-hidden="true"
                  />
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBooking title="Want this running *in your business?*" />

      <JsonLd
        data={serviceSchema({
          name: solution.name,
          description: solution.seo.description,
          path: `/solutions/${solution.slug}`,
          serviceType: "Business process automation",
          offers: solution.included,
        })}
      />
    </PageTransition>
  );
}
