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

export const metadata = {
  title: "نتائج انتخابات العراق 2025 — شمس TV",
  description:
    "نتائج انتخابات العراق 2025 على شمس TV: عرض منظم للأصوات والمقاعد لكل حزب بواجهة واضحة وسهلة القراءة.",
  metadataBase: new URL("https://test-iota-two.vercel.app"),
  openGraph: {
    title: "نتائج انتخابات العراق 2025 — شمس TV",
    description:
      "منصة تعرض نتائج انتخابات العراق 2025: أصوات ومقاعد كل حزب بواجهة بسيطة تسهّل متابعة الأرقام.",
    url: "https://test-iota-two.vercel.app",
    siteName: "شمس TV",
    locale: "ar_IQ",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "نتائج انتخابات العراق 2025 — شمس TV",
    description: "عرض واضح لنتائج الانتخابات: أصوات ومقاعد كل حزب.",
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
