import type { MetadataRoute } from "next";
import { services } from "@/content/services";
import { absoluteUrl } from "@/content/site";
import { solutions } from "@/content/solutions";
import { getAllPosts } from "@/lib/blog";

const LAST_UPDATED = new Date("2026-09-26");

export default function sitemap(): MetadataRoute.Sitemap {
  const pages: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), priority: 1, changeFrequency: "weekly" },
    { url: absoluteUrl("/services"), priority: 0.9, changeFrequency: "monthly" },
    { url: absoluteUrl("/solutions"), priority: 0.8, changeFrequency: "monthly" },
    { url: absoluteUrl("/book"), priority: 0.9, changeFrequency: "monthly" },
    { url: absoluteUrl("/contact"), priority: 0.8, changeFrequency: "yearly" },
    { url: absoluteUrl("/about"), priority: 0.6, changeFrequency: "yearly" },
    { url: absoluteUrl("/blog"), priority: 0.7, changeFrequency: "weekly" },
    { url: absoluteUrl("/privacy"), priority: 0.2, changeFrequency: "yearly" },
    { url: absoluteUrl("/terms"), priority: 0.2, changeFrequency: "yearly" },
  ].map((p) => ({ ...p, lastModified: LAST_UPDATED }) as MetadataRoute.Sitemap[number]);

  return [
    ...pages,
    ...services.map((s) => ({
      url: absoluteUrl(`/services/${s.slug}`),
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.9,
    })),
    ...solutions.map((s) => ({
      url: absoluteUrl(`/solutions/${s.slug}`),
      lastModified: LAST_UPDATED,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...getAllPosts().map((p) => ({
      url: absoluteUrl(`/blog/${p.slug}`),
      lastModified: new Date(p.updated ?? p.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
