import { getSolution, solutions } from "@/content/solutions";
import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Delta Creation Co. automation playbook";
export const size = ogSize;
export const contentType = ogContentType;

export function generateStaticParams() {
  return solutions.map((s) => ({ slug: s.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const solution = getSolution(slug);
  return renderOgImage({
    eyebrow: solution ? `Automation playbook · ${solution.name}` : "Automation playbooks",
    title: solution?.headline ?? "Proven workflows that *pay for themselves.*",
  });
}
