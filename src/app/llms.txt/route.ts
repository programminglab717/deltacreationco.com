import { productDeliveryLabel, products } from "@/content/products";
import { services } from "@/content/services";
import { pageUrl, site } from "@/content/site";
import { solutions } from "@/content/solutions";
import { getAllPosts } from "@/lib/blog";

export const dynamic = "force-static";

/** A plain-text site summary for AI assistants and answer engines (llmstxt.org). */
export function GET() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.description}`,
    "",
    `Contact: ${site.email} · Book a free 30-minute strategy call: ${pageUrl("/book")}`,
    "",
    "## Services",
    ...services.map((s) => `- [${s.name}](${pageUrl(`/services/${s.slug}`)}): ${s.short}`),
    "",
    "## Automation solutions",
    ...solutions.map((s) => `- [${s.name}](${pageUrl(`/solutions/${s.slug}`)}): ${s.short}`),
    "",
    "## Products",
    ...products.map(
      (p) => `- [${p.name}](${pageUrl(`/products/${p.slug}`)}): ${p.summary} (${productDeliveryLabel(p)})`,
    ),
    "",
    "## Insights",
    ...getAllPosts().map((p) => `- [${p.title}](${pageUrl(`/blog/${p.slug}`)}): ${p.description}`),
    "",
    "## Company",
    `- [About](${pageUrl("/about")})`,
    `- [Contact](${pageUrl("/contact")})`,
    `- [Privacy policy](${pageUrl("/privacy")})`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
