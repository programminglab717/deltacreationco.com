import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Services by Delta Creation Co.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Services", title: "Everything you need to *build, launch and scale.*" });
}
