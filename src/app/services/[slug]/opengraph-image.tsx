import { getService, serviceCategories, services } from "@/content/services";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Delta Creation Co. service";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = getService(slug);
  return renderOgImage({
    eyebrow: service ? `${serviceCategories[service.category].label} · ${service.name}` : "Services",
    title: service?.headline ?? "Development & automation services",
  });
}
