"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import { ArrowLeft, ArrowUpRight, Check, ChevronLeft, ChevronRight, Clock, Download, Globe, Video } from "lucide-react";
import { BookingSkeleton } from "@/components/booking/booking-skeleton";
import { topicOptions } from "@/content/forms";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";
import { useNow } from "@/lib/hooks";
import { getAttribution } from "@/lib/attribution";
import { buildIcs, googleCalendarUrl, outlookCalendarUrl } from "@/lib/booking/calendar";
import { dateKey, formatInZone, zonedParts } from "@/lib/time";
import { cn } from "@/lib/utils";

type Availability = {
  timeZone: string;
  meeting: { name: string; durationMinutes: number; location: string };
  slots: string[];
};

type Result = { start: string; end: string; location: string; meetingUrl?: string; emailSent: boolean };

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const LEAD_KEY = "dcc:lead";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function pad(n: number) {
  return String(n).padStart(2, "0");
}

function detectTimeZone() {
  try {
    return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  } catch {
    return "UTC";
  }
}

function allTimeZones(current: string) {
  let zones: string[] = [];
  try {
    zones = (Intl as unknown as { supportedValuesOf?: (k: string) => string[] }).supportedValuesOf?.("timeZone") ?? [];
  } catch {
    zones = [];
  }
  if (!zones.includes(current)) zones = [current, ...zones];
  if (!zones.includes("UTC")) zones.push("UTC");
  return zones;
}

