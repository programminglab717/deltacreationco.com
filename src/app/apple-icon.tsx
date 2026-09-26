import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#060607",
      }}
    >
      <svg width="120" height="120" viewBox="0 0 32 32" fill="none">
        <path d="M16 3.5 29.5 27.5h-27L16 3.5Z" stroke="#efeff2" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M16 14.2 21.6 24h-11.2L16 14.2Z" fill="#ff5a1f" />
      </svg>
    </div>,
    size,
  );
}
