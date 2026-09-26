import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { PostArt, PostCard } from "@/components/blog/post-card";
import { PageTransition } from "@/components/layout/page-transition";
import { CtaBooking } from "@/components/sections/cta-booking";
import { PageHero } from "@/components/ui/page-hero";
import { getAllPosts } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Insights on Web Development, Automation & AI",
  description:
    "Practical guides on high-converting websites, business process automation, AI agents and choosing the right tools, from the team at Delta Creation Co.",
  path: "/blog",
});

export default function BlogPage() {
  const [featured, ...rest] = getAllPosts();

  return (
    <PageTransition>
      <PageHero
        crumbs={[{ name: "Insights", path: "/blog" }]}
        eyebrow="Insights"
        title="Practical ideas for *faster, leaner growth.*"
        lead="Guides on building websites that convert, automating the busywork and using AI where it actually pays off. No fluff, just what works."
      />

      {featured && (
        <section className="pb-20" aria-label="Featured article">
          <div className="container-x">
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid overflow-hidden rounded-[2rem] border border-white/[0.08] bg-ink-900 transition-colors duration-500 hover:border-accent/40 lg:grid-cols-2"
              data-reveal
            >
              <PostArt
                slug={featured.slug}
                className="min-h-64 transition-transform duration-700 group-hover:scale-[1.02] lg:min-h-[26rem]"
              />
              <div className="flex flex-col justify-between gap-10 p-8 sm:p-12">
                <div>
                  <p className="font-mono text-[0.68rem] tracking-[0.14em] text-fog-500 uppercase">
                    <span className="text-accent">Featured · {featured.category}</span> ·{" "}
                    <time dateTime={featured.date}>{formatDate(featured.date)}</time> · {featured.readingMinutes} min
                    read
                  </p>
                  <h2 className="mt-5 text-h2 font-medium">{featured.title}</h2>
                  <p className="mt-5 max-w-lg text-fog-400">{featured.description}</p>
                </div>
                <span className="inline-flex items-center gap-2 font-medium">
                  Read the article
                  <ArrowUpRight
                    className="size-5 transition-transform duration-500 group-hover:rotate-45"
                    aria-hidden="true"
                  />
                </span>
              </div>
            </Link>
          </div>
        </section>
      )}

      {rest.length > 0 && (
        <section className="pb-28" aria-label="All articles">
          <div className="container-x grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {rest.map((post, i) => (
              <PostCard key={post.slug} post={post} index={i % 3} />
            ))}
          </div>
        </section>
      )}

      <CtaBooking title="Rather talk it through? *Let's chat.*" />
    </PageTransition>
  );
}
