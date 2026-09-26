"use client";

import { useEffect, useRef } from "react";
import { hasFinePointer, prefersReducedMotion } from "@/lib/gsap";

const INTERACTIVE = "a, button, [role='button'], label.chip, summary, [data-cursor]";
const TEXT =
  "input:not([type='range']):not([type='checkbox']):not([type='radio']), textarea, select, [contenteditable='true']";

/**
 * A soft halo that trails the pointer and morphs over interactive elements.
 * The native cursor stays visible, so usability is never compromised.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    const label = labelRef.current;
    if (!el || !label || !hasFinePointer() || prefersReducedMotion()) return;

    let x = -100;
    let y = -100;
    let tx = x;
    let ty = y;
    let raf = 0;
    let shown = false;

    const onMove = (e: PointerEvent) => {
      tx = e.clientX;
      ty = e.clientY;
      if (!shown) {
        shown = true;
        x = tx;
        y = ty;
        el.dataset.visible = "true";
      }
      const target = e.target instanceof Element ? e.target : null;
      const labelled = target?.closest<HTMLElement>("[data-cursor]");
      if (target?.closest(TEXT)) {
        el.dataset.state = "text";
      } else if (labelled?.dataset.cursor) {
        el.dataset.state = "label";
        label.textContent = labelled.dataset.cursor;
      } else if (target?.closest(INTERACTIVE)) {
        el.dataset.state = "hover";
      } else {
        el.dataset.state = "";
      }
    };

    const onLeave = () => {
      shown = false;
      el.dataset.visible = "false";
    };
    const onDown = () => (el.dataset.pressed = "true");
    const onUp = () => (el.dataset.pressed = "false");

    const loop = () => {
      x += (tx - x) * 0.2;
      y += (ty - y) * 0.2;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, []);

  return (
    <div ref={ref} className="cursor" aria-hidden="true" data-visible="false">
      <div className="cursor-ring">
        <span ref={labelRef} className="cursor-label" />
      </div>
    </div>
  );
}
