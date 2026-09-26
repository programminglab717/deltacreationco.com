import "server-only";

import type { Interval } from "@/lib/booking/availability";

/**
 * Short-lived record of slots booked through this server instance, so the
 * same time can't be booked twice in quick succession. The FocusPilot task
 * list remains the source of truth for the schedule.
 */
const booked = new Map<number, number>();

function prune() {
  const now = Date.now();
  for (const [start, end] of booked) if (end < now) booked.delete(start);
}

export function bookedIntervals(): Interval[] {
  prune();
  return [...booked].map(([start, end]) => ({ start, end }));
}

export function reserve(start: number, end: number) {
  prune();
  for (const [s, e] of booked) if (start < e && end > s) return false;
  booked.set(start, end);
  return true;
}

export function release(start: number) {
  booked.delete(start);
}
