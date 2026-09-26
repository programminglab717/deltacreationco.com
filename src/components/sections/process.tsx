import type { CSSProperties } from "react";
import { ProcessStack } from "@/components/sections/process-stack";
import { SectionHeading } from "@/components/ui/section-heading";
import { processSteps } from "@/content/company";

export function Process({ tone = "paper" }: { tone?: "paper" | "dark" }) {
  const paper = tone === "paper";
  return (
    <section
      className={paper ? "on-paper relative bg-paper section-y" : "relative section-y"}
      aria-labelledby="process-heading"
    >
      <div className="container-x grid gap-14 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div className="lg:sticky lg:top-[calc(var(--header-h)+3rem)] lg:self-start">
          <SectionHeading
            id="process-heading"
            eyebrow="How we work"
            title="A clear process, *no surprises.*"
            titleClassName="max-w-[12ch]"
          />
          <p
            className={paper ? "mt-6 max-w-sm text-lead text-paper-muted" : "mt-6 max-w-sm text-lead text-fog-300"}
            data-reveal
          >
            From the first call to long after launch, you&apos;ll always know what&apos;s happening, what&apos;s next
            and what it costs.
          </p>
        </div>

        <ProcessStack>
          {processSteps.map((step, i) => (
            <li
              key={step.title}
              className="process-card sticky"
              style={{ top: `calc(var(--header-h) + 2rem + ${i * 1.25}rem)`, "--i": i } as CSSProperties}
            >
              <article
                className={
                  paper
                    ? "rounded-[2rem] border border-paper-300 bg-paper-200 p-8 shadow-[0_-20px_60px_-30px_rgba(22,21,26,0.35)] sm:p-10"
                    : "surface rounded-[2rem] bg-ink-900 p-8 sm:p-10"
                }
              >
                <div className="flex items-start justify-between gap-6">
                  <h3 className="text-h3 font-medium">{step.title}</h3>
                  <span className={paper ? "font-mono text-sm text-accent-700" : "font-mono text-sm text-accent"}>0{i + 1}</span>
                </div>
                <p className={paper ? "mt-4 max-w-[52ch] text-paper-muted" : "mt-4 max-w-[52ch] text-fog-300"}>
                  {step.body}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {step.points.map((p) => (
                    <li
                      key={p}
                      className={
                        paper
                          ? "rounded-full border border-paper-ink/15 px-3 py-1 text-xs text-paper-ink"
                          : "rounded-full border border-white/15 px-3 py-1 text-xs text-fog-200"
                      }
                    >
                      {p}
                    </li>
                  ))}
                </ul>
              </article>
            </li>
          ))}
        </ProcessStack>
      </div>
    </section>
  );
}
