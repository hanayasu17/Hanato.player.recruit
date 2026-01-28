import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "花人 Studio",
  referrer: "same-origin",
  robots: "noindex",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ja">
      <body style={{ margin: 0 }}>{children}</body>
    </html>
  );
}
