/**
 * Time-zone helpers built on Intl, shared by the server (availability) and the
 * browser (calendar UI). No date library required.
 */

const dtfCache = new Map<string, Intl.DateTimeFormat>();

function partsFormatter(timeZone: string) {
  let dtf = dtfCache.get(timeZone);
  if (!dtf) {
    dtf = new Intl.DateTimeFormat("en-US", {
      timeZone,
      hourCycle: "h23",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      weekday: "short",
    });
    dtfCache.set(timeZone, dtf);
  }
  return dtf;
}

const WEEKDAYS: Record<string, number> = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

export type ZonedParts = {
  year: number;
  month: number;
  day: number;
  hour: number;
  minute: number;
  second: number;
  weekday: number;
};

type DateInput = Date | number | string;

function toDate(date: DateInput) {
  return date instanceof Date ? date : new Date(date);
}

/** Wall-clock parts of an instant in a given time zone. */
export function zonedParts(date: DateInput, timeZone: string): ZonedParts {
  const parts = partsFormatter(timeZone).formatToParts(toDate(date));
  const map: Record<string, string> = {};
  for (const p of parts) map[p.type] = p.value;
  return {
    year: Number(map.year),
    month: Number(map.month),
    day: Number(map.day),
    hour: Number(map.hour) % 24,
    minute: Number(map.minute),
    second: Number(map.second),
    weekday: WEEKDAYS[map.weekday] ?? 0,
  };
}

export function formatInZone(date: DateInput, timeZone: string, opts: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", { timeZone, ...opts }).format(toDate(date));
}

export function cityFromTimeZone(timeZone: string) {
  return (timeZone.split("/").pop() ?? timeZone).replace(/_/g, " ");
}
