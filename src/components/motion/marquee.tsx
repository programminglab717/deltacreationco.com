"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/**
 * Infinite ticker. Drifts at a base speed, speeds up with scroll velocity and
 * follows the scroll direction. Pauses when off screen.
 */
export function Marquee({
  children,
  speed = 50,
  reverse = false,
  className,
  trackClassName,
}: {
  children: ReactNode;
  /** Base speed in pixels per second. */
  speed?: number;
  reverse?: boolean;
  className?: string;
  trackClassName?: string;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const wrap = wrapRef.current;
    const track = trackRef.current;
    if (!wrap || !track || prefersReducedMotion()) return;

    let half = track.scrollWidth / 2;
    let x = 0;
    let boost = 0;
    let dir = reverse ? -1 : 1;
    let lastY = window.scrollY;
    let last = performance.now();
    let raf = 0;
    let running = false;

    const ro = new ResizeObserver(() => {
      half = track.scrollWidth / 2;
    });
    ro.observe(track);

    const frame = (now: number) => {
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;

      const y = window.scrollY;
      const dy = y - lastY;
      lastY = y;
      if (Math.abs(dy) > 0.5) {
        boost = Math.min(boost + Math.abs(dy) * 0.12, 6);
        dir = (reverse ? -1 : 1) * Math.sign(dy);
      }
      boost *= 0.92;

      x -= speed * (1 + boost) * dt * dir;
      if (half > 0) {
        if (x <= -half) x += half;
        if (x > 0) x -= half;
      }
      track.style.transform = `translate3d(${x}px, 0, 0)`;
      raf = requestAnimationFrame(frame);
    };

    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !running) {
        running = true;
        last = performance.now();
        lastY = window.scrollY;
        raf = requestAnimationFrame(frame);
      } else if (!entry.isIntersecting && running) {
        running = false;
        cancelAnimationFrame(raf);
      }
    });
    io.observe(wrap);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
    };
  }, [speed, reverse]);

  return (
    <div ref={wrapRef} className={cn("relative overflow-hidden", className)}>
      <div ref={trackRef} className={cn("flex w-max will-change-transform", trackClassName)}>
        <div className="flex shrink-0 items-center">{children}</div>
        <div className="flex shrink-0 items-center" aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
