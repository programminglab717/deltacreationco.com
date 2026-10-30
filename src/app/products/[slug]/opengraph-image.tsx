import { getProduct, products } from "@/content/products";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "A product by Delta Creation Co.";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return products.map((p) => ({ slug: p.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = getProduct(slug);
  return renderOgImage({
    eyebrow: product ? `${product.name} · ${product.category}` : "Our products",
    title: product?.headline ?? "Software we build, *ship and run.*",
  });
}
