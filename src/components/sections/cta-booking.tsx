import Link from "next/link";
import { Check } from "lucide-react";
import { BookingLazy } from "@/components/booking/booking-lazy";
import { SplitWords } from "@/components/motion/split-words";
import { site } from "@/content/site";

const outcomes = [
  "Where you're losing time and leads today",
  "The quick wins worth doing first",
  "A recommended approach, timeline and budget range",
  "Honest advice, even if we're not the right fit",
];

export function CtaBooking({
  title = "Let's build what's *next.*",
  lead = "In 30 focused minutes, we'll map your biggest opportunities and outline the fastest path to results. No pitch deck, no pressure.",
  eager = false,
}: {
  title?: string;
  lead?: string;
  eager?: boolean;
}) {
  return (
    <section
      className="on-accent relative isolate overflow-hidden rounded-t-[2.5rem] bg-accent section-y text-ink-950 md:rounded-t-[4rem]"
      aria-labelledby="cta-heading"
    >
      <svg
        aria-hidden="true"
        viewBox="0 0 32 32"
        className="pointer-events-none absolute -top-[8vw] -left-[10vw] -z-10 w-[55vw] text-ink-950/[0.07]"
        fill="none"
      >
        <path d="M16 3.5 29.5 27.5h-27L16 3.5Z" stroke="currentColor" strokeWidth="0.6" strokeLinejoin="round" />
        <path d="M16 9 25 25H7l9-16Z" stroke="currentColor" strokeWidth="0.3" strokeLinejoin="round" />
      </svg>
      <div className="container-x grid items-start gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)]">
          <p className="font-mono text-xs tracking-[0.16em] text-ink-950/85 uppercase" data-reveal="fade">
            Free strategy call · 30 minutes
          </p>
          <SplitWords as="h2" id="cta-heading" text={title} className="mt-6 block text-h1 font-medium" />
          <p className="mt-7 max-w-md text-lead text-ink-950/80" data-reveal>
            {lead}
          </p>
          <p className="mt-9 text-sm font-semibold tracking-[0.12em] text-ink-950/85 uppercase" data-reveal>
            You&apos;ll walk away with
          </p>
          <ul className="mt-4 space-y-3" data-reveal>
            {outcomes.map((o) => (
              <li key={o} className="flex items-start gap-3 text-[1.02rem]">
                <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-ink-950 text-accent">
                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                </span>
                {o}
              </li>
            ))}
          </ul>
          <p className="mt-10 text-sm text-ink-950/85" data-reveal>
            Prefer email?{" "}
            <a href={`mailto:${site.email}`} className="font-medium underline underline-offset-4">
              {site.email}
            </a>{" "}
            or{" "}
            <Link href="/contact" className="font-medium underline underline-offset-4">
              send us a brief
            </Link>
            .
          </p>
        </div>
        <BookingLazy eager={eager} className="text-fog-100" />
      </div>
    </section>
  );
}
