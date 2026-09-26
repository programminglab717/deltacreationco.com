import type { CSSProperties } from "react";
import type { Metadata } from "next";
import { Check, Clock, Video } from "lucide-react";
import { BookingLazy } from "@/components/booking/booking-lazy";
import { PageTransition } from "@/components/layout/page-transition";
import { FaqList } from "@/components/sections/faq";
import { JsonLd } from "@/components/seo/json-ld";
import { Breadcrumbs, HeroTitle } from "@/components/ui/page-hero";
import { booking } from "@/content/booking";
import { site } from "@/content/site";
import { faqSchema, pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Book a Free Strategy Call",
  description:
    "Pick a time for a free 30-minute strategy call. We'll map your biggest opportunities in web development and automation, with no pressure and no pitch deck.",
  path: "/book",
});

const agenda = [
  "Your goals and what success looks like",
  "Where you're losing time or leads today",
  "Quick wins and the highest-impact opportunities",
  "A recommended approach, timeline and budget range",
];

const callFaqs = [
  {
    q: "Is the call really free?",
    a: "Yes. There's no cost and no obligation. If we're a good fit, we'll follow up with a clear proposal. If we're not, we'll tell you, and point you in the right direction.",
  },
  {
    q: "Who will I be speaking with?",
    a: "Someone who can actually answer technical and strategic questions, not a sales script. Come ready to dig into the details.",
  },
  {
    q: "What should I prepare?",
    a: "Nothing formal. It helps to know your goals, the tools you use today and where things feel slow or manual. Links to your current site or examples you like are a bonus.",
  },
  {
    q: "What if none of the times work for me?",
    a: `Email us at ${site.email} with a few times that suit you, and we'll do our best to make it work.`,
  },
];

export default function BookPage() {
  return (
    <PageTransition>
      <section className="relative isolate overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-24 md:pb-32">
        <div aria-hidden="true" className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_55%_at_80%_0%,rgba(255,90,31,0.18),transparent_70%)]" />
          <div className="absolute inset-0 bg-grid mask-radial opacity-40" />
        </div>
        <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:self-start">
            <Breadcrumbs items={[{ name: "Book a call", path: "/book" }]} />
            <p className="hero-fade eyebrow mt-10" style={{ "--i": 1 } as CSSProperties}>
              Free strategy call
            </p>
            <HeroTitle text="Let's map your *next move.*" className="mt-6 max-w-[11ch] text-h1 font-medium" />
            <p className="hero-fade mt-8 max-w-md text-lead text-fog-300" style={{ "--i": 3 } as CSSProperties}>
              {booking.meeting.description} No pitch deck, no pressure. You&apos;ll leave with useful ideas whether or
              not we work together.
            </p>
            <div
              className="hero-fade mt-8 flex flex-wrap gap-5 text-sm text-fog-300"
              style={{ "--i": 4 } as CSSProperties}
            >
              <span className="inline-flex items-center gap-2">
                <Clock className="size-4 text-accent" aria-hidden="true" />
                {booking.meeting.durationMinutes} minutes
              </span>
              <span className="inline-flex items-center gap-2">
                <Video className="size-4 text-accent" aria-hidden="true" />
                {booking.meeting.location}
              </span>
            </div>
            <div className="hero-fade mt-12" style={{ "--i": 5 } as CSSProperties}>
              <p className="eyebrow">What we&apos;ll cover</p>
              <ul className="mt-6 space-y-3.5">
                {agenda.map((a) => (
                  <li key={a} className="flex items-start gap-3 text-fog-200">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-accent text-ink-950">
                      <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                    </span>
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div className="hero-fade" style={{ "--i": 3 } as CSSProperties}>
            <BookingLazy eager />
          </div>
        </div>
      </section>

      <section className="border-t border-white/[0.06] section-y" aria-labelledby="book-faq-heading">
        <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <h2 id="book-faq-heading" className="text-h2 font-medium">
            About the <span className="font-accent">call</span>
          </h2>
          <FaqList faqs={callFaqs} />
        </div>
      </section>

      <JsonLd data={faqSchema(callFaqs)} />
    </PageTransition>
  );
}
