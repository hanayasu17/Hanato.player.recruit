import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "花人-Hanato- | 教えるを仕事にする",
    template: "%s | 花人-Hanato-",
  },
  description:
    "花人（Hanato）は「教えるを仕事にする」をテーマに、健康・情報・希望・創造の4つの分野で活動する人を応援するプラットフォームです。",
  metadataBase: new URL("https://hanato.jp"),
  openGraph: {
    type: "website",
    locale: "ja_JP",
    url: "https://hanato.jp",
    siteName: "花人-Hanato-",
    title: "花人-Hanato- | 教えるを仕事にする",
    description:
      "花人（Hanato）は「教えるを仕事にする」をテーマに、健康・情報・希望・創造の4つの分野で活動する人を応援するプラットフォームです。",
  },
  twitter: {
    card: "summary_large_image",
    title: "花人-Hanato- | 教えるを仕事にする",
    description:
      "花人（Hanato）は「教えるを仕事にする」をテーマに活動する人を応援するプラットフォームです。",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Serif+JP:wght@400;500;600;700&family=Zen+Kaku+Gothic+New:wght@400;500;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <GoogleAnalytics />
        <Header />
        <main className="pt-[72px]">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
