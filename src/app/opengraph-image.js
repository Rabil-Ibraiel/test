// 1200×630 PNG rendered at /opengraph-image
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OG() {
  const base = process.env.NEXT_PUBLIC_SITE_URL || "https://test-iota-two.vercel.app";
  const logo = `${base}/Logo.svg`;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(180deg,#4169A5,#275394)",
          color: "white",
          fontFamily: "system-ui, Arial",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 32 }}>
          {/* Logo */}
          <img src={logo} alt="Shams TV" width={160} height={160} />
          {/* Title */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div style={{ fontSize: 56, fontWeight: 800, lineHeight: 1.1 }}>
              نتائج انتخابات العراق 2025
            </div>
            <div style={{ fontSize: 30, opacity: 0.9, marginTop: 8 }}>بث مباشر — شمس TV</div>
          </div>
        </div>

        <div style={{ fontSize: 28, opacity: 0.9, textAlign: "right" }}>
          أصوات • مقاعد • ترتيب الأحزاب
        </div>
      </div>
    ),
    size
  );
}
