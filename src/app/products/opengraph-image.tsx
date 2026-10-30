import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Products by Delta Creation Co.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Our products", title: "Software we build, *ship and run.*" });
}
