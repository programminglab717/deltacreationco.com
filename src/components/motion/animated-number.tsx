"use client";

import { useEffect, useRef, useState } from "react";
import { prefersReducedMotion } from "@/lib/gsap";

const easeOutExpo = (t: number) => (t === 1 ? 1 : 1 - Math.pow(2, -10 * t));

function formatNumber(n: number, decimals: number, prefix: string, suffix: string) {
  return (
    prefix + n.toLocaleString("en-US", { minimumFractionDigits: decimals, maximumFractionDigits: decimals }) + suffix
  );
}

/**
 * Tweens a number whenever `value` changes. With `startOnView`, the first
 * count waits until the element scrolls into view.
 */
export function AnimatedNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  duration = 1100,
  startOnView = false,
  className,
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  duration?: number;
  startOnView?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const current = useRef(startOnView ? 0 : value);
  const [inView, setInView] = useState(!startOnView);

  useEffect(() => {
    if (!startOnView || !ref.current) return;
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setInView(true);
        io.disconnect();
      }
    });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [startOnView]);

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView) return;
    const from = current.current;
    const to = value;
    if (from === to || prefersReducedMotion()) {
      current.current = to;
      el.textContent = formatNumber(to, decimals, prefix, suffix);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const step = (now: number) => {
      const t = Math.min((now - start) / duration, 1);
      const v = from + (to - from) * easeOutExpo(t);
      current.current = v;
      el.textContent = formatNumber(v, decimals, prefix, suffix);
      if (t < 1) raf = requestAnimationFrame(step);
    };
    raf = requestAnimationFrame(step);
    return () => cancelAnimationFrame(raf);
  }, [value, inView, duration, decimals, prefix, suffix]);

  return (
    <span ref={ref} className={className} suppressHydrationWarning>
      {formatNumber(startOnView ? 0 : value, decimals, prefix, suffix)}
    </span>
  );
}
