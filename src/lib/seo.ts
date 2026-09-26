import type { Metadata } from "next";
import { absoluteUrl, site } from "@/content/site";

type PageMetaInput = {
  title: string;
  description: string;
  path: string;
  /** Use the title as-is instead of appending the site name. */
  absoluteTitle?: boolean;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  keywords?: string[];
  noIndex?: boolean;
};

/**
 * Complete, page-specific metadata: canonical URL, Open Graph and Twitter
 * cards. Every page calls this so nothing is accidentally inherited.
 */
export function pageMetadata({
  title,
  description,
  path,
  absoluteTitle,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  keywords,
  noIndex,
}: PageMetaInput): Metadata {
  const fullTitle = absoluteTitle ? title : `${title} | ${site.name}`;
  const images = image ? [{ url: image, width: 1200, height: 630, alt: fullTitle }] : undefined;

  return {
    title: absoluteTitle ? { absolute: title } : title,
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: {
      type,
      url: path,
      title: fullTitle,
      description,
      siteName: site.name,
      locale: site.locale,
      ...(images && { images }),
      ...(type === "article" && { publishedTime, modifiedTime, authors: [site.name] }),
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      ...(images && { images: images.map((i) => i.url) }),
    },
    ...(noIndex && { robots: { index: false, follow: true } }),
  };
}

const ORG_ID = `${site.url}/#organization`;
const WEBSITE_ID = `${site.url}/#website`;

export function organizationSchema() {
  const sameAs = Object.values(site.socials).filter(Boolean);
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": ORG_ID,
    name: site.name,
    legalName: site.legalName,
    url: site.url,
    logo: absoluteUrl("/apple-icon"),
    image: absoluteUrl("/opengraph-image"),
    description: site.description,
    email: site.email,
    slogan: site.tagline,
    knowsAbout: [
      "Web development",
      "Next.js",
      "Web application development",
      "SaaS development",
      "Business process automation",
      "Workflow automation",
      "AI agents",
      "API integrations",
      "Technical SEO",
    ],
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: site.email,
        availableLanguage: ["English"],
        url: absoluteUrl("/contact"),
      },
    ],
    ...(sameAs.length > 0 && { sameAs }),
  };
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": WEBSITE_ID,
    name: site.name,
    url: site.url,
    description: site.description,
    publisher: { "@id": ORG_ID },
    inLanguage: "en",
  };
}

export function breadcrumbSchema(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...items].map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

export function faqSchema(faqs: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };
}

export function serviceSchema({
  name,
  description,
  path,
  serviceType,
  offers,
}: {
  name: string;
  description: string;
  path: string;
  serviceType: string;
  offers?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    serviceType,
    url: absoluteUrl(path),
    provider: { "@id": ORG_ID, "@type": "Organization", name: site.name, url: site.url },
    areaServed: "Worldwide",
    ...(offers?.length && {
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: `${name} deliverables`,
        itemListElement: offers.map((o) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: o },
        })),
      },
    }),
  };
}

export function articleSchema({
  title,
  description,
  path,
  published,
  modified,
  image,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  published: string;
  modified?: string;
  image: string;
  keywords?: string[];
}) {
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: title,
    description,
    image: absoluteUrl(image),
    datePublished: published,
    dateModified: modified ?? published,
    author: { "@type": "Organization", name: site.name, url: site.url },
    publisher: { "@id": ORG_ID, "@type": "Organization", name: site.name, logo: absoluteUrl("/apple-icon") },
    mainEntityOfPage: { "@type": "WebPage", "@id": absoluteUrl(path) },
    url: absoluteUrl(path),
    inLanguage: "en",
    ...(keywords?.length && { keywords: keywords.join(", ") }),
  };
}
