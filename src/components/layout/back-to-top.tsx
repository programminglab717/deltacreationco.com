"use client";

import { ArrowUp } from "lucide-react";
import { scrollToTarget } from "@/components/motion/smooth-scroll";

export function BackToTop() {
  return (
    <button
      type="button"
      onClick={() => scrollToTarget(0)}
      className="group inline-flex items-center gap-2 text-fog-300 hover:text-fog-100"
    >
      Back to top
      <span className="grid size-9 place-items-center rounded-full border border-white/10 transition-transform duration-500 group-hover:-translate-y-1">
        <ArrowUp className="size-4" aria-hidden="true" />
      </span>
    </button>
  );
}
