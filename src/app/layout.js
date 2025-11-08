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

const SITE =
  process.env.NEXT_PUBLIC_SITE_URL &&
  process.env.NEXT_PUBLIC_SITE_URL.startsWith("https")
    ? process.env.NEXT_PUBLIC_SITE_URL
    : `${
        process.env.NEXT_PUBLIC_SITE_URL || "https://test-iota-two.vercel.app"
      }`;

// 👇 compat alias so any leftover references keep working
const BASE = SITE;

const OG = `${SITE}/opengraph-image.png?v=5`;
const OG_IMAGE = {
  url: OG,
  width: 1200,
  height: 630,
  alt: "OG",
};

export const metadata = {
  metadataBase: new URL(SITE),
  title: {
    default: "نتائج انتخابات العراق 2025 — شمس TV",
    template: "%s — شمس TV",
  },
  description:
    "نتائج انتخابات العراق 2025 على شمس TV: عرض للأصوات والمقاعد لكل حزب.",
  applicationName: "شمس TV — الانتخابات 2025",
  themeColor: "#275394",

  openGraph: {
    type: "website",
    siteName: "شمس TV",
    locale: "ar_IQ",
    url: SITE,
    title: "نتائج انتخابات العراق 2025 — شمس TV",
    description:
      "نتائج انتخابات العراق 2025 على شمس TV: عرض للأصوات والمقاعد لكل حزب.",
    images: [OG_IMAGE],
  },
  twitter: {
    card: "summary_large_image",
    title: "نتائج انتخابات العراق 2025 — شمس TV",
    description:
      "نتائج انتخابات العراق 2025 على شمس TV: عرض للأصوات والمقاعد لكل حزب.",
    images: [OG_IMAGE],
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

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${shams.variable} ${eloquia.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
