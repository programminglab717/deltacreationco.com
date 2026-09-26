import { cn } from "@/lib/utils";

export function BookingSkeleton() {
  return (
    <div className="grid gap-6 p-5 sm:p-7 md:grid-cols-[1.15fr_0.85fr]" aria-hidden="true">
      <div>
        <div className="skeleton h-6 w-36 rounded-full" />
        <div className="mt-6 grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="skeleton aspect-square rounded-full" />
          ))}
        </div>
      </div>
      <div className="space-y-2">
        <div className="skeleton h-5 w-40 rounded-full" />
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="skeleton h-11 rounded-xl" />
        ))}
      </div>
    </div>
  );
}

/** Placeholder card shown while the booking widget loads. */
export function BookingShell({ className }: { className?: string }) {
  return (
    <div className={cn("surface overflow-hidden rounded-[2rem] bg-ink-900", className)} aria-busy="true">
      <div className="flex items-center gap-3 border-b border-white/[0.07] px-5 py-4 sm:px-7">
        <span className="skeleton size-10 rounded-xl" />
        <span className="space-y-1.5">
          <span className="skeleton block h-4 w-36 rounded-full" />
          <span className="skeleton block h-3 w-24 rounded-full" />
        </span>
      </div>
      <BookingSkeleton />
      <p className="sr-only">Loading available times…</p>
    </div>
  );
}
