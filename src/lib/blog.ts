import "server-only";

import fs from "node:fs";
import path from "node:path";
import { cache } from "react";
import matter from "gray-matter";
import rehypeAutolinkHeadings from "rehype-autolink-headings";
import rehypeSlug from "rehype-slug";
import rehypeStringify from "rehype-stringify";
import remarkGfm from "remark-gfm";
import remarkParse from "remark-parse";
import remarkRehype from "remark-rehype";
import { unified } from "unified";

const POSTS_DIR = path.join(process.cwd(), "content/blog");

export type PostMeta = {
  slug: string;
  title: string;
  /** Shorter title for search results, if the headline is long. */
  seoTitle?: string;
  description: string;
  date: string;
  updated?: string;
  category: string;
  tags: string[];
  readingMinutes: number;
  relatedServices: string[];
};

export type Heading = { id: string; text: string; depth: 2 | 3 };

export type Post = PostMeta & { html: string; headings: Heading[] };

function readingMinutes(text: string) {
  const words = text.trim().split(/\s+/).length;
  return Math.max(1, Math.round(words / 230));
}

function toMeta(slug: string, data: Record<string, unknown>, content: string): PostMeta {
  const date = data.date instanceof Date ? data.date.toISOString().slice(0, 10) : String(data.date);
  const updated =
    data.updated instanceof Date
      ? data.updated.toISOString().slice(0, 10)
      : data.updated
        ? String(data.updated)
        : undefined;
  return {
    slug,
    title: String(data.title),
    seoTitle: data.seoTitle ? String(data.seoTitle) : undefined,
    description: String(data.description),
    date,
    updated,
    category: String(data.category ?? "Insights"),
    tags: Array.isArray(data.tags) ? data.tags.map(String) : [],
    readingMinutes: readingMinutes(content),
    relatedServices: Array.isArray(data.relatedServices) ? data.relatedServices.map(String) : [],
  };
}

export const getAllPosts = cache((): PostMeta[] => {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs
    .readdirSync(POSTS_DIR)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const slug = file.replace(/\.md$/, "");
      const { data, content } = matter(fs.readFileSync(path.join(POSTS_DIR, file), "utf8"));
      return toMeta(slug, data, content);
    })
    .sort((a, b) => (a.date < b.date ? 1 : -1));
});

type HastNode = {
  type: string;
  tagName?: string;
  value?: string;
  properties?: Record<string, unknown>;
  children?: HastNode[];
};

function textOf(node: HastNode): string {
  if (node.type === "text") return node.value ?? "";
  return (node.children ?? []).map(textOf).join("");
}

/** Collects h2/h3 ids (after rehype-slug) for the table of contents. */
function rehypeCollectHeadings(out: Heading[]) {
  return () => (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (node.type === "element" && (node.tagName === "h2" || node.tagName === "h3")) {
        const id = node.properties?.id;
        if (typeof id === "string") out.push({ id, text: textOf(node), depth: node.tagName === "h2" ? 2 : 3 });
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

/** Makes external links open safely in a new tab. */
function rehypeExternalLinks() {
  return (tree: HastNode) => {
    const walk = (node: HastNode) => {
      if (node.type === "element" && node.tagName === "a") {
        const href = String(node.properties?.href ?? "");
        if (/^https?:\/\//.test(href)) {
          node.properties = { ...node.properties, target: "_blank", rel: ["noopener", "noreferrer"] };
        }
      }
      node.children?.forEach(walk);
    };
    walk(tree);
  };
}

export const getPost = cache(async (slug: string): Promise<Post | null> => {
  const file = path.join(POSTS_DIR, `${slug}.md`);
  if (!/^[a-z0-9-]+$/.test(slug) || !fs.existsSync(file)) return null;
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  const headings: Heading[] = [];
  const html = String(
    await unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkRehype)
      .use(rehypeSlug)
      .use(rehypeCollectHeadings(headings))
      .use(rehypeAutolinkHeadings, { behavior: "wrap" })
      .use(rehypeExternalLinks)
      .use(rehypeStringify)
      .process(content),
  );
  return { ...toMeta(slug, data, content), html, headings };
});
