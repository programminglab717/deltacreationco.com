import { getAllPosts } from "@/lib/blog";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Delta Creation Co. article";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = getAllPosts().find((p) => p.slug === slug);
  return renderOgImage({
    eyebrow: post ? `Insights · ${post.category} · ${post.readingMinutes} min read` : "Insights",
    title: post?.title ?? "Insights from Delta Creation Co.",
  });
}
