import { z } from "zod";
import { budgetOptions, interestOptions, timelineOptions, topicOptions } from "@/content/forms";

const short = (max: number) => z.string().trim().max(max);

const touchSchema = z
  .object({
    utm_source: short(200),
    utm_medium: short(200),
    utm_campaign: short(200),
    utm_term: short(200),
    utm_content: short(200),
    gclid: short(200),
    fbclid: short(200),
    msclkid: short(200),
    referrer: short(300),
    landing_page: short(300),
    captured_at: short(40),
  })
  .partial();

export const attributionSchema = z.object({ first: touchSchema.optional(), last: touchSchema.optional() }).optional();

/** Anti-spam metadata included with every form. */
const metaSchema = {
  /** Honeypot: hidden from people, so any value means a bot filled it in. */
  website: z.string().max(500).optional(),
  /** When the form was first rendered (ms since epoch). */
  startedAt: z.number().int().positive().optional(),
  page: short(300).optional(),
  attribution: attributionSchema,
};

export const contactSchema = z.object({
  name: z.string().trim().min(2, "Please enter your name.").max(100, "That name is a little long."),
  email: z.email("Please enter a valid email address.").max(200),
  company: short(120).optional().default(""),
  siteUrl: short(200).optional().default(""),
  interests: z.array(z.enum(interestOptions)).min(1, "Choose at least one option.").max(interestOptions.length),
  budget: z.enum(budgetOptions).optional(),
  timeline: z.enum(timelineOptions).optional(),
  message: z
    .string()
    .trim()
    .min(10, "Please add a few more details (at least 10 characters).")
    .max(5000, "Please keep your message under 5,000 characters."),
  roi: z.object({ hours: z.number().min(0).max(1_000_000), savings: z.number().min(0).max(100_000_000) }).optional(),
  ...metaSchema,
});

export const bookingSchema = z.object({
  start: z.iso.datetime({ message: "Please choose a time." }),
  timeZone: short(64).min(1),
  name: z.string().trim().min(2, "Please enter your name.").max(100),
  email: z.email("Please enter a valid email address.").max(200),
  company: short(120).optional().default(""),
  topics: z.array(z.enum(topicOptions)).max(topicOptions.length).default([]),
  notes: short(2000).optional().default(""),
  ...metaSchema,
});

export function fieldErrors(error: z.ZodError) {
  const flat = z.flattenError(error).fieldErrors as Record<string, string[] | undefined>;
  return Object.fromEntries(Object.entries(flat).map(([k, v]) => [k, v?.[0] ?? "Invalid value."]));
}
