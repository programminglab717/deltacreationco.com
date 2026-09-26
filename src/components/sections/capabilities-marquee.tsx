import { Marquee } from "@/components/motion/marquee";
import { capabilities, techStack } from "@/content/company";

export function CapabilitiesMarquee() {
  return (
    <section aria-label="Capabilities and tools" className="relative border-y border-white/[0.06] py-10 md:py-14">
      <Marquee speed={45} className="mask-fade-x">
        {capabilities.map((c) => (
          <span key={c} className="flex items-center text-[clamp(2rem,5vw,4.5rem)] font-medium tracking-[-0.045em]">
            <span className="px-6 md:px-10">{c}</span>
            <span className="text-accent" aria-hidden="true">
              ✦
            </span>
          </span>
        ))}
      </Marquee>
      <Marquee speed={35} reverse className="mt-4 mask-fade-x md:mt-6">
        {techStack.map((t) => (
          <span
            key={t}
            className="px-5 font-mono text-[clamp(1.1rem,2.2vw,1.9rem)] tracking-[0.08em] text-fog-400 uppercase md:px-8"
          >
            {t}
          </span>
        ))}
      </Marquee>
    </section>
  );
}
