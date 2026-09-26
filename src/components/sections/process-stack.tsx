"use client";

import { useRef, type ReactNode } from "react";
import { gsap, onIdle, prefersReducedMotion, useGSAP } from "@/lib/gsap";

/**
 * Sticky stacking cards: each card pins below the previous one, and cards
 * underneath shrink and dim slightly as the next one slides over them.
 */
export function ProcessStack({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLOListElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      if (prefersReducedMotion() || !ref.current || !contextSafe) return;
      const list = ref.current;
      const setup = contextSafe(() => {
        const cards = gsap.utils.toArray<HTMLElement>(".process-card", list);
        cards.forEach((card, i) => {
          const next = cards[i + 1];
          if (!next) return;
          gsap.fromTo(
            card.firstElementChild,
            { scale: 1, filter: "brightness(1)" },
            {
              scale: 0.92,
              filter: "brightness(0.94)",
              ease: "none",
              scrollTrigger: { trigger: next, start: "top bottom-=10%", end: "top top+=30%", scrub: true },
            },
          );
        });
      });
      return onIdle(setup);
    },
    { scope: ref },
  );

  return (
    <ol ref={ref} className="flex flex-col gap-6 pb-[10vh]">
      {children}
    </ol>
  );
}
