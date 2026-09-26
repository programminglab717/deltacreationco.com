"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useSyncExternalStore, type FormEvent, type ReactNode } from "react";
import { ArrowUpRight, Check, Send } from "lucide-react";
import { budgetOptions, interestAliases, interestOptions, timelineOptions } from "@/content/forms";
import { site } from "@/content/site";
import { track } from "@/lib/analytics";
import { getAttribution } from "@/lib/attribution";
import { cn } from "@/lib/utils";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const LEAD_KEY = "dcc:lead";
const MAX_MESSAGE = 5000;

type Prefill = {
  interests: string[];
  message: string;
  roi?: { hours: number; savings: number };
};

function parsePrefill(search: string): Prefill {
  const params = new URLSearchParams(search);
  const interest = params.get("interest");
  const mapped = interest ? interestAliases[interest] : undefined;
  const hours = Number(params.get("hours"));
  const savings = Number(params.get("savings"));
  const roi = params.get("source") === "roi" && hours > 0 && savings > 0 ? { hours, savings } : undefined;
  return {
    interests: mapped ? [mapped] : [],
    message: roi
      ? `I used your ROI calculator: roughly ${hours.toLocaleString("en-US")} hours and $${savings.toLocaleString("en-US")} a year could be automated. I'd like to explore where to start.\n\n`
      : "",
    roi,
  };
}

const noop = () => () => {};

/** Contact form: re-mounts once after hydration with any prefill from the URL. */
export function ContactForm() {
  const search = useSyncExternalStore(
    noop,
    () => window.location.search,
    () => "",
  );
  return <ContactFormInner key={search} prefill={parsePrefill(search)} />;
}

