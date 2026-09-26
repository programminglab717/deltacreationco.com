"use client";

import { useEffect, useState } from "react";
import type { Heading } from "@/lib/blog";
import { cn } from "@/lib/utils";

/** Table of contents that highlights the section currently being read. */
export function Toc({ headings }: { headings: Heading[] }) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const els = headings.map((h) => document.getElementById(h.id)).filter((el): el is HTMLElement => el !== null);
    if (!els.length) return;
    const io = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) setActive(visible[0].target.id);
      },
      { rootMargin: "-15% 0px -70% 0px" },
    );
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [headings]);

  return (
    <nav aria-label="Table of contents">
      <p className="eyebrow eyebrow-plain mb-5">On this page</p>
      <ol className="space-y-2.5 border-l border-white/10">
        {headings
          .filter((h) => h.depth === 2)
          .map((h) => (
            <li key={h.id}>
              <a
                href={`#${h.id}`}
                className={cn(
                  "-ml-px block border-l py-0.5 pl-4 text-sm leading-snug transition-colors",
                  active === h.id ? "border-accent text-fog-100" : "border-transparent text-fog-400 hover:text-fog-200",
                )}
              >
                {h.text}
              </a>
            </li>
          ))}
      </ol>
    </nav>
  );
}