export default function BookingWidget({ className }: { className?: string }) {
  const [avail, setAvail] = useState<Availability | null>(null);
  const [loadError, setLoadError] = useState(false);
  const [tz, setTz] = useState<string | null>(null);
  const [month, setMonth] = useState<{ y: number; m: number } | null>(null);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);
  const [step, setStep] = useState<"pick" | "details" | "done">("pick");

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [topics, setTopics] = useState<string[]>([]);
  const [notes, setNotes] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const [result, setResult] = useState<Result | null>(null);

  const now = useNow(60_000) ?? 0;
  const startedAt = useRef<number>(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const applyAvailability = useCallback((data: Availability, zone: string) => {
    setAvail(data);
    const first = data.slots[0];
    const ref = zonedParts(first ?? Date.now(), zone);
    setMonth({ y: ref.year, m: ref.month });
    setSelectedDate(first ? dateKey(first, zone) : null);
  }, []);

  const load = useCallback(
    async (zone?: string) => {
      setLoadError(false);
      try {
        const res = await fetch("/api/availability", { cache: "no-store" });
        if (!res.ok) throw new Error(String(res.status));
        const data = (await res.json()) as Availability;
        const z = zone ?? detectTimeZone();
        setTz(z);
        applyAvailability(data, z);
      } catch {
        setLoadError(true);
      }
    },
    [applyAvailability],
  );

  useEffect(() => {
    startedAt.current = Date.now();
    let cancelled = false;
    (async () => {
      await load();
      if (cancelled) return;
      // Prefill from an earlier enquiry or from the URL.
      try {
        const params = new URLSearchParams(window.location.search);
        const saved = JSON.parse(sessionStorage.getItem(LEAD_KEY) ?? "{}") as Record<string, string>;
        setName(params.get("name") ?? saved.name ?? "");
        setEmail(params.get("email") ?? saved.email ?? "");
        setCompany(saved.company ?? "");
      } catch {
        // Ignore unavailable storage.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [load]);

  const slotsByDate = useMemo(() => {
    const map = new Map<string, string[]>();
    if (!avail || !tz) return map;
    for (const s of avail.slots) {
      const key = dateKey(s, tz);
      const list = map.get(key);
      if (list) list.push(s);
      else map.set(key, [s]);
    }
    return map;
  }, [avail, tz]);

  const zones = useMemo(() => (tz ? allTimeZones(tz) : []), [tz]);

  const changeTz = (zone: string) => {
    setTz(zone);
    if (avail) {
      const keys = new Set(avail.slots.map((s) => dateKey(s, zone)));
      const keep = selectedDate && keys.has(selectedDate);
      if (!keep) {
        const first = avail.slots[0];
        setSelectedDate(first ? dateKey(first, zone) : null);
        if (first) {
          const p = zonedParts(first, zone);
          setMonth({ y: p.year, m: p.month });
        }
      }
    }
  };

  const scrollIntoView = () => {
    const el = rootRef.current;
    if (!el) return;
    const top = el.getBoundingClientRect().top;
    if (top < 0) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const pickSlot = (slot: string) => {
    setSelectedSlot(slot);
    setNotice(null);
    setStep("details");
    track("booking_slot_selected", { slot });
    requestAnimationFrame(() => {
      scrollIntoView();
      (name ? emailRef : nameRef).current?.focus({ preventScroll: true });
    });
  };

  const toggleTopic = (t: string) =>
    setTopics((prev) => (prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t]));

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedSlot || !tz) return;
    const nextErrors: Record<string, string> = {};
    if (name.trim().length < 2) nextErrors.name = "Please enter your name.";
    if (!EMAIL_RE.test(email.trim())) nextErrors.email = "Please enter a valid email address.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      (nextErrors.name ? nameRef : emailRef).current?.focus();
      return;
    }

    setSubmitting(true);
    setNotice(null);
    try {
      const res = await fetch("/api/booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          start: selectedSlot,
          timeZone: tz,
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          topics,
          notes: notes.trim(),
          website: honeypot.current?.value ?? "",
          startedAt: startedAt.current || undefined,
          page: window.location.pathname,
          attribution: getAttribution(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        code?: string;
        fields?: Record<string, string>;
        booking?: { start: string; end?: string; location?: string; meetingUrl?: string };
        emailSent?: boolean;
      };

      if (res.ok && data.ok) {
        const start = data.booking?.start ?? selectedSlot;
        const end =
          data.booking?.end ??
          new Date(new Date(start).getTime() + (avail?.meeting.durationMinutes ?? 30) * 60000).toISOString();
        setResult({
          start,
          end,
          location: data.booking?.location ?? avail?.meeting.location ?? "Video call",
          meetingUrl: data.booking?.meetingUrl,
          emailSent: Boolean(data.emailSent),
        });
        setStep("done");
        track("book_appointment", { meeting: avail?.meeting.name ?? "call", topics: topics.join(",") });
        try {
          sessionStorage.setItem(
            LEAD_KEY,
            JSON.stringify({ name: name.trim(), email: email.trim(), company: company.trim() }),
          );
        } catch {
          // Ignore unavailable storage.
        }
        requestAnimationFrame(scrollIntoView);
        return;
      }

      if (res.status === 409) {
        setNotice(data.error ?? "That time is no longer available. Please pick another.");
        setSelectedSlot(null);
        setStep("pick");
        await load(tz);
        return;
      }
      if (data.fields) setErrors(data.fields);
      setNotice(data.error ?? "Something went wrong. Please try again.");
    } catch {
      setNotice("We couldn't reach the server. Check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const downloadIcs = () => {
    if (!result || !avail) return;
    const ics = buildIcs({
      uid: `${new Date(result.start).getTime()}@${new URL(site.url).host}`,
      start: new Date(result.start),
      end: new Date(result.end),
      title: `${avail.meeting.name} · ${site.name}`,
      description: `${avail.meeting.name} with ${site.name}${result.meetingUrl ? `\n\nJoin: ${result.meetingUrl}` : ""}`,
      location: result.meetingUrl ?? result.location,
    });
    const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "delta-creation-call.ics";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  /* ---------------------------------------------------------------- */

  const header = (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-5 py-4 sm:px-7">
      <div className="flex items-center gap-3">
        <span className="grid size-10 place-items-center rounded-xl bg-accent text-ink-950">
          <Video className="size-[18px]" aria-hidden="true" />
        </span>
        <div>
          <p className="leading-tight font-medium text-fog-100">{avail?.meeting.name ?? "Free strategy call"}</p>
          <p className="mt-0.5 flex items-center gap-3 text-xs text-fog-400">
            <span className="inline-flex items-center gap-1">
              <Clock className="size-3" aria-hidden="true" /> {avail?.meeting.durationMinutes ?? 30} min
            </span>
            <span>{avail?.meeting.location ?? "Video call"}</span>
          </p>
        </div>
      </div>
      <ol className="flex items-center gap-1.5" aria-label="Booking steps">
        {["Time", "Details", "Done"].map((label, i) => {
          const current = ["pick", "details", "done"].indexOf(step);
          return (
            <li key={label} className="flex items-center gap-1.5">
              {i > 0 && <span className="h-px w-3 bg-white/15" aria-hidden="true" />}
              <span
                className={cn(
                  "rounded-full px-2.5 py-1 font-mono text-[0.62rem] tracking-[0.12em] uppercase transition-colors",
                  i === current ? "bg-fog-100 text-ink-950" : i < current ? "text-accent" : "text-fog-500",
                )}
                aria-current={i === current ? "step" : undefined}
              >
                {label}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );

  if (loadError) {
    return (
      <div ref={rootRef} className={cn("surface overflow-hidden rounded-[2rem] bg-ink-900", className)}>
        {header}
        <div className="p-8 text-center">
          <p className="text-fog-200">We couldn&apos;t load available times.</p>
          <div className="mt-5 flex flex-wrap justify-center gap-3">
            <button type="button" onClick={() => load()} className="btn btn-ghost btn-sm">
              <span className="roll">
                <span data-text="Try again">Try again</span>
              </span>
            </button>
            <a href={`mailto:${site.email}?subject=Booking%20a%20call`} className="btn btn-primary btn-sm">
              <span className="roll">
                <span data-text="Email us instead">Email us instead</span>
              </span>
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!avail || !tz || !month) {
    return (
      <div
        ref={rootRef}
        className={cn("surface overflow-hidden rounded-[2rem] bg-ink-900", className)}
        aria-busy="true"
      >
        {header}
        <BookingSkeleton />
      </div>
    );
  }

  const today = zonedParts(now, tz);
  const daysInMonth = new Date(Date.UTC(month.y, month.m, 0)).getUTCDate();
  const offset = (new Date(Date.UTC(month.y, month.m - 1, 1)).getUTCDay() + 6) % 7;
  const lastSlot = avail.slots[avail.slots.length - 1];
  const last = lastSlot ? zonedParts(lastSlot, tz) : today;
  const canPrev = month.y > today.year || (month.y === today.year && month.m > today.month);
  const canNext = month.y < last.year || (month.y === last.year && month.m < last.month);
  const todayKey = dateKey(now, tz);
  const daySlots = selectedDate ? (slotsByDate.get(selectedDate) ?? []) : [];

  const shiftMonth = (delta: number) => {
    const d = new Date(Date.UTC(month.y, month.m - 1 + delta, 1));
    setMonth({ y: d.getUTCFullYear(), m: d.getUTCMonth() + 1 });
  };

  const longDate = (iso: string) => formatInZone(iso, tz, { weekday: "long", month: "long", day: "numeric" });
  const keyLabel = (key: string) => {
    const [y, m, d] = key.split("-").map(Number);
    return formatInZone(Date.UTC(y, m - 1, d, 12), "UTC", { weekday: "long", month: "long", day: "numeric" });
  };
  const time = (iso: string, zone = tz) => formatInZone(iso, zone, { hour: "numeric", minute: "2-digit" });

  return (
    <div
      ref={rootRef}
      className={cn("surface @container relative scroll-mt-28 overflow-hidden rounded-[2rem] bg-ink-900", className)}
    >
      {header}

      {notice && step !== "done" && (
        <p role="alert" className="border-b border-accent/30 bg-accent/10 px-5 py-3 text-sm text-accent-300 sm:px-7">
          {notice}
        </p>
      )}

      {step === "pick" && (
        <div className="grid gap-0 @2xl:grid-cols-[1.15fr_0.85fr]">
          <div className="p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <p className="text-lg font-medium tracking-tight" aria-live="polite">
                {MONTHS[month.m - 1]} {month.y}
              </p>
              <div className="flex gap-1.5">
                <button
                  type="button"
                  onClick={() => shiftMonth(-1)}
                  disabled={!canPrev}
                  aria-label="Previous month"
                  className="grid size-9 place-items-center rounded-full border border-white/10 text-fog-200 transition-colors hover:border-white/30 disabled:opacity-30"
                >
                  <ChevronLeft className="size-4" aria-hidden="true" />
                </button>
                <button
                  type="button"
                  onClick={() => shiftMonth(1)}
                  disabled={!canNext}
                  aria-label="Next month"
                  className="grid size-9 place-items-center rounded-full border border-white/10 text-fog-200 transition-colors hover:border-white/30 disabled:opacity-30"
                >
                  <ChevronRight className="size-4" aria-hidden="true" />
                </button>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-7 gap-1 text-center" role="group" aria-label="Choose a date">
              {WEEKDAYS.map((d) => (
                <span
                  key={d}
                  className="pb-2 font-mono text-[0.65rem] tracking-wider text-fog-500 uppercase"
                  aria-hidden="true"
                >
                  {d}
                </span>
              ))}
              {Array.from({ length: offset }).map((_, i) => (
                <span key={`b${i}`} aria-hidden="true" />
              ))}
              {Array.from({ length: daysInMonth }).map((_, i) => {
                const day = i + 1;
                const key = `${month.y}-${pad(month.m)}-${pad(day)}`;
                const count = slotsByDate.get(key)?.length ?? 0;
                const selected = key === selectedDate;
                return (
                  <button
                    key={key}
                    type="button"
                    disabled={count === 0}
                    aria-pressed={selected}
                    aria-label={`${MONTHS[month.m - 1]} ${day}${count ? `, ${count} times available` : ", unavailable"}`}
                    onClick={() => setSelectedDate(key)}
                    className={cn(
                      "relative mx-auto grid aspect-square w-full max-w-11 place-items-center rounded-full text-sm tabular-nums transition-all duration-300",
                      count === 0 && "text-fog-500/60",
                      count > 0 && !selected && "bg-white/[0.06] font-medium text-fog-100 hover:bg-white/[0.12]",
                      selected && "bg-accent font-semibold text-ink-950",
                    )}
                  >
                    {day}
                    {key === todayKey && (
                      <span
                        className={cn("absolute bottom-1.5 size-1 rounded-full", selected ? "bg-ink-950" : "bg-accent")}
                        aria-hidden="true"
                      />
                    )}
                  </button>
                );
              })}
            </div>

            <label className="mt-6 flex items-center gap-2 text-xs text-fog-400">
              <Globe className="size-3.5 shrink-0" aria-hidden="true" />
              <span className="sr-only">Time zone</span>
              <select
                value={tz}
                onChange={(e) => changeTz(e.target.value)}
                className="min-w-0 flex-1 cursor-pointer truncate rounded-lg bg-transparent py-1 text-fog-200 outline-none hover:text-fog-100 focus-visible:outline-2 focus-visible:outline-accent"
              >
                {zones.map((z) => (
                  <option key={z} value={z} className="bg-ink-800">
                    {z.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="border-t border-white/[0.07] p-5 sm:p-7 @2xl:border-t-0 @2xl:border-l">
            <p className="text-sm text-fog-300">{selectedDate ? keyLabel(selectedDate) : "Select a date"}</p>
            {daySlots.length > 0 ? (
              <ul
                className="mt-4 grid max-h-[21rem] grid-cols-2 gap-2 overflow-y-auto pr-1 @2xl:grid-cols-1"
                data-lenis-prevent
              >
                {daySlots.map((s) => (
                  <li key={s}>
                    <button
                      type="button"
                      onClick={() => pickSlot(s)}
                      className="group flex w-full items-center justify-between rounded-xl border border-white/10 px-4 py-3 text-sm font-medium text-fog-100 tabular-nums transition-all duration-300 hover:border-accent hover:bg-accent hover:text-ink-950"
                    >
                      {time(s)}
                      <ArrowUpRight
                        className="size-4 opacity-0 transition-all duration-300 group-hover:opacity-100"
                        aria-hidden="true"
                      />
                    </button>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="mt-4 text-sm text-fog-500">
                {avail.slots.length
                  ? "No times on this day. Pick a highlighted date."
                  : "No times are available right now."}
              </p>
            )}
          </div>
        </div>
      )}

      {step === "details" && selectedSlot && (
        <form onSubmit={submit} noValidate className="p-5 sm:p-7">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div>
              <p className="font-medium text-fog-100">{longDate(selectedSlot)}</p>
              <p className="mt-0.5 text-sm text-fog-400">
                {time(selectedSlot)} –{" "}
                {time(new Date(new Date(selectedSlot).getTime() + avail.meeting.durationMinutes * 60000).toISOString())}{" "}
                · {tz.replace(/_/g, " ")}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setStep("pick")}
              className="inline-flex items-center gap-1.5 text-sm text-fog-300 hover:text-fog-100"
            >
              <ArrowLeft className="size-4" aria-hidden="true" /> Change
            </button>
          </div>

          <div className="mt-6 grid gap-5 @xl:grid-cols-2">
            <div>
              <label htmlFor="bk-name" className="field-label">
                Your name *
              </label>
              <input
                ref={nameRef}
                id="bk-name"
                className="field"
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "bk-name-err" : undefined}
                required
              />
              {errors.name && (
                <p id="bk-name-err" className="field-error">
                  {errors.name}
                </p>
              )}
            </div>
            <div>
              <label htmlFor="bk-email" className="field-label">
                Work email *
              </label>
              <input
                ref={emailRef}
                id="bk-email"
                type="email"
                inputMode="email"
                className="field"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "bk-email-err" : undefined}
                required
              />
              {errors.email && (
                <p id="bk-email-err" className="field-error">
                  {errors.email}
                </p>
              )}
            </div>
            <div className="@xl:col-span-2">
              <label htmlFor="bk-company" className="field-label">
                Company <span className="text-fog-500">(optional)</span>
              </label>
              <input
                id="bk-company"
                className="field"
                autoComplete="organization"
                value={company}
                onChange={(e) => setCompany(e.target.value)}
              />
            </div>
          </div>

          <fieldset className="mt-6">
            <legend className="field-label">What would you like to discuss?</legend>
            <div className="flex flex-wrap gap-2">
              {topicOptions.map((t) => (
                <label key={t} className="chip">
                  <input type="checkbox" checked={topics.includes(t)} onChange={() => toggleTopic(t)} />
                  {topics.includes(t) && <Check className="size-3.5" aria-hidden="true" />}
                  {t}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="mt-6">
            <label htmlFor="bk-notes" className="field-label">
              Anything we should know beforehand? <span className="text-fog-500">(optional)</span>
            </label>
            <textarea
              id="bk-notes"
              rows={3}
              className="field resize-y"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={2000}
              placeholder="Goals, current tools, links…"
            />
          </div>

          <div aria-hidden="true" className="absolute top-auto left-[-9999px] h-px w-px overflow-hidden">
            <label htmlFor="bk-website">Website</label>
            <input ref={honeypot} id="bk-website" name="website" tabIndex={-1} autoComplete="off" />
          </div>

          <div className="mt-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs text-fog-500">
              By booking you agree to our{" "}
              <a href="/privacy" className="underline underline-offset-2 hover:text-fog-300">
                privacy policy
              </a>
              .
            </p>
            <button type="submit" className="btn btn-primary" disabled={submitting}>
              <span className="roll">
                <span data-text={submitting ? "Booking…" : "Confirm booking"}>
                  {submitting ? "Booking…" : "Confirm booking"}
                </span>
              </span>
              {submitting ? (
                <span
                  className="size-4 animate-[spin_0.8s_linear_infinite] rounded-full border-2 border-ink-950 border-t-transparent"
                  aria-hidden="true"
                />
              ) : (
                <span className="btn-icon">
                  <Check className="size-4" aria-hidden="true" />
                </span>
              )}
            </button>
          </div>
        </form>
      )}

      {step === "done" && result && (
        <div className="p-6 sm:p-9" role="status">
          <div className="flex flex-col items-start gap-6 @xl:flex-row @xl:items-center">
            <span className="grid size-16 shrink-0 place-items-center rounded-full bg-mint text-ink-950 shadow-[0_0_40px_-6px_rgba(79,240,176,0.8)]">
              <Check className="size-8" strokeWidth={2.5} aria-hidden="true" />
            </span>
            <div>
              <p className="text-h3 font-medium">You&apos;re booked{name ? `, ${name.trim().split(/\s+/)[0]}` : ""}!</p>
              <p className="mt-1 text-fog-300">
                {longDate(result.start)} · {time(result.start)} – {time(result.end)} ({tz.replace(/_/g, " ")})
              </p>
            </div>
          </div>

          <p className="mt-6 text-fog-300">
            {result.emailSent
              ? `A confirmation with a calendar invite is on its way to ${email}.`
              : "Add it to your calendar below. We'll be in touch before the call."}{" "}
            {result.meetingUrl ? (
              <>
                Join link:{" "}
                <a
                  href={result.meetingUrl}
                  className="text-accent underline underline-offset-2"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {result.meetingUrl}
                </a>
              </>
            ) : (
              "We'll send the video link before the call."
            )}
          </p>

          <div className="mt-7 flex flex-wrap gap-2.5">
            {(() => {
              const ev = {
                start: new Date(result.start),
                end: new Date(result.end),
                title: `${avail.meeting.name} · ${site.name}`,
                description: `${avail.meeting.name} with ${site.name}`,
                location: result.meetingUrl ?? result.location,
              };
              return (
                <>
                  <a
                    href={googleCalendarUrl(ev)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-secondary btn-sm"
                  >
                    <span className="roll">
                      <span data-text="Google Calendar">Google Calendar</span>
                    </span>
                  </a>
                  <a
                    href={outlookCalendarUrl(ev)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-ghost btn-sm"
                  >
                    <span className="roll">
                      <span data-text="Outlook">Outlook</span>
                    </span>
                  </a>
                  <button type="button" onClick={downloadIcs} className="btn btn-ghost btn-sm">
                    <Download className="size-4" aria-hidden="true" />
                    <span className="roll">
                      <span data-text=".ics file">.ics file</span>
                    </span>
                  </button>
                </>
              );
            })()}
          </div>

          <div className="mt-8 rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <p className="text-sm font-medium text-fog-100">Before the call</p>
            <ul className="mt-3 space-y-2 text-sm text-fog-400">
              <li>• Note your top goals for the next 6–12 months.</li>
              <li>• List the tools you use today (CRM, website platform, spreadsheets).</li>
              <li>• Think about where you lose the most time or leads.</li>
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
