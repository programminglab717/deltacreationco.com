import { ogContentType, ogSize, renderOgImage } from "@/lib/og";

export const alt = "Automation solutions by Delta Creation Co.";
export const size = ogSize;
export const contentType = ogContentType;

export default function Image() {
  return renderOgImage({ eyebrow: "Automation playbooks", title: "Proven workflows that *pay for themselves.*" });
}
