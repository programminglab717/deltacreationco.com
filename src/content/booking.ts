/**
 * The "Book a call" calendar is FocusPilot's booking embed: availability,
 * the meeting task and confirmation emails are all managed in FocusPilot.
 * The meeting details below are only used for the copy around it.
 */
export const booking = {
  meeting: {
    name: "Free strategy call",
    durationMinutes: 30,
    location: "Video call",
    description:
      "A focused 30-minute conversation about your goals, your current setup and the fastest way to get results.",
  },
  /** FocusPilot booking page shown inline. `color` sets its accent (hex, no #). */
  embedUrl: "https://focuspilot.online/book/ws-79fltn/intro-call?color=f48b2a",
} as const;
