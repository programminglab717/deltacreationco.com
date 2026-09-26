import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { PageTransition } from "@/components/layout/page-transition";
import { CtaBooking } from "@/components/sections/cta-booking";
import { Faq } from "@/components/sections/faq";
import { Process } from "@/components/sections/process";
import { JsonLd } from "@/components/seo/json-ld";
import { ServiceCard } from "@/components/services/service-card";
import { ButtonLink } from "@/components/ui/button";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { engagementModels, homeFaqs } from "@/content/company";
import { serviceCategories, servicesByCategory, type ServiceCategory } from "@/content/services";
import { absoluteUrl } from "@/content/site";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Services: Web Development, Automation & AI",
  description:
    "Websites, web apps, SaaS, workflow automation, AI agents and API integrations. Explore Delta Creation Co.'s development and automation services.",
  path: "/services",
});

const categories: ServiceCategory[] = ["development", "automation"];

export default function ServicesPage() {
  const all = categories.flatMap((c) => servicesByCategory(c));
  return (
    <PageTransition>
      <PageHero
        crumbs={[{ name: "Services", path: "/services" }]}
        eyebrow="Services"
        title="Everything you need to *build, launch and scale.*"
        lead="Two disciplines under one roof: development that turns visitors into customers, and automation that turns busywork into systems. Use them separately or together."
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/book" icon magnetic>
            Book a free strategy call
          </ButtonLink>
          <ButtonLink href="#development" variant="ghost">
            Browse services
          </ButtonLink>
        </div>
      </PageHero>

      {categories.map((cat, ci) => {
        const meta = serviceCategories[cat];
        const items = servicesByCategory(cat);
        return (
          <section
            key={cat}
            id={cat}
            className="scroll-mt-20 border-t border-white/[0.06] section-y"
            aria-labelledby={`${cat}-heading`}
          >
            <div className="container-x">
              <div className="grid gap-8 lg:grid-cols-[1fr_1fr] lg:items-end">
                <SectionHeading
                  id={`${cat}-heading`}
                  eyebrow={`0${ci + 1} · ${meta.label}`}
                  title={ci === 0 ? "Development that *drives growth.*" : "Automation that *gives time back.*"}
                  titleClassName="max-w-[14ch]"
                />
                <p className="max-w-lg text-lead text-fog-300 lg:justify-self-end" data-reveal>
                  {meta.description}
                </p>
              </div>
              <div
                className={
                  items.length === 2
                    ? "mt-14 grid gap-5 md:grid-cols-2"
                    : "mt-14 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
                }
              >
                {items.map((s, i) => (
                  <ServiceCard key={s.slug} service={s} index={i} />
                ))}
              </div>
            </div>
          </section>
        );
      })}

      <section
        className="on-paper rounded-t-[2.5rem] bg-paper section-y md:rounded-t-[4rem]"
        aria-labelledby="engage-heading"
      >
        <div className="container-x">
          <SectionHeading
            id="engage-heading"
            eyebrow="Ways to work together"
            title="Flexible engagements, *clear pricing.*"
            lead="Every engagement starts with a free call and ends with a fixed-price proposal, so you always know what you're paying for."
            titleClassName="max-w-[15ch]"
          />
          <div className="mt-14 grid gap-5 md:grid-cols-3">
            {engagementModels.map((m, i) => (
              <article
                key={m.name}
                className="flex flex-col rounded-[2rem] border border-paper-300 bg-paper-200 p-8 sm:p-9"
                data-reveal
                style={{ "--reveal-delay": `${i * 90}ms` } as CSSProperties}
              >
                <p className="font-mono text-xs tracking-[0.14em] text-accent-700 uppercase">0{i + 1}</p>
                <h3 className="mt-6 text-2xl font-medium tracking-tight">{m.name}</h3>
                <p className="mt-1 font-accent text-xl text-paper-muted">{m.tagline}</p>
                <p className="mt-5 flex-1 text-paper-muted">{m.body}</p>
                <p className="mt-8 border-t border-paper-ink/10 pt-5 text-sm">
                  <span className="text-paper-muted">Best for: </span>
                  {m.bestFor}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <div className="-mt-px">
        <Process />
      </div>

      <Faq faqs={homeFaqs.slice(1, 7)} />
      <CtaBooking title="Not sure what you need? *Let's figure it out.*" />

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Delta Creation Co. services",
          itemListElement: all.map((s, i) => ({
            "@type": "ListItem",
            position: i + 1,
            name: s.name,
            url: absoluteUrl(`/services/${s.slug}`),
          })),
        }}
      />
    </PageTransition>
  );
}
