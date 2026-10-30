"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { BookingSkeleton } from "@/components/booking/booking-skeleton";
import { booking } from "@/content/booking";
import { site } from "@/content/site";
import { cn } from "@/lib/utils";

const SCRIPT_SRC = "https://focuspilot.online/embed.js";
/** Show the fallback links if the calendar hasn't appeared by then (blocked script, offline…). */
const LOAD_TIMEOUT_MS = 15_000;

/**
 * FocusPilot's inline booking calendar. embed.js fills the
 * `data-focuspilot-inline` element; a fresh copy runs on every mount so the
 * calendar also appears after client-side navigation.
 */
export function FocusPilotEmbed({ className }: { className?: string }) {
  const target = useRef<HTMLDivElement>(null);
  const [state, setState] = useState<"loading" | "ready" | "failed">("loading");

  useEffect(() => {
    const el = target.current;
    if (!el) return;

    const observer = new MutationObserver(() => {
      if (el.childElementCount > 0) {
        setState("ready");
        observer.disconnect();
      }
    });
    observer.observe(el, { childList: true });

    const script = document.createElement("script");
    script.src = SCRIPT_SRC;
    script.async = true;
    script.onerror = () => setState("failed");
    document.body.appendChild(script);

    const timeout = window.setTimeout(() => setState((s) => (s === "loading" ? "failed" : s)), LOAD_TIMEOUT_MS);

    return () => {
      observer.disconnect();
      window.clearTimeout(timeout);
      script.remove();
      el.replaceChildren();
    };
  }, []);

  return (
    <div
      className={cn(
        "surface relative overflow-hidden rounded-[2rem] bg-ink-900",
        state !== "ready" && "min-h-[36rem]",
        className,
      )}
    >
      <div ref={target} data-focuspilot-inline={booking.embedUrl} style={{ minWidth: 320 }} />

      {state === "loading" && (
        <div className="absolute inset-0" aria-busy="true">
          <BookingSkeleton />
          <p className="sr-only">Loading available times…</p>
        </div>
      )}

      {state === "failed" && (
        <div className="absolute inset-0 grid place-items-center p-8 text-center">
          <div>
            <p className="text-fog-200">The booking calendar didn&apos;t load here.</p>
            <div className="mt-5 flex flex-wrap justify-center gap-3">
              <a href={booking.embedUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary btn-sm">
                <span className="roll">
                  <span data-text="Open the booking page">Open the booking page</span>
                </span>
                <span className="btn-icon">
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </span>
              </a>
              <a href={`mailto:${site.email}?subject=Booking%20a%20call`} className="btn btn-ghost btn-sm">
                <span className="roll">
                  <span data-text="Email us instead">Email us instead</span>
                </span>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
