import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/icon";
import { SectionHeading } from "@/components/ui/section-heading";
import { principles } from "@/content/company";

export function Principles() {
  return (
    <section
      className="relative z-10 -mt-10 overflow-hidden rounded-t-[2.5rem] bg-ink-950 section-y md:-mt-16 md:rounded-t-[4rem]"
      aria-labelledby="principles-heading"
    >
      <div
        aria-hidden="true"
        className="absolute top-0 left-1/2 -z-10 h-[40rem] w-[60rem] -translate-x-1/2 rounded-full bg-accent/[0.07] blur-3xl"
      />
      <div className="container-x">
        <SectionHeading
          id="principles-heading"
          eyebrow="Why Delta"
          title="Built like a product team. *Run like a partner.*"
          lead="Modern engineering practices with the focus and flexibility of a small studio. Here's what that means for you."
          titleClassName="max-w-[20ch]"
        />
        <ul className="mt-16 grid gap-px overflow-hidden rounded-[2rem] border border-white/[0.07] bg-white/[0.07] sm:grid-cols-2 lg:grid-cols-3">
          {principles.map((p, i) => (
            <li
              key={p.title}
              className="group relative bg-ink-950 p-8 transition-colors duration-500 hover:bg-ink-900 sm:p-10"
              data-reveal
              style={{ "--reveal-delay": `${(i % 3) * 90}ms` } as CSSProperties}
            >
              <span className="grid size-12 place-items-center rounded-2xl border border-white/10 text-fog-200 transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-ink-950">
                <Icon name={p.icon} className="size-5" />
              </span>
              <h3 className="mt-8 text-xl font-medium tracking-tight">{p.title}</h3>
              <p className="mt-3 text-fog-400">{p.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
