"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

const HIDDEN_ON = ["/book", "/contact"];

/** Sticky "Book a call" bar for small screens, shown after the first screen. */
export function MobileCta() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const nearBottom = window.innerHeight + window.scrollY > document.documentElement.scrollHeight - 900;
      setVisible(window.scrollY > window.innerHeight * 0.8 && !nearBottom);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  if (HIDDEN_ON.some((p) => pathname.startsWith(p))) return null;

  return (
    <div
      className={cn(
        "fixed inset-x-3 bottom-3 z-40 transition-all duration-700 ease-[var(--ease-out-expo)] sm:hidden",
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-24 opacity-0",
      )}
    >
      <Link
        href="/book"
        tabIndex={visible ? 0 : -1}
        className="glass flex items-center justify-between gap-3 rounded-full py-2 pr-2 pl-5 shadow-2xl shadow-black/60"
      >
        <span className="flex items-center gap-2.5 text-sm">
          <span className="live-dot" aria-hidden="true" />
          Free 30-min strategy call
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2.5 text-sm font-medium text-ink-950">
          Book now
          <ArrowUpRight className="size-4" aria-hidden="true" />
        </span>
      </Link>
    </div>
  );
}
