"use client";

import { site } from "@/content/site";
import { useNow } from "@/lib/hooks";
import { cityFromTimeZone, formatInZone, zonedParts } from "@/lib/time";
import { cn } from "@/lib/utils";

export function isStudioOpen(now: number) {
  const p = zonedParts(now, site.timeZone);
  return (
    (site.hours.days as readonly number[]).includes(p.weekday) && p.hour >= site.hours.start && p.hour < site.hours.end
  );
}

/** Live studio time with an online/offline indicator. */
export function StudioClock({ className, showStatus = true }: { className?: string; showStatus?: boolean }) {
  const now = useNow(1000);
  const open = now !== null && isStudioOpen(now);
  const time =
    now === null
      ? "--:--:--"
      : formatInZone(now, site.timeZone, { hour: "2-digit", minute: "2-digit", second: "2-digit", hourCycle: "h23" });

  return (
    <div className={cn("flex flex-col gap-1.5", className)}>
      <p className="flex items-center gap-2 font-mono text-xs tracking-[0.14em] text-fog-400 uppercase">
        Studio time · {cityFromTimeZone(site.timeZone)}
      </p>
      <p className="font-mono text-2xl tracking-tight text-fog-100 tabular-nums" aria-live="off">
        {time}
      </p>
      {showStatus && (
        <p className="flex items-center gap-2 text-sm text-fog-300">
          <span className="live-dot" data-state={open ? "online" : "offline"} aria-hidden="true" />
          {now === null ? "Checking availability…" : open ? "Online now" : `Offline · we reply ${site.responseTime}`}
        </p>
      )}
    </div>
  );
}
