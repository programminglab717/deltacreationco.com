import { cn } from "@/lib/utils";

export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={cn("size-7", className)} aria-hidden="true" fill="none">
      <path d="M16 3.5 29.5 27.5h-27L16 3.5Z" stroke="currentColor" strokeWidth="2.6" strokeLinejoin="round" />
      <path d="M16 14.2 21.6 24h-11.2L16 14.2Z" fill="#ff5a1f" />
    </svg>
  );
}

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <LogoMark />
      {!compact && (
        <span className="text-[1.02rem] font-semibold tracking-[-0.03em]">
          Delta <span className="font-normal text-fog-300">Creation Co.</span>
        </span>
      )}
    </span>
  );
}
