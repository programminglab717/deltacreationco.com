import type { CSSProperties } from "react";
import { ScrollHighlight } from "@/components/motion/scroll-highlight";
import { commitments } from "@/content/company";

export function Statement() {
  return (
    <section className="relative section-y" aria-labelledby="statement-heading">
      <div className="container-x">
        <h2 id="statement-heading" className="eyebrow mb-10" data-reveal="fade">
          The real bottleneck
        </h2>
        <ScrollHighlight
          className="max-w-[26ch] text-[clamp(1.9rem,4.3vw,4.2rem)] leading-[1.08] font-medium tracking-[-0.04em] md:max-w-[30ch]"
          text="Most businesses don't have a traffic problem or a talent problem. They have a *systems problem:* websites that leak leads and teams buried in copy-paste work. We build the software and automations that fix both."
        />
        <dl className="mt-20 grid gap-px overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.07] md:grid-cols-3">
          {commitments.map((c, i) => (
            <div
              key={c.label}
              className="flex flex-col bg-ink-950 p-8 md:p-10"
              data-reveal
              style={{ "--reveal-delay": `${i * 90}ms` } as CSSProperties}
            >
              <dt className="order-2 mt-3 max-w-[24ch] text-fog-300">{c.label}</dt>
              <dd className="order-1 text-h2 font-medium text-fog-100">{c.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
