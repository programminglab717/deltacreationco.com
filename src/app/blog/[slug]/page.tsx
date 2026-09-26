import type { CSSProperties } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { PostArt, PostCard } from "@/components/blog/post-card";
import { Toc } from "@/components/blog/toc";
import { PageTransition } from "@/components/layout/page-transition";
import { JsonLd } from "@/components/seo/json-ld";
import { ButtonLink } from "@/components/ui/button";
import { Breadcrumbs, HeroTitle } from "@/components/ui/page-hero";
import { getService } from "@/content/services";
import { absoluteUrl } from "@/content/site";
import { getAllPosts, getPost } from "@/lib/blog";
import { articleSchema, pageMetadata } from "@/lib/seo";
import { formatDate } from "@/lib/utils";

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/blog/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return {};
  const seoTitle = post.seoTitle ?? post.title;
  return pageMetadata({
    title: seoTitle,
    absoluteTitle: seoTitle.length > 50,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article",
    publishedTime: post.date,
    modifiedTime: post.updated ?? post.date,
    keywords: post.tags,
  });
}

export default async function PostPage({ params }: PageProps<"/blog/[slug]">) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const related = getAllPosts()
    .filter((p) => p.slug !== post.slug)
    .slice(0, 2);
  const services = post.relatedServices.map(getService).filter((s) => s !== undefined);
  const shareUrl = encodeURIComponent(absoluteUrl(`/blog/${post.slug}`));
  const shareText = encodeURIComponent(post.title);

  return (
    <PageTransition>
      <article>
        <header className="relative isolate overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-14">
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_55%_60%_at_85%_0%,rgba(255,90,31,0.14),transparent_70%)]"
          />
          <div className="container-narrow">
            <Breadcrumbs
              items={[
                { name: "Insights", path: "/blog" },
                { name: post.title, path: `/blog/${post.slug}` },
              ]}
            />
            <p
              className="hero-fade mt-10 font-mono text-[0.7rem] tracking-[0.14em] text-fog-500 uppercase"
              style={{ "--i": 1 } as CSSProperties}
            >
              <span className="text-accent">{post.category}</span> ·{" "}
              <time dateTime={post.date}>{formatDate(post.date)}</time> · {post.readingMinutes} min read
            </p>
            <HeroTitle
              text={post.title}
              className="mt-5 text-[clamp(2.2rem,4.6vw,4rem)] leading-[1.05] font-medium tracking-[-0.04em]"
            />
            <p className="hero-fade mt-7 text-lead text-fog-300" style={{ "--i": 3 } as CSSProperties}>
              {post.description}
            </p>
          </div>
          <div className="container-x mt-14">
            <PostArt slug={post.slug} className="hero-fade aspect-[21/8] rounded-[2rem]" />
          </div>
        </header>

        <div className="container-x grid gap-12 pb-24 lg:grid-cols-[14rem_minmax(0,1fr)_14rem] lg:gap-16">
          <aside className="hidden lg:block">
            <div className="sticky top-[calc(var(--header-h)+2rem)]">
              {post.headings.length > 0 && <Toc headings={post.headings} />}
            </div>
          </aside>

          <div className="mx-auto w-full max-w-[44rem]">
            <div className="prose-delta" dangerouslySetInnerHTML={{ __html: post.html }} />

            <div className="mt-16 flex flex-wrap items-center gap-3 border-t border-white/10 pt-8 text-sm text-fog-400">
              <span>Share:</span>
              <a
                href={`https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 px-3.5 py-1.5 hover:border-white/30 hover:text-fog-100"
              >
                LinkedIn
              </a>
              <a
                href={`https://x.com/intent/post?url=${shareUrl}&text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/10 px-3.5 py-1.5 hover:border-white/30 hover:text-fog-100"
              >
                X
              </a>
              <a
                href={`mailto:?subject=${shareText}&body=${shareUrl}`}
                className="rounded-full border border-white/10 px-3.5 py-1.5 hover:border-white/30 hover:text-fog-100"
              >
                Email
              </a>
            </div>

            <div className="mt-12 overflow-hidden rounded-[2rem] bg-accent p-8 text-ink-950 sm:p-10">
              <p className="font-mono text-xs tracking-[0.16em] text-ink-950/85 uppercase">Want this done for you?</p>
              <p className="mt-4 text-h3 font-medium">
                Book a free 30-minute strategy call and we&apos;ll show you exactly where to start.
              </p>
              <div className="mt-7 flex flex-wrap gap-3">
                <ButtonLink href="/book" variant="dark" icon>
                  Book a free call
                </ButtonLink>
                {services[0] && (
                  <ButtonLink href={`/services/${services[0].slug}`} variant="outline-dark">
                    {`Explore ${services[0].name}`}
                  </ButtonLink>
                )}
              </div>
            </div>
          </div>

          <aside className="hidden lg:block">
            {services.length > 0 && (
              <div className="sticky top-[calc(var(--header-h)+2rem)]">
                <p className="eyebrow eyebrow-plain mb-5">Related services</p>
                <ul className="space-y-2">
                  {services.map((s) => (
                    <li key={s.slug}>
                      <Link
                        href={`/services/${s.slug}`}
                        className="group flex items-center justify-between gap-2 rounded-xl border border-white/10 px-4 py-3 text-sm text-fog-300 transition-colors hover:border-accent/50 hover:text-fog-100"
                      >
                        {s.name}
                        <ArrowUpRight
                          className="size-4 shrink-0 transition-transform duration-500 group-hover:rotate-45"
                          aria-hidden="true"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </article>

      {related.length > 0 && (
        <section className="border-t border-white/[0.06] section-y" aria-labelledby="related-heading">
          <div className="container-x">
            <h2 id="related-heading" className="text-h2 font-medium">
              Keep <span className="font-accent">reading</span>
            </h2>
            <div className="mt-12 grid gap-x-6 gap-y-12 md:grid-cols-2">
              {related.map((p, i) => (
                <PostCard key={p.slug} post={p} index={i} />
              ))}
            </div>
          </div>
        </section>
      )}

      <JsonLd
        data={articleSchema({
          title: post.title,
          description: post.description,
          path: `/blog/${post.slug}`,
          published: post.date,
          modified: post.updated,
          image: `/blog/${post.slug}/opengraph-image`,
          keywords: post.tags,
        })}
      />
    </PageTransition>
  );
}
