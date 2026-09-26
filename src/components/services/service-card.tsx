import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import { Icon } from "@/components/ui/icon";
import type { Service } from "@/content/services";
import { cn } from "@/lib/utils";

export function ServiceCard({
  service,
  index = 0,
  className,
}: {
  service: Service;
  index?: number;
  className?: string;
}) {
  return (
    <Link
      href={`/services/${service.slug}`}
      className={cn(
        "group relative flex flex-col overflow-hidden rounded-[2rem] border border-white/[0.08] bg-ink-900 p-7 transition-colors duration-500 hover:border-accent/40 sm:p-9",
        className,
      )}
      data-reveal
      style={{ "--reveal-delay": `${index * 90}ms` } as CSSProperties}
    >
      <div
        aria-hidden="true"
        className="absolute -top-24 -right-24 size-72 rounded-full bg-accent/0 blur-3xl transition-colors duration-700 group-hover:bg-accent/15"
      />
      <div className="relative flex items-start justify-between">
        <span className="grid size-14 place-items-center rounded-2xl border border-white/10 bg-white/[0.03] text-fog-100 transition-all duration-500 group-hover:border-accent group-hover:bg-accent group-hover:text-ink-950">
          <Icon name={service.icon} className="size-6" />
        </span>
        <ArrowUpRight
          className="size-6 text-fog-500 transition-all duration-500 group-hover:rotate-45 group-hover:text-accent"
          aria-hidden="true"
        />
      </div>
      <h3 className="relative mt-10 text-2xl font-medium tracking-tight">{service.name}</h3>
      <p className="relative mt-3 text-fog-400">{service.short}</p>
      <ul className="relative mt-7 space-y-2.5 border-t border-white/[0.07] pt-6 text-sm text-fog-300">
        {service.deliverables.slice(0, 4).map((d) => (
          <li key={d.title} className="flex items-center gap-2.5">
            <span className="size-1 shrink-0 rounded-full bg-accent" aria-hidden="true" />
            {d.title}
          </li>
        ))}
      </ul>
    </Link>
  );
}
