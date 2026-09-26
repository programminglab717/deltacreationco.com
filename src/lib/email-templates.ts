import "server-only";

import { absoluteUrl, site } from "@/content/site";

export function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

const ACCENT = "#ff5a1f";

type Row = [label: string, value: string | undefined | null, opts?: { html?: boolean; pre?: boolean }];

function rowsHtml(rows: Row[]) {
  return rows
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([label, value, opts]) => {
      const v = opts?.html ? String(value) : escapeHtml(String(value));
      return `<tr>
        <td style="padding:12px 0;border-bottom:1px solid #eeeae4;width:150px;vertical-align:top;color:#77737d;font-size:13px;">${escapeHtml(label)}</td>
        <td style="padding:12px 0;border-bottom:1px solid #eeeae4;vertical-align:top;color:#16151a;font-size:14px;line-height:1.55;${opts?.pre ? "white-space:pre-wrap;" : ""}">${v}</td>
      </tr>`;
    })
    .join("");
}

function rowsText(rows: Row[]) {
  return rows
    .filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "")
    .map(([label, value, opts]) => `${label}: ${opts?.html ? String(value).replace(/<[^>]+>/g, "") : value}`)
    .join("\n");
}

function button(href: string, label: string) {
  return `<a href="${escapeHtml(href)}" style="display:inline-block;background:${ACCENT};color:#060607;text-decoration:none;font-weight:600;font-size:14px;padding:13px 22px;border-radius:999px;">${escapeHtml(label)}</a>`;
}

