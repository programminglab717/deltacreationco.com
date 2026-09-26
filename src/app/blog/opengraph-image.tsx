import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Insights from Delta Creation Co.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Insights", title: "Practical ideas for *faster, leaner growth.*" });
}
