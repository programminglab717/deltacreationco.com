"use client";

import Lenis from "lenis";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { gsap, hasFinePointer, prefersReducedMotion, ScrollTrigger } from "@/lib/gsap";

let lenis: Lenis | null = null;

/** The active Lenis instance, or null when smooth scrolling is disabled. */
export function getLenis() {
  return lenis;
}

export function scrollToTarget(target: string | number | HTMLElement, offset = 0) {
  if (lenis) {
    lenis.scrollTo(target, { offset, duration: 1.4 });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: "smooth" });
    return;
  }
  const el = typeof target === "string" ? document.querySelector(target) : target;
  if (el) {
    const top = el.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
}

/**
 * Smooth, inertia-based scrolling (desktop pointers only; touch devices keep
 * native scrolling) kept in sync with GSAP ScrollTrigger.
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    // Touch devices keep native (momentum) scrolling; no need for the extra work.
    if (prefersReducedMotion() || !hasFinePointer()) return;

    const instance = new Lenis({
      lerp: 0.105,
      wheelMultiplier: 1,
      anchors: { offset: -88 },
      stopInertiaOnNavigate: true,
    });
    lenis = instance;

    instance.on("scroll", ScrollTrigger.update);
    const tick = (time: number) => instance.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tick);
      instance.destroy();
      lenis = null;
    };
  }, []);

  const firstPath = useRef(pathname);
  useEffect(() => {
    // New route content changes page height: re-measure triggers once laid out.
    if (pathname === firstPath.current) return;
    firstPath.current = "";
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 120);
    return () => window.clearTimeout(id);
  }, [pathname]);

  return null;
}
