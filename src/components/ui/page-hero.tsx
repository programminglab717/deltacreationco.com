import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { ChevronRight } from "lucide-react";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema } from "@/lib/seo";
import { cn, parseAccent } from "@/lib/utils";

export type Crumb = { name: string; path: string };

/** Page title that animates in word by word with CSS only (no JS needed). */
export function HeroTitle({ text, className, as: Tag = "h1" }: { text: string; className?: string; as?: "h1" | "h2" }) {
  let index = 0;
  return (
    <Tag className={cn("split split-now", className)}>
      {parseAccent(text).map((segment, s) =>
        segment.text.split(/(\s+)/).map((word, w) => {
          if (!word) return null;
          if (/^\s+$/.test(word)) return " ";
          const i = index++;
          return (
            <span className="w" key={`${s}-${w}`}>
              <span
                className={segment.accent ? "pr-[0.06em] font-accent text-accent" : undefined}
                style={{ "--i": i } as CSSProperties}
              >
                {word}
              </span>
            </span>
          );
        }),
      )}
    </Tag>
  );
}

export function Breadcrumbs({ items, className }: { items: Crumb[]; className?: string }) {
  const all = [{ name: "Home", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb" className={cn("hero-fade", className)} style={{ "--i": 0 } as CSSProperties}>
        <ol className="flex flex-wrap items-center gap-1.5 font-mono text-[0.7rem] tracking-[0.14em] text-fog-500 uppercase">
          {all.map((c, i) => (
            <li key={c.path} className="flex items-center gap-1.5">
              {i > 0 && <ChevronRight className="size-3" aria-hidden="true" />}
              {i === all.length - 1 ? (
                <span aria-current="page" className="text-fog-300">
                  {c.name}
                </span>
              ) : (
                <Link href={c.path} className="transition-colors hover:text-fog-100">
                  {c.name}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbSchema(items)} />
    </>
  );
}

export function PageHero({
  crumbs,
  eyebrow,
  title,
  lead,
  children,
  aside,
  className,
}: {
  crumbs: Crumb[];
  eyebrow?: string;
  title: string;
  lead?: string;
  children?: ReactNode;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn("relative isolate overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-16 md:pb-24", className)}
    >
      <div aria-hidden="true" className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_55%_60%_at_85%_0%,rgba(255,90,31,0.16),transparent_70%)]" />
        <div className="absolute inset-0 bg-grid mask-radial opacity-40" />
      </div>
      <div className={cn("container-x", aside && "grid items-end gap-14 lg:grid-cols-[1.2fr_0.8fr]")}>
        <div>
          <Breadcrumbs items={crumbs} />
          {eyebrow && (
            <p className="hero-fade eyebrow mt-10" style={{ "--i": 1 } as CSSProperties}>
              {eyebrow}
            </p>
          )}
          <HeroTitle text={title} className={cn("max-w-[17ch] text-h1 font-medium", eyebrow ? "mt-6" : "mt-10")} />
          {lead && (
            <p className="hero-fade mt-8 max-w-[58ch] text-lead text-fog-300" style={{ "--i": 3 } as CSSProperties}>
              {lead}
            </p>
          )}
          {children && (
            <div className="hero-fade mt-10" style={{ "--i": 4 } as CSSProperties}>
              {children}
            </div>
          )}
        </div>
        {aside && (
          <div className="hero-fade" style={{ "--i": 4 } as CSSProperties}>
            {aside}
          </div>
        )}
      </div>
    </section>
  );
}
