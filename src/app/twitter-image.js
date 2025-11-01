// 1200×630 PNG rendered at /twitter-image
import { ImageResponse } from "next/og";

export const runtime = "edge";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function TwitterImage() {
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
          justifyContent: "center",
          background: "linear-gradient(180deg,#4169A5,#275394)",
          color: "white",
          padding: 64,
          fontFamily: "system-ui, Arial",
        }}
      >
        <img src={logo} alt="Shams TV" width={140} height={140} style={{ marginRight: 24 }} />
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 50, fontWeight: 800 }}>نتائج انتخابات العراق 2025</div>
          <div style={{ fontSize: 28, opacity: 0.95, marginTop: 10 }}>
            منصة مباشرة لعرض الأصوات والمقاعد — شمس TV
          </div>
        </div>
      </div>
    ),
    size
  );
}
