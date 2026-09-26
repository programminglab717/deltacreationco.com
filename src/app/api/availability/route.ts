import { booking } from "@/content/booking";
import { computeSlots } from "@/lib/booking/availability";
import { bookedIntervals } from "@/lib/booking/store";
import { json } from "@/lib/guard";

export const dynamic = "force-dynamic";

/** Bookable call slots (UTC ISO start times) for the next few weeks. */
export async function GET() {
  const slots = computeSlots({ busy: bookedIntervals() });
  return json({
    timeZone: booking.timeZone,
    meeting: {
      name: booking.meeting.name,
      durationMinutes: booking.meeting.durationMinutes,
      location: booking.meeting.location,
    },
    slots: slots.map((s) => s.start),
  });
}
