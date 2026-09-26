"use client";

import { useEffect, useRef, useState } from "react";
import { Check } from "lucide-react";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

/** Runs `steps` phases on a loop while the element is visible. */
function usePhaseLoop(steps: number[], hold = 2600) {
  const ref = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (prefersReducedMotion()) {
      // Show the finished state without motion.
      const id = window.setTimeout(() => setPhase(steps.length), 0);
      return () => window.clearTimeout(id);
    }
    let timers: number[] = [];
    let visible = false;
    const clear = () => {
      timers.forEach(window.clearTimeout);
      timers = [];
    };
    const run = () => {
      clear();
      setPhase(0);
      let t = 400;
      steps.forEach((d, i) => {
        timers.push(window.setTimeout(() => setPhase(i + 1), t));
        t += d;
      });
      timers.push(window.setTimeout(() => visible && run(), t + hold));
    };
    const io = new IntersectionObserver(
      ([entry]) => {
        const was = visible;
        visible = entry.isIntersecting;
        if (visible && !was) run();
        if (!visible) clear();
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => {
      clear();
      io.disconnect();
    };
    // Steps are static per component instance.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return { ref, phase };
}

const SCORES = ["Performance", "Accessibility", "Best practices", "SEO"];

export function BuildDemo() {
  const { ref, phase } = usePhaseLoop([500, 500, 500, 700, 900]);
  const built = (n: number) => phase >= n;

  return (
    <div ref={ref} className="relative h-full min-h-[18rem] overflow-hidden p-6 sm:p-8" aria-hidden="true">
      <div className="relative mx-auto max-w-md overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-2xl shadow-black/60">
        <div className="flex items-center gap-2 border-b border-white/[0.07] px-4 py-2.5">
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="size-2 rounded-full bg-white/15" />
          <span className="ml-3 flex-1 rounded-full bg-white/[0.05] px-3 py-1 font-mono text-[0.62rem] text-fog-400">
            https://yourbrand.com
          </span>
        </div>
        <div className="space-y-3 p-5">
          <div
            className={cn(
              "flex items-center justify-between transition-all duration-700",
              built(1) ? "opacity-100" : "translate-y-2 opacity-0",
            )}
          >
            <span className="h-2.5 w-14 rounded-full bg-fog-100/80" />
            <span className="flex gap-2">
              <span className="h-2 w-8 rounded-full bg-white/15" />
              <span className="h-2 w-8 rounded-full bg-white/15" />
              <span className="h-2 w-10 rounded-full bg-accent" />
            </span>
          </div>
          <div
            className={cn(
              "space-y-2 pt-3 transition-all duration-700",
              built(2) ? "opacity-100" : "translate-y-2 opacity-0",
            )}
          >
            <span className="block h-4 w-4/5 rounded-full bg-fog-100/90" />
            <span className="block h-4 w-3/5 rounded-full bg-gradient-to-r from-accent to-accent-300" />
            <span className="block h-2 w-2/3 rounded-full bg-white/15" />
          </div>
          <div
            className={cn(
              "flex gap-2 pt-1 transition-all duration-700",
              built(3) ? "opacity-100" : "translate-y-2 opacity-0",
            )}
          >
            <span className="h-6 w-20 rounded-full bg-accent" />
            <span className="h-6 w-16 rounded-full border border-white/20" />
          </div>
          <div
            className={cn(
              "grid grid-cols-3 gap-2 pt-2 transition-all duration-700",
              built(3) ? "opacity-100" : "translate-y-3 opacity-0",
            )}
          >
            {[0, 1, 2].map((i) => (
              <span key={i} className="h-12 rounded-xl border border-white/[0.07] bg-white/[0.04]" />
            ))}
          </div>
        </div>
      </div>

      <div
        className={cn(
          "absolute right-5 bottom-5 rounded-2xl border border-white/10 bg-ink-900/95 p-3.5 shadow-2xl shadow-black/70 backdrop-blur transition-all duration-700 ease-[var(--ease-out-expo)] sm:right-6 sm:bottom-6",
          built(4) ? "translate-y-0 opacity-100" : "translate-y-6 opacity-0",
        )}
      >
        <div className="grid grid-cols-4 gap-3">
          {SCORES.map((label) => (
            <div key={label} className="flex flex-col items-center gap-1.5">
              <svg viewBox="0 0 36 36" className="size-10 -rotate-90">
                <circle cx="18" cy="18" r="15" fill="none" stroke="rgb(79 240 176 / 0.15)" strokeWidth="3" />
                <circle
                  cx="18"
                  cy="18"
                  r="15"
                  fill="none"
                  stroke="#4ff0b0"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeDasharray="94.25"
                  strokeDashoffset={built(4) ? 0 : 94.25}
                  className="transition-[stroke-dashoffset] delay-200 duration-[1400ms] ease-[var(--ease-out-expo)]"
                />
              </svg>
              <span className="font-mono text-[0.6rem] text-mint">100</span>
              <span className="w-14 text-center text-[0.55rem] leading-tight text-fog-400">{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div
        className={cn(
          "absolute top-5 left-5 flex items-center gap-2 rounded-full border border-mint/20 bg-ink-900/95 px-3 py-1.5 font-mono text-[0.62rem] text-mint shadow-xl transition-all duration-700 ease-[var(--ease-out-expo)] sm:top-6 sm:left-6",
          built(5) ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0",
        )}
      >
        <Check className="size-3" strokeWidth={3} />
        Deployed to production
      </div>
    </div>
  );
}

const TASKS = [
  { task: "Enter new leads into the CRM", minutes: 95 },
  { task: "Chase unpaid invoices", minutes: 60 },
  { task: "Build the Monday report", minutes: 120 },
  { task: "Onboard each new client", minutes: 90 },
  { task: "Answer repeat support questions", minutes: 150 },
];

function formatHours(min: number) {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${h}h ${String(m).padStart(2, "0")}m`;
}

export function AutomateDemo() {
  const { ref, phase } = usePhaseLoop(
    TASKS.map(() => 750),
    3000,
  );
  const saved = TASKS.slice(0, phase).reduce((acc, t) => acc + t.minutes, 0);

  return (
    <div ref={ref} className="flex h-full min-h-[18rem] flex-col justify-center p-6 sm:p-8" aria-hidden="true">
      <div className="mx-auto w-full max-w-md overflow-hidden rounded-2xl border border-white/10 bg-ink-850 shadow-2xl shadow-black/60">
        <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
          <span className="font-mono text-[0.62rem] tracking-[0.14em] text-fog-400 uppercase">Weekly busywork</span>
          <span className="font-mono text-[0.62rem] text-fog-500">
            {phase}/{TASKS.length} automated
          </span>
        </div>
        <ul className="divide-y divide-white/[0.05]">
          {TASKS.map((t, i) => {
            const done = phase > i;
            return (
              <li key={t.task} className="flex items-center gap-3 px-4 py-2.5">
                <span
                  className={cn(
                    "grid size-5 shrink-0 place-items-center rounded-md border transition-all duration-500",
                    done ? "border-mint bg-mint text-ink-950" : "border-white/20",
                  )}
                >
                  <Check
                    className={cn("size-3 transition-transform duration-500", done ? "scale-100" : "scale-0")}
                    strokeWidth={3}
                  />
                </span>
                <span
                  className={cn(
                    "flex-1 truncate text-[0.8rem] transition-colors duration-500",
                    done ? "text-fog-500 line-through decoration-fog-500/60" : "text-fog-200",
                  )}
                >
                  {t.task}
                </span>
                <span
                  className={cn(
                    "shrink-0 rounded-full px-2 py-0.5 font-mono text-[0.6rem] transition-colors duration-500",
                    done ? "bg-mint/10 text-mint" : "bg-white/[0.05] text-fog-400",
                  )}
                >
                  {done ? "automated" : `${t.minutes}m/wk`}
                </span>
              </li>
            );
          })}
        </ul>
        <div className="flex items-center justify-between border-t border-white/[0.07] bg-black/20 px-4 py-3">
          <span className="text-[0.72rem] text-fog-400">Time back every week</span>
          <span className="font-mono text-sm text-fog-100 tabular-nums">{formatHours(saved)}</span>
        </div>
      </div>
    </div>
  );
}
