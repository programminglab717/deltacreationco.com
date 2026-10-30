"use client";

import { useEffect, useRef, useState } from "react";
import { BookingShell } from "@/components/booking/booking-skeleton";
import { FocusPilotEmbed } from "@/components/booking/focuspilot-embed";

/**
 * Loads the booking calendar only when it's about to scroll into view
 * (or immediately with `eager`), keeping it out of the initial page load.
 */
export function BookingLazy({ eager = false, className }: { eager?: boolean; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const show = eager || visible;

  useEffect(() => {
    if (show || !ref.current) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { rootMargin: "800px 0px" },
    );
    io.observe(ref.current);
    return () => io.disconnect();
  }, [show]);

  return (
    <div ref={ref} id="book" className={className}>
      {show ? <FocusPilotEmbed /> : <BookingShell />}
    </div>
  );
}