function ContactFormInner({ prefill }: { prefill: Prefill }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [siteUrl, setSiteUrl] = useState("");
  const [interests, setInterests] = useState<string[]>(prefill.interests);
  const [budget, setBudget] = useState<string>("");
  const [timeline, setTimeline] = useState<string>("");
  const [message, setMessage] = useState(prefill.message);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  const startedAt = useRef(0);
  const honeypot = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const interestsRef = useRef<HTMLFieldSetElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  const toggleInterest = (value: string) =>
    setInterests((prev) => (prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]));

  const validate = () => {
    const e: Record<string, string> = {};
    if (name.trim().length < 2) e.name = "Please enter your name.";
    if (!EMAIL_RE.test(email.trim())) e.email = "Please enter a valid email address.";
    if (interests.length === 0) e.interests = "Choose at least one option.";
    if (message.trim().length < 10) e.message = "Please add a few more details (at least 10 characters).";
    return e;
  };

  const focusFirst = (e: Record<string, string>) => {
    if (e.name) nameRef.current?.focus();
    else if (e.email) emailRef.current?.focus();
    else if (e.interests) interestsRef.current?.querySelector("input")?.focus();
    else if (e.message) messageRef.current?.focus();
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    const e = validate();
    setErrors(e);
    if (Object.keys(e).length) {
      focusFirst(e);
      return;
    }
    setStatus("sending");
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim(),
          company: company.trim(),
          siteUrl: siteUrl.trim(),
          interests,
          budget: budget || undefined,
          timeline: timeline || undefined,
          message: message.trim(),
          roi: prefill.roi,
          website: honeypot.current?.value ?? "",
          startedAt: startedAt.current || undefined,
          page: window.location.pathname,
          attribution: getAttribution(),
        }),
      });
      const data = (await res.json().catch(() => ({}))) as {
        ok?: boolean;
        error?: string;
        fields?: Record<string, string>;
      };
      if (res.ok && data.ok) {
        setStatus("sent");
        track("generate_lead", { form: "contact", interests: interests.join(","), budget: budget || "unspecified" });
        try {
          sessionStorage.setItem(
            LEAD_KEY,
            JSON.stringify({ name: name.trim(), email: email.trim(), company: company.trim() }),
          );
        } catch {
          // Ignore unavailable storage.
        }
        requestAnimationFrame(() => {
          successRef.current?.focus();
          successRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
        });
        return;
      }
      if (data.fields) {
        setErrors(data.fields);
        focusFirst(data.fields);
      }
      setServerError(data.error ?? `Something went wrong. Please email us at ${site.email}.`);
      setStatus("error");
    } catch {
      setServerError(`We couldn't reach the server. Please try again or email us at ${site.email}.`);
      setStatus("error");
    }
  };

  if (status === "sent") {
    const bookHref = `/book?${new URLSearchParams({ name: name.trim(), email: email.trim() }).toString()}`;
    return (
      <div
        ref={successRef}
        tabIndex={-1}
        role="status"
        className="surface rounded-[2rem] bg-ink-900 p-8 outline-none sm:p-10"
      >
        <span className="grid size-16 place-items-center rounded-full bg-mint text-ink-950 shadow-[0_0_40px_-6px_rgba(79,240,176,0.8)]">
          <Check className="size-8" strokeWidth={2.5} aria-hidden="true" />
        </span>
        <h2 className="mt-8 text-h3 font-medium">Thanks, {name.trim().split(/\s+/)[0]}. Your message is in.</h2>
        <p className="mt-3 max-w-md text-fog-300">
          We&apos;ll review it and reply {site.responseTime} with next steps. Want to move faster? Grab a time for a
          free strategy call now.
        </p>
        <ol className="mt-8 space-y-3 text-sm text-fog-300">
          {[
            "We review your message and goals",
            "We reply with questions or ideas",
            "A short call to map the solution",
            "A clear, fixed-price proposal",
          ].map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span
                className={cn(
                  "grid size-6 place-items-center rounded-full font-mono text-[0.65rem]",
                  i === 0 ? "bg-accent text-ink-950" : "border border-white/15",
                )}
              >
                {i + 1}
              </span>
              {s}
            </li>
          ))}
        </ol>
        <div className="mt-9 flex flex-wrap gap-3">
          <Link href={bookHref} className="btn btn-primary">
            <span className="roll">
              <span data-text="Book a call now">Book a call now</span>
            </span>
            <span className="btn-icon">
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </span>
          </Link>
          <Link href="/solutions" className="btn btn-ghost">
            <span className="roll">
              <span data-text="Explore solutions">Explore solutions</span>
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="surface relative rounded-[2rem] bg-ink-900 p-6 sm:p-9"
      aria-describedby="contact-form-note"
    >
      <div className="grid gap-5 sm:grid-cols-2">
        <Field id="cf-name" label="Your name" required error={errors.name}>
          <input
            ref={nameRef}
            id="cf-name"
            name="name"
            className="field"
            autoComplete="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "cf-name-error" : undefined}
            required
          />
        </Field>
        <Field id="cf-email" label="Work email" required error={errors.email}>
          <input
            ref={emailRef}
            id="cf-email"
            name="email"
            type="email"
            inputMode="email"
            className="field"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "cf-email-error" : undefined}
            required
          />
        </Field>
        <Field id="cf-company" label="Company" optional>
          <input
            id="cf-company"
            name="company"
            className="field"
            autoComplete="organization"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
          />
        </Field>
        <Field id="cf-site" label="Website" optional>
          <input
            id="cf-site"
            name="siteUrl"
            className="field"
            inputMode="url"
            autoComplete="url"
            placeholder="yourcompany.com"
            value={siteUrl}
            onChange={(e) => setSiteUrl(e.target.value)}
          />
        </Field>
      </div>

      <fieldset
        ref={interestsRef}
        className="mt-7"
        aria-invalid={Boolean(errors.interests)}
        aria-describedby={errors.interests ? "cf-interests-error" : undefined}
      >
        <legend className="field-label">
          What can we help with? <span className="text-accent">*</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {interestOptions.map((opt) => (
            <label key={opt} className="chip">
              <input
                type="checkbox"
                name="interests"
                value={opt}
                checked={interests.includes(opt)}
                onChange={() => toggleInterest(opt)}
              />
              {interests.includes(opt) && <Check className="size-3.5" aria-hidden="true" />}
              {opt}
            </label>
          ))}
        </div>
        {errors.interests && (
          <p id="cf-interests-error" className="field-error">
            {errors.interests}
          </p>
        )}
      </fieldset>

      <fieldset className="mt-7">
        <legend className="field-label">
          Estimated budget <span className="text-fog-500">(optional)</span>
        </legend>
        <div className="flex flex-wrap gap-2">
          {budgetOptions.map((opt) => (
            <label key={opt} className="chip">
              <input type="radio" name="budget" value={opt} checked={budget === opt} onChange={() => setBudget(opt)} />
              {opt}
            </label>
          ))}
        </div>
      </fieldset>

      <div className="mt-7">
        <label htmlFor="cf-timeline" className="field-label">
          Timeline <span className="text-fog-500">(optional)</span>
        </label>
        <select
          id="cf-timeline"
          name="timeline"
          className="field"
          value={timeline}
          onChange={(e) => setTimeline(e.target.value)}
        >
          <option value="">Select a timeline</option>
          {timelineOptions.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-7">
        <div className="flex items-baseline justify-between">
          <label htmlFor="cf-message" className="field-label">
            Tell us about your project <span className="text-accent">*</span>
          </label>
          <span className="text-xs text-fog-500 tabular-nums" aria-hidden="true">
            {message.length}/{MAX_MESSAGE}
          </span>
        </div>
        <textarea
          ref={messageRef}
          id="cf-message"
          name="message"
          rows={6}
          maxLength={MAX_MESSAGE}
          className="field resize-y"
          placeholder="What are you trying to achieve? What's getting in the way today?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          aria-invalid={Boolean(errors.message)}
          aria-describedby={errors.message ? "cf-message-error" : undefined}
          required
        />
        {errors.message && (
          <p id="cf-message-error" className="field-error">
            {errors.message}
          </p>
        )}
      </div>

      <div aria-hidden="true" className="absolute top-auto left-[-9999px] h-px w-px overflow-hidden">
        <label htmlFor="cf-website">Leave this field empty</label>
        <input ref={honeypot} id="cf-website" name="website" tabIndex={-1} autoComplete="off" />
      </div>

      {serverError && (
        <p
          role="alert"
          className="mt-6 rounded-2xl border border-accent/30 bg-accent/10 px-4 py-3 text-sm text-accent-300"
        >
          {serverError}
        </p>
      )}

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <p id="contact-form-note" className="max-w-xs text-xs leading-relaxed text-fog-500">
          We reply {site.responseTime}. By sending this form you agree to our{" "}
          <Link href="/privacy" className="underline underline-offset-2 hover:text-fog-300">
            privacy policy
          </Link>
          .
        </p>
        <button type="submit" className="btn btn-primary btn-lg" disabled={status === "sending"}>
          <span className="roll">
            <span data-text={status === "sending" ? "Sending…" : "Send message"}>
              {status === "sending" ? "Sending…" : "Send message"}
            </span>
          </span>
          {status === "sending" ? (
            <span
              className="size-4 animate-[spin_0.8s_linear_infinite] rounded-full border-2 border-ink-950 border-t-transparent"
              aria-hidden="true"
            />
          ) : (
            <span className="btn-icon">
              <Send className="size-4" aria-hidden="true" />
            </span>
          )}
        </button>
      </div>
    </form>
  );
}

function Field({
  id,
  label,
  required,
  optional,
  error,
  children,
}: {
  id: string;
  label: string;
  required?: boolean;
  optional?: boolean;
  error?: string;
  children: ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="field-label">
        {label} {required && <span className="text-accent">*</span>}
        {optional && <span className="text-fog-500">(optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${id}-error`} className="field-error">
          {error}
        </p>
      )}
    </div>
  );
}
