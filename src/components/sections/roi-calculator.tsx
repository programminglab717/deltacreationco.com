"use client";

import { useId, useMemo, useState, type CSSProperties } from "react";
import { AnimatedNumber } from "@/components/motion/animated-number";
import { ButtonLink } from "@/components/ui/button";
import { track } from "@/lib/analytics";

const WORK_WEEKS = 48;
const FTE_HOURS = 1800;

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  format: (v: number) => string;
  onChange: (v: number) => void;
  hint?: string;
};

function Slider({ label, value, min, max, step = 1, format, onChange, hint }: SliderProps) {
  const id = useId();
  const fill = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <div className="mb-3 flex items-baseline justify-between gap-4">
        <label htmlFor={id} className="text-sm text-fog-200">
          {label}
        </label>
        <output htmlFor={id} className="font-mono text-lg text-fog-100 tabular-nums">
          {format(value)}
        </output>
      </div>
      <input
        id={id}
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="range"
        style={{ "--fill": `${fill}%` } as CSSProperties}
        aria-valuetext={format(value)}
      />
      {hint && <p className="mt-2 text-xs text-fog-500">{hint}</p>}
    </div>
  );
}

function capacityLabel(hours: number) {
  const fte = hours / FTE_HOURS;
  if (fte < 0.1) return `about ${Math.max(1, Math.round(hours / 40))} full work weeks`;
  if (fte < 0.95) return `about ${Math.round(fte * 100)}% of a full-time role`;
  const rounded = Math.round(fte * 10) / 10;
  return `the equivalent of ${rounded} full-time ${rounded === 1 ? "role" : "roles"}`;
}

/** Interactive estimate of what manual, repetitive work costs per year. */
export function RoiCalculator() {
  const [people, setPeople] = useState(4);
  const [hours, setHours] = useState(8);
  const [rate, setRate] = useState(45);
  const [share, setShare] = useState(60);

  const result = useMemo(() => {
    const manualHours = people * hours * WORK_WEEKS;
    const savedHours = Math.round(manualHours * (share / 100));
    const savings = savedHours * rate;
    return {
      manualHours,
      savedHours,
      savings,
      manualCost: manualHours * rate,
    };
  }, [people, hours, rate, share]);

  const href = `/contact?interest=automation&source=roi&hours=${result.savedHours}&savings=${result.savings}`;
  const savedPct = result.manualCost ? (result.savings / result.manualCost) * 100 : 0;

  return (
    <div className="surface grid overflow-hidden rounded-[2rem] lg:grid-cols-2">
      <div className="flex flex-col gap-9 p-7 sm:p-10">
        <Slider
          label="People doing repetitive work"
          value={people}
          min={1}
          max={50}
          format={(v) => `${v}`}
          onChange={setPeople}
        />
        <Slider
          label="Hours each spends on it per week"
          value={hours}
          min={1}
          max={30}
          format={(v) => `${v}h`}
          onChange={setHours}
          hint="Data entry, copy-paste, reports, follow-ups, scheduling…"
        />
        <Slider
          label="Average hourly cost"
          value={rate}
          min={15}
          max={150}
          step={5}
          format={(v) => `$${v}`}
          onChange={setRate}
          hint="Salary plus overheads, per hour."
        />
        <Slider
          label="Share that could be automated"
          value={share}
          min={20}
          max={90}
          step={5}
          format={(v) => `${v}%`}
          onChange={setShare}
          hint="Most rules-based digital work can be largely automated."
        />
      </div>

      <div className="relative flex flex-col justify-between gap-10 overflow-hidden border-t border-white/[0.07] bg-[radial-gradient(ellipse_at_top_right,rgba(255,90,31,0.18),transparent_60%)] p-7 sm:p-10 lg:border-t-0 lg:border-l">
        <div>
          <p className="eyebrow eyebrow-plain">Estimated annual savings</p>
          <p className="mt-4 text-[clamp(3rem,7vw,5.5rem)] leading-none font-medium tracking-[-0.05em] text-fog-100">
            <AnimatedNumber value={result.savings} prefix="$" duration={700} />
          </p>
          <p className="mt-4 text-fog-300" aria-live="polite">
            That&apos;s{" "}
            <strong className="font-medium text-fog-100">{result.savedHours.toLocaleString("en-US")} hours</strong> a
            year back for your team:{" "}
            <strong className="font-medium text-fog-100">{capacityLabel(result.savedHours)}</strong>.
          </p>
        </div>

        <div className="space-y-4" aria-hidden="true">
          <div>
            <div className="mb-2 flex justify-between text-xs text-fog-400">
              <span>Cost of manual work today</span>
              <span className="font-mono">${result.manualCost.toLocaleString("en-US")}</span>
            </div>
            <div className="h-3 rounded-full bg-white/10" />
          </div>
          <div>
            <div className="mb-2 flex justify-between text-xs text-fog-400">
              <span>Recovered with automation</span>
              <span className="font-mono text-accent">${result.savings.toLocaleString("en-US")}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-white/[0.04]">
              <div
                className="h-full rounded-full bg-gradient-to-r from-accent-600 to-accent-300 transition-[width] duration-700 ease-[var(--ease-out-expo)]"
                style={{ width: `${savedPct}%` }}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <ButtonLink
            href={href}
            icon
            size="lg"
            className="w-full sm:w-auto"
            onClick={() => track("roi_cta_click", { hours: result.savedHours, savings: result.savings })}
          >
            Get my automation roadmap
          </ButtonLink>
          <p className="text-xs leading-relaxed text-fog-500">
            Illustrative estimate based on {WORK_WEEKS} working weeks a year. Your real numbers depend on your
            processes, which is exactly what we map in a free call.
          </p>
        </div>
      </div>
    </div>
  );
}
