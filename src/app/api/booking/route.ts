import { after } from "next/server";
import { booking } from "@/content/booking";
import { site } from "@/content/site";
import { findSlot } from "@/lib/booking/availability";
import { buildIcs, googleCalendarUrl, outlookCalendarUrl } from "@/lib/booking/calendar";
import { bookedIntervals, release, reserve } from "@/lib/booking/store";
import { isEmailConfigured, ownerAddress, publicReplyAddress, sendEmail } from "@/lib/email";
import { bookingConfirmation, bookingOwnerNotification } from "@/lib/email-templates";
import { createMeetingTask, isFocusPilotConfigured } from "@/lib/focuspilot";
import { clientIp, isSameOrigin, json, rateLimit, readJson, spamReason } from "@/lib/guard";
import { formatInZone, isValidTimeZone } from "@/lib/time";
import { bookingSchema, fieldErrors } from "@/lib/validation";

export const dynamic = "force-dynamic";

const WHEN: Intl.DateTimeFormatOptions = {
  weekday: "long",
  month: "long",
  day: "numeric",
  year: "numeric",
  hour: "numeric",
  minute: "2-digit",
  timeZoneName: "short",
};

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return json({ ok: false, error: "Forbidden." }, 403);

  const limit = rateLimit(`booking:${clientIp(req)}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return json({ ok: false, error: "Too many booking attempts. Please try again in a few minutes." }, 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  const body = await readJson(req);
  if (!body.ok) return json({ ok: false, error: body.error }, body.status);

  const parsed = bookingSchema.safeParse(body.data);
  if (!parsed.success) {
    return json({ ok: false, error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) }, 400);
  }
  const d = parsed.data;
  const visitorTz = isValidTimeZone(d.timeZone) ? d.timeZone : "UTC";

  const spam = spamReason({ website: d.website, startedAt: d.startedAt, text: d.notes });
  if (spam) {
    console.warn(`[booking] dropped submission (${spam})`);
    return json({ ok: true, booking: { start: d.start }, emailSent: false });
  }

  const slot = findSlot(d.start, bookedIntervals());
  if (!slot) {
    return json(
      {
        ok: false,
        code: "slot_unavailable",
        error: "Sorry, that time is no longer available. Please choose another slot.",
      },
      409,
    );
  }
  const start = new Date(slot.start);
  const end = new Date(slot.end);
  if (!reserve(start.getTime(), end.getTime())) {
    return json(
      { ok: false, code: "slot_unavailable", error: "Someone just booked that time. Please choose another slot." },
      409,
    );
  }

  const meeting = booking.meeting;
  const meetingUrl = process.env.BOOKING_MEETING_URL || undefined;
  const location = meetingUrl ?? meeting.location;
  const whenStudio = formatInZone(start, booking.timeZone, WHEN);
  const whenVisitor = formatInZone(start, visitorTz, WHEN);
  const company = d.company ? ` (${d.company})` : "";

  // 1. Create the meeting as a task in FocusPilot.
  const task = await createMeetingTask({
    title: `${meeting.name}: ${d.name}${company}`,
    description: [
      `${meeting.name} booked via ${site.url.replace(/^https?:\/\//, "")}`,
      "",
      `When: ${whenStudio} (${meeting.durationMinutes} min)`,
      `Their time: ${whenVisitor} (${visitorTz})`,
      `Name: ${d.name}`,
      `Email: ${d.email}`,
      d.company && `Company: ${d.company}`,
      d.topics.length > 0 && `Topics: ${d.topics.join(", ")}`,
      d.notes && `Notes: ${d.notes}`,
      `Location: ${location}`,
      d.attribution?.first?.utm_source && `Source: ${d.attribution.first.utm_source}`,
    ]
      .filter(Boolean)
      .join("\n"),
    start,
    end,
    durationMinutes: meeting.durationMinutes,
    attendee: { name: d.name, email: d.email, company: d.company },
    topics: d.topics,
    tags: ["meeting", "website-booking"],
  });
  if (!task.ok && !("skipped" in task && task.skipped)) console.error("[booking] FocusPilot task failed:", task.error);

  const calendarEvent = {
    uid: `${start.getTime()}-${d.email.replace(/[^a-z0-9]/gi, "")}@${new URL(site.url).host}`,
    start,
    end,
    title: `${meeting.name} · ${site.name}`,
    description: `${meeting.description}${meetingUrl ? `\n\nJoin: ${meetingUrl}` : ""}\n\nNeed to reschedule? Email ${site.email}.`,
    location,
    url: meetingUrl,
  };

  const ownerEmail = bookingOwnerNotification({
    name: d.name,
    email: d.email,
    company: d.company,
    topics: d.topics,
    notes: d.notes,
    whenStudio,
    whenVisitor,
    visitorTimeZone: visitorTz,
    meetingName: meeting.name,
    taskStatus: task.ok
      ? `Task created${task.id ? ` (#${task.id})` : ""}`
      : isFocusPilotConfigured()
        ? "Task creation failed; please add it manually"
        : "Not configured",
    page: d.page,
    attribution: d.attribution,
  });
  const ownerMessage = {
    to: ownerAddress(),
    replyTo: { name: d.name, address: d.email },
    ...ownerEmail,
    attachments: [
      {
        filename: "meeting.ics",
        content: buildIcs({ ...calendarEvent, title: `${meeting.name}: ${d.name}${company}` }),
        contentType: "text/calendar; charset=utf-8",
      },
    ],
  };

  // 2. If FocusPilot didn't take it, the owner email is the safety net and must succeed.
  if (!task.ok) {
    let delivered = false;
    if (isEmailConfigured()) {
      try {
        await sendEmail(ownerMessage);
        delivered = true;
      } catch (error) {
        console.error("[booking] fallback owner email failed", error);
      }
    }
    if (!delivered) {
      if (process.env.NODE_ENV !== "production") {
        console.info(`[booking] Nothing configured; booking logged instead:\n${ownerEmail.text}`);
      } else {
        release(start.getTime());
        return json(
          {
            ok: false,
            code: "delivery_failed",
            error: `We couldn't confirm your booking right now. Please email us at ${site.email} and we'll get you scheduled.`,
          },
          502,
        );
      }
    }
  }

  // 3. Notifications that shouldn't delay the response.
  const emailOn = isEmailConfigured();
  if (emailOn) {
    after(async () => {
      if (task.ok && process.env.BOOKING_NOTIFY_OWNER !== "false") {
        try {
          await sendEmail(ownerMessage);
        } catch (error) {
          console.error("[booking] owner notification failed", error);
        }
      }
      try {
        const confirmation = bookingConfirmation({
          name: d.name,
          whenVisitor,
          visitorTimeZone: visitorTz,
          meetingName: meeting.name,
          durationMinutes: meeting.durationMinutes,
          location,
          meetingUrl,
          googleUrl: googleCalendarUrl(calendarEvent),
          outlookUrl: outlookCalendarUrl(calendarEvent),
        });
        await sendEmail({
          to: { name: d.name, address: d.email },
          replyTo: publicReplyAddress(),
          ...confirmation,
          icalEvent: {
            method: "REQUEST",
            filename: "invite.ics",
            content: buildIcs(
              {
                ...calendarEvent,
                organizer: { name: site.name, email: publicReplyAddress() },
                attendee: { name: d.name, email: d.email },
              },
              "REQUEST",
            ),
          },
        });
      } catch (error) {
        console.error("[booking] confirmation email failed", error);
      }
    });
  }

  return json({
    ok: true,
    booking: { start: slot.start, end: slot.end, meeting: meeting.name, location, meetingUrl },
    emailSent: emailOn,
  });
}
