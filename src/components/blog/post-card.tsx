import Link from "next/link";
import type { CSSProperties } from "react";
import { ArrowUpRight } from "lucide-react";
import type { PostMeta } from "@/lib/blog";
import { cn, formatDate } from "@/lib/utils";

function hash(str: string) {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (Math.imul(31, h) + str.charCodeAt(i)) | 0;
  return Math.abs(h);
}

/** Deterministic abstract artwork per post, so no cover images are needed. */
export function PostArt({ slug, className }: { slug: string; className?: string }) {
  const h = hash(slug);
  const x1 = 15 + (h % 55);
  const y1 = 20 + ((h >> 3) % 50);
  const x2 = 40 + ((h >> 5) % 50);
  const y2 = 45 + ((h >> 7) % 45);
  const rot = (h >> 9) % 360;
  return (
    <div
      aria-hidden="true"
      className={cn("relative overflow-hidden bg-ink-850", className)}
      style={
        {
          backgroundImage: `radial-gradient(circle at ${x1}% ${y1}%, rgba(255,90,31,0.55), transparent 42%), radial-gradient(circle at ${x2}% ${y2}%, rgba(120,60,200,0.35), transparent 45%), conic-gradient(from ${rot}deg at 50% 50%, rgba(255,255,255,0.04), transparent 30%, rgba(255,255,255,0.05) 60%, transparent)`,
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 bg-grid opacity-60" />
      <svg viewBox="0 0 32 32" className="absolute right-5 bottom-5 size-10 text-white/25" fill="none">
        <path d="M16 3.5 29.5 27.5h-27L16 3.5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    </div>
  );
}

export function PostCard({ post, className, index = 0 }: { post: PostMeta; className?: string; index?: number }) {
  return (
    <article
      className={cn("group relative flex flex-col", className)}
      data-reveal
      style={{ "--reveal-delay": `${index * 100}ms` } as CSSProperties}
    >
      <PostArt
        slug={post.slug}
        className="aspect-[16/10] rounded-[1.5rem] transition-transform duration-700 ease-[var(--ease-out-expo)] group-hover:scale-[0.98]"
      />
      <div className="mt-6 flex items-center gap-3 font-mono text-[0.68rem] tracking-[0.14em] text-fog-500 uppercase">
        <span className="text-accent">{post.category}</span>
        <span aria-hidden="true">·</span>
        <time dateTime={post.date}>{formatDate(post.date, { month: "short" })}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readingMinutes} min read</span>
      </div>
      <h3 className="mt-3 text-xl leading-snug font-medium tracking-tight">
        <Link href={`/blog/${post.slug}`} className="after:absolute after:inset-0">
          {post.title}
        </Link>
      </h3>
      <p className="mt-3 line-clamp-2 text-fog-400">{post.description}</p>
      <span className="mt-5 inline-flex items-center gap-1.5 text-sm text-fog-200">
        Read article
        <ArrowUpRight className="size-4 transition-transform duration-500 group-hover:rotate-45" aria-hidden="true" />
      </span>
    </article>
  );
}
