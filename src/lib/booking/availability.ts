import { booking } from "@/content/booking";
import { zonedParts, zonedTimeToUtc } from "@/lib/time";

export type Interval = { start: number; end: number };
export type Slot = { start: string; end: string };

const MINUTE = 60_000;
const HOUR = 60 * MINUTE;
const DAY = 24 * HOUR;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function parseHm(hm: string) {
  const [h, m] = hm.split(":").map(Number);
  return { h, m };
}

/**
 * Every bookable slot from now until `booking.maxDaysAhead`, generated from
 * the weekly working hours in the studio time zone and excluding `busy`
 * intervals. Returns UTC ISO strings.
 */
export function computeSlots({ now = Date.now(), busy = [] as Interval[] } = {}): Slot[] {
  const tz = booking.timeZone;
  const duration = booking.meeting.durationMinutes * MINUTE;
  const step = booking.slotIntervalMinutes * MINUTE;
  const earliest = now + booking.minimumNoticeHours * HOUR;
  const latest = now + booking.maxDaysAhead * DAY;
  const today = zonedParts(now, tz);
  const slots: Slot[] = [];

  for (let d = 0; d <= booking.maxDaysAhead + 1; d++) {
    // Walk calendar days in the studio time zone.
    const date = new Date(Date.UTC(today.year, today.month - 1, today.day + d));
    const y = date.getUTCFullYear();
    const m = date.getUTCMonth() + 1;
    const day = date.getUTCDate();
    if ((booking.blackoutDates as readonly string[]).includes(`${y}-${pad(m)}-${pad(day)}`)) continue;

    for (const [from, to] of booking.weeklyHours[date.getUTCDay()] ?? []) {
      const f = parseHm(from);
      const t = parseHm(to);
      const windowEnd = zonedTimeToUtc(y, m, day, t.h, t.m, tz).getTime();
      for (
        let cursor = zonedTimeToUtc(y, m, day, f.h, f.m, tz).getTime();
        cursor + duration <= windowEnd;
        cursor += step
      ) {
        const end = cursor + duration;
        if (cursor < earliest || cursor > latest) continue;
        if (busy.some((b) => cursor < b.end && end > b.start)) continue;
        slots.push({ start: new Date(cursor).toISOString(), end: new Date(end).toISOString() });
      }
    }
  }

  return slots;
}

export function findSlot(startIso: string, busy: Interval[] = [], now = Date.now()) {
  const target = new Date(startIso).getTime();
  if (Number.isNaN(target)) return undefined;
  return computeSlots({ now, busy }).find((s) => new Date(s.start).getTime() === target);
}
