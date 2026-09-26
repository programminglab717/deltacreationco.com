import { absoluteUrl, site } from "@/content/site";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

function xml(value: string) {
  return value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

export function GET() {
  const posts = getAllPosts();
  const items = posts
    .map(
      (p) => `
    <item>
      <title>${xml(p.title)}</title>
      <link>${absoluteUrl(`/blog/${p.slug}`)}</link>
      <guid isPermaLink="true">${absoluteUrl(`/blog/${p.slug}`)}</guid>
      <description>${xml(p.description)}</description>
      <category>${xml(p.category)}</category>
      <pubDate>${new Date(`${p.date}T12:00:00Z`).toUTCString()}</pubDate>
    </item>`,
    )
    .join("");

  const body = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${xml(`${site.name} Insights`)}</title>
    <link>${absoluteUrl("/blog")}</link>
    <description>${xml("Practical guides on web development, business automation and AI.")}</description>
    <language>en</language>
    <atom:link href="${absoluteUrl("/blog/rss.xml")}" rel="self" type="application/rss+xml" />${items}
  </channel>
</rss>`;

  return new Response(body, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}
