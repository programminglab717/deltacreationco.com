import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, X } from "lucide-react";
import { PostCard } from "@/components/blog/post-card";
import { PageTransition } from "@/components/layout/page-transition";
import { Marquee } from "@/components/motion/marquee";
import { CtaBooking } from "@/components/sections/cta-booking";
import { Faq } from "@/components/sections/faq";
import { AutomateDemo, BuildDemo } from "@/components/sections/pillar-demos";
import { Process } from "@/components/sections/process";
import { WorkflowPlayground } from "@/components/sections/workflow-playground";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Icon } from "@/components/ui/icon";
import { PageHero } from "@/components/ui/page-hero";
import { SectionHeading } from "@/components/ui/section-heading";
import { getService, serviceCategories, services } from "@/content/services";
import { getSolution } from "@/content/solutions";
import { getAllPosts } from "@/lib/blog";
import { pageMetadata, serviceSchema } from "@/lib/seo";

export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/services/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) return {};
  return pageMetadata({
    title: service.seo.title,
    description: service.seo.description,
    path: `/services/${service.slug}`,
  });
}

export default async function ServicePage({ params }: PageProps<"/services/[slug]">) {
  const { slug } = await params;
  const service = getService(slug);
  if (!service) notFound();

  const category = serviceCategories[service.category];
  const related = service.relatedSolutions.map(getSolution).filter((s) => s !== undefined);
  const posts = getAllPosts().filter((p) => service.relatedPosts.includes(p.slug));
  const others = services.filter((s) => s.slug !== service.slug);
  const isAutomation = service.category === "automation";

  return (
    <PageTransition>
      <PageHero
        crumbs={[
          { name: "Services", path: "/services" },
          { name: service.name, path: `/services/${service.slug}` },
        ]}
        eyebrow={`${category.label} · ${service.name}`}
        title={service.headline}
        lead={service.lead}
        aside={
          <div className="surface overflow-hidden rounded-[2rem] bg-ink-900">
            {isAutomation ? <AutomateDemo /> : <BuildDemo />}
          </div>
        }
      >
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="/book" icon magnetic>
            Book a free strategy call
          </ButtonLink>
          <ButtonLink href="#included" variant="ghost">
            What&apos;s included
          </ButtonLink>
        </div>
      </PageHero>

      {/* Problems */}
      <section
        className="on-paper rounded-t-[2.5rem] bg-paper section-y md:rounded-t-[4rem]"
        aria-labelledby="problems-heading"
      >
        <div className="container-x grid gap-12 lg:grid-cols-[0.9fr_1.1fr] lg:gap-20">
          <SectionHeading
            id="problems-heading"
            eyebrow="Sound familiar?"
            title="If this is you, *we can help.*"
            titleClassName="max-w-[12ch]"
          />
          <ul className="divide-y divide-paper-ink/10 border-y border-paper-ink/10">
            {service.problems.map((p, i) => (
              <li
                key={p}
                className="flex items-start gap-5 py-6 text-lg leading-snug md:text-xl"
                data-reveal
                style={{ "--reveal-delay": `${i * 70}ms` } as CSSProperties}
              >
                <span className="mt-1 grid size-7 shrink-0 place-items-center rounded-full bg-paper-ink text-paper">
                  <X className="size-3.5" strokeWidth={2.5} aria-hidden="true" />
                </span>
                {p}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Deliverables */}
      <section id="included" className="scroll-mt-20 section-y" aria-labelledby="included-heading">
        <div className="container-x">
          <SectionHeading
            id="included-heading"
            eyebrow="What's included"
            title="Everything it takes, *done properly.*"
            titleClassName="max-w-[14ch]"
          />
          <ul className="mt-14 grid gap-px overflow-hidden rounded-[2rem] border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
            {service.deliverables.map((d, i) => (
              <li
                key={d.title}
                className="group bg-ink-950 p-8 transition-colors duration-500 hover:bg-ink-900 sm:p-10"
                data-reveal
                style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as CSSProperties}
              >
                <span className="grid size-12 place-items-center rounded-2xl border border-white/10 text-fog-200 transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-ink-950">
                  <Icon name={d.icon} className="size-5" />
                </span>
                <h3 className="mt-8 text-xl font-medium tracking-tight">{d.title}</h3>
                <p className="mt-3 text-fog-400">{d.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Outcomes */}
      <section className="border-t border-white/[0.06] section-y" aria-labelledby="outcomes-heading">
        <div className="container-x">
          <SectionHeading
            id="outcomes-heading"
            eyebrow="The result"
            title="What changes *for you.*"
            titleClassName="max-w-[12ch]"
          />
          <div className="mt-14 grid gap-10 md:grid-cols-3">
            {service.outcomes.map((o, i) => (
              <div key={o.title} data-reveal style={{ "--reveal-delay": `${i * 100}ms` } as CSSProperties}>
                <p className="font-mono text-sm text-accent">0{i + 1}</p>
                <h3 className="mt-4 border-t border-white/10 pt-6 text-h3 font-medium">{o.title}</h3>
                <p className="mt-3 text-fog-400">{o.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Live automation demo for automation services */}
      {isAutomation && related.length > 0 && (
        <section className="border-t border-white/[0.06] section-y" aria-labelledby="demo-heading">
          <div className="container-x">
            <SectionHeading
              id="demo-heading"
              eyebrow="See it run"
              title="Real workflows, *running live.*"
              lead="Choose a workflow to see each step execute, just like it would in your business."
              titleClassName="max-w-[13ch]"
            />
            <div className="mt-14">
              <WorkflowPlayground
                scenarios={related.map(({ slug: s, name, icon, trigger, manualMinutes, steps }) => ({
                  slug: s,
                  name,
                  icon,
                  trigger,
                  manualMinutes,
                  steps,
                }))}
              />
            </div>
          </div>
        </section>
      )}

      {/* Stack */}
      <section className="border-y border-white/[0.06] py-14" aria-label="Tools and technologies">
        <p className="eyebrow container-x mb-8">Tools &amp; technologies we use</p>
        <Marquee speed={40} className="mask-fade-x">
          {service.stack.map((t) => (
            <span key={t} className="flex items-center text-[clamp(1.6rem,3.5vw,3rem)] font-medium tracking-[-0.04em]">
              <span className="px-6 md:px-9">{t}</span>
              <span className="text-accent" aria-hidden="true">
                ✦
              </span>
            </span>
          ))}
        </Marquee>
      </section>

      <Process />

      {/* Related solutions */}
      {!isAutomation && related.length > 0 && (
        <section className="section-y" aria-labelledby="related-heading">
          <div className="container-x">
            <SectionHeading
              id="related-heading"
              eyebrow="Pairs well with"
              title="Automations that *multiply the impact.*"
              titleClassName="max-w-[15ch]"
            />
            <div className="mt-12 grid gap-5 md:grid-cols-2">
              {related.map((s) => (
                <Link
                  key={s.slug}
                  href={`/solutions/${s.slug}`}
                  className="group flex items-start gap-5 rounded-[1.75rem] border border-white/[0.08] bg-ink-900 p-7 transition-colors duration-500 hover:border-accent/40"
                  data-reveal
                >
                  <span className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/10 text-fog-100 transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-ink-950">
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
      )}

      <Faq
        faqs={service.faqs}
        title={`${service.name}: *your questions.*`}
        lead="Everything you might want to know before getting started. Anything else? Ask us on a call."
      />

      {posts.length > 0 && (
        <section className="border-t border-white/[0.06] section-y" aria-labelledby="reading-heading">
          <div className="container-x">
            <SectionHeading
              id="reading-heading"
              eyebrow="Further reading"
              title="Learn *before you buy.*"
              titleClassName="max-w-[12ch]"
            />
            <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((p, i) => (
                <PostCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="border-t border-white/[0.06] py-16" aria-label="Other services">
        <div className="container-x">
          <p className="eyebrow mb-6">Other services</p>
          <ul className="flex flex-wrap gap-3">
            {others.map((s) => (
              <li key={s.slug}>
                <Link
                  href={`/services/${s.slug}`}
                  className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-fog-200 transition-colors hover:border-accent hover:text-accent"
                >
                  <Icon name={s.icon} className="size-4" />
                  {s.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <CtaBooking
        title={
          isAutomation ? "Let's put your busywork *on autopilot.*" : "Let's build something *your customers love.*"
        }
      />

      <JsonLd
        data={serviceSchema({
          name: service.name,
          description: service.seo.description,
          path: `/services/${service.slug}`,
          serviceType: service.name,
          offers: service.deliverables.map((d) => d.title),
        })}
      />
    </PageTransition>
  );
}
