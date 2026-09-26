"use client";

import { useSyncExternalStore } from "react";

const listeners = new Set<() => void>();
let timer: number | undefined;

function subscribe(listener: () => void) {
  listeners.add(listener);
  if (timer === undefined) {
    timer = window.setInterval(() => listeners.forEach((l) => l()), 1000);
  }
  return () => {
    listeners.delete(listener);
    if (listeners.size === 0) {
      window.clearInterval(timer);
      timer = undefined;
    }
  };
}

/**
 * Current time rounded down to `resolutionMs`, or null during server render
 * and hydration (so time-dependent UI never causes a hydration mismatch).
 */
export function useNow(resolutionMs = 1000) {
  return useSyncExternalStore(
    subscribe,
    () => Math.floor(Date.now() / resolutionMs) * resolutionMs,
    () => null,
  );
}
