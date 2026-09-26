import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Book a free strategy call with Delta Creation Co.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Free strategy call", title: "Let's map your *next move.*" });
}
