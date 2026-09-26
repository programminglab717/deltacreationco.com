"use client";

/**
 * Captures where a visitor came from (UTM tags, click IDs, referrer, landing
 * page) so every enquiry and booking arrives with its marketing source.
 */

export type Attribution = {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_term?: string;
  utm_content?: string;
  gclid?: string;
  fbclid?: string;
  msclkid?: string;
  referrer?: string;
  landing_page?: string;
  captured_at?: string;
};

const KEYS = [
  "utm_source",
  "utm_medium",
  "utm_campaign",
  "utm_term",
  "utm_content",
  "gclid",
  "fbclid",
  "msclkid",
] as const;

const FIRST = "dcc:attribution:first";
const LAST = "dcc:attribution:last";

function read(storage: Storage, key: string): Attribution | undefined {
  try {
    const raw = storage.getItem(key);
    return raw ? (JSON.parse(raw) as Attribution) : undefined;
  } catch {
    return undefined;
  }
}

function write(storage: Storage, key: string, value: Attribution) {
  try {
    storage.setItem(key, JSON.stringify(value));
  } catch {
    // Storage can be unavailable (private mode, blocked cookies).
  }
}

export function captureAttribution() {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);
  const current: Attribution = {};
  for (const key of KEYS) {
    const value = params.get(key);
    if (value) current[key] = value.slice(0, 200);
  }

  let referrer: string | undefined;
  try {
    if (document.referrer && new URL(document.referrer).host !== window.location.host) {
      referrer = document.referrer.slice(0, 300);
    }
  } catch {
    referrer = undefined;
  }

  const hasSignal = Object.keys(current).length > 0 || referrer;
  const touch: Attribution = {
    ...current,
    referrer,
    landing_page: (window.location.pathname + window.location.search).slice(0, 300),
    captured_at: new Date().toISOString(),
  };

  if (!read(localStorage, FIRST)) write(localStorage, FIRST, touch);
  if (hasSignal || !read(sessionStorage, LAST)) write(sessionStorage, LAST, touch);
}

export function getAttribution(): { first?: Attribution; last?: Attribution } {
  if (typeof window === "undefined") return {};
  return { first: read(localStorage, FIRST), last: read(sessionStorage, LAST) };
}
