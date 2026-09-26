import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, CalendarDays, Mail } from "lucide-react";
import { PageTransition } from "@/components/layout/page-transition";
import { StudioClock } from "@/components/layout/studio-clock";
import { ContactForm } from "@/components/forms/contact-form";
import { FaqList } from "@/components/sections/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs, HeroTitle } from "@/components/ui/page-hero";
import { homeFaqs } from "@/content/company";
import { absoluteUrl, site } from "@/content/site";
import { faqSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Contact Us: Start Your Project",
  description:
    "Tell us about your website, app or automation project. We reply within one business day, or book a free 30-minute strategy call.",
  path: "/contact",
});

const steps = [
  { title: "We review your message", body: "A real person reads every enquiry, usually the same day." },
  { title: "We reply with next steps", body: `Questions, ideas or a suggested call time, ${site.responseTime}.` },
  { title: "Discovery call", body: "A focused conversation to map the solution together." },
  { title: "Fixed-price proposal", body: "Clear scope, timeline and investment. No surprises." },
];

const contactFaqs = [homeFaqs[2], homeFaqs[3], homeFaqs[4]];

export default function ContactPage() {
  return (
    <PageTransition>
      <section className="relative isolate overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-24 md:pb-32">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_15%_0%,rgba(255,90,31,0.14),transparent_70%)]" />
          <div className="absolute inset-0 bg-grid mask-radial opacity-40" />
        </div>
        <div className="container-x grid gap-14 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <Breadcrumbs items={[{ name: "Contact", path: "/contact" }]} />
            <p className="hero-fade eyebrow mt-10" style={{ "--i": 1 } as CSSProperties}>
              Contact
            </p>
            <HeroTitle text="Tell us what you're *building.*" className="mt-6 max-w-[12ch] text-h1 font-medium" />
            <p className="hero-fade mt-8 max-w-md text-lead text-fog-300" style={{ "--i": 3 } as CSSProperties}>
              Share a few details and we&apos;ll come back with ideas and next steps {site.responseTime}. The more
              context you give, the more useful our reply.
            </p>

            <div className="hero-fade mt-10 grid gap-3 sm:grid-cols-2" style={{ "--i": 4 } as CSSProperties}>
              <Link
                href="/book"
                className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-accent/50"
              >
                <CalendarDays className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                <span>
                  <span className="flex items-center gap-1.5 font-medium">
                    Book a call
                    <ArrowUpRight
                      className="size-4 transition-transform duration-500 group-hover:rotate-45"
                      aria-hidden="true"
                    />
                  </span>
                  <span className="mt-1 block text-sm text-fog-400">Free 30-minute strategy call</span>
                </span>
              </Link>
              <a
                href={`mailto:${site.email}`}
                className="group flex items-start gap-4 rounded-2xl border border-white/10 bg-white/[0.02] p-5 transition-colors hover:border-accent/50"
              >
                <Mail className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
                <span className="min-w-0">
                  <span className="block font-medium">Email us</span>
                  <span className="mt-1 block truncate text-sm text-fog-400">{site.email}</span>
                </span>
              </a>
            </div>

            <div className="hero-fade mt-12" style={{ "--i": 5 } as CSSProperties}>
              <p className="eyebrow">What happens next</p>
              <ol className="mt-6 space-y-5">
                {steps.map((s, i) => (
                  <li key={s.title} className="flex gap-4">
                    <span className="grid size-7 shrink-0 place-items-center rounded-full border border-white/15 font-mono text-xs text-fog-300">
                      {i + 1}
                    </span>
                    <span>
                      <span className="block font-medium text-fog-100">{s.title}</span>
                      <span className="mt-0.5 block text-sm text-fog-400">{s.body}</span>
                    </span>
                  </li>
                ))}
              </ol>
            </div>

            <StudioClock className="hero-fade mt-12" />
          </div>

          <div className="hero-fade" style={{ "--i": 3 } as CSSProperties}>
            <ContactForm />
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] section-y" aria-labelledby="contact-faq-heading">
        <div className="container-x grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
          <h2 id="contact-faq-heading" className="text-h2 font-medium">
            Before you <span className="font-accent">reach out</span>
          </h2>
          <FaqList faqs={contactFaqs} />
        </div>
      </section>

      <JsonLd
        data={[
          {
            "@context": "https://schema.org",
            "@type": "ContactPage",
            name: `Contact ${site.name}`,
            url: absoluteUrl("/contact"),
            mainEntity: { "@id": `${site.url}/#organization` },
          },
          faqSchema(contactFaqs),
        ]}
      />
    </PageTransition>
  );
}
