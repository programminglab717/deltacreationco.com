import type { CSSProperties, ReactNode } from "react";
import { SplitWords } from "@/components/motion/split-words";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  lead,
  align = "left",
  as = "h2",
  className,
  titleClassName,
  children,
  id,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
  titleClassName?: string;
  children?: ReactNode;
  id?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-6", align === "center" && "items-center text-center", className)}>
      {eyebrow && (
        <p className="eyebrow" data-reveal="fade">
          {eyebrow}
        </p>
      )}
      <SplitWords
        as={as}
        id={id}
        text={title}
        className={cn(
          as === "h1" ? "text-h1" : "text-h2",
          "max-w-[18ch] font-medium",
          align === "center" && "mx-auto",
          titleClassName,
        )}
      />
      {lead && (
        <p
          className={cn("max-w-[58ch] text-lead text-fog-300", align === "center" && "mx-auto")}
          data-reveal
          style={{ "--reveal-delay": "120ms" } as CSSProperties}
        >
          {lead}
        </p>
      )}
      {children}
    </div>
  );
}
