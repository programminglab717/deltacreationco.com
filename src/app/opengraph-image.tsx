import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Delta Creation Co.: web development and automation studio";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "Development & Automation Studio",
    title: "Websites that convert. Systems that *run themselves.*",
  });
}
