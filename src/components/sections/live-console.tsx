"use client";

import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/icon";
import { onIdle, prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

type Node = { label: string; icon: IconName };

const NODES: Node[] = [
  { label: "Form", icon: "inbox" },
  { label: "Enrich", icon: "search" },
  { label: "AI score", icon: "sparkles" },
  { label: "CRM", icon: "database" },
  { label: "Notify", icon: "bell" },
];

const LEADS = [
  {
    name: "Maya R.",
    company: "Northwind Studio",
    need: "Website redesign",
    size: "48 staff",
    score: 92,
    route: "#sales",
  },
  {
    name: "Daniel K.",
    company: "Brightline Clinics",
    need: "Intake automation",
    size: "120 staff",
    score: 87,
    route: "#ops",
  },
  {
    name: "Priya S.",
    company: "Atlas Freight",
    need: "AI support agent",
    size: "310 staff",
    score: 81,
    route: "#sales",
  },
  { name: "Tom W.", company: "Fieldcraft Co.", need: "Client portal", size: "22 staff", score: 76, route: "#projects" },
  { name: "Lena M.", company: "Harbor & Pine", need: "CRM integration", size: "65 staff", score: 89, route: "#sales" },
];

type Line = { id: number; event: string; detail: string; ms: number };

function stepLine(step: number, lead: (typeof LEADS)[number]): Omit<Line, "id" | "ms"> {
  switch (step) {
    case 0:
      return { event: "lead.captured", detail: `${lead.name}, “${lead.need}”` };
    case 1:
      return { event: "lead.enriched", detail: `${lead.company} · ${lead.size}` };
    case 2:
      return { event: "ai.qualified", detail: `score ${lead.score}/100 · high intent` };
    case 3:
      return { event: "crm.synced", detail: "contact + deal created" };
    default:
      return { event: "team.notified", detail: `${lead.route} · reply drafted` };
  }
}

const STEP_MS = [380, 720, 1040, 460, 330];
const MAX_LINES = 6;

function initialLines(): Line[] {
  const lead = LEADS[LEADS.length - 1];
  return [2, 3, 4].map((s, i) => ({ id: -3 + i, ...stepLine(s, lead), ms: STEP_MS[s] }));
}

/**
 * A simulated, live-running automation: nodes light up as a lead travels
 * through the pipeline and each step is written to an event log.
 */
export function LiveConsole({ className }: { className?: string }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(-1);
  const [lines, setLines] = useState<Line[]>(initialLines);
  const [runs, setRuns] = useState(1284);
  const [saved, setSaved] = useState(312);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || prefersReducedMotion()) return;

    let timers: number[] = [];
    let leadIndex = 0;
    let lineId = 0;
    let visible = false;
    let running = false;

    const clear = () => {
      timers.forEach(window.clearTimeout);
      timers = [];
    };

    const runCycle = () => {
      if (!visible || document.hidden) {
        running = false;
        return;
      }
      running = true;
      const lead = LEADS[leadIndex % LEADS.length];
      leadIndex++;
      let t = 250;
      NODES.forEach((_, step) => {
        timers.push(
          window.setTimeout(() => {
            setActive(step);
            const ms = STEP_MS[step] + Math.round(Math.random() * 90);
            setLines((prev) => [...prev, { id: lineId++, ...stepLine(step, lead), ms }].slice(-MAX_LINES));
          }, t),
        );
        t += STEP_MS[step] + 260;
      });
      timers.push(
        window.setTimeout(() => {
          setActive(-1);
          setRuns((r) => r + 1);
          setSaved((s) => s + 0.4);
        }, t + 200),
      );
      timers.push(window.setTimeout(runCycle, t + 1500));
    };

    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting;
      if (visible && !running) {
        clear();
        runCycle();
      }
    });
    // Start once the page has settled so the simulation never competes with loading.
    const cancelIdle = onIdle(() => io.observe(root), 2500);

    const onVisibility = () => {
      if (!document.hidden && visible && !running) {
        clear();
        runCycle();
      }
    };
    document.addEventListener("visibilitychange", onVisibility);

    return () => {
      cancelIdle();
      clear();
      io.disconnect();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, []);

  const progress = active < 0 ? 0 : active / (NODES.length - 1);

  return (
    <div
      ref={rootRef}
      className={cn(
        "relative overflow-hidden rounded-[1.6rem] border border-white/[0.09] bg-ink-900/90 shadow-2xl shadow-black/60",
        className,
      )}
      role="img"
      aria-label="Animated example of an automation: a new lead is captured, enriched, scored by AI, added to the CRM and the team is notified."
    >
      <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-3.5">
        <div className="flex items-center gap-3">
          <span className="flex gap-1.5" aria-hidden="true">
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
            <span className="size-2.5 rounded-full bg-white/15" />
          </span>
          <span className="font-mono text-xs text-fog-400">workflows/new-lead.flow</span>
        </div>
        <span className="flex items-center gap-2 rounded-full border border-mint/25 bg-mint/[0.08] px-2.5 py-1 font-mono text-[0.65rem] tracking-[0.14em] text-mint uppercase">
          <span className="live-dot scale-75" aria-hidden="true" />
          Live
        </span>
      </div>

      {/* Pipeline */}
      <div className="relative px-6 pt-7 pb-6 sm:px-8">
        <div className="relative">
          <div className="absolute top-6 right-[10%] left-[10%] h-px bg-white/10" aria-hidden="true" />
          <div
            className="absolute top-6 left-[10%] h-px bg-gradient-to-r from-accent/0 via-accent to-accent transition-[width] duration-500 ease-[var(--ease-out-expo)]"
            style={{ width: `${progress * 80}%` }}
            aria-hidden="true"
          />
          <div
            className={cn(
              "absolute top-6 size-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_18px_4px_rgba(255,90,31,0.7)] transition-[left,opacity] duration-500 ease-[var(--ease-out-expo)]",
              active < 0 ? "opacity-0" : "opacity-100",
            )}
            style={{ left: `${10 + progress * 80}%` }}
            aria-hidden="true"
          />
          <ol className="relative grid grid-cols-5">
            {NODES.map((node, i) => {
              const state = active === i ? "active" : active > i ? "done" : "idle";
              return (
                <li key={node.label} className="flex flex-col items-center gap-2.5">
                  <span
                    className={cn(
                      "grid size-12 place-items-center rounded-2xl border transition-all duration-500",
                      state === "active" &&
                        "scale-110 border-accent bg-accent text-ink-950 shadow-[0_0_30px_-4px_rgba(255,90,31,0.8)]",
                      state === "done" && "border-accent/40 bg-accent/10 text-accent-300",
                      state === "idle" && "border-white/10 bg-ink-800 text-fog-300",
                    )}
                  >
                    <Icon name={node.icon} className="size-5" />
                  </span>
                  <span
                    className={cn(
                      "text-[0.7rem] font-medium transition-colors duration-500",
                      state === "idle" ? "text-fog-500" : "text-fog-100",
                    )}
                  >
                    {node.label}
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Event log */}
      <div className="border-t border-white/[0.07] bg-black/25 px-5 py-4 font-mono text-[0.72rem] leading-6 sm:px-6">
        <ul className="flex h-36 flex-col justify-end overflow-hidden" aria-hidden="true">
          {lines.map((line) => (
            <li
              key={line.id}
              className="flex animate-[fade-up_0.6s_var(--ease-out-expo)_both] items-center gap-3 whitespace-nowrap"
            >
              <span className="text-mint">✓</span>
              <span className="w-[6.8rem] shrink-0 text-fog-200">{line.event}</span>
              <span className="min-w-0 flex-1 truncate text-fog-400">{line.detail}</span>
              <span className="shrink-0 text-fog-500 tabular-nums">{line.ms}ms</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 divide-x divide-white/[0.07] border-t border-white/[0.07] text-center">
        {[
          { label: "Runs today", value: runs.toLocaleString("en-US") },
          { label: "Avg. run time", value: "2.9s" },
          { label: "Hours saved", value: `${Math.round(saved)}h` },
        ].map((s) => (
          <div key={s.label} className="px-3 py-3.5">
            <p className="font-mono text-base text-fog-100 tabular-nums">{s.value}</p>
            <p className="mt-0.5 text-[0.65rem] tracking-[0.14em] text-fog-500 uppercase">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
