import "./globals.css";
import localFont from "next/font/local";

const shams = localFont({
  src: [
    {
      path: "../../public/fonts/Shams-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/Shams-SemiBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/Shams-Bold.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-shams",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const eloquia = localFont({
  src: [
    {
      path: "../../public/fonts/EloquiaDisplay-Regular.otf",
      weight: "400",
      style: "normal",
    },
    {
      path: "../../public/fonts/EloquiaDisplay-SemiBold.otf",
      weight: "700",
      style: "normal",
    },
    {
      path: "../../public/fonts/EloquiaDisplay-Bold.otf",
      weight: "900",
      style: "normal",
    },
  ],
  variable: "--font-eloquia",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const RAW_BASE = process.env.NEXT_PUBLIC_SITE_URL?.startsWith("http")
  ? process.env.NEXT_PUBLIC_SITE_URL
  : `https://${process.env.NEXT_PUBLIC_SITE_URL || "test-iota-two.vercel.app"}`;

const BASE = new URL(RAW_BASE);
const OG = new URL("/opengraph-image.png?v=2", BASE).toString();

export async function generateMetadata() {
  const h = headers();
  const proto = h.get("x-forwarded-proto") ?? "https";
  const host = h.get("x-forwarded-host") ?? h.get("host");
  const base = `${proto}://${host}`;
  const og = `${base}/opengraph-image.png?v=3`; // bump v if needed

  return {
    metadataBase: new URL(base),
    title: {
      default: "نتائج انتخابات العراق 2025 — شمس TV",
      template: "%s — شمس TV",
    },
    description:
      "نتائج انتخابات العراق 2025 على شمس TV: عرض للأصوات والمقاعد لكل حزب.",
    openGraph: {
      type: "website",
      siteName: "شمس TV",
      locale: "ar_IQ",
      url: base, // absolute
      title: "نتائج انتخابات العراق 2025 — شمس TV",
      description:
        "نتائج انتخابات العراق 2025 على شمس TV: عرض للأصوات والمقاعد لكل حزب.",
      images: [{ url: og, width: 1200, height: 630 }], // absolute + cache-bust
    },
    twitter: {
      card: "summary_large_image",
      title: "نتائج انتخابات العراق 2025 — شمس TV",
      description:
        "نتائج انتخابات العراق 2025 على شمس TV: عرض للأصوات والمقاعد لكل حزب.",
      images: [og], // absolute + cache-bust
    },

    icons: {
      icon: [{ url: "/Logo.svg", type: "image/svg+xml" }],
      shortcut: ["/Logo.svg"],
      other: [{ rel: "mask-icon", url: "/Logo.svg", color: "#275394" }],
    },

    alternates: {
      canonical: BASE.toString(),
      languages: { "ar-IQ": "/", en: "/en" },
    },

    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
  };
}

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${shams.variable} ${eloquia.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
