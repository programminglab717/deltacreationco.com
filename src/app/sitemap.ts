import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { pageUrl } from "@/content/site";
import { solutions } from "@/content/solutions";
import { getAllPosts } from "@/lib/blog";

const LAST_UPDATED = new Date("2026-09-26");

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: pageUrl("/"), priority: 1, changeFrequency: "weekly" },
    { url: pageUrl("/services"), priority: 0.9, changeFrequency: "monthly" },
    { url: pageUrl("/solutions"), priority: 0.8, changeFrequency: "monthly" },
    { url: pageUrl("/book"), priority: 0.9, changeFrequency: "monthly" },
    { url: pageUrl("/contact"), priority: 0.8, changeFrequency: "yearly" },
    { url: pageUrl("/about"), priority: 0.6, changeFrequency: "yearly" },
    { url: pageUrl("/blog"), priority: 0.7, changeFrequency: "weekly" },
    { url: pageUrl("/privacy"), priority: 0.2, changeFrequency: "yearly" },
    { url: pageUrl("/terms"), priority: 0.2, changeFrequency: "yearly" },
  ].map((p) => ({ ...p, lastModified: LAST_UPDATED }) as MetadataRoute.Sitemap[number]);

  return [
    ...pages,
    ...services.map((s) => ({
      url: pageUrl(`/services/${s.slug}`),
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...solutions.map((s) => ({
      url: pageUrl(`/solutions/${s.slug}`),
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...getAllPosts().map((p) => ({
      url: pageUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.updated ?? p.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
