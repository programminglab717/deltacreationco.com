"use client";

import { useEffect } from "react";

/**
 * Reveals every `[data-reveal]` element as it scrolls into view by setting a
 * `data-in` attribute (styled in globals.css). Watches the DOM so content
 * rendered by client-side navigations is picked up automatically.
 */
export function RevealObserver() {
  useEffect(() => {
    const root = document.documentElement;

    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          // Reveal on entry, and anything already scrolled past (e.g. after a reload mid-page).
          if (entry.isIntersecting || entry.boundingClientRect.bottom < 0) {
            entry.target.setAttribute("data-in", "");
            io.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "0px 0px -9% 0px", threshold: 0 },
    );

    const observe = (el: Element) => {
      if (!el.hasAttribute("data-in")) io.observe(el);
    };

    document.querySelectorAll("[data-reveal]").forEach(observe);

    const mo = new MutationObserver((mutations) => {
      for (const m of mutations) {
        m.addedNodes.forEach((node) => {
          if (!(node instanceof Element)) return;
          if (node.matches("[data-reveal]")) observe(node);
          node.querySelectorAll("[data-reveal]").forEach(observe);
        });
      }
    });
    mo.observe(document.body, { childList: true, subtree: true });

    root.classList.add("reveal-ready");

    return () => {
      io.disconnect();
      mo.disconnect();
    };
  }, []);

  return null;
}
