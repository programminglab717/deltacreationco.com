"use client";

import { useRef } from "react";
import { gsap, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { cn, parseAccent } from "@/lib/utils";

/**
 * A paragraph whose words light up one by one as you scroll through it.
 * The effect is only set up just before the paragraph scrolls into view, so
 * the text stays at full contrast until then (and for reduced-motion users).
 */
export function ScrollHighlight({ text, className }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);

  useGSAP(
    (_context, contextSafe) => {
      const el = ref.current;
      if (!el || prefersReducedMotion() || !contextSafe) return;

      const setup = contextSafe(() => {
        const words = el.querySelectorAll(".hw");
        if (!words.length) return;
        gsap.fromTo(
          words,
          { opacity: 0.16 },
          {
            opacity: 1,
            stagger: 0.1,
            ease: "none",
            scrollTrigger: { trigger: el, start: "top 82%", end: "bottom 48%", scrub: 0.8 },
          },
        );
      });

      const io = new IntersectionObserver(
        ([entry]) => {
          // Only dim words that haven't been read yet (still below the fold).
          if (entry.isIntersecting && entry.boundingClientRect.top > window.innerHeight * 0.82) {
            io.disconnect();
            setup();
          } else if (entry.boundingClientRect.bottom < 0) {
            io.disconnect();
          }
        },
        { rootMargin: "0px 0px 15% 0px" },
      );
      io.observe(el);
      return () => io.disconnect();
    },
    { scope: ref },
  );

  return (
    <p ref={ref} className={className}>
      {parseAccent(text).map((segment, s) =>
        segment.text
          .split(/\s+/)
          .filter(Boolean)
          .map((word, w) => (
            <span key={`${s}-${w}`} className={cn("hw", segment.accent && "font-accent text-accent")}>
              {word}{" "}
            </span>
          )),
      )}
    </p>
  );
}