function layout({
  preheader,
  eyebrow,
  title,
  intro,
  body,
  footer,
}: {
  preheader: string;
  eyebrow: string;
  title: string;
  intro?: string;
  body: string;
  footer?: string;
}) {
  return `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light"><title>${escapeHtml(title)}</title></head>
<body style="margin:0;padding:0;background:#f2f0eb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#16151a;">
  <span style="display:none!important;visibility:hidden;opacity:0;height:0;width:0;overflow:hidden;">${escapeHtml(preheader)}</span>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f0eb;padding:32px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
        <tr><td style="padding:0 8px 18px;font-size:15px;font-weight:700;letter-spacing:-0.02em;color:#16151a;">
          <span style="color:${ACCENT};">&#9650;</span>&nbsp; ${escapeHtml(site.name)}
        </td></tr>
        <tr><td style="background:#ffffff;border-radius:20px;padding:36px 32px;border:1px solid #e8e5de;">
          <p style="margin:0 0 10px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:${ACCENT};font-weight:700;">${escapeHtml(eyebrow)}</p>
          <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;letter-spacing:-0.02em;color:#16151a;">${escapeHtml(title)}</h1>
          ${intro ? `<p style="margin:0 0 24px;font-size:15px;line-height:1.6;color:#4d4a55;">${intro}</p>` : ""}
          ${body}
        </td></tr>
        <tr><td style="padding:20px 8px 0;font-size:12px;line-height:1.6;color:#8a8691;">
          ${footer ?? `${escapeHtml(site.name)} · <a href="${site.url}" style="color:#8a8691;">${escapeHtml(site.url.replace(/^https?:\/\//, ""))}</a>`}
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

function table(rows: Row[]) {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="border-collapse:collapse;border-top:1px solid #eeeae4;">${rowsHtml(rows)}</table>`;
}

type Touch = Record<string, string | undefined> | undefined;

function touchSummary(t: Touch) {
  if (!t) return undefined;
  const parts = [
    t.utm_source && `source=${t.utm_source}`,
    t.utm_medium && `medium=${t.utm_medium}`,
    t.utm_campaign && `campaign=${t.utm_campaign}`,
    t.utm_term && `term=${t.utm_term}`,
    t.gclid && "Google Ads click",
    t.fbclid && "Meta click",
    t.msclkid && "Microsoft Ads click",
    t.referrer && `referrer=${t.referrer}`,
    t.landing_page && `landed on ${t.landing_page}`,
  ].filter(Boolean);
  return parts.length ? parts.join(" · ") : "Direct / unknown";
}

export function attributionRows(attribution?: { first?: Touch; last?: Touch }, page?: string): Row[] {
  return [
    ["Submitted from", page],
    ["First touch", touchSummary(attribution?.first)],
    ["Latest touch", touchSummary(attribution?.last)],
  ];
}

export function firstName(name: string) {
  return name.trim().split(/\s+/)[0] ?? name;
}

/* ------------------------------------------------------------------ */

export function contactNotification(d: {
  name: string;
  email: string;
  company?: string;
  siteUrl?: string;
  interests: string[];
  budget?: string;
  timeline?: string;
  message: string;
  roi?: { hours: number; savings: number };
  submittedAt: string;
  page?: string;
  attribution?: { first?: Touch; last?: Touch };
}) {
  const subject = `New enquiry: ${d.name}${d.company ? ` (${d.company})` : ""} · ${d.interests.join(", ")}`;
  const rows: Row[] = [
    ["Name", d.name],
    [
      "Email",
      `<a href="mailto:${escapeHtml(d.email)}" style="color:${ACCENT};">${escapeHtml(d.email)}</a>`,
      { html: true },
    ],
    ["Company", d.company],
    ["Website", d.siteUrl],
    ["Interested in", d.interests.join(", ")],
    ["Budget", d.budget],
    ["Timeline", d.timeline],
    ["Message", d.message, { pre: true }],
    [
      "ROI estimate",
      d.roi
        ? `~${d.roi.hours.toLocaleString("en-US")} hours / $${d.roi.savings.toLocaleString("en-US")} per year (calculator)`
        : undefined,
    ],
    ["Received", d.submittedAt],
  ];
  const meta = attributionRows(d.attribution, d.page);
  const replyHref = `mailto:${d.email}?subject=${encodeURIComponent(`Re: your enquiry to ${site.name}`)}`;

  const html = layout({
    preheader: d.message.slice(0, 140),
    eyebrow: "New website enquiry",
    title: `New enquiry from ${d.name}`,
    body: `${table(rows)}
      <p style="margin:28px 0 8px;">${button(replyHref, `Reply to ${firstName(d.name)}`)}</p>
      <p style="margin:28px 0 8px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8a8691;font-weight:700;">Attribution</p>
      ${table(meta)}`,
  });

  const text = `New website enquiry\n\n${rowsText(rows)}\n\nAttribution\n${rowsText(meta)}\n`;
  return { subject, html, text };
}

export function contactAutoReply(d: { name: string }) {
  const subject = `Thanks for reaching out to ${site.name}`;
  const bookUrl = absoluteUrl("/book");
  const intro = `Hi ${escapeHtml(firstName(d.name))}, thanks for getting in touch. Your message is with us and we'll reply ${escapeHtml(site.responseTime)}.`;
  const html = layout({
    preheader: `We've received your message and will reply ${site.responseTime}.`,
    eyebrow: "Message received",
    title: "We've got your message",
    intro,
    body: `<p style="margin:0 0 14px;font-size:15px;line-height:1.6;color:#4d4a55;">Want to move faster? Pick a time for a free 30-minute strategy call and we'll come prepared with ideas.</p>
      <p style="margin:22px 0 0;">${button(bookUrl, "Book a free strategy call")}</p>`,
  });
  const text = `Hi ${firstName(d.name)},\n\nThanks for getting in touch. Your message is with us and we'll reply ${site.responseTime}.\n\nWant to move faster? Book a free 30-minute strategy call: ${bookUrl}\n\n${site.name}`;
  return { subject, html, text };
}

export function bookingOwnerNotification(d: {
  name: string;
  email: string;
  company?: string;
  topics: string[];
  notes?: string;
  whenStudio: string;
  whenVisitor: string;
  visitorTimeZone: string;
  meetingName: string;
  taskStatus: string;
  page?: string;
  attribution?: { first?: Touch; last?: Touch };
}) {
  const subject = `New call booked: ${d.name}${d.company ? ` (${d.company})` : ""} · ${d.whenStudio}`;
  const rows: Row[] = [
    ["When (studio)", d.whenStudio],
    ["When (their time)", `${d.whenVisitor} (${d.visitorTimeZone})`],
    ["Meeting", d.meetingName],
    ["Name", d.name],
    [
      "Email",
      `<a href="mailto:${escapeHtml(d.email)}" style="color:${ACCENT};">${escapeHtml(d.email)}</a>`,
      { html: true },
    ],
    ["Company", d.company],
    ["Topics", d.topics.join(", ")],
    ["Notes", d.notes, { pre: true }],
    ["FocusPilot", d.taskStatus],
  ];
  const meta = attributionRows(d.attribution, d.page);
  const html = layout({
    preheader: `${d.meetingName} with ${d.name} · ${d.whenStudio}`,
    eyebrow: "New booking",
    title: `${d.name} booked a ${d.meetingName.toLowerCase()}`,
    body: `${table(rows)}
      <p style="margin:28px 0 8px;font-size:11px;letter-spacing:0.16em;text-transform:uppercase;color:#8a8691;font-weight:700;">Attribution</p>
      ${table(meta)}`,
  });
  const text = `New booking\n\n${rowsText(rows)}\n\nAttribution\n${rowsText(meta)}\n`;
  return { subject, html, text };
}

export function bookingConfirmation(d: {
  name: string;
  whenVisitor: string;
  visitorTimeZone: string;
  meetingName: string;
  durationMinutes: number;
  location: string;
  meetingUrl?: string;
  googleUrl: string;
  outlookUrl: string;
}) {
  const subject = `Confirmed: ${d.meetingName} on ${d.whenVisitor}`;
  const rows: Row[] = [
    ["When", `${d.whenVisitor} (${d.visitorTimeZone})`],
    ["Duration", `${d.durationMinutes} minutes`],
    [
      "Where",
      d.meetingUrl
        ? `<a href="${escapeHtml(d.meetingUrl)}" style="color:${ACCENT};">${escapeHtml(d.meetingUrl)}</a>`
        : d.location,
      { html: Boolean(d.meetingUrl) },
    ],
  ];
  const linkNote = d.meetingUrl
    ? "The video link is below and in the calendar invite."
    : "We'll email you the video link before the call.";
  const html = layout({
    preheader: `You're booked for ${d.whenVisitor}. Calendar invite attached.`,
    eyebrow: "Booking confirmed",
    title: `You're booked, ${firstName(d.name)}!`,
    intro: `Thanks for scheduling a ${escapeHtml(d.meetingName.toLowerCase())} with us. A calendar invite is attached. ${linkNote}`,
    body: `${table(rows)}
      <p style="margin:26px 0 10px;font-size:15px;line-height:1.6;color:#4d4a55;"><strong style="color:#16151a;">To make the most of our time:</strong> jot down your goals, the tools you use today and where you're losing the most time or leads.</p>
      <p style="margin:24px 0 0;">${button(d.googleUrl, "Add to Google Calendar")}&nbsp; <a href="${escapeHtml(d.outlookUrl)}" style="color:#4d4a55;font-size:14px;">Outlook</a></p>
      <p style="margin:26px 0 0;font-size:13px;line-height:1.6;color:#8a8691;">Need to reschedule? Just reply to this email and we'll find a new time.</p>`,
  });
  const text = `You're booked, ${firstName(d.name)}!\n\n${rowsText(rows)}\n\nAdd to Google Calendar: ${d.googleUrl}\n\nNeed to reschedule? Just reply to this email.\n\n${site.name}`;
  return { subject, html, text };
}
