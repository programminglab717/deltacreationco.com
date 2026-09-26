import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "About Delta Creation Co.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({
    eyebrow: "About",
    title: "We build the systems that let businesses *grow without the grind.*",
  });
}
