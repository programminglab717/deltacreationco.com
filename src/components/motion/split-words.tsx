import type { CSSProperties, ElementType } from "react";
import { cn, parseAccent } from "@/lib/utils";

/**
 * Renders text as individually masked words that rise into place when the
 * element scrolls into view. `*word*` renders in the italic serif accent.
 * Works in Server Components; the reveal is driven by RevealObserver.
 */
export function SplitWords({
  text,
  as: Tag = "span",
  className,
  accentClassName,
  delay = 0,
  id,
}: {
  text: string;
  as?: ElementType;
  className?: string;
  accentClassName?: string;
  delay?: number;
  id?: string;
}) {
  let index = 0;
  const segments = parseAccent(text);

  return (
    <Tag
      id={id}
      className={cn("split", className)}
      data-reveal="words"
      style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}
    >
      {segments.map((segment, s) =>
        segment.text.split(/(\s+)/).map((word, w) => {
          if (!word) return null;
          if (/^\s+$/.test(word)) return " ";
          const i = index++;
          return (
            <span className="w" key={`${s}-${w}`}>
              <span
                className={segment.accent ? cn("pr-[0.06em] font-accent", accentClassName) : undefined}
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
