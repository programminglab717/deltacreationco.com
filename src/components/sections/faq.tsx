import { Plus } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { SectionHeading } from "@/components/ui/section-heading";
import { faqSchema } from "@/lib/seo";
import { cn } from "@/lib/utils";

type Faq = { q: string; a: string };

/** Accessible FAQ built on native <details>, with FAQPage structured data. */
export function FaqList({
  faqs,
  tone = "dark",
  className,
}: {
  faqs: Faq[];
  tone?: "dark" | "paper";
  className?: string;
}) {
  const paper = tone === "paper";
  return (
    <div className={cn("border-t", paper ? "border-paper-ink/15" : "border-white/10", className)}>
      {faqs.map((f, i) => (
        <details
          key={f.q}
          className={cn("faq group border-b", paper ? "border-paper-ink/15" : "border-white/10")}
          name="faq"
          open={i === 0}
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-6 py-6 text-left text-lg font-medium tracking-tight md:text-xl [&::-webkit-details-marker]:hidden">
            {f.q}
            <span
              className={cn(
                "grid size-9 shrink-0 place-items-center rounded-full border transition-all duration-500 group-open:rotate-45",
                paper
                  ? "border-paper-ink/20 group-open:border-paper-ink group-open:bg-paper-ink group-open:text-paper"
                  : "border-white/15 group-open:border-accent group-open:bg-accent group-open:text-ink-950",
              )}
              aria-hidden="true"
            >
              <Plus className="size-4" />
            </span>
          </summary>
          <p className={cn("max-w-[68ch] pr-12 pb-7 leading-relaxed", paper ? "text-paper-muted" : "text-fog-300")}>
            {f.a}
          </p>
        </details>
      ))}
    </div>
  );
}

export function Faq({
  faqs,
  title = "Questions, *answered.*",
  lead = "Straight answers to what people usually ask before working with us. Don't see yours? Just ask.",
  withSchema = true,
}: {
  faqs: Faq[];
  title?: string;
  lead?: string;
  withSchema?: boolean;
}) {
  return (
    <section className="section-y" aria-labelledby="faq-heading">
      <div className="container-x grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
          <SectionHeading id="faq-heading" eyebrow="FAQ" title={title} lead={lead} titleClassName="max-w-[12ch]" />
        </div>
        <FaqList faqs={faqs} />
      </div>
      {withSchema && <JsonLd data={faqSchema(faqs)} />}
    </section>
  );
}
