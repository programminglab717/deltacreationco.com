"use client";

type Params = Record<string, string | number | boolean | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    plausible?: (event: string, options?: { props?: Params }) => void;
  }
}

/**
 * Sends a conversion or interaction event to whichever analytics tools are
 * installed (Google Tag Manager / GA4 / Plausible). Safe to call anywhere.
 */
export function track(event: string, params: Params = {}) {
  if (typeof window === "undefined") return;
  try {
    window.dataLayer?.push({ event, ...params });
    window.gtag?.("event", event, params);
    window.plausible?.(event, { props: params });
  } catch {
    // Analytics must never break the page.
  }
}
