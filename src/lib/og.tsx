import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";
import { site } from "@/content/site";
import { parseAccent } from "@/lib/utils";

export const ogSize = { width: 1200, height: 630 };
export const ogContentType = "image/png";

const fontsDir = join(process.cwd(), "src/assets/fonts");
const fonts = Promise.all([
  readFile(join(fontsDir, "Geist-Medium.ttf")),
  readFile(join(fontsDir, "InstrumentSerif-Italic.woff")),
]);

/** Branded 1200×630 social card. `*text*` in the title renders in the accent serif. */
export async function renderOgImage({ eyebrow, title }: { eyebrow: string; title: string }) {
  const [geist, serif] = await fonts;
  const long = title.replace(/\*/g, "").length > 60;

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        background: "#060607",
        color: "#efeff2",
        padding: "64px 72px",
        fontFamily: "Geist",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: -260,
          right: -200,
          width: 760,
          height: 760,
          borderRadius: 9999,
          background: "radial-gradient(circle, rgba(255,90,31,0.55) 0%, rgba(255,90,31,0.12) 45%, rgba(6,6,7,0) 70%)",
          display: "flex",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: -320,
          right: 140,
          width: 620,
          height: 620,
          borderRadius: 9999,
          background: "radial-gradient(circle, rgba(120,50,160,0.35) 0%, rgba(6,6,7,0) 70%)",
          display: "flex",
        }}
      />

      <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
        <svg width="46" height="46" viewBox="0 0 32 32" fill="none">
          <path d="M16 3.5 29.5 27.5h-27L16 3.5Z" stroke="#efeff2" strokeWidth="2.6" strokeLinejoin="round" />
          <path d="M16 14.2 21.6 24h-11.2L16 14.2Z" fill="#ff5a1f" />
        </svg>
        <span style={{ fontSize: 30, letterSpacing: -1 }}>
          Delta <span style={{ color: "#a8a8b2", marginLeft: 8 }}>Creation Co.</span>
        </span>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 26 }}>
        <span style={{ fontSize: 22, letterSpacing: 5, textTransform: "uppercase", color: "#ff7a45" }}>{eyebrow}</span>
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            fontSize: long ? 60 : 74,
            lineHeight: 1.05,
            letterSpacing: -2.5,
            maxWidth: 1000,
          }}
        >
          {parseAccent(title).map((seg, i) => (
            <span
              key={i}
              style={
                seg.accent
                  ? { fontFamily: "Instrument Serif", color: "#ff5a1f", letterSpacing: -1, whiteSpace: "pre" }
                  : { whiteSpace: "pre" }
              }
            >
              {seg.text}
            </span>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, color: "#82828d" }}>
        <span>{site.url.replace(/^https?:\/\//, "")}</span>
        <span>Web Development · Automation · AI</span>
      </div>
    </div>,
    {
      ...ogSize,
      fonts: [
        { name: "Geist", data: geist, style: "normal", weight: 500 },
        { name: "Instrument Serif", data: serif, style: "italic", weight: 400 },
      ],
    },
  );
}
