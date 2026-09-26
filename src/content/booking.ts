import { site } from "./site";

/**
 * Booking rules for the "Book a call" calendar. Times are interpreted in the
 * studio time zone (`site.timeZone`); visitors see them in their own zone.
 */
export const booking = {
  meeting: {
    id: "strategy-call",
    name: "Free strategy call",
    durationMinutes: 30,
    location: "Video call",
    description:
      "A focused 30-minute conversation about your goals, your current setup and the fastest way to get results.",
  },
  timeZone: site.timeZone,
  /** Bookable windows per weekday (0 = Sunday), in studio local time. */
  weeklyHours: {
    1: [["09:00", "17:00"]],
    2: [["09:00", "17:00"]],
    3: [["09:00", "17:00"]],
    4: [["09:00", "17:00"]],
    5: [["09:00", "15:00"]],
  } as Record<number, [string, string][]>,
  slotIntervalMinutes: 30,
  /** Earliest bookable time, measured from now. */
  minimumNoticeHours: 12,
  /** How far ahead visitors can book. */
  maxDaysAhead: 30,
  /** Dates (YYYY-MM-DD, studio time) that can't be booked, e.g. holidays. */
  blackoutDates: [] as string[],
  topics: ["Website", "Web app / SaaS", "Automation", "AI agents", "Integrations", "Not sure yet"],
} as const;

export type BookingConfig = typeof booking;
