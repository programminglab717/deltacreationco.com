"use client";

import { site } from "@/content/site";
import { getAttribution, type Attribution } from "@/lib/attribution";

/**
 * Form delivery for the static site. With no server of our own, submissions
 * are posted as JSON to a hosted form backend (Formspree, Web3Forms, Getform,
 * Basin…) that emails them to you:
 *
 *   NEXT_PUBLIC_FORM_ENDPOINT    – the service's submission URL
 *   NEXT_PUBLIC_FORM_ACCESS_KEY  – optional; sent as `access_key` (Web3Forms)
 *
 * Both are baked into the build, so set them before `npm run build`.
 */
const ENDPOINT = process.env.NEXT_PUBLIC_FORM_ENDPOINT;
const ACCESS_KEY = process.env.NEXT_PUBLIC_FORM_ACCESS_KEY;

/**
 * Returns true when a submission looks automated. Callers show the normal
 * success message so bots learn nothing, but nothing is sent.
 */
export function looksLikeSpam({ honeypot, startedAt, text }: { honeypot?: string; startedAt?: number; text: string }) {
  if (honeypot && honeypot.trim() !== "") return true;
  if (startedAt && Date.now() - startedAt < 2500) return true;
  return (text.match(/https?:\/\//gi)?.length ?? 0) > 4;
}

function describeTouch(t?: Attribution) {
  if (!t) return undefined;
  const source = [t.utm_source, t.utm_medium, t.utm_campaign].filter(Boolean).join(" / ");
  return [source || t.referrer || "direct", t.landing_page && `landed on ${t.landing_page}`].filter(Boolean).join(", ");
}

/** Lead attribution as readable fields for the notification email. */
export function attributionFields() {
  const { first, last } = getAttribution();
  return {
    "First visit": describeTouch(first),
    "This visit": describeTouch(last),
  };
}

export async function submitForm({
  subject,
  name,
  email,
  fields,
}: {
  subject: string;
  name: string;
  email: string;
  fields: Record<string, string | undefined>;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const fallback = `Something went wrong sending your message. Please email us directly at ${site.email}.`;
  const data = Object.fromEntries(Object.entries(fields).filter(([, v]) => v !== undefined && v.trim() !== ""));

  if (!ENDPOINT) {
    if (process.env.NODE_ENV !== "production") {
      console.info(`[forms] NEXT_PUBLIC_FORM_ENDPOINT not set; submission logged instead:\n${subject}`, data);
      return { ok: true };
    }
    console.error("[forms] NEXT_PUBLIC_FORM_ENDPOINT is not set; cannot deliver submission.");
    return { ok: false, error: fallback };
  }

  const res = await fetch(ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      ...(ACCESS_KEY ? { access_key: ACCESS_KEY } : {}),
      // Formspree reads `_subject`; Web3Forms and most others read `subject`.
      subject,
      _subject: subject,
      from_name: site.name,
      name,
      email,
      ...data,
    }),
  });
  return res.ok ? { ok: true } : { ok: false, error: fallback };
}
