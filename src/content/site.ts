/**
 * Global business details. Most copy and settings that appear across the
 * site live here, so updating the business is a one-file change.
 */
export const site = {
  name: "Delta Creation Co.",
  shortName: "Delta",
  legalName: "Delta Creation Co.",
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "https://deltacreationco.com").replace(/\/$/, ""),
  tagline: "Websites that convert. Systems that run themselves.",
  description:
    "Delta Creation Co. is a development and automation studio. We build high-converting websites, custom web apps and AI-powered automations that help growing businesses win more customers and save hours every week.",
  /** Public contact address shown on the site. */
  email: "hello@deltacreationco.com",
  /**
   * Studio time zone (IANA). Drives the live studio clock, the "online now"
   * status and the booking calendar's working hours.
   */
  timeZone: "America/New_York",
  /** Working hours in the studio time zone (24h clock, 0 = Sunday). */
  hours: { days: [1, 2, 3, 4, 5], start: 9, end: 17 },
  responseTime: "within one business day",
  locale: "en_US",
  /** Social profiles. Leave empty to hide. */
  socials: {
    linkedin: "",
    x: "",
    github: "",
    instagram: "",
  } as Record<string, string>,
  keywords: [
    "web development agency",
    "automation agency",
    "business process automation",
    "workflow automation services",
    "AI automation agency",
    "Next.js development",
    "custom web app development",
    "SaaS development",
    "AI agents for business",
    "API integration services",
  ],
} as const;

export type Site = typeof site;

export function absoluteUrl(path = "/") {
  return `${site.url}${path.startsWith("/") ? path : `/${path}`}`;
}
