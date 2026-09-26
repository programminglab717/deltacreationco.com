import { after } from "next/server";
import { site } from "@/content/site";
import { isEmailConfigured, ownerAddress, publicReplyAddress, sendEmail } from "@/lib/email";
import { contactAutoReply, contactNotification } from "@/lib/email-templates";
import { clientIp, isSameOrigin, json, rateLimit, readJson, spamReason } from "@/lib/guard";
import { formatInZone } from "@/lib/time";
import { contactSchema, fieldErrors } from "@/lib/validation";

export const dynamic = "force-dynamic";

const FALLBACK = `Something went wrong sending your message. Please email us directly at ${site.email}.`;

export async function POST(req: Request) {
  if (!isSameOrigin(req)) return json({ ok: false, error: "Forbidden." }, 403);

  const limit = rateLimit(`contact:${clientIp(req)}`, 5, 10 * 60_000);
  if (!limit.ok) {
    return json({ ok: false, error: "You've sent a few messages already. Please try again in a few minutes." }, 429, {
      "Retry-After": String(limit.retryAfter),
    });
  }

  const body = await readJson(req);
  if (!body.ok) return json({ ok: false, error: body.error }, body.status);

  const parsed = contactSchema.safeParse(body.data);
  if (!parsed.success) {
    return json({ ok: false, error: "Please check the highlighted fields.", fields: fieldErrors(parsed.error) }, 400);
  }
  const d = parsed.data;

  const spam = spamReason({ website: d.website, startedAt: d.startedAt, text: d.message });
  if (spam) {
    console.warn(`[contact] dropped submission (${spam})`);
    return json({ ok: true });
  }

  const submittedAt = `${formatInZone(Date.now(), site.timeZone, {
    dateStyle: "medium",
    timeStyle: "short",
  })} (${site.timeZone})`;
  const email = contactNotification({ ...d, submittedAt });

  if (!isEmailConfigured()) {
    if (process.env.NODE_ENV !== "production") {
      console.info("[contact] SMTP not configured; enquiry logged instead:\n" + email.text);
      return json({ ok: true, dev: true });
    }
    console.error("[contact] SMTP is not configured; cannot deliver enquiry.");
    return json({ ok: false, error: FALLBACK }, 503);
  }

  try {
    await sendEmail({ to: ownerAddress(), replyTo: { name: d.name, address: d.email }, ...email });
  } catch (error) {
    console.error("[contact] failed to send enquiry email", error);
    return json({ ok: false, error: FALLBACK }, 502);
  }

  if (process.env.CONTACT_AUTOREPLY === "true") {
    after(async () => {
      try {
        await sendEmail({ to: d.email, replyTo: publicReplyAddress(), ...contactAutoReply({ name: d.name }) });
      } catch (error) {
        console.error("[contact] failed to send auto-reply", error);
      }
    });
  }

  return json({ ok: true });
}
