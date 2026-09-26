import "server-only";

import nodemailer, { type Transporter } from "nodemailer";
import type Mail from "nodemailer/lib/mailer";
import { site } from "@/content/site";

/**
 * Nodemailer transport configured from environment variables:
 * SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, MAIL_FROM.
 */

let transporter: Transporter | null = null;

export function isEmailConfigured() {
  return Boolean(process.env.SMTP_HOST);
}

function getTransporter() {
  if (!isEmailConfigured()) return null;
  if (!transporter) {
    const port = Number(process.env.SMTP_PORT ?? 587);
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port,
      secure: process.env.SMTP_SECURE ? process.env.SMTP_SECURE === "true" : port === 465,
      auth: process.env.SMTP_USER ? { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS } : undefined,
      connectionTimeout: 10_000,
      greetingTimeout: 10_000,
      socketTimeout: 20_000,
    });
  }
  return transporter;
}

export function fromAddress() {
  return process.env.MAIL_FROM || `"${site.name}" <${process.env.SMTP_USER ?? site.email}>`;
}

/** Where enquiries and booking notifications are delivered. */
export function ownerAddress() {
  return process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER || site.email;
}

/**
 * Public-facing reply address used in emails to visitors (booking
 * confirmations, auto-replies), so your private inbox stays private.
 */
export function publicReplyAddress() {
  return process.env.PUBLIC_REPLY_TO || site.email;
}

export async function sendEmail(message: Omit<Mail.Options, "from"> & { from?: string }) {
  const t = getTransporter();
  if (!t) throw new Error("Email is not configured (SMTP_HOST is missing).");
  return t.sendMail({ from: fromAddress(), ...message });
}
