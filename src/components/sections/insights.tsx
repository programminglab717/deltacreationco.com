import { PostCard } from "@/components/blog/post-card";
import { ButtonLink } from "@/components/ui/button";
import { SectionHeading } from "@/components/ui/section-heading";
import { getAllPosts } from "@/lib/blog";

export function Insights() {
  const posts = getAllPosts().slice(0, 3);
  if (posts.length === 0) return null;

  return (
    <section className="section-y" aria-labelledby="insights-heading">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            id="insights-heading"
            eyebrow="Insights"
            title="Ideas you can *use this week.*"
            titleClassName="max-w-[14ch]"
          />
          <div data-reveal>
            <ButtonLink href="/blog" variant="ghost">
              All articles
            </ButtonLink>
          </div>
        </div>
        <div className="mt-14 grid gap-x-6 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, i) => (
            <PostCard key={post.slug} post={post} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
