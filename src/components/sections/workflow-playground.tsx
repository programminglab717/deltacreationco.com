"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { ArrowUpRight, Check, Play, RotateCcw } from "lucide-react";
import { Icon, type IconName } from "@/components/ui/icon";
import { track } from "@/lib/analytics";
import { prefersReducedMotion } from "@/lib/gsap";
import { cn } from "@/lib/utils";

export type PlaygroundScenario = {
  slug: string;
  name: string;
  icon: IconName;
  trigger: string;
  manualMinutes: number;
  steps: { title: string; detail: string; icon: IconName; tool: string; ms: number }[];
};

type StepState = { status: "idle" | "running" | "done"; ms?: number };

export function WorkflowPlayground({
  scenarios,
  showTabs = true,
  autoRun = true,
  showLink = true,
}: {
  scenarios: PlaygroundScenario[];
  showTabs?: boolean;
  autoRun?: boolean;
  showLink?: boolean;
}) {
  const [index, setIndex] = useState(0);
  const scenario = scenarios[index];
  const [states, setStates] = useState<StepState[]>(() => scenario.steps.map(() => ({ status: "idle" })));
  const [total, setTotal] = useState<number | null>(null);
  const [running, setRunning] = useState(false);
  const timers = useRef<number[]>([]);
  const panelRef = useRef<HTMLDivElement>(null);
  const hasAutoRun = useRef(false);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const clearTimers = () => {
    timers.current.forEach(window.clearTimeout);
    timers.current = [];
  };

  const run = useCallback(
    (i: number) => {
      clearTimers();
      const steps = scenarios[i].steps;
      setTotal(null);
      setRunning(true);
      setStates(steps.map(() => ({ status: "idle" })));

      if (prefersReducedMotion()) {
        const sum = steps.reduce((a, s) => a + s.ms, 0);
        setStates(steps.map((s) => ({ status: "done", ms: s.ms })));
        setTotal(sum);
        setRunning(false);
        return;
      }

      let t = 350;
      let sum = 0;
      steps.forEach((step, s) => {
        const ms = Math.round(step.ms * (0.85 + Math.random() * 0.3));
        sum += ms;
        timers.current.push(
          window.setTimeout(() => {
            setStates((prev) => prev.map((st, k) => (k === s ? { status: "running" } : st)));
          }, t),
        );
        t += Math.max(ms, 420);
        timers.current.push(
          window.setTimeout(() => {
            setStates((prev) => prev.map((st, k) => (k === s ? { status: "done", ms } : st)));
          }, t),
        );
        t += 90;
      });
      timers.current.push(
        window.setTimeout(() => {
          setTotal(sum);
          setRunning(false);
        }, t + 150),
      );
    },
    [scenarios],
  );

  useEffect(() => clearTimers, []);

  useEffect(() => {
    if (!autoRun || !panelRef.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAutoRun.current) {
          hasAutoRun.current = true;
          run(0);
        }
      },
      { threshold: 0.35 },
    );
    io.observe(panelRef.current);
    return () => io.disconnect();
  }, [autoRun, run]);

  const select = (i: number) => {
    setIndex(i);
    hasAutoRun.current = true;
    run(i);
    track("playground_run", { scenario: scenarios[i].slug });
  };

  const onTabKey = (e: KeyboardEvent<HTMLButtonElement>, i: number) => {
    if (e.key !== "ArrowDown" && e.key !== "ArrowUp" && e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    e.preventDefault();
    const dir = e.key === "ArrowDown" || e.key === "ArrowRight" ? 1 : -1;
    const next = (i + dir + scenarios.length) % scenarios.length;
    tabRefs.current[next]?.focus();
    select(next);
  };

  const done = states.filter((s) => s.status === "done").length;
  const progress = (done / scenario.steps.length) * 100;
  const speedup = total ? Math.round((scenario.manualMinutes * 60000) / total) : 0;

  return (
    <div className={cn("grid gap-6", showTabs && "lg:grid-cols-[0.75fr_1.25fr] lg:gap-8")}>
      {showTabs && (
        <div
          role="tablist"
          aria-label="Automation examples"
          aria-orientation="vertical"
          className="-mx-[var(--gutter)] no-scrollbar flex gap-2 overflow-x-auto px-[var(--gutter)] lg:mx-0 lg:flex-col lg:overflow-visible lg:px-0"
        >
          {scenarios.map((s, i) => (
            <button
              key={s.slug}
              ref={(el) => {
                tabRefs.current[i] = el;
              }}
              role="tab"
              type="button"
              id={`tab-${s.slug}`}
              aria-selected={i === index}
              aria-controls="playground-panel"
              tabIndex={i === index ? 0 : -1}
              onClick={() => select(i)}
              onKeyDown={(e) => onTabKey(e, i)}
              className={cn(
                "group flex shrink-0 items-center gap-4 rounded-2xl border p-4 text-left transition-all duration-500 lg:p-5",
                i === index
                  ? "border-accent/50 bg-accent/[0.07]"
                  : "border-white/[0.07] bg-white/[0.02] hover:border-white/20",
              )}
            >
              <span
                className={cn(
                  "grid size-11 shrink-0 place-items-center rounded-xl border transition-colors duration-500",
                  i === index ? "border-accent bg-accent text-ink-950" : "border-white/10 text-fog-300",
                )}
              >
                <Icon name={s.icon} className="size-5" />
              </span>
              <span className="pr-2">
                <span className="block font-medium text-fog-100">{s.name}</span>
                <span className="mt-0.5 block font-mono text-[0.68rem] tracking-[0.12em] text-fog-500 uppercase">
                  Trigger: {s.trigger}
                </span>
              </span>
            </button>
          ))}
        </div>
      )}

      <div
        ref={panelRef}
        id="playground-panel"
        role={showTabs ? "tabpanel" : undefined}
        aria-labelledby={showTabs ? `tab-${scenario.slug}` : undefined}
        className="surface relative overflow-hidden rounded-[1.75rem]"
      >
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4 sm:px-7">
          <div className="flex items-center gap-3">
            <span
              className={cn("live-dot", !running && "opacity-40")}
              data-state={running ? "online" : "offline"}
              aria-hidden="true"
            />
            <span className="font-mono text-xs text-fog-300">
              {running ? "Running…" : total ? "Completed" : "Ready"} · {scenario.name}
            </span>
          </div>
          <button
            type="button"
            onClick={() => select(index)}
            disabled={running}
            className="inline-flex items-center gap-2 rounded-full border border-white/15 px-3.5 py-1.5 text-xs font-medium text-fog-200 transition-colors hover:border-accent hover:text-accent disabled:opacity-40"
          >
            {total ? (
              <RotateCcw className="size-3.5" aria-hidden="true" />
            ) : (
              <Play className="size-3.5" aria-hidden="true" />
            )}
            {total ? "Run again" : "Run workflow"}
          </button>
        </div>

        <div className="h-0.5 bg-white/[0.05]" aria-hidden="true">
          <div
            className="h-full bg-accent transition-[width] duration-500 ease-[var(--ease-out-expo)]"
            style={{ width: `${progress}%` }}
          />
        </div>

        <ol className="relative px-5 py-6 sm:px-7">
          {scenario.steps.map((step, i) => {
            const st = states[i] ?? { status: "idle" };
            return (
              <li key={`${scenario.slug}-${i}`} className="relative flex gap-4 pb-5 last:pb-0">
                {i < scenario.steps.length - 1 && (
                  <span
                    aria-hidden="true"
                    className={cn(
                      "absolute top-10 left-[1.05rem] h-[calc(100%-2.25rem)] w-px transition-colors duration-500",
                      st.status === "done" ? "bg-accent/60" : "bg-white/10",
                    )}
                  />
                )}
                <span
                  className={cn(
                    "relative grid size-[2.15rem] shrink-0 place-items-center rounded-full border transition-all duration-500",
                    st.status === "done" && "border-accent bg-accent text-ink-950",
                    st.status === "running" && "border-accent text-accent shadow-[0_0_24px_-2px_rgba(255,90,31,0.7)]",
                    st.status === "idle" && "border-white/15 text-fog-500",
                  )}
                >
                  {st.status === "done" ? (
                    <Check className="size-4" strokeWidth={2.5} aria-hidden="true" />
                  ) : st.status === "running" ? (
                    <span
                      className="size-4 animate-[spin_0.8s_linear_infinite] rounded-full border-2 border-accent border-t-transparent"
                      aria-hidden="true"
                    />
                  ) : (
                    <Icon name={step.icon} className="size-4" />
                  )}
                </span>
                <div className="flex min-w-0 flex-1 flex-wrap items-start justify-between gap-x-4 gap-y-1 pt-1">
                  <div className="min-w-0">
                    <p
                      className={cn(
                        "font-medium transition-colors duration-500",
                        st.status === "idle" ? "text-fog-400" : "text-fog-100",
                      )}
                    >
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-sm text-fog-400">{step.detail}</p>
                  </div>
                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="rounded-full border border-white/10 px-2 py-0.5 font-mono text-[0.62rem] tracking-wider text-fog-400 uppercase">
                      {step.tool}
                    </span>
                    <span className="w-14 text-right font-mono text-xs text-fog-300 tabular-nums">
                      {st.status === "done" ? `${(st.ms! / 1000).toFixed(2)}s` : st.status === "running" ? "…" : ""}
                    </span>
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        <div className="grid border-t border-white/[0.07] sm:grid-cols-3">
          <div className="border-b border-white/[0.07] px-5 py-4 sm:border-r sm:border-b-0 sm:px-7">
            <p className="text-[0.68rem] tracking-[0.14em] text-fog-500 uppercase">Automated</p>
            <p className="mt-1 font-mono text-xl text-fog-100 tabular-nums">
              {total ? `${(total / 1000).toFixed(1)}s` : "—"}
            </p>
          </div>
          <div className="border-b border-white/[0.07] px-5 py-4 sm:border-r sm:border-b-0 sm:px-7">
            <p className="text-[0.68rem] tracking-[0.14em] text-fog-500 uppercase">Done by hand</p>
            <p className="mt-1 font-mono text-xl text-fog-100 tabular-nums">~{scenario.manualMinutes} min</p>
          </div>
          <div className="px-5 py-4 sm:px-7">
            <p className="text-[0.68rem] tracking-[0.14em] text-fog-500 uppercase">Faster</p>
            <p
              className={cn(
                "mt-1 font-mono text-xl tabular-nums transition-colors",
                total ? "text-accent" : "text-fog-100",
              )}
            >
              {total ? `${speedup.toLocaleString("en-US")}×` : "—"}
            </p>
          </div>
        </div>
        <p className="sr-only" aria-live="polite">
          {total ? `${scenario.name} completed in ${(total / 1000).toFixed(1)} seconds.` : ""}
        </p>
        {showLink && (
          <Link
            href={`/solutions/${scenario.slug}`}
            className="group flex items-center justify-between border-t border-white/[0.07] px-5 py-4 text-sm text-fog-300 transition-colors hover:text-fog-100 sm:px-7"
          >
            See how we build “{scenario.name}”
            <ArrowUpRight
              className="size-4 transition-transform duration-500 group-hover:rotate-45"
              aria-hidden="true"
            />
          </Link>
        )}
      </div>
    </div>
  );
}
