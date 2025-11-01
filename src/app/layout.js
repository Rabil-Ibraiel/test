import "./globals.css";
import localFont from "next/font/local";

const shams = localFont({
  src: [
    { path: "../../public/fonts/Shams-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/Shams-SemiBold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/Shams-Bold.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-shams",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

const eloquia = localFont({
  src: [
    { path: "../../public/fonts/EloquiaDisplay-Regular.otf", weight: "400", style: "normal" },
    { path: "../../public/fonts/EloquiaDisplay-SemiBold.otf", weight: "700", style: "normal" },
    { path: "../../public/fonts/EloquiaDisplay-Bold.otf", weight: "900", style: "normal" },
  ],
  variable: "--font-eloquia",
  display: "swap",
  fallback: ["Arial", "sans-serif"],
});

export const metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://test-iota-two.vercel.app"),
  title: {
    default: "نتائج انتخابات العراق 2025 — شمس TV",
    template: "%s — شمس TV",
  },
  description:
    "نتائج انتخابات العراق 2025 على شمس TV: عرض منظم للأصوات والمقاعد لكل حزب بواجهة واضحة وسهلة القراءة.",
  applicationName: "شمس TV — الانتخابات 2025",
  themeColor: "#275394",

  // ✅ Social previews
  openGraph: {
    type: "website",
    siteName: "شمس TV",
    locale: "ar_IQ",
    url: "/",
    title: "نتائج انتخابات العراق 2025 — شمس TV",
    description:
      "منصة تعرض نتائج انتخابات العراق 2025: أصوات ومقاعد كل حزب بواجهة بسيطة تسهّل متابعة الأرقام.",
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "نتائج الانتخابات — شمس TV" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "نتائج انتخابات العراق 2025 — شمس TV",
    description: "عرض واضح لنتائج الانتخابات: أصوات ومقاعد كل حزب.",
    images: ["/twitter-image"],
  },

  // ✅ Use Logo.svg as favicon (+ optional fallbacks)
  icons: {
    icon: [
      { url: "/Logo.svg", type: "image/svg+xml" },           // modern browsers
      { url: "/favicon.ico" },                               // fallback if you have it
    ],
    shortcut: ["/Logo.svg"],
    // Optional: pinned tab for Safari (uses the SVG path color)
    other: [{ rel: "mask-icon", url: "/Logo.svg", color: "#275394" }],
    // Optional (recommended): add apple touch icon PNG if you export one
    // apple: [{ url: "/apple-touch-icon.png", sizes: "180x180" }],
  },

  alternates: {
    canonical: "/",
    languages: { "ar-IQ": "/", en: "/en" },
  },

  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${shams.variable} ${eloquia.variable} antialiased`}>{children}</body>
    </html>
  );
}
