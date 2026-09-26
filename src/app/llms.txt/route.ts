import { services } from "@/content/services";
import { absoluteUrl, site } from "@/content/site";
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
    `Contact: ${site.email} · Book a free 30-minute strategy call: ${absoluteUrl("/book")}`,
    "",
    "## Services",
    ...services.map((s) => `- [${s.name}](${absoluteUrl(`/services/${s.slug}`)}): ${s.short}`),
    "",
    "## Automation solutions",
    ...solutions.map((s) => `- [${s.name}](${absoluteUrl(`/solutions/${s.slug}`)}): ${s.short}`),
    "",
    "## Insights",
    ...getAllPosts().map((p) => `- [${p.title}](${absoluteUrl(`/blog/${p.slug}`)}): ${p.description}`),
    "",
    "## Company",
    `- [About](${absoluteUrl("/about")})`,
    `- [Contact](${absoluteUrl("/contact")})`,
    `- [Privacy policy](${absoluteUrl("/privacy")})`,
    "",
  ];
  return new Response(lines.join("\n"), { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
