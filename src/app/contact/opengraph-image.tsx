import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const dynamic = "force-static";

export const alt = "Contact Delta Creation Co.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Contact", title: "Tell us what you're *building.*" });
}
